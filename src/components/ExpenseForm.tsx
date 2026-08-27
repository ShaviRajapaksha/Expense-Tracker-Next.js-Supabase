"use client";

import { useState } from "react";
import { createExpense } from "@/app/actions/expenses";

type Category = {
  id: number;
  name: string;
};

type ExpenseFormProps = {
  categories: Category[];
};

export default function ExpenseForm({
  categories,
}: ExpenseFormProps) {
  const [loading, setLoading] = useState(false);

  return (
    <form
      action={async (formData) => {
        setLoading(true);

        try {
          await createExpense(formData);

          (
            document.getElementById(
              "expense-form"
            ) as HTMLFormElement
          )?.reset();
        } catch (error) {
          console.error(error);
          alert("Failed to create expense");
        } finally {
          setLoading(false);
        }
      }}
      id="expense-form"
      className="space-y-5 rounded-xl bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Title
        </label>

        <input
          name="title"
          required
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Lunch"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Amount
        </label>

        <input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          className="w-full rounded-lg border px-4 py-3"
          placeholder="25.00"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Category
        </label>

        <select
          name="category_id"
          className="w-full rounded-lg border px-4 py-3"
          defaultValue=""
        >
          <option value="">
            Select category
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Date
        </label>

        <input
          name="expense_date"
          type="date"
          required
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          name="description"
          rows={4}
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Optional description..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading
          ? "Adding..."
          : "Add Expense"}
      </button>
    </form>
  );
}