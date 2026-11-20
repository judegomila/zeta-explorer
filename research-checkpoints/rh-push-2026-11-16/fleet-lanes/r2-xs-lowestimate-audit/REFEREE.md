# REFEREE: r2-xs-lowestimate-audit

Date 2026-11-16. Adversarial referee pass on RESULT.md (claimed verdict: partial-result; no error found, no new bound).
Outcome: every PROVED claim was confirmed by re-derivation or by an independent rerun. No mathematical error found.
Four labelling/count defects are listed in section 3. RH is not assumed anywhere; no verified-height statement is used.

## 1. What was re-derived or rerun

| claim | referee action | result |
|---|---|---|
| Prop 3.1 row norm `Z^{M'+(5l+d-1)_+/4}` | re-derived by hand from manuscript l.6226-6290 with l free: `Pa = Z^{2ly-1+l} = Z^b`; `M'+l'-1 = -3d`; branch u = z_a gives `M' - O/2 - Delta_H`; other branch uses `u >= v/2`, `u + l_b + 2e/3 + (T_d-y)_+/2 >= T_d/4`, identity (15.3), `z_a <= l'`, giving `M' + (1+3l'-2M'-2Delta_H)/4`, and `1+3l'-2M' = 5l+d-1` | confirmed, relative to Lemma 14.3 as stated |
| formula (14.14) never exceeds the bound | independent sampler, different seed (987654321), corner-weighted, B_0 and S_0 up to 1/2 (the original capped them at A_0), 48,371 admissible points | 0 violations, max gap exactly 0 |
| inequality (17) iff l <= 1/5 | 1001-point d-grid at l = 1/6, 1/5, 201/1000 | max 0, 0, +1/1600; confirmed |
| per-tuple exponent, (12), tuple count | by hand: `(M'-ly+d)/2 + b/12 + L/2 = (lx-d)/2 + b/12 + L/2`; `C_b(B(l)) = 1/4 - l/4 - b/6 = lx/2 + b/12` | confirmed |
| r_* in [3/5,1], t-r_* in [1/3,1/2], all 0<=c<=1 | checked the four identities by hand; exact 41^3 rational grid including all corners | range exactly [3/5,1] and [1/3,1/2]; confirmed. `(3-c)/(5-2c) >= 8/13` on c >= 1/3 confirmed |
| Liu II Lemma 14.10, B_flat, F_flat(13/18) | mpmath 50 digits from scratch: B_flat = 0.874886647039964130944614000530180649..., quartic residual 0; F_flat(13/18) = 0.8748434120081672746078646094642...; F_flat(3/4), F_flat(1) agree to 20 digits; E(delta_c,1/2) at l = l_* vanishes for two values of b | confirmed |
| F_flat increasing on [13/18,1] | independent interval run (mpmath iv, 7919 boxes, hand-coded derivatives, different partition) | `d l_*/d kappa < 0` certified on every box (upper bound -0.00197); confirmed |
| scripts | reran both: 88 PASS / 0 FAIL and 28 PASS / 0 FAIL, logs reproduce | confirmed |
| transcriptions | manuscript table (7.16) / J_j list, Xu-Sang (10)-(17), (21), (27), Appendix E printed rationals, Liu `cr`, `l_*`, Lemma 14.10 statement compared with the source texts | match. The auditor's reading `V^{1_{j<=1}}` of the extracted "V 1j<=1" in (7.11) is the correct one (table row `m >= r + 1_{j<=1}`) |

## 2. Controls

* DH: the note is an audit, not an argument toward RH, so there is no step that should fail for DH beyond the
  chain's own. The statement that the direct estimate (Prop 3.1) is Euler-blind and the Euler product enters on
  the Poisson side through `1/L^S` and `H_p` is consistent with the texts read. It is READ, not tested.
* RH / verified height: neither is used. The only abscissa reported as kernel-checked is 7/8.
* Not an obstruction verdict. The l <= 1/5 limit is sharp inside formula (14.14) (corner point confirmed), not
  shown sharp for the actual sums; a stronger reflected-energy bound would be the way past it.

## 3. Defects (none changes a PROVED statement)

1. Check count is inflated. Four of the 88 checks in `xs_audit.py` are hard-coded `True` (lines 170, 208, 211,
   239: C1 Hoelder, D2 AFE (38), D5 conductor, E3 Euler region). All four are true by one-line algebra, but they are
   hand checks, not script checks. Roughly eight more are fixed arithmetic on literals (D3, D4, C4, E5). Section G
   (4 checks) repeats round 1. Machine-checked new content: about 70 checks.
2. "(27) derived from the raw powers of (18)" compares (27) with the auditor's own transcription of the outside
   powers (`raw` in the script), not with an independently parsed display. Same for `hp_good`, `hp_ram` in C.4. The
   arithmetic is right; the match to the source is READ.
3. "F_flat(13/18) is the minimum of the scalar system over the whole moment range" is too strong. What is proved
   is that the function F_flat is increasing on [13/18,1]. F_flat(kappa) is a boundary only where
   `beta_* <= (1+kappa)/2` and Lemma 14.11 hold (kappa in [kappa_flat, 3/4]); 0.874843 is not an attainable bound
   and must not be quoted as one. The interval replay follows the same scheme as Liu's own certificate (30000 boxes);
   the extension of monotonicity from [7497/10000,1] to [13/18,1] is the only new part.
4. The headline "hand-checked 0.8748875 / 0.8748867" also depends on steps labelled READ in the same note
   (Appendix C.3 contours, Appendix B Sobolev step, Appendix F order) and on round 1 (Appendix A). The summary line
   should say "given manuscript statements and the READ steps".

## 4. Verdict

holds = true. Surviving claim: relative to manuscript Lemma 14.3 and Prop 15.2 as stated, the Xu-Sang low estimate
exponents for 1/6 < l <= 1/5 are correct; the r_* range holds for all 0 <= c <= 1; the Appendix B/C/E exponent and
rational arithmetic is correct (source match by reading); Liu II Lemma 14.10 holds as a scalar statement with the
stated enclosures and F_flat is increasing on [13/18,1]. No new bound. Open as before: proofs of Lemmas 14.3, 15.2,
18.1 at the new geometry, Liu II Lemma 14.11. Kernel-checked abscissa stays 7/8.

Referee scratch script: /tmp/ref_r2xs/chk.py (not part of the deliverable).
