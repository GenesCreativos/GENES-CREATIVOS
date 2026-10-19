# Genes Creativos — instalación en GitHub Pages

Este paquete contiene la página completa en una sola landing: catálogo, carrito, animaciones, banners, mapa, redes sociales, testimonios y pedido por WhatsApp.

## 1. Conectar un Google Sheet nuevo

1. Abre el nuevo Google Sheet.
2. Presiona **Compartir**.
3. En “Acceso general” selecciona **Cualquier persona con el enlace**.
4. Déjalo como **Lector**.
5. Copia el enlace completo.
6. Abre el archivo `config.js` con Bloc de notas.
7. Reemplaza únicamente el enlace que aparece después de `SHEET_URL:`.
8. Conserva las comillas, la coma y los nombres de las pestañas del Sheet.
9. Guarda el archivo.

Ejemplo:

```js
window.GENES_CONFIG = {
  SHEET_URL: "PEGA_AQUÍ_EL_ENLACE_COMPLETO_DEL_NUEVO_SHEET",
  PUBLIC_SITE_URL: "https://genescreativos.github.io/GENES-CREATIVOS/"
};
```

No necesitas editar `index.html` para cambiar de Sheet.

## 2. Reemplazar la página en GitHub

1. Descomprime `Genes_Creativos_GitHub_Pages.zip`.
2. Entra al repositorio de GitHub donde está publicada la página.
3. En la pestaña **Code**, presiona **Add file** → **Upload files**.
4. Arrastra **el contenido descomprimido**, incluyendo `index.html`, `config.js`, `robots.txt`, `sitemap.xml` y la carpeta `assets`.
5. GitHub mostrará que los archivos existentes serán reemplazados.
6. En “Commit changes” escribe: `Actualizar web Genes Creativos`.
7. Presiona el botón verde **Commit changes**.

No subas únicamente el ZIP: primero debes descomprimirlo.

## 3. Activar o revisar GitHub Pages

1. En el repositorio entra en **Settings**.
2. En el menú izquierdo selecciona **Pages**.
3. En “Build and deployment” selecciona **Deploy from a branch**.
4. Selecciona la rama **main** y la carpeta **/(root)**.
5. Presiona **Save**.
6. Espera entre uno y cinco minutos.
7. Abre la dirección mostrada por GitHub Pages.

## 4. Actualizar productos y contenido

- Edita productos, tallas, materiales, colores, precios y categorías en el Google Sheet.
- Para mostrar un registro, marca `Activo` como `Sí`.
- Para ocultarlo, marca `Activo` como `No`.
- No cambies los nombres de las pestañas ni los encabezados.
- La web evita la caché del Sheet para consultar la información más reciente.

## 5. Cambiar de Sheet nuevamente

Solo modifica `config.js`, guarda el archivo y vuelve a subir únicamente ese archivo a GitHub. El resto de la página no necesita reemplazarse.

## 6. Problemas frecuentes

- Si aparece el catálogo de muestra, revisa que el Sheet sea público como **Lector**.
- Si no aparece un producto, verifica `Activo = Sí`.
- Si una imagen no carga, usa una URL pública y directa.
- Si ves la versión anterior, presiona `Ctrl + Shift + R` o abre la página en incógnito.

