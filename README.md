# Tramo

[Calculadora pública](https://tramo-viajes.angel12cm.workers.dev/)

Calculadora de combustible, peajes y aparcamiento con reparto entre viajeros. El enlace compartido guarda el presupuesto en el fragmento de la URL. El cálculo se hace en el dispositivo. La web se sirve desde un Cloudflare Worker.

## Desarrollo y publicación

Con Node.js 22 o posterior, ejecuta `node scripts/dev.mjs` en la raíz de este proyecto y abre http://localhost:8787. Las consultas del entorno local quedan en memoria. Para obtener el módulo desplegable, ejecuta `node scripts/build.mjs`.

Para publicar desde un entorno autorizado, configura `CLOUDFLARE_API_TOKEN` con acceso de edición a Workers Scripts de la cuenta y ejecuta `node scripts/deploy.mjs`. Indica también la cuenta en `CLOUDFLARE_ACCOUNT_ID` y el identificador del espacio KV `tramo-patrocinios` en `TRAMO_KV_ID`. El resto de parámetros están en `deploy.config.json`. El despliegue es manual.

## Monetización

- La sección de accesorios usa Amazon.es con el identificador de seguimiento configurado en `AMAZON_TRACKING_ID`. El aviso de afiliación aparece automáticamente cuando hay un identificador válido. El titular gestiona las webs declaradas, la atribución y los pagos desde su cuenta de Amazon Afiliados.
- Las marcas pueden contactar en [/colabora](https://tramo-viajes.angel12cm.workers.dev/colabora). Las propuestas están en Cloudflare, en **Workers KV → tramo-patrocinios**. Las claves empiezan por `propuesta:` y caducan a los 90 días. Conviene revisar el buzón periódicamente. No se envían avisos por correo.
- Cuando acuerdes una campaña, configura las variables de texto `SPONSOR_NAME` y `SPONSOR_URL` (HTTPS) en el Worker y despliega la configuración. El espacio muestra el nombre y el enlace con el rótulo de publicidad. Para retirar la campaña, elimina las dos variables. También puedes gestionarlas en la lista `bindings` de `deploy.config.json`.

Los supuestos del formulario son ejemplos editables. La ida y vuelta duplica distancia y peajes. El aparcamiento se suma una sola vez. El cálculo de líneas y del reparto se redondea al céntimo.
