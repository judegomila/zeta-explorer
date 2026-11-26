/** Canvas helpers shared by the model workbenches. Drawing only; no numbers. */
export const TAU=2*Math.PI;
export const C={direct:'#7bdeef',dual:'#f3b462',bridge:'#d7f7ad',finite:'#b3acdf',grid:'#223246',axis:'#3a4c62',text:'#9db0c4',dim:'#62758a',
  proton:'#ff8a66',neutron:'#7fb1ff',surface:'#63d6c4',coulomb:'#ff7d8a',bad:'#ff7d8a',good:'#8dffb0',white:'#e6eaf0',pink:'#e1a2d5'};
export const MODE_COLORS=['#7bdeef','#f3b462','#d7f7ad','#e1a2d5','#b3acdf'];
export const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
export const fmt=(x,d=3)=>Number.isFinite(x)?x.toFixed(d).replace('-','−'):'—';
export const sig=(x,d=3)=>Number.isFinite(x)?(Math.abs(x)>=1e4||Math.abs(x)<1e-3&&x!==0?x.toExponential(d-1):x.toPrecision(d)).replace('-','−').replace('e+','e'):'—';
export const esc=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/** Size a canvas to its box at device resolution; returns CSS-pixel context. */
export function surface(canvas){
  const view=canvas.ownerDocument?.defaultView,dpr=Math.min(view?.devicePixelRatio||1,2);
  const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  return {ctx,w,h};
}
export function label(ctx,text,x,y,{color=C.text,size=10,align='left',font='ui-monospace,SFMono-Regular,Consolas,monospace'}={}){
  ctx.font=`${size}px ${font}`;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.fillText(text,x,y);
}
export function line(ctx,x0,y0,x1,y1,color,width=1,dash=null){
  ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;if(dash)ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();
}
export function dot(ctx,x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}

/**
 * Axes for a plot box. x and y are [lo, hi]; `log` maps that axis by log10.
 * Returns the two coordinate maps and the box.
 */
export function frame(ctx,box,{x,y,logX=false,logY=false,xticks=[],yticks=[],xlabel='',ylabel='',tick=v=>String(v)}={}){
  const {left,top,right,bottom}=box,fx=v=>logX?Math.log10(v):v,fy=v=>logY?Math.log10(v):v;
  const X=v=>left+(fx(v)-fx(x[0]))/(fx(x[1])-fx(x[0]))*(right-left);
  const Y=v=>bottom-(fy(v)-fy(y[0]))/(fy(y[1])-fy(y[0]))*(bottom-top);
  line(ctx,left,bottom,right,bottom,C.axis);line(ctx,left,top,left,bottom,C.axis);
  const reserved=xlabel?xlabel.length*4.9+14:0;
  for(const v of xticks){line(ctx,X(v),bottom,X(v),bottom+3,C.axis);if(X(v)<right-reserved||!xlabel)label(ctx,tick(v),X(v),bottom+13,{color:C.dim,size:8,align:'center'});}
  for(const v of yticks){line(ctx,left-3,Y(v),left,Y(v),C.axis);label(ctx,tick(v),left-5,Y(v)+3,{color:C.dim,size:8,align:'right'});}
  if(xlabel)label(ctx,xlabel,right,bottom+13,{color:C.dim,size:8,align:'right'});
  if(ylabel)label(ctx,ylabel,left+4,top+8,{color:C.dim,size:8});
  return {X,Y,box,clipY:v=>clamp(Y(v),top,bottom)};
}
/** Polyline through finite points; breaks at non-finite values. */
export function curve(ctx,xs,ys,plot,color,width=1.3,dash=null){
  const {X,Y,box}=plot;ctx.save();ctx.beginPath();ctx.rect(box.left,box.top-1,box.right-box.left,box.bottom-box.top+2);ctx.clip();
  ctx.strokeStyle=color;ctx.lineWidth=width;if(dash)ctx.setLineDash(dash);ctx.beginPath();let pen=false;
  for(let i=0;i<xs.length;i++){
    const px=X(xs[i]),py=Y(ys[i]);
    if(!Number.isFinite(px)||!Number.isFinite(py)){pen=false;continue;}
    pen?ctx.lineTo(px,py):ctx.moveTo(px,py);pen=true;
  }
  ctx.stroke();ctx.restore();
}
/** Evenly spaced values, ends included. */
export const linspace=(lo,hi,n)=>Array.from({length:n+1},(_,i)=>lo+(hi-lo)*i/n);
/** Round tick values covering [lo, hi]. */
export function ticks(lo,hi,target=5){
  const raw=(hi-lo)/target,pow=10**Math.floor(Math.log10(raw)),step=[1,2,5,10].map(m=>m*pow).find(s=>s>=raw)||raw,out=[];
  for(let v=Math.ceil(lo/step)*step;v<=hi+1e-9*step;v+=step)out.push(Math.abs(v)<1e-12?0:Number(v.toPrecision(12)));
  return out;
}
/** Staircase of an empirical cumulative distribution. */
export function staircase(ctx,sample,plot,color,width=1.6,max=Infinity){
  const sorted=[...sample].sort((a,b)=>a-b),n=sorted.length,xs=[],ys=[];
  sorted.forEach((s,i)=>{const x=Math.min(s,max);xs.push(x,x);ys.push(i/n,(i+1)/n);});
  curve(ctx,xs,ys,plot,color,width);
}
/** Legend entries stacked from a corner. */
export function legend(ctx,items,x,y,{align='right',size=8,gap=11}={}){
  items.forEach(([text,color],i)=>label(ctx,text,x,y+i*gap,{color,size,align}));
}
