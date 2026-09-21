# Genes Creativos — versión para GitHub Pages

Este paquete contiene la página completa: inicio, Moda, Digital, Branding, Quiénes somos, Misión y visión, animaciones, imágenes y conexión al Sheet Maestro.

El logo oficial `logo-genes-creativos.svg` ya está incluido, vinculado y configurado como imagen predeterminada de la cabecera y del favicon.

## Publicarla gratis en GitHub Pages

1. Descomprime el archivo ZIP.
2. Crea un repositorio público nuevo en GitHub.
3. En **Add file → Upload files**, sube **todo el contenido de esta carpeta**, incluido `index.html`. No subas únicamente el ZIP.
4. En el repositorio entra a **Settings → Pages**.
5. En **Build and deployment** selecciona **Deploy from a branch**.
6. Elige la rama **main**, carpeta **/(root)** y pulsa **Save**.
7. GitHub mostrará la dirección pública después de unos minutos.

## Conexión con Google Sheets

El sitio ya está conectado al Sheet con ID:

`1fSN5bKFz-tC3AxLItB7uYDhsjNa1qGlo3ekUDpddU-I`

El documento debe continuar compartido como **Cualquier persona con el enlace — Lector**. No cambies los nombres de las pestañas, columnas ni los IDs existentes.

## Hacer editable el logo y los colores

En la pestaña **Configuracion**, agrega estas filas debajo de las actuales. Mantén exactamente los nombres de la columna **Campo**:

| ID | Grupo | Campo | Valor | Descripción | Activo |
|---|---|---|---|---|---|
| CFG015 | Marca | logo_url | PEGA_AQUÍ_EL_ENLACE | Logo opcional para reemplazar el incluido | Sí |
| CFG016 | Marca | mostrar_nombre_marca | Sí | Mostrar texto junto al logo | Sí |
| CFG017 | Marca | logo_alt | Genes Creativos | Texto alternativo | Sí |
| CFG018 | Marca | favicon_url | PEGA_AQUÍ_EL_ENLACE | Ícono de la pestaña | Sí |
| CFG019 | Diseño | color_principal | #b7ff3c | Color principal | Sí |
| CFG020 | Diseño | color_secundario | #36e5ff | Color secundario | Sí |
| CFG021 | Diseño | color_terciario | #9e6cff | Color terciario | Sí |

El logo puede ser PNG, JPG, WebP o SVG. Si está en Google Drive, compártelo como **Cualquier persona con el enlace — Lector** y pega ese enlace en `logo_url`.

## Qué puedes editar desde el Sheet

- Logo, nombre, colores, favicon y datos de contacto.
- Banners, imágenes, títulos, botones y textos principales.
- Productos, prendas, tallas, materiales, colores y personalización.
- Servicios y mensajes de WhatsApp.
- Testimonios y redes sociales.
- Contadores, ciudades y puntos del mapa.

Los cambios de estructura, animaciones o distribución siguen realizándose en el código.
