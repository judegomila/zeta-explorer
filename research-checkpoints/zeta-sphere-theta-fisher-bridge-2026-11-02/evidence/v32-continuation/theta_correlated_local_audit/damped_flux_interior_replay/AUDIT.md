# Damped flux interior obstruction: independent audit and replay

PASS, 2026-11-03. Replayed the owned focused checker from the auditor's fresh 1000-cell initial core moments and independently generated flux coefficients. Owned dependencies copied here; no acquired code executed. The broader exploratory scan is not used.

The cumulative mesh is w=3/8000. After 25 cells the exact endpoint is 1/8+25w=43/320; after 500 cells it is 5/16. Every cell adds midpoint value times w and the outward error radius w^3 sup|density''|/24 from the audited full-theta derivative16 evaluator. The compact domain requires no spatial-infinity tail. Only M0..M6 are integrated; the even inverse uses M0..M5 and odd inverse M1..M6, excluding each target moment. Local target densities are evaluated directly.

The actual integrated and local old matrices are interval-LDL positive at both tested points, so the inverses and stable local formula are valid. Gradient factor 4, full-line beta factor 2, signed LDL bilinear, and (99 S'+(S-Phi)')/100 match the previously reviewed moving-flux identities. The checker's exception handler could report unresolved calculations rather than failing the process, so acceptance explicitly inspects both result statuses: both are negative, with no error records.

Independent result.json yields:
- even6 at 43/320: U_.01' upper <-896004.411111; actual S' lower >2707501.905.
- odd7 at 5/16: U_.01' upper <-2588457747.521; actual S' lower >8980041751.808.
These strict pointwise negative derivatives already disprove monotonic increase of this candidate over the full recovery interval. No certified neighborhood width is inferred.

Scope: actual-theta counterpoints to the specific constant c=.01. The earlier positive endpoint-window certificates remain correct. No exclusion of all smaller constants, degree-dependent or spatially varying weights, or nonmonotone integrated recovery follows. No new rung or global sign theorem is claimed.
