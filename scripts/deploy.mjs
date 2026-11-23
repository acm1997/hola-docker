import './build.mjs';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const config=JSON.parse(await readFile(new URL('deploy.config.json',root),'utf8'));
const token=process.env.CLOUDFLARE_API_TOKEN;
if(!token) throw Error('Configura CLOUDFLARE_API_TOKEN en el entorno de despliegue.');
const accountId=process.env.CLOUDFLARE_ACCOUNT_ID, kvId=process.env.TRAMO_KV_ID;
if (!accountId || !kvId) throw Error('Configura CLOUDFLARE_ACCOUNT_ID y TRAMO_KV_ID.');
config.metadata.bindings.find(binding=>binding.name==='PROPUESTAS').namespace_id=kvId;
const headers={Authorization:'Bearer '+token};
const url='https://api.cloudflare.com/client/v4/accounts/'+accountId+'/workers/scripts/'+config.name;
async function send(endpoint,options) {
  const result=await fetch(endpoint,options);
  const data=await result.json();
  if(!result.ok || !data.success) throw Error('Cloudflare '+result.status+' '+JSON.stringify(data.errors));
}
const form=new FormData();
form.append('metadata',new Blob([JSON.stringify(config.metadata)],{type:'application/json'}));
form.append('worker.mjs',new Blob([await readFile(new URL('dist/worker.mjs',root))],{type:'application/javascript+module'}),'worker.mjs');
await send(url,{method:'PUT',headers,body:form});
await send(url+'/subdomain',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({enabled:true,previews_enabled:false})});
console.log('Tramo publicado.');
