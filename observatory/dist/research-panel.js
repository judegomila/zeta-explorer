import { RESEARCH_DEFAULTS, RESEARCH_LIMITS, RESEARCH_ENUMS, RESEARCH_TITLES, normalizeResearchConfig } from './research-state.js';

const ANIMATED=new Set(['modes','ratio','heat']);
const COLORS=['#86d8e8','#eab06f','#bedb9f','#c4a4e7','#ee91aa','#72cfb0'];
const finite=Number.isFinite,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const has=(object,key)=>Object.prototype.hasOwnProperty.call(object||{},key);
const fmt=(value,digits=5)=>typeof value!=='number'?String(value??'—'):!finite(value)?'unresolved':value===0?'0':(Math.abs(value)>=1e5||Math.abs(value)<1e-4?value.toExponential(digits-1):Number(value.toPrecision(digits)).toString()).replace('e-','e−');
const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
const stateKey=state=>JSON.stringify(Object.keys(RESEARCH_DEFAULTS).filter(key=>key!=='researchRate').map(key=>state[key]));
const SOURCE_LABELS={xi:'Completed ξ · analytic',heat:'Theta heat family · analytic',quadratic:'Exact local quadratic · model'};
const ENUM_LABELS={researchSource:SOURCE_LABELS,researchLayer:{shear:'Signed shear W',logShear:'Logarithmic shear Re(F′/F)',phase:'Phase arg F'},researchKernel:{bridge:'Boundary bridge Gram',pick:'Shifted-ratio Pick',logPick:'Log-derivative Pick · real nodes'},researchPath:{vertical:'Vertical spectral path',circle:'Circular spectral path',bridgeSweep:'Transverse bridge sweep'},researchPulseShape:{box:'Single box',pair:'Separated box pair',gaussian:'Gaussian'},researchHeatModel:{theta:'Actual theta heat family',quartic:'Exact quartic collision model'}};
const NOTES={shear:'Click the field to move the probe. Signed colors retain the direction of the transverse response.',modal:'An exact local quadratic: transverse x and local height y are independent of spectral t.',energy:'Compare the even and odd forms with the direct bridge target. Finite quadrature remains a diagnostic.',gram:'Inspect an actual finite Hermitian matrix and its Schur complement. Sampled positivity is not a theorem.',theta:'Watch signed arithmetic blocks and the positive theta kernel enter distinct cancellation calculations.',modes:'A finite signed oscillator basis, with prime rows you can solo or mute.',ratio:'Follow a shifted analytic ratio along a chosen path. Undefined samples stay broken.',pulse:'A finite periodic Fourier experiment with an explicit source and multiplier.',heat:'Follow complex zero continuation or compare it with a known quartic collision.'};
const SOURCE_MODES=['shear','energy','gram','ratio','pulse'];
const PARAMETERS=[
 ['researchSigma','Probe real part σ',['shear','ratio'],'number'],
 ['researchT','Height / center t',['shear','energy','gram','modes','ratio','heat'],'number'],
 ['researchSpan','Height / frequency half-span',['shear','modes','ratio'],'range'],
 ['researchA','Comparison shift a',['shear','energy','gram','ratio','theta'],'range'],
 ['researchTau','Heat parameter τ',SOURCE_MODES,'range'],
 ['researchEpsilon','Quadratic parameter ε',['modal',...SOURCE_MODES],'range'],
 ['researchShift','Transverse x = h',['modal','energy'],'range'],
 ['researchModalY','Local height y',['modal'],'range'],
 ['researchNodes','Node height offsets',['gram'],'text'],
 ['researchNodeImag','Right-half-plane offset Re u',['gram'],'range'],
 ['researchFrozen','Frozen prefix C',['gram'],'range'],
 ['researchBlock','Arithmetic block N',['theta'],'range'],
 ['researchFrequency','Frequency ξ',['theta'],'range'],
 ['researchThetaCutoff','Positive Jacobi terms',['theta'],'range'],
 ['researchPrimeCount','Prime rows',['modes'],'range'],
 ['researchPrimePower','Powers per prime',['modes'],'range'],
 ['researchPrimeSolo','Solo prime index · 0 = none',['modes'],'range'],
 ['researchPrimeMute','Mute prime index · 0 = none',['modes'],'range'],
 ['researchRadius','Path radius',['ratio'],'range'],
 ['researchDelta','Synthetic quartet offset δ',['ratio'],'range'],
 ['researchAlpha','Bridge multiplier α',['pulse'],'range'],
 ['researchPulseWidth','Pulse width',['pulse'],'range'],
 ['researchPulseSeparation','Pair separation',['pulse'],'range'],
 ['researchPulseCutoff','Tail threshold',['pulse'],'range'],
 ['researchHeatEnd','Final heat parameter τ',['heat'],'range'],
 ['researchHeatCount','Tracked theta zeros',['heat'],'range'],
 ['researchContourRadius','Fixed contour radius',['heat'],'range'],
 ['researchRate','Playback rate',['modes','ratio','heat'],'range']
];

function text(ctx,value,x,y,{color='#90aabe',align='center',size=9}={}){ctx.fillStyle=color;ctx.font=`${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(String(value),x,y);}
function ticks(min,max,count=5){const raw=(max-min)/count,p=10**Math.floor(Math.log10(raw||1)),q=raw/p,step=(q<=1?1:q<=2?2:q<=5?5:10)*p;const out=[];for(let x=Math.ceil(min/step)*step;x<=max+step*1e-8&&out.length<30;x+=step)out.push(Math.abs(x)<step*1e-7?0:x);return out;}
function rgbLerp(a,b,t){return a.map((v,i)=>Math.round(v+(b[i]-v)*clamp(t,0,1)));}
function plotColor(value,min,max,palette){
 if(palette==='phase'){const h=(value+Math.PI)/(2*Math.PI)*6,k=((h%6)+6)%6,x=1-Math.abs(k%2-1),rgb=k<1?[1,x,0]:k<2?[x,1,0]:k<3?[0,1,x]:k<4?[0,x,1]:k<5?[x,0,1]:[1,0,x];return rgb.map(v=>Math.round(43+188*v));}
 if(palette==='diverging'){const limit=Math.max(Math.abs(min),Math.abs(max))||1,t=value/limit;return t<0?rgbLerp([37,48,64],[67,157,210],-t):rgbLerp([37,48,64],[236,153,99],t);}
 const t=(value-min)/(max-min||1);return t<.5?rgbLerp([16,32,51],[66,145,168],t*2):rgbLerp([66,145,168],[220,230,150],t*2-1);
}
function ranges(plot){
 const xs=[],ys=[];
 for(const series of plot.series||[])for(const p of series.points||[])if(p&&finite(p[0])&&finite(p[1])){xs.push(p[0]);ys.push(p[1]);}
 for(const p of plot.points||[])if(finite(p.x)&&finite(p.y)){xs.push(p.x);ys.push(p.y);}
 if(plot.unitCircle){xs.push(-1,1);ys.push(-1,1);}
 let xMin=finite(plot.xMin)?plot.xMin:xs.length?Math.min(...xs):0,xMax=finite(plot.xMax)?plot.xMax:xs.length?Math.max(...xs):1;
 let yMin=finite(plot.yMin)?plot.yMin:ys.length?Math.min(...ys):0,yMax=finite(plot.yMax)?plot.yMax:ys.length?Math.max(...ys):1;
 if(xMax===xMin){const d=Math.max(.01,Math.abs(xMin)*.05);xMin-=d;xMax+=d;}
 if(yMax===yMin){const d=Math.max(.01,Math.abs(yMin)*.05);yMin-=d;yMax+=d;}
 if(!finite(plot.xMin)){const d=(xMax-xMin)*.055;xMin-=d;xMax+=d;}
 if(!finite(plot.yMin)){const d=(yMax-yMin)*.08;yMin-=d;yMax+=d;}
 return {xMin,xMax,yMin,yMax};
}

/** A cache-only canvas view. Numerical results arrive from the worker. */
class ResearchPlot {
 constructor(panel,index){
  this.panel=panel;this.index=index;this.card=node('section','research-plot-card');this.heading=node('div','research-plot-heading');this.title=node('h3');this.note=node('small');this.heading.append(this.title,this.note);
  this.area=node('div','research-plot-area');this.canvas=node('canvas');this.canvas.setAttribute('role','img');this.hover=node('div','research-hover');this.hover.hidden=true;this.area.append(this.canvas,this.hover);this.legend=node('div','research-legend');this.card.append(this.heading,this.area,this.legend);this.ctx=this.canvas.getContext('2d');this.map=null;
  this.canvas.addEventListener('pointermove',event=>this.inspect(event));this.canvas.addEventListener('pointerleave',()=>{this.hover.hidden=true;});this.canvas.addEventListener('click',event=>this.select(event));
  panel.resizeObserver?.observe(this.area);
 }
 set(plot,state){
  this.plot=plot;this.state=state;this.title.textContent=plot.title||'Numerical plot';this.canvas.setAttribute('aria-label',`${plot.title||plot.kind}. ${plot.xLabel||''}; ${plot.yLabel||''}. Values and scope are in the measurements panel.`);
  this.card.dataset.selectable=String(state.researchMode==='shear'&&plot.kind==='heatmap');this.note.textContent=state.researchMode==='heat'&&this.index===0?'Independent axis scales':plot.kind==='heatmap'?`${plot.cols} × ${plot.rows} samples`:plot.kind==='matrix'?`${plot.values?.length||0} × ${plot.values?.length||0} matrix`:'Computed samples';
  this.hover.hidden=true;this.prepareRaster();this.renderLegend();this.draw();
 }
 prepareRaster(){
  this.raster=null;const p=this.plot;if(p.kind!=='heatmap')return;
  const vals=p.values||[],validValues=vals.filter((v,i)=>finite(v)&&(!p.valid||p.valid[i]));let min=validValues.length?Math.min(...validValues):0,max=validValues.length?Math.max(...validValues):0;
  if(p.palette==='phase'){min=-Math.PI;max=Math.PI;}else if(p.palette==='diverging'){const m=Math.max(Math.abs(min),Math.abs(max));min=-m;max=m;}
  this.scale={min,max};const raster=node('canvas');raster.width=p.cols;raster.height=p.rows;const ctx=raster.getContext('2d'),pixels=ctx.createImageData(p.cols,p.rows);let masked=false;
  for(let y=0;y<p.rows;y++)for(let x=0;x<p.cols;x++){const source=y*p.cols+x,target=((p.rows-1-y)*p.cols+x)*4,v=vals[source],ok=finite(v)&&(!p.valid||p.valid[source]);const rgb=ok?plotColor(v,min,max,p.palette):((x+y)%2?[24,38,53]:[15,28,43]);if(!ok)masked=true;pixels.data.set([...rgb,255],target);}
  ctx.putImageData(pixels,0,0);this.raster=raster;this.hasMasked=masked;
 }
 renderLegend(){
  this.legend.replaceChildren();const p=this.plot;
  const item=(name,color)=>{const span=node('span','research-legend-item');const swatch=node('i');swatch.style.setProperty('--legend-color',color);span.append(swatch,node('span','',name));this.legend.append(span);};
  if(p.kind==='heatmap'||p.kind==='matrix'){
   const numbers=p.kind==='matrix'?(p.values||[]).flat().filter(finite):[],max=p.kind==='matrix'?Math.max(0,...numbers.map(Math.abs)):this.scale.max,min=p.kind==='matrix'?-max:this.scale.min;
   const scale=node('span','research-color-scale'),bar=node('i');bar.style.background=p.palette==='phase'?'linear-gradient(90deg,#e72b2b,#e7e72b,#2be72b,#2be7e7,#2b2be7,#e72be7,#e72b2b)':p.palette==='magnitude'?'linear-gradient(90deg,#102033,#4291a8,#dce696)':'linear-gradient(90deg,#439dd2,#253040,#ec9963)';scale.append(node('span','',fmt(min,4)),bar,node('span','',fmt(max,4)));this.legend.append(scale);
   if(p.palette==='diverging'||p.kind==='matrix')this.legend.append(node('span','','signed · center = 0'));
   if(this.hasMasked){const mask=node('span');mask.append(node('i','research-mask-key'),node('span','','undefined / masked'));this.legend.append(mask);}
  }
  for(const [i,series]of(p.series||[]).entries())item(series.name||`series ${i+1}`,series.color||COLORS[i%COLORS.length]);
  for(const c of p.contours||[])item(c.name||`contour ${fmt(c.level)}`,c.color||'#e8e5d7');
  if(p.vectors?.length)this.legend.append(node('span','','arrows · direction'));
  if(p.kind==='bars'){item('positive','#eab06f');item('negative','#78b9e3');}
 }
 layout(width,height){
  const p=this.plot,b=p.kind==='heatmap'?{xMin:p.xMin,xMax:p.xMax,yMin:p.yMin,yMax:p.yMax}:ranges(p),left=width<420?54:65,right=23,top=15,bottom=52;
  let x=left,y=top,w=Math.max(20,width-left-right),h=Math.max(20,height-top-bottom);
  if(p.kind==='complex'&&!(this.state.researchMode==='heat'&&this.index===0)){const ratio=(b.xMax-b.xMin)/(b.yMax-b.yMin);if(w/h>ratio){const nw=h*ratio;x+=(w-nw)/2;w=nw;}else{const nh=w/ratio;y+=(h-nh)/2;h=nh;}}
  return {...b,x,y,w,h,X:value=>x+(value-b.xMin)/(b.xMax-b.xMin)*w,Y:value=>y+h-(value-b.yMin)/(b.yMax-b.yMin)*h};
 }
 draw(){
  if(!this.plot||!this.ctx)return;const width=this.area.clientWidth||this.canvas.clientWidth,height=this.area.clientHeight||this.canvas.clientHeight;if(width<5||height<5)return;
  const dpr=Math.min(2,window.devicePixelRatio||1);if(this.canvas.width!==Math.round(width*dpr)||this.canvas.height!==Math.round(height*dpr)){this.canvas.width=Math.round(width*dpr);this.canvas.height=Math.round(height*dpr);}
  const ctx=this.ctx;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);ctx.fillStyle='#0a1421';ctx.fillRect(0,0,width,height);
  if(this.plot.kind==='matrix'){this.drawMatrix(ctx,width,height);return;}if(this.plot.kind==='bars'){this.drawBars(ctx,width,height);return;}
  const m=this.map=this.layout(width,height);ctx.fillStyle='#0d1a29';ctx.fillRect(m.x,m.y,m.w,m.h);
  if(this.raster){ctx.imageSmoothingEnabled=false;ctx.drawImage(this.raster,m.x,m.y,m.w,m.h);}this.drawAxes(ctx,m,width,height);
  ctx.save();ctx.beginPath();ctx.rect(m.x,m.y,m.w,m.h);ctx.clip();
  if(this.plot.unitCircle){ctx.beginPath();for(let i=0;i<=180;i++){const a=i*Math.PI/90,x=m.X(Math.cos(a)),y=m.Y(Math.sin(a));i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#afbdc6';ctx.lineWidth=1;ctx.setLineDash([4,5]);ctx.stroke();ctx.setLineDash([]);}
  for(const [i,series]of(this.plot.series||[]).entries()){ctx.beginPath();let pen=false;for(const point of series.points||[]){if(!point||!finite(point[0])||!finite(point[1])){pen=false;continue;}const x=m.X(point[0]),y=m.Y(point[1]);if(pen)ctx.lineTo(x,y);else ctx.moveTo(x,y);pen=true;}ctx.strokeStyle=series.color||COLORS[i%COLORS.length];ctx.lineWidth=i===0?1.7:1.6;ctx.stroke();}
  for(const contour of this.plot.contours||[]){ctx.beginPath();for(const segment of contour.segments||[]){if(!segment?.[0]||!segment?.[1]||!segment.flat().every(finite))continue;ctx.moveTo(m.X(segment[0][0]),m.Y(segment[0][1]));ctx.lineTo(m.X(segment[1][0]),m.Y(segment[1][1]));}ctx.strokeStyle=contour.color||'#e8e5d7';ctx.lineWidth=1.2;ctx.stroke();}
  for(const vector of this.plot.vectors||[]){if(![vector.x,vector.y,vector.dx,vector.dy].every(finite))continue;const x=m.X(vector.x),y=m.Y(vector.y),rawX=vector.dx*m.w/(m.xMax-m.xMin),rawY=-vector.dy*m.h/(m.yMax-m.yMin),norm=Math.hypot(rawX,rawY);if(norm<1e-12)continue;const length=clamp(norm,7,18),dx=rawX/norm*length,dy=rawY/norm*length,angle=Math.atan2(dy,dx);ctx.beginPath();ctx.moveTo(x-dx/2,y-dy/2);ctx.lineTo(x+dx/2,y+dy/2);ctx.moveTo(x+dx/2-4*Math.cos(angle-.5),y+dy/2-4*Math.sin(angle-.5));ctx.lineTo(x+dx/2,y+dy/2);ctx.lineTo(x+dx/2-4*Math.cos(angle+.5),y+dy/2-4*Math.sin(angle+.5));ctx.strokeStyle='#e9f2edbb';ctx.lineWidth=1;ctx.stroke();}
  this.drawPoints(ctx,m);ctx.restore();
 }
 drawAxes(ctx,m,width,height){
  ctx.lineWidth=1;for(const x of ticks(m.xMin,m.xMax,width<400?3:5)){const px=m.X(x);ctx.beginPath();ctx.moveTo(px,m.y);ctx.lineTo(px,m.y+m.h);ctx.strokeStyle=x===0?'#7592a65c':'#9ab4c11e';ctx.stroke();text(ctx,fmt(x,4),px,m.y+m.h+15,{size:8});}
  for(const y of ticks(m.yMin,m.yMax,5)){const py=m.Y(y);ctx.beginPath();ctx.moveTo(m.x,py);ctx.lineTo(m.x+m.w,py);ctx.strokeStyle=y===0?'#7592a65c':'#9ab4c11e';ctx.stroke();text(ctx,fmt(y,4),m.x-9,py,{align:'right',size:8});}
  ctx.strokeStyle='#506b7e';ctx.strokeRect(m.x,m.y,m.w,m.h);text(ctx,this.plot.xLabel||'',m.x+m.w/2,height-11,{color:'#aec3d1',size:9});ctx.save();ctx.translate(13,m.y+m.h/2);ctx.rotate(-Math.PI/2);text(ctx,this.plot.yLabel||'',0,0,{color:'#aec3d1',size:9});ctx.restore();
 }
 drawPoints(ctx,m){
  let labels=0;for(const point of this.plot.points||[]){if(!finite(point.x)||!finite(point.y))continue;const x=m.X(point.x),y=m.Y(point.y);if(x<m.x||x>m.x+m.w||y<m.y||y>m.y+m.h)continue;ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle=point.color||'#f0e4bf';ctx.fill();ctx.strokeStyle='#0c1824';ctx.lineWidth=1.5;ctx.stroke();if(point.label&&labels++<10){const right=x>m.x+m.w*.72,py=clamp(y-11,m.y+9,m.y+m.h-9);text(ctx,point.label,x+(right?-7:7),py,{color:'#e6edf0',align:right?'right':'left',size:8});}}
 }
 drawMatrix(ctx,width,height){
  const p=this.plot,n=p.values?.length||0;if(!n)return;const size=Math.min(width-100,height-68),left=(width-size)/2,top=18,cell=size/n,values=p.values.flat().filter(finite),limit=Math.max(0,...values.map(Math.abs));this.map={matrix:true,left,top,cell,n};
  for(let row=0;row<n;row++)for(let col=0;col<n;col++){const value=p.values[row]?.[col],rgb=finite(value)?plotColor(value,-limit,limit,'diverging'):[19,31,44];ctx.fillStyle=`rgb(${rgb.join(',')})`;ctx.fillRect(left+col*cell,top+row*cell,cell,cell);ctx.strokeStyle='#0c192844';ctx.strokeRect(left+col*cell,top+row*cell,cell,cell);if(cell>35)text(ctx,fmt(value,3),left+(col+.5)*cell,top+(row+.5)*cell,{color:'#e4edf0',size:Math.min(11,cell/5)});}
  for(let i=0;i<n;i++){const label=p.labels?.[i]??String(i+1);text(ctx,label,left+(i+.5)*cell,top+size+18,{size:Math.min(8,cell/4)});text(ctx,label,left-8,top+(i+.5)*cell,{align:'right',size:8});}
 }
 drawBars(ctx,width,height){
  const p=this.plot,vals=p.values||[],numbers=vals.filter(finite);let lo=Math.min(0,...numbers),hi=Math.max(0,...numbers);if(lo===hi){lo=-1;hi=1;}const pad=(hi-lo)*.1;this.plot={...p,xMin:0,xMax:Math.max(1,vals.length),yMin:lo-pad,yMax:hi+pad};const m=this.map=this.layout(width,height);this.plot=p;ctx.fillStyle='#0d1a29';ctx.fillRect(m.x,m.y,m.w,m.h);
  for(const y of ticks(m.yMin,m.yMax,5)){const py=m.Y(y);ctx.beginPath();ctx.moveTo(m.x,py);ctx.lineTo(m.x+m.w,py);ctx.strokeStyle=y===0?'#a6bacb88':'#9ab4c11e';ctx.stroke();text(ctx,fmt(y,4),m.x-8,py,{align:'right',size:8});}
  const cell=m.w/Math.max(1,vals.length),zero=m.Y(0);for(let i=0;i<vals.length;i++){if(!finite(vals[i]))continue;const y=m.Y(vals[i]),x=m.x+i*cell;ctx.fillStyle=vals[i]<0?'#78b9e3':'#eab06f';ctx.fillRect(x+cell*.18,Math.min(y,zero),cell*.64,Math.max(1,Math.abs(y-zero)));if(vals.length<=8)text(ctx,fmt(vals[i],4),x+cell/2,vals[i]<0?y+11:y-10,{color:'#dce5eb',size:8});const label=p.labels?.[i]??String(i+1);if(cell>=24||i%Math.ceil(24/cell)===0)text(ctx,label,x+cell/2,m.y+m.h+18,{size:vals.length>15?7:8});}
  ctx.strokeStyle='#506b7e';ctx.strokeRect(m.x,m.y,m.w,m.h);
 }
 coordinates(event){const rect=this.canvas.getBoundingClientRect();return {x:event.clientX-rect.left,y:event.clientY-rect.top};}
 inspect(event){
  const m=this.map,p=this.plot;if(!m)return;const pt=this.coordinates(event);let value='';
  if(m.matrix){const col=Math.floor((pt.x-m.left)/m.cell),row=Math.floor((pt.y-m.top)/m.cell);if(row>=0&&row<m.n&&col>=0&&col<m.n)value=`row ${p.labels?.[row]??row+1} · column ${p.labels?.[col]??col+1}\n${fmt(p.values[row]?.[col],7)}`;}
  else if(pt.x>=m.x&&pt.x<=m.x+m.w&&pt.y>=m.y&&pt.y<=m.y+m.h){const x=m.xMin+(pt.x-m.x)/m.w*(m.xMax-m.xMin),y=m.yMin+(1-(pt.y-m.y)/m.h)*(m.yMax-m.yMin);value=`${p.xLabel||'x'} ${fmt(x,6)} · ${p.yLabel||'y'} ${fmt(y,6)}`;if(p.kind==='heatmap'){const col=clamp(Math.round((x-p.xMin)/(p.xMax-p.xMin)*(p.cols-1)),0,p.cols-1),row=clamp(Math.round((y-p.yMin)/(p.yMax-p.yMin)*(p.rows-1)),0,p.rows-1),i=row*p.cols+col;value+=`\nnearest sample: ${(!p.valid||p.valid[i])?fmt(p.values[i],7):'masked'}`;}else if(p.kind==='bars'){const i=clamp(Math.floor((pt.x-m.x)/m.w*p.values.length),0,p.values.length-1);value=`${p.labels?.[i]??i+1}: ${fmt(p.values[i],7)}`;}}
  this.hover.textContent=value;this.hover.hidden=!value;
 }
 select(event){
  if(this.panel.state.researchMode!=='shear'||this.plot.kind!=='heatmap'||this.panel.resultKey!==this.panel.desiredKey)return;const m=this.map,pt=this.coordinates(event);if(!m||pt.x<m.x||pt.x>m.x+m.w||pt.y<m.y||pt.y>m.y+m.h)return;
  this.panel.commit({researchSigma:clamp(m.xMin+(pt.x-m.x)/m.w*(m.xMax-m.xMin),-.5,1.5),researchT:clamp(m.yMin+(1-(pt.y-m.y)/m.h)*(m.yMax-m.yMin),0,60)},{immediate:true});
 }
 dispose(){this.panel.resizeObserver?.unobserve(this.area);this.card.remove();}
}

/** Worker-backed research controls, deterministic frame state and cache-only plots. */
export class ResearchPanel {
 constructor(container,{controlsEl,inspectorEl,onChange=()=>{},onCommand=()=>{}}={}){
  if(!container)throw new Error('ResearchPanel requires a main mount.');this.container=container;this.controlsEl=controlsEl||node('div');this.inspectorEl=inspectorEl||node('div');this.onChange=onChange;this.onCommand=onCommand;this.state={...RESEARCH_DEFAULTS};this.disposed=false;this.running=false;this.raf=null;this.drawRAF=null;this.lastTick=null;this.progressDirty=false;this.emissionDepth=0;this.serial=0;this.worker=null;this.inFlight=null;this.pendingJob=null;this.desiredKey=null;this.resultKey=null;this.result=null;this.resultState=null;this.pendingPatch=null;this.changeTimer=null;this.error=null;this.plots=[];this.controls=new Map();
  container.classList.add('research-workbench');this.controlsEl.classList.add('research-controls');this.inspectorEl.classList.add('research-inspector');
  this.resizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(()=>this.scheduleDraw()):null;
  this.buildMain();this.buildControls();this.buildInspector();
  this.onResize=()=>this.scheduleDraw();window.addEventListener('resize',this.onResize);this.onVisibility=()=>{if(document.hidden)this.pause();};document.addEventListener('visibilitychange',this.onVisibility);this.update(this.state);
 }
 buildMain(){
  this.container.innerHTML=`<header class="research-heading"><div><span class="research-eyebrow">08 / BRIDGE RESEARCH</span><h2 data-research="title">Explore the bridge.</h2><p data-research="subtitle"></p></div><span class="research-model" data-research="model"></span></header><div class="research-mobile-actions"><button type="button" data-research-command="controls">Parameters</button><button type="button" data-research-command="inspect">Measurements</button></div><div class="research-summary-row"><span data-research="context"></span><div class="research-status" role="status" data-research="status">READY</div></div><div class="research-empty" data-research="empty"><strong>Computing the experiment.</strong>Numerical plots will appear here.</div><div class="research-plots" data-research="primary"></div><div class="research-transport" data-research="transport"><div class="research-transport-actions"><button type="button" class="research-play" data-research="play">▶ Play</button><button type="button" data-research="step">Step ›</button><button type="button" data-research="reset">↺ Reset</button></div><div class="research-frame-control"><label for="researchTimeline">FRAME</label><output data-research="frame">0 / 240</output><input id="researchTimeline" aria-label="Research animation frame" type="range" min="0" max="240" step="1" value="0" data-research="timeline"></div><span class="research-rate-note" data-research="rate"></span></div><div class="research-secondary-plots" data-research="secondary"></div>`;
  this.el=Object.fromEntries([...this.container.querySelectorAll('[data-research]')].map(el=>[el.dataset.research,el]));
  for(const button of this.container.querySelectorAll('[data-research-command]'))button.onclick=()=>this.onCommand(button.dataset.researchCommand);
  this.el.play.onclick=()=>this.togglePlay();this.el.step.onclick=()=>{this.pause();this.commit({researchFrame:Math.min(240,this.state.researchFrame+1)},{immediate:true});};this.el.reset.onclick=()=>{this.clearPending();this.stop(false);this.commit({researchFrame:0},{immediate:true});};
  this.el.timeline.oninput=()=>{const value=Number(this.el.timeline.value);this.queuePatch({researchFrame:value},false);};this.el.timeline.onchange=()=>this.commitPending(true);
 }
 buildControls(){
  this.controlsEl.innerHTML=`<div class="research-control-heading"><span class="research-eyebrow">NINE CONNECTED EXPERIMENTS</span><h3>Choose the question.</h3><p data-research-control="note"></p></div><div class="research-control-group" data-research-control="selectors"></div><div class="research-control-group" data-research-control="parameters"><h4>PARAMETERS</h4></div><div class="research-control-group" data-research-control="overlays"></div><div class="research-control-group" data-research-control="presets"><h4>HEAT CALIBRATIONS</h4><div class="research-quick-actions"><button type="button" data-research-preset="theta">Actual theta zeros · τ → −0.2</button><button type="button" data-research-preset="quartic">Exact quartet · pass the collision</button></div><p class="research-control-note">The quartic is a finite calibration with a known collision. The theta tracks are numerical continuation.</p><p class="research-control-note"><a href="/experiments/zero-channels.html">Zero channels · coupling &amp; guidance ↗</a></p><p class="research-control-note"><a href="/experiments/zero-confinement.html">Read the saved confinement comparison ↗</a></p></div>`;
  this.control=Object.fromEntries([...this.controlsEl.querySelectorAll('[data-research-control]')].map(el=>[el.dataset.researchControl,el]));
  const add=(key,title,kind,modes,parent)=>{const row=node('div','research-control-row');row.dataset.controlKind=kind;const label=node('label','',title),id=`research-${key}`;label.htmlFor=id;const input=node(kind==='select'?'select':'input');input.id=id;input.dataset.researchSetting=key;const output=node('output');output.dataset.researchOutput=key;row.append(label);if(kind==='range')row.append(output);if(kind!=='select')input.type=kind;if(kind==='range'||kind==='number'){const lim=RESEARCH_LIMITS[key];input.min=lim[0];input.max=lim[1];input.step=kind==='number'?'any':lim[2];}if(kind==='text'){input.autocomplete='off';input.spellcheck=false;}
   row.append(input);parent.append(row);const item={key,row,label,input,output,kind,modes};this.controls.set(key,item);return item;};
  for(const [key,title,modes]of [['researchMode','Experiment',null],['researchSource','Analytic source / model',SOURCE_MODES],['researchLayer','Field layer',['shear']],['researchKernel','Finite kernel',['gram']],['researchPath','Spectral path',['ratio']],['researchPulseShape','Input pulse',['pulse']],['researchHeatModel','Zero-motion family',['heat']]]){const item=add(key,title,'select',modes,this.control.selectors);for(const value of RESEARCH_ENUMS[key].filter(v=>v!=='off')){const option=node('option','',key==='researchMode'?RESEARCH_TITLES[value]:ENUM_LABELS[key]?.[value]||value);option.value=value;item.input.append(option);}}
  for(const [key,title,modes,kind]of PARAMETERS){const item=add(key,title,kind,modes,this.control.parameters);if(key==='researchNodes'){item.note=node('small','','2–8 comma-separated offsets, each between −8 and 8.');item.row.append(item.note);}}
  for(const [key,title,modes]of [['researchShowContours','Zero / contour overlays',['shear','heat']],['researchShowVectors','Phase direction arrows',['shear','heat']],['researchGhost','Add synthetic zero quartet',['ratio']]])add(key,title,'checkbox',modes,this.control.overlays);
  for(const [key,item]of this.controls){const {input,kind}=item;if(kind==='range'||kind==='number'){input.oninput=()=>{const value=Number(input.value);if(input.value===''||!finite(value)){input.setAttribute('aria-invalid','true');return;}input.removeAttribute('aria-invalid');item.output.textContent=this.parameterValue(key,value);this.queuePatch({[key]:value},key!=='researchRate');};input.onchange=()=>this.commitPending(true);}else if(kind==='text'){input.onchange=()=>{const tokens=input.value.split(',').map(v=>v.trim()),values=tokens.map(Number),positive=this.state.researchKernel==='logPick';if(tokens.length<2||tokens.length>8||tokens.some(v=>!v)||values.some(v=>!finite(v)||Math.abs(v)>8||positive&&v<=0)){input.setAttribute('aria-invalid','true');item.note.textContent=positive?'Enter 2–8 positive real nodes, each at most 8.':'Enter 2–8 finite offsets from −8 to 8.';return;}input.removeAttribute('aria-invalid');this.commit({[key]:values.join(',')},{resetFrame:true,immediate:true});};}else input.onchange=()=>{const value=kind==='checkbox'?input.checked:input.value,patch={[key]:value};if(key==='researchMode'&&value==='modal')patch.researchSource='quadratic';if(key==='researchKernel'&&value==='logPick')patch.researchNodes='.15,.35,.7,1.2';this.commit(patch,{resetFrame:!key.startsWith('researchShow'),mode:kind==='select'?'push':'replace',immediate:true});};}
  for(const button of this.controlsEl.querySelectorAll('[data-research-preset]'))button.onclick=()=>this.commit({researchHeatModel:button.dataset.researchPreset,researchHeatEnd:button.dataset.researchPreset==='quartic'?-.25:-.2,researchShowContours:true},{resetFrame:true,mode:'push',immediate:true});
 }
 buildInspector(){
  this.inspectorEl.innerHTML=`<section class="research-inspector-section"><h4>COMPUTED MEASUREMENTS</h4><div class="research-inspector-state" data-research-inspect="state">Select an experiment.</div><dl class="research-metrics" data-research-inspect="metrics"></dl></section><section class="research-inspector-section"><h4>DEFINING RELATION</h4><div class="research-formula" data-research-inspect="formula"></div></section><section class="research-inspector-section" data-research-inspect="handoff"><h4>LINKED SPECTRAL POINT</h4><div class="research-probe-readout" data-research-inspect="probe"></div><button type="button" class="research-surface-button" data-research-inspect="surface">Show on the zeta surface ↗</button></section><section class="research-inspector-section"><h4>WHAT THIS EXPERIMENT MEASURES</h4><p class="research-scope" data-research-inspect="scope"></p></section><section class="research-inspector-section"><h4>NUMERICAL DETAILS</h4><div class="research-details" data-research-inspect="details"></div></section>`;
  this.inspect=Object.fromEntries([...this.inspectorEl.querySelectorAll('[data-research-inspect]')].map(el=>[el.dataset.researchInspect,el]));this.inspect.surface.onclick=()=>{this.flush();if(!this.inspect.surface.disabled&&!this.inspect.handoff.hidden)this.onCommand('surface',this.currentLinkedPoint());};
 }
 currentLinkedPoint(){
  const s=this.state,point={sigma:s.researchSigma,t:s.researchT,a:s.researchA,tau:s.researchTau,source:s.researchSource,layer:s.researchLayer};
  if(s.researchMode==='energy')point.sigma=.5+Math.min(s.researchA,s.researchShift);
  if(s.researchMode==='ratio'){const u=s.researchFrame/240;if(s.researchPath==='circle'){point.sigma+=s.researchRadius*Math.cos(2*Math.PI*u);point.t+=s.researchRadius*Math.sin(2*Math.PI*u);}else if(s.researchPath==='bridgeSweep')point.a=.005+(s.researchA-.005)*u;else point.t+=s.researchSpan*(2*u-1);}
  return point;
 }
 parameterValue(key,value){if(key==='researchRate')return `${Math.round(value)} frames/s`;if((key==='researchPrimeSolo'||key==='researchPrimeMute')&&!value)return 'none';return fmt(value,5);}
 syncControls(){
  const s=this.state,mode=s.researchMode;this.control.note.textContent=NOTES[mode]||'';
  for(const [key,item]of this.controls){let visible=!item.modes||item.modes.includes(mode);if(key==='researchTau')visible&&=s.researchSource==='heat';if(key==='researchEpsilon')visible&&=mode==='modal'||s.researchSource==='quadratic';if(key==='researchRadius')visible&&=s.researchPath==='circle';if(key==='researchDelta')visible&&=s.researchGhost;if(key==='researchPulseSeparation')visible&&=s.researchPulseShape==='pair';if(key==='researchHeatCount')visible&&=s.researchHeatModel==='theta';if(key==='researchA'&&mode==='energy')visible&&=s.researchSource!=='quadratic';if(key==='researchNodeImag')visible&&=s.researchKernel!=='logPick';if(mode==='gram'&&s.researchKernel==='logPick'&&['researchT','researchA'].includes(key))visible=false;if(mode==='heat'&&key==='researchT')visible&&=s.researchHeatModel==='theta';
   item.row.hidden=!visible;
   if(key==='researchA'){item.input.min=mode==='energy'&&s.researchSource!=='quadratic'?.5:RESEARCH_LIMITS[key][0];item.label.textContent=mode==='energy'?'Boundary half-width a':mode==='theta'?'Mellin tilt x':'Comparison shift a';}
   if(key==='researchShift')item.label.textContent=mode==='energy'?'Inward displacement h':'Transverse x = h';if(key==='researchShowVectors')item.label.textContent=mode==='heat'?'Zero-velocity arrows':'Phase direction arrows';if(key==='researchT')item.label.textContent=mode==='modes'?'Carrier height γ':mode==='heat'?'Initial zero group near t':'Height / center t';if(key==='researchSpan')item.label.textContent=mode==='modes'?'Log-coordinate half-span u':'Height half-span';
   if(key==='researchNodes'){item.label.textContent=s.researchKernel==='logPick'?'Positive real nodes':'Node height offsets';if(!item.input.hasAttribute('aria-invalid'))item.note.textContent=s.researchKernel==='logPick'?'2–8 positive real nodes, each at most 8.':'2–8 comma-separated offsets, each between −8 and 8.';}
   if(key==='researchFrozen')item.input.max=s.researchNodes.split(',').length-1;if(key==='researchPrimeSolo'||key==='researchPrimeMute')item.input.max=s.researchPrimeCount;
   const value=has(this.pendingPatch,key)?this.pendingPatch[key]:s[key];if(item.kind==='checkbox')item.input.checked=!!value;else if(!item.input.hasAttribute('aria-invalid')||document.activeElement!==item.input)item.input.value=value;item.output.textContent=this.parameterValue(key,value);
  }
  this.control.presets.hidden=mode!=='heat';this.control.overlays.hidden=![...this.controls.values()].some(item=>item.kind==='checkbox'&&!item.row.hidden);
  const linked=this.currentLinkedPoint();this.el.transport.hidden=!ANIMATED.has(mode);this.inspect.handoff.hidden=!['shear','energy','ratio'].includes(mode)||s.researchSource==='quadratic'||mode==='ratio'&&s.researchGhost;this.inspect.probe.textContent=`s = ${fmt(linked.sigma,7)} + ${fmt(linked.t,9)}i\na = ${fmt(linked.a)}${s.researchSource==='heat'?` · τ = ${fmt(s.researchTau)}`:''}`;
  this.updateTransport();
 }
 update(input){
  if(this.disposed)return;const next=normalizeResearchConfig(input),key=stateKey(next),changed=key!==stateKey(this.state),active=next.researchMode!=='off';
  if(changed&&!this.emissionDepth){this.stop(false);this.clearPending();}
  this.state=next;this.container.hidden=!active;this.controlsEl.hidden=!active;this.inspectorEl.hidden=!active;
  if(!active){this.stop(false);this.terminateWorker();this.desiredKey=null;this.syncControls();return;}
  this.syncControls();if(key!==this.desiredKey)this.requestComputation(key);else this.updateStatus();
 }
 emit(patch,meta={}){this.emissionDepth++;try{this.onChange(patch,{mode:'replace',immediate:false,progress:false,...meta});}finally{this.emissionDepth--;}}
 commit(patch,{resetFrame=false,mode='replace',immediate=false,progress=false}={}){
  if(this.disposed)return;this.clearPending();if(resetFrame)patch={...patch,researchFrame:0};if(!progress)this.stop(false);this.emissionDepth++;try{this.update({...this.state,...patch});}finally{this.emissionDepth--;}
  const normalized=Object.fromEntries(Object.keys(patch).filter(key=>key in RESEARCH_DEFAULTS).map(key=>[key,this.state[key]]));this.progressDirty=progress;this.emit(normalized,{mode,immediate,progress});
 }
 queuePatch(patch,resetFrame=true){
  if(this.disposed)return;this.pendingPatch={...(this.pendingPatch||{}),...patch,...(resetFrame?{researchFrame:0}:{})};this.stop(false);clearTimeout(this.changeTimer);this.changeTimer=setTimeout(()=>this.commitPending(false),120);this.syncControls();this.updateStatus();
 }
 commitPending(immediate=false){if(!this.pendingPatch)return;const patch=this.pendingPatch;this.clearPending();this.commit(patch,{immediate});}
 clearPending(){clearTimeout(this.changeTimer);this.changeTimer=null;this.pendingPatch=null;}
 ensureWorker(){
  if(this.worker)return true;try{this.worker=new Worker(new URL('./research-worker.js',import.meta.url),{type:'module'});this.worker.onmessage=event=>this.receive(event.data);this.worker.onerror=event=>{this.inFlight=null;this.pendingJob=null;this.fail(event.message||'The numerical worker could not run.');this.worker?.terminate();this.worker=null;};return true;}catch(error){this.fail(error.message||'Web Workers are unavailable.');return false;}
 }
 requestComputation(key){
  this.desiredKey=key;this.error=null;this.updatePresentation();
  if(key===this.resultKey&&this.result){this.pendingJob=null;this.renderResult(this.result,this.state);this.updateStatus();return;}
  if(this.inFlight?.key===key){this.pendingJob=null;this.updateStatus();return;}
  const job={id:++this.serial,key,state:{...this.state}};if(this.inFlight)this.pendingJob=job;else this.sendJob(job);this.updateStatus();
 }
 sendJob(job){if(this.disposed||this.state.researchMode==='off'||!this.ensureWorker())return;this.inFlight=job;this.worker.postMessage({id:job.id,state:job.state});}
 receive(message){
  if(this.disposed||!this.inFlight||message.id!==this.inFlight.id)return;const job=this.inFlight;this.inFlight=null;
  if(job.key===this.desiredKey){if(message.error)this.fail(message.error);else if(message.result){this.resultKey=job.key;this.resultState=job.state;this.result=message.result;this.error=null;this.renderResult(message.result,job.state);}}
  const next=this.pendingJob;this.pendingJob=null;if(next&&next.key===this.desiredKey&&next.key!==this.resultKey)this.sendJob(next);this.updateStatus();
 }
 fail(message){this.error=String(message);this.stop(false);this.updateStatus();}
 updatePresentation(){
  const s=this.state,mode=s.researchMode,model=mode==='modal'||s.researchSource==='quadratic'&&SOURCE_MODES.includes(mode)||mode==='heat'&&s.researchHeatModel==='quartic',finiteModel=['modes','pulse','theta'].includes(mode);
  this.el.title.textContent=RESEARCH_TITLES[mode]||'Bridge research';this.el.subtitle.textContent=NOTES[mode]||'';
  this.el.model.dataset.kind=model?'model':finiteModel?'finite':'actual';this.el.model.textContent=model?'EXACT FINITE MODEL':mode==='modes'?'FINITE PRIME OSCILLATORS':mode==='pulse'?'FINITE PERIODIC TRANSFORM':mode==='theta'?'FINITE ARITHMETIC + THETA':mode==='heat'?'THETA FAMILY · NUMERICAL ZEROS':s.researchSource==='heat'?'THETA HEAT FAMILY':mode==='gram'?'FINITE MATRIX · ANALYTIC INPUT':'ANALYTIC COMPLETED ξ';
  this.el.context.textContent=mode==='shear'?'Select a point in the field · numerical samples':ANIMATED.has(mode)?'Reproducible frame state · play is local':'Computed samples · inspect the stated scope';
 }
 renderResult(result,state){
  this.updatePresentation();this.el.title.textContent=result.title||this.el.title.textContent;this.el.subtitle.textContent=result.subtitle||this.el.subtitle.textContent;this.inspect.formula.textContent=result.formula||'';this.inspect.scope.textContent=result.scope||'';this.inspect.metrics.replaceChildren();
  for(const metric of result.metrics||[]){const row=node('div');row.append(node('dt','',metric.label),node('dd','',fmt(metric.value,7)));this.inspect.metrics.append(row);}
  this.inspect.details.replaceChildren();for(const detail of result.details||[])this.inspect.details.append(node('p','',detail));
  const plots=result.plots||[];while(this.plots.length>plots.length)this.plots.pop().dispose();for(let i=0;i<plots.length;i++){if(!this.plots[i]){this.plots[i]=new ResearchPlot(this,i);(i?this.el.secondary:this.el.primary).append(this.plots[i].card);}this.plots[i].set(plots[i],state);}this.el.empty.hidden=plots.length>0;this.scheduleDraw();
 }
 updateStatus(){
  const active=this.state.researchMode!=='off',pending=!!this.pendingPatch||this.desiredKey!==this.resultKey,busy=active&&pending&&!this.error;this.inspectorEl.dataset.stale=String(pending);this.inspect.surface.disabled=pending||!!this.error;this.el.status.dataset.busy=String(busy);this.el.status.dataset.error=String(!!this.error);
  this.el.status.textContent=this.error?'COMPUTATION STOPPED':busy?'COMPUTING':this.running?'PLAYING':'READY';this.inspect.state.textContent=this.error?this.error:busy?(this.result?'Updating · measurements below are from the previous frame.':'Computing numerical measurements…'):`Frame ${this.state.researchFrame} · ${fmt(this.result?.elapsedMs??0,3)} ms numerical computation`;
  if(!this.result||this.resultState?.researchMode!==this.state.researchMode){this.el.primary.hidden=true;this.el.secondary.hidden=true;this.el.empty.hidden=!active;this.el.empty.replaceChildren(node('strong','',this.error?'The experiment could not be computed.':'Computing the experiment.'),node('span','',this.error||'Numerical plots will appear here.'));}else{this.el.primary.hidden=false;this.el.secondary.hidden=false;this.el.empty.hidden=!!this.result.plots?.length;if(!this.el.empty.hidden)this.el.empty.replaceChildren(node('strong','',this.result.subtitle||'No resolved plot at these parameters.'),node('span','','Read the measurements for the numerical status, or adjust the controls.'));}
  this.updateTransport();
 }
 updateTransport(){
  const frame=has(this.pendingPatch,'researchFrame')?this.pendingPatch.researchFrame:this.state.researchFrame;this.el.timeline.value=frame;this.el.frame.textContent=`${frame} / 240`;this.el.play.textContent=this.running?'Ⅱ Pause':'▶ Play';this.el.play.setAttribute('aria-label',this.running?'Pause research animation':'Play research animation');this.el.step.disabled=frame>=240;this.el.rate.textContent=`up to ${this.state.researchRate} frames/s`;this.el.play.disabled=!!this.error;
 }
 togglePlay(){
  if(this.disposed||!ANIMATED.has(this.state.researchMode))return;if(this.running){this.pause();return;}this.commitPending(true);if(this.state.researchFrame>=240)this.commit({researchFrame:0},{immediate:true});this.running=true;this.lastTick=null;this.updateStatus();this.requestTick();
 }
 requestTick(){if(this.running&&this.raf===null)this.raf=requestAnimationFrame(time=>this.tick(time));}
 tick(time){
  this.raf=null;if(!this.running||this.disposed)return;if(this.lastTick===null)this.lastTick=time;
  if(time-this.lastTick>=1000/Math.min(12,this.state.researchRate)&&!this.inFlight&&!this.pendingJob&&!this.pendingPatch&&this.resultKey===this.desiredKey){this.lastTick=time;if(this.state.researchFrame>=240){this.pause();return;}this.commit({researchFrame:this.state.researchFrame+1},{progress:true});}
  this.requestTick();
 }
 stop(emit){const dirty=this.progressDirty,wasRunning=this.running;this.running=false;this.lastTick=null;if(this.raf!==null)cancelAnimationFrame(this.raf);this.raf=null;if(emit&&(dirty||wasRunning)){this.progressDirty=false;this.emit({researchFrame:this.state.researchFrame},{immediate:true});}this.updateTransport();}
 pause(){if(this.disposed)return;this.commitPending(true);this.stop(true);this.updateStatus();}
 flush(){if(this.disposed)return;this.commitPending(true);if(this.progressDirty){this.progressDirty=false;this.emit({researchFrame:this.state.researchFrame},{immediate:true});}}
 scheduleDraw(){if(this.disposed||this.drawRAF!==null)return;this.drawRAF=requestAnimationFrame(()=>{this.drawRAF=null;for(const plot of this.plots)plot.draw();});}
 screenshot(){if(!this.result||this.pendingPatch||this.resultKey!==this.desiredKey||this.error)return null;const plot=this.plots[0];if(!plot?.canvas.width)return null;plot.draw();return plot.canvas.toDataURL('image/png');}
 terminateWorker(){this.worker?.terminate();this.worker=null;this.inFlight=null;this.pendingJob=null;}
 dispose(){if(this.disposed)return;this.stop(false);this.disposed=true;this.clearPending();this.terminateWorker();if(this.drawRAF!==null)cancelAnimationFrame(this.drawRAF);this.drawRAF=null;this.resizeObserver?.disconnect();window.removeEventListener('resize',this.onResize);document.removeEventListener('visibilitychange',this.onVisibility);for(const plot of this.plots)plot.dispose();this.plots=[];}
}
