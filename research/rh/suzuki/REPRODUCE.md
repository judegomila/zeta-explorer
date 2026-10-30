# Reproduce the focused Suzuki module

The byte-identical producer scripts and receipts here support the three accompanying mathematical modules. The original-to-transport hashes are in `CODE_AND_RECEIPTS_MANIFEST.json`. The full 256-bit 10^7 block receipt is losslessly gzip-compressed; its original SHA-256 is checked after decompression. No block or event is omitted. Code does not read network data, prime tables, or other repositories.

## Environment and clean replay

Verified versions: Python 3.12.14, python-flint 0.9.0 (Arb), SymPy 1.14.0. Install `requirements.txt` in a Python environment if these packages are not already present. Only python-flint and the standard library are needed for the finite scalar and origin checks; SymPy supports the additional exact-algebra checkers.

```sh
python replay.py
# Optional distinct-algorithm 384-bit every-event replay at the SAME cutoff:
python replay.py --include-independent
```

Run from this directory, or invoke `replay.py` by path. A fresh temporary output directory is used unless an **empty** `--output-directory DIR` is supplied. Frozen source/receipt files are never overwritten. The launcher validates transport hashes before running. It compares every JSON field, ignoring only the coarse/direct scripts' intentionally variable `elapsed_seconds`.

The default replay checks:

1. All 665,134 prime-power events through exactly X=10,000,000 via the 256-bit block hull, preserving the predetermined floor 1/100.
2. The origin supplement at 192 and 256 bits, including whole real cells and the analytic concavity endpoint gate.
3. Prime-only memory algebra and scalar onset at 256 bits.
4. Weighted credit-variation algebra/scalar gates at 256 bits.
5. Elementary-onset freezing gates and future hull-loss scalar/algebra checks at 192 and 256 bits.

The optional independent checker uses a different integer sieve and tests every event at 384 bits, with direct log q and digamma b. Its compact historical receipt is included regardless of whether the option is run. No larger cutoff is attempted.

## Historical audit versus this clean package

The original audit independently replayed both 192- and 256-bit coarse runs and separately checked every event at 384 bits. To keep transport compact, this package includes the full 256-bit coarse receipt, the origin dual-precision receipt, and the compact independent direct receipt. The historical audit's claim about its 192-bit run is not represented as a new default package replay. The full original frozen audit tree remains mapped by the supplied source/audit provenance.

The producer scripts' SHA-256 fields remain valid because their bytes are unchanged. Source notes/reviews are curated separately; mathematical scope comes from those proofs, not from a JSON status alone. In particular:

- Psi(0)=0; its near-origin lower bound is linear, not a positive constant floor.
- Every real point through log(10^7) is covered, not just events.
- This is scalar constant-box positivity, not whole-even-form positivity.
- Future freezing and hull budgets are representation losses only; they do not bound future endpoint reserves or signed credits.
- The prime-only approximation uses a stated unconditional PNT theorem; the finite scalar event certificate does not import zero-height data.
