"use server";

import { createSupabaseServiceClient } from "@coffeeflow/database";
import { revalidatePath } from "next/cache";

const validStatuses = new Set([
    "pending",
    "in_progress",
    "ready",
    "served",
    "cancelled",
]);

export async function updateOrderStatusAction(formData: FormData) {
    const orderId = String(formData.get("orderId") ?? "").trim();
    const nextStatus = String(formData.get("nextStatus") ?? "").trim();

    if (!orderId || !validStatuses.has(nextStatus)) {
        return;
    }

    const client = createSupabaseServiceClient();

    const { error } = await client
        .from("orders")
        .update({ status: nextStatus })
        .eq("id", orderId);

    if (error) {
        throw error;
    }

    revalidatePath("/");
}
