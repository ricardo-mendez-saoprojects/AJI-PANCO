# Procedimiento de Despliegue en Producción — andrefernandez.es

Guía operativa para el despliegue del sitio oficial de Andre Fernández «Aji-Panco» en el hosting de producción (Hostinger).

---

## 1. Datos del Entorno y Modelo de Despliegue

- **Dominio principal:** `https://andrefernandez.es`
- **Proveedor:** Hostinger (Alojamiento Web / Apache).
- **Ruta raíz en el servidor:** `public_html/` (o `domains/andrefernandez.es/public_html/`).
- **Pila en producción:** Sitio web estático puro (HTML5, Vanilla CSS Dart Sass, Vanilla JS Terser, Apache `.htaccess`).
- **Modelo de compilación:**
  - **Hostinger NO compila en el servidor:** El comando `npm run build` está **desactivado** en la plataforma de Hostinger para evitar instalar `node_modules` en el servidor (eliminando cualquier aviso o superficie de vulnerabilidades de herramientas de desarrollo).
  - **`public/build/` está versionado en Git:** La web se sirve directamente desde los archivos compilados que ya residen en el repositorio `main`.
  - **Compilación 100% local y obligatoria:** Es responsabilidad exclusiva del desarrollador ejecutar `npm run build` en local antes de commitear y hacer push a `main`.

---

## 2. Red de Seguridad Local: Hook de Pre-Commit

Para garantizar que nunca se suba HTML o fuentes de `src/` desincronizados del CSS/JS compilado en `public/build/`, el proyecto cuenta con un hook de Git.

### ¿Qué hace el hook?
Inspecciona el área de preparación (staging) antes de cada `git commit`:
- Si detecta cambios en `src/` (SCSS, JS modular, imágenes fuente) pero no incluye los archivos actualizados de `public/build/`, **aborta el commit inmediatamente** con un mensaje de error explicativo y código de salida 1.
- Exige ejecutar `npm run build` y añadir `public/build/` al commit antes de continuar.

### Instalación en una máquina nueva
Como la carpeta `.git/hooks/` no se versiona en Git, el hook se mantiene archivado en `_dev/hooks/pre-commit`. Al clonar el proyecto en un equipo nuevo, instálalo con:
```bash
cp _dev/hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Cómo saltarse el hook (solo emergencias)
Si alguna vez se requiere commitear un cambio documental o puntual sin compilar:
```bash
git commit --no-verify -m "mensaje del commit"
```

---

## 3. Preparación Local del Paquete

Antes de desplegar o sincronizar con el servidor:

1. **Asegúrate de estar en `main` y con cambios al día:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Compila en modo producción:**
   ```bash
   npm run build
   ```
   *(Esto purga hashes antiguos, minifica CSS/JS, optimiza imágenes AVIF/WebP y sella `index.html` y `404.html` con los hashes `?v=hash`).*

3. **Ejecuta el script empaquetador (si subes por FTP manual):**
   ```bash
   ./_dev/preparar-despliegue.sh
   ```
   *(Genera la carpeta `_dist/` con los 98 archivos exactos listos para subir).*

---

## 4. Métodos de Despliegue en Hostinger

### Vía 1: Despliegue Git Automático desde hPanel
Si Hostinger está conectado al repositorio GitHub de `main`:
1. El despliegue toma directamente los archivos del commit en `main`.
2. Como `public/build/` está versionado y el comando de build está desactivado en hPanel, el despliegue es instantáneo (cero instalación de dependencias, cero riesgos de build en el servidor).

### Vía 2: Gestor de Archivos (hPanel)
1. Accede a **hPanel > Sitios Web > andrefernandez.es > Administrador de Archivos**.
2. Entra en la carpeta **`public_html`**.
3. Comprime el contenido interior de `_dist/` en un archivo `despliegue.zip`.
4. Sube `despliegue.zip` a `public_html` y dale a **Extraer**.
5. Elimina el archivo `despliegue.zip` tras extraer.

### Vía 3: FTP / SFTP (FileZilla, Cyberduck)
1. Conecta con tus credenciales FTP de Hostinger (Host, Usuario, Contraseña, Puerto 21 / 22).
2. En el panel remoto, navega hasta **`public_html/`**.
3. En el panel local, navega dentro de la carpeta **`_dist/`**.
4. Sube los archivos en el orden indicado en la sección 5.

---

## 5. Orden de Subida Crítico (Despliegue Manual)

Para evitar que un visitante cargue un `index.html` que pida assets con hashes nuevos que aún no existen en el servidor, sigue este orden:

1. **Subir la carpeta `public/` (`public/build/`):**
   - Asegura que todos los CSS con hash, fuentes, JS e imágenes nuevas ya estén en disco.
2. **Subir archivos de infraestructura:**
   - `robots.txt`
   - `sitemap.xml`
   - `.htaccess`
3. **Subir página de error:**
   - `404.html`
4. **Subir página principal (al final):**
   - `index.html`

---

## 6. Qué NO Subir (Seguridad e Higiene)

Verifica que en `public_html/` **NO** se encuentren:
- `.git/` ni `.gitignore` (vulnerabilidad crítica de exposición de código).
- `node_modules/` (innecesario y fuente de avisos de seguridad de dependencias de build).
- `src/` (código fuente no optimizado).
- `_dev/` (herramientas internas de pruebas).
- `docs/` (documentación interna).
- `package.json`, `package-lock.json`, `gulpfile.js`.
- Archivos `.md`.

---

## 7. Verificación Post-Despliegue (Checklist de Validación)

Ejecuta estas comprobaciones desde la terminal o el navegador:

### 1. Redirección canónica (www a no-www)
```bash
curl -I https://www.andrefernandez.es
```
*Debe responder `HTTP/2 301` o `302` con `location: https://andrefernandez.es/`.*

### 2. Redirección HTTP a HTTPS
```bash
curl -I http://andrefernandez.es
```
*Debe responder `301 Moved Permanently` hacia `https://...` gestionado por Hostinger.*

### 3. Cabeceras de seguridad y caché en HTML
```bash
curl -I https://andrefernandez.es/
```
*Debe incluir:*
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Cache-Control: max-age=0` (HTML sin caché agresiva)

### 4. Tipos MIME de AVIF y WOFF2
```bash
curl -I https://andrefernandez.es/public/build/fonts/sora-variable.woff2
curl -I https://andrefernandez.es/public/build/img/fotos/hero-entrada-ring.avif
```
*Deben devolver `content-type: font/woff2` y `content-type: image/avif` con `cache-control: max-age=31536000` (1 año).*

### 5. Página de error 404 personalizada
Visita en el navegador `https://andrefernandez.es/ruta-inexistente-test`.
*Debe cargar el diseño oscuro de `404.html` con el botón para volver al inicio.*

### 6. Inspección en navegador móvil y escritorio
Abre una ventana de incógnito en el móvil y escritorio:
- Comprueba que la galería carga con todas las fotos.
- Comprueba que las fichas de SAOProjects y Marenca abren sus webs en nueva pestaña.
- Comprueba el botón de WhatsApp y volver arriba.

---

## 8. Plan de Rollback (Contingencia)

Si se detecta cualquier problema crítico tras desplegar:

1. **Restauración inmediata desde Hostinger (vía hPanel):**
   - Entra a **hPanel > Archivos > Copias de seguridad**.
   - Selecciona la copia de seguridad automática más reciente de `public_html/` anterior al despliegue y pulsa **Restaurar**.
2. **Restauración manual vía Git:**
   ```bash
   # Vuelve al commit anterior a este despliegue
   git checkout 22e96a4
   npm run build
   ./_dev/preparar-despliegue.sh
   ```
   Sube el contenido de `_dist/` por FTP sobrescribiendo los archivos en `public_html/`.
