"use client";

import { Button, StatusPill } from "@coffeeflow/ui";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { placeOrderAction } from "./actions";

type Product = {
    id: string;
    name: string;
    description: string | null;
    price_cents: number;
    categoryName: string;
};

type RecentOrder = {
    id: string;
    status: "pending" | "in_progress" | "ready" | "served" | "cancelled";
    total_cents: number;
    created_at: string;
    notes: string | null;
};

type CartMap = Record<string, number>;

const money = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
});

function translateStatus(status: RecentOrder["status"]) {
    switch (status) {
        case "pending":
            return "Pendiente";
        case "in_progress":
            return "En preparación";
        case "ready":
            return "Listo";
        case "served":
            return "Entregado";
        case "cancelled":
            return "Cancelado";
        default:
            return status;
    }
}

export function PosWorkbench({
    products,
    recentOrders,
}: {
    products: Product[];
    recentOrders: RecentOrder[];
}) {
    const router = useRouter();
    const [cart, setCart] = useState<CartMap>({});
    const [notes, setNotes] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const cartEntries = useMemo(() => Object.entries(cart), [cart]);

    const cartItems = cartEntries
        .map(([productId, quantity]) => {
            const product = products.find((item) => item.id === productId);
            if (!product) return null;
            return {
                productId,
                quantity,
                product,
                lineTotal: product.price_cents * quantity,
            };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

    const subtotal = cartItems.reduce((acc, item) => acc + item.lineTotal, 0);
    const tax = Math.round(subtotal * 0.16);
    const total = subtotal + tax;

    const updateCart = (productId: string, delta: number) => {
        setCart((current) => {
            const nextQuantity = (current[productId] ?? 0) + delta;
            if (nextQuantity <= 0) {
                const next = { ...current };
                delete next[productId];
                return next;
            }
            return { ...current, [productId]: nextQuantity };
        });
    };

    const submitOrder = () => {
        startTransition(async () => {
            const response = await placeOrderAction({
                items: cartItems.map((it) => ({
                    productId: it.productId,
                    quantity: it.quantity,
                })),
                notes,
            });
            setMessage(response.message);
            if (response.success) {
                setCart({});
                setNotes("");
                router.refresh();
            }
        });
    };

    return (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <section className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-950">
                            Productos disponibles
                        </h2>
                        <p className="text-sm text-slate-600">
                            Menú activo con precios en MXN y acceso rápido al
                            ticket.
                        </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Catálogo vivo
                    </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                        <article
                            key={product.id}
                            className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                                        {product.categoryName}
                                    </p>
                                    <h3 className="mt-2 text-lg font-semibold text-slate-950">
                                        {product.name}
                                    </h3>
                                </div>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                                    {money.format(product.price_cents / 100)}
                                </span>
                            </div>
                            <p className="mt-3 min-h-12 text-sm text-slate-600">
                                {product.description ??
                                    "Producto listo para venta inmediata."}
                            </p>
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => updateCart(product.id, 1)}
                                className="mt-4 bg-slate-950 text-white hover:bg-slate-800"
                            >
                                Agregar al pedido
                            </Button>
                        </article>
                    ))}
                </div>
            </section>

            <aside className="space-y-6">
                <section className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <h2 className="text-xl font-semibold text-slate-950">
                        Pedido actual
                    </h2>
                    <div className="mt-4 space-y-3">
                        {cartItems.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                Agrega productos para empezar a armar el ticket.
                            </p>
                        ) : (
                            cartItems.map((item) => (
                                <div
                                    key={item.productId}
                                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-slate-950">
                                                {item.product.name}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                {money.format(
                                                    item.product.price_cents /
                                                        100,
                                                )}{" "}
                                                cada uno
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    updateCart(
                                                        item.productId,
                                                        -1,
                                                    )
                                                }
                                                className="rounded-full bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200"
                                            >
                                                -
                                            </Button>
                                            <span className="min-w-8 text-center font-semibold text-slate-950">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    updateCart(
                                                        item.productId,
                                                        1,
                                                    )
                                                }
                                                className="rounded-full bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200"
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <label className="mt-4 block text-sm text-slate-600">
                        Notas
                        <textarea
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 outline-none ring-0 placeholder:text-slate-500"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Sin azúcar, para llevar, etc."
                        />
                    </label>

                    <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                        <div className="flex items-center justify-between">
                            <span>Subtotal</span>
                            <span>{money.format(subtotal / 100)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>IVA</span>
                            <span>{money.format(tax / 100)}</span>
                        </div>
                        <div className="flex items-center justify-between text-base font-semibold text-slate-950">
                            <span>Total</span>
                            <span>{money.format(total / 100)}</span>
                        </div>
                    </div>

                    <Button
                        fullWidth
                        onClick={submitOrder}
                        disabled={cartItems.length === 0 || isPending}
                        className="mt-4 bg-slate-950 text-white hover:bg-slate-800"
                    >
                        {isPending ? "Enviando pedido..." : "Enviar a cocina"}
                    </Button>

                    {message ? (
                        <p className="mt-3 text-sm text-emerald-700">
                            {message}
                        </p>
                    ) : null}
                </section>

                <section className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <h2 className="text-xl font-semibold text-slate-950">
                        Últimos tickets
                    </h2>
                    <div className="mt-4 space-y-3">
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                Todavía no se han generado pedidos.
                            </p>
                        ) : (
                            recentOrders.map((order) => (
                                <article
                                    key={order.id}
                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-slate-950">
                                                Pedido {order.id.slice(0, 8)}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleTimeString("es-MX", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <StatusPill
                                                tone="amber"
                                                label={translateStatus(
                                                    order.status,
                                                )}
                                            />
                                            <p className="mt-2 text-sm font-semibold text-slate-950">
                                                {money.format(
                                                    order.total_cents / 100,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-1 text-sm text-slate-700">
                                        {order.notes ? (
                                            <p className="mt-3 rounded-2xl border border-amber-200 bg-white px-3 py-2 text-xs text-amber-900">
                                                {order.notes}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-slate-500">
                                                Sin notas
                                            </p>
                                        )}
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </section>
            </aside>
        </div>
    );
}
