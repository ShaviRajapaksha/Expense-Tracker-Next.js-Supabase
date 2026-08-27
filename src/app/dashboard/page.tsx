import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: expenses, error } = await supabase
    .from("expenses")
    .select(`
      id,
      title,
      amount,
      expense_date,
      category:categories(name)
    `)
    .order("expense_date", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const total = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount),
    0
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTotal = expenses
    .filter((expense) => {
      const date = new Date(expense.expense_date);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div>
          <h1 className="text-3xl text-zinc-950 font-bold">
            Dashboard
          </h1>

          <p className="mt-1 text-zinc-950">
            Welcome, {user.email}
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-950">
              Total Expenses
            </p>

            <p className="mt-2 text-3xl font-bold text-zinc-600">
              ${total.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-950">
              This Month
            </p>

            <p className="mt-2 text-3xl font-bold text-zinc-600">
              ${monthlyTotal.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-950">
              Number of Expenses
            </p>

            <p className="mt-2 text-3xl font-bold text-zinc-600">
              {expenses.length}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-semibold text-zinc-950">
              Recent Expenses
            </h2>
          </div>

          {expenses.length === 0 ? (
            <div className="p-8 text-center text-zinc-950">
              No expenses yet.
            </div>
          ) : (
            <div className="divide-y text-zinc-950">
              {expenses
                .slice(0, 5)
                .map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-6"
                  >
                    <div>
                      <p className="font-medium">
                        {expense.title}
                      </p>

                      <p className="text-sm text-zinc-950">
                        {expense.category?.[0]?.name ??
                          "Uncategorized"}{" "}
                        •{" "}
                        {expense.expense_date}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ${Number(expense.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}