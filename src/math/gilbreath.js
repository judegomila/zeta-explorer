/**
 * Gilbreath's conjecture — the rigorous skeleton.
 *
 * Conjecture (Proth 1878, Gilbreath 1958): start from the primes, repeatedly
 * take absolute differences of consecutive terms; the leading entry of every
 * derived row equals 1.
 *
 * This module separates the part that is *provable* from the part that is
 * *open*, so the explorer can display each honestly. Nothing here assumes the
 * conjecture; every function computes exact integer arithmetic.
 *
 *   Lemma A (parity invariant — UNCONDITIONAL).
 *     Row 1 is the gap sequence (1, 2, 2, 4, 2, 4, …): the first gap is odd,
 *     every later gap is even. Mod 2 that is the unit vector (1,0,0,…), and
 *     since |a−b| ≡ a+b (mod 2) the difference operator acts as XOR, so
 *       a_k[0] ≡ Σ_j C(k−1,j) a_1[j] ≡ C(k−1,0)·1 = 1 (mod 2)  ∀k≥1.
 *     Hence a_k[0] is ALWAYS odd: a_k[0] ∈ {1,3,5,…}.
 *
 *   Lemma B (propagation fixed point — ELEMENTARY).
 *     If a row has the form  1, e_1, e_2, …  with every e_i ∈ {0,2}, then the
 *     next row is |e_1−1|, |e_2−e_1|, … = 1, (0|2), (0|2), …  again, because
 *     |0−1| = |2−1| = 1 and the difference of two elements of {0,2} stays in
 *     {0,2}. The form is self-perpetuating with NO run-length hypothesis.
 *
 *   Lemma C (finite-window determinacy — ELEMENTARY).
 *     a_k[i] depends only on the window a_0[i..i+k]; in particular a_k[0]
 *     depends only on p_1,…,p_{k+1}. So every leading entry we compute from N
 *     primes is an exact theorem, not a conjecture, for k ≤ N−1.
 *
 *   Window-lock corollary (B + C — RIGOROUS).
 *     If some row r exhibits a "clean prefix" 1 followed by W entries all in
 *     {0,2}, then a_k[0] = 1 for every r ≤ k ≤ r+W, by determinacy on the
 *     prefix plus propagation — purely structurally, with no further arithmetic.
 *
 *   Reduction (what remains OPEN).
 *     Combining A (always odd) with "bounded by 2" forces the leading entry to
 *     equal 1. So Gilbreath ⟺ the leading entry never reaches 3 ⟺ some finite
 *     row has its ENTIRE infinite tail in {0,2}. Because prime gaps are
 *     unbounded (Cramér ~ (log x)^2), arbitrarily large values are injected
 *     arbitrarily deep, so no finite computation certifies the infinite tail.
 *     That uniform-contraction statement is the irreducible open core.
 */

// Iterated absolute-difference triangle. rows[0] is the input sequence;
// rows[k][i] = |rows[k-1][i+1] - rows[k-1][i]|.
export function buildTriangle(seq) {
  const rows = [seq.slice()];
  let cur = rows[0];
  while (cur.length > 1) {
    const next = new Array(cur.length - 1);
    for (let i = 0; i < cur.length - 1; i++) next[i] = Math.abs(cur[i + 1] - cur[i]);
    rows.push(next);
    cur = next;
  }
  return rows;
}

// Leading entries a_k[0] for derived rows k = 1,2,…
export function leadingEntries(rows) {
  return rows.slice(1).map((r) => r[0]);
}

// Lemma A made checkable: every derived leading entry is odd. (Always true.)
export function allLeadingOdd(rows) {
  return leadingEntries(rows).every((v) => (v & 1) === 1);
}

// A row is "clean" iff it has the propagation form 1,(0|2)* over the length
// considered. cols caps how many entries past the lead we require (default:
// the whole available row).
export function isCleanRow(row, cols = Infinity) {
  if (row.length === 0 || row[0] !== 1) return false;
  const end = Math.min(row.length, 1 + cols);
  for (let i = 1; i < end; i++) if (row[i] !== 0 && row[i] !== 2) return false;
  return true;
}

// The mod-2 triangle (Lemma A made visible). Below row 1 this is the binary
// difference (XOR) triangle of the unit vector, whose leading column is all 1s.
export function mod2Triangle(rows) {
  return rows.map((r) => r.map((v) => v & 1));
}

/**
 * Rigorous lock certificate for a FINITE triangle — no appeal to the conjecture.
 *
 * Returns:
 *   verifiedThrough   — largest k with a_k[0] computed exactly here (= rows-1).
 *   allLeadingOne     — did every computed leading entry equal 1 (Gilbreath holds
 *                       on the computed range; each is an exact theorem).
 *   leadingAllOdd     — Lemma A sanity check (always true).
 *   firstCleanRow     — smallest r≥1 whose FULL available row is 1,(0|2)*; the
 *                       contraction has completed there for this triangle.
 *   lockLength        — number of {0,2} entries after the lead in that row.
 *   guaranteedThrough — rows the window-lock corollary pins structurally
 *                       (= firstCleanRow + lockLength), independent of the
 *                       direct computation.
 *   firstViolation    — first k (if any) where a_k[0] ≠ 1 (would refute it).
 */
export function lockCertificate(rows) {
  const lead = leadingEntries(rows);
  let firstViolation = null;
  for (let k = 0; k < lead.length; k++) {
    if (lead[k] !== 1) { firstViolation = k + 1; break; }
  }
  let firstCleanRow = null;
  let lockLength = 0;
  for (let r = 1; r < rows.length; r++) {
    if (rows[r].length >= 1 && isCleanRow(rows[r])) {
      firstCleanRow = r;
      lockLength = rows[r].length - 1;
      break;
    }
  }
  return {
    verifiedThrough: rows.length - 1,
    allLeadingOne: firstViolation === null,
    leadingAllOdd: lead.every((v) => (v & 1) === 1),
    firstCleanRow,
    lockLength,
    guaranteedThrough: firstCleanRow === null ? null : firstCleanRow + lockLength,
    firstViolation,
  };
}
