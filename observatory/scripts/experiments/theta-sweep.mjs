#!/usr/bin/env node
/** Reproduce the renderer's 241-frame first-three-zero sweeps.
 * node zeta-theta-sweep.mjs /path/to/zeta-view /path/to/output.json
 * Then: python zeta-theta-independent.py /path/to/output.json
 */
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const repository=path.resolve(process.argv[2]||process.cwd());
const output=process.argv[3]||'/tmp/zeta-theta-comparison.json';
const {computeHeatTrajectories}=await import(pathToFileURL(path.join(repository,'dist/research-dynamics.js')).href);
const started=performance.now();
const config={researchMode:'heat',researchHeatModel:'theta',researchT:14.134725141734693,researchHeatCount:3,researchContourRadius:.35,researchShowVectors:false,researchShowContours:false};
const runs=[];
for(const end of [-.1,-.2,.2]){
  const runStart=performance.now(),frames=[];
  for(let frame=0;frame<=240;frame++){
    const {diagnostics:d}=computeHeatTrajectories({...config,researchHeatEnd:end,researchFrame:frame});
    frames.push({frame,tau:d.tau,roots:d.roots,contour:d.sampledContour,unresolved:d.unresolved});
  }
  const all=frames.flatMap(f=>f.roots),summary={
    tauEnd:end,frames:frames.length,rootCount:frames[0].roots.length,
    initialHeights:frames[0].roots.map(r=>r.t),finalHeights:frames.at(-1).roots.map(r=>r.t),
    heightChanges:frames.at(-1).roots.map((r,i)=>r.t-frames[0].roots[i].t),
    maxTransverseDisplacement:Math.max(...all.map(r=>Math.abs(r.sigma-.5))),
    minCondition:Math.min(...all.map(r=>r.condition)),
    maxNewtonResidual:Math.max(...all.map(r=>r.residual)),
    maxRefinedResidual:Math.max(...all.map(r=>r.refinedResidual)),
    minSampledRoucheMargin:Math.min(...frames.map(f=>f.contour.roucheMargin)),
    windingRange:[Math.min(...frames.map(f=>f.contour.winding)),Math.max(...frames.map(f=>f.contour.winding))],
    unresolved:frames.at(-1).unresolved,elapsedMs:performance.now()-runStart,
  };
  runs.push({tauStart:0,tauEnd:end,summary,frames});
  console.log(JSON.stringify(summary));
}
const report={
  schema:'zeta-theta-comparison/1',generatedAt:new Date().toISOString(),
  scope:{model:'actual theta integral',config,frameCount:241,
    normalization:'F_tau(s)=8 H_tau(-2i(s-1/2)); partial_tau F=F_ss/4',
    thetaIntervals:384,refinedThetaIntervals:768,
    conditionDefinition:'|Fs|/(|Fs|+|Fss|)',
    residualDefinition:'|F/Fs| positional Newton correction',
    rootChart:{sigma:[-2,3],t:[0,60]},
    contourCenter:{sigma:.5,t:14.134725141734693},contourRadius:.35,contourSamples:128,
    transverseInterpretation:'The seeds lie on the symmetry line and analytic Newton evolution preserves that symmetry in these runs. Zero computed transverse excursion is not an independent exclusion of off-line zeros or a proof that no untracked branch exists.',
    certified:false},
  runs,timings:{javascriptMs:performance.now()-started},independentVerification:null,analyticContourEstimate:null,
};
fs.writeFileSync(output,JSON.stringify(report,null,2));
console.log('Saved',output,report.timings);
