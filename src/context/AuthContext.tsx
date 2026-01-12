import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import type { LoginCredentials, User } from "@/types";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (credentials: LoginCredentials) => Promise<void>;
	register: (data: any) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null);

	const [isLoading, setIsLoading] = useState(true);

	const logout = useCallback(async () => {
		try {
			await authService.logout();
		} catch (error) {
			console.error("Logout failed", error);
		}
		setUser(null);
		navigate("/login");
	}, [navigate]);

	useEffect(() => {
		const initAuth = async () => {
			try {
				const userData = await authService.me();
				setUser(userData);
			} catch (error) {
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		initAuth();
	}, []);

	const login = async (credentials: LoginCredentials) => {
		await authService.login(credentials);
		const user = await authService.me();
		setUser(user);
	};

	const register = async (data: any) => {
		await authService.register(data);
		// Optionally login automatically or redirect to login
	};

	// const logout = () => {
	//   localStorage.removeItem('token');
	//   setToken(null);
	//   setUser(null);
	// };

	const value = {
		user,
		isAuthenticated: !!user,
		isLoading,
		login,
		register,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
