import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@coffeeflow/database";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId } = body ?? {};

        const uuidRegex = /^[0-9a-fA-F-]{8,36}$/;
        if (
            !orderId ||
            typeof orderId !== "string" ||
            !uuidRegex.test(orderId)
        ) {
            return NextResponse.json(
                { success: false, message: "ID de pedido inválido" },
                { status: 400 },
            );
        }

        const client = createSupabaseServiceClient();
        const { error } = await client
            .from("orders")
            .update({ status: "served" })
            .eq("id", orderId);

        if (error) {
            return NextResponse.json(
                { success: false, message: error.message ?? String(error) },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            message: `Pedido ${orderId.slice(0, 8)} marcado como entregado.`,
        });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, message: err?.message ?? String(err) },
            { status: 500 },
        );
    }
}
