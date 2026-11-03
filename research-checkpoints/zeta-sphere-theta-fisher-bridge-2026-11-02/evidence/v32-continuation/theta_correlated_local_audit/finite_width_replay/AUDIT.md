# Finite-width signed transport: independent audit and replay

PASS, 2026-11-03. Replayed the owned finite-width checker with four previously independently generated moment files from regional_metric_replay. No fresh quadrature was performed or claimed. The script and owned solve dependency are copied here. No acquired code was executed.

Let Q_i(z)=c_i+2z^T b_i+z^T A_i z. For positive endpoint A_i and z_i=-A_i^-1 b_i, Q_1(z_0)=s_0+J=s_1+(z_0-z_1)^T A_1(z_0-z_1). Also r=Lz_0+l=A_1(z_0-z_1). Hence s_1-s_0=J-r^T A_1^-1 r. This proof requires endpoint old positivity only, not intermediate inverses, local positivity, or shell positivity. A verified 0<P<=A_1 gives A_1^-1<=P^-1 and the stated sufficient one-sided criterion is valid. Signed increments telescope; adverse increments cannot be omitted.

The optional stable form requires L>0, which the checker verifies by interval LDL. The exact binary Schur identity then gives J-K=s_M+(z_0-z_1)^T A_0(z_0-z_1)+(z_M-z_1)^T L(z_M-z_1). No target sign is used as a premise. Unlike the derivative-only packet, this replay does access the previously certified endpoint target moment values; this is reuse of existing finite examples, not a new target integration or independent ladder proof.

Independent result.json confirms:
- Odd7: correlated gain >4,045,697,092.889, recovered core >3,697,941,438.404. Separate J minus K has lower endpoint -6,525,998,860.063 and is inconclusive. Gain/source lies between .0217154 and .0235352, validating the conservative 2.17%-2.36% statement.
- Even6: correlated gain >47,275,752.6339, recovered core >46,532,339.3829. Gain/source lies between .3122618 and .3144100, validating 31.22%-31.45%.

All numbers use h/(4pi). Direct endpoint Schur differences independently enclosed from the same input intervals overlap the stable enclosures. The known even6 initial outward loss is compatible with this positive finite-width change; neither a maximum intermediate loss nor pointwise monotonicity is inferred.

Accepted scope: exact endpoint-only signed transport and correlated evaluation of existing odd7/even6 finite recovery. No degree-uniform success, no next-rung extension, and no all-shift conclusion. The negative odd7 lower bound from separate interval subtraction is an enclosure limitation, not negative actual gain.
