import {
    AdminButton,
    AdminShell,
    FieldLabel,
    Panel,
    StatCard,
    ToneChip,
} from "./components/admin-ui";
import {
    buildCategoryMap,
    buildOrderItemMap,
    buildProductNameMap,
    formatMoneyMXN,
    loadAdminSnapshot,
} from "./lib/admin-data";
import {
    createProductAction,
    restockCriticalAction,
    syncRecipeAction,
    toggleProductActiveAction,
    updateInventoryAction,
    updateProductPriceAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
    const snapshot = await loadAdminSnapshot();

    const categoryMap = buildCategoryMap(snapshot.categories);
    const orderItemsByOrder = buildOrderItemMap(snapshot.orderItems);
    const productNameMap = buildProductNameMap(snapshot.products);

    const totalOrders = snapshot.orders.length;
    const totalSales = snapshot.orders.reduce(
        (accumulator, order) => accumulator + order.total_cents,
        0,
    );
    const lowStockCount = snapshot.inventory.filter(
        (item) => item.current_quantity < item.minimum_quantity,
    ).length;
    const readyOrders = snapshot.orders.filter(
        (order) => order.status === "ready" || order.status === "served",
    ).length;
    const progressPercent =
        totalOrders === 0 ? 0 : Math.round((readyOrders / totalOrders) * 100);

    return (
        <AdminShell
            activeHref="/"
            eyebrow="Centro de operaciones"
            title="Dashboard de cafetería con foco operativo"
            description="Supervisa el menú, los logs de ventas y el ritmo del turno con una interfaz clara, accesible y consistente."
            summary={
                <>
                    <p className="font-semibold text-slate-950">
                        Turno en marcha
                    </p>
                    <p className="text-slate-600">
                        {readyOrders} pedidos listos · {lowStockCount} insumos
                        críticos · {formatMoneyMXN(totalSales)} acumulados
                    </p>
                </>
            }
        >
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Pedidos registrados"
                    value={String(totalOrders)}
                    detail="Datos reales desde Supabase"
                    accent="sky"
                />
                <StatCard
                    title="Platillos en menú"
                    value={String(snapshot.products.length)}
                    detail="Catálogo base listo para operar"
                    accent="emerald"
                />
                <StatCard
                    title="Ritmo del turno"
                    value={`${progressPercent}%`}
                    detail="Pedidos servidos vs. pedidos totales"
                    accent="amber"
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
                <Panel
                    title="Inventario crítico"
                    subtitle="Señales visuales claras para reabasto sin saturar la pantalla."
                >
                    <div className="space-y-3 text-sm text-slate-700">
                        {snapshot.inventory.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                            >
                                <span className="font-medium text-slate-900">
                                    {item.name}
                                </span>
                                <span
                                    className={
                                        item.current_quantity <
                                        item.minimum_quantity
                                            ? "text-rose-700"
                                            : "text-emerald-700"
                                    }
                                >
                                    {item.current_quantity} {item.unit}
                                </span>
                            </div>
                        ))}
                    </div>
                </Panel>

                <Panel
                    title="Menú base"
                    subtitle="Los platillos se muestran con categorías y precios en MXN."
                >
                    <div className="max-h-144 space-y-3 overflow-auto pr-1 text-sm text-slate-700">
                        {snapshot.products.map((product) => (
                            <div
                                key={product.id}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-slate-950">
                                            {product.name}
                                        </p>
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                                            {categoryMap.get(
                                                product.category_id ?? "",
                                            ) ?? "Sin categoría"}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <ToneChip
                                            tone={
                                                product.is_active
                                                    ? "emerald"
                                                    : "slate"
                                            }
                                        >
                                            {product.is_active
                                                ? "Activo"
                                                : "Oculto"}
                                        </ToneChip>
                                        <ToneChip tone="emerald">
                                            {formatMoneyMXN(
                                                product.price_cents,
                                            )}
                                        </ToneChip>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs leading-6 text-slate-500">
                                    {product.description ??
                                        "Producto disponible en el catálogo."}
                                </p>
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
                <Panel
                    title="Logs de ventas"
                    subtitle="Cada fila corresponde a un pedido real con sus platillos y total."
                >
                    <div className="overflow-hidden rounded-3xl border border-slate-200">
                        <div className="grid grid-cols-12 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
                            <span className="col-span-3">Pedido</span>
                            <span className="col-span-2">Estado</span>
                            <span className="col-span-3">Hora</span>
                            <span className="col-span-2 text-right">Total</span>
                            <span className="col-span-2 text-right">
                                Detalle
                            </span>
                        </div>

                        <div className="divide-y divide-slate-200 bg-white">
                            {snapshot.orders.length === 0 ? (
                                <p className="p-4 text-sm text-slate-500">
                                    Aún no hay ventas registradas.
                                </p>
                            ) : (
                                snapshot.orders.map((order) => {
                                    const items =
                                        orderItemsByOrder.get(order.id) ?? [];
                                    const summary = items
                                        .slice(0, 3)
                                        .map(
                                            (item) =>
                                                `${item.quantity}× ${productNameMap.get(item.product_id) ?? "Producto"}`,
                                        )
                                        .join(", ");

                                    return (
                                        <article
                                            key={order.id}
                                            className="grid grid-cols-12 gap-3 px-4 py-4 text-sm text-slate-700"
                                        >
                                            <div className="col-span-3 font-semibold text-slate-950">
                                                {order.id.slice(0, 8)}
                                            </div>
                                            <div className="col-span-2">
                                                <ToneChip
                                                    tone={
                                                        order.status ===
                                                        "pending"
                                                            ? "amber"
                                                            : order.status ===
                                                                "in_progress"
                                                              ? "sky"
                                                              : "emerald"
                                                    }
                                                >
                                                    {order.status}
                                                </ToneChip>
                                            </div>
                                            <div className="col-span-3 text-slate-600">
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleString("es-MX", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                })}
                                            </div>
                                            <div className="col-span-2 text-right font-semibold text-slate-950">
                                                {formatMoneyMXN(
                                                    order.total_cents,
                                                )}
                                            </div>
                                            <div className="col-span-2 text-right text-xs text-slate-500">
                                                {summary ||
                                                    `${items.length} artículos`}
                                                {order.notes ? (
                                                    <span className="mt-1 block truncate text-slate-400">
                                                        Nota: {order.notes}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </article>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </Panel>

                <Panel
                    title="Acciones de gestión"
                    subtitle="Agregar, editar, quitar y ajustar inventario desde el mismo panel operativo."
                >
                    <form action={createProductAction} className="space-y-4">
                        <div>
                            <FieldLabel htmlFor="product-name">
                                Nuevo platillo
                            </FieldLabel>
                            <input
                                id="product-name"
                                name="name"
                                placeholder="Flat white"
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            />
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <FieldLabel htmlFor="product-price">
                                    Precio MXN
                                </FieldLabel>
                                <input
                                    id="product-price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                            <div>
                                <FieldLabel htmlFor="product-category">
                                    Categoría
                                </FieldLabel>
                                <select
                                    id="product-category"
                                    name="categoryId"
                                    defaultValue={
                                        snapshot.categories[0]?.id ?? ""
                                    }
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                >
                                    {snapshot.categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <AdminButton type="submit">Crear producto</AdminButton>
                    </form>

                    <form
                        action={updateProductPriceAction}
                        className="mt-4 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
                    >
                        <h3 className="text-sm font-semibold text-slate-900">
                            Editar precio
                        </h3>
                        <div className="grid gap-3 md:grid-cols-[1.3fr_0.7fr]">
                            <div>
                                <FieldLabel htmlFor="price-product">
                                    Platillo
                                </FieldLabel>
                                <select
                                    id="price-product"
                                    name="productId"
                                    defaultValue={
                                        snapshot.products[0]?.id ?? ""
                                    }
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                >
                                    {snapshot.products.map((product) => (
                                        <option
                                            key={product.id}
                                            value={product.id}
                                        >
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <FieldLabel htmlFor="price-value">
                                    Nuevo precio MXN
                                </FieldLabel>
                                <input
                                    id="price-value"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                        </div>
                        <AdminButton type="submit" variant="secondary">
                            Guardar precio
                        </AdminButton>
                    </form>

                    <form
                        action={toggleProductActiveAction}
                        className="mt-4 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
                    >
                        <h3 className="text-sm font-semibold text-slate-900">
                            Quitar o reactivar platillo
                        </h3>
                        <div className="grid gap-3 md:grid-cols-[1.3fr_0.7fr]">
                            <div>
                                <FieldLabel htmlFor="toggle-product">
                                    Platillo
                                </FieldLabel>
                                <select
                                    id="toggle-product"
                                    name="productId"
                                    defaultValue={
                                        snapshot.products[0]?.id ?? ""
                                    }
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                >
                                    {snapshot.products.map((product) => (
                                        <option
                                            key={product.id}
                                            value={product.id}
                                        >
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <FieldLabel htmlFor="toggle-active">
                                    Estado
                                </FieldLabel>
                                <select
                                    id="toggle-active"
                                    name="isActive"
                                    defaultValue="false"
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                >
                                    <option value="false">
                                        Quitar del menú
                                    </option>
                                    <option value="true">Reactivar</option>
                                </select>
                            </div>
                        </div>
                        <AdminButton type="submit" variant="secondary">
                            Aplicar cambio
                        </AdminButton>
                    </form>

                    <form
                        action={updateInventoryAction}
                        className="mt-4 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
                    >
                        <h3 className="text-sm font-semibold text-slate-900">
                            Ajustar inventario
                        </h3>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <FieldLabel htmlFor="inventory-item">
                                    Insumo
                                </FieldLabel>
                                <select
                                    id="inventory-item"
                                    name="inventoryItemId"
                                    defaultValue={
                                        snapshot.inventory[0]?.id ?? ""
                                    }
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                >
                                    {snapshot.inventory.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <FieldLabel htmlFor="inventory-current">
                                    Existencia actual
                                </FieldLabel>
                                <input
                                    id="inventory-current"
                                    name="currentQuantity"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    defaultValue={
                                        snapshot.inventory[0]
                                            ?.current_quantity ?? 0
                                    }
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-[1fr_0.7fr]">
                            <div>
                                <FieldLabel htmlFor="inventory-minimum">
                                    Mínimo operativo
                                </FieldLabel>
                                <input
                                    id="inventory-minimum"
                                    name="minimumQuantity"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    defaultValue={
                                        snapshot.inventory[0]
                                            ?.minimum_quantity ?? 0
                                    }
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                            <div className="flex items-end">
                                <AdminButton type="submit" variant="secondary">
                                    Guardar inventario
                                </AdminButton>
                            </div>
                        </div>
                    </form>

                    <form
                        action={syncRecipeAction}
                        className="mt-4 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
                    >
                        <h3 className="text-sm font-semibold text-slate-900">
                            Ajustar receta
                        </h3>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <FieldLabel htmlFor="recipe-product">
                                    Platillo
                                </FieldLabel>
                                <select
                                    id="recipe-product"
                                    name="productId"
                                    defaultValue={
                                        snapshot.products[0]?.id ?? ""
                                    }
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                >
                                    {snapshot.products.map((product) => (
                                        <option
                                            key={product.id}
                                            value={product.id}
                                        >
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <FieldLabel htmlFor="recipe-item">
                                    Insumo
                                </FieldLabel>
                                <select
                                    id="recipe-item"
                                    name="inventoryItemId"
                                    defaultValue={
                                        snapshot.inventory[0]?.id ?? ""
                                    }
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                >
                                    {snapshot.inventory.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <FieldLabel htmlFor="recipe-quantity">
                                Cantidad usada
                            </FieldLabel>
                            <input
                                id="recipe-quantity"
                                name="quantityUsed"
                                type="number"
                                step="0.001"
                                min="0.001"
                                defaultValue="1"
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            />
                        </div>
                        <AdminButton type="submit" variant="secondary">
                            Ajustar receta
                        </AdminButton>
                    </form>

                    <form action={restockCriticalAction} className="mt-4">
                        <AdminButton type="submit" variant="secondary">
                            Reabastecer críticos
                        </AdminButton>
                    </form>
                </Panel>
            </div>
        </AdminShell>
    );
}
