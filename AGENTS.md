# AGENTS.md — FCAS Cuba

## Quick Start

```bash
npm install          # instala TODAS las dependencias (frontend + backend)
npm run dev          # arranca API (3001) + Vite (5173) con concurrently
```

**Un solo comando, un solo proyecto.**

## Commands

| Command | Qué hace |
|---|---|
| `npm run dev` | Dev mode: API + frontend concurrently |
| `npm run build` | Vite build + server esbuild → `dist/` |
| `npm run start:prod` | Build + un solo proceso Express sirviendo todo |
| `npm run lint` | TypeScript check (`tsc --noEmit`) — no hay ESLint |
| `npm run db:push` | Push schema Prisma a SQLite |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Prisma Studio |

## Arquitectura

```
FACS/
├── src/                  # React frontend (Vite, Tailwind v4, React 19)
│   ├── api.ts            # Llamadas al backend via fetch + JWT
│   ├── utils/imageUtils.ts   # getImageUrl() resuelve localImage > url
│   └── components/admin/ # Admin dashboard lazy-loaded (7 tabs)
├── server/               # Express backend
│   ├── src/
│   │   ├── index.ts      # Entry point, sirve API + static en prod
│   │   ├── lib/service.factory.ts  # CRUD factory genérico (Prisma)
│   │   ├── lib/crud.factory.ts     # Rutas + controller CRUD genéricos
│   │   ├── routes/index.ts         # Todas las rutas API consolidadas
│   │   └── middleware/             # auth, validate (Zod), upload (Multer), cache
│   ├── prisma/schema.prisma  # SQLite: Gallery, News, Event, Instructor, Graduate, AdminUser
│   └── .env              # DATABASE_URL, JWT_SECRET, PORT=3001
├── server/uploads/images/ # Imágenes subidas (servidas por Express)
└── dist/                 # Build de producción
```

## Key Gotchas

- **`npm run lint` = `tsc --noEmit` solamente.** No hay ESLint.
- **Errores TS pre-existentes** en `src/App.tsx` (useSyncedState) y `src/components/admin/types.ts` (falta import React). El build igual funciona.
- **SQLite** en `server/data/fcas.db`. Se recrea con `db:push`.
- **Prisma generate** corre automáticamente via `postinstall`.
- **Imágenes**: se guardan en `server/uploads/images/`. El backend guarda la URL relativa (ej: `/uploads/images/image-xxx.jpg`). El frontend resuelve via `getImageUrl()` que prioriza `localImage` sobre `url`.
- **Backend sirve frontend** en producción (SPA fallback a `dist/index.html`). En dev, Vite maneja el frontend por separado.
- **Validación Zod** reemplaza `req.body` con el output parseado — campos unknown se eliminan.
- **Patrón CRUD factory**: agregar entidad nueva = `validator` → `service` (via `createCrudService`) → `controller` (via `createCrudController`) → `routes` (via `createCrudRoutes`) → registrar en `server/src/routes/index.ts`.
- **Cache**: galería/noticias/eventos 5m, instructores/graduados 10m.
- **Rate limiting**: 100 req/15min en `/api`, 10 req/15min en `/api/auth`.

## Frontend

- Alias: `@/` = raíz del proyecto
- AdminDashboard y cada tab se cargan via `React.lazy()`
- `useSyncedState` detecta add/update/delete por diff de arrays y sincroniza al backend
- Imágenes: usar `getImageUrl(item)` de `src/utils/imageUtils.ts`
- Tema: Tailwind v4 con paleta `marine-*` y `cyan-*`

## Server

- Alias: `@/` = `server/src/`
- Todos los servicios usan `createCrudService` de `server/src/lib/service.factory.ts`
- Validators en `server/src/validators/` usan Zod
- JWT requerido para mutaciones. GET públicos no requieren auth
- `SERVER_ROOT` apunta a `server/` (no a la raíz del proyecto)

---

## Changelog — 9 de Julio 2026

### Lo que se hizo hoy

#### 1. Proyecto unificado (solo un `package.json`)
- Merge de `server/package.json` en el root. Un solo `npm install` instala todo.
- `npm run dev` usa `concurrently` para arrancar API + Vite juntos.
- Eliminado `server/node_modules` — todo vive en `node_modules/` raíz.

#### 2. Fix de imágenes (3 bugs encadenados)
- **Bug 1 — Vite no proxyaba `/uploads`**: Agregada ruta proxy en `vite.config.ts` apuntando a `localhost:3001`.
- **Bug 2 — LazyImage tapaba la imagen**: `<img>` no tenía `absolute inset-0`, el placeholder lo cubría. Corregido en `src/components/LazyImage.tsx`.
- **Bug 3 — `process.cwd()` apuntaba mal**: El servidor arrancaba desde la raíz del proyecto, no desde `server/`. Reemplazado por `SERVER_ROOT` (derivado de `import.meta.url`) en `server/src/index.ts`, `upload.service.ts`, `upload.controller.ts`, `upload.ts`.

#### 3. Fix de stale closure en todos los tabs
- **Problema**: `setForm({ ...form, url, localImage: url })` capturaba `form` stale al momento del render, no del upload.
- **Solución**: Cambiar a `setForm(prev => ({ ...prev, url, localImage: url }))` en GalleryTab, NewsTab, EventsTab, InstructorsTab.

#### 4. ImageUploader simplificado + imagen persistente
- Eliminado toggle URL/upload mode — solo queda FileUpload (drag & drop).
- FileUpload ahora **mantiene la imagen subida visible** con check verde hasta que el usuario la quite con botón X.
- Nuevas props: `initialPreview` (para editar items existentes) y `onClear` (para limpiar el form).
- Los 4 tabs pasan estas props correctamente.

#### 5. Seguridad
- **Brute force protection**: Límite de 5 intentos de login → bloqueo 15 minutos (memoria).
- **Refresh token endpoint**: `POST /api/auth/refresh` para renovar JWT sin re-login.
- **Rate limiting**: 100 req/15min API, 10 req/15min auth.

#### 6. UX mejorada
- **Toast notifications**: Sistema `ToastProvider` + `useToast()` — notificaciones ephemeral success/error/info.
- **Drag & drop**: FileUpload acepta arrastrar archivos con feedback visual.
- **Skeleton screens**: `TableSkeleton`, `CardSkeleton`, `GallerySkeleton` para estados de carga.
- **Undo delete hook**: `useUndoableDelete()` — 5 segundos para deshacer antes de borrar permanentemente.
- **SearchFilter component**: Búsqueda por texto + filtro por categoría.
- **ExportCSV component**: Exportar datos a CSV con un click.

#### 7. Infraestructura
- Backend sirve frontend en producción (SPA fallback a `dist/index.html`).
- `AGENTS.md` creado con documentación del proyecto.

### Archivos modificados/creados hoy

| Archivo | Cambio |
|---|---|
| `package.json` (root) | Unificado con dependencias del server |
| `server/package.json` | Solo postinstall (prisma generate) |
| `vite.config.ts` | Proxy `/uploads` → localhost:3001 |
| `server/src/index.ts` | `SERVER_ROOT`, serve frontend en prod |
| `server/src/services/upload.service.ts` | `SERVER_ROOT` en vez de `process.cwd()` |
| `server/src/controllers/upload.controller.ts` | `SERVER_ROOT` en vez de `process.cwd()` |
| `server/src/middleware/upload.ts` | `SERVER_ROOT` en vez de `process.cwd()` |
| `server/src/services/auth.service.ts` | Brute force + refresh token |
| `server/src/controllers/auth.controller.ts` | Login, refresh, me |
| `server/src/routes/auth.routes.ts` | Endpoint `/refresh` |
| `src/components/FileUpload.tsx` | Auto-upload, drag & drop, imagen persistente, toast |
| `src/components/admin/ImageUploader.tsx` | Simplificado, props initialPreview/onClear |
| `src/components/admin/GalleryTab.tsx` | Stale closure fix + initialPreview/onClear |
| `src/components/admin/NewsTab.tsx` | Stale closure fix + initialPreview/onClear |
| `src/components/admin/EventsTab.tsx` | Stale closure fix + initialPreview/onClear |
| `src/components/admin/InstructorsTab.tsx` | Stale closure fix + initialPreview/onClear |
| `src/components/admin/types.ts` | ImageUploaderProps actualizado |
| `src/components/Toast.tsx` | Sistema de notificaciones |
| `src/components/LazyImage.tsx` | Placeholder mejorado |
| `src/components/Skeleton.tsx` | Skeleton screens |
| `src/components/UndoableDelete.tsx` | Hook de undo delete |
| `src/components/SearchFilter.tsx` | Búsqueda y filtros |
| `src/components/ExportCSV.tsx` | Exportar a CSV |
| `src/api.ts` | Refresh token support |
| `src/App.tsx` | ToastProvider integrado |
| `src/index.css` | Animaciones toast |
| `AGENTS.md` | Documentación del proyecto |

---

## Próximos pasos — Propuesta para mañana

### Prioridad Alta
1. **Integrar SearchFilter y ExportCSV en los tabs del admin** — Actualmente son componentes sueltos. Hay que meterlos en GalleryTab, NewsTab, EventsTab, etc. con filtros reales por categoría y búsqueda por título.
2. **Integrar Undo delete en los tabs** — Usar `useUndoableDelete` en GalleryTab, NewsTab, EventsTab, InstructorsTab para borrar con confirmación + undo de 5s.
3. **Test end-to-end del flujo de imágenes** — Subir imagen → verificar que aparece en el admin → guardar → verificar que se muestra en el frontend público.

### Prioridad Media
4. **Admin: vista previa de imagen antes de subir** — Ya funciona el preview local, pero verificar que no se rompa al cambiar entre tabs.
5. **Mejorar responsive del admin** — Los forms en mobile están apretados. Revisar grid en pantallas < 768px.
6. **Paginación server-side** — Actualmente `useSyncedState` carga todo de golpe. Para mucha data, implementar paginación con Prisma `skip/take`.

### Prioridad Baja
7. **Eliminar errores TS pre-existentes** — `App.tsx` (useSyncedState return type) y `types.ts` (React namespace).
8. **Tests** — Agregar tests unitarios para servicios del backend y componentes críticos del frontend.
9. **PWA** — Service worker para funcionamiento offline básico.
10. **i18n** — Preparar estructura para soporte multi-idioma (español/inglés).
