import { ZetaScene } from './renderer.js';
import { CanvasZetaScene } from './canvas-renderer.js';
import { evaluatePolar, ZERO_HEIGHTS, NUMERICS } from './math.js';
import { surfacePoint } from './geometry.js';
import { domainFor, withinDomain, domainLabel } from './domain.js';
import { FieldService } from './field-service.js';
import { fieldKey } from './field-cache.js';
import { createSequencePlan, sequenceKey, prepareSequence, nearestFrame } from './playback.js';
import { ProjectivePanel } from './projective-panel.js';
import { QuotientPanel } from './quotient-panel.js';
import { isQuotientGeometry } from './quotient.js';
import { FiberPanels } from './fiber-panels.js';
import { DynamicsPanel } from './dynamics-panel.js';
import { ResearchPanel } from './research-panel.js';
import { RESEARCH_DEFAULTS, RESEARCH_LIMITS, RESEARCH_ENUMS, RESEARCH_VIEW_NAMES, normalizeResearchConfig, createResearchPresets } from './research-state.js';
import { DYNAMICS_DEFAULTS, DYNAMICS_LIMITS, DYNAMICS_ENUMS, normalizeDynamicsConfig } from './dynamics.js';
import { decodeViewURL, ViewURLController, sanitizeViewCamera, sanitizeViewProbe } from './view-url.js';

const $=id=>document.getElementById(id), $$=s=>document.querySelectorAll(s), TAU=2*Math.PI;
const defaults={...DYNAMICS_DEFAULTS,...RESEARCH_DEFAULTS,dynamicsMode:'off',fiberMode:'off',spinorPhase:0,spinorRotation:0,spinorAxis:'z',twistorSheet:1,twistorFiberTheta:0,twistorFiberPhi:0,twistorProjection:'north',projective:false,projectiveChannel:'bridge',derivativeScale:1,geometry:'plane',function:'zeta',heightMode:'log',height:1.1,colorMode:'phase',phaseOffset:0,exposure:1,opacity:.97,wireframe:false,contours:true,critical:true,zeros:true,vortices:false,ladder:false,packets:false,packetPaused:false,seams:true,autoRotate:false,flowSpeed:1,packetWidth:.35,playing:false,tau:0,sigmaMin:-2,sigmaMax:3,tMin:8,tMax:38,bridgeA:.25,chartScale:24,torusR:1.6,resolution:'standard',extent:'extended',heightReference:0,heightLocked:false,heightLogReference:0,heatStart:-.3,heatEnd:.5,heatFrames:17,heatFPS:6,playbackResolution:'standard'};
const dynamicsBase={...defaults,projective:false,fiberMode:'off',geometry:'plane',function:'xi',playing:false,autoRotate:false,packets:false};
const dynamicsViewNames={phase:'dynamics',relax:'relaxation',walk:'randomWalk',cancel:'phaseCancel',heat:'boundedHeat',trap:'zeroTrap',collision:'heatCollision'};
const presets={
 ...createResearchPresets(defaults),
 critical:{settings:{...defaults},note:'The first six nontrivial zeros, from t = 8 to 38.'},
 vortex:{settings:{...defaults,sigmaMin:-.15,sigmaMax:1.15,tMin:12.8,tMax:15.5,height:.7,vortices:true,contours:true},note:'A close look at the phase circulation around the first zero.'},
 torus:{settings:{...defaults,geometry:'torus',function:'zeta',ladder:true,packets:true,height:.38,contours:false,chartScale:24},note:'The exact two-sheeted elliptic cover, with an explicit spectral lens.'},
 sphere:{settings:{...defaults,geometry:'sphere',height:.5,contours:false,chartScale:24},note:'Inverse stereographic coordinates. The north pole represents infinity.'},
 heat:{settings:{...defaults,function:'heat',sigmaMin:-.75,sigmaMax:1.75,tMin:10,tMax:32,height:.8,contours:true,tau:0},note:'The actual de Bruijn–Newman family. At τ = 0 this is completed ξ.'},
 bridge:{settings:{...defaults,function:'xi',colorMode:'bridge',sigmaMin:-.25,sigmaMax:1.25,tMin:10,tMax:28,height:.7,ladder:true,contours:false},note:'Signed finite bridge balance from ξ(s+a) and ξ(s−a).'},
 projective:{settings:{...defaults,projective:true,geometry:'torus',function:'xi',torusR:2,ladder:true,height:.35,contours:false},note:'Projective elliptic curve, two critical ovals, infinity and anti-bridge, with a linked shifted-pair sphere.'},
 projectiveSphere:{settings:{...defaults,projective:true,geometry:'sphere',function:'xi',torusR:2,ladder:true,height:.35,contours:false,projectiveChannel:'domain'},note:'The projective domain [s₀−1:s₀], with finite and reciprocal charts linked to both torus sheets.'},
 klein:{settings:{...defaults,projective:true,geometry:'klein',function:'xi',torusR:2,heightMode:'flat',height:0,ladder:true,contours:false},note:'The exact free antiholomorphic quotient Eᵣ/A. One critical loop, paired infinity lifts, and a conjugating seam.'},
 annulus:{settings:{...defaults,projective:true,geometry:'annulus',function:'xi',torusR:2,heightMode:'flat',height:0,ladder:true,contours:false},note:'The reflection quotient Eᵣ/R. Its two critical boundaries expose the even and odd boundary conditions.'},
 spinor:{settings:{...defaults,projective:true,geometry:'torus',function:'xi',torusR:2,ladder:true,height:.35,contours:false,fiberMode:'spinor'},note:'The selected homogeneous pair lifted to a spinor: Hopf phase, Bloch direction and 4π rotation.'},
 twistor:{settings:{...defaults,projective:true,geometry:'torus',function:'xi',torusR:2,ladder:true,height:.35,contours:false,fiberMode:'twistor'},note:'A chosen Euclidean twistor structure on ℂℙ³: the elliptic point, its S⁴ image and its ℂℙ¹ fiber.'},
 dynamics:{settings:{...dynamicsBase,dynamicsMode:'phase',dynamicsAlpha:0,dynamicsBeta:1},note:'Trace the phase current of completed ξ. The particles move; the ξ zeros stay fixed.'},
 relaxation:{settings:{...dynamicsBase,dynamicsMode:'relax',dynamicsAlpha:.8,dynamicsBeta:0},note:'Move numerical probes down log|ξ| toward its fixed zeros.'},
 randomWalk:{settings:{...dynamicsBase,dynamicsMode:'walk',dynamicsAlpha:.15,dynamicsBeta:.45,dynamicsDiffusion:.035},note:'Reproducible random walks in the spectral plane, with adjustable drift and a bounded domain.'},
 phaseCancel:{settings:{...dynamicsBase,dynamicsMode:'cancel'},note:'Interfere ξ(s+a) with a phase-shifted ξ(s−a). Track the zeros of the resulting field.'},
 boundedHeat:{settings:{...dynamicsBase,dynamicsMode:'heat',dynamicsPerturbation:.6,dynamicsBoundary:'pin'},note:'Diffuse a perturbed complex ξ field in a bounded box. This is spatial heat relaxation.'},
 zeroTrap:{settings:{...dynamicsBase,dynamicsMode:'trap'},note:'Perturb a finite zero system, then compare transverse pinning with phase-locked forcing.'},
 heatCollision:{settings:{...dynamicsBase,dynamicsMode:'collision',dynamicsPolynomial:'cubic'},note:'Watch finite-polynomial heat evolution through root collisions. Includes Math Explorer’s Lehmer and quartet cases.'},
 pole:{settings:{...defaults,sigmaMin:-10,sigmaMax:4,tMin:-7,tMax:7,height:1.3,contours:true},note:'The pole at s = 1 and the trivial zeros at negative even integers.'},
 phase:{settings:{...defaults,heightMode:'flat',height:0,sigmaMin:-2,sigmaMax:3,tMin:0,tMax:48,contours:true},note:'A plane phase atlas with an undistorted top view.'}
};
let state={...defaults},renderedState={...state},data=null,busy=false,computeTimer,heatTimer,toastTimer,reference=1,logReference=0,probe={sigma:.5,t:ZERO_HEIGHTS[0]},pinned=false,probeEditing=false,pendingCamera=null,windingKey=null,saveViews=[],packetTime=0,lastPacketTime=performance.now();
let fieldService,fieldController=null,requestSerial=0,warmController=null,warmTimer,warmMessage='',prepareController=null,preparing=false,prepareMessage='',activeClip=null,frameIndex=0,frameDirection=1,lastSource='';
let dynamicsPanel=null,researchPanel=null,lastResearchURL=0;
let viewURL=null,sharedCamera=null,pendingResetView=null,cameraURLTimer,focusModuleAfterLoad=false,lastBufferedURL=0;
const defaultProbe={sigma:.5,t:ZERO_HEIGHTS[0]};
const enums={...DYNAMICS_ENUMS,...RESEARCH_ENUMS,fiberMode:['off','spinor','twistor'],spinorAxis:['x','y','z'],twistorSheet:[1,-1],twistorProjection:['north','south'],projectiveChannel:['domain','bridge','derivative'],geometry:['plane','sphere','torus','klein','annulus'],function:['zeta','xi','heat'],heightMode:['log','abs','real','imag','flat'],colorMode:['phase','modulus','real','imag','bridge','shear'],resolution:['draft','standard','high','ultra'],extent:['core','extended'],playbackResolution:['draft','standard','current'],heatFrames:[9,17,33]};
const limits={...DYNAMICS_LIMITS,...RESEARCH_LIMITS,spinorPhase:[0,TAU],spinorRotation:[0,2*TAU],twistorFiberTheta:[0,Math.PI],twistorFiberPhi:[0,TAU],derivativeScale:[.01,20],height:[0,2.4],phaseOffset:[0,TAU],exposure:[.3,2],opacity:[.1,1],flowSpeed:[.1,3],packetWidth:[.1,1],tau:[-.3,.5],sigmaMin:[-128,128.99],sigmaMax:[-127.99,129],tMin:[-2000,1999.99],tMax:[-1999.99,2000],bridgeA:[.005,1.5],chartScale:[1,72],torusR:[1.15,3],heightReference:[0,1e300],heightLogReference:[-100000,100000],heatStart:[-.3,.49],heatEnd:[-.29,.5],heatFPS:[1,12]};
function normalizeQuotient(s){
 if(!isQuotientGeometry(s.geometry)||s.dynamicsMode!=='off'||s.researchMode!=='off')return s;
 s.projective=true;s.fiberMode='off';if(s.function==='zeta')s.function='xi';
 if(s.geometry==='klein'){s.heightMode='flat';s.height=0;}
 return s;
}
function validate(input){const s={...defaults};for(const key in defaults){const v=input?.[key];if(v===undefined)continue;if(enums[key]){if(enums[key].includes(v))s[key]=v;}else if(typeof defaults[key]==='boolean'){if(typeof v==='boolean')s[key]=v;}else if(typeof defaults[key]==='string'&&typeof v==='string'){s[key]=v.slice(0,128);}else if(typeof v==='number'&&Number.isFinite(v)){s[key]=limits[key]?Math.max(limits[key][0],Math.min(limits[key][1],v)):v;}}if(s.sigmaMax-s.sigmaMin<.05)s.sigmaMax=Math.min(129,s.sigmaMin+.05);if(s.tMax-s.tMin<.05)s.tMax=Math.min(2000,s.tMin+.05);if(input?.heightLocked===undefined&&s.heightReference>0){s.heightLocked=true;s.heightLogReference=Math.log(s.heightReference);}if(s.heatStart>=s.heatEnd){s.heatStart=defaults.heatStart;s.heatEnd=defaults.heatEnd;}const dynamics=normalizeDynamicsConfig(s);for(const key of Object.keys(DYNAMICS_DEFAULTS))s[key]=dynamics[key];const research=normalizeResearchConfig(s);for(const key of Object.keys(RESEARCH_DEFAULTS))s[key]=research[key];if(s.researchMode!=='off')s.dynamicsMode='off';if(s.dynamicsMode!=='off'||s.researchMode!=='off'){s.projective=false;s.fiberMode='off';s.autoRotate=false;s.packets=false;}if(s.fiberMode!=='off')s.projective=true;if(s.projective&&s.geometry==='plane')s.geometry='torus';s.playing=false;return normalizeQuotient(s);}
const viewConfig={defaults,presets,validate,defaultProbe};
const incomingView=decodeViewURL(location.href,viewConfig);
try{
 if(incomingView.valid){state=incomingView.session.state;pendingCamera=incomingView.session.camera||null;sharedCamera=pendingCamera;probe=incomingView.session.probe||{...defaultProbe};pinned=true;}
 else if(!incomingView.matched){const saved=localStorage.getItem('zeta-observatory-last');if(saved)state=validate(JSON.parse(saved));}
 saveViews=JSON.parse(localStorage.getItem('zeta-observatory-views')||'[]');if(!Array.isArray(saveViews))saveViews=[];
}catch{saveViews=[];}
focusModuleAfterLoad=state.fiberMode!=='off';if(incomingView.valid&&!pendingCamera)pendingResetView=incomingView.name==='phase'?'top':'perspective';

const sceneCallbacks={onCameraChange:()=>{clearTimeout(cameraURLTimer);cameraURLTimer=setTimeout(()=>{cameraURLTimer=null;sharedCamera=scene.getCameraState?.();storeState({immediate:true});},220);},onProbe:p=>{if(busy||state.playing||preparing||probeEditing||(pinned&&!p.pinned))return;const raw=surfacePoint(p.u,p.v,renderedState);if(!within(raw.sigma,raw.t,renderedState))return;probe={sigma:raw.sigma,t:raw.t};pinned=p.pinned;updateProbe(pinned);},onStatus:s=>{if(s.type==='render'){reference=s.reference;logReference=Number.isFinite(s.logReference)?s.logReference:Math.log(reference);$('referenceStats').textContent=(s.renderMode==='software'?'software 3D'+(s.meshStride>1?' / '+s.meshStride+'× mesh step':'')+' · ':'')+(state.heightLocked?'reference = ':'area q₉₅ = ')+fmtLog(logReference,3);}else if(s.type==='error'&&!/WebGL/.test(s.message))toast(s.message);}};
let scene=new ZetaScene($('viewport'),sceneCallbacks);
if(!scene.renderer){$('viewport').replaceChildren();scene=new CanvasZetaScene($('viewport'),sceneCallbacks);}
function within(s,t,settings=state){return withinDomain(s,t,domainFor(settings));}
function fmt(n,d=6){if(Number.isNaN(n))return 'undefined';if(!Number.isFinite(n))return n>0?'∞':n<0?'−∞':'undefined';if(n===0)return '0';const a=Math.abs(n);return (a<.0001||a>=10000?n.toExponential(d):n.toPrecision(d)).replace('e-','e−');}
function fmtLog(logAbs,d=6){if(logAbs===-Infinity)return '0';if(!Number.isFinite(logAbs))return 'undefined';if(logAbs>-690&&logAbs<690)return fmt(Math.exp(logAbs),d);const e=Math.floor(logAbs/Math.LN10),m=Math.exp(logAbs-e*Math.LN10);return m.toPrecision(d)+'e'+(e<0?'−'+(-e):'+'+e);}
function fmtComponent(p,imag=false,d=6){const factor=imag?Math.sin(p.arg):Math.cos(p.arg);if(!p.valid)return 'undefined';if(p.rawRepresentable)return fmt(imag?p.im:p.re,d);if(Math.abs(factor)<1e-14)return '≈ 0 (phase precision)';return (factor<0?'−':'')+fmtLog(p.logAbs+Math.log(Math.abs(factor)),d);}
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3600);}
function shareViewName(){
 if(state.researchMode!=='off')return RESEARCH_VIEW_NAMES[state.researchMode]||'bridgeShear';
 if(state.dynamicsMode!=='off')return dynamicsViewNames[state.dynamicsMode]||'dynamics';
 if(state.fiberMode!=='off')return state.fiberMode;
 if(isQuotientGeometry(state.geometry))return state.geometry;
 if(state.projective)return state.geometry==='sphere'?'projectiveSphere':'projective';
 const exact=Object.entries(presets).find(([,p])=>Object.keys(defaults).filter(k=>!['playing','autoRotate','packetPaused','heightReference','heightLocked','heightLogReference'].includes(k)).every(k=>p.settings[k]===state[k]));
 return exact?exact[0]:state.geometry==='sphere'?'sphere':state.geometry==='torus'?'torus':state.function==='heat'?'heat':state.colorMode==='bridge'?'bridge':'critical';
}
function storeState({mode='replace',name=shareViewName(),immediate=mode==='push'}={}){
 try{localStorage.setItem('zeta-observatory-last',JSON.stringify({...state,playing:false}));}catch{}
 viewURL?.sync({mode,name,immediate});
}
function settleCamera(){if(cameraURLTimer){clearTimeout(cameraURLTimer);cameraURLTimer=null;sharedCamera=scene.getCameraState?.();}}
function resetViewCamera(view='perspective'){settleCamera();scene.resetCamera(view);sharedCamera=scene.getCameraState?.();storeState({immediate:true});}
async function restoreURLView(session,decoded){
 dynamicsPanel?.pause();researchPanel?.pause();
 clearTimeout(cameraURLTimer);stopHeat(false);cancelField();cancelWarm();activeClip=null;prepareMessage='';probeEditing=false;
 state=validate(session.state);probe=session.probe||{...defaultProbe};pinned=true;pendingCamera=sanitizeViewCamera(session.camera);sharedCamera=pendingCamera;
 pendingResetView=pendingCamera?null:decoded?.name==='phase'?'top':'perspective';focusModuleAfterLoad=state.fiberMode!=='off';syncUI();await compute();
}

function syncUI(){
 const dynamicsActive=state.dynamicsMode!=='off',researchActive=state.researchMode!=='off';document.body.dataset.dynamics=String(dynamicsActive);document.body.dataset.research=String(researchActive);
 const quotientActive=isQuotientGeometry(state.geometry)&&!dynamicsActive&&!researchActive,kleinActive=quotientActive&&state.geometry==='klein';
 $('researchWorkbench').hidden=!researchActive;$('researchControls').hidden=!researchActive;$('researchInspector').hidden=!researchActive;
 $('researchBtn').classList.toggle('active',researchActive);$('researchBtn').setAttribute('aria-pressed',String(researchActive));
 researchPanel?.update(state);
 $('dynamicsWorkbench').hidden=!dynamicsActive;$('dynamicsControls').hidden=!dynamicsActive;$('dynamicsInspector').hidden=!dynamicsActive;
 $('dynamicsBtn').classList.toggle('active',dynamicsActive);$('dynamicsBtn').setAttribute('aria-pressed',String(dynamicsActive));$('csvBtn').hidden=dynamicsActive||researchActive;
 $('controls').querySelector('.panel-heading h1').textContent=researchActive?'Explore the bridge.':dynamicsActive?'Shape the motion.':'Explore the field.';
 $('inspector').querySelector('.panel-heading h2').textContent=researchActive?'Read the experiment.':dynamicsActive?'Watch the mechanics.':'Follow a point.';
 dynamicsPanel?.update(state);
 const presetMatch=Object.entries(presets).find(([,p])=>Object.keys(defaults).filter(k=>!['playing','autoRotate','packetPaused','heightReference','heightLocked','heightLogReference'].includes(k)).every(k=>p.settings[k]===state[k]));
 $('preset').value=presetMatch?presetMatch[0]:'custom';$('presetNote').textContent=presetMatch?presetMatch[1].note:'Your current chart, function and layers. Save this view to keep the experiment.';
 document.body.dataset.geometry=state.geometry;document.body.dataset.projective=String(state.projective);
 $('projectiveSection').hidden=!state.projective;$('projectiveWorkbench').hidden=!state.projective;
 $('quotientWorkbench').hidden=!quotientActive;$('quotientPanelBtn').hidden=!quotientActive;$('quotientControlNote').hidden=!quotientActive;
 $('quotientControlNote').textContent=kleinActive?'Phase reverses across the seam. The 3D immersion crosses itself; those crossings do not join the surface. Relief is fixed to zero.':'The two boundary circles are separate critical ovals. Re F is even across each boundary; Im F is odd.';
 $('projectiveScopeNote').textContent=quotientActive?'The linked point panels below show the orientable elliptic double. The quotient panel shows which points are identified.':'Infinity p and anti-bridge q are distinct. Branch cuts exchange the two sheets. The panels below follow the inspected point.';
 $('fiberSection').hidden=!state.projective||quotientActive;$('fiberWorkbench').hidden=!state.projective||state.fiberMode==='off';
 $('spinorControls').hidden=state.fiberMode!=='spinor';$('twistorControls').hidden=state.fiberMode!=='twistor';$('fiberPanelBtn').hidden=state.fiberMode==='off';
 for(const mode of ['spinor','twistor']){const active=state.projective&&state.fiberMode===mode;$(mode+'Btn').classList.toggle('active',active);$(mode+'Btn').setAttribute('aria-pressed',String(active));}
 $('projectiveBtn').classList.toggle('active',state.projective&&state.fiberMode==='off'&&!quotientActive);$('projectiveBtn').setAttribute('aria-pressed',String(state.projective&&state.fiberMode==='off'&&!quotientActive));
 $('projectiveMount').value=state.geometry;$('derivativeScaleRow').hidden=state.projectiveChannel!=='derivative';
 $$('[data-setting]').forEach(el=>{const v=state[el.dataset.setting];if(el.type==='checkbox')el.checked=!!v;else el.value=v;});
 $$('[data-output]').forEach(el=>{const k=el.dataset.output;el.textContent=['spinorPhase','spinorRotation','twistorFiberTheta','twistorFiberPhi'].includes(k)?(state[k]/Math.PI).toFixed(2)+'π':k==='phaseOffset'?Math.round(state[k]*180/Math.PI)+'°':k==='heatFPS'?Math.round(state[k])+' fps':k==='chartScale'?state[k]:k==='bridgeA'?fmt(state[k],4):state[k].toFixed(2);});
 $$('button[data-geometry]').forEach(el=>{const active=!researchActive&&!dynamicsActive&&(!state.projective||quotientActive)&&el.dataset.geometry===state.geometry;el.classList.toggle('active',active);el.setAttribute('aria-pressed',active);});
 $$('button[data-function]').forEach(el=>{const active=el.dataset.function===state.function;el.classList.toggle('active',active);el.setAttribute('aria-pressed',active);el.disabled=quotientActive&&el.dataset.function==='zeta';el.title=el.disabled?'These quotients require the reflection symmetry of completed ξ or its heat deformation.':'';});
 $$('[data-setting="heightMode"],[data-setting="height"]').forEach(el=>el.disabled=kleinActive);$('lockHeight').disabled=kleinActive;$('unitHeight').disabled=kleinActive;
 $('lockHeight').checked=state.heightLocked;
 $('rotateBtn').classList.toggle('active',state.autoRotate);$('rotateBtn').style.color=state.autoRotate?'#d1f1a8':'';
 $('tau').value=state.tau;$('tauValue').textContent=(state.tau>=0?'+':'')+state.tau.toFixed(3);$('heatBadge').textContent='τ = '+state.tau.toFixed(3);
 $('playHeat').innerHTML=preparing?'■':state.playing?'Ⅱ':'<svg><use href="#i-play"/></svg>';$('playHeat').setAttribute('aria-label',preparing?'Cancel frame preparation':state.playing?'Pause buffered heat playback':'Play buffered heat sequence');
 $('functionNote').textContent=state.function==='zeta'?'ζ(s) · Euler–Maclaurin continuation':state.function==='xi'?'ξ(s) · completed, entire, symmetric':'Fτ(s) = 8Hτ(−2i(s−½)) · true theta flow';
 $('sceneKicker').textContent=quotientActive?(kleinActive?'07 / KLEIN QUOTIENT':'08 / REFLECTION ANNULUS'):state.fiberMode==='spinor'?'05 / SPINOR LIFT':state.fiberMode==='twistor'?'06 / EUCLIDEAN TWISTOR FIBER':state.projective?'04 / PROJECTIVE ATLAS':state.geometry==='plane'?'01 / COMPLEX LANDSCAPE':state.geometry==='sphere'?'02 / RIEMANN SPHERE':'03 / ELLIPTIC DOUBLE COVER';
 $('sceneTitle').textContent=quotientActive?(kleinActive?'Two lifts. One twisted surface.':'The critical line becomes a boundary.'):state.fiberMode==='spinor'?'Lift the point to a spinor.':state.fiberMode==='twistor'?'Explore the twistor fiber.':state.projective?(state.geometry==='torus'?'The projective double cover.':'Infinity in a finite chart.'):state.geometry==='torus'?'One function. Two sheets.':state.geometry==='sphere'?'The compactified s-plane.':state.function==='heat'?'The theta heat family':state.function==='xi'?'The completed xi function':'The Riemann zeta function';
 const F=state.function==='zeta'?'ζ':state.function==='xi'?'ξ':'Fτ',Q=state.heightLocked?'reference':'q₉₅';
 $('sceneSubtitle').textContent='s = σ + it · '+(state.heightMode==='flat'?'phase on the base surface':state.heightMode==='log'?'height ∝ log(1 + |'+F+'| / '+Q+')':state.heightMode==='abs'?'height ∝ |'+F+'| / '+Q:state.heightMode==='real'?'height ∝ asinh(Re '+F+' / '+Q+')':'height ∝ asinh(Im '+F+' / '+Q+')');
 $('chartNote').textContent=state.projective?'s₀ = ½ + (s−½)/L; w = (s₀−1)/s₀. L = 1 is the exact chart from the projective construction. Larger L separates high zeros visually.':state.geometry==='torus'?'s = ½ + L(1/(1−w) − ½). L = 1 restores the studied cover. Two critical ovals; each zero has two lifts.':'s = ½ + (L/3)(X + iZ)/(1−Y). Sphere scale = '+fmt(state.chartScale/3,3)+'.';
 const domain=domainFor(state);$('extentNote').textContent='Computed domain: '+domainLabel(domain)+'. '+(state.function==='heat'?'High-tail heat is slower; Responsive density uses fewer samples. ':'')+(state.geometry==='plane'?'Zoom the coordinate window to resolve small features.':'Samples cluster near infinity. Dashed guides continue the base geometry; gray regions are unevaluated.');
 $('detailNote').hidden=state.geometry==='plane';
 for(const id of ['probeSigma','probeT']){const el=$(id);el.min=id==='probeSigma'?domain.sigmaMin:-domain.tMax;el.max=id==='probeSigma'?domain.sigmaMax:domain.tMax;}
 $('geometryBadge').hidden=state.geometry==='plane';$('geometryBadge').textContent=state.projective?(state.geometry==='torus'?'Eᵣ ⊂ ℂℙ³ · [1 : w : w² : η]\np±: s = ∞ · q±: s = ½ · lens L = '+state.chartScale:'ℂℙ¹ · [s₀−1 : s₀]\nw = 1: s = ∞ · w = −1: s = ½ · L = '+state.chartScale):state.geometry==='torus'?'η² = (w² + r²)(w² + r⁻²)\nr = '+state.torusR.toFixed(2)+' · lens L = '+state.chartScale+' · two lifts per zero':'INVERSE STEREOGRAPHIC CHART\nscale = L/3 = '+fmt(state.chartScale/3,3)+' · north pole: infinity';
 $('packetPanel').hidden=!state.packets;$('pausePackets').textContent=state.packetPaused?'Resume':'Pause';
 $('zeroNote').textContent=state.function==='heat'&&state.tau!==0?'Menu: undeformed ζ reference locations. Surface: sampled Hτ sign-change roots, 0 < |t| ≤ 60; not a complete zero search.':'First 25 positive reference ζ zeros. Their values are evaluated independently; this is not a complete zero census.';
 const legend=$('phaseLegend'),bar=legend.querySelector('.spectrum'),ticks=[...legend.querySelectorAll('.phase-ticks span')];
 if(state.colorMode==='phase'){legend.querySelector(':scope > span').textContent='ARG F';bar.style.background='linear-gradient(to right,'+Array.from({length:7},(_,i)=>'hsl('+((i/6+state.phaseOffset/TAU)*360)+' 88% 58%)').join(',')+')';['−π','−π/2','0','π/2','π'].forEach((x,i)=>ticks[i].textContent=x);}
 else if(state.colorMode==='modulus'){legend.querySelector(':scope > span').textContent='|F| / q₉₅ · COMPRESSED';bar.style.background='linear-gradient(to right,#311946,#4351ab,#4fc1a3,#eed67a)';['0','','1','','large'].forEach((x,i)=>ticks[i].textContent=x);}
 else{legend.querySelector(':scope > span').textContent=state.colorMode==='shear'?'LOG SHEAR · tanh Re(F′/F)':state.colorMode==='bridge'?'SIGNED BRIDGE BALANCE':state.colorMode==='real'?'SIGN OF Re F':'SIGN OF Im F';bar.style.background='linear-gradient(to right,#c61b37,#b9cdbf,#1bb38a)';['negative','','0','','positive'].forEach((x,i)=>ticks[i].textContent=x);}
 $('atlasNote').textContent=state.projective&&state.geometry==='sphere'?'Projective longitude / colatitude. Infinity lies at the middle of the left/right seam (w=1); the north pole w=∞ is a regular finite spectral point.':state.geometry==='plane'?'Same complex values in (σ,t). Darker regions have smaller magnitude.':state.geometry==='torus'?'Exact (u,v) chart; u runs right, v runs down. Opposite edges are identified. Click a tail, then unwrap it in the plane.':'Longitude / colatitude chart; the top edge is north (infinity). Click a tail, then unwrap it in the plane.';
 if(quotientActive){
  $('functionNote').textContent+=(kleinActive?' · conjugate phase on the reversed chart':' · reflection symmetry at both boundaries');
  $('sceneSubtitle').textContent=kleinActive?'Eᵣ / A · local phase · one critical loop · essential infinity puncture':'Eᵣ / R · two critical boundaries · Re F even / Im F odd';
  $('geometryBadge').textContent=kleinActive?'A(w,η) = (1/w̄, −η̄/w̄²)\np₊ ∼ p₋ · q₊ ∼ q₋ · r = '+state.torusR.toFixed(2):'R(w,η) = (1/w̄, η̄/w̄²)\nIm F = 0 · ∂ₙ Re F = 0 · r = '+state.torusR.toFixed(2);
  $('atlasNote').textContent=kleinActive?'Fundamental chart: u →, V ↓. Glue (u,1) to (½−u,0) with conjugate phase. Left/right edges are periodic. Self-intersections of the 3D picture stay separate.':'Fundamental annulus: u →, V ↓. Left/right edges are periodic; V = 0 and V = 1 remain separate critical boundaries.';
 }
 syncCacheUI();
}
const sourceLabel={memory:'memory cache',disk:'saved cache',precomputed:'precomputed',computed:'newly computed',buffer:'frame buffer'};
const mib=bytes=>(bytes/1048576).toFixed(1)+' MiB';
function renderSettings(){const settings={...state};for(const key of ['geometry','projective','function','tau','resolution','extent','sigmaMin','sigmaMax','tMin','tMax','chartScale','torusR','bridgeA'])settings[key]=renderedState[key];return settings;}
function clipMatches(){try{return !!activeClip&&activeClip.key===sequenceKey(state);}catch{return false;}}
function syncCacheUI(){
 const stats=fieldService?.stats(),ready=clipMatches();
 if(stats){$('cacheStats').textContent=stats.memoryEntries+' views in memory · '+mib(stats.memoryBytes);$('cacheStorage').textContent=stats.storageAvailable?stats.storageEntries+' saved fields · '+mib(stats.storageBytes)+' / '+mib(stats.storageBudgetBytes):'Memory cache · browser storage unavailable';$('cacheStats').dataset.workerJobs=stats.workerJobs;$('cacheStats').title='Numerical worker jobs this visit: '+stats.workerJobs+' · precomputed loads: '+stats.precomputedLoads+' · cache hits: '+stats.cacheHits;}
 $('cacheSource').textContent=warmMessage||(lastSource?'Current field: '+sourceLabel[lastSource]:'Exact computed values, reused across views.');
 $('precacheModes').textContent=warmController&&warmMessage?'Cancel precache':'Precache modes';
 $('prepareFrames').textContent=preparing?'Cancel preparation':ready?'Show prepared frames':'Prepare heat frames';
 const message=preparing?prepareMessage:state.playing?'Playing '+(frameDirection>0?'forward':'reverse')+' · frame '+(frameIndex+1)+' / '+activeClip.frames.length:ready?activeClip.frames.length+' frames ready · '+activeClip.resolution+' · '+mib(activeClip.bytes):prepareMessage||warmMessage||'Prepare once; Play uses only buffered frames.';
 $('bufferStatus').textContent=message;$('playbackStatus').textContent=preparing?prepareMessage:state.playing?'Buffered · '+(frameDirection>0?'forward':'reverse')+' '+(frameIndex+1)+'/'+activeClip.frames.length:ready?'Ready · '+activeClip.frames.length+' frames · '+activeClip.resolution:'Play prepares all frames first';
 $('frameScrub').disabled=!ready||preparing;$('frameScrub').max=ready?activeClip.frames.length-1:16;$('frameScrub').value=frameIndex;$('frameReadout').textContent=ready?(frameIndex+1)+' / '+activeClip.frames.length:'—';
 $('frameProgress').hidden=!preparing;
}
function cancelField(){clearTimeout(computeTimer);fieldController?.abort();fieldController=null;requestSerial++;busy=false;}
function cancelWarm(){clearTimeout(warmTimer);warmController?.abort();warmController=null;warmMessage='';}
function restoreDisplayedField(){if(!data||fieldKey(state)===fieldKey(renderedState))return;for(const key of ['geometry','projective','function','tau','resolution','extent','sigmaMin','sigmaMax','tMin','tMax','chartScale','torusR','bridgeA','colorMode','vortices','ladder','packets'])state[key]=renderedState[key];if(!state.projective)state.fiberMode='off';scene.updateStyle(renderSettings());syncUI();storeState();}
function cancelPreparation(){stopHeat(false);restoreDisplayedField();updateProbe(pinned);}
function holdProbe(message=state.playing?'Buffered playback · pause to inspect':'Buffered frame · press Inspect for point values'){$('probeMode').textContent=message;$('probeFunction').textContent=state.function==='zeta'?'ζ(s)':state.function==='xi'?'ξ(s)':'Fτ(s)';for(const id of ['probeAbs','probeReal','probeImag','probePhase','probeDerivative','probeShear','probeBalance'])$(id).textContent='—';$('windingResult').querySelector('strong').textContent='—';windingKey=null;projectivePanel.hold(state,probe,message);fiberPanels.hold(state,probe,message);quotientPanel.hold(state,probe,message);}
function applyField(result,requested,{inspect=true,source=result.source}={}){
 data=result.data;renderedState={...requested};lastSource=source;scene.setData(data,{...state,resolution:requested.resolution});
 if(pendingCamera){scene.setCameraState?.(pendingCamera);pendingCamera=null;}else if(pendingResetView){scene.resetCamera(pendingResetView);}pendingResetView=null;
 $('computeStatus').classList.add('done');$('computeText').textContent='Field ready';$('meshStats').textContent=data.validCount.toLocaleString()+' samples · '+sourceLabel[source]+' · '+requested.resolution;
 $('meshStats').dataset.source=source;$('meshStats').dataset.tau=requested.tau;$('meshStats').dataset.fieldFunction=requested.function;$('meshStats').dataset.fieldGeometry=requested.geometry;
 drawAtlas();drawSlice();if(inspect)updateProbe(pinned);else holdProbe();syncCacheUI();
 if(focusModuleAfterLoad){focusModuleAfterLoad=false;focusFiber();}
}
function scheduleCompute(delay=90){cancelField();cancelWarm();busy=true;$('computeStatus').classList.remove('done');$('computeText').textContent='Checking computed cache';computeTimer=setTimeout(compute,delay);}
async function compute(){
 if(state.researchMode!=='off'){cancelField();cancelWarm();busy=false;pendingCamera=null;pendingResetView=null;scene.updateStyle({autoRotate:false,packets:false,playing:false});researchPanel?.update(state);return;}
 if(state.dynamicsMode!=='off'){cancelField();cancelWarm();busy=false;pendingCamera=null;pendingResetView=null;scene.updateStyle({autoRotate:false,packets:false,playing:false});dynamicsPanel?.update(state);return;}
 cancelField();cancelWarm();const controller=new AbortController();fieldController=controller;const id=requestSerial,requested={...state,playing:false};busy=true;holdProbe('Loading the selected field');$('computeStatus').classList.remove('done');$('computeText').textContent='Checking computed cache';
 try{const result=await fieldService.get(requested,{signal:controller.signal,onProgress:message=>{if(id===requestSerial)$('computeText').textContent=message;}});if(id!==requestSerial||controller.signal.aborted)return;busy=false;fieldController=null;applyField(result,requested);storeState();warmTimer=setTimeout(()=>warmModes(false),500);}
 catch(error){if(error.name==='AbortError'||id!==requestSerial)return;busy=false;fieldController=null;pendingCamera=null;pendingResetView=null;sharedCamera=scene.getCameraState?.();restoreDisplayedField();$('computeText').textContent='Field could not be loaded · previous field retained';$('computeStatus').classList.add('done');toast(error.message);syncCacheUI();}
}
async function warmModes(explicit=false){
 if(state.researchMode!=='off'||state.dynamicsMode!=='off'||busy||preparing||state.playing||(!explicit&&warmController&&warmMessage))return;cancelWarm();const controller=new AbortController();warmController=controller;const settings={...state,playing:false};let done=0;
 try{for(const geometry of ['plane','sphere','torus'])for(const kind of ['zeta','xi','heat']){if(controller.signal.aborted)return;if(explicit){warmMessage='Caching mode '+(done+1)+' / 9';syncCacheUI();}await fieldService.get({...settings,geometry,projective:geometry==='plane'?false:settings.projective,function:kind},{signal:controller.signal,allowCompute:explicit});done++;}}
 catch(error){if(error.name!=='AbortError'&&explicit)toast(error.message);}
 finally{if(warmController===controller){warmController=null;warmMessage='';syncCacheUI();if(explicit&&done===9&&!controller.signal.aborted)toast('Prepared nine chart/function modes within the cache budget.');}}
}
function change(key,value,{historyMode='replace'}={}){
 settleCamera();if(data&&!pendingCamera)sharedCamera=scene.getCameraState?.();
 const oldValue=state[key];if(typeof value==='number'&&limits[key])value=Math.max(limits[key][0],Math.min(limits[key][1],value));
 const oldKey=fieldKey(state),clipSetting=['heatStart','heatEnd','heatFrames','playbackResolution'].includes(key);
 const candidate=normalizeQuotient({...state,[key]:value});
 if(['sigmaMin','sigmaMax','tMin','tMax'].includes(key)){const a=key.startsWith('sigma')?'sigmaMin':'tMin',b=key.startsWith('sigma')?'sigmaMax':'tMax';if(candidate[a]>=candidate[b]){syncUI();toast('The minimum must be below the maximum.');return;}}
 if(['heatStart','heatEnd'].includes(key)&&candidate.heatStart>=candidate.heatEnd){syncUI();toast('Heat start must be below heat end.');return;}
 const numerical=oldKey!==fieldKey(candidate);if(numerical||clipSetting){stopHeat(false);cancelWarm();prepareMessage='';}
 state=candidate;if(key==='function'&&oldValue!==state.function){state.heightReference=0;state.heightLocked=false;}if(!clipMatches())activeClip=null;
 syncUI();storeState({mode:historyMode});
 if(numerical)scheduleCompute();else if(!clipSetting&&key!=='heatFPS'){scene.updateStyle(renderSettings());if(['phaseOffset','colorMode','heightReference','heightLocked','heightLogReference'].includes(key))drawAtlas();if(key==='heightReference')drawSlice();}
 if(key==='geometry')closeDrawers();if(numerical)holdProbe('Loading the selected field');
 if(['projectiveChannel','derivativeScale','bridgeA'].includes(key))updateProjective();
 if(['fiberMode','spinorPhase','spinorRotation','spinorAxis','twistorSheet','twistorFiberTheta','twistorFiberPhi','twistorProjection'].includes(key))updateFiber();
 if(key==='fiberMode'&&value!=='off')focusFiber();
}
$$('[data-setting]').forEach(el=>{const event=el.type==='range'?'input':'change';el.addEventListener(event,()=>{const k=el.dataset.setting,v=el.type==='checkbox'?el.checked:typeof defaults[k]==='number'?Number(el.value):el.value;if(typeof v==='number'&&!Number.isFinite(v))return;if(k==='fiberMode')selectFiber(v);else change(k,v,{historyMode:el.type==='range'?'replace':'push'});});});
$$('button[data-geometry]').forEach(el=>el.onclick=()=>selectMount(el.dataset.geometry,false));
$('projectiveBtn').onclick=()=>selectMount(state.geometry==='sphere'?'sphere':'torus',isQuotientGeometry(state.geometry)||!state.projective||state.fiberMode!=='off');
$('researchBtn').onclick=()=>{applyPreset('bridgeShear');closeDrawers();$('researchWorkbench').scrollIntoView({block:'start'});};
$('dynamicsBtn').onclick=()=>{dynamicsPanel?.pause();researchPanel?.pause();applyPreset('dynamics');closeDrawers();$('dynamicsWorkbench').scrollIntoView({block:'start'});};
$('spinorBtn').onclick=()=>selectFiber('spinor');$('twistorBtn').onclick=()=>selectFiber('twistor');
$('fiberPanelBtn').onclick=focusFiber;
$('projectiveMount').onchange=()=>selectMount($('projectiveMount').value,true,{fiberMode:state.fiberMode});
$('projectivePanelBtn').onclick=()=>{$('projectiveWorkbench').scrollIntoView({block:'start',behavior:'smooth'});closeDrawers();};
$('quotientPanelBtn').onclick=()=>{$('quotientWorkbench').scrollIntoView({block:'start',behavior:'smooth'});closeDrawers();};
$('projectiveOriginal').onclick=()=>{change('chartScale',1);toast('Original chart: w = (s−1)/s. Infinity and the anti-bridge stay distinct.');};
$('projectiveAnti').onclick=()=>{stopHeat(false);probeEditing=false;probe={sigma:.5,t:0};pinned=true;updateProbe(true);};
$('projectiveFirstZero').onclick=()=>{stopHeat(false);probeEditing=false;probe={sigma:.5,t:ZERO_HEIGHTS[0]};pinned=true;updateProbe(true);};
function selectMount(geometry,projective,{fiberMode='off'}={}){
 if(isQuotientGeometry(geometry)){projective=true;fiberMode='off';}
 dynamicsPanel?.pause();researchPanel?.pause();
 settleCamera();stopHeat(false);if(geometry!==state.geometry){sharedCamera=null;pendingCamera=null;}else if(data&&!pendingCamera)sharedCamera=scene.getCameraState?.();cancelField();cancelWarm();activeClip=null;prepareMessage='';
 const entering=projective&&!state.projective;state={...state,dynamicsMode:'off',researchMode:'off',geometry,projective,fiberMode:projective?fiberMode:'off'};
 if(entering){if(!isQuotientGeometry(geometry))state.torusR=2;state.height=Math.min(state.height,.45);state.contours=false;state.ladder=true;state.seams=true;}
 normalizeQuotient(state);focusModuleAfterLoad=state.fiberMode!=='off';document.querySelector('.main-stage').scrollTop=0;syncUI();storeState({mode:'push'});compute();closeDrawers();
}
function focusFiber(){if(state.fiberMode==='off')return;$('fiberWorkbench').scrollIntoView({block:'start',behavior:'smooth'});closeDrawers();}
function selectFiber(mode){
 if(state.researchMode!=='off'||state.dynamicsMode!=='off'||isQuotientGeometry(state.geometry)){selectMount('torus',true,{fiberMode:mode});return;}
 stopHeat(false);
 if(mode==='off'||state.projective){change('fiberMode',mode,{historyMode:'push'});if(!projectivePanel.snapshot)updateProjective();return;}
 selectMount(state.geometry==='sphere'?'sphere':'torus',true,{fiberMode:mode});focusFiber();
}
function updateFiber(){
 if(!state.projective||state.fiberMode==='off')return;
 if(busy||state.playing||preparing||probeEditing||!projectivePanel.snapshot){fiberPanels.hold(state,probe,state.playing?'Buffered playback · pause to inspect':probeEditing?'Coordinates edited · press Inspect':'Loading the linked point');return;}
 fiberPanels.update(state,probe,{pair:projectivePanel.snapshot.point,curvePoint:projectivePanel.snapshot.curvePoint});
}
function updateProjective(){
 if(!state.projective)return;
 if(busy||state.playing||preparing||probeEditing){const message=state.playing?'Buffered playback · pause to inspect':probeEditing?'Coordinates edited · press Inspect':'Loading the selected field';projectivePanel.hold(state,probe,message);fiberPanels.hold(state,probe,message);quotientPanel.hold(state,probe,message);return;}
 projectivePanel.update(state,probe);quotientPanel.update(state,probe);updateFiber();
}
$$('button[data-function]').forEach(el=>el.onclick=()=>{stopHeat();change('function',el.dataset.function,{historyMode:'push'});});
$('preset').onchange=()=>applyPreset($('preset').value);
function applyPreset(key){if(!presets[key])return;dynamicsPanel?.pause();researchPanel?.pause();probeEditing=false;settleCamera();stopHeat(false);sharedCamera=null;pendingCamera=null;pendingResetView=key==='phase'?'top':'perspective';state={...presets[key].settings};focusModuleAfterLoad=state.fiberMode!=='off';$('presetNote').textContent=presets[key].note;$('ladderSection').open=state.ladder||state.packets;document.querySelector('.main-stage').scrollTop=0;document.querySelector('.control-scroll').scrollTop=0;syncUI();storeState({mode:'push',name:key});compute();}
$('lockHeight').onchange=()=>{state.heightLogReference=logReference;state.heightReference=$('lockHeight').checked&&Number.isFinite(reference)?reference:0;change('heightLocked',$('lockHeight').checked);};
$('unitHeight').onclick=()=>{state.heightLogReference=0;state.heightReference=1;change('heightLocked',true);drawAtlas();toast('Height reference set to |F| = 1. Unlock to restore the area percentile.');};
$('literalTorus').onclick=()=>{change('chartScale',1);toast('Original torus cover: s = 1/(1−w).');};
$('resetBtn').onclick=()=>resetViewCamera();$('topBtn').onclick=()=>resetViewCamera('top');
$('rotateBtn').onclick=()=>{sharedCamera=scene.getCameraState?.();change('autoRotate',!state.autoRotate);};
$('focusBtn').onclick=()=>{document.body.classList.toggle('focus-mode');setTimeout(()=>window.dispatchEvent(new Event('resize')),100);};
function stopHeat(refresh=true){
 const wasPlaying=state.playing,wasPreparing=preparing;state.playing=false;clearTimeout(heatTimer);
 if(prepareController){prepareController.abort();prepareController=null;preparing=false;prepareMessage='Preparation cancelled · completed fields remain cached';busy=false;$('computeText').textContent='Preparation cancelled · previous field retained';$('computeStatus').classList.add('done');}
 if(wasPlaying&&data)scene.updateStyle(renderSettings());syncUI();if((wasPlaying||wasPreparing)&&refresh)updateProbe(pinned);storeState({immediate:wasPlaying});
}
function displayBufferedFrame(index){
 if(!clipMatches())return;frameIndex=Math.max(0,Math.min(activeClip.frames.length-1,index));const frame=activeClip.frames[frameIndex],functionChanged=state.function!=='heat';state.function='heat';state.tau=frame.tau;
 if(functionChanged&&Number.isFinite(activeClip.heightLogReference)){state.heightLocked=true;state.heightLogReference=activeClip.heightLogReference;const ref=Math.exp(activeClip.heightLogReference);state.heightReference=Number.isFinite(ref)?ref:0;}
 $('tau').value=state.tau;$('tauValue').textContent=(state.tau>=0?'+':'')+state.tau.toFixed(3);$('heatBadge').textContent='τ = '+state.tau.toFixed(3);
 applyField(frame,{...state,resolution:activeClip.resolution},{inspect:false,source:'buffer'});
 if(functionChanged)syncUI();
 const now=performance.now();if(!state.playing||now-lastBufferedURL>=1000){lastBufferedURL=now;storeState({immediate:true});}
}
function startPlayback(){
 if(!clipMatches())return;cancelWarm();lockPlaybackReference();state.function='heat';state.playing=true;syncUI();displayBufferedFrame(frameIndex);
 const tick=()=>{if(!state.playing||!clipMatches())return;const start=performance.now();let next=frameIndex+frameDirection;if(next>=activeClip.frames.length||next<0){frameDirection*=-1;next=frameIndex+frameDirection;}displayBufferedFrame(next);heatTimer=setTimeout(tick,Math.max(16,1000/state.heatFPS-(performance.now()-start)));};
 heatTimer=setTimeout(tick,1000/state.heatFPS);storeState();
}
function lockPlaybackReference(){if(!state.heightLocked){state.heightLocked=true;state.heightLogReference=Number.isFinite(activeClip?.heightLogReference)?activeClip.heightLogReference:logReference;const ref=Math.exp(state.heightLogReference);state.heightReference=Number.isFinite(ref)?ref:0;scene.updateStyle(renderSettings());drawAtlas();}if(activeClip)activeClip.heightLogReference=state.heightLogReference;}
async function prepareHeat(autoplay=false){
 settleCamera();if(data&&!pendingCamera)sharedCamera=scene.getCameraState?.();
 if(preparing){cancelPreparation();return;}
 stopHeat(false);cancelField();cancelWarm();
 if(clipMatches()){if(state.function!=='heat'){state.heightLocked=false;state.heightReference=0;}frameIndex=nearestFrame(activeClip.taus,state.tau);displayBufferedFrame(frameIndex);lockPlaybackReference();if(autoplay)startPlayback();else syncUI();return;}
 let plan;try{plan=createSequencePlan(state);}catch(error){toast(error.message);return;}
 activeClip=null;const controller=new AbortController();prepareController=controller;preparing=true;busy=true;prepareMessage='Preparing 0 / '+plan.frameCount+' frames';$('frameProgress').value=0;$('frameProgress').max=plan.frameCount;syncUI();holdProbe('Preparing buffered heat frames');$('computeStatus').classList.remove('done');$('computeText').textContent=prepareMessage;
 try{
  const ready=await prepareSequence(plan,(settings,{signal,index,total})=>fieldService.get(settings,{signal,onProgress:message=>{if(prepareController===controller){prepareMessage='Frame '+(index+1)+' / '+total+' · '+message;$('computeText').textContent=prepareMessage;syncCacheUI();}}}),{signal:controller.signal,onProgress:progress=>{if(prepareController!==controller)return;prepareMessage='Prepared '+progress.completed+' / '+progress.total+' frames';$('frameProgress').value=progress.completed;syncCacheUI();}});
  if(controller.signal.aborted||prepareController!==controller)return;
  activeClip=ready;prepareController=null;preparing=false;busy=false;prepareMessage='';if(state.function!=='heat'){state.heightLocked=false;state.heightReference=0;}frameIndex=nearestFrame(ready.taus,state.tau);frameDirection=1;displayBufferedFrame(frameIndex);lockPlaybackReference();
  syncUI();storeState();if(autoplay)startPlayback();else toast(ready.frames.length+' heat frames are ready. Play and frame scrubbing use the buffer.');
 }catch(error){if(prepareController!==controller)return;prepareController=null;preparing=false;busy=false;restoreDisplayedField();$('computeStatus').classList.add('done');$('computeText').textContent='Preparation stopped · previous field retained';if(error.name!=='AbortError'){prepareMessage=error.message;toast(error.message);}syncUI();}
}
$('playHeat').onclick=()=>{if(preparing){cancelPreparation();return;}if(state.playing){stopHeat();return;}prepareHeat(true);};
$('prepareFrames').onclick=()=>prepareHeat(false);
$('frameScrub').oninput=()=>{const index=Number($('frameScrub').value);stopHeat(false);cancelField();cancelWarm();displayBufferedFrame(index);storeState();};
$('playbackSettings').onclick=()=>{$('cacheSection').open=true;if(window.innerWidth<=760)openDrawer('controls');$('cacheSection').scrollIntoView({block:'nearest',behavior:'smooth'});};
$('precacheModes').onclick=()=>{if(warmController&&warmMessage){cancelWarm();syncCacheUI();return;}if(busy&&!preparing){toast('Wait for the selected field to finish loading.');return;}if(preparing)cancelPreparation();else stopHeat(false);warmModes(true);};
$('clearCache').onclick=async()=>{stopHeat(false);cancelField();cancelWarm();activeClip=null;busy=false;restoreDisplayedField();const success=await fieldService.clear();lastSource='';prepareMessage='';$('computeStatus').classList.add('done');syncCacheUI();toast(success?'Computed cache cleared. Saved views are kept.':'Memory cache cleared; browser storage is unavailable.');};
function selectHeatTime(value){settleCamera();if(data&&!pendingCamera)sharedCamera=scene.getCameraState?.();stopHeat(false);if(state.function!=='heat'){state.heightLocked=false;state.heightReference=0;}state.function='heat';state.tau=value;syncUI();storeState();holdProbe('Loading the selected heat field');scheduleCompute();}
$('tau').oninput=()=>selectHeatTime(Number($('tau').value));
$('zeroTau').onclick=()=>selectHeatTime(0);
$('pausePackets').onclick=()=>change('packetPaused',!state.packetPaused);

function bridgeValue(s,t){const kind=state.function==='heat'?'heat':'xi';if(!within(s-state.bridgeA,t)||!within(s+state.bridgeA,t))return NaN;const a=evaluatePolar(s+state.bridgeA,t,kind,state.tau),b=evaluatePolar(s-state.bridgeA,t,kind,state.tau);return a.valid&&b.valid&&!(a.logAbs===-Infinity&&b.logAbs===-Infinity)?Math.tanh(a.logAbs-b.logAbs):NaN;}
function invalidateWinding(){
 const key=[state.function,state.tau,probe.sigma,probe.t,$('windingRadius').value].join(',');
 if(key!==windingKey){$('windingResult').querySelector('strong').textContent='—';$('windingNote').textContent='Measure the current function around this probe. Finite samples estimate zeros minus poles.';}
 return key;
}
$('windingRadius').onchange=invalidateWinding;
function updateProbe(mark=false){
 if(state.researchMode!=='off'||state.dynamicsMode!=='off')return;
 if(busy||state.playing||preparing){holdProbe(busy&&!state.playing?'Loading the selected field':'Buffered playback · pause to inspect');return;}
 invalidateWinding();
 const {sigma:s,t}=probe;if(!within(s,t)){$('probeMode').textContent='Outside the selected computed domain';for(const id of ['probeAbs','probeReal','probeImag','probePhase','probeDerivative','probeShear','probeBalance'])$(id).textContent='—';projectivePanel.hold(state,probe,'Outside the selected computed domain');fiberPanels.hold(state,probe,'Outside the selected computed domain');return;}
 const f=evaluatePolar(s,t,state.function,state.tau,true),pole=state.function==='zeta'&&s===1&&t===0;
 if(!probeEditing&&document.activeElement!==$('probeSigma'))$('probeSigma').value=Number(s.toPrecision(12));if(!probeEditing&&document.activeElement!==$('probeT'))$('probeT').value=Number(t.toPrecision(14));
 $('probeMode').textContent=probeEditing?'Coordinates edited · press Inspect':!f.valid&&!pole?'Numerical evaluation unavailable':f.valid&&!f.rawRepresentable?'Log-polar evaluation · magnitude outside raw float64':pinned?'Pinned · click another point to move':'Live · recomputed at chart coordinates';$('probeFunction').textContent=state.function==='zeta'?'ζ(s)':state.function==='xi'?'ξ(s)':'Fτ(s)';
 $('probeAbs').textContent=pole?'∞':fmtLog(f.logAbs,7);$('probeReal').textContent=pole?'pole':fmtComponent(f,false,7);$('probeImag').textContent=pole?'undefined':fmtComponent(f,true,7);const stable=f.valid&&Number.isFinite(f.arg)&&Number.isFinite(f.logAbs)&&f.logAbs-(f.derivativeLogAbs??Infinity)>Math.log(1e-11);$('probePhase').textContent=stable?(f.arg/Math.PI).toFixed(5)+'π':'ill-conditioned / singular';$('probeDerivative').textContent=pole?'∞':fmtLog(f.derivativeLogAbs);$('probeShear').textContent=stable&&f.q?fmt(f.q.re):'ill-conditioned';$('probeBalance').textContent=fmt(bridgeValue(s,t),5);
 if(mark)scene.setProbe(s,t);drawSlice();updateProjective();if(mark)storeState();
}
$('inspectBtn').onclick=()=>{const s=Number($('probeSigma').value),t=Number($('probeT').value);if(!within(s,t)){toast('Use '+domainLabel(domainFor(state))+'.');return;}stopHeat(false);probeEditing=false;probe={sigma:s,t};pinned=true;updateProbe(true);};
$('unwrapBtn').onclick=()=>{if(probeEditing){toast('Press Inspect coordinates first.');return;}const d=domainFor(state);if(!within(probe.sigma,probe.t))return;stopHeat();state={...state,geometry:'plane',projective:false,fiberMode:'off',sigmaMin:Math.max(d.sigmaMin,probe.sigma-.65),sigmaMax:Math.min(d.sigmaMax,probe.sigma+.65),tMin:Math.max(-d.tMax,probe.t-2.5),tMax:Math.min(d.tMax,probe.t+2.5),resolution:'high',height:.8,heightReference:0,heightLocked:false,contours:true};syncUI();storeState({mode:'push'});compute();closeDrawers();toast('Unwrapped this point into a detailed spectral window.');};
[$('probeSigma'),$('probeT')].forEach(el=>el.addEventListener('input',()=>{probeEditing=true;$('probeMode').textContent='Coordinates edited · press Inspect';}));
[$('probeSigma'),$('probeT')].forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter')$('inspectBtn').click();}));
ZERO_HEIGHTS.forEach((t,i)=>{const o=document.createElement('option');o.value=i;o.textContent='ρ'+(i+1)+' · '+t.toFixed(9);$('zeroSelect').appendChild(o);});
$('zeroSelect').onchange=()=>{stopHeat(false);probeEditing=false;probe={sigma:.5,t:ZERO_HEIGHTS[Number($('zeroSelect').value)]};pinned=true;updateProbe(true);};
$('focusZero').onclick=()=>{const t=ZERO_HEIGHTS[Number($('zeroSelect').value)];stopHeat();state={...state,geometry:'plane',projective:false,fiberMode:'off',function:'zeta',tau:0,sigmaMin:-.1,sigmaMax:1.1,tMin:t-1.3,tMax:t+1.3,height:.75,heightReference:0,heightLocked:false,vortices:true};probe={sigma:.5,t};pinned=true;syncUI();storeState({mode:'push'});compute();closeDrawers();};
$('windingBtn').onclick=()=>{
 stopHeat(false);
 if(probeEditing){toast('Press Inspect coordinates before measuring this contour.');return;}
 const radius=Number($('windingRadius').value);if(!(radius>=.001&&radius<=3)){toast('Choose a contour radius between 0.001 and 3.');return;}
 if(!within(probe.sigma-radius,probe.t-radius)||!within(probe.sigma+radius,probe.t+radius)){toast('The entire contour must stay inside the tested engine window.');return;}
 const measure=n=>{let sum=0,prev=null,maxStep=0,minLog=Infinity,maxLog=-Infinity;for(let k=0;k<=n;k++){const a=TAU*k/n,f=evaluatePolar(probe.sigma+radius*Math.cos(a),probe.t+radius*Math.sin(a),state.function,state.tau),p=f.arg;if(!f.valid||!Number.isFinite(f.logAbs))return null;minLog=Math.min(minLog,f.logAbs);maxLog=Math.max(maxLog,f.logAbs);if(prev!==null){const d=Math.atan2(Math.sin(p-prev),Math.cos(p-prev));sum+=d;maxStep=Math.max(maxStep,Math.abs(d));}prev=p;}return {w:sum/TAU,maxStep,minLog,maxLog};};
 const a=measure(128),b=measure(256);windingKey=[state.function,state.tau,probe.sigma,probe.t,$('windingRadius').value].join(',');if(!a||!b){$('windingResult').querySelector('strong').textContent='!';$('windingNote').textContent='Contour crosses a singular or unsupported value. Move or resize it.';return;}
 const ok=Math.abs(a.w-b.w)<1e-5&&b.maxStep<Math.PI*.65&&b.minLog-b.maxLog>Math.log(1e-12);
 $('windingResult').querySelector('strong').textContent=ok?Math.round(b.w).toString():'?';$('windingNote').textContent=(ok?'128/256 samples agree: ':'Insufficient resolution or contour too close to a zero: ')+b.w.toFixed(6)+' turns; minimum |F| = '+fmtLog(b.minLog,3)+'. Numerical estimate, not a certified contour count.';
};

function canvas2d(canvas){const r=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2),w=Math.max(1,Math.round(r.width)),h=Math.max(1,Math.round(r.height));if(canvas.width!==w*dpr||canvas.height!==h*dpr){canvas.width=w*dpr;canvas.height=h*dpr;}const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);return {ctx,w,h};}
let packetReferenceCache=null;
function drawSlice(){
 const canvas=$('sliceCanvas'),{ctx,w,h}=canvas2d(canvas);if(!data?.slice)return;
 const {lo,hi,vals,scaleLog}=data.slice,amax=Math.max(...Array.from(vals).filter(Number.isFinite).map(Math.abs),1e-100),pad=8,ym=h*.49,scale=(h*.38)/amax;
 ctx.strokeStyle='#29384a';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(0,ym);ctx.lineTo(w,ym);ctx.stroke();
 for(let i=0;i<6;i++){const x=pad+(w-2*pad)*i/5;ctx.strokeStyle='#1a293b';ctx.beginPath();ctx.moveTo(x,8);ctx.lineTo(x,h-12);ctx.stroke();ctx.fillStyle='#536c87';ctx.font='7px ui-monospace';ctx.textAlign='center';ctx.fillText((lo+(hi-lo)*i/5).toFixed(1),x,h-1);}
 const grad=ctx.createLinearGradient(0,0,w,0);grad.addColorStop(0,'#7bd8ef');grad.addColorStop(.5,'#cff09f');grad.addColorStop(1,'#e6b982');ctx.strokeStyle=grad;ctx.lineWidth=1.3;ctx.beginPath();vals.forEach((y,i)=>{const x=pad+(w-2*pad)*i/(vals.length-1),Y=ym-y*scale;i?ctx.lineTo(x,Y):ctx.moveTo(x,Y);});ctx.stroke();
 if(probe.t>=lo&&probe.t<=hi){const x=pad+(w-2*pad)*(probe.t-lo)/(hi-lo);ctx.setLineDash([2,3]);ctx.strokeStyle='#8b9cb0';ctx.beginPath();ctx.moveTo(x,5);ctx.lineTo(x,h-10);ctx.stroke();ctx.setLineDash([]);}
 if(renderedState.function!=='heat'||renderedState.tau===0)for(const z of ZERO_HEIGHTS)for(const sg of [-1,1]){const t=z*sg;if(t<lo||t>hi)continue;ctx.fillStyle='#e5edda';ctx.beginPath();ctx.arc(pad+(w-2*pad)*(t-lo)/(hi-lo),ym,2,0,TAU);ctx.fill();}
 $('sliceRange').textContent='t = '+lo.toFixed(1)+' … '+hi.toFixed(1);$('sliceFormula').textContent=renderedState.function==='zeta'?'Z(t) = eⁱᶿ⁽ᵗ⁾ ζ(½ + it)':renderedState.function==='xi'?'ξ(½ + it) ∈ ℝ':'Fτ(½ + it) ∈ ℝ';$('sliceHint').textContent=renderedState.function==='zeta'?'Signed Hardy Z · reference zeros marked':'Real values / '+fmtLog(scaleLog,3)+' · common scale';
}
function phaseRGB(logAbs,arg){const h=((arg+Math.PI+state.phaseOffset)/TAU%1+1)%1;let hue=h*6,c=.88,x=c*(1-Math.abs(hue%2-1)),p=hue<1?[c,x,0]:hue<2?[x,c,0]:hue<3?[0,c,x]:hue<4?[0,x,c]:hue<5?[x,0,c]:[c,0,x];const b=.32+.68*Math.exp(Math.min(0,(logAbs-logReference)*.16));return p.map(n=>Math.round(255*(n+.08)*b));}
function drawAtlas(){if(!data)return;const canvas=$('atlasCanvas'),ctx=canvas.getContext('2d'),W=384,H=256;canvas.width=W;canvas.height=H;const img=ctx.createImageData(W,H);const nearest=(axis,x)=>{let a=0,b=axis.length-1;while(b-a>1){const m=(a+b)>>1;if(axis[m]<x)a=m;else b=m;}return x-axis[a]<axis[b]-x?a:b;};const xs=Array.from({length:W},(_,i)=>nearest(data.uAxis,(i+.5)/W)),ys=Array.from({length:H},(_,j)=>nearest(data.vAxis,renderedState.geometry==='plane'?1-(j+.5)/H:(j+.5)/H));for(let j=0;j<H;j++)for(let i=0;i<W;i++){const k=ys[j]*(data.nx+1)+xs[i],l=(j*W+i)*4,p=data.valid[k]?phaseRGB(data.logAbs[k],data.arg[k]):[11,19,30];img.data[l]=p[0];img.data[l+1]=p[1];img.data[l+2]=p[2];img.data[l+3]=255;}ctx.putImageData(img,0,0);}
$('atlasCanvas').onclick=e=>{if(!data)return;stopHeat(false);const r=e.currentTarget.getBoundingClientRect(),u=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height,v=renderedState.geometry==='plane'?1-y:y,p=surfacePoint(u,v,renderedState);if(!within(p.sigma,p.t,renderedState)){toast('This point is outside the selected computed domain.');return;}probeEditing=false;probe={sigma:p.sigma,t:p.t};pinned=true;updateProbe(true);};

function packet(ell,T,sigma,dual){let re=0,im=0;for(const p of [2,3,5,7,11,13,17,19])for(let m=1;m<=2;m++){const l=m*Math.log(p),amp=Math.log(p)*Math.exp(-sigma*l-(ell-l)**2/(2*state.packetWidth**2)),ph=(dual?1:-1)*T*l;re+=amp*Math.cos(ph);im+=amp*Math.sin(ph);}return Math.hypot(re,im);}
function drawPackets(now){const dt=Math.min(.1,(now-lastPacketTime)/1000);lastPacketTime=now;if(state.packets&&!state.packetPaused)packetTime+=dt*state.flowSpeed;if(state.packets){const {ctx,w,h}=canvas2d($('packetCanvas')),curves=[[],[]];for(let i=0;i<=220;i++){const ell=6.6*i/220;curves[0].push(packet(ell,packetTime,.5+state.bridgeA,false));curves[1].push(packet(ell,packetTime,.5-state.bridgeA,true));}const refKey=state.bridgeA+','+state.packetWidth;if(packetReferenceCache?.key!==refKey){let max=1e-10;for(let i=0;i<=220;i++){const ell=6.6*i/220;max=Math.max(max,packet(ell,0,.5+state.bridgeA,false),packet(ell,0,.5-state.bridgeA,true));}packetReferenceCache={key:refKey,max};}const max=packetReferenceCache.max;ctx.strokeStyle='#243449';ctx.beginPath();ctx.moveTo(0,h-8);ctx.lineTo(w,h-8);ctx.stroke();curves.forEach((values,j)=>{ctx.strokeStyle=j?'#f3b462':'#7bdeef';ctx.lineWidth=1.2;ctx.beginPath();values.forEach((v,i)=>{const x=i*w/220,y=h-8-v/max*(h-18);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();});ctx.font='7px ui-monospace';ctx.fillStyle='#6f8598';ctx.textAlign='center';for(const ell of [0,2,4,6])ctx.fillText(ell.toFixed(0),Math.max(4,Math.min(w-4,ell/6.6*w)),h-1);$('packetClock').textContent='T = '+packetTime.toFixed(2)+' · independent display time';}requestAnimationFrame(drawPackets);}
requestAnimationFrame(drawPackets);

function session(){dynamicsPanel?.flush();researchPanel?.flush();return {schema:'zeta-observatory/1',createdAt:new Date().toISOString(),state:{...state,playing:false},probe,camera:state.researchMode!=='off'||state.dynamicsMode!=='off'?null:scene.getCameraState?.(),notes:'',numerics:{...NUMERICS,selectedDomain:domainFor(state)},display:{heightReference:Number.isFinite(reference)?reference:null,heightLogReference:logReference,heightNormalization:'q95; log1p(abs(F)/q95)/log(2); clip ±2.5; computed in log space',sampledGrid:state.researchMode==='off'&&state.dynamicsMode==='off'&&data?{nx:data.nx,ny:data.ny,nonuniform:state.geometry!=='plane'}:null},sources:['https://github.com/judegomila/mathexplorer/pull/42','https://github.com/judegomila/mathexplorer/pull/43','https://github.com/judegomila/mathexplorer/pull/49']};}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
const filename=ext=>(state.researchMode!=='off'?'zeta-research-'+state.researchMode+'-':state.dynamicsMode!=='off'?'zeta-dynamics-'+state.dynamicsMode+'-':'zeta-')+(state.projective?'projective-':'')+state.geometry+'-'+state.function+'-'+new Date().toISOString().replaceAll(':','-').slice(0,19)+'.'+ext;
$('pngBtn').onclick=()=>{
 if(state.researchMode!=='off'){researchPanel?.flush();const url=researchPanel?.screenshot();if(!url){toast('The research plots are still computing.');return;}const a=document.createElement('a');a.href=url;a.download=filename('png');document.body.append(a);a.click();a.remove();toast('Saved the research plot. The view link retains its exact parameters.');return;}
 if(state.dynamicsMode!=='off'){dynamicsPanel?.flush();const url=dynamicsPanel?.screenshot();if(!url){toast('The dynamics canvas is not ready.');return;}const a=document.createElement('a');a.href=url;a.download=filename('png');document.body.append(a);a.click();a.remove();toast('Saved the dynamics canvas. The view link retains its exact parameters.');return;}
 if(busy){toast('Wait for this field to finish computing.');return;}const url=scene.screenshot();if(!url){toast('The 3D canvas is not ready.');return;}
 const captured=renderSettings(),refLog=logReference,img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=img.width;c.height=img.height+112;const g=c.getContext('2d');g.fillStyle='#0b1420';g.fillRect(0,0,c.width,c.height);g.drawImage(img,0,0);g.fillStyle='#d1f1a8';g.font='18px Georgia';g.fillText('Zeta Observatory · '+captured.function+' · '+(captured.projective?'projective ':'')+captured.geometry,22,img.height+29);g.fillStyle='#a4b4c5';g.font='11px monospace';const rows=['σ ∈ ['+captured.sigmaMin+', '+captured.sigmaMax+'] · t ∈ ['+captured.tMin+', '+captured.tMax+'] · τ = '+captured.tau,'height: '+captured.heightMode+' · reference = '+fmtLog(refLog,6)+' · color: '+captured.colorMode+' · phase offset = '+captured.phaseOffset.toFixed(4),'lens L = '+captured.chartScale+' · elliptic r = '+captured.torusR+' · bridge a = '+captured.bridgeA+' · finite numerical mesh'];if(captured.geometry!=='plane')rows[0]='Computed: '+domainLabel(domainFor(captured))+' · τ = '+captured.tau+' · compact chart';rows.forEach((line,i)=>g.fillText(line,22,img.height+51+i*19));c.toBlob(blob=>{if(blob)download(blob,filename('png'));},'image/png');toast('Saved the scene with its mathematical settings.');};img.src=url;
};
$('csvBtn').onclick=()=>{if(!data||busy){toast('Wait for the grid to finish computing.');return;}const lines=['# Zeta Observatory numerical grid','# '+JSON.stringify({state:renderedState,domain:data.domain,method:NUMERICS.method,certified:false}),'# log_abs is the natural logarithm of magnitude; arg is radians. Raw fields are blank outside representable float64 range.','u,v,sigma,t,re,im,abs,log_abs,arg,valid,raw_representable,bridge_balance,log_shear_tanh'];for(let k=0;k<data.valid.length;k++){const re=data.values[2*k],im=data.values[2*k+1],raw=data.valid[k]&&data.rawRepresentable[k];lines.push([data.uvs[2*k],data.uvs[2*k+1],data.coords[2*k],data.coords[2*k+1],raw?re:'',raw?im:'',raw?Math.hypot(re,im):'',data.valid[k]?data.logAbs[k]:'',data.valid[k]?data.arg[k]:'',data.valid[k],data.rawRepresentable[k],renderedState.colorMode==='bridge'&&Number.isFinite(data.bridge[k])?data.bridge[k]:'',renderedState.colorMode==='shear'&&Number.isFinite(data.bridge[k])?data.bridge[k]:''].join(','));}download(new Blob([lines.join('\n')],{type:'text/csv'}),filename('csv'));toast('Saved exact sample coordinates, log-polar values and available raw values.');};
$('jsonBtn').onclick=()=>{download(new Blob([JSON.stringify(session(),null,2)],{type:'application/json'}),filename('json'));toast('Session exported. Import it to restore this view.');};
$('linkBtn').onclick=async()=>{dynamicsPanel?.flush();researchPanel?.flush();sharedCamera=state.researchMode!=='off'||state.dynamicsMode!=='off'?null:scene.getCameraState?.();storeState({immediate:true});const url=location.href;try{await navigator.clipboard.writeText(url);toast('View link copied, including the exact settings, camera and point.');}catch{toast('This view is in the address bar. Copy the current URL.');}};
$('importInput').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{if(f.size>2000000)throw Error('Session file is too large.');const d=JSON.parse(await f.text());if(d.schema!=='zeta-observatory/1'||!d.state)throw Error('Choose a Zeta Observatory session JSON.');dynamicsPanel?.pause();researchPanel?.pause();settleCamera();stopHeat();state=validate(d.state);pendingCamera=sanitizeViewCamera(d.camera);sharedCamera=pendingCamera;pendingResetView=pendingCamera?null:shareViewName()==='phase'?'top':'perspective';probeEditing=false;pinned=true;if(sanitizeViewProbe(d.probe)&&within(d.probe.sigma,d.probe.t))probe=d.probe;focusModuleAfterLoad=state.fiberMode!=='off';syncUI();storeState({mode:'push'});compute();toast('Session restored.');}catch(error){toast(error.message);}e.target.value='';};
$('saveBtn').onclick=()=>{$('viewName').value='';$('viewNote').value='';$('saveDialog').showModal();};
$('saveForm').onsubmit=e=>{if(e.submitter?.value!=='save')return;e.preventDefault();const name=$('viewName').value.trim();if(!name)return;const view={...session(),name,notes:$('viewNote').value.trim(),id:Date.now()};saveViews.unshift(view);saveViews=saveViews.slice(0,80);try{localStorage.setItem('zeta-observatory-views',JSON.stringify(saveViews));$('saveDialog').close();toast('Saved “'+name+'” in this browser.');}catch{toast('Browser storage is full. Export this session JSON instead.');}};
$('viewsBtn').onclick=()=>{renderViews();$('viewsDialog').showModal();};$('closeViews').onclick=()=>$('viewsDialog').close();
function renderViews(){const box=$('viewsList');box.replaceChildren();if(!saveViews.length){const p=document.createElement('p');p.textContent='Your saved viewpoints and observations will appear here. Use “Save view” when you find something interesting.';box.append(p);return;}saveViews.forEach(view=>{const c=document.createElement('article');c.className='saved-card';const h=document.createElement('h3');h.textContent=view.name;const p=document.createElement('p');p.textContent=view.notes||'No observation added.';const small=document.createElement('small');small.textContent=view.state.geometry+' · '+view.state.function+' · '+new Date(view.createdAt).toLocaleString();const actions=document.createElement('div');actions.className='actions';const open=document.createElement('button');open.textContent='Restore';open.onclick=()=>{dynamicsPanel?.pause();researchPanel?.pause();settleCamera();stopHeat();state=validate(view.state);pendingCamera=sanitizeViewCamera(view.camera);sharedCamera=pendingCamera;pendingResetView=pendingCamera?null:shareViewName()==='phase'?'top':'perspective';probeEditing=false;pinned=true;if(within(view.probe?.sigma,view.probe?.t))probe=view.probe;focusModuleAfterLoad=state.fiberMode!=='off';syncUI();storeState({mode:'push'});compute();$('viewsDialog').close();};const exportBtn=document.createElement('button');exportBtn.textContent='Export';exportBtn.onclick=()=>download(new Blob([JSON.stringify(view,null,2)],{type:'application/json'}),'zeta-saved-view.json');const del=document.createElement('button');del.textContent='Remove';del.onclick=()=>{saveViews=saveViews.filter(v=>v.id!==view.id);localStorage.setItem('zeta-observatory-views',JSON.stringify(saveViews));renderViews();};actions.append(open,exportBtn,del);c.append(h,p,small,actions);box.append(c);});}
function closeDrawers(){$('controls').classList.remove('open');$('inspector').classList.remove('open');$('scrim').classList.remove('open');}
function openDrawer(id){closeDrawers();$(id).classList.add('open');$('scrim').classList.add('open');}
$('mobileControls').onclick=()=>openDrawer('controls');$('mobileProbe').onclick=()=>openDrawer('inspector');$('scrim').onclick=closeDrawers;$$('[data-close]').forEach(b=>b.onclick=closeDrawers);
document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)||document.querySelector('dialog[open]'))return;if(e.key==='r'||e.key==='R'){if(state.researchMode!=='off'){researchPanel?.pause();changeResearch({researchFrame:0},{immediate:true});}else if(state.dynamicsMode!=='off'){dynamicsPanel?.pause();researchPanel?.pause();changeDynamics({dynamicsStep:0},{immediate:true});}else resetViewCamera();}if(e.key==='h'||e.key==='H')$('focusBtn').click();if(e.key==='Escape'){pinned=false;closeDrawers();$('probeMode').textContent='Live · hover the surface';}if(e.code==='Space'){e.preventDefault();if(state.researchMode!=='off')researchPanel?.togglePlay();else if(state.dynamicsMode!=='off')dynamicsPanel?.togglePlay();else $('playHeat').click();}});
window.addEventListener('resize',()=>{drawSlice();projectivePanel.redraw();fiberPanels.redraw();});
window.addEventListener('beforeunload',()=>{dynamicsPanel?.flush();dynamicsPanel?.dispose();researchPanel?.flush();researchPanel?.dispose();viewURL?.flush();viewURL?.dispose();clearTimeout(cameraURLTimer);fieldService.dispose();prepareController?.abort();clearTimeout(heatTimer);scene.dispose();});
const projectivePanel=new ProjectivePanel();
const fiberPanels=new FiberPanels($('fiberWorkbench'),{onChange:(key,value)=>change(key,value)});
const quotientPanel=new QuotientPanel($('quotientWorkbench'),{
 onProbe:point=>{if(!within(point.sigma,point.t))return;stopHeat(false);probeEditing=false;probe={sigma:point.sigma,t:point.t};pinned=true;updateProbe(true);},
 onAction:action=>{if(action?.type==='open-research'&&['bridgeEnergy','gramSchur'].includes(action.view)){applyPreset(action.view);$('researchWorkbench').scrollIntoView({block:'start'});}else if(action?.type==='open-view'&&['projective','klein','annulus'].includes(action.view))selectMount(action.view==='projective'?'torus':action.view,true);}
});
function changeDynamics(patch,{mode='replace',immediate=false}={}){
 const clean={};for(const key of Object.keys(DYNAMICS_DEFAULTS))if(Object.prototype.hasOwnProperty.call(patch,key))clean[key]=patch[key];
 state=validate({...state,...clean,researchMode:'off'});syncUI();storeState({mode,immediate:immediate||mode==='push'});
}
dynamicsPanel=new DynamicsPanel($('dynamicsWorkbench'),{controlsEl:$('dynamicsControls'),inspectorEl:$('dynamicsInspector'),onChange:changeDynamics,onCommand:command=>{if(command==='theta'){dynamicsPanel.pause();applyPreset('heat');}else if(command==='controls')openDrawer('controls');else if(command==='inspect')openDrawer('inspector');}});
function changeResearch(patch,{mode='replace',immediate=false,progress=false}={}){
 const clean={};for(const key of Object.keys(RESEARCH_DEFAULTS))if(Object.prototype.hasOwnProperty.call(patch,key))clean[key]=patch[key];
 state=validate({...state,...clean,dynamicsMode:'off'});
 if(progress)researchPanel?.update(state);else syncUI();
 const now=performance.now();if(!progress||immediate||now-lastResearchURL>=1000){lastResearchURL=now;storeState({mode,immediate:immediate||mode==='push'});}
}
function showResearchSurface(payload={}){
 if(state.researchSource==='quadratic'||state.researchMode==='ratio'&&state.researchGhost||state.researchMode==='heat'&&state.researchHeatModel==='quartic'){toast('This altered model is shown in the research plots. Select the unmodified theta or ξ source to open its surface.');return;}
 researchPanel?.pause();settleCamera();stopHeat(false);cancelField();cancelWarm();activeClip=null;sharedCamera=null;pendingCamera=null;pendingResetView='perspective';
 const sigma=Number.isFinite(payload.sigma)?payload.sigma:state.researchSigma,t=Number.isFinite(payload.t)?payload.t:state.researchT,a=Number.isFinite(payload.a)?payload.a:state.researchA;
 const heat=state.researchMode==='heat'||state.researchSource==='heat',tau=state.researchMode==='heat'?state.researchHeatEnd*state.researchFrame/240:state.researchTau;
 state={...state,researchMode:'off',dynamicsMode:'off',projective:false,fiberMode:'off',geometry:'plane',function:heat?'heat':'xi',tau:heat?tau:0,colorMode:'shear',bridgeA:a,sigmaMin:Math.min(-.25,sigma-.35),sigmaMax:Math.max(1.25,sigma+.35),tMin:Math.max(-120,t-Math.max(state.researchSpan,state.researchRadius)),tMax:Math.min(120,t+Math.max(state.researchSpan,state.researchRadius)),height:.8,heightLocked:false,heightReference:0,contours:true,playing:false,packets:false};
 probe={sigma,t};pinned=true;probeEditing=false;document.querySelector('.main-stage').scrollTop=0;syncUI();storeState({mode:'push'});compute();closeDrawers();
}
researchPanel=new ResearchPanel($('researchWorkbench'),{controlsEl:$('researchControls'),inspectorEl:$('researchInspector'),onChange:changeResearch,onCommand:(command,payload)=>{if(command==='surface')showResearchSurface(payload);else if(command==='controls')openDrawer('controls');else if(command==='inspect')openDrawer('inspector');}});
fieldService=new FieldService({onStatus:()=>syncCacheUI()});
viewURL=new ViewURLController({window,...viewConfig,syncAfterRestore:true,getSnapshot:()=>({state,probe,camera:state.researchMode!=='off'||state.dynamicsMode!=='off'?null:pendingCamera||(sharedCamera?scene.getCameraState?.():null)}),onRestore:restoreURLView,onError:error=>toast(error.message)});
syncUI();updateProbe();storeState({immediate:true});compute();
if(incomingView.matched&&!incomingView.valid)toast('That view link could not be read. Showing the default view.');
