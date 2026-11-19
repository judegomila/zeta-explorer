"""Engine edits of lane c14-repair-map-engine-checkpoint-record (round 14 repair).
(a) engine/curated/controls.json: control BLS from push/c13-kacmoody-eisenstein-affine-weyl-shift/controls_BLS_proposed.json,
    status and source updated for the independent referee pass; UNIV source extended with the second referee.
(b) engine/curated/mk_devices.py: six device types of round 13 (lanes 1 to 6), state closed, no node; each evidence text cites
    the independent referee pass in the lane's REFEREE.md, its map row and its open cells. Entries are written with repr(),
    so no quotation mark can break the file. Previous files: before/controls.json, before/mk_devices.py
    (also engine/scratch/*.pre-c14-repair.*)."""
import json, os, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.path.join(HERE, '..', '..', 'engine')
ME = 'c14-repair-map-engine-checkpoint-record'

# ---------------------------------------------------------------- scratch copies (engine convention)
for src, dst in (('curated/controls.json', 'scratch/controls.pre-c14-repair.json'),
                 ('curated/mk_devices.py', 'scratch/mk_devices.pre-c14-repair.py'),
                 ('CANDIDATES.json', 'scratch/CANDIDATES.pre-c14-repair.json')):
    d = os.path.join(ENG, dst)
    if not os.path.exists(d): shutil.copy2(os.path.join(ENG, src), d)

# ---------------------------------------------------------------- (a) controls.json
cp = os.path.join(ENG, 'curated', 'controls.json')
C = json.load(open(cp, encoding='utf-8'))
assert 'BLS' not in C['controls']
P = json.load(open(os.path.join(HERE, '..', 'c13-kacmoody-eisenstein-affine-weyl-shift', 'controls_BLS_proposed.json'), encoding='utf-8'))
C['controls']['BLS'] = dict(
    name='BLS: ' + P['name'] + '. ' + P['definition'],
    has='; '.join(P['has']),
    lacks='; '.join(P['lacks']) + '; a single real Blaschke factor is not covered by the proof (the Moebius step does not preserve the half-plane); the sign is not free (phi = -M fails); on the two-variable affine kernel BLS is not a group object (its passing there is argued)',
    kills=P['use'] + '. T-NR with c > 2 and arccosh(c/2)/log q < 1/2 is a case: the factor D(z)/D(z+1), D(z) = q^(z-1/2) + q^(1/2-z) + c, is a convergent Blaschke product over non-real pairs. Pre-filter question Q-B: does the inequality survive multiplication of the scattering coefficient by a Blaschke product over non-real conjugate pairs',
    kw=r'\bBLS\b|scattering-level Blaschke|Blaschke control',
    status='proved in rank one',
    source=P['source'] + ' (Theorem C) and REFEREE.md (independent referee pass of 2026-11-19: Theorems B and C and the T-NR factor re-derived, convergence of the product supplied; holds with five corrections of wording or scope); map section 2 note BLS and row D9. Entered by ' + ME + ' from controls_BLS_proposed.json',
    scope='control for Eisenstein / scattering carriers: proved for the rank-one Maass-Selberg inequality (T >= 1); argued for the affine (loop-group) kernel; not a Dirichlet-series control (no statement about devices that do not read a scattering coefficient)')
u = C['controls']['UNIV']
add = ' Second independent referee (push/c13-referee-r12-independent/REFEREE2_c12-univ-pointwise-control-wcone.md, part (a) only): holds relative to Theorem 7 of the survey; Corollary U4 (hybrid form) is ARGUED until "connected complement" is read in the primary source.'
assert add not in u['source']
u['source'] = u['source'] + add
C['about'] = C['about'] + ' BLS added and UNIV source extended by ' + ME + ' (round 14).'
json.dump(C, open(cp, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('controls.json:', len(C['controls']), 'controls', sorted(C['controls']))

# ---------------------------------------------------------------- (b) mk_devices.py
P13 = 'push/c13-'
NEW = [
 ('kacmoody-loop-eisenstein-maass-selberg', 'closed',
  'Borel Eisenstein series on the loop group of SL_2: constant term over the affine Weyl group, Maass-Selberg positivity, degenerate Whittaker coefficients',
  'lane c13-kacmoody-eisenstein-affine-weyl-shift (round 13, explore). CLOSED at stage A: rank-one PROVED, affine kernel ARGUED. On ' + P13 + 'kacmoody-eisenstein-affine-weyl-shift/REFEREE.md (independent pass; every PROVED step re-derived; holds with five corrections of wording or scope). '
  'In the chamber 0 < Re z < Re c every denominator argument of the constant term and of the degenerate Whittaker coefficients has Re > 1; strip arguments occur only as numerator arguments (coefficient census relative to a recalled normalisation; Garland and FKP not opened). '
  'The Maass-Selberg inequality of the rank-one Levi is equivalent to: N = z(1-S)/(1+S), S = T^(-z) xi(z)/xi(z+1), is a Nevanlinna function of z^2 (Theorem B), and this is preserved under multiplication of S by Blaschke factors over non-real conjugate pairs of the right half-plane (Theorem C). '
  'T-NR (c > 2, arccosh(c/2)/log q < 1/2) and control BLS pass every analytic step of the rank-one inequality. For the two-variable affine kernel the same closure is argued, not proved. At c = 1 every non-identity coefficient is xi(z)/xi(z+n) (identity). '
  'Controls recorded: T-NR, BLS pass; DH no failure found on grids (measured, low power); E_a passes as a group object; EIS-w not run. Open cells: a proof for the affine kernel; the wall Re c -> 0; inequalities other than truncated-norm positivity. Map row D9. Proposal file engine_device_proposal.json of the lane',
  []),
 ('fourier-interpolation-zero-nodes', 'closed',
  'Fourier interpolation with nodes at the zeros and frequencies log n/(4 pi) (Bondarenko-Radchenko-Seip kernel; Radchenko-Viazovska pair as the case s = 0)',
  'lane c13-fourier-interpolation-zero-nodes (round 13, explore). CLOSED at stage A, on ' + P13 + 'fourier-interpolation-zero-nodes/REFEREE.md (independent pass; holds with corrections C1 to C9). '
  'The kernel is (F*(s)/F*(w)) x A_k(w,s), with A_k a target-independent Dirichlet series of the theta group, unique by Bochner\'s converse theorem (relative to arXiv:2005.02996 sections 3, 4; not re-derived); kernels of one gamma class and one sign of the functional equation are related by symmetric multipliers G(s)/G(w) (Lemma M: an identity of kernels, not a classification of bases). The target enters by division. '
  'The Euler product is read twice: absolute convergence of 1/F right of 1 (edge Re w = 1, partial sums x^(1/2+eps), inequality (I-1); T-NR satisfies it) and the Ramachandra-Sankaranarayanan horizontal lower bound (function class only). '
  'Off-line nodes move the exponent of the partial sums in the frequency index from 1/4 to beta/2 < 1/2; exponent 1/4+eps for all s implies RH (converse argued): a restatement. For multiplier controls no sign or decay of the basis functions changes (Lemma T); for a general target nothing about signs is established. '
  'Controls: T-NR passes every step (height selection argued); WT passes as a translate; DH and theta^w pass in a smaller class (argued on source sketches); E_a open at the gamma-class step and fails (I-1) in size; controls without a functional equation stop at the definition. The Weil functional in the basis is the explicit formula in coordinates. '
  'Open cells: kernel for the gamma factor Gamma_R(s+a)Gamma_R(s-a) (E_a, EIS-w); sign pattern of DH basis functions; stage B (the functions U_n, V_rho) not run. Map row G34. Proposal file engine_device_proposal.json of the lane',
  []),
 ('lrs-amplification-eisenstein-at-zero', 'closed',
  'Luo-Rudnick-Sarnak mechanism (Rankin-Selberg positivity, even twists in the conductor aspect, gamma pole at the non-tempered parameter) on E*(z, rho/2) and on Borel Eisenstein data at regular parameters in any rank',
  'lane c13-lrs-twist-amplification-zero-representation (round 13, explore; RS-1 with RS-2). CLOSED at stage A at the generic-parameter control, on ' + P13 + 'lrs-twist-amplification-zero-representation/REFEREE.md (independent pass; Lemmas 0 to 4 re-derived, residues recomputed by contour at two zeros and two generic parameters; holds with five wording defects). '
  'At xi(rho) = 0 the completed Rankin-Selberg function has exactly one simple pole pair, at 2 - beta and beta - 1; the gamma pole of the even twists is at 1 - beta, so pole minus gamma pole is 1 for every parameter (from the Hecke eigenvalues alone); the vanishing forced at the gamma pole is the trivial zero L(0, chi) = 0; the inequality reads beta <= 7/4. LRS needs the pole at 1 independent of the parameter (square-integrability). LRS exponent count reconstructed, paper not opened; the verdict does not depend on it. '
  'Controls: E_a, EIS-w (generic parameter) and WT pass every step with the same output; T-NR, DH, DEL, THIN, U not formulable (no eigen-object constructed). Reads: Hecke relations at all primes (identity), xi(rho) = 0 and the functional equation at rho (residue pattern), functional equation of twists (conductor aspect). '
  'Open cells: non-Borel Hecke eigen-objects with parameter rho and Rankin-Selberg pole left of 2 - beta (residual or cuspidal data on a larger group; no candidate on file); a level-q object for T-NR; walls. Map row G35',
  []),
 ('edrei-thoma-local-total-positivity', 'closed',
  'Edrei-Thoma local total positivity of Euler factors, and the non-cone inequality types of the round-13 census as single-object devices',
  'lane c13-tnr-invariance-prefilter-noncone-census (round 13, combine). CLOSED, on ' + P13 + 'tnr-invariance-prefilter-noncone-census/REFEREE.md (independent pass; Lemmas P, L, E re-derived; holds with corrections R-1 to R-5). '
  'Local total positivity holds exactly for T-NR with c >= 2 and for E_a and fails for the tempered twin, for L(s, chi) at chi(p) = -1 and for tempered degree-2 factors: ordered against the target. '
  'Census of twelve inequality types not preserved by cone endomorphisms: no entry fails both T-NR and E_a at a step that is an unconditional property of zeta, reads the functional equation and is not passed by another control (theta^w with w = 1/3, 1/2, 3 passes the one measured entry that fails both). '
  'Lemma P (pre-filter, proved): T-NR with c > 0 passes every device reading only linear identities, dilation-invariant cone conditions on objects linear in F and conditions away from p0; exclusions X1 to X5; 13 device types carry a T-NR record, 0 disagreements (typed with the records visible). '
  'Open cells: 23 device types with no T-NR record by name; functionals of two objects (lanes c14-joint-zeta-twist-noncone-search, c14-joint-pair-design-ratio-vortex-cross-bridge). Map rows P55, L6; hand-off file PREFILTER.md',
  []),
 ('bilinear-reciprocity-height-jform', 'closed',
  'Exact reciprocity at height t for the bilinear pair L(s,chi)L(s,chi-bar) (Bettin 2016 Theorem 5 with the Estermann reciprocity) read as a J-form over characters',
  'lane c13-bilinear-reciprocity-height-antibridge (round 13, combine). CLOSED at the decisive test, on ' + P13 + 'bilinear-reciprocity-height-antibridge/REFEREE.md (independent pass; every PROVED step re-derived; holds with corrections E1 to E4). '
  'Entries are real, R_chi(t) = const Z_chi(t) Z_chi(-t); the sign is (-1)^(number of zeros in the strip with ordinate in (-t, t)), fixed by the argument principle whether or not the zeros are on the line. The reciprocity is the period relation of the Eichler-integral series of E(z, 1/2 + it) (reading argued): the height is a spectral parameter and the two L-arguments are tied at integer offsets, so no kernel in two independent heights is reached. '
  'Controls: T-NR multiplies every entry by a positive number (all signs, inertias and cone statements unchanged); for E_a with real a every entry is a Hermitian square; DH has real entries for q = +-1 mod 5 with the same sign rule; window translate covariant; DEL, THIN, U not formulable. With twist-modulus-reciprocity (Hermitian form, row Z34) exact reciprocity is closed as a height-reading device in both forms. '
  'Open cell: an exact law for the Estermann function off its central point (none known). Map row Z36',
  []),
 ('dictionary-d-kernel-sign-functionals', 'closed',
  'Dictionary D: sign functionals of the theta-normalised kernel with at most three real parameters (dilation minors of orders 2 to 4, Turan-type expressions, Hecke-compensated forms at primes up to 13) as separators of zeta and L(s,chi), q <= 13, from the battery control classes',
  'lane c13-noncone-kernel-separator-search (round 13, compute). CLOSED as MEASURED, finite search: closed on the registered grid and draws only, with the conventions of the lane\'s PREREG section 2. On ' + P13 + 'noncone-kernel-separator-search/REFEREE.md (independent pass; 1,226 entries re-evaluated with separate code at 330 digits, 0 sign differences; seven findings on the reading; counts of the server-only stages read, not recomputed). '
  'Of 12,994,697 functionals on 290 objects, 629,432 are one-signed on the 24 positives and none has the opposite sign on a member of every control class; 0 reject battery DH, 400 reject backward heat. The one-signed condition is fitted on 24 objects and does not hold out (held-out L-functions opposite at mean rate 0.287, above held-out DH members of real-part type at 0.193). '
  'Registered prediction "T-NR passes the minors with polar terms" false (0.646); "E_a passes" holds. Lemma H (order 2) is the only proved statement. '
  'Open cells (not run): Hermitian forms for complex kernels; orders above 4; more than three parameters or nodes outside [-2.6, 2.6]; functionals reading two kernels at once (lane c14-joint-zeta-twist-noncone-search); other kernels or normalisations. Map row G36',
  []),
]
mp = os.path.join(ENG, 'curated', 'mk_devices.py')
t = open(mp, encoding='utf-8').read()
for e in NEW: assert "('" + e[0] + "'" not in t, e[0]
anchor = "\n]\nTARGET_FORMS = dict("
assert t.count(anchor) == 1
block = "\n # ---- round 13 lanes (entered by " + ME + "; each closed on the independent referee pass in the lane's REFEREE.md; no node)\n"
block += ''.join(' (%r, %r, %r,\n  %r,\n  %r),\n' % e for e in NEW)
t = t.replace(anchor, block.rstrip('\n') + anchor)
doc_anchor = 'Edit this file, then run it, then build_graph.py."""'
assert t.count(doc_anchor) == 1
t = t.replace(doc_anchor,
  'Edited by ' + ME + ' (round 14): six device types of round 13 added, each closed on the independent referee pass of its lane '
  '(kacmoody-loop-eisenstein-maass-selberg: rank-one proved, affine kernel argued; fourier-interpolation-zero-nodes; lrs-amplification-eisenstein-at-zero; '
  'edrei-thoma-local-total-positivity; bilinear-reciprocity-height-jform; dictionary-d-kernel-sign-functionals: MEASURED, finite search; no node) '
  '(previous file scratch/mk_devices.pre-c14-repair.py).\n' + doc_anchor)
open(mp, 'w', encoding='utf-8').write(t)
compile(t, mp, 'exec')
print('mk_devices.py patched:', len(NEW), 'entries')
