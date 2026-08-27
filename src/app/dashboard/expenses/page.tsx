import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import ExpenseForm from "@/components/ExpenseForm";
import { createClient } from "@/lib/supabase/server";
import { deleteExpense } from "@/app/actions/expenses";

export default async function ExpensesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  const { data: expenses, error } = await supabase
    .from("expenses")
    .select(`
      id,
      title,
      amount,
      expense_date,
      description,
      category:categories(name)
    `)
    .order("expense_date", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold">
          Expenses
        </h1>

        <p className="mt-1 text-gray-500">
          Add and manage your expenses.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div>
            <h2 className="mb-4 text-xl font-semibold">
              Add Expense
            </h2>

            <ExpenseForm
              categories={categories ?? []}
            />
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">
              Expense History
            </h2>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              {expenses.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No expenses found.
                </div>
              ) : (
                <div className="divide-y">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between gap-4 p-5"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold">
                          {expense.title}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {expense.category?.[0]?.name ??
                            "Uncategorized"}
                          {" • "}
                          {expense.expense_date}
                        </p>

                        {expense.description && (
                          <p className="mt-1 text-sm text-gray-400">
                            {expense.description}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-4">
                        <span className="font-semibold">
                          $
                          {Number(
                            expense.amount
                          ).toFixed(2)}
                        </span>

                        <form
                          action={deleteExpense.bind(
                            null,
                            expense.id
                          )}
                        >
                          <button
                            type="submit"
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}