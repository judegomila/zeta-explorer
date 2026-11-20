// Exact integer checks of the finite natural-amplitude array bound.
export function verifyCapacity() {
// Node.js / JavaScript. No packages. All comparisons certifying the bound use integers.
const X = 1000000, mark = new Uint8Array(X + 1), bins = new Int32Array(1001);
let count = 0;
for (let p = 2; p <= X; p++) if (!mark[p]) {
  if (p * p <= X) for (let j = p * p; j <= X; j += p) mark[j] = 1;
  for (let n = p; n <= X; n *= p) {
    const k = Math.floor(Math.sqrt(n));
    // These exact integer checks validate the only floating-point square root.
    if (!(k * k <= n && n < (k + 1) * (k + 1))) throw Error("sqrt enclosure");
    bins[k]++;
    count++;
  }
}
const M = 1000000n;
let S = 0n;
for (let k = 1; k <= 1000; k++) {
  S += BigInt(bins[k]) * ((M + BigInt(k) - 1n) / BigInt(k));
}
if (count !== 78734 || S !== 182590132n) throw Error("enumeration mismatch");
if (!(27n ** 14n > 1000000n * 10n ** 14n)) throw Error("log bound");
if (!(1001n * (500000n - 441n) > 1000n * 500000n)) throw Error("cosh bound");
const numerator = 9n * (1000n * M + 14n * 196n * 1001n * S);
const denominator = 1000000n * 14n * 1000n * M;
if (!(3n * numerator < denominator)) throw Error("capacity exceeds one third");
return ({
  count, S: String(S), numerator: String(numerator), denominator: String(denominator),
  strictUpperBound: "1/3"
});
}

