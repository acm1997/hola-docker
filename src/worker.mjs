import { files } from './assets.mjs';

const origin = 'https://tramo-viajes.angel12cm.workers.dev';
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[ch]));
const baseHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'",
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'X-Content-Type-Options':'nosniff',
};
function response(body, type, status=200, cache='no-store', extra={}) {
  return new Response(body,{status,headers:{...baseHeaders,'Content-Type':type,'Cache-Control':cache,...extra}});
}
const html=(body,status=200)=>response(body,'text/html; charset=utf-8',status);
const brand='<a class="brand" href="/" aria-label="Tramo, inicio"><img width="35" height="35" src="/marca.png" alt="">tramo<span>.</span></a>';
function page(title,content) {
  return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f8f7f0"><title>'+escapeHtml(title)+' · Tramo</title><link rel="icon" href="/marca.png"><link rel="stylesheet" href="/estilo.css"></head><body><header><div class="wrap nav">'+brand+'<nav aria-label="Principal"><a href="/#calculadora">Calculadora</a><a href="/colabora">Colabora</a></nav></div></header><main class="wrap"><div class="sub"><a class="back" href="/">← Volver a la calculadora</a>'+content+'</div></main><footer><div class="wrap foot">'+brand+'<div><a href="/colabora">Patrocinios</a><a href="/privacidad">Privacidad y contacto</a></div></div></footer></body></html>';
}
const products=[
  ['Cargador de coche USB-C','Para usar el navegador durante trayectos largos. Comprueba la potencia y el tipo de conector.','cargador coche USB C'],
  ['Bolsa térmica compacta','Para guardar el almuerzo de la ruta. Mide el hueco disponible antes de elegir tamaño.','bolsa termica pequeña viaje'],
  ['Organizador de maletero','Para separar las bolsas y tener a mano lo que vas a usar en las paradas.','organizador maletero plegable'],
];
function home(env) {
  const tag=/^[a-z0-9][a-z0-9-]{0,60}-21$/i.test(env.AMAZON_TRACKING_ID||'')?env.AMAZON_TRACKING_ID:'';
  const cards=products.map(([title,copy,query])=>{
    const url=new URL('https://www.amazon.es/s');url.searchParams.set('k',query);
    if(tag) url.searchParams.set('tag',tag);
    return '<article class="item"><h3>'+title+'</h3><p>'+copy+'</p><a href="'+escapeHtml(url.href)+'" rel="'+(tag?'sponsored ':'')+'noopener">Ver en Amazon.es ↗</a></article>';
  }).join('');
  const disclosure=tag?'En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables. Los enlaces de esta sección son de afiliado.':'Los enlaces abren búsquedas en Amazon.es. Actualmente Tramo no recibe comisión por estas compras.';
  let ad='<aside class="ad"><div><small>Patrocinios</small><strong>¿Tu marca acompaña a quienes viajan?</strong></div><a href="/colabora">Ver espacio disponible ↗</a></aside>';
  if(env.SPONSOR_NAME && env.SPONSOR_URL) {
    let sponsor;
    try {sponsor=new URL(env.SPONSOR_URL);} catch {}
    if(sponsor?.protocol==='https:' && !sponsor.username && !sponsor.password) ad='<aside class="ad"><div><small>Publicidad · Patrocinio</small><strong>'+escapeHtml(env.SPONSOR_NAME)+'</strong></div><a rel="sponsored noopener" href="'+escapeHtml(sponsor.href)+'">Visitar patrocinador ↗</a></aside>';
  }
  return files['index.html'].replace('__CANONICAL__',origin+'/').replace('__GEAR__',()=>cards).replace('__DISCLOSURE__',()=>disclosure).replace('__SPONSOR__',()=>ad);
}
function contact() {
  return page('Colabora',`<h1>Viaja con Tramo<span>.</span></h1><p>¿Llevas un alojamiento, un aparcamiento o una marca de accesorios? Puedes patrocinar la calculadora y llegar a personas que están preparando un viaje en coche.</p><h2>Qué incluye el patrocinio</h2><p>Un espacio junto al presupuesto del viaje con el nombre de tu marca y un enlace directo a tu web, identificado como publicidad. El precio y las fechas se acuerdan antes de publicar.</p><form method="post" action="/propuestas"><h2>Cuéntanos tu propuesta</h2><input type="hidden" name="solicitud" value="${crypto.randomUUID()}"><label>Marca o nombre<input name="marca" maxlength="100" autocomplete="organization" required></label><label>Correo de contacto<input name="correo" type="email" maxlength="254" autocomplete="email" required></label><label>Propuesta o consulta<textarea name="mensaje" rows="4" minlength="10" maxlength="2000" required></textarea></label><label class="trap" aria-hidden="true">Deja este campo vacío<input name="web" tabindex="-1" autocomplete="off"></label><small>Usaremos estos datos para responder a tu consulta. <a href="/privacidad">Privacidad y contacto</a></small><button class="primary" type="submit">Enviar consulta privada →</button></form>`);
}
function privacy() {
  return page('Privacidad y contacto','<h1>Privacidad y contacto<span>.</span></h1><h2>La calculadora</h2><p>El presupuesto se calcula en tu navegador. Al compartirlo, los importes y el número de personas viajan en el fragmento del enlace, después del signo #. Cualquiera que reciba ese enlace podrá verlos. Tramo no instala cookies publicitarias ni incorpora herramientas de analítica de terceros.</p><h2>Consultas privadas</h2><p>El responsable de este proyecto es <a href="https://github.com/acm1997">acm1997</a>. Cuando contactas voluntariamente, el proyecto usa el nombre, el correo y el mensaje para gestionar la consulta. Las propuestas se guardan de forma privada en Cloudflare y caducan a los 90 días. Cloudflare presta el alojamiento y procesa los datos técnicos necesarios para servir y proteger esta web.</p><p>Para consultar o solicitar el borrado de tu mensaje, usa el <a href="/colabora">formulario de contacto</a> con la dirección que empleaste al enviarlo.</p><h2>Enlaces comerciales</h2><p>Los enlaces a comercios abren sitios externos con sus propias condiciones de privacidad. Los patrocinios se identifican como publicidad y la sección de productos indica cuándo genera comisiones.</p>');
}
function message(title,copy,status) {
  return html(page(title,'<h1>'+title+'</h1><p>'+copy+'</p><p><a href="/colabora">Volver al formulario</a></p>'),status);
}
async function receive(request,env) {
  const requestOrigin=new URL(request.url).origin;
  if(request.headers.get('Origin')!==requestOrigin) return message('Origen no válido','Abre el formulario directamente en Tramo.',403);
  if(request.headers.get('Content-Type')?.split(';')[0]!=='application/x-www-form-urlencoded') return message('Formato no válido','Utiliza el formulario de contacto.',415);
  if(Number(request.headers.get('Content-Length'))>24000) return message('Mensaje demasiado largo','Reduce el mensaje a 2000 caracteres.',413);
  const limiter=await env.CONTACT_LIMIT.limit({key:request.headers.get('CF-Connecting-IP')||'local'});
  if(!limiter.success) return message('Demasiados envíos','Espera un minuto antes de volver a intentarlo.',429);
  const reader=request.body?.getReader(); const chunks=[]; let size=0;
  if(!reader) return message('Formulario vacío','Introduce los datos de contacto.',400);
  while(true) {
    const {value,done}=await reader.read();if(done) break;
    size+=value.byteLength;
    if(size>24000){await reader.cancel();return message('Mensaje demasiado largo','Reduce el mensaje a 2000 caracteres.',413);}
    chunks.push(value);
  }
  const fields=new URLSearchParams(await new Blob(chunks).text());
  const val=key=>(fields.get(key)||'').trim();
  const ok=()=>new Response(null,{status:303,headers:{Location:'/recibido','Cache-Control':'no-store'}});
  if(val('web')) return ok();
  const name=val('marca'),email=val('correo'),body=val('mensaje'),id=val('solicitud');
  if(!name || name.length>100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254 || body.length<10 || body.length>2000 || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return message('Revisa la consulta','Introduce un nombre, un correo válido y un mensaje de entre 10 y 2000 caracteres.',400);
  // A retry of the same form writes the same key. No read or listing endpoint is exposed.
  const fingerprint=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(id+'\n'+email.toLowerCase()+'\n'+name+'\n'+body));
  const key='propuesta:'+Array.from(new Uint8Array(fingerprint),b=>b.toString(16).padStart(2,'0')).join('');
  try {await env.PROPUESTAS.put(key,JSON.stringify({fecha:new Date().toISOString(),marca:name,correo:email,mensaje:body}),{expirationTtl:90*86400});}
  catch {return message('Envío pendiente','No hemos podido guardar la consulta. Vuelve atrás e inténtalo de nuevo.',503);}
  return ok();
}
export default {async fetch(request,env) {
  const {pathname}=new URL(request.url);
  const path=pathname.replace(/\/$/,'')||'/';
  if(path==='/propuestas' && request.method==='POST') return receive(request,env);
  if(!['GET','HEAD'].includes(request.method)) return response('Método no permitido','text/plain; charset=utf-8',405,'no-store',{Allow:path==='/propuestas'?'POST':'GET, HEAD'});
  let result;
  if(path==='/') result=html(home(env));
  else if(path==='/colabora') result=html(contact());
  else if(path==='/privacidad') result=html(privacy());
  else if(path==='/recibido') result=html(page('Consulta recibida','<h1>Consulta recibida<span>.</span></h1><p>Tu mensaje se ha guardado. Podremos responderte en el correo que has indicado.</p><a href="/">Volver a Tramo →</a>'));
  else if(path==='/robots.txt') result=response('User-agent: *\nAllow: /\nDisallow: /recibido\nDisallow: /propuestas\nSitemap: '+origin+'/sitemap.xml\n','text/plain; charset=utf-8');
  else if(path==='/sitemap.xml') result=response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['/','/colabora','/privacidad'].map(p=>'<url><loc>'+origin+p+'</loc></url>').join('')+'</urlset>','application/xml');
  else if(path==='/marca.png') result=response(Uint8Array.from(atob(files['marca.png']),c=>c.charCodeAt(0)),'image/png',200,'public, max-age=3600');
  else if(['/estilo.css','/mapa.js','/viaje.js'].includes(path)) result=response(files[path.slice(1)],path.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8',200,'public, max-age=300');
  else result=message('Página no encontrada','Puedes volver a la calculadora desde el enlace superior.',404);
  return request.method==='HEAD'?new Response(null,result):result;
}};
