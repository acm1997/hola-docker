// Original schematic, drawn on a fixed atlas grid to keep markers on the road.
(() => {
  const canvas = document.getElementById('mapa');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  function elevation(x, y) {
    return 19 * Math.sin(x / 52 + y / 94) + 15 * Math.cos(y / 34 - x / 83)
      + 9 * Math.sin(x / 25 - y / 72) + 6 * Math.cos(y / 17 + x / 90)
      + 55 * Math.exp(-((x - 355) ** 2 / 19000 + (y - 200) ** 2 / 8400));
  }
  const contours = new Path2D();
  for (let x = -150; x < 750; x += 6) for (let y = -75; y < 390; y += 6) {
    const pts = [[x,y],[x+6,y],[x+6,y+6],[x,y+6]];
    const z = pts.map(([a,b]) => elevation(a,b));
    for (let h = Math.ceil(Math.min(...z)/4)*4; h <= Math.max(...z); h += 4) {
      const hits = [];
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4;
        if ((z[i] < h) === (z[j] < h)) continue;
        const t = (h - z[i]) / (z[j] - z[i]);
        hits.push([pts[i][0] + t * (pts[j][0]-pts[i][0]), pts[i][1] + t * (pts[j][1]-pts[i][1])]);
      }
      for (let i=1;i<hits.length;i+=2) { contours.moveTo(...hits[i-1]); contours.lineTo(...hits[i]); }
    }
  }
  const river = new Path2D('M -80 18 C 0 7 27 86 91 76 S 156 41 181 76 S 208 122 252 111 S 297 160 337 162 S 383 158 405 186 S 481 207 519 242 S 583 246 671 310');
  const road = new Path2D('M 96 214 C 121 203 113 171 146 168 S 190 199 208 178 S 189 145 213 139 S 275 162 285 131 S 290 96 318 97 S 344 131 366 117 S 367 79 391 81 S 430 104 455 86 L 477 72');
  const lane = new Path2D('M -36 199 C 36 166 58 231 96 214 S 138 222 164 259 S 238 269 286 336 M 318 97 C 323 52 269 48 265 -25 M 366 117 C 421 136 448 159 519 143 S 612 185 656 192 M 477 72 C 506 32 560 51 624 16');
  const trail = new Path2D('M 57 -22 Q 108 28 130 89 T 211 140 M 284 132 Q 318 171 297 205 T 363 291 M 593 33 Q 543 67 560 101 T 520 143');
  function stroke(path,color,width) {ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke(path);}
  function marker(x,y,label,above) {
    ctx.fillStyle='#fbf6de';ctx.beginPath();ctx.arc(x,y,8,0,2*Math.PI);ctx.fill();
    ctx.strokeStyle='#243d2d';ctx.lineWidth=2.2;ctx.stroke();
    ctx.beginPath();ctx.arc(x,y,3,0,2*Math.PI);ctx.fillStyle='#2a4431';ctx.fill();
    ctx.font='bold 12px Arial, sans-serif';ctx.textAlign='center';
    ctx.lineWidth=4;ctx.strokeStyle='#e7ebd8';ctx.strokeText(label,x,y+(above?-15:24));
    ctx.fillStyle='#2c4934';ctx.fillText(label,x,y+(above?-15:24));
  }
  function draw() {
    const w=canvas.clientWidth,h=canvas.clientHeight;
    if(!w || !h) return;
    const dpr=Math.min(window.devicePixelRatio || 1,2);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    ctx.scale(dpr,dpr);const scale=Math.max(w/600,h/300);
    ctx.translate((w-600*scale)/2,(h-300*scale)/2);ctx.scale(scale,scale);
    ctx.fillStyle='#e9ead3';ctx.fillRect(-150,-100,950,510);
    for (const [x,y,r] of [[22,140,95],[336,-30,95],[501,258,135],[210,289,85]]) {
      const grad=ctx.createRadialGradient(x,y,4,x,y,r);
      grad.addColorStop(0,'#abc19b'); grad.addColorStop(1,'#b4c79900');
      ctx.fillStyle=grad;ctx.fillRect(x-r,y-r,r*2,r*2);
    }
    stroke(contours,'#8d9e768f',.75);
    for(let x=0;x<750;x+=55){ctx.fillStyle='#556e5120';ctx.fillRect(x,-70,.55,450);}
    for(let y=0;y<390;y+=55){ctx.fillStyle='#556e5120';ctx.fillRect(-120,y,900,.55);}
    ctx.lineCap='round';ctx.lineJoin='round';
    stroke(river,'#adc7b9',6);stroke(river,'#c7dbcd',2);
    ctx.setLineDash([3,3]);stroke(trail,'#9e9e79',1.2);ctx.setLineDash([]);
    stroke(lane,'#a9a390',3.9);stroke(lane,'#f6efd9',2.3);
    stroke(road,'#f8f4e5',9);stroke(road,'#844a34',5.2);stroke(road,'#c96b42',3.5);
    for (const [x,y] of [[55,116],[67,122],[50,127],[409,241],[423,235],[437,243],[426,251],[337,30],[347,37]]) {
      ctx.fillStyle='#829b79';ctx.beginPath();ctx.moveTo(x,y-4);ctx.lineTo(x+3,y+3);ctx.lineTo(x-3,y+3);ctx.closePath();ctx.fill();
    }
    marker(96,214,'Origen',false);marker(477,72,'Destino',true);
  }
  if ('ResizeObserver' in window) new ResizeObserver(draw).observe(canvas); else window.addEventListener('resize',draw);
  draw();
})();
