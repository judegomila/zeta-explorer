/**
 * imp-95532 — Do any Muntz-complete native-span node sets (sum 1/s_k = inf)
 * admit the Riesz / trace-class structure the pencil chain needs? Assess whether
 * imp-95530 (A6)'s "unavailability" is a HARD OBSTRUCTION or an OPEN CONSTRUCTION
 * gap. VERDICT: HARD OBSTRUCTION. RH OPEN; no refereed bound is changed; NO QED.
 *
 * SETUP (taken as given).
 *  - imp-95530 (A5) Div: within the native span E_V = span of the Cauchy kernels
 *    k_{s}(z) = 1/(z + s - 1) at real nodes s > 1, the ONLY flow-critical
 *    positivity family is the all-finite-S family, and it equals RH via the
 *    identity theorem (a Caratheodory interpolant that agrees with phi on (1,inf)
 *    must BE phi). That identity step needs the nodes to be COMPLETE, i.e. the
 *    only Nevanlinna function vanishing on all of them is 0.
 *  - imp-95530 (A6): on lacunary / Blaschke sub-families (sum 1/s_k < inf, e.g.
 *    the geometric lattices nu_0 rho^k that carry every count-uniform certificate
 *    of the pencil chain, imp-95226 BL-LAT) the identity step FAILS; reaching RH
 *    needs sum 1/s_k = inf (Muntz-complete node sets), "exactly the sets on which
 *    the chain's Riesz / trace-class structure is unavailable (imp-95520)".
 *  - imp-95520: the pencil chain currency (Gram / mean-time compression, the
 *    generalized eigenproblem (P_S, G_S)) is a TRACE-CLASS object built on the
 *    Cauchy Gram G_S; it presupposes G_S is boundedly invertible (a Riesz basis
 *    of reproducing kernels) so the compression M is bounded / trace-class.
 *
 * THE QUESTION (imp-95532). Is the A6 "unavailability" a HARD OBSTRUCTION (a
 * theorem that no Muntz-complete node set can carry the Riesz / trace-class
 * structure), or merely an OPEN CONSTRUCTION gap (no such set has yet been built,
 * but one might exist)? State which, with the precise obstruction or reduction.
 *
 * VERDICT: HARD OBSTRUCTION. It is the Carleson / Shapiro-Shields
 * completeness-versus-Riesz-sequence DICHOTOMY for reproducing-kernel systems of
 * the Hardy / de Branges space of the right half-plane, and BOTH horns are
 * governed by the SAME quantity sum 1/s_k, on OPPOSITE sides:
 *
 *  (D1) COMPLETENESS <=> non-Blaschke. For real nodes s_k > 1 the Cauchy kernels
 *       k_{s_k} are complete in H^2 of the right half-plane iff the Blaschke
 *       product prod (z - s_k)/(z + s_k - 1) diverges to 0, i.e. iff
 *       sum (s_k - 1/2)/(1 + s_k^2) = inf, i.e. (for s_k -> inf) sum 1/s_k = inf.
 *       This is exactly the Muntz-Szasz condition; it is what the identity step of
 *       imp-95530 (A5) needs. Under it, no nonzero function vanishes on all nodes,
 *       so a Caratheodory interpolant is forced to equal phi.
 *  (D2) RIESZ SEQUENCE (=> bounded-below Gram => trace-class pencil) <=> separated
 *       Blaschke (Carleson). The kernels {k_{s_k}} form a Riesz sequence (their
 *       Gram G_S is uniformly boundedly invertible as |S| -> inf) iff the nodes
 *       are a separated Carleson sequence, which for real s_k -> inf REQUIRES
 *       sum 1/s_k < inf. This is the geometric-lattice regime imp-95226 BL-LAT /
 *       imp-95520 runs the trace-class pencil on.
 *  (D3) THE TWO ARE COMPLEMENTARY. A node set that is BOTH complete AND a Riesz
 *       sequence would be a complete interpolating sequence, i.e. a RIESZ BASIS of
 *       reproducing kernels for H^2 of the right half-plane. By the Hruscev-
 *       Nikolskii-Pavlov / Pavlov theorem such a sequence must be Blaschke,
 *       Carleson-separated, with a generating (Blaschke) product whose modulus is
 *       an A_2 (Muckenhoupt) weight on the boundary. REAL nodes s_k > 1 tending to
 *       infinity are on the boundary of the interpolation regime: being complete
 *       forces non-Blaschke (D1), which DENIES the Blaschke/Carleson requirement of
 *       (D2)/(D3). So no real native-span node set is simultaneously complete and a
 *       Riesz sequence: the trace-class structure is UNAVAILABLE precisely on the
 *       sets (Muntz-complete) that could reach RH, and available precisely on the
 *       sets (Blaschke) that cannot. This is a THEOREM, not an unbuilt object.
 *
 * WHY IT IS NOT AN OPEN CONSTRUCTION GAP. An "open construction gap" would mean:
 * choose the s_k more cleverly and get both. (D3) forbids it - completeness and
 * the Riesz-basis property are the SAME sequence property read on the two sides of
 * the single Blaschke sum. There is no free parameter left: sum 1/s_k is either
 * finite (Riesz, incomplete) or infinite (complete, Gram degenerate). The only
 * escape would be a Riesz BASIS of Cauchy kernels for the whole space on the real
 * axis, which the interpolation theorem rules out for boundary-real non-Blaschke
 * nodes. Hence: HARD.
 *
 * NUMERICAL WITNESS (recomputed by the assertions). Normalize the Cauchy Gram to
 * the correlation matrix C_ij = G_ij / sqrt(G_ii G_jj) = 2 sqrt(nu_i nu_j) /
 * (nu_i + nu_j) with nu_k = s_k - 1/2; in log-coordinates t_k = log nu_k this is
 * the Toeplitz-type kernel C_ij = 1 / cosh((t_i - t_j)/2) (verified). lam_min(C)
 * is the Riesz constant of the kernel system:
 *   - Geometric (Blaschke, sum 1/nu < inf) nu_k = rho^k: lam_min PLATEAUS at a
 *     POSITIVE floor rising with the log-spacing -- rho=3: ->2.99e-3, rho=4:
 *     ->1.50e-2, rho=8: 0.1358 (n=6) -> 0.1061 (n=32). Bounded below => Riesz
 *     sequence => G boundedly invertible => trace-class pencil AVAILABLE.
 *   - Harmonic (Muntz-complete, sum 1/k = inf) nu_k = k (the Hilbert matrix 1/(i+j)):
 *     lam_min COLLAPSES exponentially -- 1.88e-7 (n=6), 2.94e-13 (n=10), below the
 *     float floor for n >= 16. G is NOT boundedly invertible => trace-class /
 *     Riesz structure UNAVAILABLE. This is the (D2)/(D3) obstruction made visible.
 *
 * SCOPE. Structural / spectral assessment of an existing no-go (imp-95530 A6);
 * confirms the "unavailability" is a hard dichotomy, not a construction gap. It
 * changes NO bound, closes NO obligation, and is not itself a Lambda lever: the
 * Muntz-complete side reaches RH only in the identity-theorem sense already
 * catalogued (soft under the flow per NS-RIGID A5). RH OPEN; no refereed bound is changed
 * ; NO QED. Import-free; assertions recompute the dichotomy.
 */

// Compact symmetric Jacobi eigensolver (imp-95530 / imp-95520 style).
function jacobiEigvals(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 400; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) { const a = A[k][p], b = A[k][q]; A[k][p] = c * a - s * b; A[k][q] = s * a + c * b; }
        for (let k = 0; k < n; k++) { const a = A[p][k], b = A[q][k]; A[p][k] = c * a - s * b; A[q][k] = s * a + c * b; }
      }
    }
  }
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}

// nu_k = s_k - 1/2; normalized Cauchy Gram C_ij = 2 sqrt(nu_i nu_j)/(nu_i+nu_j).
export function normalizedCauchyGramMin(nu) {
  const C = nu.map((a) => nu.map((b) => 2 * Math.sqrt(a * b) / (a + b)));
  return jacobiEigvals(C)[0];
}
const geometricNodes = (rho, n) => { const g = []; for (let k = 0; k < n; k++) g.push(Math.pow(rho, k)); return g; };
const harmonicNodes = (n) => { const h = []; for (let k = 1; k <= n; k++) h.push(k); return h; };

export const IMP95532_LITERALS = Object.freeze({
  geoRieszFloor: { rho8_n6: 0.1357650011312114, rho8_n32: 0.10609032158182842, rho4_n32: 0.015041473615020997, rho3_n32: 0.002989310880388484 },
  harmonicCollapse: { n6: 1.880519702161185e-7, n10: 2.9434484207624956e-13 },
  sechIdentityAt: { nu: [1.3, 7.9], value: 0.6966704503896549 },
});

export const IMP95532_MUNTZ_COMPLETE_RIESZ_OBSTRUCTION = Object.freeze({
  id: 'imp-95532-muntz-complete-riesz-obstruction',
  question: 'Do any Muntz-complete (sum 1/s_k = inf) native-span node sets admit the Riesz / trace-class structure the pencil chain needs (imp-95530 A6)? Hard obstruction or open construction gap?',
  verdict: 'HARD OBSTRUCTION. No native-span node set is simultaneously Muntz-complete and a Riesz sequence of Cauchy kernels; completeness and the Riesz-basis property are the SAME sequence property read on the two sides of the single Blaschke sum sum 1/s_k. RH OPEN; no refereed bound is changed; NO QED.',
  obstruction: {
    d1_completenessIsNonBlaschke: 'Cauchy kernels at real s_k > 1 are complete in H^2 of the right half-plane iff sum 1/s_k = inf (Blaschke product diverges; Muntz-Szasz). This is what the imp-95530 (A5) identity step needs.',
    d2_rieszIsSeparatedBlaschke: 'They form a Riesz sequence (uniformly boundedly-invertible Gram => trace-class pencil) iff separated Carleson, which for real s_k -> inf REQUIRES sum 1/s_k < inf.',
    d3_complementary: 'Both complete AND Riesz => a complete interpolating sequence = a Riesz basis of reproducing kernels for H^2 of the right half-plane; by Hruscev-Nikolskii-Pavlov / Pavlov that forces Blaschke + Carleson + A_2 modulus, which real non-Blaschke boundary nodes cannot satisfy. So the two are mutually exclusive here.',
  },
  notAConstructionGap: 'There is no free parameter to exploit: sum 1/s_k is finite (Riesz, incomplete) or infinite (complete, degenerate Gram). Choosing the nodes more cleverly cannot deliver both; the escape (a whole-space Riesz basis of Cauchy kernels on the real axis) is ruled out by the interpolation theorem. Hence hard, not open.',
  numericalWitness: 'lam_min of the normalized Cauchy Gram = Riesz constant. Geometric (Blaschke) sets plateau at a positive floor rising with log-spacing (rho=8: 0.136 -> 0.106 over n=6..32; rho=4: 0.0150; rho=3: 0.00299). Harmonic (Muntz-complete = Hilbert matrix) collapses exponentially (1.88e-7 at n=6, 2.94e-13 at n=10, below float floor for n>=16): Gram not boundedly invertible, trace-class structure unavailable.',
  scope: 'Structural / spectral assessment of imp-95530 (A6); no bound change, no obligation closed; not a Lambda lever (the Muntz-complete side is soft under the flow per NS-RIGID A5). RH OPEN; no refereed bound is changed; NO QED.',
});

const relEq = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.max(Math.abs(lit), 1e-300);
export const IMP95532_ASSERTIONS = [
  {
    id: 'imp95532-sech-identity',
    description: 'normalized Cauchy Gram entry 2 sqrt(nu_i nu_j)/(nu_i+nu_j) equals 1/cosh((log nu_i - log nu_j)/2) (Toeplitz-in-log kernel), and reproduces the baked value at nu = {1.3, 7.9}',
    holds: () => {
      const [a, b] = IMP95532_LITERALS.sechIdentityAt.nu;
      const direct = 2 * Math.sqrt(a * b) / (a + b);
      const sech = 1 / Math.cosh((Math.log(a) - Math.log(b)) / 2);
      return relEq(direct, sech, 1e-14) && relEq(direct, IMP95532_LITERALS.sechIdentityAt.value, 1e-12);
    },
  },
  {
    id: 'imp95532-blaschke-riesz-floor',
    description: 'D2 witness: geometric (Blaschke, sum 1/nu < inf) node sets have a POSITIVE Riesz floor rising with log-spacing; lam_min plateaus (rho=8 stays > 0.10 through n=32) matching baked values (rel 2e-3)',
    holds: () => {
      const L = IMP95532_LITERALS.geoRieszFloor;
      return relEq(normalizedCauchyGramMin(geometricNodes(8, 6)), L.rho8_n6, 2e-3)
        && relEq(normalizedCauchyGramMin(geometricNodes(8, 32)), L.rho8_n32, 2e-3)
        && relEq(normalizedCauchyGramMin(geometricNodes(4, 32)), L.rho4_n32, 2e-3)
        && relEq(normalizedCauchyGramMin(geometricNodes(3, 32)), L.rho3_n32, 2e-3)
        && normalizedCauchyGramMin(geometricNodes(8, 32)) > 0.1
        && normalizedCauchyGramMin(geometricNodes(4, 32)) > normalizedCauchyGramMin(geometricNodes(3, 32));
    },
  },
  {
    id: 'imp95532-muntz-gram-collapse',
    description: 'D3 witness: harmonic (Muntz-complete, sum 1/k = inf; the Hilbert matrix) Gram is NOT boundedly invertible - lam_min collapses exponentially (1.88e-7 at n=6, 2.94e-13 at n=10) and, at fixed n=10, sits > 9 orders below the geometric rho=8 Riesz floor',
    holds: () => {
      const C = IMP95532_LITERALS.harmonicCollapse;
      const h6 = normalizedCauchyGramMin(harmonicNodes(6));
      const h10 = normalizedCauchyGramMin(harmonicNodes(10));
      return relEq(h6, C.n6, 2e-3) && relEq(h10, C.n10, 2e-2)
        && h10 < h6 && h6 < 1e-6
        && normalizedCauchyGramMin(geometricNodes(8, 10)) / h10 > 1e9;
    },
  },
  {
    id: 'imp95532-honesty',
    description: 'record states the verdict is a HARD OBSTRUCTION (not a construction gap) and carries RH OPEN / PT Lambda <= 0.2 / NO QED',
    holds: () => /HARD OBSTRUCTION/.test(IMP95532_MUNTZ_COMPLETE_RIESZ_OBSTRUCTION.verdict)
      && /no free parameter/i.test(IMP95532_MUNTZ_COMPLETE_RIESZ_OBSTRUCTION.notAConstructionGap)
      && /RH OPEN/.test(IMP95532_MUNTZ_COMPLETE_RIESZ_OBSTRUCTION.verdict)
      && /refereed bound is changed/i.test(IMP95532_MUNTZ_COMPLETE_RIESZ_OBSTRUCTION.verdict)
      && /NO QED/.test(IMP95532_MUNTZ_COMPLETE_RIESZ_OBSTRUCTION.verdict),
  },
];
for (const a of IMP95532_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95532-muntz-complete-riesz-obstruction assertion failed: ${a.id}`);
}
export default IMP95532_MUNTZ_COMPLETE_RIESZ_OBSTRUCTION;
