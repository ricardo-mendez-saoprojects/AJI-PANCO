# Deuda Técnica y Tareas Pendientes — Web Aji-Panco

Puntos pendientes y deuda técnica migrados desde `DOCUMENTACION.md` (§10) para su seguimiento y resolución durante el ciclo de vida del proyecto.

## 1. Bloqueante para publicar
- [ ] **Combate de Leeds:** El cartel actual no indica el año ni el resultado. Si ya se disputó, el bloque destacado debe actualizarse y pasar a la línea de tiempo cronológica.
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
- [ ] **Foto duplicada:** La imagen `victoria-brazo-alto` se usa simultáneamente en Historia y en el panel 5 del acordeón de Momentos. Sustituir una de ellas por otra captura del archivo.
- [ ] **Etiqueta «Equipo y colaboradores»:** Evaluar redacción o supresión de la franja bajo el hero según feedback del cliente.
- [ ] **Ritmo y alternancia de fondos:** Las secciones Historia y Momentos van consecutivas sin la clase `.alt`. Evaluar alternancia si se percibe monotonía visual.
