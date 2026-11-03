# Claim and dependency ledger

The status words in this table are local evidence grades:

- **proved** - analytic proof contained in the frozen evidence;
- **finite-certificate** - finite-dimensional/finite-order theorem with a
  machine-checkable certificate;
- **reviewed** - analytic derivation and independent campaign audit are both in
  the frozen evidence; this is still not external peer review;
- **conditional** - valid only under the named open hypothesis;
- **refuted-route** - a stronger auxiliary premise is rigorously false;
- **open** - the stated obligation is not discharged.

| ID | Status | Exact scope | Evidence / dependency | Explicit non-implication |
|---|---|---|---|---|
| ZSV-THETA-H5 | finite-certificate | Full theta `H5` is strictly positive for every `a>0`; the normalized `a=0` limit is covered in the odd-block integration. | `evidence/v18-curated/integrated_h5_v1/`, `h5_tail_v1/`, `post_v7_audit/`, plus the reviewed H4 block. | No all-order positivity, no full hierarchy, no RH. |
| ZSV-ODD-19 | finite-certificate | The `10 x 10` odd block `[mu_(i+j+1)]_(i,j=0..9)` is positive at normalized `a=0`, with actual `H=1/16` split and complete complement coupling. | `evidence/v18-curated/core_inertia_v2/FULL_SPLIT_PROOF.md`; replay in `full_split_audit/`. | Not the even block through degree 18; not full `H19`; no nonzero-shift or all-degree claim. |
| ZSV-TAIL-H1-A0 | refuted-route | At `H=1`, `t=7005081715/1000000`, `a=0`, the scaled cumulative-tail Fourier density is `< -53766891745349`. | `lehmer_tail_certificate_v1/PROOF.md` and `lehmer_tail_audit/`. | Refutes universal tail positivity only, not the complete bridge kernel or RH. |
| ZSV-TAIL-H1-A+ | refuted-route | At the same `H,t` and `a=1/10000`, the normalized scaled tail is `< -51718939276867`. | `V15_INDEX.md`, `lehmer_positive_shift_v1/`, `lehmer_tail_audit/`. | The obstruction is not an artifact of the removable `a=0` limit; it still does not refute the full kernel. |
| ZSV-HEATED-TAIL | proved | The negative `H=1`, `a=1/10000` tail persists on the explicit CP62 positive-heat/frequency rectangle; the complete kernel is positive on the narrower rectangle and the core compensates the tail. | `evidence/cp62/root/actual_heated_tail_obstruction.md`, checks in `root/verify_joint_source.py`. | No CP61 phase-carrier coverage, physical Weil sign, support exhaustion, or RH. |
| ZSV-FINITE-RANK-TAIL | proved | The truncated-tail convolution form has arbitrarily large negative subspaces on reflection-even compact smooth sources; finite-functional corrections cannot make the whole tail nonnegative. | CP62 T4-T5. | Does not identify the tail convolution form with the full physical Weil operator. |
| ZSV-COMMON-ANCHOR | finite-certificate | At the certified odd degree 19 and normalized `a=0`, signed local residual plus covariance gives a positive scalar reserve; matrix/common-anchor identities retain all cross terms. | `adaptive_common_anchor_v1/`, `adaptive_common_anchor_audit/`, `V16_INDEX.md`, CP62 J3-J6. | Not a higher-degree, positive-time, nonzero-shift, or degree-uniform theorem. |
| ZSV-MATRIX-ANCHOR-LIMIT | proved | Even arbitrary positive matrix anchors need not make every local residual nonnegative; exact complete covariance can still compensate. | `evidence/cp62/anchor_audit/`. | Does not refute the correlated integrated-anchor strategy. |
| ZSV-FISHER-2/17 | reviewed | For the genuine positive half-line bridge law, `I_a = Var(2h coth(2ah)) <= 2/17`, uniformly in `a>0`, by `U_a''>34` and Brascamp-Lieb. | `evidence/v18-curated/fisher_bridge_v1/FISHER_BRIDGE.md`; `fisher_bridge_audit/AUDIT.md`. | The coefficient is uniform, but the high-jet covariance it multiplies is not. No derivative-Gram positivity follows. |
| ZSV-ENDPOINT-4/867 | reviewed | In the regular parameter `lambda=a^2`, `I_lambda(0) <= 4/867`. | Same Fisher source/audit; uses `E h^2 <= 3/34` and `Var(h^2) <= 3/289`. | Endpoint regularization is not complete bridge closure. |
| ZSV-ORBIT-DISSIPATION | reviewed | The full positive theta orbit law satisfies `I'(h) <= -14 I(h)` and `0<I(h)<2e^(-14h)` for `h>=0`. | `evidence/v18-curated/theta_fisher_decay_v1/FISHER_DECAY.md`; `theta_fisher_decay_audit/AUDIT.md`. | Orbit-score contraction does not imply contraction in the actual whitened high-jet metric. |
| ZSV-PAID-INNOVATION | reviewed | The exact residual identity is `S_tilde = delta_+ - delta_- - Delta^T K Delta`; next-rung positivity is equivalent to the condition `delta_+ >= delta_- + Delta^T K Delta`. This isolates positive innovation, reflected innovation, and regression mismatch in the certified lower-block metric; the normalized `a=0` limit is explicit. | `evidence/v18-curated/fisher_bridge_v2/PAID_TWIN_INNOVATION.md`; audit. | The residual identity is exact; uniform proof of the positivity condition for the theta family is open. |
| ZSV-HEAT-RESERVE | reviewed | Spatial heat multiplies `F` by `e^{-s z^2}`, preserves all zeros, and gives `C_s=e^{2a^2s}e^{(s/2)d_v^2}(C_0+2saK_0)`; subtracting the Gaussian reserve returns an equivalent original sign problem. | `evidence/v18-curated/information_relaxation_v1/RELAXATION.md`; audit. | The reserve cannot cure an off-axis zero or establish the corrected bridge sign. |
| ZSV-NEWMAN-SIGN | reviewed | Newman evolution satisfies `partial_lambda W=-partial_t^2 W+2W[F']`; the derivative-ladder forcing is signed. | Same relaxation source/audit; paid Schur envelope in `COMPENSATED_SCHUR.md`. | The forcing cannot be discarded or treated as automatically favorable. |
| ZSV-DEATH-CHAIN | reviewed | The exact full-theta orbit marginals admit a nonexplosive positive pure-death process, with positive jump energy and an exact paid actual-`A` mismatch representation. | `evidence/v18-curated/theta_death_chain_v1/EXACT_CHAIN.md`; audit. | Positive innovation variance is not the signed Schur surplus; spatial means and forcing remain. |
| ZSV-SAMPLING-GUARD | proved | Actual fixed-parity continuous Hermite/Poisson jet spaces do not admit a degree-uniform point-sampling bound by continuous `L2`. | `evidence/v18-curated/parity_sampling_v1/PARITY_AND_SAMPLING.md`; audit. | Does not rule out weighted spatial integration or a sharper bridge estimate. |
| ZSV-UNIFORM-INNOVATION | open | Actual lower-metric innovation gain uniformly dominates regression mismatch/action and all signed coupling costs in degree. | Depends on ZSV-FISHER-2/17, ZSV-ENDPOINT-4/867, ZSV-ORBIT-DISSIPATION and an exact source/metric transfer. | This is the central missing lemma; without it there is no RH proof. |
| ZSV-PHYSICAL-J8/J9 | open | A positive-time coefficient map and reserve-relative CP62 `J8` or `J9` estimate for the full boundary/physical family. | CP62 `root/joint_anchor_and_feedback.md`. | Finite odd-moment positivity cannot be substituted for this different bilinear form. |

## Review vocabulary

“Independent replay” means a separate implementation or recomputation within
the campaign. “Internal review” means a mathematical audit performed during
the campaign. Neither is community peer review or proof-assistant
formalization unless a file explicitly says otherwise.

