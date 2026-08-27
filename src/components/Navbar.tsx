import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/dashboard"
          className="text-xl font-bold text-indigo-600"
        >
          ExpenseTracker
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/expenses"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600"
          >
            Expenses
          </Link>

          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}