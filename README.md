# CoffeeFlow Enterprise

Monorepo para una plataforma de cafetería con POS, pantalla de cocina (KDS) y panel de administración.

## Resumen

CoffeeFlow es una plantilla de punto de venta (POS) pensada para cafeterías y locales pequeños. Incluye:

- `apps/pos` — Interfaz de caja para tomar pedidos y generar tickets.
- `apps/kds` — Pantalla de cocina/baristas para ver y marcar pedidos.
- `apps/admin` — Backoffice: gestión de productos, inventario y reportes.
- `packages/ui` — Componentes React/Tailwind reutilizables.
- `packages/database` — Helpers para Supabase y datos de ejemplo (seeds).

## Requisitos

- Node.js 20+ (recomendado)
- npm 10+
- Una instancia de Supabase para la base de datos (opcional para desarrollo con datos reales)

## Configuración inicial

1. Instala dependencias:

```bash
npm install
```

2. Copia las variables de entorno y completa las credenciales:

```bash
cp .env.example .env.local
# Edita .env.local con tu URL/KEY de Supabase si corresponde
```

3. (Opcional) Si usas Supabase, aplica el esquema o crea la base usando `packages/database/schema.sql`.

## Arranque en desarrollo

Ejecuta el monorepo en modo desarrollo (Turborepo/Turbo):

```bash
npm run dev
```

Apps locales y puertos comunes (pueden variar):

- `http://localhost:3000` — KDS
- `http://localhost:3001` — Admin
- `http://localhost:3002` — POS

Si alguno de los puertos está en uso, Turbo reasigna puertos automáticamente; revisa la salida de `npm run dev`.

## Seeds / Datos demo

Para cargar datos de demostración (categorías, productos, recetas) revisa `packages/database/src/seed.ts` y usa la utilidad `ensureDemoData` si está expuesta en tu entorno. En desarrollo local normalmente los datos demo se aplican automáticamente al iniciar.

## Comandos útiles

- Levantar dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Tests (si están configurados): `npm test` o `npm run test`

## Flujo de trabajo rápido

1. Modifica componentes en `packages/ui` para cambios compartidos.
2. Ajusta lógica en `packages/database` para queries y seeds.
3. Prueba la UI en `apps/pos` y `apps/kds` ejecutando `npm run dev`.

## Notas y resolución de problemas

- Hidratación React: si ves errores tipo "A tree hydrated but some attributes...", revisa diferencias entre server/client (por ejemplo, atributos de `form` como `method` deben coincidir exactamente con mayúsculas). Evita usar valores que cambian entre servidor/cliente (p. ej. `Date.now()` o `Math.random()`) en renderizado inicial.
- Puertos en uso: Turbo puede reasignar puertos; revisa la consola para conocer las URLs reales.

## Contribuir

1. Crea una rama con nombre descriptivo `feat/mi-cambio`.
2. Asegura que `lint` pasa y los cambios son mínimos.
3. Abre un PR describiendo el propósito y pasos para validar.

## Recursos y archivos importantes

- Esquema de DB: `packages/database/schema.sql`
- Seeds demo: `packages/database/src/seed.ts`
- Punto de entrada POS: `apps/pos/src/app/pos-workbench.tsx`
- Seguimiento de pedidos (público): `apps/pos/src/app/seguimiento-pedido/page.tsx`
- Acción para marcar entregado: `apps/pos/src/app/actions.ts`

**Rutas y Endpoints (local)**

- **KDS (pantalla cocina)**: http://localhost:3000/ — app: `apps/kds`
- **Admin (backoffice)**: http://localhost:3001/ — app: `apps/admin`
- **POS (caja)**: http://localhost:3002/ — app: `apps/pos`
- **POS — Seguimiento público**: http://localhost:3002/seguimiento-pedido — página pública para que clientes consulten su ticket (`apps/pos/src/app/seguimiento-pedido/page.tsx`)
- **POS — Marcar entregado**: http://localhost:3002/marcar-entregado — acción y UI para marcar pedidos como entregados (`apps/pos/src/app/marcar-entregado/page.tsx`)
- **API (ejemplos)**: revisa `apps/*/src/app/api` para endpoints; ejemplo usado en desarrollo: `/api/estado-platillos` (revalida/consulta estado de platillos)

Nota: los puertos son los más comunes en este proyecto, pero `turbo dev` puede reasignarlos si alguno ya está en uso — revisa la consola para las URLs exactas.

---

¿Quieres que añada una sección específica para despliegue (Vercel/Netlify) o ejemplos de llamadas a la API de Supabase?
