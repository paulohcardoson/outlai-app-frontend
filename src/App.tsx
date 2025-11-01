import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./pages/Home";
import "./style.css";
import { Header } from "./components/app/Header";
import { ExpensesPage } from "./pages/Expenses";
import { AddExpensePage } from "./pages/AddExpense";
import { NavBar } from "./components/app/NavBar";

function App() {
	return (
		<BrowserRouter>
			<main className="font-poppins">
				<Header />

				<main className="flex flex-col gap-3 p-default min-h-full pb-20">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/expenses" element={<ExpensesPage />} />
						<Route path="/add" element={<AddExpensePage />} />
					</Routes>

					<NavBar />
				</main>
			</main>
		</BrowserRouter>
	);
}

export default App;
