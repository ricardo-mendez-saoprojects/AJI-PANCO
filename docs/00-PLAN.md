# Plan de Rediseño — Web Andre Fernández «Aji-Panco»

## 1. Objetivo
Refinar el diseño visual, jerarquía y acabados del sitio web oficial de Andre Fernández (https://andrefernandez.es), asegurando máxima calidad estética y accesibilidad, para su posterior puesta en producción en la rama `rediseno-produccion`.

## 2. Estado Actual Verificado
- **Repositorio:** Git sincronizado con `origin/main`.
- **Rama de trabajo:** `rediseno-produccion`.
- **Arquitectura:** HTML5 estático de una sola página, SCSS modular con Gulp 4, Vanilla JS.
- **Producción compilada:** `public/build/` versionado y funcional en local sin dependencias activas de compilación.
- **Paleta activa:** Carmesí (modo oscuro exclusivo). 5 variantes en banco de pruebas con `?paletas`.

## 3. Fases Previstas

### Fase 1: Auditoría inicial y diagnóstico
- [ ] Auditoría visual en 1440px, 768px y 375px.
- [ ] Detección de fallos de alineación, contraste, tipografía y espaciado en las 13 secciones.
- [ ] Búsqueda de rutas absolutas, errores de consola y peso de assets.
- [ ] Emisión de informe en `_dev/auditoria-diseno.md`.

### Fase 2: Definición de dirección de diseño
- [ ] Propuesta de 2 direcciones de rediseño detalladas en texto.
- [ ] Elección por parte del cliente/usuario.
- [ ] Ajuste de tokens y componentes afectados.

### Fase 3: Ejecución de ajustes UI/UX
- [ ] Refactorización y pulido de secciones clave.
- [ ] Optimización de contrastes, espaciados y jerarquía visual.
- [ ] Validación de accesibilidad y `prefers-reduced-motion`.

### Fase 4: Build y verificación final
- [ ] Ejecución de `npm run build` para sellar assets de producción.
- [ ] Validación visual multiplataforma (1440, 768, 375 px).
- [ ] Verificación de enlaces, consola y tiempos de carga.

### Fase 5: Cierre y despliegue
- [ ] Actualización de documentación (`docs/04-DEUDA-TECNICA.md`, `DOCUMENTACION.md`).
- [ ] Propuesta de commit estructurado.
- [ ] Preparación para despliegue en producción.
