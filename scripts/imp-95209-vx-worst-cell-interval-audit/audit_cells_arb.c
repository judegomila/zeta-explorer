/*
 * imp-95209: directed-rounding (Arb ball) re-evaluation of the worst leaves
 * of the THEOREM VX offline cover (imp-95153 / imp-95150 runner, T = 1,
 * floor 47/200, PD2 on).
 *
 * This is a line-by-line port of makeCellV(T=1, dropA=true, dropB=false,
 * hasMu=true) + cwRatio from scripts/imp-95150-pd2-vchart-offline-cover.mjs
 * into arb ball arithmetic.  Semantics: every JS double literal is carried
 * as its exact double value; every arithmetic op becomes a real-arithmetic
 * op with a certified enclosure (arb, default 128 bits).  All the float-side
 * guard nudges (1+1e-12, +1e-8 series slack, ...) are KEPT - they only
 * inflate the caps, so certifying the nudged formula certifies the cap chain
 * a fortiori.
 *
 * Branches on ball quantities are resolved only when certain; an ambiguous
 * branch takes the UNION of both branch values (a valid enclosure of the
 * exact-real evaluation) and increments a per-cell ambiguity counter, which
 * is reported (expected 0: all inputs are exact doubles and radii are
 * ~1e-36 at 128 bits).
 *
 * Input: JSONL lines with "bound":x, "lo":[9 doubles], "hi":[9 doubles],
 * "v":[5 doubles] (the recorder output of rerun-record-worst.mjs).
 * Output per cell: floatBound, arb midpoint, arb radius, certified UPPER
 * bound of the cell certificate, certified LOWER bound of the margin
 * 1 - bound, verdict CERTIFIED-NEGATIVE / SIGN-UNCERTAIN.
 *
 * usage: audit_cells_arb <prec_bits> <input.jsonl>
 * build: cc -O2 -o audit_cells_arb audit_cells_arb.c \
 *          -I/opt/homebrew/include -L/opt/homebrew/lib -lflint -lm
 */

#include <flint/arb.h>
#include <flint/flint.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static slong WP = 128;
static long g_ambig = 0; /* per-cell ambiguity counter */

/* ---------- constants (exact doubles as in the JS runner) ---------- */
static const double RATE_FLOOR = 0.235;   /* parseFloat("0.235") */
static const double MU_CL = 0.9;          /* 9/10 */
static const double EHALF_HI = 0.60653067;
static const double TAILSLACK = 1e-19;
static const double UP12 = 1.0 + 1e-12;   /* JS constant-folds 1 + 1e-12 */
static const double DN12 = 1.0 - 1e-12;
static const double UP9 = 1.0 + 1e-9;
static const double BASE[5] = { 1, 4, 16, 64, 256 };

/* ---------- tri-state compares: 1 certain-true, 0 certain-false, -1 amb */
static int tri_le_d(const arb_t x, double c) {
  arb_t cc; arb_init(cc); arb_set_d(cc, c);
  int r = arb_le(x, cc) ? 1 : (arb_gt(x, cc) ? 0 : -1);
  arb_clear(cc); return r;
}
static int tri_ge_d(const arb_t x, double c) {
  arb_t cc; arb_init(cc); arb_set_d(cc, c);
  int r = arb_ge(x, cc) ? 1 : (arb_lt(x, cc) ? 0 : -1);
  arb_clear(cc); return r;
}
static int tri_lt_d(const arb_t x, double c) {
  arb_t cc; arb_init(cc); arb_set_d(cc, c);
  int r = arb_lt(x, cc) ? 1 : (arb_ge(x, cc) ? 0 : -1);
  arb_clear(cc); return r;
}

/* max(0, x) */
static void a_max0(arb_t r, const arb_t x) {
  arb_t z; arb_init(z); arb_zero(z);
  arb_max(r, x, z, WP);
  arb_clear(z);
}
/* r = x * (double c) */
static void a_muld(arb_t r, const arb_t x, double c) {
  arb_t cc; arb_init(cc); arb_set_d(cc, c);
  arb_mul(r, x, cc, WP);
  arb_clear(cc);
}
/* r = x + (double c) */
static void a_addd(arb_t r, const arb_t x, double c) {
  arb_t cc; arb_init(cc); arb_set_d(cc, c);
  arb_add(r, x, cc, WP);
  arb_clear(cc);
}

/* sqrtHi(w) = sqrt(max(0,w)) * (1+1e-12) */
static void sqrtHi(arb_t r, const arb_t w) {
  a_max0(r, w);
  arb_sqrt(r, r, WP);
  a_muld(r, r, UP12);
}

/* expTrunc(z, N) = sum_{n=0}^{N} (-z)^n / n! */
static void expTrunc(arb_t s, const arb_t z, int N) {
  arb_t t, nz;
  arb_init(t); arb_init(nz);
  arb_neg(nz, z);
  arb_one(s); arb_one(t);
  for (int n = 1; n <= N; n++) {
    arb_mul(t, t, nz, WP);
    arb_div_ui(t, t, (ulong) n, WP);
    arb_add(s, s, t, WP);
  }
  arb_clear(t); arb_clear(nz);
}

/* gcap branches */
static void gcap_b12(arb_t r, const arb_t z, double slack) {
  arb_t s, zp1;
  arb_init(s); arb_init(zp1);
  expTrunc(s, z, 60);
  a_addd(s, s, slack);
  arb_one(zp1); arb_add(zp1, zp1, z, WP);
  arb_mul(r, s, zp1, WP);
  arb_clear(s); arb_clear(zp1);
}
static void gcap_b3(arb_t r, const arb_t z) {
  /* pow(EHALF_HI, floor(z)) * (1 + 1e-9); z > 15 certain here */
  arb_t e; arb_init(e); arb_set_d(e, EHALF_HI);
  arb_t fl; arb_init(fl); arb_floor(fl, z, WP);
  slong n_lo, n_hi;
  {
    arf_t lo, hi; arf_init(lo); arf_init(hi);
    arb_get_lbound_arf(lo, fl, WP);
    arb_get_ubound_arf(hi, fl, WP);
    n_lo = arf_get_si(lo, ARF_RND_FLOOR);
    n_hi = arf_get_si(hi, ARF_RND_CEIL);
    arf_clear(lo); arf_clear(hi);
  }
  if (n_lo < 0) n_lo = 0;
  if (n_hi < n_lo) n_hi = n_lo;
  arb_pow_ui(r, e, (ulong) n_lo, WP);
  if (n_hi != n_lo) {
    g_ambig++;
    arb_t r2; arb_init(r2);
    arb_pow_ui(r2, e, (ulong) n_hi, WP);
    arb_union(r, r, r2, WP);
    arb_clear(r2);
  }
  a_muld(r, r, UP9);
  arb_clear(e); arb_clear(fl);
}
static void gcap_a(arb_t r, const arb_t z) {
  int le4 = tri_le_d(z, 4.0);
  if (le4 == 1) { gcap_b12(r, z, 1e-8); return; }
  int le15 = tri_le_d(z, 15.0);
  if (le4 == 0 && le15 == 1) { gcap_b12(r, z, 1e-6); return; }
  if (le15 == 0) { gcap_b3(r, z); return; }
  /* ambiguous: union of every possibly-taken branch */
  g_ambig++;
  arb_t b1, b2, b3;
  arb_init(b1); arb_init(b2); arb_init(b3);
  gcap_b12(b1, z, 1e-8);
  gcap_b12(b2, z, 1e-6);
  arb_union(r, b1, b2, WP);
  if (le15 != 1) { gcap_b3(b3, z); arb_union(r, r, b3, WP); }
  arb_clear(b1); arb_clear(b2); arb_clear(b3);
}
static void gLo_a(arb_t r, const arb_t z) {
  int ge50 = tri_ge_d(z, 50.0);
  if (ge50 == 1) { arb_zero(r); return; }
  arb_t s, zp1;
  arb_init(s); arb_init(zp1);
  expTrunc(s, z, 59);
  a_addd(s, s, -1e-8);
  arb_one(zp1); arb_add(zp1, zp1, z, WP);
  arb_mul(r, s, zp1, WP);
  a_max0(r, r);
  if (ge50 == -1) {
    g_ambig++;
    arb_t zz; arb_init(zz); arb_zero(zz);
    arb_union(r, r, zz, WP);
    arb_clear(zz);
  }
  arb_clear(s); arb_clear(zp1);
}

/* kcSup(A[4], G) */
static void kcSup(arb_t res, arb_t A[4], const arb_t G) {
  int n = 4;
  arb_t best2, t;
  arb_init(best2); arb_init(t);
  arb_zero(best2);
  for (int i = 0; i < n; i++) {
    arb_mul(t, A[i], A[i], WP);
    arb_max(best2, best2, t, WP);
  }
  int glt1 = tri_lt_d(G, 1.0);
  if (glt1 != 0) {
    if (glt1 == -1) g_ambig++;
    arb_t d, S1, c, x, v, cs;
    arb_init(d); arb_init(S1); arb_init(c); arb_init(x); arb_init(v); arb_init(cs);
    arb_one(d); arb_sub(d, d, G, WP); /* d = 1 - G */
    for (int mask = 1; mask < (1 << n); mask++) {
      int idx[4], m = 0;
      for (int i = 0; i < n; i++) if (mask & (1 << i)) idx[m++] = i;
      if (m < 2) continue;
      arb_zero(S1);
      for (int k = 0; k < m; k++) arb_add(S1, S1, A[idx[k]], WP);
      /* c = G / (1 + (m-1) G) */
      a_muld(t, G, (double) (m - 1));
      arb_add_ui(t, t, 1, WP);
      arb_div(c, G, t, WP);
      int ok = 1, amb = 0;
      arb_zero(v);
      for (int k = 0; k < m; k++) {
        /* x = (A[i] - c*S1) / d */
        arb_mul(cs, c, S1, WP);
        arb_sub(x, A[idx[k]], cs, WP);
        arb_div(x, x, d, WP);
        int cl = tri_lt_d(x, -1e-9);
        if (cl == 1) { ok = 0; break; }
        if (cl == -1) amb = 1;
        arb_mul(t, A[idx[k]], x, WP);
        arb_add(v, v, t, WP);
      }
      if (!ok) continue;
      if (!amb) {
        arb_max(best2, best2, v, WP);
      } else {
        g_ambig++;
        arb_t withv; arb_init(withv);
        arb_max(withv, best2, v, WP);
        arb_union(best2, best2, withv, WP);
        arb_clear(withv);
      }
    }
    arb_clear(d); arb_clear(S1); arb_clear(c); arb_clear(x); arb_clear(v); arb_clear(cs);
  }
  sqrtHi(res, best2);
  a_muld(res, res, UP9);
  arb_clear(best2); arb_clear(t);
}

/* fsqAt(y, A, B, G) = (xA + yB)^2 / (1 + 2xyG), x = sqrt(max(0,1-y^2)) */
static void fsqAt(arb_t r, const arb_t y, const arb_t A, const arb_t B, const arb_t G) {
  arb_t x, N, den, t;
  arb_init(x); arb_init(N); arb_init(den); arb_init(t);
  arb_mul(t, y, y, WP);
  arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  a_max0(x, t);
  arb_sqrt(x, x, WP);
  arb_mul(N, x, A, WP);
  arb_mul(t, y, B, WP);
  arb_add(N, N, t, WP);
  arb_mul(den, x, y, WP);
  arb_mul(den, den, G, WP);
  arb_mul_2exp_si(den, den, 1);
  arb_add_ui(den, den, 1, WP);
  arb_mul(r, N, N, WP);
  arb_div(r, r, den, WP);
  arb_clear(x); arb_clear(N); arb_clear(den); arb_clear(t);
}

/* ayP: 1 certain-true, 0 certain-false, -1 ambiguous */
static int ayP(const arb_t C, const arb_t A, const arb_t B, const arb_t G,
               const arb_t ya, const arb_t yc) {
  arb_t xa2, xc2, xa, xc, q11, q22, q12, Qa, Qc, cross, t, t2, slk;
  arb_init(xa2); arb_init(xc2); arb_init(xa); arb_init(xc);
  arb_init(q11); arb_init(q22); arb_init(q12);
  arb_init(Qa); arb_init(Qc); arb_init(cross); arb_init(t); arb_init(t2); arb_init(slk);
  int ret = -1, amb = 0;

  arb_mul(t, ya, ya, WP); arb_neg(xa2, t); arb_add_ui(xa2, xa2, 1, WP);
  arb_mul(t, yc, yc, WP); arb_neg(xc2, t); arb_add_ui(xc2, xc2, 1, WP);
  arb_sqrt(xa, xa2, WP); /* JS Math.sqrt of possibly tiny negative? xa2 = 1-ya^2, ya<=1 */
  arb_sqrt(xc, xc2, WP);
  arb_mul(q11, A, A, WP); arb_sub(q11, q11, C, WP);
  arb_mul(q22, B, B, WP); arb_sub(q22, q22, C, WP);
  arb_mul(q12, A, B, WP);
  arb_mul(t, C, G, WP); arb_sub(q12, q12, t, WP);
  a_muld(slk, C, 1e-9);

  /* Qa = xa2*q11 + ya^2*q22 + 2*xa*ya*q12 + 1e-9*C */
  arb_mul(Qa, xa2, q11, WP);
  arb_mul(t, ya, ya, WP); arb_mul(t, t, q22, WP); arb_add(Qa, Qa, t, WP);
  arb_mul(t, xa, ya, WP); arb_mul(t, t, q12, WP); arb_mul_2exp_si(t, t, 1); arb_add(Qa, Qa, t, WP);
  arb_add(Qa, Qa, slk, WP);
  arb_mul(Qc, xc2, q11, WP);
  arb_mul(t, yc, yc, WP); arb_mul(t, t, q22, WP); arb_add(Qc, Qc, t, WP);
  arb_mul(t, xc, yc, WP); arb_mul(t, t, q12, WP); arb_mul_2exp_si(t, t, 1); arb_add(Qc, Qc, t, WP);
  arb_add(Qc, Qc, slk, WP);

  int qa_le = tri_le_d(Qa, 0.0), qc_le = tri_le_d(Qc, 0.0);
  if (qa_le == 0 || qc_le == 0) { ret = 0; goto done; }
  if (qa_le == -1 || qc_le == -1) amb = 1;

  /* cross = xa*xc*q11 + ya*yc*q22 + (xa*yc + xc*ya)*q12 + 1e-9*C */
  arb_mul(cross, xa, xc, WP); arb_mul(cross, cross, q11, WP);
  arb_mul(t, ya, yc, WP); arb_mul(t, t, q22, WP); arb_add(cross, cross, t, WP);
  arb_mul(t, xa, yc, WP);
  arb_mul(t2, xc, ya, WP);
  arb_add(t, t, t2, WP);
  arb_mul(t, t, q12, WP); arb_add(cross, cross, t, WP);
  arb_add(cross, cross, slk, WP);

  {
    int cle = tri_le_d(cross, 0.0);
    if (cle == 1) { ret = amb ? -1 : 1; goto done; }
    /* check cross^2 <= Qa*Qc (covers both cross-sign branches when true) */
    arb_mul(t, cross, cross, WP);
    arb_mul(t2, Qa, Qc, WP);
    if (arb_le(t, t2)) { ret = amb ? -1 : 1; goto done; }
    if (cle == 0 && arb_gt(t, t2)) { ret = amb ? -1 : 0; goto done; }
    ret = -1;
  }
done:
  arb_clear(xa2); arb_clear(xc2); arb_clear(xa); arb_clear(xc);
  arb_clear(q11); arb_clear(q22); arb_clear(q12);
  arb_clear(Qa); arb_clear(Qc); arb_clear(cross); arb_clear(t); arb_clear(t2); arb_clear(slk);
  return ret;
}

/* aySup(A, B, G, ya, yc) */
static void aySup(arb_t r, const arb_t A, const arb_t B, const arb_t G,
                  const arb_t ya, const arb_t yc) {
  arb_t C, f1, f2, Cf, Cint, t, t2, b1, b2;
  arb_init(C); arb_init(f1); arb_init(f2); arb_init(Cf); arb_init(Cint);
  arb_init(t); arb_init(t2); arb_init(b1); arb_init(b2);
  fsqAt(f1, ya, A, B, G);
  fsqAt(f2, yc, A, B, G);
  arb_max(C, f1, f2, WP);
  a_muld(C, C, UP9);
  int p = ayP(C, A, B, G, ya, yc);
  if (p != 0) sqrtHi(b1, C);
  if (p != 1) {
    arb_mul(t, A, A, WP);
    arb_mul(t2, B, B, WP);
    arb_max(Cf, t, t2, WP);
    int glt1 = tri_lt_d(G, 1.0);
    if (glt1 != 0) {
      /* Cint = (A^2 + B^2 - 2ABG) / (1 - G^2) */
      arb_add(Cint, t, t2, WP);
      arb_mul(t, A, B, WP); arb_mul(t, t, G, WP); arb_mul_2exp_si(t, t, 1);
      arb_sub(Cint, Cint, t, WP);
      arb_mul(t, G, G, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
      arb_div(Cint, Cint, t, WP);
      if (glt1 == 1) {
        arb_max(Cf, Cf, Cint, WP);
      } else {
        g_ambig++;
        arb_t w; arb_init(w);
        arb_max(w, Cf, Cint, WP);
        arb_union(Cf, Cf, w, WP);
        arb_clear(w);
      }
    }
    a_muld(Cf, Cf, UP9);
    sqrtHi(b2, Cf);
  }
  if (p == 1) arb_set(r, b1);
  else if (p == 0) arb_set(r, b2);
  else { g_ambig++; arb_union(r, b1, b2, WP); }
  arb_clear(C); arb_clear(f1); arb_clear(f2); arb_clear(Cf); arb_clear(Cint);
  arb_clear(t); arb_clear(t2); arb_clear(b1); arb_clear(b2);
}

/* mcF(G, ya, yc) */
static void mcF(arb_t r, const arb_t G, const arb_t ya, const arb_t yc) {
  arb_t s, sA, sC, t, num, den;
  arb_init(s); arb_init(sA); arb_init(sC); arb_init(t); arb_init(num); arb_init(den);
  const double YSTAR = M_SQRT1_2; /* Math.SQRT1_2 double */
  int c1 = tri_le_d(ya, YSTAR);
  int c2 = tri_ge_d(yc, YSTAR);
  /* sAt(y) = 2 y sqrt(max(0, 1-y^2)) */
#define SAT(res, y) do { \
    arb_mul(t, (y), (y), WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP); \
    a_max0(t, t); arb_sqrt(t, t, WP); \
    arb_mul((res), (y), t, WP); arb_mul_2exp_si((res), (res), 1); \
  } while (0)
  if (c1 == 1 && c2 == 1) {
    arb_one(s);
  } else if (c1 == 0 || c2 == 0) {
    SAT(sA, ya); SAT(sC, yc);
    arb_max(s, sA, sC, WP);
  } else {
    g_ambig++;
    SAT(sA, ya); SAT(sC, yc);
    arb_max(s, sA, sC, WP);
    arb_t one; arb_init(one); arb_one(one);
    arb_union(s, s, one, WP);
    arb_clear(one);
  }
#undef SAT
  arb_add_ui(num, s, 1, WP);
  arb_mul(den, s, G, WP);
  arb_add_ui(den, den, 1, WP);
  arb_div(t, num, den, WP);
  sqrtHi(r, t);
  a_muld(r, r, UP12);
  arb_clear(s); arb_clear(sA); arb_clear(sC); arb_clear(t); arb_clear(num); arb_clear(den);
}

/* pertOf(whi, r) = whi >= 0.999 ? Inf : whi*r/sqrt(1-whi^2) */
static void pertOf(arb_t res, const arb_t whi, const arb_t rr) {
  int ge = tri_ge_d(whi, 0.999);
  if (ge == 1) { arb_pos_inf(res); return; }
  arb_t t; arb_init(t);
  arb_mul(t, whi, whi, WP);
  arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  arb_sqrt(t, t, WP);
  arb_mul(res, whi, rr, WP);
  arb_div(res, res, t, WP);
  if (ge == -1) {
    g_ambig++;
    arb_t inf; arb_init(inf); arb_pos_inf(inf);
    arb_union(res, res, inf, WP);
    arb_clear(inf);
  }
  arb_clear(t);
}

/* candidate-min helper for bandMin / pairSepLB / tailSepLB:
 * best = min(best, val) if inside-certain; unchanged if outside-certain;
 * union of both if ambiguous. inside: -1 amb / 0 no / 1 yes */
static void min_if(arb_t best, const arb_t val, int inside) {
  if (inside == 0) return;
  if (inside == 1) { arb_min(best, best, val, WP); return; }
  g_ambig++;
  arb_t w; arb_init(w);
  arb_min(w, best, val, WP);
  arb_union(best, best, w, WP);
  arb_clear(w);
}
/* tri-state: mLo < b2 < mHi ? */
static int tri_inside(const arb_t b2, const arb_t mLo, const arb_t mHi) {
  int a = arb_gt(b2, mLo) ? 1 : (arb_le(b2, mLo) ? 0 : -1);
  int b = arb_lt(b2, mHi) ? 1 : (arb_ge(b2, mHi) ? 0 : -1);
  if (a == 0 || b == 0) return 0;
  if (a == 1 && b == 1) return 1;
  return -1;
}

/* ------------------------------------------------------------------ */
/* full cell matrix build: makeCellV(T=1, dropA=true, dropB=false, hasMu) */
/* lo/hi are the 9 recorded doubles.                                     */
/* ------------------------------------------------------------------ */
static void build_matrix(arb_t M[5][5], const double *dlo, const double *dhi) {
  const int T = 1;    /* bA = 0, bB = 2 */
  arb_t t, t2, t3, t4;
  arb_init(t); arb_init(t2); arb_init(t3); arb_init(t4);

#define NEWA(x) arb_t x; arb_init(x)
  NEWA(v1a); NEWA(v2a); NEWA(v3a); NEWA(v4a);
  NEWA(v1c); NEWA(v2c); NEWA(v3c); NEWA(v4c);
  NEWA(vBa); NEWA(vBc);
  NEWA(yOa); NEWA(yMa); NEWA(yIa);
  NEWA(yOc); NEWA(yMc); NEWA(yIc);
  NEWA(mLo); NEWA(mHi);

  arb_set_d(v1a, dlo[0]); arb_set_d(v2a, dlo[1]); arb_set_d(v3a, dlo[2]); arb_set_d(v4a, dlo[3]);
  arb_set_d(v1c, dhi[0]); arb_set_d(v2c, dhi[1]); arb_set_d(v3c, dhi[2]); arb_set_d(v4c, dhi[3]);
  arb_set_d(vBa, dlo[4]); arb_set_d(vBc, dhi[4]);
  arb_set_d(yOa, dlo[5]); arb_set_d(yMa, dlo[6]); arb_set_d(yIa, dlo[7]);
  arb_set_d(yOc, dhi[5]); arb_set_d(yMc, dhi[6]); arb_set_d(yIc, dhi[7]);

  arb_max(v2a, v2a, v1a, WP);
  arb_max(v3a, v3a, v2a, WP);
  arb_max(v4a, v4a, v3a, WP);
  arb_min(v3c, v3c, v4c, WP);
  arb_min(v2c, v2c, v3c, WP);
  arb_min(v1c, v1c, v2c, WP);

  arb_set_d(mLo, RATE_FLOOR);
  arb_set_d(t, dlo[8]); arb_max(mLo, mLo, t, WP);
  arb_set_d(mHi, MU_CL);
  arb_set_d(t, dhi[8]); arb_min(mHi, mHi, t, WP);
  {
    /* axBase = [4,4,4,4,16]; los/his = tightened v's + vB */
    arb_srcptr LOS[5] = { v1a, v2a, v3a, v4a, vBa };
    arb_srcptr HIS[5] = { v1c, v2c, v3c, v4c, vBc };
    const double AXB[5] = { 4, 4, 4, 4, 16 };
    for (int k = 0; k < 5; k++) {
      arb_div_ui(t, LOS[k], (ulong) (2 * AXB[k]), WP);
      arb_max(mLo, mLo, t, WP);
      arb_div_ui(t, HIS[k], (ulong) AXB[k], WP);
      arb_min(mHi, mHi, t, WP);
    }
  }

  /* G's (within-block-T kernel lower bounds) */
#define SEPV(res, hiV, loV) do { \
    arb_sub(t, (hiV), (loV), WP); a_max0(t, t); \
    arb_set_d(t2, 48.0); arb_min((res), t, t2, WP); \
  } while (0)
  NEWA(G12); NEWA(G13); NEWA(G14); NEWA(G23); NEWA(G24); NEWA(G34); NEWA(Gmin);
  SEPV(t3, v2c, v1a); gLo_a(G12, t3);
  SEPV(t3, v3c, v1a); gLo_a(G13, t3);
  SEPV(t3, v4c, v1a); gLo_a(G14, t3);
  SEPV(t3, v3c, v2a); gLo_a(G23, t3);
  SEPV(t3, v4c, v2a); gLo_a(G24, t3);
  SEPV(t3, v4c, v3a); gLo_a(G34, t3);
  arb_min(Gmin, G12, G13, WP);
  arb_min(Gmin, Gmin, G14, WP);
  arb_min(Gmin, Gmin, G23, WP);
  arb_min(Gmin, Gmin, G24, WP);
  arb_min(Gmin, Gmin, G34, WP);
#undef SEPV

  NEWA(FI); mcF(FI, G34, yIa, yIc);

  NEWA(G34hi);
  arb_sub(t, v4a, v3c, WP); a_max0(t, t);
  gcap_a(G34hi, t);
  arb_one(t2); arb_min(G34hi, G34hi, t2, WP);

  NEWA(w3Ilo); NEWA(w3Ihi);
  arb_mul(t, yIc, yIc, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  a_max0(w3Ilo, t); arb_sqrt(w3Ilo, w3Ilo, WP);
  arb_mul(t, yIa, yIa, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  sqrtHi(w3Ihi, t);

  NEWA(D34hi2); NEWA(D34lo);
  arb_mul(t, w3Ihi, yIc, WP); arb_mul(t, t, G34hi, WP);
  arb_mul_2exp_si(t, t, 1); arb_add_ui(t, t, 1, WP);
  sqrtHi(D34hi2, t);
  arb_mul(t, w3Ilo, yIa, WP); arb_mul(t, t, G34, WP);
  arb_mul_2exp_si(t, t, 1); arb_add_ui(t, t, 1, WP);
  arb_sqrt(D34lo, t, WP); a_muld(D34lo, D34lo, DN12);

  NEWA(G2E);
  arb_min(t2, G23, G24, WP);
  arb_mul(t, w3Ilo, G23, WP);
  arb_mul(t3, yIa, G24, WP);
  arb_add(t, t, t3, WP);
  arb_div(t, t, D34hi2, WP);
  a_muld(t, t, DN12);
  arb_max(G2E, t2, t, WP);

  NEWA(w2Mhi); NEWA(w2Mlo);
  arb_mul(t, yMa, yMa, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  sqrtHi(w2Mhi, t);
  arb_mul(t, yMc, yMc, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  a_max0(w2Mlo, t); arb_sqrt(w2Mlo, w2Mlo, WP);

  NEWA(n2Hi); NEWA(n2Lo); NEWA(ty2Hi); NEWA(ty2Lo);
  arb_mul(n2Hi, yMc, D34hi2, WP);
  arb_mul(n2Lo, yMa, D34lo, WP);
  arb_hypot(t, w2Mlo, n2Hi, WP);
  arb_div(ty2Hi, n2Hi, t, WP); a_muld(ty2Hi, ty2Hi, UP12);
  arb_one(t2); arb_min(ty2Hi, ty2Hi, t2, WP);
  arb_hypot(t, w2Mhi, n2Lo, WP);
  arb_div(ty2Lo, n2Lo, t, WP); a_muld(ty2Lo, ty2Lo, DN12);
  a_max0(ty2Lo, ty2Lo);

  NEWA(FM); mcF(FM, G2E, ty2Lo, ty2Hi);

  NEWA(w3lo); NEWA(w3hi); NEWA(w4lo); NEWA(w4hi);
  arb_mul(w3lo, yMa, w3Ilo, WP);
  arb_mul(w3hi, yMc, w3Ihi, WP);
  arb_mul(w4lo, yMa, yIa, WP);
  arb_mul(w4hi, yMc, yIc, WP);

  NEWA(G23hi); NEWA(G24hi);
  arb_sub(t, v3a, v2c, WP); a_max0(t, t);
  gcap_a(G23hi, t); arb_one(t2); arb_min(G23hi, G23hi, t2, WP);
  arb_sub(t, v4a, v2c, WP); a_max0(t, t);
  gcap_a(G24hi, t); arb_min(G24hi, G24hi, t2, WP);

  NEWA(D234hi); NEWA(D234lo);
  arb_mul(t, w2Mhi, w3hi, WP); arb_mul(t, t, G23hi, WP);
  arb_mul(t3, w2Mhi, w4hi, WP); arb_mul(t3, t3, G24hi, WP); arb_add(t, t, t3, WP);
  arb_mul(t3, w3hi, w4hi, WP); arb_mul(t3, t3, G34hi, WP); arb_add(t, t, t3, WP);
  arb_mul_2exp_si(t, t, 1); arb_add_ui(t, t, 1, WP);
  sqrtHi(D234hi, t);
  arb_mul(t, w2Mlo, w3lo, WP); arb_mul(t, t, G23, WP);
  arb_mul(t3, w2Mlo, w4lo, WP); arb_mul(t3, t3, G24, WP); arb_add(t, t, t3, WP);
  arb_mul(t3, w3lo, w4lo, WP); arb_mul(t3, t3, G34, WP); arb_add(t, t, t3, WP);
  arb_mul_2exp_si(t, t, 1); arb_add_ui(t, t, 1, WP);
  arb_sqrt(D234lo, t, WP); a_muld(D234lo, D234lo, DN12);

  NEWA(G1E);
  arb_min(t2, G12, G13, WP); arb_min(t2, t2, G14, WP);
  arb_mul(t, w2Mlo, G12, WP);
  arb_mul(t3, w3lo, G13, WP); arb_add(t, t, t3, WP);
  arb_mul(t3, w4lo, G14, WP); arb_add(t, t, t3, WP);
  arb_div(t, t, D234hi, WP); a_muld(t, t, DN12);
  arb_max(G1E, t2, t, WP);

  NEWA(w1hi); NEWA(w1lo);
  arb_mul(t, yOa, yOa, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  sqrtHi(w1hi, t);
  arb_mul(t, yOc, yOc, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  a_max0(w1lo, t); arb_sqrt(w1lo, w1lo, WP);

  NEWA(n3Hi); NEWA(n3Lo); NEWA(ty3Hi); NEWA(ty3Lo);
  arb_mul(n3Hi, yOc, D234hi, WP);
  arb_mul(n3Lo, yOa, D234lo, WP);
  arb_hypot(t, w1lo, n3Hi, WP);
  arb_div(ty3Hi, n3Hi, t, WP); a_muld(ty3Hi, ty3Hi, UP12);
  arb_one(t2); arb_min(ty3Hi, ty3Hi, t2, WP);
  arb_hypot(t, w1hi, n3Lo, WP);
  arb_div(ty3Lo, n3Lo, t, WP); a_muld(ty3Lo, ty3Lo, DN12);
  a_max0(ty3Lo, ty3Lo);

  NEWA(FO); mcF(FO, G1E, ty3Lo, ty3Hi);

  NEWA(w2hi4); NEWA(w3hi4);
  arb_mul(t, yMa, yMa, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  sqrtHi(t2, t);
  arb_mul(w2hi4, yOc, t2, WP);
  arb_one(t2); arb_min(w2hi4, w2hi4, t2, WP);
  arb_mul(t, yIa, yIa, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  sqrtHi(t3, t);
  arb_mul(w3hi4, yOc, yMc, WP); arb_mul(w3hi4, w3hi4, t3, WP);
  arb_min(w3hi4, w3hi4, t2, WP);

  NEWA(g34Hi); NEWA(g34Lo); NEWA(tD2Hi); NEWA(tD2Lo);
  arb_mul(g34Hi, yOc, yMc, WP); arb_mul(g34Hi, g34Hi, D34hi2, WP);
  arb_mul(g34Lo, yOa, yMa, WP); arb_mul(g34Lo, g34Lo, D34lo, WP);
  arb_hypot(t, w1lo, g34Hi, WP);
  arb_div(tD2Hi, g34Hi, t, WP); a_muld(tD2Hi, tD2Hi, UP12);
  arb_one(t2); arb_min(tD2Hi, tD2Hi, t2, WP);
  arb_hypot(t, w1hi, g34Lo, WP);
  arb_div(tD2Lo, g34Lo, t, WP); a_muld(tD2Lo, tD2Lo, DN12);
  a_max0(tD2Lo, tD2Lo);

  NEWA(G1E34);
  arb_min(t2, G13, G14, WP);
  arb_mul(t, w3Ilo, G13, WP);
  arb_mul(t3, yIa, G14, WP); arb_add(t, t, t3, WP);
  arb_div(t, t, D34hi2, WP); a_muld(t, t, DN12);
  arb_max(G1E34, t2, t, WP);

  NEWA(FD2); mcF(FD2, G1E34, tD2Lo, tD2Hi);

  NEWA(r24Hi); NEWA(r24Lo); NEWA(y24Hi); NEWA(y24Lo);
  arb_mul(t, yMc, yMc, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  a_max0(t, t); arb_sqrt(t, t, WP);
  arb_set_d(t2, 1e-300); arb_max(t, t, t2, WP);
  arb_mul(r24Hi, yMc, yIc, WP); arb_div(r24Hi, r24Hi, t, WP);
  arb_mul(t, yMa, yMa, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  sqrtHi(t, t);
  arb_max(t, t, t2, WP);
  arb_mul(r24Lo, yMa, yIa, WP); arb_div(r24Lo, r24Lo, t, WP);
  arb_one(t3);
  arb_hypot(t, t3, r24Hi, WP);
  arb_div(y24Hi, r24Hi, t, WP); a_muld(y24Hi, y24Hi, UP12);
  arb_min(y24Hi, y24Hi, t3, WP);
  arb_hypot(t, t3, r24Lo, WP);
  arb_div(y24Lo, r24Lo, t, WP); a_muld(y24Lo, y24Lo, DN12);
  a_max0(y24Lo, y24Lo);

  NEWA(F24); mcF(F24, G24, y24Lo, y24Hi);

  NEWA(w2I24lo); NEWA(w2I24hi);
  arb_mul(t, y24Hi, y24Hi, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  a_max0(w2I24lo, t); arb_sqrt(w2I24lo, w2I24lo, WP);
  arb_mul(t, y24Lo, y24Lo, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  sqrtHi(w2I24hi, t);

  NEWA(G24capHi);
  arb_sub(t, v4a, v2c, WP); a_max0(t, t);
  gcap_a(G24capHi, t);
  arb_one(t2); arb_min(G24capHi, G24capHi, t2, WP);

  NEWA(D24hi); NEWA(D24lo);
  arb_mul(t, w2I24hi, y24Hi, WP); arb_mul(t, t, G24capHi, WP);
  arb_mul_2exp_si(t, t, 1); arb_add_ui(t, t, 1, WP);
  sqrtHi(D24hi, t);
  arb_mul(t, w2I24lo, y24Lo, WP); arb_mul(t, t, G24, WP);
  arb_mul_2exp_si(t, t, 1); arb_add_ui(t, t, 1, WP);
  arb_sqrt(D24lo, t, WP); a_muld(D24lo, D24lo, DN12);

  NEWA(g24Hi); NEWA(g24Lo); NEWA(tD3Hi); NEWA(tD3Lo);
  /* g24Hi = yOc * sqrtHi(1 - yMa^2 (1 - yIc^2)) * D24hi */
  arb_mul(t, yIc, yIc, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  arb_mul(t, t, yMa, WP); arb_mul(t, t, yMa, WP);
  arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  sqrtHi(t, t);
  arb_mul(g24Hi, yOc, t, WP); arb_mul(g24Hi, g24Hi, D24hi, WP);
  /* g24Lo = yOa * sqrt(max(0, 1 - yMc^2 (1 - yIa^2))) * D24lo */
  arb_mul(t, yIa, yIa, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  arb_mul(t, t, yMc, WP); arb_mul(t, t, yMc, WP);
  arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  a_max0(t, t); arb_sqrt(t, t, WP);
  arb_mul(g24Lo, yOa, t, WP); arb_mul(g24Lo, g24Lo, D24lo, WP);
  arb_hypot(t, w1lo, g24Hi, WP);
  arb_div(tD3Hi, g24Hi, t, WP); a_muld(tD3Hi, tD3Hi, UP12);
  arb_one(t2); arb_min(tD3Hi, tD3Hi, t2, WP);
  arb_hypot(t, w1hi, g24Lo, WP);
  arb_div(tD3Lo, g24Lo, t, WP); a_muld(tD3Lo, tD3Lo, DN12);
  a_max0(tD3Lo, tD3Lo);

  NEWA(G1E24);
  arb_min(t2, G12, G14, WP);
  arb_mul(t, w2I24lo, G12, WP);
  arb_mul(t3, y24Lo, G14, WP); arb_add(t, t, t3, WP);
  arb_div(t, t, D24hi, WP); a_muld(t, t, DN12);
  arb_max(G1E24, t2, t, WP);

  NEWA(FD3); mcF(FD3, G1E24, tD3Lo, tD3Hi);

  NEWA(w4hi4); NEWA(w4lo4); NEWA(y14Hi); NEWA(y14Lo);
  arb_mul(w4hi4, yOc, yMc, WP); arb_mul(w4hi4, w4hi4, yIc, WP);
  arb_mul(w4lo4, yOa, yMa, WP); arb_mul(w4lo4, w4lo4, yIa, WP);
  arb_hypot(t, w1lo, w4hi4, WP);
  arb_div(y14Hi, w4hi4, t, WP); a_muld(y14Hi, y14Hi, UP12);
  arb_one(t2); arb_min(y14Hi, y14Hi, t2, WP);
  arb_hypot(t, w1hi, w4lo4, WP);
  arb_div(y14Lo, w4lo4, t, WP); a_muld(y14Lo, y14Lo, DN12);
  a_max0(y14Lo, y14Lo);

  NEWA(F14); mcF(F14, G14, y14Lo, y14Hi);

  NEWA(s2lo); NEWA(w3phi);
  arb_mul(t, w2hi4, w2hi4, WP); arb_neg(t, t); arb_add_ui(t, t, 1, WP);
  a_max0(t, t); arb_sqrt(t, t, WP);
  arb_max(s2lo, w1lo, t, WP);
  arb_set_d(t2, 1e-300); arb_max(t, s2lo, t2, WP);
  arb_div(w3phi, w3hi4, t, WP);
  arb_one(t2); arb_min(w3phi, w3phi, t2, WP);

  NEWA(w1loQ); NEWA(w2loQ); NEWA(w3loQ); NEWA(w4loQ);
  arb_set(w1loQ, w1lo);
  arb_mul(w2loQ, yOa, w2Mlo, WP);
  arb_mul(w3loQ, yOa, yMa, WP); arb_mul(w3loQ, w3loQ, w3Ilo, WP);
  arb_mul(w4loQ, yOa, yMa, WP); arb_mul(w4loQ, w4loQ, yIa, WP);

  NEWA(D4lo);
  arb_mul(t, w1loQ, w2loQ, WP); arb_mul(t, t, G12, WP);
  arb_mul(t3, w1loQ, w3loQ, WP); arb_mul(t3, t3, G13, WP); arb_add(t, t, t3, WP);
  arb_mul(t3, w1loQ, w4loQ, WP); arb_mul(t3, t3, G14, WP); arb_add(t, t, t3, WP);
  arb_mul(t3, w2loQ, w3loQ, WP); arb_mul(t3, t3, G23, WP); arb_add(t, t, t3, WP);
  arb_mul(t3, w2loQ, w4loQ, WP); arb_mul(t3, t3, G24, WP); arb_add(t, t, t3, WP);
  arb_mul(t3, w3loQ, w4loQ, WP); arb_mul(t3, t3, G34, WP); arb_add(t, t, t3, WP);
  arb_mul_2exp_si(t, t, 1); arb_add_ui(t, t, 1, WP);
  arb_sqrt(D4lo, t, WP); a_muld(D4lo, D4lo, DN12);

  /* PD2 floors (USE_PD2 = true in the production run) */
  NEWA(D2pLo); NEWA(D3pLo); NEWA(D23pLo);
  arb_mul(t, w1loQ, w3loQ, WP); arb_mul(t, t, G13, WP);
  arb_mul(t3, w1loQ, w4loQ, WP); arb_mul(t3, t3, G14, WP); arb_add(t, t, t3, WP);
  arb_mul(t3, w3loQ, w4loQ, WP); arb_mul(t3, t3, G34, WP); arb_add(t, t, t3, WP);
  arb_mul_2exp_si(t, t, 1); arb_add_ui(t, t, 1, WP);
  arb_sqrt(D2pLo, t, WP); a_muld(D2pLo, D2pLo, DN12);
  arb_mul(t, w1loQ, w2loQ, WP); arb_mul(t, t, G12, WP);
  arb_mul(t3, w1loQ, w4loQ, WP); arb_mul(t3, t3, G14, WP); arb_add(t, t, t3, WP);
  arb_mul(t3, w2loQ, w4loQ, WP); arb_mul(t3, t3, G24, WP); arb_add(t, t, t3, WP);
  arb_mul_2exp_si(t, t, 1); arb_add_ui(t, t, 1, WP);
  arb_sqrt(D3pLo, t, WP); a_muld(D3pLo, D3pLo, DN12);
  arb_mul(t, w1loQ, w4loQ, WP); arb_mul(t, t, G14, WP);
  arb_mul_2exp_si(t, t, 1); arb_add_ui(t, t, 1, WP);
  arb_sqrt(D23pLo, t, WP); a_muld(D23pLo, D23pLo, DN12);

  NEWA(w4hi4c);
  arb_mul(w4hi4c, yOc, yMc, WP); arb_mul(w4hi4c, w4hi4c, yIc, WP);

  arb_srcptr VLO[4] = { v1a, v2a, v3a, v4a };
  arb_srcptr VHI[4] = { v1c, v2c, v3c, v4c };

  /* ---------------- bondQ(caps[4]) closure ---------------- */
#define BONDQ(res, caps) do { \
    arb_t rI_, rM_, full_, kc_, pert2_, pert3_, pert3p_, capD2_, rI24_, capD3_, capP23_, capQC_, u_, u2_, u3_; \
    arb_init(rI_); arb_init(rM_); arb_init(full_); arb_init(kc_); \
    arb_init(pert2_); arb_init(pert3_); arb_init(pert3p_); \
    arb_init(capD2_); arb_init(rI24_); arb_init(capD3_); arb_init(capP23_); arb_init(capQC_); \
    arb_init(u_); arb_init(u2_); arb_init(u3_); \
    /* rI = min(aySup(r3,r4,G34,yIa,yIc), FI*max(r3,r4)) */ \
    aySup(u_, caps[2], caps[3], G34, yIa, yIc); \
    arb_max(u2_, caps[2], caps[3], WP); arb_mul(u2_, FI, u2_, WP); \
    arb_min(rI_, u_, u2_, WP); \
    /* rM = min(aySup(r2,rI,G2E,ty2Lo,ty2Hi), FM*max(r2,rI)) */ \
    aySup(u_, caps[1], rI_, G2E, ty2Lo, ty2Hi); \
    arb_max(u2_, caps[1], rI_, WP); arb_mul(u2_, FM, u2_, WP); \
    arb_min(rM_, u_, u2_, WP); \
    /* full = min(aySup(r1,rM,G1E,ty3Lo,ty3Hi), FO*max(r1,rM), kcSup(caps,Gmin)) */ \
    aySup(u_, caps[0], rM_, G1E, ty3Lo, ty3Hi); \
    arb_max(u2_, caps[0], rM_, WP); arb_mul(u2_, FO, u2_, WP); \
    kcSup(kc_, caps, Gmin); \
    arb_min(full_, u_, u2_, WP); arb_min(full_, full_, kc_, WP); \
    /* perts */ \
    pertOf(u_, w2hi4, caps[1]); arb_div(pert2_, u_, D2pLo, WP); \
    pertOf(u_, w3hi4, caps[2]); arb_div(pert3_, u_, D3pLo, WP); \
    pertOf(u_, w3phi, caps[2]); arb_div(pert3p_, u_, D23pLo, WP); \
    /* capD2 = min(aySup(r1,rI,G1E34,tD2Lo,tD2Hi), FD2*max(r1,rI)) + pert2 */ \
    aySup(u_, caps[0], rI_, G1E34, tD2Lo, tD2Hi); \
    arb_max(u2_, caps[0], rI_, WP); arb_mul(u2_, FD2, u2_, WP); \
    arb_min(capD2_, u_, u2_, WP); arb_add(capD2_, capD2_, pert2_, WP); \
    /* rI24 = min(aySup(r2,r4,G24,y24Lo,y24Hi), F24*max(r2,r4)) */ \
    aySup(u_, caps[1], caps[3], G24, y24Lo, y24Hi); \
    arb_max(u2_, caps[1], caps[3], WP); arb_mul(u2_, F24, u2_, WP); \
    arb_min(rI24_, u_, u2_, WP); \
    /* capD3 = min(aySup(r1,rI24,G1E24,tD3Lo,tD3Hi), FD3*max(r1,rI24)) + pert3 */ \
    aySup(u_, caps[0], rI24_, G1E24, tD3Lo, tD3Hi); \
    arb_max(u2_, caps[0], rI24_, WP); arb_mul(u2_, FD3, u2_, WP); \
    arb_min(capD3_, u_, u2_, WP); arb_add(capD3_, capD3_, pert3_, WP); \
    /* capP23 = min(aySup(r1,r4,G14,y14Lo,y14Hi), F14*max(r1,r4)) + pert2 + pert3p */ \
    aySup(u_, caps[0], caps[3], G14, y14Lo, y14Hi); \
    arb_max(u2_, caps[0], caps[3], WP); arb_mul(u2_, F14, u2_, WP); \
    arb_min(capP23_, u_, u2_, WP); \
    arb_add(capP23_, capP23_, pert2_, WP); arb_add(capP23_, capP23_, pert3p_, WP); \
    /* capQC = (w1hi r1 + w2hi4 r2 + w3hi4 r3 + w4hi4c r4) / D4lo */ \
    arb_mul(capQC_, w1hi, caps[0], WP); \
    arb_mul(u_, w2hi4, caps[1], WP); arb_add(capQC_, capQC_, u_, WP); \
    arb_mul(u_, w3hi4, caps[2], WP); arb_add(capQC_, capQC_, u_, WP); \
    arb_mul(u_, w4hi4c, caps[3], WP); arb_add(capQC_, capQC_, u_, WP); \
    arb_div(capQC_, capQC_, D4lo, WP); \
    arb_min((res), full_, capD2_, WP); \
    arb_min((res), (res), capD3_, WP); \
    arb_min((res), (res), capP23_, WP); \
    arb_min((res), (res), capQC_, WP); \
    a_muld((res), (res), UP12); \
    arb_clear(rI_); arb_clear(rM_); arb_clear(full_); arb_clear(kc_); \
    arb_clear(pert2_); arb_clear(pert3_); arb_clear(pert3p_); \
    arb_clear(capD2_); arb_clear(rI24_); arb_clear(capD3_); arb_clear(capP23_); arb_clear(capQC_); \
    arb_clear(u_); arb_clear(u2_); arb_clear(u3_); \
  } while (0)

  /* ---- separation helpers (bandMin forms) ---- */
  /* sepFromDropped(bs, vLoTgt, tgtBase):
   *   bandMin(m -> max(vLoTgt, tgtBase m) - 2 BASE[bs] m, [vLoTgt/tgtBase]) */
#define F_FROMDROP(res, mm, bs_, vLoTgt, tgtBase_) do { \
    a_muld(t4, (mm), (double)(tgtBase_)); \
    arb_max(t4, t4, (vLoTgt), WP); \
    a_muld((res), (mm), 2.0 * BASE[(bs_)]); \
    arb_sub((res), t4, (res), WP); \
  } while (0)
  /* tailSepLB / pairSepLB handled inline below */

  /* matrix M: init */
  for (int i = 0; i < 5; i++)
    for (int j = 0; j < 5; j++) arb_zero(M[i][j]);

#define SETM(i, j, x) do { arb_set(M[i][j], (x)); arb_set(M[j][i], (x)); } while (0)

  NEWA(best); NEWA(cand); NEWA(bp); NEWA(sep);
  arb_t caps[4];
  for (int i = 0; i < 4; i++) arb_init(caps[i]);
  NEWA(bq);

  /* ---- (0,1): y==T, dropped[0] -> caps_i = gcap(sepFromDropped(0, vlo[i], 4)) ---- */
  for (int i = 0; i < 4; i++) {
    /* bandMin over m in {mLo, mHi} + breakpoint vlo[i]/4 if inside */
    F_FROMDROP(cand, mLo, 0, VLO[i], BASE[T]);
    arb_set(best, cand);
    F_FROMDROP(cand, mHi, 0, VLO[i], BASE[T]);
    arb_min(best, best, cand, WP);
    arb_div_ui(bp, VLO[i], (ulong) BASE[T], WP);
    {
      int ins = tri_inside(bp, mLo, mHi);
      if (ins != 0) { F_FROMDROP(cand, bp, 0, VLO[i], BASE[T]); }
      min_if(best, cand, ins);
    }
    a_max0(sep, best);
    gcap_a(caps[i], sep);
  }
  BONDQ(bq, caps);
  SETM(0, 1, bq);

  /* ---- (0,2): dropped[0], single[2] -> gcap(sepFromDropped(0, vBa, 16)) ---- */
  {
    F_FROMDROP(cand, mLo, 0, vBa, BASE[2]);
    arb_set(best, cand);
    F_FROMDROP(cand, mHi, 0, vBa, BASE[2]);
    arb_min(best, best, cand, WP);
    arb_div_ui(bp, vBa, (ulong) BASE[2], WP);
    {
      int ins = tri_inside(bp, mLo, mHi);
      if (ins != 0) { F_FROMDROP(cand, bp, 0, vBa, BASE[2]); }
      min_if(best, cand, ins);
    }
    a_max0(sep, best);
    gcap_a(t, sep);
    SETM(0, 2, t);
  }

  /* ---- (1,2): x==T, not dropped[2] ->
   *      caps_i = gcap(pairSepLB(1, 2, vhi[i], vBa)) ----
   * pairSepLB(bx=1, by=2, vxHi, vyLo):
   *   cands m in {mLo, mHi} + vyLo/By + vxHi/Bx2 (if inside)
   *   v(m) = max(m By, vyLo) - min(m Bx2, vxHi); best = min; max(0, best) */
  for (int i = 0; i < 4; i++) {
    const double By = BASE[2], Bx2 = 2 * BASE[1];
#define F_PAIR(res, mm, vxHi, vyLo) do { \
      a_muld(t4, (mm), By); arb_max(t4, t4, (vyLo), WP); \
      a_muld((res), (mm), Bx2); arb_min((res), (res), (vxHi), WP); \
      arb_sub((res), t4, (res), WP); \
    } while (0)
    F_PAIR(cand, mLo, VHI[i], vBa);
    arb_set(best, cand);
    F_PAIR(cand, mHi, VHI[i], vBa);
    arb_min(best, best, cand, WP);
    arb_div_ui(bp, vBa, (ulong) By, WP);
    {
      int ins = tri_inside(bp, mLo, mHi);
      if (ins != 0) F_PAIR(cand, bp, VHI[i], vBa);
      min_if(best, cand, ins);
    }
    arb_div_ui(bp, VHI[i], (ulong) Bx2, WP);
    {
      int ins = tri_inside(bp, mLo, mHi);
      if (ins != 0) F_PAIR(cand, bp, VHI[i], vBa);
      min_if(best, cand, ins);
    }
    a_max0(sep, best);
    gcap_a(caps[i], sep);
#undef F_PAIR
  }
  BONDQ(bq, caps);
  SETM(1, 2, bq);

  /* ---- tails c in {3,4} ---- */
  for (int c = 3; c <= 4; c++) {
    /* bh = 0: dropped -> R4 * gcap(mLo * (BASE[c] - 2*BASE[0])) */
    a_muld(sep, mLo, BASE[c] - 2.0 * BASE[0]);
    gcap_a(t, sep);
    a_muld(t, t, 2.0 * UP12); /* R4 = sqrtHi(4) = 2*(1+1e-12) */
    SETM(0, c, t);

    /* bh = 1 == T: caps_i = gcap(tailSepLB(1, c, vhi[i])); R4 * bondQ */
    for (int i = 0; i < 4; i++) {
      const double By = BASE[c], Bx2 = 2 * BASE[1];
#define F_TAIL(res, mm, vxHi) do { \
        a_muld(t4, (mm), By); \
        a_muld((res), (mm), Bx2); arb_min((res), (res), (vxHi), WP); \
        arb_sub((res), t4, (res), WP); \
      } while (0)
      F_TAIL(cand, mLo, VHI[i]);
      arb_set(best, cand);
      F_TAIL(cand, mHi, VHI[i]);
      arb_min(best, best, cand, WP);
      arb_div_ui(bp, VHI[i], (ulong) Bx2, WP);
      {
        int ins = tri_inside(bp, mLo, mHi);
        if (ins != 0) F_TAIL(cand, bp, VHI[i]);
        min_if(best, cand, ins);
      }
      a_max0(sep, best);
      gcap_a(caps[i], sep);
#undef F_TAIL
    }
    BONDQ(bq, caps);
    a_muld(bq, bq, 2.0 * UP12);
    SETM(1, c, bq);

    /* bh = 2: R4 * gcap(tailSepLB(2, c, vBc)) */
    {
      const double By = BASE[c], Bx2 = 2 * BASE[2];
#define F_TAIL2(res, mm) do { \
        a_muld(t4, (mm), By); \
        a_muld((res), (mm), Bx2); arb_min((res), (res), vBc, WP); \
        arb_sub((res), t4, (res), WP); \
      } while (0)
      F_TAIL2(cand, mLo);
      arb_set(best, cand);
      F_TAIL2(cand, mHi);
      arb_min(best, best, cand, WP);
      arb_div_ui(bp, vBc, (ulong) Bx2, WP);
      {
        int ins = tri_inside(bp, mLo, mHi);
        if (ins != 0) F_TAIL2(cand, bp);
        min_if(best, cand, ins);
      }
      a_max0(sep, best);
      gcap_a(t, sep);
      a_muld(t, t, 2.0 * UP12);
      SETM(2, c, t);
#undef F_TAIL2
    }
  }
  /* (3,4): 4 * gcap(mLo * 128) */
  a_muld(sep, mLo, 128.0);
  gcap_a(t, sep);
  a_muld(t, t, 4.0);
  SETM(3, 4, t);

  for (int i = 0; i < 4; i++) arb_clear(caps[i]);
  /* NOTE: named locals are process-lifetime leaks per call in principle;
   * we clear the big ones to keep memory flat over many cells. */
  arb_clear(v1a); arb_clear(v2a); arb_clear(v3a); arb_clear(v4a);
  arb_clear(v1c); arb_clear(v2c); arb_clear(v3c); arb_clear(v4c);
  arb_clear(vBa); arb_clear(vBc);
  arb_clear(yOa); arb_clear(yMa); arb_clear(yIa);
  arb_clear(yOc); arb_clear(yMc); arb_clear(yIc);
  arb_clear(mLo); arb_clear(mHi);
  arb_clear(G12); arb_clear(G13); arb_clear(G14); arb_clear(G23); arb_clear(G24); arb_clear(G34); arb_clear(Gmin);
  arb_clear(FI); arb_clear(G34hi); arb_clear(w3Ilo); arb_clear(w3Ihi);
  arb_clear(D34hi2); arb_clear(D34lo); arb_clear(G2E); arb_clear(w2Mhi); arb_clear(w2Mlo);
  arb_clear(n2Hi); arb_clear(n2Lo); arb_clear(ty2Hi); arb_clear(ty2Lo); arb_clear(FM);
  arb_clear(w3lo); arb_clear(w3hi); arb_clear(w4lo); arb_clear(w4hi);
  arb_clear(G23hi); arb_clear(G24hi); arb_clear(D234hi); arb_clear(D234lo); arb_clear(G1E);
  arb_clear(w1hi); arb_clear(w1lo); arb_clear(n3Hi); arb_clear(n3Lo);
  arb_clear(ty3Hi); arb_clear(ty3Lo); arb_clear(FO);
  arb_clear(w2hi4); arb_clear(w3hi4); arb_clear(g34Hi); arb_clear(g34Lo);
  arb_clear(tD2Hi); arb_clear(tD2Lo); arb_clear(G1E34); arb_clear(FD2);
  arb_clear(r24Hi); arb_clear(r24Lo); arb_clear(y24Hi); arb_clear(y24Lo); arb_clear(F24);
  arb_clear(w2I24lo); arb_clear(w2I24hi); arb_clear(G24capHi); arb_clear(D24hi); arb_clear(D24lo);
  arb_clear(g24Hi); arb_clear(g24Lo); arb_clear(tD3Hi); arb_clear(tD3Lo); arb_clear(G1E24); arb_clear(FD3);
  arb_clear(w4hi4); arb_clear(w4lo4); arb_clear(y14Hi); arb_clear(y14Lo); arb_clear(F14);
  arb_clear(s2lo); arb_clear(w3phi);
  arb_clear(w1loQ); arb_clear(w2loQ); arb_clear(w3loQ); arb_clear(w4loQ);
  arb_clear(D4lo); arb_clear(D2pLo); arb_clear(D3pLo); arb_clear(D23pLo); arb_clear(w4hi4c);
  arb_clear(best); arb_clear(cand); arb_clear(bp); arb_clear(sep); arb_clear(bq);
  arb_clear(t); arb_clear(t2); arb_clear(t3); arb_clear(t4);
#undef NEWA
#undef SETM
#undef BONDQ
#undef F_FROMDROP
}

/* cwRatio(M, v) with exact-double v */
static void cwRatio_arb(arb_t res, arb_t M[5][5], const double *v) {
  arb_t s, r, t, vi;
  arb_init(s); arb_init(r); arb_init(t); arb_init(vi);
  arb_neg_inf(res);
  for (int i = 0; i < 5; i++) {
    arb_set_d(s, TAILSLACK);
    for (int j = 0; j < 5; j++) {
      arb_set_d(t, v[j]);
      arb_mul(t, M[i][j], t, WP);
      arb_add(s, s, t, WP);
    }
    arb_set_d(vi, v[i]);
    arb_div(r, s, vi, WP);
    arb_max(res, res, r, WP);
  }
  a_muld(res, res, UP12);
  arb_clear(s); arb_clear(r); arb_clear(t); arb_clear(vi);
}

/* ------------------------------------------------------------------ */
/* repair pipeline: vector re-polish (any positive vector is a valid   */
/* Collatz-Wielandt witness) and certified interval mini-B&B split.    */
/* ------------------------------------------------------------------ */
static const double V3_FLOOR = 1e-8, V4_FLOOR = 1e-10;

static void polish_d(const double Md[5][5], double *v, int iters) {
  for (int it = 0; it < iters; it++) {
    double w[5];
    for (int i = 0; i < 5; i++) {
      double s = v[i];
      for (int j = 0; j < 5; j++) s += Md[i][j] * v[j];
      w[i] = s;
    }
    double n = 0;
    for (int i = 0; i < 5; i++) n += w[i] * w[i];
    n = sqrt(n);
    for (int i = 0; i < 5; i++) v[i] = w[i] / n;
    if (v[3] < V3_FLOOR) v[3] = V3_FLOOR;
    if (v[4] < V4_FLOOR) v[4] = V4_FLOOR;
  }
}
static void ts_solve_d(const double Md[5][5], double *v) {
  const double theta = 0.999;
  for (int it = 0; it < 4; it++) {
    double s3 = TAILSLACK;
    for (int j = 0; j < 5; j++) if (j != 3) s3 += Md[3][j] * v[j];
    v[3] = fmax(V3_FLOOR, s3 / (theta - Md[3][3]));
    double s4 = TAILSLACK;
    for (int j = 0; j < 5; j++) if (j != 4) s4 += Md[4][j] * v[j];
    v[4] = fmax(V4_FLOOR, s4 / (theta - Md[4][4]));
  }
}
static double cwratio_d(const double Md[5][5], const double *v) {
  double mx = -1e300;
  for (int i = 0; i < 5; i++) {
    double s = TAILSLACK;
    for (int j = 0; j < 5; j++) s += Md[i][j] * v[j];
    double r = s / v[i];
    if (r > mx) mx = r;
  }
  return mx * UP12;
}

/* try to certify M (already built, arb) with a battery of vectors.
 * returns 1 + writes the certified upper bound into ub if success. */
static int certify_with_vectors(arb_t M[5][5], const double *v0, arb_t bound,
                                double *bestUb) {
  double Md[5][5];
  for (int i = 0; i < 5; i++)
    for (int j = 0; j < 5; j++)
      Md[i][j] = arf_get_d(arb_midref(M[i][j]), ARF_RND_UP);
  double cand[4][5];
  for (int i = 0; i < 5; i++) cand[0][i] = v0[i];
  memcpy(cand[1], cand[0], sizeof cand[0]);
  polish_d(Md, cand[1], 60);
  memcpy(cand[2], cand[1], sizeof cand[0]);
  ts_solve_d(Md, cand[2]);
  memcpy(cand[3], cand[2], sizeof cand[0]);
  polish_d(Md, cand[3], 4000);
  arb_t one; arb_init(one); arb_one(one);
  *bestUb = 1e300;
  int ok = 0;
  for (int c = 0; c < 4; c++) {
    if (cwratio_d(Md, cand[c]) > 1.0 + 1e-7) continue; /* hopeless in double */
    cwRatio_arb(bound, M, cand[c]);
    arf_t ub; arf_init(ub);
    arb_get_ubound_arf(ub, bound, WP);
    double u = arf_get_d(ub, ARF_RND_UP);
    arf_clear(ub);
    if (u < *bestUb) *bestUb = u;
    if (arb_lt(bound, one)) { ok = 1; break; }
  }
  arb_clear(one);
  return ok;
}

/* JS feasible(T=1, lo, hi, dropA, !dropB, hasMu) - certified prune only:
 * returns 0 (prune) only when infeasibility holds with a float-safety
 * factor 3e-12 > the JS 1e-12 cushion (pruning less is always sound). */
static int feasible_d(const double *lo, const double *hi) {
  double clo[5], chi[5];
  for (int k = 0; k < 5; k++) { clo[k] = lo[k]; chi[k] = hi[k]; }
  for (int k = 1; k < 4; k++) if (clo[k] < clo[k - 1]) clo[k] = clo[k - 1];
  for (int k = 2; k >= 0; k--) if (chi[k] > chi[k + 1]) chi[k] = chi[k + 1];
  for (int k = 0; k < 4; k++) if (clo[k] > chi[k]) return 0;
  double mLo = fmax(RATE_FLOOR, lo[8]);
  double mHi = fmin(MU_CL, hi[8]);
  const double AXB[5] = { 4, 4, 4, 4, 16 };
  for (int k = 0; k < 5; k++) {
    double l = clo[k] / (2 * AXB[k]);
    double h = chi[k] / AXB[k];
    if (l > mLo) mLo = l;
    if (h < mHi) mHi = h;
  }
  return mLo <= mHi * (1.0 + 3e-12);
}

/* split-axis rule of runCoverHybrid(T=1): scales and arc axes 5,6,7 */
static const double SCALES[9] = {
  6.26 * 0.35, 6.26 * 0.35, 6.26 * 0.35, 6.26 * 0.35,
  (28.8 - 3.76) * 0.35, 1.4, 1.1, 1.1, 0.2
};
static int pick_axis(const double *lo, const double *hi) {
  int ax = 0; double wmax = -1;
  for (int k = 0; k < 9; k++) {
    double wk = hi[k] - lo[k];
    if (k >= 5 && k <= 7) {
      double xw = sqrt(fmax(0, 1 - lo[k] * lo[k])) - sqrt(fmax(0, 1 - hi[k] * hi[k]));
      if (xw > wk) wk = xw;
    }
    double w = wk / SCALES[k];
    if (w > wmax) { wmax = w; ax = k; }
  }
  return ax;
}
static const int TRIS[3][2] = { {0, 1}, {1, 2}, {2, 3} };

/* recursive certified re-closure of one failing leaf.
 * returns 1 if the whole box is certified (with splits), 0 otherwise. */
static long g_splitCells;
static int recert_box(const double *lo, const double *hi, const double *v0,
                      int depth, int maxDepth, long budget) {
  if (!feasible_d(lo, hi)) return 1; /* certainly infeasible: nothing to cover */
  if (g_splitCells >= budget) return 0;
  g_splitCells++;
  arb_t M[5][5], bound;
  for (int i = 0; i < 5; i++) for (int j = 0; j < 5; j++) arb_init(M[i][j]);
  arb_init(bound);
  build_matrix(M, lo, hi);
  double bestUb;
  int ok = certify_with_vectors(M, v0, bound, &bestUb);
  double vbest[5];
  {
    double Md[5][5];
    for (int i = 0; i < 5; i++)
      for (int j = 0; j < 5; j++)
        Md[i][j] = arf_get_d(arb_midref(M[i][j]), ARF_RND_UP);
    memcpy(vbest, v0, sizeof vbest);
    polish_d(Md, vbest, 200);
  }
  for (int i = 0; i < 5; i++) for (int j = 0; j < 5; j++) arb_clear(M[i][j]);
  arb_clear(bound);
  if (ok) return 1;
  if (depth >= maxDepth) return 0;
  int ax = pick_axis(lo, hi);
  double m = (lo[ax] + hi[ax]) / 2;
  double clo[9], chi[9];
  for (int half = 0; half < 2; half++) {
    memcpy(clo, lo, sizeof clo);
    memcpy(chi, hi, sizeof chi);
    if (half == 0) chi[ax] = m; else clo[ax] = m;
    int drop = 0;
    for (int tK = 0; tK < 3; tK++)
      if (clo[TRIS[tK][0]] > chi[TRIS[tK][1]]) { drop = 1; break; }
    if (drop) continue;
    if (!recert_box(clo, chi, vbest, depth + 1, maxDepth, budget)) return 0;
  }
  return 1;
}

/* ---------------- JSONL input parsing ---------------- */
static int parse_key_array(const char *line, const char *key, double *out, int n) {
  char pat[32];
  snprintf(pat, sizeof pat, "\"%s\":[", key);
  const char *p = strstr(line, pat);
  if (!p) return 0;
  p += strlen(pat);
  for (int i = 0; i < n; i++) {
    char *end;
    out[i] = strtod(p, &end);
    if (end == p) return 0;
    p = end;
    while (*p == ',' || *p == ' ') p++;
  }
  return 1;
}
static int parse_key_scalar(const char *line, const char *key, double *out) {
  char pat[32];
  snprintf(pat, sizeof pat, "\"%s\":", key);
  const char *p = strstr(line, pat);
  if (!p) return 0;
  p += strlen(pat);
  char *end;
  *out = strtod(p, &end);
  return end != p;
}

int main(int argc, char **argv) {
  if (argc < 3) {
    fprintf(stderr, "usage: %s <prec_bits> <cells.jsonl>\n", argv[0]);
    return 2;
  }
  WP = atol(argv[1]);
  if (WP < 64) { fprintf(stderr, "prec too low\n"); return 2; }
  FILE *f = strcmp(argv[2], "-") == 0 ? stdin : fopen(argv[2], "r");
  if (!f) { fprintf(stderr, "cannot open %s\n", argv[2]); return 2; }
  setvbuf(stdout, NULL, _IOLBF, 0);

  arb_t M[5][5], bound, one, margin;
  for (int i = 0; i < 5; i++) for (int j = 0; j < 5; j++) arb_init(M[i][j]);
  arb_init(bound); arb_init(one); arb_init(margin);
  arb_one(one);

  char *line = NULL;
  size_t cap = 0;
  long idx = 0, nCert = 0, nUncert = 0;
  double worstMarginLo = 1e9; /* min over cells of certified margin lower bound */
  long totAmbig = 0;

  while (getline(&line, &cap, f) > 0) {
    if (strlen(line) < 10) continue;
    double lo[9], hi[9], v[5], fb;
    if (!parse_key_array(line, "lo", lo, 9) ||
        !parse_key_array(line, "hi", hi, 9) ||
        !parse_key_array(line, "v", v, 5) ||
        !parse_key_scalar(line, "bound", &fb)) {
      fprintf(stderr, "parse error line %ld\n", idx);
      return 3;
    }
    g_ambig = 0;
    build_matrix(M, lo, hi);
    if (getenv("PRINTM")) {
      for (int i = 0; i < 5; i++)
        for (int j = i + 1; j < 5; j++)
          printf("M[%d][%d] %.17e rad %.3e\n", i, j,
                 arf_get_d(arb_midref(M[i][j]), ARF_RND_NEAR),
                 mag_get_d(arb_radref(M[i][j])));
    }
    cwRatio_arb(bound, M, v);
    totAmbig += g_ambig;
    /* margin = 1 - bound; certified margin lower bound from arb */
    arb_sub(margin, one, bound, WP);
    double mid = arf_get_d(arb_midref(bound), ARF_RND_NEAR);
    double rad = mag_get_d(arb_radref(bound));
    arf_t mlo_f;
    arf_init(mlo_f);
    arb_get_lbound_arf(mlo_f, margin, WP);
    double marginLo = arf_get_d(mlo_f, ARF_RND_FLOOR);
    arf_clear(mlo_f);
    int certified = arb_lt(bound, one);
    if (marginLo < worstMarginLo) worstMarginLo = marginLo;
    if (certified) {
      nCert++;
      if (getenv("VERBOSE") || marginLo < 1e-7)
        printf("cell %ld floatBound %.17e arbMid %.17e arbRad %.3e marginLo %.6e diff %.3e ambig %ld verdict CERTIFIED-DIRECT\n",
               idx, fb, mid, rad, marginLo, mid - fb, g_ambig);
    } else {
      /* repair: vector battery on the same M, then certified splitting */
      double bestUb;
      if (getenv("NOREPAIR")) {
        nUncert++;
        printf("cell %ld floatBound %.17e arbMid %.17e arbRad %.3e marginLo %.6e diff %.3e ambig %ld verdict DIRECT-FAIL-NOREPAIR\n",
               idx, fb, mid, rad, marginLo, mid - fb, g_ambig);
        idx++;
        continue;
      }
      int ok = certify_with_vectors(M, v, bound, &bestUb);
      if (ok) {
        nCert++;
        printf("cell %ld floatBound %.17e arbMid %.17e marginLo %.6e diff %.3e ambig %ld verdict CERTIFIED-REPOLISH ub %.17e\n",
               idx, fb, mid, marginLo, mid - fb, g_ambig, bestUb);
      } else {
        g_splitCells = 0;
        int rc = recert_box(lo, hi, v, 0, 44, 300000L);
        if (rc) {
          nCert++;
          printf("cell %ld floatBound %.17e arbMid %.17e marginLo %.6e diff %.3e ambig %ld verdict CERTIFIED-SPLIT subcells %ld\n",
                 idx, fb, mid, marginLo, mid - fb, g_ambig, g_splitCells);
        } else {
          nUncert++;
          printf("cell %ld floatBound %.17e arbMid %.17e marginLo %.6e diff %.3e ambig %ld verdict UNRESOLVED subcells %ld lo %s",
                 idx, fb, mid, marginLo, mid - fb, g_ambig, g_splitCells, line);
        }
      }
    }
    idx++;
    if (idx % 500000 == 0)
      fprintf(stderr, "progress %ld cells, certified %ld, unresolved %ld, worstDirectMarginLo %.3e\n",
              idx, nCert, nUncert, worstMarginLo);
  }
  printf("SUMMARY cells %ld certified %ld unresolved %ld worstDirectMarginLo %.6e totAmbig %ld prec %ld\n",
         idx, nCert, nUncert, worstMarginLo, totAmbig, (long) WP);
  free(line);
  fclose(f);
  for (int i = 0; i < 5; i++) for (int j = 0; j < 5; j++) arb_clear(M[i][j]);
  arb_clear(bound); arb_clear(one); arb_clear(margin);
  flint_cleanup();
  return 0;
}
