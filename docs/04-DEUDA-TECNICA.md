# Deuda Técnica y Tareas Pendientes — Web Aji-Panco

Puntos pendientes y deuda técnica migrados desde `DOCUMENTACION.md` (§10) para su seguimiento y resolución durante el ciclo de vida del proyecto.

## 1. Bloqueante para publicar
- [x] **[H-10] Galería invisible en móvil vertical (375px / 440px):** (Resuelto) Ajustado el rootMargin del IntersectionObserver a `0px 0px 200px 0px` con threshold dinámico para secciones de gran altura.
- [x] **[D-01] Combate de Leeds (Hitman Fight League):** (Resuelto) Confirmado combate único por el título europeo WMO el 10 de mayo de 2025 en Leeds (Hitman Fight League, 53,5 kg) frente a Fergus Smith. Integrado en el bloque destacado #combates con fecha exacta y contexto de campeón de España aspirante, e incorporado a la cronología de #trayectoria junto al palmarés contrastado (subcampeonatos 2022/2023, viajes a Camboya e Irlanda, faceta de entrenador y campamento en Tailandia).
- [x] **Ruta absoluta en 404.html (Línea 29):** (Resuelto en Fase 1) Cambiado `href="/"` por `href="index.html"` para compatibilidad con subdirectorios y GitHub Pages.

## 2. Importante (No bloqueante)
- [x] **[H-06] Solapamiento de botón flotante WhatsApp (.wa-float) en hero:** Resuelto mediante aparición diferida por scroll vía IntersectionObserver sobre el Hero, con fallback CSS accesible `@media (scripting: none)`.
- [ ] **Logotipo propio:** No existe marca gráfica personal de Andre. El favicon es provisional (marco de esquinas + «A») y la imagen de Open Graph reutiliza una foto de combate.
- [x] **[D-04] Instagram profesional:** (Resuelto en Bloque A) Actualizadas las cuatro referencias en `index.html` (evento Hitman, sección contacto, footer) y el `sameAs` del JSON-LD a la cuenta oficial `@ajipanco.fernandez` (`https://www.instagram.com/ajipanco.fernandez/`).
- [x] **[D-05] Franja de patrocinadores:** (Resuelto en Bloque A) Eliminadas las siluetas genéricas provisionales y reconfigurada la franja `.logo-band` a 3 columnas con `max-width: 880px` centrada (Kai Muay, SAOProjects y espacio para Marenca Real Estate).
- [ ] **Dossier de patrocinio en PDF:** Actualmente el CTA de descarga enlaza directamente a WhatsApp. Debe crearse y alojarse el PDF oficial de esponsorización.
- [ ] **Elección de paleta definitiva:** Evaluar variantes en `?paletas`. La paleta carmesí se mantiene por defecto en producción salvo decisión explícita.

## 3. Opcional / Mejoras futuras
- [x] **[H-07] Verificación de renderizado de sección Momentos:** Comprobado que no existe fallo de renderizado en móvil. En capturas de viewport sobredimensionado (1641px), `min-height: 100svh` expande el hero y sitúa Momentos en y=3221px (fuera del corte de imagen). En navegación móvil interactiva, `IntersectionObserver` añade `.in` y las fotos y acordeón cargan con total normalidad.
- [ ] **Testimonios de prensa y entrenadores:** Si se obtienen citas contrastadas del coach o promotores, recuperar el componente visual de testimonios.
- [ ] **Vídeo de fondo en Hero:** Evaluar si amerita el impacto en rendimiento frente al peso ligero del AVIF actual.
- [ ] **Marcado JSON-LD `SportsEvent` para combates futuros:** Retirado el bloque `SportsEvent` del combate de Leeds (mayo de 2025 ya disputado) para evitar advertencias en Google Search Console y mantener los logros en la propiedad `award` de `Person`. Volver a añadir un `SportsEvent` cuando haya un combate futuro confirmado con fecha, rival, recinto y enlace oficial de venta de entradas.
- [x] **Actualización de récord (17-9-1, 27 combates) y representación oficial:** Récord contrastado e incorporado el hito del torneo IPCC World Kun Khmer Championship (Phnom Penh, feb 2026). Contacto actualizado a la representación oficial de SAOProjects Studio (+34 614 828 507) en todas las fichas, enlaces wa.me, botón flotante y metadatos.
- [ ] **Mantenimiento recurrente — Bloque de actualidad (Tailandia):** El bloque destacado `.trayectoria-actual` («Ahora mismo · Tailandia · Preparación de combate») es un estado temporal. Cuando Andre regrese de su estancia o dispute su próximo combate, actualizar o retirar este bloque para mantener la vigencia de la información.
- [ ] **Foto duplicada:** La imagen `victoria-brazo-alto` se usa simultáneamente en Historia y en el panel 5 del acordeón de Momentos. Sustituir una de ellas por otra captura del archivo.
- [ ] **Etiqueta «Equipo y colaboradores»:** Evaluar redacción o supresión de la franja bajo el hero según feedback del cliente.
- [ ] **Ritmo y alternancia de fondos:** Las secciones Historia y Momentos van consecutivas sin la clase `.alt`. Evaluar alternancia si se percibe monotonía visual.
