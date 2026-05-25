import Link from "next/link";
import { markOrderServed } from "../actions";
import { loadOrderTrackingSnapshot } from "../lib/order-tracking";
import { Button, ThemeToggle } from "@coffeeflow/ui";

export const dynamic = "force-dynamic";

export default async function MarcarEntregadoPage() {
    const snapshot = await loadOrderTrackingSnapshot();

    return (
        <main className="min-h-dvh bg-linear-to-br from-white via-slate-50 to-slate-100 px-4 py-6 text-slate-950 md:px-8 md:py-8">
            <section className="mx-auto max-w-6xl">
                <header className="rounded-4xl border border-slate-200/80 bg-white p-5 shadow-sm mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-white">
                                CoffeeFlow POS
                            </div>
                            <h1 className="mt-2 text-2xl font-semibold text-slate-950">
                                Marcar pedido como entregado
                            </h1>
                            <p className="mt-2 text-sm text-slate-600">
                                Selecciona un ticket para finalizarlo y
                                retirarlo de la lista de preparación.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                            >
                                ← Volver al POS
                            </Link>
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                <div className="space-y-4">
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold">
                            En preparación
                        </h2>
                        {snapshot.tickets.length === 0 ? (
                            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                                No hay pedidos en preparación.
                            </article>
                        ) : (
                            <div className="mt-2 max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                                {snapshot.tickets.map((ticket) => (
                                    <article
                                        key={ticket.id}
                                        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between hover:-translate-y-0.5"
                                    >
                                        <div>
                                            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                                                Ticket {ticket.id.slice(0, 8)}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-700">
                                                {ticket.items
                                                    .map(
                                                        (i) =>
                                                            `${i.name} x${i.quantity}`,
                                                    )
                                                    .join(", ")}
                                            </p>
                                        </div>

                                        <form
                                            action={markOrderServed}
                                            className="ml-4"
                                        >
                                            <input
                                                type="hidden"
                                                name="orderId"
                                                value={ticket.id}
                                            />
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                className="inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60 disabled:cursor-not-allowed disabled:opacity-50 bg-slate-950 text-white hover:bg-slate-800"
                                            >
                                                Marcar entregado
                                            </Button>
                                        </form>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </section>
        </main>
    );
}
