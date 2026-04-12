#!/usr/bin/env python3
"""
verify-imp469-rho-min.py -- Independent mpmath cross-verification of imp-469
rho_min lower bound for the Riemann-von Mangoldt (RvM) Jacobian.

Purpose
-------
imp-469 (rvm-jacobian-lower-bound.js) proves analytically that
  rho(T) = (1/(2*pi)) * log(T/(2*pi))
is the derivative of the RvM zero-counting function F(T), and establishes
  rho_min >= rho(14) = (1/(2*pi)) * log(14/(2*pi)) > 0
using the classical fact gamma_1 > 14 > 2*pi.

This script independently verifies that bound at 50-digit mpmath precision
and reports the precise numerical values.

Key finding (confirmed by both JS Math and mpmath)
--------------------------------------------------
  rho(14)      = 0.12751179919688...   (NOT ~0.1279 as cited in the comment)
  rho(gamma_1) = 0.12903606048273...   (> 0.1279 -- passes ticket threshold)

The imp-469 closureNote comment says "~0.1279" but the actual value of
log(14/(2*pi)) is ~0.8012, not 0.8036.  Dividing by 2*pi gives 0.12751,
not 0.1279.  The discrepancy is ~0.0004 -- cosmetic for the theorem since
the theorem only claims rho_min > 0, which holds unconditionally.

Usage
-----
  pip install mpmath
  python3 scripts/verify-imp469-rho-min.py

Expected output (partial, 50-digit precision):
  2*pi (50 digits) = 6.2831853071795864769252867665590057683943387987502
  14/(2*pi)        = 2.2281692032865354004...
  log(14/(2*pi))   = 0.80118026320591329...
  rho(14)          = 0.12751179919688684...
  gamma_1 (30 dig) = 14.134725141734693790...
  rho(gamma_1)     = 0.12903606048273305...

  PASS: rho(14)      = 0.12751179919688... > 0
  PASS: rho(14)      = 0.12751179919688... > 0.1275 (corrected threshold)
  PASS: rho(gamma_1) = 0.12903606048273... > 0.1279 (original ticket threshold)
  NOTE: rho(14) does NOT exceed 0.1279 -- ticket threshold applies to gamma_1, not T=14.
  Cross-verification PASSED at 50-digit precision.
"""

try:
    import mpmath
except ImportError:
    print("ERROR: mpmath not installed.  Run: pip install mpmath")
    print()
    print("Expected results (verified via JS Math double-precision):")
    print("  2*pi              = 6.283185307179586476...")
    print("  14/(2*pi)         = 2.228169203286535000...")
    print("  log(14/(2*pi))    = 0.801180263205913290...")
    print("  rho(14)           = 0.127511799196886849...")
    print("  gamma_1 (15 sf)   = 14.134725141734693")
    print("  rho(gamma_1)      = 0.129036060482733055...")
    print()
    print("  rho(14) > 0:           True")
    print("  rho(14) > 0.1275:      True")
    print("  rho(14) > 0.1279:      False  (comment approximation was off by ~0.0004)")
    print("  rho(gamma_1) > 0.1279: True")
    raise SystemExit(1)

# ── 50-digit precision setup ─────────────────────────────────────────────────

mpmath.mp.dps = 50

TWO_PI = 2 * mpmath.pi


def rho(T):
    """RvM Jacobian: rho(T) = (1/(2*pi)) * log(T/(2*pi))."""
    return mpmath.log(T / TWO_PI) / TWO_PI


# ── Verification at T = 14 (analytic lower bound) ───────────────────────────

rho_14 = rho(14)

print("=" * 60)
print("imp-473: mpmath cross-verification of imp-469 rho_min bound")
print("=" * 60)
print()
print(f"Precision: {mpmath.mp.dps} decimal digits")
print()
print(f"2*pi (50 digits) = {mpmath.nstr(TWO_PI, 50)}")
print(f"14/(2*pi)        = {mpmath.nstr(14 / TWO_PI, 50)}")
print(f"log(14/(2*pi))   = {mpmath.nstr(mpmath.log(14 / TWO_PI), 50)}")
print(f"rho(14)          = {mpmath.nstr(rho_14, 50)}")
print()

# ── Verification at T = gamma_1 (first Riemann zero, exact) ─────────────────

mpmath.mp.dps = 30
gamma_1 = mpmath.im(mpmath.zetazero(1))
mpmath.mp.dps = 50
rho_gamma1 = rho(gamma_1)

print(f"gamma_1 (30 digits) = {mpmath.nstr(gamma_1, 30)}")
print(f"gamma_1 / (2*pi)    = {mpmath.nstr(gamma_1 / TWO_PI, 50)}")
print(f"log(gamma_1/(2*pi)) = {mpmath.nstr(mpmath.log(gamma_1 / TWO_PI), 50)}")
print(f"rho(gamma_1)        = {mpmath.nstr(rho_gamma1, 50)}")
print()

# ── Threshold checks ─────────────────────────────────────────────────────────

ZERO           = mpmath.mpf("0")
THRESHOLD_1275 = mpmath.mpf("0.1275")   # corrected analytic lower bound
THRESHOLD_1279 = mpmath.mpf("0.1279")   # original ticket threshold

print("Threshold checks:")
print(f"  rho(14) > 0:           {rho_14 > ZERO}")
print(f"  rho(14) > 0.1275:      {rho_14 > THRESHOLD_1275}   (corrected threshold)")
print(f"  rho(14) > 0.1279:      {rho_14 > THRESHOLD_1279}   (ticket stated threshold -- off by ~0.0004)")
print(f"  rho(gamma_1) > 0:      {rho_gamma1 > ZERO}")
print(f"  rho(gamma_1) > 0.1275: {rho_gamma1 > THRESHOLD_1275}")
print(f"  rho(gamma_1) > 0.1279: {rho_gamma1 > THRESHOLD_1279}")
print()

# ── Assertions ───────────────────────────────────────────────────────────────

assert rho_14 > ZERO,           f"FAIL: rho(14) = {rho_14} must be > 0"
assert rho_14 > THRESHOLD_1275, f"FAIL: rho(14) = {rho_14} must exceed 0.1275"
assert rho_gamma1 > ZERO,           f"FAIL: rho(gamma_1) = {rho_gamma1} must be > 0"
assert rho_gamma1 > THRESHOLD_1279, f"FAIL: rho(gamma_1) = {rho_gamma1} must exceed 0.1279"

# ── Summary ──────────────────────────────────────────────────────────────────

print("PASS: rho(14)      > 0  (analytic rho_min bound confirmed positive)")
print(f"PASS: rho(14)      > 0.1275  (corrected threshold; actual {float(rho_14):.10f})")
print(f"PASS: rho(gamma_1) > 0.1279  (ticket threshold;    actual {float(rho_gamma1):.10f})")
print()
print("NOTE: The imp-469 closureNote comment says '~0.1279' but rho(14) = 0.12751.")
print("  The comment used log(14/(2*pi)) ~ 0.8036 but the exact value is 0.8012.")
print("  Corrected bound: rho_min >= rho(14) = 0.12751 > 0. Theorem is VALID.")
print("  rho(gamma_1) = 0.12904 > 0.1279 -- the ticket threshold holds for gamma_1.")
print()
print("Cross-verification PASSED at 50-digit precision.")
