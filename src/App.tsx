import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./pages/Home";
import "./style.css";
import { Header } from "./components/app/Header";
import { ExpensesPage } from "./pages/Expenses";
import { AddExpensePage } from "./pages/AddExpense";
import { NavBar } from "./components/app/NavBar";

function App() {
	return (
		<main className="min-h-screen flex flex-col">
			<Header />

			<div className="flex flex-1 items-stretch">
				<BrowserRouter>
					<NavBar />

					<main className="flex-1 flex flex-col gap-3 p-default min-h-full">
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/expenses" element={<ExpensesPage />} />
							<Route path="/add" element={<AddExpensePage />} />
						</Routes>
					</main>
				</BrowserRouter>
			</div>
		</main>
	);
}

export default App;
