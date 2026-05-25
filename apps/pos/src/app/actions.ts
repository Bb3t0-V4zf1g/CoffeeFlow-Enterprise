"use server";

import { createSupabaseServiceClient } from "@coffeeflow/database";
import { revalidatePath } from "next/cache";

type CartItemInput = {
    productId: string;
    quantity: number;
};

export async function placeOrderAction(input: {
    items: CartItemInput[];
    notes?: string;
}) {
    const items = input.items.filter((item) => item.quantity > 0);

    if (items.length === 0) {
        return {
            success: false,
            message: "Agrega al menos un producto antes de enviar el pedido.",
        };
    }

    const client = createSupabaseServiceClient();
    const productIds = [...new Set(items.map((item) => item.productId))];

    const { data: products, error: productsError } = await client
        .from("products")
        .select("id, price_cents, name")
        .in("id", productIds);

    if (productsError) {
        throw productsError;
    }

    const productMap = new Map(
        (products ?? []).map((product) => [product.id, product]),
    );

    const orderItems = items.map((item) => {
        const product = productMap.get(item.productId);

        if (!product) {
            throw new Error("Uno de los productos ya no existe.");
        }

        const lineTotal = product.price_cents * item.quantity;

        return {
            product_id: product.id,
            quantity: item.quantity,
            unit_price_cents: product.price_cents,
            line_total_cents: lineTotal,
        };
    });

    const subtotal = orderItems.reduce(
        (accumulator, item) => accumulator + item.line_total_cents,
        0,
    );
    const tax = Math.round(subtotal * 0.16);
    const total = subtotal + tax;

    const { data: order, error: orderError } = await client
        .from("orders")
        .insert({
            status: "pending",
            subtotal_cents: subtotal,
            tax_cents: tax,
            total_cents: total,
            notes: input.notes?.trim() || null,
        })
        .select("id")
        .single();

    if (orderError) {
        throw orderError;
    }

    const { error: orderItemsError } = await client.from("order_items").insert(
        orderItems.map((item) => ({
            order_id: order.id,
            ...item,
        })),
    );

    if (orderItemsError) {
        throw orderItemsError;
    }

    revalidatePath("/");

    return {
        success: true,
        message: `Pedido ${order.id.slice(0, 8)} enviado a cocina.`,
    };
}

export async function markOrderServed(input: { orderId: string }) {
    const client = createSupabaseServiceClient();
    // Validar formato UUID básico para evitar errores 22P02 en Postgres
    const uuidRegex = /^[0-9a-fA-F-]{8,36}$/;
    if (
        !input ||
        typeof input.orderId !== "string" ||
        !uuidRegex.test(input.orderId)
    ) {
        return {
            success: false,
            message: "ID de pedido inválido. Operación cancelada.",
        };
    }

    try {
        const { error } = await client
            .from("orders")
            .update({ status: "served" })
            .eq("id", input.orderId);

        if (error) {
            return {
                success: false,
                message: `Error al actualizar pedido: ${error.message ?? error}`,
            };
        }

        revalidatePath("/seguimiento-pedido");

        return {
            success: true,
            message: `Pedido ${input.orderId.slice(0, 8)} marcado como entregado.`,
        };
    } catch (err: any) {
        return {
            success: false,
            message: `Error inesperado: ${err?.message ?? String(err)}`,
        };
    }
}
