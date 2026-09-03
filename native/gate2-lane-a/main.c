/*
 * Gate-2 Lane-A native evaluator + oscillation probe (imp-95013b).
 *
 * Evaluates the residual cocycle E97(x) of the frozen Gate-2 spec
 * (imp-95012, paper eqs (10)-(11)) at integer Riemann-Siegel windows
 * across the open family 690988 <= N <= 54799999, and runs the
 * imp-95011 oscillation probe (per-unit-N increment L, sampled sup,
 * decoupled-mass ratios).
 *
 * EVALUATION CONVENTIONS (extracted from the delivered audit sources in
 * research-inputs/gate2-evaluator-inputs/):
 *
 *   row (imp-95012 eq 8):  t0 = 24727519/200000000, y = 1809/10000,
 *                          X = 6000000185827
 *   site grid   x_N = 4*pi*(N^2 - t0/16)  == 4*pi*N^2 - pi*t0/4
 *               (lemma_sweep_p235711.c:118-124; CAUTION #1: the two
 *               spellings are identical; we use 4*pi*(N^2 - t0/16) with
 *               t0 held as an exact rational in double-double)
 *   landmark    N(x,t) = floor(sqrt(x/(4*pi) + t/16))
 *               (verify_uniform_error_01787854.c compute_exact_N)
 *   gamma(N)  = exp(0.02*y - (y/2)*ln(x_N/(4*pi)))          [real]
 *               (lemma_sweep gamma_at :118-127, frozen at the integer
 *               landmark of the chart; PROVENANCE.md identifies this as
 *               the paper's gamma(x))
 *   sigma_B(N) = (1+y)/2 + (t0/4)*ln(x_N/(4*pi)) - t0*h/(2*x_N^2),
 *               h = 1 - 3y + 4y(1+y)/x_N^2
 *               (lemma_sweep :350-376; equals verify_tail_arb sigma1 =
 *               1/2 + y/2 + (t/2)ln N - delta_hat up to O(1e-26))
 *   sigma_A(N) = sigma_B(N) - y
 *               (lemma_sweep bA0: the A-ladder coefficient is b_n * n^y
 *               against the same sigma; the kappa_hat = t*y/(2(x_N-6))
 *               offset of verify_tail_arb sigma2 is ~1.9e-15 and is a
 *               majorant charge, excluded here; effect on |E97| < 5e-15)
 *   b_n       = exp((t0/4) * (ln n)^2)
 *               (paper eq (10) with the t0 factor, matching bt_eval in
 *               every delivered C source; imp-95012's b_n without t0 is
 *               the transcription error flagged by imp-95072)
 *   phases    omega_{n,+-} = +-(1/2) ln n  (paper section 4.6), i.e.
 *               direct ladder   n^{-sB}: amplitude b_n n^{-sigma_B},
 *                               phase e^{-i(x/2)ln n}
 *               reflected ladder n^{-sA}: amplitude b_n n^{-sigma_A},
 *                               phase e^{+i(x/2)ln n}, weight gamma(N)
 *               |E97| is invariant under the global conjugation that
 *               swaps the two sign choices.
 *   carrier   c_n(x) = b_n ( n^{-sB(x)} + gamma * n^{-sA(x)} )
 *   cocycle   A97(x) = prod_{p<=97} (1 - b_p p^{-sB(x)})   [25 factors]
 *               F_N = sum_{n=1}^{N} c_n,  C97 = sum over n coprime to
 *               all p<=97,  E97 = C97 - A97 * F_N
 *   windows   W_N = [x_N, x_{N+1}) half-open (verify_window_freeze.py);
 *               both one-sided seam charts = same x evaluated in chart N
 *               and chart N+1.
 *
 * CAUTION #2 (vecmax/bound_constants normalization): the lemma_sweep
 * header's vecmax([...]) and bound_constants(N,y,t) fix the ladder
 * normalization: the direct ladder's n=1 term is exactly 1 (division by
 * the leading B factor) and the cross-chart ratio enters as the REAL
 * gamma_at value; sigma comes from bound_constants' sig. This evaluator
 * reproduces that normalization natively (no surrogate rescaling).
 *
 * Double-double is used for x, x_N, ln n, and the phase reduction
 * frac(x * ln n / (4*pi)); naive double fails at x ~ 3.77e16 because
 * x/2 * ln n ~ 3.4e17 has double ulp ~ 74 rad. The frac reduction here
 * exploits that fl(Y.hi*L.hi) >= 2^52 is an integer, so the fractional
 * part lives entirely in the exact two_prod tail + cross terms; worst
 * case phase error ~1e-13 rad at the top of the family.
 *
 * Modes:
 *   ./gate2 selftest
 *   ./gate2 anchor                (convention search table at N=690988)
 *   ./gate2 anchor2               (directed complex-gamma variants + pilot)
 *   ./gate2 hunt LO HI STEP [bb]  (peak/crossing hunt, x = X+LO .. X+HI)
 *   ./gate2 sweep N NPTS [bb]     (window sweep diagnostic)
 *   ./gate2 scan NSAMP NTHREADS OUT.json [dense_lo dense_hi]
 *
 * STATUS 2026-09-02: BLOCKED-ON-CONVENTION. The mandatory anchor gate
 * |E97|(690988) = 0.2141254901198318 does NOT reproduce under any tested
 * convention/x* combination because the anchor cell's center x* is not
 * transcribed in the paper or any delivered input (see README.md and
 * src/data/imp-95013b-gate2-lane-a-real-probe.js for the full diagnosis).
 * The scan mode hard-refuses to run until the gate passes; set
 * GATE2_ANCHOR_XSTAR_OFFSET = (x* - 6000000185827) once x* is committed.
 *
 * Measurement only. Changes no bound. NO QED.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <stdint.h>
#include <pthread.h>
#include <time.h>

/* ───────────────────────── double-double arithmetic ───────────────── */
typedef struct { double hi, lo; } dd;

static inline dd dd_make(double h, double l) { dd r = { h, l }; return r; }
static inline dd two_sum(double a, double b) {
    double s = a + b, bb = s - a;
    return dd_make(s, (a - (s - bb)) + (b - bb));
}
static inline dd quick_two_sum(double a, double b) {
    double s = a + b;
    return dd_make(s, b - (s - a));
}
static inline dd two_prod(double a, double b) {
    double p = a * b;
    return dd_make(p, fma(a, b, -p));
}
static inline dd dd_add(dd a, dd b) {
    dd s = two_sum(a.hi, b.hi), t = two_sum(a.lo, b.lo);
    double lo = s.lo + t.hi;
    dd r = quick_two_sum(s.hi, lo);
    lo = r.lo + t.lo;
    return quick_two_sum(r.hi, lo);
}
static inline dd dd_neg(dd a) { return dd_make(-a.hi, -a.lo); }
static inline dd dd_sub(dd a, dd b) { return dd_add(a, dd_neg(b)); }
static inline dd dd_add_d(dd a, double b) {
    dd s = two_sum(a.hi, b);
    double lo = s.lo + a.lo;
    return quick_two_sum(s.hi, lo);
}
static inline dd dd_mul(dd a, dd b) {
    dd p = two_prod(a.hi, b.hi);
    double lo = p.lo + (a.hi * b.lo + a.lo * b.hi);
    return quick_two_sum(p.hi, lo);
}
static inline dd dd_mul_d(dd a, double b) {
    dd p = two_prod(a.hi, b);
    double lo = p.lo + a.lo * b;
    return quick_two_sum(p.hi, lo);
}
static inline dd dd_div(dd a, dd b) {
    double q1 = a.hi / b.hi;
    dd r = dd_sub(a, dd_mul_d(b, q1));
    double q2 = r.hi / b.hi;
    r = dd_sub(r, dd_mul_d(b, q2));
    double q3 = r.hi / b.hi;
    dd q = quick_two_sum(q1, q2);
    return dd_add_d(q, q3);
}
static inline dd dd_sqrt(dd a) {
    double x = sqrt(a.hi);
    dd ax = dd_div(a, dd_make(x, 0.0));
    dd s = dd_add_d(ax, x);
    return dd_mul_d(s, 0.5);
}
static inline double dd_to_d(dd a) { return a.hi + a.lo; }

/* pi and ln 2 as double-double (standard QD constants) */
static const dd DD_PI  = { 3.141592653589793116e+00, 1.224646799147353207e-16 };
static const dd DD_LN2 = { 6.931471805599452862e-01, 2.319046813846299558e-17 };

/* natural log of a positive dd via range reduction + atanh series */
static dd dd_log(dd a) {
    int k;
    double mh = frexp(a.hi, &k);          /* a.hi = mh * 2^k, mh in [0.5,1) */
    dd m = dd_make(mh, ldexp(a.lo, -k));
    if (mh < 0.7071067811865476) { m = dd_mul_d(m, 2.0); k -= 1; }
    dd num = dd_add_d(m, -1.0), den = dd_add_d(m, 1.0);
    dd z = dd_div(num, den);              /* |z| <= 0.1716 */
    dd z2 = dd_mul(z, z);
    dd term = z, s = z;
    for (int j = 1; j <= 24; j++) {
        term = dd_mul(term, z2);
        s = dd_add(s, dd_div(term, dd_make((double)(2 * j + 1), 0.0)));
    }
    return dd_add(dd_mul_d(s, 2.0), dd_mul_d(DD_LN2, (double)k));
}

/* ───────────────────────── global tables ──────────────────────────── */
#define NMAX_TABLE 54800003UL   /* covers chart N+3 at the family top */

static dd *g_lnn = NULL;              /* ln n as dd, n = 0..NMAX_TABLE */
static uint64_t *g_cop = NULL;        /* bit n set <=> gcd(n, prod p<=97)=1 */
static uint8_t *g_cls = NULL;         /* descending-prime class: 0 coprime,
                                         j in 1..25 <=> smallest prime factor
                                         of n is p_j (97=p_1 > ... > 2=p_25) */
static unsigned long g_nmax = 0;

static const int PRIMES97[25] = { 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37,
                                  41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97 };

static inline int is_coprime97(unsigned long n) {
    return (g_cop[n >> 6] >> (n & 63)) & 1;
}

static void build_tables(unsigned long nmax) {
    g_nmax = nmax;
    uint32_t *spf = (uint32_t *)calloc(nmax + 1, sizeof(uint32_t));
    g_lnn = (dd *)malloc((nmax + 1) * sizeof(dd));
    g_cop = (uint64_t *)calloc((nmax >> 6) + 2, sizeof(uint64_t));
    if (!spf || !g_lnn || !g_cop) { fprintf(stderr, "alloc failure\n"); exit(2); }
    /* smallest-prime-factor sieve */
    for (unsigned long i = 2; i <= nmax; i++) {
        if (spf[i] == 0) {
            spf[i] = (uint32_t)i;
            if (i * i <= nmax)
                for (unsigned long j = i * i; j <= nmax; j += i)
                    if (spf[j] == 0) spf[j] = (uint32_t)i;
        }
    }
    /* dd ln table: primes directly, composites by exact factor splitting */
    g_lnn[0] = dd_make(0.0, 0.0);
    g_lnn[1] = dd_make(0.0, 0.0);
    for (unsigned long n = 2; n <= nmax; n++) {
        if (spf[n] == n) g_lnn[n] = dd_log(dd_make((double)n, 0.0));
        else {
            unsigned long p = spf[n];
            g_lnn[n] = dd_add(g_lnn[p], g_lnn[n / p]);
        }
    }
    /* coprime-to-all-p<=97 bitmask + descending-prime class table */
    g_cls = (uint8_t *)calloc(nmax + 1, 1);
    if (!g_cls) { fprintf(stderr, "alloc failure\n"); exit(2); }
    int aidx[98]; memset(aidx, 0, sizeof(aidx));
    for (int a = 0; a < 25; a++) aidx[PRIMES97[a]] = 25 - a;  /* descending idx */
    g_cop[0] |= 2ULL; /* n = 1 */
    for (unsigned long n = 2; n <= nmax; n++) {
        if (spf[n] > 97) g_cop[n >> 6] |= 1ULL << (n & 63);
        else g_cls[n] = (uint8_t)aidx[spf[n]];
    }
    free(spf);
}

/* ───────────────────────── row constants ──────────────────────────── */
static dd T0, YROW, FOURPI, INV4PI, T0_16, T0_4;
static double T0d, Yd;

static double g_tnum = 24727519.0, g_tden = 200000000.0;

static void init_row(void) {
    T0 = dd_div(dd_make(g_tnum, 0.0), dd_make(g_tden, 0.0));
    YROW = dd_div(dd_make(1809.0, 0.0), dd_make(10000.0, 0.0));
    FOURPI = dd_mul_d(DD_PI, 4.0);
    INV4PI = dd_div(dd_make(1.0, 0.0), FOURPI);
    T0_16 = dd_mul_d(T0, 1.0 / 16.0);   /* exact: 1/16 is a power of two */
    T0_4 = dd_mul_d(T0, 0.25);
    T0d = dd_to_d(T0);
    Yd = dd_to_d(YROW);
}

/* ───────────────────────── chart (frozen window state) ────────────── */
typedef struct {
    unsigned long N;    /* integer landmark = truncation length */
    dd xN;              /* 4*pi*(N^2 - t0/16) */
    dd lnq;             /* ln(N^2 - t0/16) = ln(x_N / 4pi) */
    double sigmaB, sigmaA;
    double gamma;
} chart_t;

static chart_t build_chart(unsigned long N) {
    chart_t ch;
    ch.N = N;
    double n2 = (double)N * (double)N;           /* exact: N^2 < 2^53 */
    dd q = dd_add(dd_make(n2, 0.0), dd_neg(T0_16));
    ch.xN = dd_mul(FOURPI, q);
    ch.lnq = dd_log(q);
    /* sigma_B = (1+y)/2 + (t0/4) lnq - t0*h/(2 x_N^2), h = 1-3y+4y(1+y)/x_N^2 */
    dd sb = dd_add(dd_mul_d(dd_add_d(YROW, 1.0), 0.5), dd_mul(T0_4, ch.lnq));
    double x2 = ch.xN.hi * ch.xN.hi;
    double h = 1.0 - 3.0 * Yd + 4.0 * Yd * (1.0 + Yd) / x2;
    if (h > 0.0) sb = dd_add_d(sb, -T0d * h / (2.0 * x2)); /* ~1e-27 */
    ch.sigmaB = dd_to_d(sb);
    ch.sigmaA = dd_to_d(dd_sub(sb, YROW));
    ch.gamma = exp(0.02 * Yd - 0.5 * Yd * dd_to_d(ch.lnq));
    return ch;
}

/* landmark map N(x,t) = floor(sqrt(x/(4pi) + t/16)) (compute_exact_N) */
static unsigned long landmark_N(dd x) {
    dd u = dd_add(dd_mul(x, INV4PI), T0_16);
    double r = sqrt(dd_to_d(u));
    unsigned long N = (unsigned long)r;
    /* fix up with exact dd comparison of N^2 <= u < (N+1)^2 */
    while ((double)N * (double)N > dd_to_d(u)) N--;
    while ((double)(N + 1) * (double)(N + 1) <= dd_to_d(u)) N++;
    return N;
}

/* ───────────────────────── E97 evaluation ─────────────────────────── */
typedef struct { double re, im; } cpx;

typedef struct {
    double absE97;
    cpx E97, A97, F, C;
    double massAll, massCop;   /* sum over n of (aB+aA), all / coprime */
    double decoupledMass;      /* |1-A97|*massCop + |A97|*(massAll-massCop) */
    double pilot;              /* sum_j |D_j| over the 25-defect telescope (13) */
    double telescopeErr;       /* |sum_j D_j - E97| (must be ~0: eq (13) exact) */
} evalres_t;

/* convention flags for the anchor search (locked values used by the scan) */
typedef struct {
    int bnHasT0;      /* 1: b_n = exp((t0/4) ln^2 n)   0: exp((1/4) ln^2 n) */
    int bnOnBoth;     /* 1: c_n = b_n(n^-sB + g n^-sA) 0: b_n n^-sB + g n^-sA */
    int frozenChart;  /* 1: sigma/gamma at landmark    0: at the actual x */
    int gphaseS1;     /* 0: gamma real; else gamma phase s1*(x/2 - (x/2)ln(x/4pi)) */
    int gphaseS2;     /* + s2*pi/4 (only if gphaseS1 != 0) */
    int samePhase;    /* 1: reflected ladder uses e^{-i th} like the direct */
} conv_t;

/*
 * frac(Y*L) with Y = x/(4pi) (dd) and L = ln n (dd): the phase turn count.
 * theta = 2*pi*frac is the phase (x/2) ln n mod 2pi.
 */
static inline double phase_frac(double Yh, double Yl, double Lh, double Ll) {
    double p = Yh * Lh;
    double e = fma(Yh, Lh, -p);            /* exact tail of the big product */
    double f = fmod(p, 1.0) + e + Yh * Ll + Yl * Lh + Yl * Ll;
    return f - rint(f);                     /* in [-0.5, 0.5] */
}

static evalres_t eval_E97(const chart_t *chartIn, dd x, conv_t cv) {
    chart_t ch = *chartIn;
    if (!cv.frozenChart) {
        /* rebuild sigma/gamma from the actual x instead of the landmark */
        dd q = dd_mul(x, INV4PI);
        dd lnq = dd_log(q);
        dd sb = dd_add(dd_mul_d(dd_add_d(YROW, 1.0), 0.5), dd_mul(T0_4, lnq));
        double x2 = x.hi * x.hi;
        double h = 1.0 - 3.0 * Yd + 4.0 * Yd * (1.0 + Yd) / x2;
        if (h > 0.0) sb = dd_add_d(sb, -T0d * h / (2.0 * x2));
        ch.sigmaB = dd_to_d(sb);
        ch.sigmaA = dd_to_d(dd_sub(sb, YROW));
        ch.gamma = exp(0.02 * Yd - 0.5 * Yd * dd_to_d(lnq));
    }
    const double c2 = cv.bnHasT0 ? T0d * 0.25 : 0.25;
    const double sB = ch.sigmaB, sA = ch.sigmaA;
    double g = ch.gamma;
    dd Y = dd_mul(x, INV4PI);
    const double Yh = Y.hi, Yl = Y.lo;
    const unsigned long N = ch.N;

    /* Polymath-15 Theorem-1.3 (eqs (20)-(24)) convention: gphaseS1 == 2.
       Ladder phases theta_n = (x/2 + t*pi/8) ln n, i.e. 2*pi*frac(Yp*ln n)
       with Yp = x/(4*pi) + t/16 (the compute_exact_N radicand), and the
       directed gamma is the exact leading M-ratio
         lambda = (x/4pi)^{-y/2} exp(i[pi/4 + x/2 - (x/2 + t*pi/8)ln(x/4pi)])
       (the polynomial s(s-1) prefactors of M0(sA),M0(sB) cancel exactly;
       dropped corrections are O(1/x) ~ 1e-13). sigma_B/sigma_A are then
       (1+-y)/2 + (t/4)ln(x/4pi) evaluated per cv.frozenChart. */
    int polymath = (cv.gphaseS1 == 2);
    double gre = g, gim = 0.0;
    double Yph = Yh, Ypl = Yl;             /* phase multiplier Y (default x/4pi) */
    if (polymath) {
        dd Yp = dd_add(Y, T0_16);          /* x/(4pi) + t0/16 */
        Yph = Yp.hi; Ypl = Yp.lo;
        dd Ltx = dd_log(Y);                /* ln(x/4pi) at the actual x */
        double gmod = cv.frozenChart ? g
                    : exp(-0.5 * Yd * dd_to_d(Ltx));
        if (!cv.frozenChart) {
            /* exact leading modulus (x/4pi)^{-y/2}; the frozen branch keeps
               the chart's gamma_at modulus for comparison */
            gmod = exp(-0.5 * Yd * dd_to_d(Ltx));
        } else {
            gmod = exp(-0.5 * Yd * dd_to_d(ch.lnq));  /* no 0.02y majorant slack */
        }
        double fY = fmod(Yh, 1.0) + Yl; fY -= rint(fY);        /* x/2 mod 2pi /2pi */
        double fYL = phase_frac(Yph, Ypl, Ltx.hi, Ltx.lo);     /* (x/2+tpi/8)Lt */
        double fphi = 0.125 + fY - fYL;
        fphi -= rint(fphi);
        double phi = 6.283185307179586232 * fphi;
        gre = gmod * cos(phi);
        gim = gmod * sin(phi);
        g = gmod;
    } else if (cv.gphaseS1 != 0) {
        dd Lt = dd_log(dd_mul(x, INV4PI));
        double fxL = phase_frac(Yh, Yl, Lt.hi, Lt.lo);   /* (x/2)Lt / 2pi mod 1 */
        double fx = fmod(Yh, 1.0) + Yl;                  /* (x/2) / 2pi mod 1 */
        fx -= rint(fx);
        double fphi = cv.gphaseS1 * (fx - fxL) + cv.gphaseS2 * 0.125;
        fphi -= rint(fphi);
        double phi = 6.283185307179586232 * fphi;
        gre = g * cos(phi);
        gim = g * sin(phi);
    }
    const int samePhase = cv.samePhase;

    double Fre = 0, Fim = 0, Cre = 0, Cim = 0;      /* Kahan sums */
    double Fre_c = 0, Fim_c = 0, Cre_c = 0, Cim_c = 0;
    double massAll = 0, massCop = 0;
    double ScR[26], ScI[26];                        /* class sums (telescope) */
    memset(ScR, 0, sizeof(ScR)); memset(ScI, 0, sizeof(ScI));

    /* n = 1 term: L = 0, phases 1, amplitudes 1 and gamma */
    {
        Fre = 1.0 + gre; Fim = gim;
        Cre = 1.0 + gre; Cim = gim;   /* n=1 is coprime to everything */
        massAll = 1.0 + g;
        massCop = 1.0 + g;
        ScR[0] = 1.0 + gre; ScI[0] = gim;
    }
    for (unsigned long n = 2; n <= N; n++) {
        double Lh = g_lnn[n].hi, Ll = g_lnn[n].lo;
        double fr = phase_frac(Yph, Ypl, Lh, Ll);
        double th = 6.283185307179586232 * fr;
        double sn, cs;
        __sincos(th, &sn, &cs);
        double aB = exp((c2 * Lh - sB) * Lh);
        double aA;                                  /* reflected amp, no gamma */
        if (cv.bnOnBoth) aA = exp((c2 * Lh - sA) * Lh);
        else             aA = exp(-sA * Lh);
        /* direct: aB e^{-i th}; reflected: (gre+i gim) aA e^{+-i th} */
        double rr = cs, ri = samePhase ? -sn : sn;
        double cre = aB * cs + aA * (gre * rr - gim * ri);
        double cim = -aB * sn + aA * (gre * ri + gim * rr);
        /* Kahan into F */
        double t1 = cre - Fre_c, t2 = Fre + t1; Fre_c = (t2 - Fre) - t1; Fre = t2;
        t1 = cim - Fim_c; t2 = Fim + t1; Fim_c = (t2 - Fim) - t1; Fim = t2;
        massAll += aB + g * aA;
        int cls = g_cls[n];
        ScR[cls] += cre; ScI[cls] += cim;
        if (cls == 0) {
            t1 = cre - Cre_c; t2 = Cre + t1; Cre_c = (t2 - Cre) - t1; Cre = t2;
            t1 = cim - Cim_c; t2 = Cim + t1; Cim_c = (t2 - Cim) - t1; Cim = t2;
            massCop += aB + g * aA;
        }
    }
    /* A97 = prod_{p<=97} (1 - b_p p^{-sB} e^{-i th_p}) */
    double Are = 1.0, Aim = 0.0;
    for (int i = 0; i < 25; i++) {
        int p = PRIMES97[i];
        double Lh = g_lnn[p].hi, Ll = g_lnn[p].lo;
        double fr = phase_frac(Yph, Ypl, Lh, Ll);
        double th = 6.283185307179586232 * fr;
        double sn, cs;
        __sincos(th, &sn, &cs);
        double amp = exp((c2 * Lh - sB) * Lh);   /* b_p p^{-sigma_B} */
        double qre = 1.0 - amp * cs;             /* 1 - amp e^{-i th} */
        double qim = amp * sn;
        double nre = Are * qre - Aim * qim;
        double nim = Are * qim + Aim * qre;
        Are = nre; Aim = nim;
    }
    evalres_t r;
    r.F.re = Fre; r.F.im = Fim;
    r.C.re = Cre; r.C.im = Cim;
    r.A97.re = Are; r.A97.im = Aim;
    r.E97.re = Cre - (Are * Fre - Aim * Fim);
    r.E97.im = Cim - (Are * Fim + Aim * Fre);
    r.absE97 = hypot(r.E97.re, r.E97.im);

    /* 25-defect telescope (paper eq (13)): descending primes p_1=97..p_25=2,
       D_j = A_{<j} (q_{p_j} G_j - H_j), G_j = coprime + classes 1..j,
       H_j = class j; sum_j D_j must equal E97 exactly. */
    {
        double Gre = ScR[0], Gim = ScI[0];
        double apre = 1.0, apim = 0.0;      /* A_{<j} running product */
        double pil = 0.0, telre = 0.0, telim = 0.0;
        for (int j = 1; j <= 25; j++) {
            int p = PRIMES97[25 - j];
            double Lh = g_lnn[p].hi, Ll = g_lnn[p].lo;
            double fr = phase_frac(Yph, Ypl, Lh, Ll);
            double th = 6.283185307179586232 * fr;
            double sn, cs;
            __sincos(th, &sn, &cs);
            double amp = exp((c2 * Lh - sB) * Lh);
            double qre = amp * cs, qim = -amp * sn;     /* q_p = amp e^{-i th} */
            Gre += ScR[j]; Gim += ScI[j];
            double tre = qre * Gre - qim * Gim - ScR[j];
            double tim = qre * Gim + qim * Gre - ScI[j];
            double dre = apre * tre - apim * tim;
            double dim = apre * tim + apim * tre;
            pil += hypot(dre, dim);
            telre += dre; telim += dim;
            /* A_{<j+1} = A_{<j} * (1 - q_j) */
            double nre = apre * (1.0 - qre) + apim * qim;
            double nim = apim * (1.0 - qre) - apre * qim;
            apre = nre; apim = nim;
        }
        r.pilot = pil;
        r.telescopeErr = hypot(telre - r.E97.re, telim - r.E97.im);
    }
    r.massAll = massAll; r.massCop = massCop;
    double absA = hypot(Are, Aim);
    double abs1mA = hypot(1.0 - Are, -Aim);
    r.decoupledMass = abs1mA * massCop + absA * (massAll - massCop);
    return r;
}

/* ───────────────────────── selftest ───────────────────────────────── */
static int approx(double a, double b, double tol) { return fabs(a - b) <= tol; }

static void selftest(void) {
    int fails = 0;
    /* dd_log against known 32-digit values */
    struct { double n; double hi, lo; } refs[] = {
        /* ln 2 */ { 2.0, 6.931471805599452862e-01, 2.319046813846299558e-17 },
        /* ln 690988 = 13.44580067278863949122... (mpmath 50 digits) */
        { 690988.0, 0, 0 },
    };
    dd l2 = dd_log(dd_make(2.0, 0.0));
    if (!approx(l2.hi, refs[0].hi, 1e-18) || !approx(l2.lo, refs[0].lo, 1e-25)) {
        printf("[FAIL] dd_log(2) = %.20e + %.6e\n", l2.hi, l2.lo); fails++;
    } else printf("[PASS] dd_log(2)\n");
    /* ln(10) * ln(2) consistency: ln(1024) = 10 ln 2 */
    dd l1024 = dd_log(dd_make(1024.0, 0.0));
    dd l2x10 = dd_mul_d(l2, 10.0);
    if (!approx(l1024.hi, l2x10.hi, 1e-15) ||
        !approx(dd_to_d(dd_sub(l1024, l2x10)), 0.0, 1e-28)) {
        printf("[FAIL] dd_log(1024) vs 10 ln2: diff %.3e\n",
               dd_to_d(dd_sub(l1024, l2x10))); fails++;
    } else printf("[PASS] dd_log(1024) = 10 ln 2\n");
    /* dd_sqrt: sqrt(2)^2 = 2 */
    dd s2 = dd_sqrt(dd_make(2.0, 0.0));
    dd s2sq = dd_mul(s2, s2);
    if (!approx(dd_to_d(dd_add_d(s2sq, -2.0)), 0.0, 1e-30)) {
        printf("[FAIL] dd_sqrt(2)^2 - 2 = %.3e\n", dd_to_d(dd_add_d(s2sq, -2.0))); fails++;
    } else printf("[PASS] dd_sqrt(2)\n");
    /* phase_frac against dd arithmetic done the slow way for a big case:
       x = 3.77e16-ish exact double, n = 54799999 */
    build_tables(54800000UL);
    {
        dd x = dd_make(3.77e16, 0.0);
        dd Y = dd_mul(x, INV4PI);
        dd L = g_lnn[54799999];
        double f = phase_frac(Y.hi, Y.lo, L.hi, L.lo);
        /* slow reference: full dd product, frac via hi-int split */
        dd P = dd_mul(Y, L);
        double ip = floor(P.hi);
        double fr = (P.hi - ip) + P.lo;   /* P.hi >= 2^53: P.hi-ip == 0 */
        fr = fr - rint(fr);
        if (!approx(f - rint(f - fr) , fr, 5e-13)) {
            printf("[FAIL] phase_frac big-x: %.17f vs %.17f\n", f, fr); fails++;
        } else printf("[PASS] phase_frac at x=3.77e16, n=54799999 (%.17f)\n", f);
    }
    /* landmark consistency: N(x_N) == N at family edges */
    unsigned long edges[3] = { 690988UL, 3840000UL, 54799999UL };
    for (int i = 0; i < 3; i++) {
        chart_t ch = build_chart(edges[i]);
        unsigned long lm = landmark_N(ch.xN);
        if (lm != edges[i]) { printf("[FAIL] landmark(x_%lu) = %lu\n", edges[i], lm); fails++; }
        else printf("[PASS] landmark(x_%lu) = %lu\n", edges[i], lm);
    }
    /* coprime mask sanity: 1 yes, 97 no, 101 yes, 9797=97*101 no, 10201=101^2 yes */
    if (is_coprime97(1) && !is_coprime97(97) && is_coprime97(101) &&
        !is_coprime97(9797) && is_coprime97(10201) && !is_coprime97(2 * 3 * 5))
        printf("[PASS] coprime-97 mask\n");
    else { printf("[FAIL] coprime-97 mask\n"); fails++; }
    printf(fails ? "SELFTEST: %d FAILURES\n" : "SELFTEST: ALL PASS\n", fails);
    exit(fails ? 1 : 0);
}

/* ───────────────────────── anchor search ──────────────────────────── */
static const double ANCHOR_TARGET = 0.2141254901198318;

static void anchor_search(void) {
    build_tables(690995UL);
    dd Xdd = dd_make(6000000185827.0, 0.0);
    dd one = dd_make(1.0, 0.0);
    dd sq = dd_sqrt(dd_sub(one, dd_mul(YROW, YROW)));   /* sqrt(1-y0^2) */
    chart_t ch = build_chart(690988UL);

    dd cands[6];
    const char *cnames[6];
    cands[0] = dd_add_d(Xdd, 1.0);              cnames[0] = "X+1";
    cands[1] = dd_add(dd_add(Xdd, T0), sq);     cnames[1] = "X+t0+sqrt(1-y0^2)";
    cands[2] = dd_add(Xdd, sq);                 cnames[2] = "X+sqrt(1-y0^2)";
    cands[3] = ch.xN;                           cnames[3] = "x_N(690988)";
    cands[4] = Xdd;                             cnames[4] = "X";
    cands[5] = dd_add_d(ch.xN, 0.5 * (dd_to_d(dd_sub(build_chart(690989UL).xN, ch.xN))));
    cnames[5] = "window midpoint";

    printf("chart 690988: xN = %.6f, sigmaB = %.15f, sigmaA = %.15f, gamma = %.15e\n",
           dd_to_d(ch.xN), ch.sigmaB, ch.sigmaA, ch.gamma);
    printf("anchor target |E97| = %.16f\n\n", ANCHOR_TARGET);
    printf("%-22s %-6s %-7s %-7s  |E97|              rel.err\n",
           "x*", "bnT0", "bnBoth", "frozen");
    for (int c = 0; c < 6; c++) {
        unsigned long lm = landmark_N(cands[c]);
        if (lm != 690988UL)
            printf("  (note: landmark of %s is %lu, not 690988)\n", cnames[c], lm);
        for (int bt = 1; bt >= 0; bt--)
            for (int bb = 1; bb >= 0; bb--)
                for (int fz = 1; fz >= 0; fz--) {
                    conv_t cv = { bt, bb, fz, 0, 0, 0 };
                    evalres_t r = eval_E97(&ch, cands[c], cv);
                    double rel = fabs(r.absE97 - ANCHOR_TARGET) / ANCHOR_TARGET;
                    printf("%-22s %-6d %-7d %-7d  %.16f  %.3e%s\n",
                           cnames[c], bt, bb, fz, r.absE97, rel,
                           rel <= 1e-9 ? "  <-- MATCH" : "");
                }
    }
}

/* anchor search round 2: directed complex-gamma variants x candidates */
static void anchor_search2(void) {
    build_tables(690995UL);
    dd Xdd = dd_make(6000000185827.0, 0.0);
    dd one = dd_make(1.0, 0.0);
    chart_t ch = build_chart(690988UL);
    dd sqRow = dd_sqrt(dd_sub(one, dd_mul(YROW, YROW)));   /* sqrt(1-0.1809^2) */
    dd y2aud = dd_div(dd_make(87677.0, 0.0), dd_make(2500000.0, 0.0));
    dd sqAud = dd_sqrt(dd_sub(one, y2aud));                /* audit-row sqrt */
    dd beta = dd_sqrt(dd_sub(one, dd_mul_d(T0, 2.0)));     /* sqrt(1-2t0) */

    dd cands[8]; const char *cn[8];
    cands[0] = dd_add_d(Xdd, 1.0);          cn[0] = "X+1";
    cands[1] = dd_add(dd_add(Xdd, T0), sqRow); cn[1] = "X+t0+sqrt(1-y0^2)";
    cands[2] = dd_add(Xdd, sqRow);          cn[2] = "X+sqrt(1-y0^2)";
    cands[3] = dd_add(Xdd, sqAud);          cn[3] = "X+sqrt(1-y0aud^2)";
    cands[4] = dd_add(Xdd, beta);           cn[4] = "X+sqrt(1-2t0)";
    cands[5] = Xdd;                         cn[5] = "X";
    cands[6] = ch.xN;                       cn[6] = "x_N";
    cands[7] = dd_add_d(Xdd, 0.5);          cn[7] = "X+0.5";

    struct { int s1, s2, sp, fz; const char *nm; } var[] = {
        { 0, 0, 0, 1, "realGamma" },
        { 1, 1, 0, 1, "chi(+,+pi/4)" },
        { 1, -1, 0, 1, "chi(+,-pi/4)" },
        { -1, 1, 0, 1, "chi(-,+pi/4)" },
        { -1, -1, 0, 1, "chi(-,-pi/4)" },
        { 0, 0, 1, 1, "samePhase" },
        { 2, 0, 0, 0, "polymath(atX)" },
        { 2, 0, 0, 1, "polymath(frozen)" },
    };
    printf("anchor target %.16f\n", ANCHOR_TARGET);
    for (int c = 0; c < 8; c++)
        for (int v = 0; v < 8; v++)
            for (int bb = 1; bb >= 0; bb--) {
                conv_t cv = { 1, bb, var[v].fz, var[v].s1, var[v].s2, var[v].sp };
                evalres_t r = eval_E97(&ch, cands[c], cv);
                double rel = fabs(r.absE97 - ANCHOR_TARGET) / ANCHOR_TARGET;
                double relP = fabs(r.pilot - ANCHOR_TARGET) / ANCHOR_TARGET;
                printf("%-20s %-16s bb=%d  |E97|=%.16f (%.2e)  pilot=%.16f (%.2e)  tel=%.1e%s%s\n",
                       cn[c], var[v].nm, bb, r.absE97, rel, r.pilot, relP,
                       r.telescopeErr,
                       rel <= 1e-9 ? "  <-- MATCH-E97" : (rel <= 1e-3 ? "  <-- close-E97" : ""),
                       relP <= 1e-9 ? "  <-- MATCH-PILOT" : (relP <= 1e-3 ? "  <-- close-PILOT" : ""));
            }
}

/* ─────────────── locked-convention single evaluation (CLI) ─────────── */
static conv_t locked_conv(void) { conv_t cv = { 1, 1, 1, 0, 0, 0 }; return cv; }

/* sweep |E97| across window W_N at npts window fractions (diagnostic) */
static void sweep_window(unsigned long N, int npts, int bnBoth) {
    build_tables(N + 2);
    chart_t ch = build_chart(N);
    conv_t cv = { 1, bnBoth, 1, 0, 0, 0 };
    double twoN1 = (double)(2 * N + 1);
    double mn = 1e300, mx = -1e300, mnf = 0, mxf = 0;
    for (int i = 0; i < npts; i++) {
        double fwin = (double)i / (double)npts;
        double n2 = (double)N * (double)N;
        dd q = dd_add(dd_make(n2, 0.0), dd_neg(T0_16));
        q = dd_add_d(q, fwin * twoN1);
        dd x = dd_mul(FOURPI, q);
        evalres_t r = eval_E97(&ch, x, cv);
        printf("f=%.6f x=%.3f |E97|=%.16f  |A97|=%.6f |F|=%.6f |C|=%.6f\n",
               fwin, dd_to_d(x), r.absE97, hypot(r.A97.re, r.A97.im),
               hypot(r.F.re, r.F.im), hypot(r.C.re, r.C.im));
        if (r.absE97 < mn) { mn = r.absE97; mnf = fwin; }
        if (r.absE97 > mx) { mx = r.absE97; mxf = fwin; }
    }
    printf("SWEEP N=%lu bnBoth=%d min=%.16f@f=%.6f max=%.16f@f=%.6f\n",
           N, bnBoth, mn, mnf, mx, mxf);
}

/* hunt: scan x in [X+lo, X+hi] step ds for |E97| crossings of the anchor
   target; bisection-refine each crossing and print x-X (diagnostic) */
static double hunt_eval(const chart_t *ch, double off, conv_t cv) {
    dd x = dd_add_d(dd_make(6000000185827.0, 0.0), off);
    evalres_t r = eval_E97(ch, x, cv);
    return r.absE97;
}
static void hunt(double lo, double hi, double ds, int bnBoth) {
    build_tables(690995UL);
    chart_t ch = build_chart(690988UL);
    conv_t cv = { 1, bnBoth, 1, 2, 0, 0 };   /* polymath convention */
    double prev = hunt_eval(&ch, lo, cv);
    double maxv = prev; double maxoff = lo;
    for (double off = lo + ds; off <= hi; off += ds) {
        double cur = hunt_eval(&ch, off, cv);
        if (cur > maxv) { maxv = cur; maxoff = off; }
        if ((prev - ANCHOR_TARGET) * (cur - ANCHOR_TARGET) < 0) {
            double a = off - ds, b = off;
            for (int it = 0; it < 60; it++) {
                double m = 0.5 * (a + b);
                double v = hunt_eval(&ch, m, cv);
                if ((hunt_eval(&ch, a, cv) - ANCHOR_TARGET) * (v - ANCHOR_TARGET) < 0) b = m;
                else a = m;
                if (b - a < 1e-12) break;
            }
            printf("crossing at x - X = %.12f  (|E97|=%.16f)\n",
                   0.5 * (a + b), hunt_eval(&ch, 0.5 * (a + b), cv));
        }
        prev = cur;
    }
    printf("HUNT [%g,%g] step %g bnBoth=%d: max |E97| = %.16f at x-X = %.6f\n",
           lo, hi, ds, bnBoth, maxv, maxoff);
}

/* ───────────────────────── the probe scan ─────────────────────────── */
/*
 * grid: NSAMP log-spaced N in [690988, 54799999]; per sample, sites
 * M in {N, N+1, N+2}; per site, 5 window parameters w in {0, .25, .5,
 * .75, 1} placing x = 4*pi*(M^2 - t0/16 + w*(2M+1)) inside W_M (w=1 is
 * the seam point x_{M+1}); 2 seam sides: chart M (own, the left/interior
 * one-sided chart) and chart M+1 (cross, the right one-sided seam chart
 * that owns x_{M+1} under the half-open convention).
 */
#define NW 5
static const double WPARAMS[NW] = { 0.0, 0.25, 0.5, 0.75, 1.0 };

typedef struct {
    unsigned long Nsample;      /* the sampled base N */
    int site;                   /* 0,1,2 -> M = N+site */
    int wi;                     /* window parameter index */
    int side;                   /* 0 = own chart M, 1 = cross chart M+1 */
    double absE97;
    double decoupledMass;
    double massRatio;
} rec_t;

typedef struct {
    unsigned long *samples;
    int nsamp;
    rec_t *recs;                /* nsamp * 3 * NW * 2 */
    long next;                  /* atomic task index */
    pthread_mutex_t mu;
} scanctx_t;

static void eval_site(unsigned long Nsample, int site, rec_t *out /* NW*2 */) {
    unsigned long M = Nsample + (unsigned long)site;
    chart_t own = build_chart(M);
    chart_t cross = build_chart(M + 1);
    double twoM1 = (double)(2 * M + 1);
    conv_t cv = locked_conv();
    for (int wi = 0; wi < NW; wi++) {
        /* x = 4*pi*(M^2 - t0/16 + w*(2M+1)) */
        double n2 = (double)M * (double)M;
        dd q = dd_add(dd_make(n2, 0.0), dd_neg(T0_16));
        q = dd_add_d(q, WPARAMS[wi] * twoM1);
        dd x = dd_mul(FOURPI, q);
        for (int side = 0; side < 2; side++) {
            const chart_t *chp = side ? &cross : &own;
            evalres_t r = eval_E97(chp, x, cv);
            rec_t *rc = &out[wi * 2 + side];
            rc->Nsample = Nsample; rc->site = site; rc->wi = wi; rc->side = side;
            rc->absE97 = r.absE97;
            rc->decoupledMass = r.decoupledMass;
            rc->massRatio = r.decoupledMass > 0 ? r.absE97 / r.decoupledMass : 0;
        }
    }
}

static void *scan_worker(void *arg) {
    scanctx_t *ctx = (scanctx_t *)arg;
    for (;;) {
        long task;
        pthread_mutex_lock(&ctx->mu);
        task = ctx->next++;
        pthread_mutex_unlock(&ctx->mu);
        if (task >= (long)ctx->nsamp * 3) break;
        int is = (int)(task / 3), site = (int)(task % 3);
        eval_site(ctx->samples[is], site,
                  &ctx->recs[((long)is * 3 + site) * NW * 2]);
    }
    return NULL;
}

static int cmp_desc(const void *a, const void *b) {
    double d = ((const rec_t *)b)->absE97 - ((const rec_t *)a)->absE97;
    return d > 0 ? 1 : d < 0 ? -1 : 0;
}

static void scan(int nsamp, int nthreads, const char *outpath,
                 unsigned long dense_lo, unsigned long dense_hi) {
    const unsigned long NLO = 690988UL, NHI = 54799999UL;
    fprintf(stderr, "building tables to %lu ...\n", (unsigned long)NMAX_TABLE);
    double tt0 = (double)clock() / CLOCKS_PER_SEC;
    struct timespec w0, w1;
    clock_gettime(CLOCK_MONOTONIC, &w0);
    build_tables(NMAX_TABLE);
    clock_gettime(CLOCK_MONOTONIC, &w1);
    fprintf(stderr, "tables built in %.1f s wall\n",
            (w1.tv_sec - w0.tv_sec) + 1e-9 * (w1.tv_nsec - w0.tv_nsec));
    (void)tt0;

    /* MANDATORY ANCHOR GATE: the scan refuses to run unless the anchor
       cell value 0.2141254901198318 is reproduced to <= 1e-9 relative.
       As of 2026-09-02 the anchor cell's x* is NOT pinned by any delivered
       input (BLOCKED-ON-CONVENTION); once x* is committed, replace the
       candidate below and re-run. NO surrogate substitution. */
    {
        chart_t ch = build_chart(690988UL);
        const char *xoff = getenv("GATE2_ANCHOR_XSTAR_OFFSET"); /* x* - X */
        double off = xoff ? atof(xoff) : 1.0;
        dd x = dd_add_d(dd_make(6000000185827.0, 0.0), off);
        conv_t cv = locked_conv();
        evalres_t r = eval_E97(&ch, x, cv);
        double rel = fabs(r.absE97 - ANCHOR_TARGET) / ANCHOR_TARGET;
        fprintf(stderr, "anchor gate |E97|(690988) at x*=X+%g: %.16f "
                "(target %.16f, rel %.3e)\n", off, r.absE97, ANCHOR_TARGET, rel);
        if (rel > 1e-9) {
            fprintf(stderr, "ANCHOR GATE FAILED: BLOCKED-ON-CONVENTION. "
                    "Refusing to scan with an unanchored evaluator.\n");
            exit(3);
        }
    }

    /* sample grid */
    unsigned long *samples = (unsigned long *)malloc(sizeof(unsigned long) * (size_t)nsamp);
    int ns = 0;
    if (dense_lo && dense_hi) {
        for (int i = 0; i < nsamp; i++) {
            double f = (double)i / (double)(nsamp - 1);
            unsigned long N = (unsigned long)llround(
                dense_lo * exp(f * log((double)dense_hi / (double)dense_lo)));
            if (N < dense_lo) N = dense_lo;
            if (N > dense_hi) N = dense_hi;
            if (ns == 0 || samples[ns - 1] != N) samples[ns++] = N;
        }
    } else {
        for (int i = 0; i < nsamp; i++) {
            double f = (double)i / (double)(nsamp - 1);
            unsigned long N = (unsigned long)llround(
                NLO * exp(f * log((double)NHI / (double)NLO)));
            if (N < NLO) N = NLO;
            if (N > NHI) N = NHI;
            if (ns == 0 || samples[ns - 1] != N) samples[ns++] = N;
        }
    }
    fprintf(stderr, "scan: %d unique samples x 3 sites x %d windows x 2 sides "
            "= %ld evaluations on %d threads\n", ns, NW, (long)ns * 3 * NW * 2, nthreads);

    scanctx_t ctx;
    ctx.samples = samples; ctx.nsamp = ns;
    ctx.recs = (rec_t *)calloc((size_t)ns * 3 * NW * 2, sizeof(rec_t));
    ctx.next = 0;
    pthread_mutex_init(&ctx.mu, NULL);
    pthread_t th[64];
    if (nthreads > 64) nthreads = 64;
    clock_gettime(CLOCK_MONOTONIC, &w0);
    for (int i = 0; i < nthreads; i++) pthread_create(&th[i], NULL, scan_worker, &ctx);
    for (int i = 0; i < nthreads; i++) pthread_join(th[i], NULL);
    clock_gettime(CLOCK_MONOTONIC, &w1);
    double wall = (w1.tv_sec - w0.tv_sec) + 1e-9 * (w1.tv_nsec - w0.tv_nsec);
    fprintf(stderr, "scan wall time %.1f s\n", wall);

    /* reduce: L = max over (w, side, sample) of |C(N+1)-C(N)| and
       |C(N+2)-C(N)|/2; sup = max |E97|. */
    double maxL = 0, sup = 0;
    unsigned long maxL_N = 0; int maxL_w = -1, maxL_side = -1, maxL_pair = 0;
    unsigned long sup_N = 0; int sup_w = -1, sup_side = -1, sup_site = 0;
    for (int is = 0; is < ns; is++) {
        for (int wi = 0; wi < NW; wi++)
            for (int side = 0; side < 2; side++) {
                double c0 = ctx.recs[(((long)is * 3 + 0) * NW + wi) * 2 + side].absE97;
                double c1 = ctx.recs[(((long)is * 3 + 1) * NW + wi) * 2 + side].absE97;
                double c2 = ctx.recs[(((long)is * 3 + 2) * NW + wi) * 2 + side].absE97;
                double i1 = fabs(c1 - c0), i2 = fabs(c2 - c0) * 0.5;
                if (i1 > maxL) { maxL = i1; maxL_N = ctx.samples[is]; maxL_w = wi; maxL_side = side; maxL_pair = 1; }
                if (i2 > maxL) { maxL = i2; maxL_N = ctx.samples[is]; maxL_w = wi; maxL_side = side; maxL_pair = 2; }
            }
        for (int site = 0; site < 3; site++)
            for (int wi = 0; wi < NW; wi++)
                for (int side = 0; side < 2; side++) {
                    rec_t *rc = &ctx.recs[(((long)is * 3 + site) * NW + wi) * 2 + side];
                    if (rc->absE97 > sup) {
                        sup = rc->absE97; sup_N = rc->Nsample; sup_w = wi;
                        sup_side = side; sup_site = site;
                    }
                }
    }
    /* three largest samples for the decoupled-mass ratio */
    long total = (long)ns * 3 * NW * 2;
    rec_t *sorted = (rec_t *)malloc(sizeof(rec_t) * (size_t)total);
    memcpy(sorted, ctx.recs, sizeof(rec_t) * (size_t)total);
    qsort(sorted, (size_t)total, sizeof(rec_t), cmp_desc);

    FILE *f = fopen(outpath, "w");
    if (!f) { fprintf(stderr, "cannot open %s\n", outpath); exit(2); }
    fprintf(f, "{\n");
    fprintf(f, "  \"ticket\": \"imp-95013b\",\n");
    fprintf(f, "  \"convention\": {\"bnHasT0\": true, \"bnOnBoth\": true, \"frozenChart\": true,\n");
    fprintf(f, "    \"siteGrid\": \"x_N = 4*pi*(N^2 - t0/16)\",\n");
    fprintf(f, "    \"xEval\": \"x = 4*pi*(M^2 - t0/16 + w*(2M+1)), w in [0,1]\",\n");
    fprintf(f, "    \"seamSides\": \"side 0 = chart M (own/left), side 1 = chart M+1 (cross/right)\"},\n");
    fprintf(f, "  \"anchor\": {\"N\": 690988, \"target\": 0.2141254901198318},\n");
    fprintf(f, "  \"grid\": {\"nsamp\": %d, \"sites\": 3, \"windows\": %d, \"sides\": 2, \"evaluations\": %ld},\n",
            ns, NW, total);
    fprintf(f, "  \"wallSeconds\": %.1f,\n  \"threads\": %d,\n", wall, nthreads);
    fprintf(f, "  \"L\": %.15e,\n", maxL);
    fprintf(f, "  \"Lwitness\": {\"N\": %lu, \"w\": %.2f, \"side\": %d, \"pair\": \"(N,N+%d)\"},\n",
            maxL_N, WPARAMS[maxL_w >= 0 ? maxL_w : 0], maxL_side, maxL_pair);
    fprintf(f, "  \"sampledSup\": %.16f,\n", sup);
    fprintf(f, "  \"supWitness\": {\"N\": %lu, \"site\": %d, \"w\": %.2f, \"side\": %d},\n",
            sup_N, sup_site, WPARAMS[sup_w >= 0 ? sup_w : 0], sup_side);
    fprintf(f, "  \"top3MassRatios\": [\n");
    for (int i = 0; i < 3 && i < total; i++)
        fprintf(f, "    {\"N\": %lu, \"site\": %d, \"w\": %.2f, \"side\": %d, \"absE97\": %.15f, "
                "\"decoupledMass\": %.15f, \"ratio\": %.15f}%s\n",
                sorted[i].Nsample, sorted[i].site, WPARAMS[sorted[i].wi], sorted[i].side,
                sorted[i].absE97, sorted[i].decoupledMass, sorted[i].massRatio,
                i < 2 ? "," : "");
    fprintf(f, "  ],\n");
    fprintf(f, "  \"records\": [\n");
    for (long i = 0; i < total; i++) {
        rec_t *rc = &ctx.recs[i];
        fprintf(f, "    [%lu,%d,%.2f,%d,%.12e,%.6e]%s\n",
                rc->Nsample, rc->site, WPARAMS[rc->wi], rc->side,
                rc->absE97, rc->massRatio, i < total - 1 ? "," : "");
    }
    fprintf(f, "  ],\n");
    fprintf(f, "  \"recordSchema\": [\"Nsample\", \"site(M=N+site)\", \"w\", \"side\", \"absE97\", \"massRatio\"]\n");
    fprintf(f, "}\n");
    fclose(f);
    printf("RESULT L=%.6e sup=%.16f wall=%.1fs written=%s\n", maxL, sup, wall, outpath);
    free(sorted);
    free(ctx.recs);
    free(samples);
}

/* ───────────────────────── main ───────────────────────────────────── */
int main(int argc, char **argv) {
    const char *tenv = getenv("GATE2_T_NUM"), *tden = getenv("GATE2_T_DEN");
    if (tenv && tden) { g_tnum = atof(tenv); g_tden = atof(tden); }
    init_row();
    if (argc >= 2 && strcmp(argv[1], "selftest") == 0) { selftest(); return 0; }
    if (argc >= 2 && strcmp(argv[1], "anchor") == 0) { anchor_search(); return 0; }
    if (argc >= 2 && strcmp(argv[1], "anchor2") == 0) { anchor_search2(); return 0; }
    if (argc >= 5 && strcmp(argv[1], "hunt") == 0) {
        hunt(atof(argv[2]), atof(argv[3]), atof(argv[4]),
             argc >= 6 ? atoi(argv[5]) : 1);
        return 0;
    }
    if (argc >= 4 && strcmp(argv[1], "sweep") == 0) {
        sweep_window(strtoul(argv[2], NULL, 10), atoi(argv[3]),
                     argc >= 5 ? atoi(argv[4]) : 1);
        return 0;
    }
    if (argc >= 5 && strcmp(argv[1], "scan") == 0) {
        int nsamp = atoi(argv[2]), nth = atoi(argv[3]);
        unsigned long dlo = 0, dhi = 0;
        if (argc >= 7) { dlo = strtoul(argv[5], NULL, 10); dhi = strtoul(argv[6], NULL, 10); }
        scan(nsamp, nth, argv[4], dlo, dhi);
        return 0;
    }
    fprintf(stderr, "usage: %s selftest | anchor | scan NSAMP NTHREADS OUT.json [dense_lo dense_hi]\n",
            argv[0]);
    return 2;
}
