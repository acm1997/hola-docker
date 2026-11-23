import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const files={};
for (const name of (await readdir(new URL('public/',root))).sort()) {
  const data=await readFile(new URL('public/'+name,root));
  files[name]=name.endsWith('.png')?data.toString('base64'):data.toString('utf8');
}
const template=await readFile(new URL('src/worker.mjs',root),'utf8');
const source=template.replace("import { files } from './assets.mjs';",()=> 'const files = '+JSON.stringify(files)+';');
await mkdir(new URL('dist/',root),{recursive:true});
await writeFile(new URL('dist/worker.mjs',root),source);
