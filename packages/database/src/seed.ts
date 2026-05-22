import type { SupabaseClient } from "@supabase/supabase-js";

const demoCategories = [
    { name: "Espresso" },
    { name: "Bebidas frías" },
    { name: "Panadería" },
    { name: "Desayunos" },
    { name: "Tés y especiales" },
];

const demoInventory = [
    {
        name: "Leche entera",
        unit: "L",
        current_quantity: 18,
        minimum_quantity: 24,
    },
    {
        name: "Vasos 16oz",
        unit: "u",
        current_quantity: 42,
        minimum_quantity: 60,
    },
    {
        name: "Grano espresso",
        unit: "kg",
        current_quantity: 8.4,
        minimum_quantity: 12,
    },
    { name: "Hielo", unit: "kg", current_quantity: 16, minimum_quantity: 10 },
    {
        name: "Croissant",
        unit: "u",
        current_quantity: 22,
        minimum_quantity: 18,
    },
];

const demoProducts = [
    {
        name: "Latte vainilla",
        description: "Espresso suave con leche vaporizada y vainilla.",
        price_cents: 6500,
        categoryName: "Espresso",
    },
    {
        name: "Capuccino clásico",
        description: "Balance perfecto entre espresso, leche y espuma.",
        price_cents: 5900,
        categoryName: "Espresso",
    },
    {
        name: "Frappé moka",
        description: "Bebida fría con chocolate y espresso.",
        price_cents: 7200,
        categoryName: "Bebidas frías",
    },
    {
        name: "Croissant mantequilla",
        description: "Panadería recién horneada para acompañar el café.",
        price_cents: 3800,
        categoryName: "Panadería",
    },
    {
        name: "Americano",
        description: "Café limpio y directo, ideal para empezar el día.",
        price_cents: 4500,
        categoryName: "Espresso",
    },
    {
        name: "Mocha",
        description: "Espresso con chocolate y leche vaporizada.",
        price_cents: 6900,
        categoryName: "Espresso",
    },
    {
        name: "Flat white",
        description: "Textura sedosa con doble espresso.",
        price_cents: 6700,
        categoryName: "Espresso",
    },
    {
        name: "Cold brew",
        description: "Extracción en frío con perfil suave y brillante.",
        price_cents: 6800,
        categoryName: "Bebidas frías",
    },
    {
        name: "Iced latte",
        description: "Latte frío servido sobre hielo.",
        price_cents: 6600,
        categoryName: "Bebidas frías",
    },
    {
        name: "Matcha latte",
        description: "Té verde con leche cremosa y sabor herbal.",
        price_cents: 7500,
        categoryName: "Tés y especiales",
    },
    {
        name: "Chai latte",
        description: "Especias cálidas con leche vaporizada.",
        price_cents: 7300,
        categoryName: "Tés y especiales",
    },
    {
        name: "Té frío de durazno",
        description: "Infusión fría con fruta y toque dulce.",
        price_cents: 5200,
        categoryName: "Tés y especiales",
    },
    {
        name: "Waffle con frutos rojos",
        description: "Waffle dorado con fruta fresca y miel.",
        price_cents: 8900,
        categoryName: "Desayunos",
    },
    {
        name: "Huevos rancheros",
        description: "Desayuno clásico con salsa, tortilla y frijoles.",
        price_cents: 9900,
        categoryName: "Desayunos",
    },
    {
        name: "Sándwich de pavo",
        description: "Pan artesanal con pavo, queso y vegetales.",
        price_cents: 8400,
        categoryName: "Desayunos",
    },
    {
        name: "Bagel salmón",
        description: "Bagel tostado con queso crema y salmón ahumado.",
        price_cents: 11500,
        categoryName: "Desayunos",
    },
    {
        name: "Panqué de plátano",
        description: "Rebanada esponjosa con notas de canela.",
        price_cents: 4900,
        categoryName: "Panadería",
    },
    {
        name: "Concha rellena",
        description: "Pan dulce con relleno cremoso de la casa.",
        price_cents: 4200,
        categoryName: "Panadería",
    },
    {
        name: "Muffin de arándanos",
        description: "Muffin suave con arándanos y azúcar glass.",
        price_cents: 4600,
        categoryName: "Panadería",
    },
    {
        name: "Galleta de avena",
        description: "Galleta casera con avena y chispas de chocolate.",
        price_cents: 3200,
        categoryName: "Panadería",
    },
];

const demoRecipes = [
    {
        productName: "Latte vainilla",
        inventoryName: "Leche entera",
        quantity_used: 0.25,
    },
    {
        productName: "Latte vainilla",
        inventoryName: "Grano espresso",
        quantity_used: 0.018,
    },
    {
        productName: "Capuccino clásico",
        inventoryName: "Leche entera",
        quantity_used: 0.18,
    },
    {
        productName: "Capuccino clásico",
        inventoryName: "Grano espresso",
        quantity_used: 0.017,
    },
    { productName: "Frappé moka", inventoryName: "Hielo", quantity_used: 0.2 },
    {
        productName: "Frappé moka",
        inventoryName: "Leche entera",
        quantity_used: 0.14,
    },
    {
        productName: "Croissant mantequilla",
        inventoryName: "Croissant",
        quantity_used: 1,
    },
    {
        productName: "Americano",
        inventoryName: "Grano espresso",
        quantity_used: 0.014,
    },
    {
        productName: "Mocha",
        inventoryName: "Leche entera",
        quantity_used: 0.2,
    },
    {
        productName: "Flat white",
        inventoryName: "Leche entera",
        quantity_used: 0.16,
    },
    {
        productName: "Cold brew",
        inventoryName: "Hielo",
        quantity_used: 0.12,
    },
    {
        productName: "Iced latte",
        inventoryName: "Hielo",
        quantity_used: 0.18,
    },
    {
        productName: "Matcha latte",
        inventoryName: "Leche entera",
        quantity_used: 0.22,
    },
    {
        productName: "Chai latte",
        inventoryName: "Leche entera",
        quantity_used: 0.22,
    },
    {
        productName: "Té frío de durazno",
        inventoryName: "Hielo",
        quantity_used: 0.14,
    },
    {
        productName: "Waffle con frutos rojos",
        inventoryName: "Vasos 16oz",
        quantity_used: 1,
    },
    {
        productName: "Huevos rancheros",
        inventoryName: "Vasos 16oz",
        quantity_used: 1,
    },
    {
        productName: "Sándwich de pavo",
        inventoryName: "Vasos 16oz",
        quantity_used: 1,
    },
    {
        productName: "Bagel salmón",
        inventoryName: "Vasos 16oz",
        quantity_used: 1,
    },
    {
        productName: "Panqué de plátano",
        inventoryName: "Vasos 16oz",
        quantity_used: 1,
    },
    {
        productName: "Concha rellena",
        inventoryName: "Croissant",
        quantity_used: 0.5,
    },
    {
        productName: "Muffin de arándanos",
        inventoryName: "Croissant",
        quantity_used: 0.5,
    },
    {
        productName: "Galleta de avena",
        inventoryName: "Croissant",
        quantity_used: 0.3,
    },
];

type MinimalClient = Pick<SupabaseClient, "from">;

async function getCount(client: MinimalClient, table: string) {
    const { count } = await client
        .from(table)
        .select("*", { count: "exact", head: true });
    return count ?? 0;
}

export async function ensureDemoData(client: MinimalClient) {
    const { error: categoriesError } = await client
        .from("product_categories")
        .upsert(demoCategories, {
            onConflict: "name",
            ignoreDuplicates: true,
        });

    if (categoriesError) {
        throw categoriesError;
    }

    const { error: inventoryError } = await client
        .from("inventory_items")
        .upsert(demoInventory, {
            onConflict: "name",
            ignoreDuplicates: true,
        });

    if (inventoryError) {
        throw inventoryError;
    }

    const { data: categories } = await client
        .from("product_categories")
        .select("id, name");

    const categoryMap = new Map(
        (categories ?? []).map((category) => [category.name, category.id]),
    );

    const { data: existingProducts } = await client
        .from("products")
        .select("id, name, created_at")
        .order("created_at", { ascending: true });

    const existingProductsByName = new Map<
        string,
        { id: string; name: string; created_at: string }[]
    >();

    for (const product of existingProducts ?? []) {
        const list = existingProductsByName.get(product.name) ?? [];
        list.push(product);
        existingProductsByName.set(product.name, list);
    }

    const duplicateIds = [...existingProductsByName.values()]
        .filter((group) => group.length > 1)
        .flatMap((group) => group.slice(1).map((product) => product.id));

    if (duplicateIds.length > 0) {
        const { error } = await client
            .from("products")
            .delete()
            .in("id", duplicateIds);

        if (error) {
            throw error;
        }
    }

    const presentProductNames = new Set(
        (existingProducts ?? []).map((product) => product.name),
    );
    const missingProducts = demoProducts.filter(
        (product) => !presentProductNames.has(product.name),
    );

    const productByName = new Map(
        (existingProducts ?? []).map((product) => [product.name, product.id]),
    );

    const canonicalProductUpdates = demoProducts
        .map((product) => ({
            id: productByName.get(product.name),
            name: product.name,
            description: product.description,
            price_cents: product.price_cents,
            category_id: categoryMap.get(product.categoryName) ?? null,
            is_active: true,
        }))
        .filter((product) => Boolean(product.id));

    if (canonicalProductUpdates.length > 0) {
        const { error } = await client
            .from("products")
            .upsert(canonicalProductUpdates, {
                onConflict: "id",
            });

        if (error) {
            throw error;
        }
    }

    if (missingProducts.length > 0) {
        const { error } = await client.from("products").insert(
            missingProducts.map((product) => ({
                name: product.name,
                description: product.description,
                price_cents: product.price_cents,
                category_id: categoryMap.get(product.categoryName) ?? null,
                is_active: true,
            })),
        );

        if (error) {
            throw error;
        }
    }

    const [{ data: products }, { data: inventory }] = await Promise.all([
        client.from("products").select("id, name"),
        client.from("inventory_items").select("id, name"),
    ]);

    const productMap = new Map(
        (products ?? []).map((product) => [product.name, product.id]),
    );
    const inventoryMap = new Map(
        (inventory ?? []).map((item) => [item.name, item.id]),
    );

    const recipeRows = demoRecipes
        .map((recipe) => ({
            product_id: productMap.get(recipe.productName),
            inventory_item_id: inventoryMap.get(recipe.inventoryName),
            quantity_used: recipe.quantity_used,
        }))
        .filter((recipe) => recipe.product_id && recipe.inventory_item_id);

    if (recipeRows.length > 0) {
        const { error } = await client.from("recipes").upsert(recipeRows, {
            onConflict: "product_id,inventory_item_id",
        });

        if (error) {
            throw error;
        }
    }
}
