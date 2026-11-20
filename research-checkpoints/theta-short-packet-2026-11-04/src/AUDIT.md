# Independent mathematical audit

Date: 2026-11-04. Status: PASS for the mathematical claims listed below, conditional only on their explicitly cited classical arithmetic inputs. This is an AI-assisted analytical audit, not external peer review or machine formalization. Source notes were not edited.

## Mesoscopic actual-theta packets

Checked degree/parity accounting, the moving Fejer frequency and two-derivative bounds, gamma-carrier cancellation, deterministic profile mass, total variations, full tails, and Stieltjes smoothing. The local density is correctly P_3+P_3', with leading derivative coefficient 1/12. The cumulative error has no additional width or oscillation-count factor. Both strict conditions n^(5/12)=o(h) and h=o(sqrt(n)) are used correctly.

The resulting derivative/mass ratio is log^2(T)/12 and the exact theta operator ratio is 3*pi^2/(16*log^2(T)). The source lower bound, mesoscopic tightness, and exponential linear-bulk leakage are supported by the estimates. No limiting arithmetic-profile substitution is used.

The Bourgain-Watt and Korolev-Shubin arithmetic statements were independently checked in the preceding audits, including the original chapter theorem reproduced at printed page 171. The source-access qualification in the note remains appropriate.

## Frozen top modes and actual transfer

Checked frequency signs, negative-branch exclusion, top-band overlap, exact nilpotence of the truncated positive shifts, K_B, and the threshold giving lambda^2/(4*K_B^2). The transferred logarithmic constant is 1/(16*K_B^2).

Section 2 remains a conditional derivative-error transfer. New Section 2A independently proves an actual-Z transfer through scalar weighted errors and a dual top-band test. Its O(T^(-1/10)) scalar error follows from the fixed fourth-power envelope decay and the scalar Riemann-Siegel bound. Integration by parts against the normalized top-band projection controls its derivative by lambda+B; it does not differentiate an unspecified remainder. Fixed bandwidth and fixed envelope-space conditioning are essential.

Independently verified the floor cutoff and scalar O(t^(-1/4)) remainder in NIST DLMF 25.10.3 and the following sentence: https://dlmf.nist.gov/25.10#E3 .

## Actual narrow polynomial packets

Checked the moving-frequency weight comparison, including its derivative and integrable O(1/n) error; scalar freezing with cutoff crossings; top-mode Fourier isolation; integration-by-parts signs; boundary and tail estimates; and the constant in the final weighted Cauchy-Schwarz step.

The squared-weight condition 4s*omega_n < log(2) isolates m=1. The condition (4s-1)*delta > 1/4 makes the extension errors vanish. The actual finite-window derivative lower bound is (2+o(1))*lambda^2*W_n. This is an absolute floor, not a derivative/mass divergence result. The companion mass lower bound and the coefficient-modified diagnostic example are consistent with that distinction.

The low-pass sufficient conditions in the two frequency notes agree. They remain unproved arithmetic targets. This audit did not repeat the third note's broader literature-exclusion search; its additional exclusions are not needed for the mathematical conclusions audited here.

## Scope and outcome

No substantive correction is required. No claim establishes selected coherence, Delta positivity, a gap-dependent rate, or an actual-theta counterexample. Mesoscopic moment asymptotics do not settle the constant-width relative problem; the absolute derivative floors do not supply its missing mass upper bound. Polynomial packet results are not automatically results for the fully X-selected endpoint.

## Audited source snapshots

SHA-256 hashes identify the exact files audited. Changes after these hashes require an incremental review.

- MESOSCOPIC_FEJER_HARDY_Z_ASYMPTOTIC.md: b84c7df0828aec439548536f4fd499eda27bf969cc619b3016bea5cdf245cf5c
- BANDLIMITED_TOP_MODE_LOWER_BOUND.md: 349de229b7f6fa5774140698bd92ab160b7ec5e1e97af3f66946452239dbf36a
- SHORT_PACKET_FREQUENCY_AUDIT.md: 786415f1340e0b9b5d4c16e8b7081b1425aae1bea161d805f4dd88405a81af77
