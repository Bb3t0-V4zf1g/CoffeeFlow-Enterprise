# Plan: Ecosistema Integral de Gestión para Cafeterías (CoffeeFlow Enterprise)

Sistema masivo y escalable tipo ERP/POS para la gestión de múltiples sucursales de cafeterías, integrando clientes, empleados, pedidos multicanal y análisis predictivo.

Esta documentación está diseñada para guiar el desarrollo ya sea por humanos o por otros agentes de IA de forma estructurada.

---

## 1. Módulos del Sistema (Interfaces y Aplicaciones)

El ecosistema se dividirá en múltiples aplicaciones interconectadas compartiendo una única fuente de la verdad (Base de datos central):

- **Punto de Venta (POS) - Cajeros:**
    - Interfaz optimizada para pantallas táctiles.
    - Capacidad Offline-First (sigue cobrando y cachea las ventas si se cae el internet).
    - Soporte para múltiples métodos de pago, impresión de tickets ESC/POS y apertura de cajero.
- **Kitchen Display System (KDS) - Baristas / Cocina:**
    - Visualizador de órdenes en parrilla mediante WebSockets (tiempo real).
    - Alertas sonoras, cuellos de botella y control de tiempos por orden.
    - Opción para reportar "Ingrediente Agotado" instantáneamente de vuelta al cajero.
- **Kioskos de Autogestión y Menú QR - Clientes en Local:**
    - Interfaz simplificada para que los clientes pidan y paguen directamente desde tótems en la tienda o escaneando su mesa.
- **Customer App & Fidelización - Clientes Externos:**
    - Módulo de recolección en tienda ("Order Ahead" o "Pick-Up").
    - Monedero digital, sistema de puntos (Rewards) promociones y cupones.
- **Backoffice / Admin Panel - Gerentes y Dueños:**
    - Gestión de inventarios atómicos (recetas que descuentan mililitros/gramos exactos).
    - Reportes de Business Intelligence: Rentabilidad, horas pico, mermas.
    - Gestión de RRHH: Turnos, nóminas, permisos por rol.
    - Control Multiusuario y Multitienda (Franquicias).

---

## 2. Definición del Stack Tecnológico

- **Arquitectura:** Monorepositorio con `Turborepo` (para compartir interfaces, utilidades y conectores TS).
- **Frontend (Todas las interfaces):** `Next.js` (App Router) y React.
    - _Estilos:_ `Tailwind CSS` y `Shadcn UI`.
    - _Estado Remoto/Offline:_ `TanStack Query` y sincronización con `IndexedDB`.
- **Backend & Base de datos:** `Supabase` (Almacenamiento en PostgreSQL con Políticas RLS de fila + capa GraphQL y API REST auto-generada).
    - _Sockets:_ `Supabase Realtime` (Esencial para sincronizar la caja y el barista).
    - _Serverless functions:_ `Supabase Edge Functions` para lógicas pesadas (procesar pagos, cortes de caja automáticos).
- **Infraestructura:** Despliegue en `Vercel` (Front) y plataforma autogestionada de `Supabase`.

---

## 3. Arquitectura Base y Flujo Funcional

**El flujo del inventario atómico (Ejemplo Crítico):**

1.  **Venta:** Un cliente pide un _Latte Vainilla Grande_.
2.  **Pedido:** El cajero ingresa la orden. Supabase inserta la venta.
3.  **Visualización:** El KDS del barista alerta inmediatamente.
4.  **Descuento:** El Backoffice, basado en la "Receta" configurada, y en el tamaño (Grande) descuenta automáticamente:
    - `-200ml de Leche Entera`
    - `-18g de Grano de Café en polvo`
    - `-15ml de Jarabe de Vainilla`
    - `-1 Vaso de 16oz`
    - `-1 Tapa de 16oz`.
5.  **Notificación:** Si los vasos de 16oz bajan del umbral mínimo de seguridad (Ej. quedan 50), el Gestor (Owner) recibe un email instantáneo y el cajero ve una advertencia en pantalla.

---

## 4. Fases Recomentadas de Implementación (Plan a IA)

1.  **Fase de Setup de Infraestructura:** Configuración de monorepositorio, CI/CD de despliegue automatizado, entornos (Staging/Producción) e inicialización de Supabase con esquema de Base de Datos enfocado a Multi-Tenant.
2.  **Fase de Autenticación y API:** Diseño completo del esquema ERD (Usuarios, Funciones, Menú, Insumos, Recetas, Bodega).
3.  **Fase Point of Sale (POS):** Construcción del Layout Táctil, lógica de carrito, impuestos y la cola de procesamiento "Offline".
4.  **Fase KDS (Tiempo Real):** Componentes basados en WebSockets que reaccionan a los 'INSERTS' en la tabla de órdenes de Supabase.
5.  **Fase Inventario (Backoffice):** Desarrollo del algoritmo de conversión de recetas y el CRUD de control de existencias.
6.  **Fase Integraciones Delivery (Webhook):** Estandarización de un endpoint para ingestar pedidos de UberEats / PedidosYa unificando todo directo hacia la pantalla del Barista.

---

## 5. Criterios de Referencia de Archivos (Para estructurar el código)

- `apps/pos/src/...` (Aplicación de cajeros)
- `apps/kds/src/...` (Aplicación de display de cocina)
- `apps/admin/src/...` (Dashboard gerente general)
- `packages/ui/...` (Componentes globales compartidos)
- `packages/database/...` (Esquemas, migraciones e integraciones Drizzle/Prisma)
- `packages/pos-hardware/...` (Utilería nativa: APIs para impresoras y cajones de cobro).
