# CoffeeFlow Enterprise

**Nombre del proyecto:** CoffeeFlow Enterprise

**Descripción:** Monorepo para una plataforma de cafetería que incluye un Punto de Venta (POS), Pantalla de Cocina (KDS) y panel de administración. Está pensado como prototipo funcional para gestionar pedidos, cocina y administración de un local.

**Materia / Profesor / Integrantes**
- Materia: Interfaces de Usuario
- Profesor: [Nombre del profesor]
- Integrantes: [Nombre 1] (Alberto), [Nombre 2], [Nombre 3]

**Tecnologías y versiones**
- Node.js >= 20
- npm >= 10
- Turborepo (turbo) ^2.9
- Next.js 16.2.6
- React 19.2.4
- TypeScript ^5
- TailwindCSS ^4
- Supabase (como backend BaaS)

## Instalación y ejecución (rápida)

1. Instala dependencias en la raíz (usa workspaces):

```bash
npm install
```

2. Prepara las variables de entorno locales (no comitear):

```bash
npm run env:setup
# Edita .env.local y pega tus credenciales reales (SUPABASE URL/KEYs)
```

3. Inicia el entorno de desarrollo:

```bash
npm run dev
```

Páginas por defecto (puertos que usa el proyecto en desarrollo):
- KDS: http://localhost:3000
- Admin: http://localhost:3001
- POS: http://localhost:3002

## Despliegue / Prototipo funcional

- Enlace al prototipo funcional: [Agregar URL del prototipo aquí]

### Despliegue en Vercel para las 3 apps

Para desplegar cada aplicación por separado en Vercel, crea un proyecto distinto para cada una y configura la carpeta raíz de la app.

1. Conecta el repositorio a Vercel.
2. Crea un nuevo proyecto en Vercel para cada app:
   - `apps/admin` → Admin
   - `apps/kds` → KDS
   - `apps/pos` → POS
3. En la configuración del proyecto, asegura estos valores:
   - Root Directory: `apps/admin`, `apps/kds` o `apps/pos`
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Install Command: deja el valor predeterminado (`npm install`) o, si Vercel no instala correctamente los workspaces, usa `npm install --workspaces`
   - Output Directory: deja la opción predeterminada en blanco para Next.js.
4. Agrega las variables de entorno en Vercel para cada proyecto:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Despliega y usa las URLs generadas por Vercel para cada app.

> Cada app comparte el monorepo, pero debe desplegarse como proyecto independiente en Vercel apuntando a su carpeta `apps/*`.

Si quieres un prototipo público, copia en esta sección la URL de despliegue que te da Vercel para la app principal (por ejemplo `https://admin-tu-proyecto.vercel.app`).

## Funcionalidades implementadas (resumen)
- Interfaz POS para tomar pedidos y emitir tickets.
- Pantalla KDS para visualizar y marcar el estado de platillos.
- Panel administrativo para gestión de productos y datos.
- Componentes reutilizables en `packages/ui`.
- Conexión a Supabase para persistencia y seeds de ejemplo en `packages/database`.

## Seguridad y manejo de credenciales

- Este repositorio incluye un archivo `.env.example` con variables de ejemplo (sin credenciales reales).
- Nunca subas archivos con valores reales de credenciales. Usa `npm run env:setup` para crear `.env.local` a partir del ejemplo y completa tus secretos localmente.
- `.gitignore` ya excluye `.env`, `.env.local` y variantes.

## Declaración de uso de inteligencia artificial

- Este proyecto utilizó asistencia de inteligencia artificial (herramientas de autocompletado y generación de código) para acelerar tareas de desarrollo y escritura de documentación. Todos los cambios fueron revisados manualmente por el equipo.

## Comandos útiles

- `npm run env:setup` — Crea `.env.local` a partir de `.env.example` (si no existe)
- `npm install` — Instala dependencias
- `npm run dev` — Levanta el monorepo en modo desarrollo
- `npm run build` — Construye los paquetes
- `npm run lint` — Ejecuta linters

## Recursos y archivos importantes

- Esquema de DB: `packages/database/schema.sql`
- Seeds demo: `packages/database/src/seed.ts`
- Punto de entrada POS: [apps/pos/src/app/pos-workbench.tsx](apps/pos/src/app/pos-workbench.tsx#L1)
- Seguimiento de pedidos (público): [apps/pos/src/app/seguimiento-pedido/page.tsx](apps/pos/src/app/seguimiento-pedido/page.tsx#L1)
- Acción para marcar entregado: [apps/pos/src/app/actions.ts](apps/pos/src/app/actions.ts#L1)

---

Si quieres, puedo añadir ejemplos de despliegue (Vercel) o rellenar los campos de integrantes y profesor con los datos reales. ¿Los completo yo o prefieres hacerlo tú?
