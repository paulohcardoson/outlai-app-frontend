import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AddExpensePage } from "./pages/AddExpenses";
import { Dashboard } from "./pages/Dashboard";
import { ExpenseList } from "./pages/ExpensesList";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { ResendVerification } from "./pages/Auth/ResendVerification";
import { RequestPasswordReset } from "./pages/Auth/RequestPasswordReset";
import { ResetPassword } from "./pages/Auth/ResetPassword";
import { AuthProvider } from "./context/AuthContext";
import { ExpensesProvider } from "./context/ExpensesContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "sonner";

function AppContent() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/resend-verification" element={<ResendVerification />} />
			<Route path="/request-password-reset" element={<RequestPasswordReset />} />
			<Route path="/reset-password" element={<ResetPassword />} />
			<Route element={<ProtectedRoute />}>
				<Route
					path="*"
					element={
						<ExpensesProvider>
							<Layout>
								<Routes>
									<Route path="/" element={<Dashboard />} />
									<Route path="/add" element={<AddExpensePage />} />
									<Route path="/list" element={<ExpenseList />} />
								</Routes>
							</Layout>
						</ExpensesProvider>
					}
				/>
			</Route>
		</Routes>
	);
}

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<AppContent />
				<Toaster />
			</AuthProvider>
		</BrowserRouter>
	);
}


export default App;

