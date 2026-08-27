"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createExpense(
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const amount = Number(formData.get("amount"));
  const categoryId = Number(
    formData.get("category_id")
  );
  const expenseDate = formData.get(
    "expense_date"
  ) as string;
  const description = formData.get(
    "description"
  ) as string;

  if (!title || !amount || !expenseDate) {
    throw new Error("Required fields are missing");
  }

  const { error } = await supabase
    .from("expenses")
    .insert({
      user_id: user.id,
      title,
      amount,
      category_id: categoryId || null,
      expense_date: expenseDate,
      description: description || null,
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/expenses");
}


export async function deleteExpense(
  id: number
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/expenses");
}