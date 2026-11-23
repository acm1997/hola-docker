(() => {
  const form=document.querySelector('#viaje');
  if (!form) return;
  const byId=id=>document.getElementById(id);
  const ids=['km','consumo','precio','peajes','parking','personas'];
  const eur=new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'});
  const qty=new Intl.NumberFormat('es-ES',{maximumFractionDigits:2});
  const params=new URLSearchParams(location.hash.slice(1));
  for (const id of ids) {
    const input=byId(id), value=params.get(id);
    if (value !== null && /^\d{1,6}(\.\d{1,8})?$/.test(value)) {
      input.value=value;
      if (!input.validity.valid) input.value=input.defaultValue;
    }
  }
  if(params.get('trayecto')==='vuelta') form.elements.trayecto.value='vuelta';
  const cents=amount=>Math.round((amount+Number.EPSILON)*100);
  let current;
  function update() {
    const valid=form.checkValidity();
    const round=form.elements.trayecto.value==='vuelta';
    const [km,consumption,price,tolls,park,people]=ids.map(id=>byId(id).valueAsNumber);
    byId('menos').disabled=people<=1;byId('mas').disabled=people>=60;
    byId('manual').hidden=true;byId('compartir').disabled=!valid;
    byId('estado').textContent=valid?'':'Revisa los campos para ver tu presupuesto.';
    const distance=km*(round?2:1), litres=distance*consumption/100;
    const fuel=cents(litres*price), toll=cents(tolls*(round?2:1)), parking=cents(park);
    const total=(fuel+toll+parking)/100, each=Math.round((fuel+toll+parking)/people)/100;
    const euro=amount=>valid?eur.format(amount):'—';
    current={distance,total,each,people,round};
    for(const [id,amount] of Object.entries({'total':total,'por-persona':each,'coste-gas':fuel/100,'coste-peajes':toll/100,'coste-parking':parking/100})) byId(id).textContent=euro(amount);
    byId('litros').textContent=valid?'· '+qty.format(litres)+' l':'';
    byId('map-km').textContent=byId('km').validity.valid?qty.format(distance)+' km':'— km';
    byId('map-dir').textContent=round?'Ida y vuelta':'Solo ida';
  }
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('input',update);
  for(const [id,delta] of [['menos',-1],['mas',1]]) {
    byId(id).addEventListener('click',()=>{
      const input=byId('personas');
      input.value=Math.max(1,Math.min(60,Math.round(input.valueAsNumber || 1)+delta));update();
    });
  }
  byId('compartir').addEventListener('click',async()=>{
    if(!form.checkValidity()) return;
    const link=new URL(location.pathname,location.origin);
    link.hash=new URLSearchParams(new FormData(form)).toString();
    const {distance,total,each,people}=current;
    const summary=qty.format(distance)+' km · '+eur.format(total)+' en total · '+eur.format(each)+' por persona ('+people+' en el coche).';
    const status=byId('estado');
    if(navigator.share){
      try {await navigator.share({title:'Presupuesto de viaje · Tramo',text:summary,url:link.href});return;}
      catch(err){if(err.name==='AbortError') return;}
    }
    try {await navigator.clipboard.writeText(link.href);status.textContent='Enlace copiado. Ya puedes enviarlo al grupo.';}
    catch {byId('manual').hidden=false;byId('enlace').value=link.href;byId('enlace').select();status.textContent='Copia este enlace para compartir tu presupuesto.';}
  });
  update();
})();
