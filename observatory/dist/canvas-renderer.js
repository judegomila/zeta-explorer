import {displayLogMagnitude,displayVisibility} from './display-field.js';
import * as numerical from './math.js';
const { evaluate, NUMERICS } = numerical;
import { liftPoint, continueMaskedHeights } from './geometry.js';

const TAU = Math.PI * 2;
const clamp = (x,lo,hi) => Math.max(lo,Math.min(hi,x));
const finite = Number.isFinite;
const logMagnitude = (re, im) => Math.log(Math.hypot(re, im));
const validLog = x => Number.isFinite(x) || x === -Infinity;
const softplus = x => x > 36 ? x : x < -36 ? Math.exp(x) : Math.log1p(Math.exp(x));
function polarAt(sigma, t, kind, tau) {
  if (numerical.evaluatePolar) return numerical.evaluatePolar(sigma, t, kind, tau);
  const f = evaluate(sigma, t, kind, tau);
  return { ...f, logAbs: logMagnitude(f.re, f.im), arg: Math.atan2(f.im, f.re) };
}
function weightedLogQuantile(data, logs, quantile = .95) {
  const indices = []; let total = 0;
  for(let i=0;i<logs.length;i++) {
    if(!data.valid[i] || !validLog(logs[i])) continue;
    const w = data.sampleWeights ? data.sampleWeights[i] : 1;
    if(!(w>0) || !finite(w)) continue;
    indices.push(i); total += w;
  }
  indices.sort((a,b)=>logs[a]-logs[b]);
  let accumulated = 0;
  for(const i of indices) {
    accumulated += data.sampleWeights ? data.sampleWeights[i] : 1;
    if(accumulated >= quantile*total) return finite(logs[i]) ? logs[i] : 0;
  }
  return 0;
}
function renderStyleSignature(state) {
  return JSON.stringify(['geometry','projective','function','tau','heightMode','height','colorMode','phaseOffset','exposure','opacity','wireframe','contours','critical','zeros','vortices','ladder','packets','seams','heightLocked','heightLogReference','heightReference','resolution','displayDamping','displayDampingScale','playing'].map(k=>state[k]));
}
function sampleMetadata(data) {
  const logs=data.logAbs||Float64Array.from(data.valid,(_,i)=>logMagnitude(data.values[2*i],data.values[2*i+1]));
  const args=data.arg||Float64Array.from(data.valid,(_,i)=>Math.atan2(data.values[2*i+1],data.values[2*i]));
  return {sampleLogs:logs,sampleArgs:args,autoLogReference:weightedLogQuantile(data,logs),
    uAxis:data.uAxis||Float64Array.from({length:data.nx+1},(_,i)=>data.uvs?data.uvs[2*i]:i/data.nx),
    vAxis:data.vAxis||Float64Array.from({length:data.ny+1},(_,j)=>data.uvs?data.uvs[2*j*(data.nx+1)+1]:j/data.ny)};
}
function axisInterval(axis, value) {
  let lo = 0, hi = axis.length - 1;
  while (lo + 1 < hi) { const mid = (lo + hi) >> 1; if (axis[mid] <= value) lo = mid; else hi = mid; }
  const i = Math.min(lo, axis.length - 2), width = axis[i + 1] - axis[i];
  return [i, width > 0 ? clamp((value - axis[i]) / width, 0, 1) : 0];
}

const mix = (a,b,w) => a.map((x,i)=>x+(b[i]-x)*w);
const colorHex = color => typeof color === 'number' ? '#' + color.toString(16).padStart(6,'0') : color;
function barycentric(x,y,a,b,c) {
  const den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);
  if(Math.abs(den)<1e-9)return null;
  const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/den;
  const v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/den;
  return u>=-1e-7&&v>=-1e-7&&u+v<=1+1e-7?[u,v,1-u-v]:null;
}

/** Canvas2D software projection of the SAME numerical surface mesh.
 * It is a fallback for browsers that do not expose WebGL, not a replacement
 * mathematical model. Large meshes use a reported rendering stride.
 */
export class CanvasZetaScene {
  constructor(container,{onProbe=()=>{},onStatus=()=>{},onCameraChange=()=>{}}={}) {
    this.container=container;this.onProbe=onProbe;this.onStatus=onStatus;this.onCameraChange=onCameraChange;
    this.state={};this.data=null;this.disposed=false;this.dirty=true;
    this.yaw=.62;this.pitch=.73;this.zoom=1;this.panX=0;this.panY=0;
    this.packetTime=0;this.lastFrame=performance.now();this.lastRender=0;
    this.pointerMap=new Map();this.probes=[];this.faceHits=[];
    container.querySelectorAll('.webgl-unavailable').forEach(n=>n.remove());
    this.canvas=document.createElement('canvas');
    this.canvas.style.cssText='display:block;width:100%;height:100%;touch-action:none;outline:none;';
    this.canvas.tabIndex=0;
    this.canvas.setAttribute('role','img');
    this.canvas.setAttribute('aria-label','Interactive software-rendered zeta surface. Drag to orbit; scroll or pinch to zoom; hover or tap to inspect.');
    this.ctx=this.canvas.getContext('2d',{alpha:false});
    this.renderer={domElement:this.canvas,software:true};
    container.appendChild(this.canvas);
    this.down=e=>{
      this.canvas.setPointerCapture(e.pointerId);this.pointerMap.set(e.pointerId,{x:e.clientX,y:e.clientY});
      this.drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:0,pan:e.shiftKey||e.button===2};
      if(this.pointerMap.size===2){const p=[...this.pointerMap.values()];this.pinch=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}
    };
    this.move=e=>{
      if(this.pointerMap.has(e.pointerId)){
        this.pointerMap.set(e.pointerId,{x:e.clientX,y:e.clientY});
        if(this.pointerMap.size===2){const p=[...this.pointerMap.values()],dist=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(this.pinch>0)this.zoom=clamp(this.zoom*dist/this.pinch,.25,8);this.pinch=dist;this.dirty=true;return;}
        if(this.drag){const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;this.drag.moved+=Math.hypot(dx,dy);
          if(this.drag.pan){this.panX+=dx;this.panY+=dy;}else{this.yaw+=dx*.006;this.pitch=clamp(this.pitch+dy*.006,-1.52,1.569);}
          this.drag.x=e.clientX;this.drag.y=e.clientY;this.dirty=true;
        }
      }else if(performance.now()-(this.lastHover||0)>90){this.lastHover=performance.now();this.inspect(e,false);}
    };
    this.up=e=>{const click=this.drag&&this.drag.moved<7&&this.pointerMap.size===1;this.pointerMap.delete(e.pointerId);this.drag=null;this.pinch=0;this.dirty=true;if(click)this.inspect(e,true);else this.onCameraChange();};
    this.wheel=e=>{e.preventDefault();this.zoom=clamp(this.zoom*Math.exp(-e.deltaY*.001),.25,8);this.dirty=true;this.onCameraChange();};
    this.context=e=>e.preventDefault();
    this.canvas.addEventListener('pointerdown',this.down);this.canvas.addEventListener('pointermove',this.move);this.canvas.addEventListener('pointerup',this.up);this.canvas.addEventListener('pointercancel',this.up);this.canvas.addEventListener('wheel',this.wheel,{passive:false});this.canvas.addEventListener('contextmenu',this.context);
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(container);this.resize();
    this.frame=this.frame.bind(this);this.raf=requestAnimationFrame(this.frame);
    this.onStatus({type:'fallback',renderMode:'software',message:'Canvas 3D renderer · identical numerical samples'});
  }
  resize(){
    this.width=Math.max(1,this.container.clientWidth);this.heightPixels=Math.max(1,this.container.clientHeight);const ratio=Math.min(devicePixelRatio||1,1.65);
    this.canvas.width=Math.round(this.width*ratio);this.canvas.height=Math.round(this.heightPixels*ratio);this.ctx.setTransform(ratio,0,0,ratio,0,0);this.pixelRatio=ratio;this.dirty=true;
  }
  inDomain(s,t){const d=this.data?.domain||NUMERICS;return finite(s)&&finite(t)&&s>=d.sigmaMin&&s<=d.sigmaMax&&Math.abs(t)<=d.tMax&&!(this.state.function==='zeta'&&Math.hypot(s-1,t)<.025);}
  visibleTriangle(u,v){
    if(!finite(u)||!finite(v)||u<0||u>1||v<0||v>1)return false;
    const {nx,valid}=this.data,[i,fu]=axisInterval(this.uAxis,u),[j,fv]=axisInterval(this.vAxis,v),a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;
    return fu+fv<=1?!!(valid[a]&&valid[b]&&valid[c]):!!(valid[b]&&valid[c]&&valid[d]);
  }
  syncReference(){
    this.logReference=this.state.heightLocked&&finite(this.state.heightLogReference)?this.state.heightLogReference:Number(this.state.heightReference)>0?Math.log(Number(this.state.heightReference)):this.autoLogReference;
    this.reference=Math.exp(this.logReference);
  }
  height(re,im){return this.heightPolar(logMagnitude(re,im),Math.atan2(im,re));}
  heightPolar(logAbs,arg=0){
    // There is no global normal on the Klein quotient; keep its seam exact.
    if(this.state.geometry==='klein'||this.state.displayDamping)return 0;
    const mode=this.state.heightMode||'log';if(mode==='flat'||!this.state.height||!validLog(logAbs)||logAbs===-Infinity)return 0;
    const relative=logAbs-this.logReference;let h;
    if(mode==='real'||mode==='imag')h=Math.asinh(Math.exp(Math.min(relative,700))*(mode==='real'?Math.cos(arg):Math.sin(arg)))/Math.asinh(1);
    else if(mode==='abs')h=Math.exp(Math.min(relative,4));else h=softplus(relative)/Math.LN2;
    return clamp(h,-2.5,2.5)*(this.state.geometry==='plane'?2.1:.46)*this.state.height;
  }
  color(re,im,bridge,shade=1){return this.colorPolar(logMagnitude(re,im),Math.atan2(im,re),bridge,shade);}
  colorPolar(logAbs,arg,bridge,shade=1,sigma,t){
    logAbs=displayLogMagnitude(logAbs,sigma,t,this.state);
    const mode=this.state.colorMode||'phase';if(!validLog(logAbs)||(['bridge','shear'].includes(mode)&&!finite(bridge)))return '#29313d';
    const relative=logAbs-this.logReference,normalized=softplus(relative)/Math.LN2;let h,s,l;
    if(mode==='phase'){
      h=((((arg||0)+Math.PI+(this.state.phaseOffset||0))/TAU)%1+1)%1;s=88;
      l=(.42+.075*Math.min(normalized,1)+(finite(relative)?.036*Math.cos(TAU*relative/Math.LN2):0))*100;
    }else if(mode==='modulus'){const t=clamp(normalized/1.8,0,1);h=.72-.64*t;s=72;l=16+47*t;}
    else {let v=['bridge','shear'].includes(mode)?bridge:Math.tanh(Math.exp(Math.min(relative,40))*(mode==='imag'?Math.sin(arg||0):Math.cos(arg||0))*2);if(!finite(v))v=0;const strength=clamp(Math.abs(v),0,1);h=v>=0?.45:.99;s=15+72*strength;l=76-36*strength;}
    if(this.state.displayDamping){const visibility=displayVisibility(logAbs,this.logReference);s*=visibility;l=6+(l-6)*visibility;}
    return `hsl(${h*360} ${s}% ${clamp(l*shade*(this.state.exposure||1),9,85)}%)`;
  }

  setData(data,state){
    const changed=this.state.geometry!==state.geometry,signature=renderStyleSignature(state);
    const preparedCacheHit=this.data===data&&this.preparedSignature===signature;
    this.data=data;this.state={...state};this.metadataCache ||= new WeakMap();
    let metadata=this.metadataCache.get(data);
    if(!metadata){metadata=sampleMetadata(data);this.metadataCache.set(data,metadata);}
    Object.assign(this,metadata);this.syncReference();
    if(!preparedCacheHit){this.prepare();this.preparedSignature=signature;}else this.refreshProbe();
    if(changed)this.resetCamera();this.dirty=true;
    const moving=!!this.drag||this.state.autoRotate||this.state.playing||(this.state.packets&&!this.state.packetPaused),effectiveStride=moving?this.motionStride:this.stride;
    this.lastReportedStride=effectiveStride;
    this.onStatus({type:'render',vertices:data.valid.length,faces:(moving?this.motionFaces:this.faces).filter(f=>!f.masked).length,heightScale:this.reference,reference:this.reference,logReference:this.logReference,renderMode:'software',meshStride:effectiveStride,motionDetail:!!moving,preparedCacheHit});
  }

  prepare(){
    const d=this.data;if(!d)return;this.raised=[];
    const heights=continueMaskedHeights(Float64Array.from(d.valid,(ok,i)=>ok?this.heightPolar(this.sampleLogs[i],this.sampleArgs[i]):0),d.valid,d.nx,d.ny,this.state.geometry);
    for(let i=0;i<d.valid.length;i++){const h=heights[i];this.raised.push([d.basePositions[3*i]+d.normals[3*i]*h,d.basePositions[3*i+1]+d.normals[3*i+1]*h,d.basePositions[3*i+2]+d.normals[3*i+2]*h]);}
    // High and Ultra retain their extra finite samples. The old fixed 20k
    // budget erased most visible benefit of selecting higher resolution.
    const budget=({draft:24000,standard:110000,high:260000,ultra:560000})[this.state.resolution]||110000;
    this.stride=Math.max(1,Math.ceil(Math.sqrt(d.nx*d.ny*2/budget)));
    // Film playback prepares only its bounded motion mesh. Pausing rebuilds
    // selected display detail from the same cached samples, without evaluation.
    const motionStride=Math.max(this.stride,Math.ceil(Math.sqrt(d.nx*d.ny*2/16000)));
    this.motionStride=motionStride;
    this.fullDetailPrepared=!this.state.playing;
    this.faces=this.makeFaces(this.state.playing?motionStride:this.stride);
    this.motionFaces=this.state.playing?this.faces:motionStride>this.stride?this.makeFaces(motionStride):this.faces;
    this.paths=[];this.markers=[];this.packetTracks=[];
    if(this.state.contours){this.contours('real',0,'#d3edff',.6);this.contours('imag',0,'#ffc28d',.6);}
    if(this.state.critical){if(this.state.geometry!=='plane')this.criticalOvals();else this.contours(i=>d.coords[2*i],.5,'#e7f8b7',1.1);}
    if(this.state.seams&&this.state.geometry!=='plane'){
      for(const v of this.state.geometry==='klein'?[0]:[0,1])this.addPath(Array.from({length:d.nx+1},(_,i)=>{const k=Math.round(v*d.ny)*(d.nx+1)+i;return [d.basePositions[3*k],d.basePositions[3*k+1],d.basePositions[3*k+2]];}),'#718199',.5,true);
      for(const u of [0,1])this.addPath(Array.from({length:d.ny+1},(_,j)=>{const k=j*(d.nx+1)+Math.round(u*d.nx);return [d.basePositions[3*k],d.basePositions[3*k+1],d.basePositions[3*k+2]];}),'#718199',.5,true);
      if(this.state.projective)for(const guide of d.projectiveGuides||[]){
        const points=guide.points.map((p,i)=>p.map((x,k)=>x+guide.normals[i][k]*.045));
        this.addPath(points,guide.color,1.2,true,.85);
      }
    }
    if(this.state.traps)for(const trap of d.zeroTraps||[])for(const ring of trap.rings)this.addPath(this.raiseLine(ring,.09),trap.color,3.2,false,trap.status==='unresolved'?.6:1);
    if(this.state.fall)for(const path of d.fallLines||[])this.addPath(this.raiseLine(path,.05),path.color,path.arrived?2:.8,false,path.arrived?.9:.45);
    for(const edge of d.countBox||[])this.addPath(this.raiseLine(edge,.1),edge.color,3,false,1);
    for(const rim of d.hole?.rim||[])this.addPath(this.raiseLine(rim,.07),'#ffd27a',3,false,1);
    if(this.state.vortices)for(const line of d.flowLines||[])this.addPath(this.raiseLine(line,.06),colorHex(line.color||'#e7ffee'),.65);
    if(this.state.ladder||this.state.packets)for(const [i,line]of(d.ladderLines||[]).entries()){
      const points=this.raiseLine(line,.08),color=colorHex(line.color||(i%2?'#d6a2ff':'#85f4d7'));
      if(this.state.ladder)this.addPath(points,color,line.kind==='rung'?.7:1.35,line.kind==='antibridge');
      if(this.state.packets&&line.kind==='rail')this.packetTracks.push({points,color,phase:line.phase||0,frequency:line.frequency||1,amplitude:line.amplitude??1,direction:line.direction||(i%2?-1:1)});
    }
    if(this.state.zeros){
      const markers=d.zeroPoints||[],allowed=[...new Set(markers.filter(p=>p.t>0&&p.kind!=='pole').map(p=>p.t))].sort((a,b)=>a-b).slice(0,3);let labels=0;
      for(const m of markers){
        const show=m.showLabel!==false&&(this.state.geometry==='plane'?labels<6:m.t>0&&allowed.includes(m.t));if(show)labels++;
        const h=this.height(...(m.value||[0,0]))+.065;
        this.markers.push({point:m.position.map((x,k)=>x+m.normal[k]*h),color:m.kind==='pole'?'#ff9b8b':'#edffbe',label:show?m.label:null,ring:true,size:3.0});
      }
    }
    this.addLandmarks();
    this.refreshProbe();
  }
  makeFaces(stride){
    const d=this.data,faces=[];
    const make=(ids)=>{
      const masked=ids.some(k=>!d.valid[k]);if(masked&&(this.state.geometry==='plane'||d.hole))return;
      const points=ids.map(k=>this.raised[k]);
      const ab=points[1].map((x,k)=>x-points[0][k]),ac=points[2].map((x,k)=>x-points[0][k]),n=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]],norm=Math.hypot(...n)||1;
      const shade=.70+.30*Math.abs((-.35*n[0]+.85*n[1]+.39*n[2])/norm);
      // Average the complex values with a shared local exponential scale;
      // raw values can be unrepresentable while their phase is reliable.
      const ref=Math.max(...ids.map(k=>this.sampleLogs[k]));let re=0,im=0;
      if(finite(ref))for(const k of ids){const amplitude=Math.exp(this.sampleLogs[k]-ref);re+=amplitude*Math.cos(this.sampleArgs[k]);im+=amplitude*Math.sin(this.sampleArgs[k]);}
      const logAbs=finite(ref)?ref+Math.log(Math.hypot(re,im)/3):-Infinity,arg=Math.atan2(im,re);
      const bridge=ids.every(k=>finite(d.bridge?.[k]))?ids.reduce((x,k)=>x+d.bridge[k],0)/3:NaN;
      faces.push({ids,points,masked,color:masked?'#142033':this.colorPolar(logAbs,arg,bridge,shade,ids.reduce((a,k)=>a+d.coords[2*k],0)/3,ids.reduce((a,k)=>a+d.coords[2*k+1],0)/3)});
    };
    const cell=(i,j,i2,j2)=>{
      // Never bridge a masked interior just because coarse corners are valid.
      // Refine mixed-coverage cells all the way to the real sample grid.
      if(i2-i>1||j2-j>1){
        let first=null,mixed=false;
        outer:for(let y=j;y<=j2;y++)for(let x=i;x<=i2;x++){const v=!!d.valid[y*(d.nx+1)+x];if(first===null)first=v;else if(v!==first){mixed=true;break outer;}}
        if(mixed){const im=Math.floor((i+i2)/2),jm=Math.floor((j+j2)/2),xs=i2-i>1?[i,im,i2]:[i,i2],ys=j2-j>1?[j,jm,j2]:[j,j2];for(let y=0;y<ys.length-1;y++)for(let x=0;x<xs.length-1;x++)cell(xs[x],ys[y],xs[x+1],ys[y+1]);return;}
      }
      const a=j*(d.nx+1)+i,b=j*(d.nx+1)+i2,c=j2*(d.nx+1)+i,e=j2*(d.nx+1)+i2;make([a,c,b]);make([b,c,e]);
    };
    for(let j=0;j<d.ny;j+=stride)for(let i=0;i<d.nx;i+=stride)cell(i,j,Math.min(i+stride,d.nx),Math.min(j+stride,d.ny));
    return faces;
  }
  contours(field,level,color,width){
    for(const face of this.faces){if(face.masked)continue;const cross=[],isComponent=typeof field==='string',ref=isComponent?Math.max(...face.ids.map(k=>this.sampleLogs[k])):0;
      const at=isComponent?k=>this.sampleLogs[k]===-Infinity?0:Math.exp(this.sampleLogs[k]-(finite(ref)?ref:0))*(field==='real'?Math.cos(this.sampleArgs[k]):Math.sin(this.sampleArgs[k])):field;
      for(let e=0;e<3;e++){const a=face.ids[e],b=face.ids[(e+1)%3],fa=at(a)-level,fb=at(b)-level;if(!finite(fa)||!finite(fb)||(fa===0&&fb===0))continue;
        if((fa<=0&&fb>0)||(fa>0&&fb<=0)){const w=fa/(fa-fb),point=mix(this.raised[a],this.raised[b],w);for(let k=0;k<3;k++)point[k]+=(this.data.normals[3*a+k]*(1-w)+this.data.normals[3*b+k]*w)*.04;cross.push(point);}
      }
      if(cross.length===2)this.addPath(cross,color,width);
    }
  }
  criticalSamples() {
    // Every analytic sample was prepared by the worker/cache. Applying a
    // frame must never invoke zeta, xi, or theta integration on the UI thread.
    return this.data?.criticalSamples || [];
  }

  criticalOvals(){
    for(const samples of this.criticalSamples()){
      let raised=[],guide=[],lastSupported=null;
      const flushRaised=()=>{this.addPath(raised,'#e7f8b7',1.3,false,1);raised=[];};
      const flushGuide=()=>{this.addPath(guide,lastSupported?'#a6bb88':'#a6b3c6',lastSupported?.65:1,!lastSupported,lastSupported?.3:.8);guide=[];};
      for(let i=0;i<samples.length;i++){
        const p=samples[i],base=p.position.map((x,k)=>x+p.normal[k]*.038);
        if(i){const supported=samples[i-1].computed&&p.computed;if(lastSupported!==null&&supported!==lastSupported){const last=guide.at(-1);flushGuide();if(last)guide.push(last);}lastSupported=supported;}
        guide.push(base);
        if(p.computed){const h=this.heightPolar(p.polar.logAbs,p.polar.arg)+.065;raised.push(p.position.map((x,k)=>x+p.normal[k]*h));}else flushRaised();
      }
      flushGuide();flushRaised();
    }
  }
  raiseLine(line,lift){return(line.points||line.positions||[]).map((p,i)=>{if(!line.normals?.[i])return p;const value=line.values?.[i],h=(line.logAbs?this.heightPolar(line.logAbs[i],line.arg?.[i]||0):value?this.height(value[0],value[1]):0)+lift;return p.map((x,k)=>x+line.normals[i][k]*h);});}
  addPath(points,color,width=1,dashed=false,opacity=.82){if(points.length>1)this.paths.push({points,color,width,dashed,opacity});}

  addLandmarks(){
    if(this.state.geometry==='torus'&&!this.state.projective&&!(this.state.ladder||this.state.critical))return;
    for(const marker of this.data.landmarkValues||[]){
      if(this.state.geometry==='torus'&&!this.state.projective&&!this.state.ladder&&marker.kind!=='puncture')continue;
      const h=(marker.polar?this.heightPolar(marker.polar.logAbs,marker.polar.arg):0)+.08;
      this.markers.push({point:marker.position.map((x,k)=>x+marker.normal[k]*h),
        color:marker.kind==='puncture'?'#9aacc5':marker.kind==='anti'?'#ffe3a4':marker.kind==='chart'?'#83e8e5':'#a3b6db',
        label:marker.kind==='branch'?'branch · '+marker.label:marker.label,ring:true,size:marker.kind==='branch'?2.5:4});
    }
  }

  updateStyle(state){
    const old=this.state,previousLogReference=this.logReference;this.state={...this.state,...state};
    this.syncReference();
    if(this.data&&['projective','height','heightMode','heightReference','heightLocked','heightLogReference','colorMode','phaseOffset','opacity','wireframe','exposure','contours','critical','zeros','vortices','ladder','packets','seams','playing','displayDamping','displayDampingScale'].some(k=>old[k]!==this.state[k]))this.prepare();
    this.preparedSignature=renderStyleSignature(this.state);
    if(this.data&&old.playing!==this.state.playing)this.refreshProbe();
    if(this.data&&(previousLogReference!==this.logReference||old.playing!==this.state.playing)){
      const moving=!!this.drag||this.state.autoRotate||this.state.playing||(this.state.packets&&!this.state.packetPaused),effectiveStride=moving?this.motionStride:this.stride;
      this.lastReportedStride=effectiveStride;
      this.onStatus({type:'render',vertices:this.data.valid.length,faces:(moving?this.motionFaces:this.faces).filter(f=>!f.masked).length,heightScale:this.reference,reference:this.reference,logReference:this.logReference,renderMode:'software',meshStride:effectiveStride,motionDetail:!!moving});
    }
    this.dirty=true;
  }
  resetCamera(view='perspective'){
    this.yaw=view==='top'||view==='phase'?0:.62;this.pitch=view==='top'||view==='phase'?Math.PI/2:view==='front'?0:.73;this.zoom=1;this.panX=this.panY=0;this.dirty=true;
  }
  getCameraState(){return {type:'software',azimuth:this.yaw,elevation:this.pitch,zoom:this.zoom,pan:[this.panX/this.width,this.panY/this.heightPixels],distance:(this.state.geometry==='plane'?27:20)/this.zoom,target:[0,this.state.geometry==='plane'?.65:0,0]};}
  setCameraState(camera){
    if(!camera||typeof camera!=='object')return;
    if(finite(camera.azimuth))this.yaw=camera.azimuth%TAU;
    if(finite(camera.elevation))this.pitch=clamp(camera.elevation,-1.52,Math.PI/2);
    if(camera.type==='software'&&finite(camera.zoom))this.zoom=clamp(camera.zoom,.25,8);
    else if(finite(camera.distance)&&camera.distance>0)this.zoom=clamp((this.state.geometry==='plane'?27:20)/camera.distance,.25,8);
    if(camera.type==='software'&&Array.isArray(camera.pan)&&camera.pan.length===2&&camera.pan.every(finite)){this.panX=clamp(camera.pan[0],-2,2)*this.width;this.panY=clamp(camera.pan[1],-2,2)*this.heightPixels;}
    this.dirty=true;
  }
  project(p){
    const x=p[0],y=p[1]-(this.state.geometry==='plane'?.65:0),z=p[2],cy=Math.cos(this.yaw),sy=Math.sin(this.yaw),cp=Math.cos(this.pitch),sp=Math.sin(this.pitch);
    const a=cy*x-sy*z,b=sy*x+cy*z,Y=cp*y-sp*b,Z=sp*y+cp*b;
    const distance=this.state.geometry==='plane'?27:20,f=distance/(distance-Z);
    const radius=this.state.geometry==='plane'?9.8:this.state.geometry==='sphere'?5.5:6.0;
    const scale=Math.min(this.width,this.heightPixels)*.46/radius*this.zoom;
    return [this.width*.5+this.panX+a*f*scale,this.heightPixels*.51+this.panY-Y*f*scale,Z,f];
  }
  setProbe(sigma,t){
    this.probeCoordinates=finite(sigma)&&finite(t)?{sigma,t}:null;
    if(!this.data||this.state.playing||!this.inDomain(sigma,t)){this.refreshProbe();return;}
    this.probeCache ||= new WeakMap();let sample=this.probeCache.get(this.data);
    if(!sample||sample.sigma!==sigma||sample.t!==t){
      const polar=polarAt(sigma,t,this.state.function,this.state.tau);
      if(!validLog(polar.logAbs)||!finite(polar.arg)){this.drawProbe(null);return;}
      sample={sigma,t,polar,lifts:liftPoint(sigma,t,this.state)};this.probeCache.set(this.data,sample);
    }
    this.drawProbe(sample);
  }
  refreshProbe(){
    const coordinates=this.probeCoordinates;
    if(this.state.playing||!coordinates){this.drawProbe(null);return;}
    const sample=this.probeCache?.get(this.data)||this.data?.probeSample;
    this.drawProbe(sample&&sample.sigma===coordinates.sigma&&sample.t===coordinates.t?sample:null);
  }
  drawProbe(sample){
    this.probes=[];this.dirty=true;
    if(!sample||!this.data||!this.inDomain(sample.sigma,sample.t))return;
    for(const p of sample.lifts||[]){
      if(!this.visibleTriangle(p.u,p.v))continue;
      const localArg=p.conjugated?-sample.polar.arg:sample.polar.arg;
      const h=this.heightPolar(sample.polar.logAbs,localArg)+.08;
      this.probes.push({point:p.position.map((x,k)=>x+p.normal[k]*h),color:'#ffffff',ring:true,size:5});
    }
  }

  grid(ctx){
    if(this.state.geometry!=='plane')return;
    ctx.save();ctx.strokeStyle='#25364b';ctx.globalAlpha=.55;ctx.lineWidth=.7;
    for(let i=0;i<=12;i++){const a=this.project([-6+i,-.09,-8]),b=this.project([-6+i,-.09,8]);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
    for(let i=0;i<=16;i++){const a=this.project([-6,-.09,-8+i]),b=this.project([6,-.09,-8+i]);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
    ctx.globalAlpha=.85;ctx.fillStyle='#90a0b8';ctx.font='11px ui-monospace,monospace';ctx.textAlign='center';
    for(let i=0;i<=4;i++){const a=this.project([-6+3*i,-.1,8.45]),s=this.state.sigmaMin+(this.state.sigmaMax-this.state.sigmaMin)*i/4;ctx.fillText(Number(s.toFixed(2)).toString(),a[0],a[1]);}
    for(let i=0;i<=4;i++){const a=this.project([-6.45,-.1,-8+4*i]),t=this.state.tMin+(this.state.tMax-this.state.tMin)*i/4;ctx.fillText(Number(t.toFixed(2)).toString(),a[0],a[1]);}
    let a=this.project([0,-.1,9.15]);ctx.fillText('σ · Re(s)',a[0],a[1]);a=this.project([-7.0,-.1,0]);ctx.fillText('t · Im(s)',a[0],a[1]);ctx.restore();
  }
  render(){
    if(!this.ctx)return;const ctx=this.ctx,W=this.width,H=this.heightPixels;
    ctx.setTransform(this.pixelRatio,0,0,this.pixelRatio,0,0);ctx.fillStyle='#080e19';ctx.fillRect(0,0,W,H);
    const bg=ctx.createRadialGradient(W*.52,H*.42,20,W*.5,H*.5,Math.max(W,H)*.67);bg.addColorStop(0,'#122035');bg.addColorStop(1,'#080e19');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    if(!this.data)return;this.grid(ctx);const objects=[];this.faceHits=[];
    const moving=!!this.drag||this.state.autoRotate||this.state.playing||(this.state.packets&&!this.state.packetPaused);
    const effectiveStride=moving?this.motionStride:this.stride;
    if(this.lastReportedStride!==effectiveStride){
      this.lastReportedStride=effectiveStride;
      this.onStatus({type:'render',vertices:this.data.valid.length,faces:(moving?this.motionFaces:this.faces).filter(f=>!f.masked).length,heightScale:this.reference,reference:this.reference,logReference:this.logReference,renderMode:'software',meshStride:effectiveStride,motionDetail:!!moving});
    }
    const projected=this.raised.map(p=>this.project(p));
    for(const face of(moving?this.motionFaces:this.faces)){const p=face.ids.map(i=>projected[i]);if(p.some(x=>!finite(x[0])||!finite(x[1])))continue;objects.push({type:'face',face,p,depth:(p[0][2]+p[1][2]+p[2][2])/3});}
    for(const path of this.paths){let dashDistance=0;for(let i=1;i<path.points.length;i++){const a=this.project(path.points[i-1]),b=this.project(path.points[i]);objects.push({type:'line',a,b,depth:(a[2]+b[2])/2+.015,color:path.color,width:path.width,dashed:path.dashed,opacity:path.opacity,dashOffset:-dashDistance});dashDistance+=Math.hypot(b[0]-a[0],b[1]-a[1]);}}
    for(const marker of [...this.markers,...this.probes]){const p=this.project(marker.point);objects.push({type:'marker',marker,p,depth:p[2]+.025});}
    if(this.state.packets)for(const track of this.packetTracks)for(let k=0;k<5;k++){
      const frac=((k/5+track.phase/TAU+track.direction*this.packetTime*.055)%1+1)%1,index=frac*(track.points.length-1),i=Math.floor(index);if(!track.points[i])continue;
      const p=this.project(mix(track.points[i],track.points[Math.min(i+1,track.points.length-1)],index-i));const a=.65+.35*Math.cos(this.packetTime*track.frequency+track.phase+k/5*TAU);
      objects.push({type:'packet',p,depth:p[2]+.04,color:track.color,amplitude:a*track.amplitude});
    }
    objects.sort((a,b)=>a.depth-b.depth);
    for(const o of objects){
      if(o.type==='face'){
        const {p,face}=o;ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);ctx.lineTo(p[1][0],p[1][1]);ctx.lineTo(p[2][0],p[2][1]);ctx.closePath();ctx.fillStyle=face.color;ctx.globalAlpha=face.masked?.9:(this.state.opacity??.98);ctx.fill();ctx.strokeStyle=face.color;ctx.lineWidth=.6;ctx.stroke();
        if(this.state.wireframe){ctx.strokeStyle=face.masked?'#334157':'#d0e0f0';ctx.globalAlpha=.16;ctx.lineWidth=.55;ctx.stroke();}ctx.globalAlpha=1;
        this.faceHits.push(o);
      }else if(o.type==='line'){
        ctx.strokeStyle=o.color;ctx.globalAlpha=o.opacity??.82;ctx.lineWidth=o.width;ctx.setLineDash(o.dashed?[3,3]:[]);ctx.lineDashOffset=o.dashed?o.dashOffset:0;ctx.beginPath();ctx.moveTo(o.a[0],o.a[1]);ctx.lineTo(o.b[0],o.b[1]);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.globalAlpha=1;
      }else if(o.type==='marker'){
        const {p,marker:m}=o;ctx.strokeStyle=m.color;ctx.fillStyle=m.color;ctx.lineWidth=1.1;ctx.beginPath();ctx.arc(p[0],p[1],m.size,0,TAU);m.ring?ctx.stroke():ctx.fill();ctx.beginPath();ctx.arc(p[0],p[1],1.2,0,TAU);ctx.fill();
        if(m.label){ctx.font='10px ui-monospace,monospace';const text=m.label.length>38?m.label.slice(0,38):m.label,width=ctx.measureText(text).width;ctx.fillStyle='rgba(7,13,23,.86)';ctx.fillRect(p[0]+6,p[1]-16,width+10,17);ctx.fillStyle=m.color;ctx.textAlign='left';ctx.fillText(text,p[0]+11,p[1]-4);}
      }else{
        const {p}=o;ctx.globalAlpha=clamp(o.amplitude,.12,1);ctx.shadowBlur=13;ctx.shadowColor=o.color;ctx.fillStyle=o.color;ctx.beginPath();ctx.arc(p[0],p[1],3.1,0,TAU);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;
      }
    }
  }
  inspect(event,pinned){
    if(!this.data)return;const rect=this.canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    for(let i=this.faceHits.length-1;i>=0;i--){const face=this.faceHits[i],b=barycentric(x,y,...face.p);if(!b)continue;if(face.face.masked)return;
      // Perspective correction back to barycentric coordinates on the face.
      const w=b.map((v,k)=>v*face.p[k][3]),den=w.reduce((a,c)=>a+c,0);for(let k=0;k<3;k++)w[k]/=den;
      let sigma=0,t=0,re=0,im=0,u=0,v=0;
      face.face.ids.forEach((id,k)=>{sigma+=this.data.coords[2*id]*w[k];t+=this.data.coords[2*id+1]*w[k];re+=this.data.values[2*id]*w[k];im+=this.data.values[2*id+1]*w[k];u+=(this.data.uvs?this.data.uvs[2*id]:(id%(this.data.nx+1))/this.data.nx)*w[k];v+=(this.data.uvs?this.data.uvs[2*id+1]:Math.floor(id/(this.data.nx+1))/this.data.ny)*w[k];});
      this.onProbe({sigma,t,re,im,u,v,pinned,source:'mesh-interpolated',renderMode:'software'});return;
    }
  }
  frame(now){
    if(this.disposed)return;const delta=Math.min((now-this.lastFrame)/1000,.1);this.lastFrame=now;
    if(this.state.autoRotate){this.yaw+=delta*.07;this.dirty=true;}
    if(this.state.packets&&!this.state.packetPaused){this.packetTime+=delta*(this.state.flowSpeed??1);this.dirty=true;}
    if(this.dirty&&now-this.lastRender>42){this.render();this.lastRender=now;this.dirty=false;}
    this.raf=requestAnimationFrame(this.frame);
  }
  screenshot(){this.render();return this.canvas.toDataURL('image/png');}
  dispose(){this.disposed=true;cancelAnimationFrame(this.raf);this.resizeObserver?.disconnect();for(const [type,handler]of[['pointerdown',this.down],['pointermove',this.move],['pointerup',this.up],['pointercancel',this.up],['wheel',this.wheel],['contextmenu',this.context]])this.canvas.removeEventListener(type,handler);this.canvas.remove();}
}

