import './build.mjs';
import http from 'node:http';
import {readFile} from 'node:fs/promises';
const {default:worker}=await import('../dist/worker.mjs');
const config=JSON.parse(await readFile(new URL('../deploy.config.json',import.meta.url),'utf8'));
const localInbox=new Map();
const env={PROPUESTAS:{put:async(key,val)=>localInbox.set(key,val)},CONTACT_LIMIT:{limit:async()=>({success:true})}};
for (const binding of config.metadata.bindings) if(binding.type==='plain_text') env[binding.name]=binding.text;
const port=Number(process.env.PORT||8787);
http.createServer(async(req,res)=>{
  try {
    const body=[];for await(const chunk of req) body.push(chunk);
    const init={method:req.method,headers:req.headers};
    if(body.length) init.body=Buffer.concat(body);
    const request=new Request('http://'+req.headers.host+req.url,init);
    const reply=await worker.fetch(request,env);
    res.writeHead(reply.status,Object.fromEntries(reply.headers));res.end(Buffer.from(await reply.arrayBuffer()));
  } catch(e){console.error(e);res.writeHead(500);res.end('Error local');}
}).listen(port,'127.0.0.1',()=>console.log('Tramo en http://localhost:'+port));
