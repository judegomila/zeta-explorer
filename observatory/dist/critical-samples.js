/**
 * Pure numerical overlay preparation. Run this in the field sampler before a
 * view is declared ready; renderers consume the returned records verbatim.
 * Geometric punctures remain explicit and never receive a function value.
 */
import { evaluatePolar } from './math.js';
import { sampleAxes, criticalCurves, criticalCurvePoint, embedded, landmarks, surfacePoint } from './geometry.js';

const validLog=x=>Number.isFinite(x)||x===-Infinity;
function inside(sigma,t,state,domain){
  return Number.isFinite(sigma)&&Number.isFinite(t)
    &&sigma>=domain.sigmaMin&&sigma<=domain.sigmaMax&&Math.abs(t)<=domain.tMax
    &&!(state.function==='zeta'&&Math.hypot(sigma-1,t)<.025);
}
function valueAt(sigma,t,state,domain){
  if(!inside(sigma,t,state,domain))return null;
  const p=evaluatePolar(sigma,t,state.function,state.tau);
  return p.valid!==false&&validLog(p.logAbs)&&Number.isFinite(p.arg)?p:null;
}

/** Identical adaptive critical-trace sampling for GPU and Canvas views. */
export function computeCriticalSamples(state,domain,axes=sampleAxes(state)){
  if(state.geometry==='plane')return [];
  const segments=({draft:192,standard:384,high:640,ultra:960})[state.resolution]||384;
  return criticalCurves(state,{segments}).map(curve=>{
    const knots=new Set(curve.points.map(p=>p.q));
    const axis=state.geometry==='sphere'&&!state.projective?axes.v:axes.u;
    for(const x of axis){
      if(state.geometry==='sphere'&&state.projective)knots.add(x);
      else if(state.geometry==='sphere'){knots.add(x/2);knots.add(1-x/2);}
      else knots.add(curve.index===0?x:((.5-x)%1+1)%1);
    }
    const qs=[...knots].sort((a,b)=>a-b),cache=new Map();
    const sample=q=>{
      if(cache.has(q))return cache.get(q);
      const p=criticalCurvePoint(q,curve.index,state);
      const polar=p.valid?valueAt(p.sigma,p.t,state,domain):null;
      const result={q:p.q,u:p.u,v:p.v,position:p.position,normal:p.normal,sigma:p.sigma,t:p.t,valid:!!p.valid,puncture:!!p.puncture,polar,computed:!!polar};cache.set(q,result);return result;
    };
    const out=[];
    const refine=(a,b,depth)=>{
      let split=a.computed!==b.computed;
      const chord=Math.hypot(...a.position.map((x,k)=>x-b.position[k]));
      if(a.computed&&b.computed&&chord>.012){
        const phase=Math.abs(Math.atan2(Math.sin(a.polar.arg-b.polar.arg),Math.cos(a.polar.arg-b.polar.arg)));
        split ||= phase>.55 || Math.abs(a.polar.logAbs-b.polar.logAbs)>.5
          || Math.abs(a.t-b.t)>Math.max(.8,.04*Math.min(Math.abs(a.t),Math.abs(b.t)));
      }
      if(split&&depth<8&&cache.size<12000){const m=sample((a.q+b.q)/2);refine(a,m,depth+1);refine(m,b,depth+1);}
      else out.push(b);
    };
    out.push(sample(qs[0]));
    for(let i=1;i<qs.length;i++)refine(sample(qs[i-1]),sample(qs[i]),0);
    return out;
  });
}

/** Already evaluated locations for every optional geometric landmark. */
export function computeLandmarkValues(state,domain){
  if(state.geometry==='sphere'&&!state.projective){
    return [{...embedded(0,0,'sphere'),u:0,v:0,kind:'puncture',label:'∞ · chart puncture',sigma:NaN,t:NaN,puncture:true,polar:null,computed:false}];
  }
  if(state.geometry!=='torus'&&!(state.geometry==='sphere'&&state.projective))return [];
  const L=landmarks(state),result=[];
  for(const [kind,list]of[['puncture',L.punctures],['anti',L.antiBridge],['branch',L.branches],['chart',L.regular||[]]]){
    for(const p of list){
      const base=embedded(p.u,p.v,state.geometry);
      const sample=kind==='puncture'?null:surfacePoint(p.u,p.v,state);
      const polar=sample?.valid?valueAt(sample.sigma,sample.t,state,domain):null;
      result.push({...base,u:p.u,v:p.v,kind,label:p.label,
        sigma:sample?.sigma??NaN,t:sample?.t??NaN,puncture:kind==='puncture',polar,computed:!!polar});
    }
  }
  return result;
}
