#!/usr/bin/env python3
"""Plot already-computed interval results; plotting is not part of the proof."""
import csv
import json
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

root=Path(__file__).resolve().parent
with (root/'window_values.csv').open() as f:
    rows=list(csv.DictReader(f))
cert=json.loads((root/'window_audit.json').read_text())
t=[float(r['t']) for r in rows]
raw=[(float(r['psi_lo'])+float(r['psi_hi']))/2 for r in rows]
win=[(float(r['window_lo'])+float(r['window_hi']))/2 for r in rows]
lower=float(cert['continuum_window_lower'])
fig,(ax1,ax2)=plt.subplots(2,1,figsize=(10,6.8),sharex=True,
                         gridspec_kw={'height_ratios':[1.15,1]})
fig.suptitle('Fixed averaging stabilizes the finite response',fontsize=17,x=.08,ha='left')
ax1.plot(t,raw,color='#8d97a6',lw=1,label=r'Raw $\Psi(t)$')
ax1.plot(t,win,color='#136eaa',lw=1.8,label=r'Unit-window mean $W_1(t)$')
ax1.set_ylabel('Response')
ax1.legend(loc='upper right',frameon=False,ncol=2)
ax1.set_ylim(bottom=0)
ax2.plot(t,win,color='#136eaa',lw=1.8)
ax2.axhline(lower,color='#14805c',ls='--',lw=1.4,
            label=f'Certified continuum lower bound: {lower:.7f}')
ax2.set_ylabel('Window mean — expanded scale')
ax2.set_xlabel('Logarithmic delay t (not zero height)')
ax2.set_ylim(lower-.00035,max(win)+.00035)
ax2.legend(loc='upper right',frameon=False)
ax2.plot([float(cert['grid_minimum_t'])],[float(cert['grid_minimum_lower'])],
         'o',color='#136eaa',ms=5)
for ax in (ax1,ax2):
    ax.spines[['right','top']].set_visible(False)
    ax.grid(alpha=.15)
    ax.set_xlim(t[0],t[-1])
fig.text(.08,.025,'Certified only for 0 ≤ t ≤ log(10⁶) − 1. The infinite prime-memory bound remains unproved.',
         fontsize=10,color='#414a55')
fig.tight_layout(rect=[.02,.055,.995,.95])
out=root/'window_comparison.png'
fig.savefig(out,dpi=170)
print(out)
