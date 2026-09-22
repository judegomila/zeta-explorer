/*
 * tier_cert2.c — imp-95214: frequency-bin/chirp SECOND LEVEL for the
 * tier-P/B/S window-1 certifier (Arb ball arithmetic). Amortizes the
 * per-panel O(N) Arb pass of tier_cert.c (97.4% of the measured level-1
 * cost) across many panels via certified chirp models of the class-sum
 * series over SUPER-PANELS.
 *
 * HONESTY HEADER (frozen; fail-closed): identical scope to tier_cert.c —
 * certifies continuum sup bounds on SUB-RANGES only; a sub-range run can
 * NEVER set the window promotion flag (G5). Nothing here promotes any
 * Lambda bound. NO QED. Platt-Trudgian Lambda <= 0.2 stays the benchmark.
 * Locked convention of native/gate2-lane-a/main.c; window 1 (N = 690988).
 *
 * DERIVATION (the G4 "batch the remaining integer indices by certified
 * curvature/chirp recurrences" step, in the exact form built here):
 *
 *   Each class-sum series is S_c(x) = sum_{n in c} amp_n e^{i nu_n x}
 *   (real/imag parts with P_n / Q_n amplitudes give ScR_c / ScI_c),
 *   nu_n = ln(n)/2 in [ln2/2, ln(M)/2]. Split the frequency axis into B
 *   bins with exact-double centers nu*_b; per (class, bin) define the
 *   DEROTATED ENVELOPE
 *       E_{c,b}(x) = sum_{n in c, bin b} amp_n e^{i d_n x},
 *       d_n = nu_n - nu*_b,  |d_n| <= delta_b  (delta_b ~ binwidth/2).
 *   Then S_c(x) = sum_b e^{i nu*_b x} E_{c,b}(x): a chirp — linear-phase
 *   carrier times a slowly varying envelope (bandwidth delta_b, 64-500x
 *   below the raw frequencies; the empirical scan2 mode MEASURES both
 *   rates). Every level-1 Taylor coefficient of S_c therefore varies with
 *   the panel center exactly as such a chirp, and ONE degree-Etier
 *   Taylor model of each envelope at the super-panel center X0, with the
 *   exact Lagrange remainder from the same per-class-bin mass sums
 *       |E - model| <= M_{c,b} delta_b^{E+1} Hx^{E+1} / (E+1)!,
 *       M_{c,b} = sum |amp_n|,
 *   is valid over a super-panel half-width Hx sized ~delta^{-1}, i.e.
 *   MANY level-1 panels (K = floor(Hx / (2 pi wu)) panels per super-pass).
 *
 *   RECONSTRUCTION (per level-1 panel, center x_p = X0 + dX): the exact
 *   degree-D truncation of carrier x envelope around x_p,
 *     C_k = e^{i nu* x_p} sum_{j<=min(k,E)} (i nu*)^{k-j}/(k-j)! q_j,
 *     q_j = [Taylor shift of the envelope model by dX]_j,
 *   computed as: exact _arb_poly_taylor_shift (ball arithmetic) + the
 *   rotation q~_j = (-i)^j q_j + a PLAIN REAL convolution with
 *   wAbs[m] = nu*^m/m! (one _arb_poly_mullow per component) + the final
 *   i^k carrier rotation. Single-term identity (amp, nu = nu* + d):
 *   shift gives q_j -> amp (i d)^j/j! e^{i d x_p}, the convolution
 *   telescopes the binomial (nu*+d)^k, and C_k -> amp (i nu)^k/k!
 *   e^{i nu x_p} = the level-1 coefficient EXACTLY. The reconstructed
 *   panel model is consumed by the UNCHANGED tpanel_eval — same Horner,
 *   same alias/E97 Lipschitz ledgers, same cell criterion, same eq-(13)
 *   telescope gate at every evaluation, same Tier-P direct fallback.
 *
 *   CERTIFIED REMAINDER (added to the per-class panel remainder balls,
 *   all masses computed once per chart in Arb):
 *    (1) envelope Lagrange:   r_env = sum_b M_{c,b} (delta_b Hx)^{E+1}/(E+1)!
 *    (2) degree-D k-tail of carrier x shifted-envelope (the level-1
 *        Lagrange analog): with |q_j| <= M delta^j/j! e^{delta |dX|},
 *        T = sum_b M_{c,b} e^{delta_b Hx} sum_{j<=E} (delta_b h)^j/j!
 *            * geomTail(nu*_b h, D-j),
 *        geomTail(z,L) = sum_{i>L} z^i/i! <= z^{L+1}/(L+1)! / (1-z/(L+2)).
 *    (j-truncation j>E is inside (2): q_j = 0 for j > E by construction.)
 *   Hx is SOLVED per chart so r_env total <= T2_EPS_ENV (bisection on the
 *   rigorous Arb masses); the freeze uses the tighter realized half-width
 *   2 pi K wu. Everything outward-rounded; hX/wu/panel tiling identical
 *   to level 1, so cells and gates are bit-identical semantics.
 *
 * Modes:
 *   ./tier_cert2 scan2 [prec] [degree] [bins] [edeg]   (empirical smoothness scan)
 *   ./tier_cert2 ledger2 [prec] [degree] [bins] [edeg]
 *   ./tier_cert2 selfcheck2 [prec] [degree] [bins] [edeg]
 *   ./tier_cert2 panels2 NPANELS SEED [prec] [degree] [bins] [edeg]
 *   ./tier_cert2 validate2 NPTS SEED [prec] [degree] [bins] [edeg]
 *   ./tier_cert2 validatedd2 FILE [prec] [degree] [bins] [edeg]
 *   ./tier_cert2 tiercert2 --u-lo A --u-hi B [--side 0|1|both]
 *               [--metric pilot|e97|both] [--threads T] [--prec P]
 *               [--degree D] [--bins B] [--edeg E] [--budget-cells B]
 *               [--out FILE]                          ("slice2" alias)
 */
#define TIER_CERT_NO_MAIN
#include "tier_cert.c"

#include <flint/arb_poly.h>

/* keep the level-1 static mode functions referenced (they are exercised
   through the tier_cert binary; here they would otherwise warn) */
__attribute__((used)) static void *const t2_keep_refs[] = {
    (void *)cert_window_main, (void *)mode_ledger,
    (void *)mode_tier_selfcheck, (void *)mode_tier_point,
    (void *)mode_tier_validate, (void *)mode_tier_validatedd,
    (void *)mode_slice,
};

/* ─────────────────────── tier-2 parameters ────────────────────────── */
static long T2_B = 64;                    /* frequency bins (CLI --bins) */
static slong T2_E = 33;                   /* envelope degree (CLI --edeg) */
static const double T2_EPS_ENV = 5e-15;   /* envelope remainder budget    */
static const double T2_NU_LO = 0.34;      /* exact-double bin range start */
static const double T2_NU_HI = 6.7231;    /* covers ln(690992)/2          */

/* ─────────────────────── tier-2 ledger ────────────────────────────── */
typedef struct {
    long B; slong E;
    double binw;
    double *nuStar;               /* exact-double bin centers            */
    arb_struct *nuStarArb;        /* at WPHI                             */
    arb_struct *wAbs;             /* B*(D+1): nu*_b^m / m!               */
    /* per side */
    arb_struct *MP[2], *MQ[2];    /* 26*B per-(class,bin) mass sums      */
    double *deltaB[2];            /* B rigorous ub of |d_n| per bin      */
    long *cnt[2];                 /* 26*B member counts                  */
    long pairs[2];                /* nonempty (c,b) pairs                */
    arb_struct remR2[2][26], remI2[2][26];   /* tier-2 panel remainders  */
    double rEnvTot[2], tTot[2];   /* diagnostics (ub doubles)            */
    double HXsolved[2], HXused[2];
    long K[2];                    /* level-1 panels per super-panel      */
    double SWu[2];                /* super width in u (= K * wu)         */
    tierled_t view[2];            /* tierled view with tier-2 remainders */
} t2led_t;
static t2led_t T2;
static uint16_t *g_bin = NULL;    /* bin index per n (by ln-table mid)   */

/* geomTail(z, L) = rigorous upper enclosure of sum_{i>L} z^i / i!      */
static void geom_tail(arb_t res, const arb_t z, slong L, slong prec) {
    arb_t t, fac, den;
    arb_init(t); arb_init(fac); arb_init(den);
    arb_pow_ui(t, z, (ulong)(L + 1), prec);
    arb_fac_ui(fac, (ulong)(L + 1), prec);
    arb_div(t, t, fac, prec);
    /* den = 1 - z/(L+2); geometric majorant valid iff den > 0 */
    arb_div_ui(den, z, (ulong)(L + 2), prec);
    arb_sub_ui(den, den, 1, prec);
    arb_neg(den, den);
    if (arb_is_positive(den)) {
        arb_div(res, t, den, prec);
    } else {
        arb_exp(res, z, prec);        /* crude but rigorous fallback */
    }
    arb_clear(t); arb_clear(fac); arb_clear(den);
}

static void t2_build_bins(void) {
    g_bin = (uint16_t *)calloc(NTAB + 1, sizeof(uint16_t));
    if (!g_bin) { fprintf(stderr, "alloc failure\n"); exit(2); }
    T2.binw = (T2_NU_HI - T2_NU_LO) / (double)T2.B;
    T2.nuStar = (double *)malloc((size_t)T2.B * sizeof(double));
    T2.nuStarArb = (arb_struct *)malloc((size_t)T2.B * sizeof(arb_struct));
    for (long b = 0; b < T2.B; b++) {
        T2.nuStar[b] = T2_NU_LO + ((double)b + 0.5) * T2.binw;
        arb_init(T2.nuStarArb + b);
        arb_set_d(T2.nuStarArb + b, T2.nuStar[b]);   /* exact double */
    }
    for (unsigned long n = 2; n <= NTAB; n++) {
        double nu = 0.5 * arb_mid_d(g_lnn + n);
        long b = (long)floor((nu - T2_NU_LO) / T2.binw);
        if (b < 0) b = 0;
        if (b >= T2.B) b = T2.B - 1;
        g_bin[n] = (uint16_t)b;
    }
    /* carrier Taylor table wAbs[b][m] = nu*_b^m / m! (degree D) */
    const slong D1 = TC_DEG + 1;
    T2.wAbs = (arb_struct *)malloc((size_t)T2.B * D1 * sizeof(arb_struct));
    for (long b = 0; b < T2.B; b++) {
        arb_struct *w = T2.wAbs + b * D1;
        for (slong m = 0; m < D1; m++) arb_init(w + m);
        arb_one(w + 0);
        for (slong m = 1; m < D1; m++) {
            arb_mul(w + m, w + m - 1, T2.nuStarArb + b, PREC);
            arb_div_ui(w + m, w + m, (ulong)m, PREC);
        }
    }
}

/* rigorous per-side masses + remainder assembly + Hx solve */
static void t2led_build_side(int side) {
    const slong wp = PREC + 32;
    const cchart_t *ch = &g_chs[side];
    const unsigned long M = ch->M;
    const long B = T2.B;
    const slong E = T2_E;
    T2.MP[side] = (arb_struct *)malloc((size_t)26 * B * sizeof(arb_struct));
    T2.MQ[side] = (arb_struct *)malloc((size_t)26 * B * sizeof(arb_struct));
    T2.cnt[side] = (long *)calloc((size_t)26 * B, sizeof(long));
    T2.deltaB[side] = (double *)calloc((size_t)B, sizeof(double));
    for (long i = 0; i < 26 * B; i++) {
        arb_init(T2.MP[side] + i); arb_init(T2.MQ[side] + i);
    }
    arb_t nu, d, t;
    arb_init(nu); arb_init(d); arb_init(t);
    for (unsigned long n = 2; n <= M; n++) {
        int c = g_cls[n]; long b = g_bin[n];
        arb_mul_2exp_si(nu, g_lnn + n, -1);
        arb_sub(d, nu, T2.nuStarArb + b, wp);
        arb_abs(t, d);
        double du = arb_ub_d(t);
        if (du > T2.deltaB[side][b]) T2.deltaB[side][b] = du;
        arb_abs(t, ch->P + n);
        arb_add(T2.MP[side] + (slong)c * B + b, T2.MP[side] + (slong)c * B + b, t, wp);
        arb_abs(t, ch->Q + n);
        arb_add(T2.MQ[side] + (slong)c * B + b, T2.MQ[side] + (slong)c * B + b, t, wp);
        T2.cnt[side][(slong)c * B + b]++;
    }
    T2.pairs[side] = 0;
    for (long i = 0; i < 26 * B; i++)
        if (T2.cnt[side][i] > 0) T2.pairs[side]++;
    /* per-bin combined masses for the Hx solve */
    arb_struct *Mb = (arb_struct *)malloc((size_t)B * sizeof(arb_struct));
    for (long b = 0; b < B; b++) {
        arb_init(Mb + b);
        for (int c = 0; c < 26; c++) {
            arb_add(Mb + b, Mb + b, T2.MP[side] + (slong)c * B + b, wp);
            arb_add(Mb + b, Mb + b, T2.MQ[side] + (slong)c * B + b, wp);
        }
    }
    arb_t facE, dl, hh, sum;
    arb_init(facE); arb_init(dl); arb_init(hh); arb_init(sum);
    arb_fac_ui(facE, (ulong)(E + 1), wp);
    /* bisect the largest Hx with sum_b Mb (delta_b Hx)^{E+1}/(E+1)! <= eps */
    double lo = g_tls[side].hX, hi = 4000.0;
    for (int it = 0; it < 60; it++) {
        double mid = 0.5 * (lo + hi);
        arb_zero(sum);
        for (long b = 0; b < B; b++) {
            if (T2.deltaB[side][b] <= 0) continue;
            arb_set_d(dl, T2.deltaB[side][b]);
            arb_set_d(hh, mid);
            arb_mul(dl, dl, hh, wp);
            arb_pow_ui(dl, dl, (ulong)(E + 1), wp);
            arb_addmul(sum, Mb + b, dl, wp);
        }
        arb_div(sum, sum, facE, wp);
        if (arb_ub_d(sum) <= T2_EPS_ENV) lo = mid; else hi = mid;
    }
    T2.HXsolved[side] = lo;
    if (lo <= g_tls[side].hX * 1.5) {
        fprintf(stderr, "TIER2 OBSTRUCTION side %d: solved super half-width "
                "%.3f <= 1.5x panel half-width %.3f (chirp models too wide "
                "for bins=%ld edeg=%ld). ABORT.\n", side, lo,
                g_tls[side].hX, B, (long)E);
        exit(3);
    }
    double wu = g_tls[side].wu;
    double twopi_wu = 2.0 * 3.14159265358979324 * wu;
    long K = (long)floor(T2.HXsolved[side] / twopi_wu);
    if (K < 2) { fprintf(stderr, "TIER2: K < 2. ABORT.\n"); exit(3); }
    T2.K[side] = K;
    T2.SWu[side] = (double)K * wu;
    /* realized half-width (outward): Hx_used = ub(4pi * K*wu / 2) */
    arb_t Hx;
    arb_init(Hx);
    arb_set_d(Hx, T2.SWu[side] * 0.5);
    arb_mul(Hx, Hx, g_4pi, wp);
    T2.HXused[side] = arb_ub_d(Hx);
    /* freeze per-class remainders at Hx_used */
    double rEnvTot = 0, tTot = 0;
    arb_t hXa, gt, tf, tj, ex, facj;
    arb_init(hXa); arb_init(gt); arb_init(tf); arb_init(tj);
    arb_init(ex); arb_init(facj);
    arb_set_d(hXa, g_tls[side].hX);
    /* per-bin factors: env = (delta Hx)^{E+1}/(E+1)!;
       tFac = e^{delta Hx} sum_{j<=E} (delta h)^j/j! geomTail(nu* h, D-j) */
    arb_struct *envF = (arb_struct *)malloc((size_t)B * sizeof(arb_struct));
    arb_struct *tF = (arb_struct *)malloc((size_t)B * sizeof(arb_struct));
    for (long b = 0; b < B; b++) {
        arb_init(envF + b); arb_init(tF + b);
        if (T2.cnt[side][b] == 0) { /* still compute; masses may be 0 anyway */ }
        arb_set_d(dl, T2.deltaB[side][b]);
        arb_mul(ex, dl, Hx, wp);
        arb_pow_ui(envF + b, ex, (ulong)(E + 1), wp);
        arb_div(envF + b, envF + b, facE, wp);
        arb_exp(ex, ex, wp);                       /* e^{delta Hx} */
        arb_zero(tF + b);
        arb_t dh, dhj;
        arb_init(dh); arb_init(dhj);
        arb_mul(dh, dl, hXa, wp);                  /* delta * h */
        arb_one(dhj);
        arb_t nz;
        arb_init(nz);
        arb_mul(nz, T2.nuStarArb + b, hXa, wp);    /* nu* h */
        for (slong j = 0; j <= E; j++) {
            if (j > 0) {
                arb_mul(dhj, dhj, dh, wp);
                arb_div_ui(dhj, dhj, (ulong)j, wp);
            }
            geom_tail(gt, nz, TC_DEG - j, wp);
            arb_addmul(tF + b, dhj, gt, wp);
        }
        arb_mul(tF + b, tF + b, ex, wp);
        arb_clear(dh); arb_clear(dhj); arb_clear(nz);
    }
    for (int c = 0; c < 26; c++) {
        arb_init(&T2.remR2[side][c]); arb_init(&T2.remI2[side][c]);
        arb_t re, te, ri, ti;
        arb_init(re); arb_init(te); arb_init(ri); arb_init(ti);
        for (long b = 0; b < B; b++) {
            if (T2.cnt[side][(slong)c * B + b] == 0) continue;
            arb_addmul(re, T2.MP[side] + (slong)c * B + b, envF + b, wp);
            arb_addmul(te, T2.MP[side] + (slong)c * B + b, tF + b, wp);
            arb_addmul(ri, T2.MQ[side] + (slong)c * B + b, envF + b, wp);
            arb_addmul(ti, T2.MQ[side] + (slong)c * B + b, tF + b, wp);
        }
        arb_add(&T2.remR2[side][c], re, te, wp);
        arb_add(&T2.remI2[side][c], ri, ti, wp);
        rEnvTot += arb_ub_d(re) + arb_ub_d(ri);
        tTot += arb_ub_d(te) + arb_ub_d(ti);
        arb_clear(re); arb_clear(te); arb_clear(ri); arb_clear(ti);
    }
    T2.rEnvTot[side] = rEnvTot;
    T2.tTot[side] = tTot;
    /* tierled view: identical geometry + ledgers, tier-2 remainders */
    memcpy(&T2.view[side], &g_tls[side], sizeof(tierled_t));
    for (int c = 0; c < 26; c++) {
        arb_init(T2.view[side].remR + c);
        arb_init(T2.view[side].remI + c);
        arb_set(T2.view[side].remR + c, &T2.remR2[side][c]);
        arb_set(T2.view[side].remI + c, &T2.remI2[side][c]);
    }
    for (long b = 0; b < B; b++) { arb_clear(envF + b); arb_clear(tF + b); }
    free(envF); free(tF);
    for (long b = 0; b < B; b++) arb_clear(Mb + b);
    free(Mb);
    arb_clear(nu); arb_clear(d); arb_clear(t);
    arb_clear(facE); arb_clear(dl); arb_clear(hh); arb_clear(sum);
    arb_clear(Hx); arb_clear(hXa); arb_clear(gt); arb_clear(tf); arb_clear(tj);
    arb_clear(ex); arb_clear(facj);
}

static void t2_setup(void) {
    if (T2_E > TC_DEG) { fprintf(stderr, "edeg > degree unsupported\n"); exit(2); }
    tier_setup();
    T2.B = T2_B; T2.E = T2_E;
    t2_build_bins();
    t2led_build_side(0);
    t2led_build_side(1);
}

/* ─────────────────────── super-panel model ────────────────────────── */
typedef struct {
    double X0u;
    arb_struct *e;    /* 26*B*4*(E+1): [Pre][Pim][Qre][Qim] per (c,b) */
} t2super_t;

static void t2super_init(t2super_t *s) {
    slong tot = 26 * T2.B * 4 * (T2_E + 1);
    s->e = (arb_struct *)malloc((size_t)tot * sizeof(arb_struct));
    if (!s->e) { fprintf(stderr, "alloc failure\n"); exit(2); }
    for (slong i = 0; i < tot; i++) arb_init(s->e + i);
}
static void t2super_clear(t2super_t *s) {
    slong tot = 26 * T2.B * 4 * (T2_E + 1);
    for (slong i = 0; i < tot; i++) arb_clear(s->e + i);
    free(s->e);
}

/* ONE O(N) pass: degree-E envelope Taylor models of all (class,bin)
   pairs at X0 = x(X0u). c_m^{P/Q} = sum amp (i d)^m/m! e^{i d X0}. */
static void t2super_build(t2super_t *s, int side, double X0u, slong Edeg) {
    const cchart_t *ch = &g_chs[side];
    const unsigned long M = ch->M;
    const long B = T2.B;
    const slong E1 = Edeg + 1;
    s->X0u = X0u;
    slong tot = 26 * B * 4 * (T2_E + 1);
    for (slong i = 0; i < tot; i++) arb_zero(s->e + i);
    arb_t x0, nu, d, ph, sn, cs, pcs, psn, qcs, qsn, f;
    arb_init(x0); arb_init(nu); arb_init(d); arb_init(ph);
    arb_init(sn); arb_init(cs); arb_init(pcs); arb_init(psn);
    arb_init(qcs); arb_init(qsn); arb_init(f);
    x_from_u(x0, X0u);
    for (unsigned long n = 2; n <= M; n++) {
        int c = g_cls[n]; long b = g_bin[n];
        arb_mul_2exp_si(nu, g_lnn + n, -1);
        arb_sub(d, nu, T2.nuStarArb + b, WPHI);
        arb_mul(ph, d, x0, WPHI);
        arb_sin_cos(sn, cs, ph, PREC);
        arb_mul(pcs, ch->P + n, cs, PREC);
        arb_mul(psn, ch->P + n, sn, PREC);
        arb_mul(qcs, ch->Q + n, cs, PREC);
        arb_mul(qsn, ch->Q + n, sn, PREC);
        arb_struct *base = s->e + ((slong)c * B + b) * 4 * (T2_E + 1);
        arb_struct *Pre = base, *Pim = base + (T2_E + 1),
                   *Qre = base + 2 * (T2_E + 1), *Qim = base + 3 * (T2_E + 1);
        arb_one(f);
        for (slong m = 0; m < E1; m++) {
            if (m > 0) arb_mul(f, f, d, PREC);
            switch (m & 3) {
            case 0: arb_addmul(Pre + m, f, pcs, PREC);
                    arb_addmul(Pim + m, f, psn, PREC);
                    arb_addmul(Qre + m, f, qcs, PREC);
                    arb_addmul(Qim + m, f, qsn, PREC); break;
            case 1: arb_submul(Pre + m, f, psn, PREC);
                    arb_addmul(Pim + m, f, pcs, PREC);
                    arb_submul(Qre + m, f, qsn, PREC);
                    arb_addmul(Qim + m, f, qcs, PREC); break;
            case 2: arb_submul(Pre + m, f, pcs, PREC);
                    arb_submul(Pim + m, f, psn, PREC);
                    arb_submul(Qre + m, f, qcs, PREC);
                    arb_submul(Qim + m, f, qsn, PREC); break;
            default: arb_addmul(Pre + m, f, psn, PREC);
                     arb_submul(Pim + m, f, pcs, PREC);
                     arb_addmul(Qre + m, f, qsn, PREC);
                     arb_submul(Qim + m, f, qcs, PREC); break;
            }
        }
    }
    /* apply 1/m! */
    for (slong i = 0; i < 26 * B; i++) {
        arb_struct *base = s->e + i * 4 * (T2_E + 1);
        for (int comp = 0; comp < 4; comp++)
            for (slong m = 1; m < E1; m++)
                arb_mul(base + comp * (T2_E + 1) + m,
                        base + comp * (T2_E + 1) + m, g_invfact + m, PREC);
    }
    arb_clear(x0); arb_clear(nu); arb_clear(d); arb_clear(ph);
    arb_clear(sn); arb_clear(cs); arb_clear(pcs); arb_clear(psn);
    arb_clear(qcs); arb_clear(qsn); arb_clear(f);
}

/* per-worker reconstruction scratch */
typedef struct {
    arb_struct *sh;    /* 4*(E+1) shifted+rotated envelope components */
    arb_struct *S1, *S2; /* (D+1) convolution outputs                 */
} t2scr_t;
static void t2scr_init(t2scr_t *w) {
    slong E1 = T2_E + 1, D1 = TC_DEG + 1;
    w->sh = (arb_struct *)malloc((size_t)4 * E1 * sizeof(arb_struct));
    w->S1 = (arb_struct *)malloc((size_t)D1 * sizeof(arb_struct));
    w->S2 = (arb_struct *)malloc((size_t)D1 * sizeof(arb_struct));
    for (slong i = 0; i < 4 * E1; i++) arb_init(w->sh + i);
    for (slong i = 0; i < D1; i++) { arb_init(w->S1 + i); arb_init(w->S2 + i); }
}
static void t2scr_clear(t2scr_t *w) {
    slong E1 = T2_E + 1, D1 = TC_DEG + 1;
    for (slong i = 0; i < 4 * E1; i++) arb_clear(w->sh + i);
    for (slong i = 0; i < D1; i++) { arb_clear(w->S1 + i); arb_clear(w->S2 + i); }
    free(w->sh); free(w->S1); free(w->S2);
}

/* reconstruct the level-1 degree-D panel model at panel center u_p from
   the super-panel envelope models (shift + rotate + real mullow + carrier) */
static void t2panel_reconstruct(tpanel_t *pn, int side, const t2super_t *sup,
                                double u_p, t2scr_t *w) {
    const cchart_t *ch = &g_chs[side];
    const long B = T2.B;
    const slong E = T2_E, E1 = T2_E + 1, D1 = TC_DEG + 1;
    pn->u0 = u_p;
    for (slong i = 0; i < 26 * D1; i++) {
        arb_zero(pn->cR + i); arb_zero(pn->cI + i);
    }
    arb_t dX, xp, ph, ccs, csn, tswap;
    arb_init(dX); arb_init(xp); arb_init(ph);
    arb_init(ccs); arb_init(csn); arb_init(tswap);
    { /* dX = 4pi (u_p - X0u), exact doubles enclosed */
        arb_t t2a; arb_init(t2a);
        arb_set_d(dX, u_p); arb_set_d(t2a, sup->X0u);
        arb_sub(dX, dX, t2a, WPHI);
        arb_mul(dX, dX, g_4pi, WPHI);
        arb_clear(t2a);
    }
    { /* structural guard: |dX| must be inside the certified super width */
        arb_t adx; arb_init(adx); arb_abs(adx, dX);
        if (arb_ub_d(adx) > T2.HXused[side] * (1.0 + 1e-9)) {
            fprintf(stderr, "SUPER-PANEL RANGE VIOLATION |dX|=%.6e > Hx=%.6e "
                    "(tiling bug). ABORT.\n", arb_ub_d(adx), T2.HXused[side]);
            exit(4);
        }
        arb_clear(adx);
    }
    x_from_u(xp, u_p);
    for (long b = 0; b < B; b++) {
        /* carrier e^{i nu*_b x_p} (phase at WPHI, like all phasors) */
        int any = 0;
        for (int c = 0; c < 26; c++)
            if (T2.cnt[side][(slong)c * B + b] > 0) { any = 1; break; }
        if (!any) continue;
        arb_mul(ph, T2.nuStarArb + b, xp, WPHI);
        arb_sin_cos(csn, ccs, ph, PREC);
        const arb_struct *wA = T2.wAbs + b * D1;
        for (int c = 0; c < 26; c++) {
            if (T2.cnt[side][(slong)c * B + b] == 0) continue;
            const arb_struct *base =
                sup->e + ((slong)c * B + b) * 4 * (T2_E + 1);
            /* copy + Taylor shift by dX (exact ball op), per component */
            for (int comp = 0; comp < 4; comp++) {
                arb_struct *dst = w->sh + comp * E1;
                for (slong m = 0; m < E1; m++)
                    arb_set(dst + m, base + comp * (T2_E + 1) + m);
                _arb_poly_taylor_shift(dst, dX, E1, PREC);
            }
            /* rotate q~_j = (-i)^j q_j in place (pairwise swap/sign) */
            for (int pair = 0; pair < 2; pair++) {
                arb_struct *re = w->sh + (2 * pair) * E1;
                arb_struct *im = w->sh + (2 * pair + 1) * E1;
                for (slong j = 0; j <= E; j++) {
                    switch (j & 3) {
                    case 0: break;
                    case 1: arb_set(tswap, re + j);
                            arb_set(re + j, im + j);
                            arb_neg(im + j, tswap); break;
                    case 2: arb_neg(re + j, re + j);
                            arb_neg(im + j, im + j); break;
                    default: arb_set(tswap, re + j);
                             arb_neg(re + j, im + j);
                             arb_set(im + j, tswap); break;
                    }
                }
            }
            /* P series: S = wAbs * q~^P; cR[k] += Re(carrier i^k S_k) */
            _arb_poly_mullow(w->S1, wA, D1, w->sh + 0 * E1, E1, D1, PREC);
            _arb_poly_mullow(w->S2, wA, D1, w->sh + 1 * E1, E1, D1, PREC);
            arb_struct *cR = pn->cR + (slong)c * D1;
            for (slong k = 0; k < D1; k++) {
                switch (k & 3) {
                case 0: arb_addmul(cR + k, ccs, w->S1 + k, PREC);
                        arb_submul(cR + k, csn, w->S2 + k, PREC); break;
                case 1: arb_submul(cR + k, csn, w->S1 + k, PREC);
                        arb_submul(cR + k, ccs, w->S2 + k, PREC); break;
                case 2: arb_submul(cR + k, ccs, w->S1 + k, PREC);
                        arb_addmul(cR + k, csn, w->S2 + k, PREC); break;
                default: arb_addmul(cR + k, csn, w->S1 + k, PREC);
                         arb_addmul(cR + k, ccs, w->S2 + k, PREC); break;
                }
            }
            /* Q series: cI[k] += Im(carrier i^k S_k) */
            _arb_poly_mullow(w->S1, wA, D1, w->sh + 2 * E1, E1, D1, PREC);
            _arb_poly_mullow(w->S2, wA, D1, w->sh + 3 * E1, E1, D1, PREC);
            arb_struct *cI = pn->cI + (slong)c * D1;
            for (slong k = 0; k < D1; k++) {
                switch (k & 3) {
                case 0: arb_addmul(cI + k, ccs, w->S2 + k, PREC);
                        arb_addmul(cI + k, csn, w->S1 + k, PREC); break;
                case 1: arb_submul(cI + k, csn, w->S2 + k, PREC);
                        arb_addmul(cI + k, ccs, w->S1 + k, PREC); break;
                case 2: arb_submul(cI + k, ccs, w->S2 + k, PREC);
                        arb_submul(cI + k, csn, w->S1 + k, PREC); break;
                default: arb_addmul(cI + k, csn, w->S2 + k, PREC);
                         arb_submul(cI + k, ccs, w->S1 + k, PREC); break;
                }
            }
        }
    }
    /* n = 1: exact constant term (nu = 0), class 0 */
    arb_add(pn->cR + 0, pn->cR + 0, ch->P + 1, PREC);
    arb_clear(dX); arb_clear(xp); arb_clear(ph);
    arb_clear(ccs); arb_clear(csn); arb_clear(tswap);
}

/* place a super-panel around a single target panel center (validation
   modes): off-center placement so large |dX| shifts are exercised */
static double t2_place_super(int side, double u_p, double frac) {
    double half = 0.5 * T2.SWu[side] - 0.75 * g_tls[side].wu;
    if (half < 0) half = 0;
    return u_p + frac * half;
}

/* ─────────────────────── ledger2 mode ─────────────────────────────── */
static void print_t2ledger_json(FILE *f) {
    fprintf(f, "  \"tier2Ledger\": {\"bins\": %ld, \"envelopeDegree\": %ld, "
            "\"envBudget\": %.3e,\n", T2.B, (long)T2_E, T2_EPS_ENV);
    for (int s = 0; s < 2; s++) {
        double dmax = 0;
        for (long b = 0; b < T2.B; b++)
            if (T2.deltaB[s][b] > dmax) dmax = T2.deltaB[s][b];
        double rmax = 0;
        for (int c = 0; c < 26; c++) {
            double v = arb_ub_d(&T2.remR2[s][c]) + arb_ub_d(&T2.remI2[s][c]);
            if (v > rmax) rmax = v;
        }
        fprintf(f, "    \"side%d\": {\"chartM\": %lu, \"HXsolved\": %.4f, "
                "\"HXused\": %.4f, \"panelsPerSuper\": %ld, \"superWidthU\": %.6f,\n"
                "      \"deltaMax\": %.6f, \"pairsNonempty\": %ld, "
                "\"rEnvTotal\": %.3e, \"kTailTotal\": %.3e, "
                "\"maxClassRem2\": %.3e, \"level1RemTarget\": 1e-14}%s\n",
                s, g_chs[s].M, T2.HXsolved[s], T2.HXused[s], T2.K[s],
                T2.SWu[s], dmax, T2.pairs[s], T2.rEnvTot[s], T2.tTot[s],
                rmax, s == 0 ? "," : "");
    }
    fprintf(f, "  },\n");
}

static int mode_t2_ledger(void) {
    t2_setup();
    printf("{\n");
    print_ledger_json(stdout);
    print_t2ledger_json(stdout);
    int fails = 0;
    for (int s = 0; s < 2; s++) {
        if (!(T2.K[s] >= 4)) fails++;
        if (!(T2.rEnvTot[s] <= T2_EPS_ENV * 1.0001)) fails++;
        if (!(T2.HXused[s] <= T2.HXsolved[s])) fails++;
    }
    printf("  \"crossCheck\": \"%s\",\n", fails ? "FAIL" : "PASS");
    printf("  \"honesty\": \"rigorous Arb frequency-bin/chirp second-level "
           "ledger; remainders are exact per-(class,bin) mass sums; promotes "
           "no bound; NO QED\"\n}\n");
    return fails ? 1 : 0;
}

/* ─────────────────────── scan2 mode (empirical smoothness) ────────── */
static int mode_t2_scan(void) {
    t2_setup();
    int side = 0;
    const slong D1 = TC_DEG + 1;
    printf("{\n  \"mode\": \"scan2\", \"prec\": %ld, \"degree\": %ld, "
           "\"bins\": %ld, \"edeg\": %ld,\n",
           (long)PREC, (long)TC_DEG, T2.B, (long)T2_E);
    /* (1) RAW level-1 coefficient variation across panel centers */
    etmp_t tm; etmp_init(&tm);
    tpanel_t p1, p2; tpanel_init(&p1); tpanel_init(&p2);
    double u0 = 50000.25, du = 0.1;   /* 0.1 u = 1.2566 x-units */
    tpanel_build(&p1, &g_chs[side], u0, &tm);
    tpanel_build(&p2, &g_chs[side], u0 + du, &tm);
    double dxu = du * 4.0 * 3.14159265358979324;
    printf("  \"rawCoefficientVariation\": {\"u0\": %.2f, \"duX\": %.6f, \"perXUnit\": [\n", u0, dxu);
    int kprobe[4] = { 0, 1, 5, 40 };
    for (int i = 0; i < 4; i++) {
        int k = kprobe[i];
        /* class 25 (n even, largest mass class), coefficient k */
        double a1 = arb_mid_d(p1.cR + 25 * D1 + k);
        double a2 = arb_mid_d(p2.cR + 25 * D1 + k);
        double scale = fabs(a1) > fabs(a2) ? fabs(a1) : fabs(a2);
        printf("    {\"k\": %d, \"relRatePerX\": %.4f}%s\n", k,
               scale > 0 ? fabs(a2 - a1) / scale / dxu : 0.0,
               i < 3 ? "," : "");
    }
    printf("  ]},\n");
    /* (2) derotated envelope variation: E=0 super models at two centers */
    t2super_t s1, s2; t2super_init(&s1); t2super_init(&s2);
    double DU = 5.0;                   /* 62.83 x-units apart */
    t2super_build(&s1, side, u0, 0);
    t2super_build(&s2, side, u0 + DU, 0);
    double dxX = DU * 4.0 * 3.14159265358979324;
    double maxRate = 0, maxRateOverBound = 0;
    for (int c = 0; c < 26; c++)
        for (long b = 0; b < T2.B; b++) {
            if (T2.cnt[side][(slong)c * T2.B + b] == 0) continue;
            slong off = ((slong)c * T2.B + b) * 4 * (T2_E + 1);
            double dre = arb_mid_d(s2.e + off) - arb_mid_d(s1.e + off);
            double dim = arb_mid_d(s2.e + off + (T2_E + 1)) -
                         arb_mid_d(s1.e + off + (T2_E + 1));
            double rate = sqrt(dre * dre + dim * dim) / dxX;
            double bound = arb_ub_d(T2.MP[side] + (slong)c * T2.B + b) *
                           T2.deltaB[side][b];
            if (rate > maxRate) maxRate = rate;
            if (bound > 0 && rate / bound > maxRateOverBound)
                maxRateOverBound = rate / bound;
        }
    printf("  \"envelopeVariation\": {\"spanX\": %.4f, "
           "\"maxAbsRatePerX\": %.6e, \"maxRateOverDeltaMassBound\": %.4f},\n",
           dxX, maxRate, maxRateOverBound);
    printf("  \"measuredSmoothnessVerdict\": \"raw level-1 coefficients vary "
           "at phase scale (order-1 relative per x-unit); derotated bin "
           "envelopes vary at the delta_b scale and stay inside the rigorous "
           "delta*mass rate bound: the chirp decomposition is confirmed and "
           "the super-panel span is set by the rigorous envelope Lagrange "
           "masses (ledger2)\",\n");
    print_t2ledger_json(stdout);
    printf("  \"honesty\": \"measurement only (midpoint diffs); span choice "
           "is frozen from the rigorous ledger, not from this scan; NO QED\"\n}\n");
    t2super_clear(&s1); t2super_clear(&s2);
    tpanel_clear(&p1); tpanel_clear(&p2);
    etmp_clear(&tm);
    return 0;
}

/* ─────────────────────── panel comparison (validation a) ──────────────
   Criteria (per random panel):
   (1) raw coefficient midpoint agreement: max_k |mid(C2_k) - mid(C1_k)|
       reported and gated at 1e-15 (measured ~1e-19: the reconstruction
       telescopes the same Taylor coefficients up to ball rounding);
   (2) per-class-series MODEL agreement within the certified remainders:
       both models (each with its own remainder ball attached) enclose the
       same true class sum, so their evaluated midpoints must agree within
       the sum of their total radii, at every probed offset — a rigorous
       consequence that FAILS if either remainder is dishonest;
   (3) full containment of the direct O(N) Arb point ball by the
       reconstructed panel evaluation (all 54 components). */
static int t2_compare_panel(int side, double u_p, double frac, int verbose,
                            double *maxCoefDev, double *maxClassDevOverRad) {
    const slong D1 = TC_DEG + 1;
    static t2super_t sup;
    static t2scr_t scr;
    static tpanel_t pnD, pnR;
    static etmp_t tmA, tmB;
    static int inited = 0;
    if (!inited) {
        t2super_init(&sup); t2scr_init(&scr);
        tpanel_init(&pnD); tpanel_init(&pnR);
        etmp_init(&tmA); etmp_init(&tmB);
        inited = 1;
    }
    double X0u = t2_place_super(side, u_p, frac);
    t2super_build(&sup, side, X0u, T2_E);
    t2panel_reconstruct(&pnR, side, &sup, u_p, &scr);
    tpanel_build(&pnD, &g_chs[side], u_p, &tmA);
    int bad = 0;
    for (int c = 0; c < 26; c++) {
        for (slong k = 0; k < D1; k++) {
            double dR = fabs(arb_mid_d(pnR.cR + c * D1 + k) -
                             arb_mid_d(pnD.cR + c * D1 + k));
            double dI = fabs(arb_mid_d(pnR.cI + c * D1 + k) -
                             arb_mid_d(pnD.cI + c * D1 + k));
            if (dR > *maxCoefDev) *maxCoefDev = dR;
            if (dI > *maxCoefDev) *maxCoefDev = dI;
            if (dR > 1e-15 || dI > 1e-15) bad++;
        }
    }
    static eres_t rT, rD;
    static arb_struct *dxpow = NULL;
    static arb_t x;
    static int einit = 0;
    if (!einit) {
        eres_init(&rT); eres_init(&rD);
        dxpow = (arb_struct *)malloc((size_t)D1 * sizeof(arb_struct));
        for (slong k = 0; k < D1; k++) arb_init(dxpow + k);
        arb_init(x);
        einit = 1;
    }
    double offs[3] = { 0.0, 0.44, -0.91 };
    for (int i = 0; i < 3; i++) {
        double uc = u_p + offs[i] * g_tls[side].wu * 0.5;
        /* tier-2 model eval (class sums left in tmA.ScR/ScI) */
        tpanel_eval(&pnR, &g_chs[side], &T2.view[side], uc, &rT, &tmA, dxpow);
        /* level-1 model eval (class sums left in tmB.ScR/ScI) */
        tpanel_eval(&pnD, &g_chs[side], &g_tls[side], uc, &rD, &tmB, dxpow);
        for (int c = 0; c < 26; c++) {
            double devR = fabs(arb_mid_d(tmA.ScR + c) - arb_mid_d(tmB.ScR + c));
            double devI = fabs(arb_mid_d(tmA.ScI + c) - arb_mid_d(tmB.ScI + c));
            double radR = arb_rad_d(tmA.ScR + c) + arb_rad_d(tmB.ScR + c);
            double radI = arb_rad_d(tmA.ScI + c) + arb_rad_d(tmB.ScI + c);
            if (radR > 0 && devR / radR > *maxClassDevOverRad)
                *maxClassDevOverRad = devR / radR;
            if (radI > 0 && devI / radI > *maxClassDevOverRad)
                *maxClassDevOverRad = devI / radI;
            if (devR > radR || devI > radI) bad += 100;
        }
        /* containment of the direct O(N) point ball */
        x_from_u(x, uc);
        eval_point(&g_chs[side], x, &rD, &tmB);
        int ok = arb_contains(rT.pilot, rD.pilot) &&
                 arb_contains(rT.absE97, rD.absE97) &&
                 arb_contains(rT.E97re, rD.E97re) &&
                 arb_contains(rT.E97im, rD.E97im);
        for (int j = 0; j < 25; j++)
            ok = ok && arb_contains(rT.Dre[j], rD.Dre[j]) &&
                       arb_contains(rT.Dim[j], rD.Dim[j]);
        if (!ok) bad += 1000;
        if (verbose)
            fprintf(stderr, "  offset %+0.2f: %s pilot %.16f radT %.2e "
                    "(direct %.16f)\n", offs[i], ok ? "CONTAINED" : "FAIL",
                    arb_mid_d(rT.pilot), arb_rad_d(rT.pilot),
                    arb_mid_d(rD.pilot));
    }
    return bad;
}

static int mode_t2_selfcheck(void) {
    t2_setup();
    printf("bins=%ld edeg=%ld degree=%ld prec=%ld\n", T2.B, (long)T2_E,
           (long)TC_DEG, (long)PREC);
    for (int s = 0; s < 2; s++)
        printf("side%d: HXused=%.3f panelsPerSuper=%ld superWidthU=%.4f "
               "rEnv=%.3e kTail=%.3e pairs=%ld\n", s, T2.HXused[s], T2.K[s],
               T2.SWu[s], T2.rEnvTot[s], T2.tTot[s], T2.pairs[s]);
    double maxDev = 0, maxCR = 0;
    double t0 = now_wall();
    int bad = t2_compare_panel(0, 12345.25, 0.83, 1, &maxDev, &maxCR);
    double t1 = now_wall();
    printf("panel compare (side 0, u=12345.25, far off-center super): "
           "maxCoefDev=%.3e maxClassDevOverRad=%.3e wall=%.1fs -> %s\n",
           maxDev, maxCR, t1 - t0, bad ? "FAIL" : "PASS");
    int bad2 = t2_compare_panel(1, 700000.5, -0.79, 1, &maxDev, &maxCR);
    printf("panel compare (side 1, u=700000.5): %s\n", bad2 ? "FAIL" : "PASS");
    printf(bad + bad2 ? "TIER2 SELFCHECK: FAILURES\n" : "TIER2 SELFCHECK: ALL PASS\n");
    return (bad + bad2) ? 1 : 0;
}

static int mode_t2_panels(int np, unsigned seed) {
    t2_setup();
    srand(seed);
    double twoN1 = (double)(2 * NWIN + 1);
    double maxDev = 0, maxCR = 0;
    int fails = 0;
    for (int i = 0; i < np; i++) {
        int side = rand() & 1;
        double u_p = 1.0 + ((double)rand() / RAND_MAX) * (twoN1 - 2.0);
        double frac = (((double)rand() / RAND_MAX) - 0.5) * 1.9;
        int bad = t2_compare_panel(side, u_p, frac, 0, &maxDev, &maxCR);
        if (bad) fails++;
        fprintf(stderr, "[%s] panel %d/%d side=%d u=%.3f frac=%+.2f "
                "maxCoefDev=%.3e maxClassDevOverRad=%.3e\n",
                bad ? "FAIL" : "PASS", i + 1, np, side, u_p, frac,
                maxDev, maxCR);
    }
    printf("{ \"mode\": \"tier2-panels\", \"panels\": %d, \"seed\": %u, "
           "\"failures\": %d,\n  \"maxCoefficientMidDev\": %.3e, "
           "\"maxClassSeriesDevOverRadSum\": %.3e,\n"
           "  \"criterion\": \"per coefficient |dMid| <= 1e-15 (measured "
           "~1e-19); per class series |dMid(eval)| <= radSum (models with "
           "certified remainders enclose the same truth); 3-offset "
           "direct-Arb-ball containment of all 54 components\" }\n",
           np, seed, fails, maxDev, maxCR);
    return fails ? 1 : 0;
}

/* ─────────────────────── validate2 / validatedd2 ──────────────────── */
static int mode_t2_validate(int npts, unsigned seed) {
    t2_setup();
    double twoN1 = (double)(2 * NWIN + 1);
    eres_t rT, rD; eres_init(&rT); eres_init(&rD);
    etmp_t tm; etmp_init(&tm);
    arb_struct *dxpow = (arb_struct *)malloc((size_t)(TC_DEG + 1) * sizeof(arb_struct));
    for (slong k = 0; k <= TC_DEG; k++) arb_init(dxpow + k);
    tpanel_t pn; tpanel_init(&pn);
    t2super_t sup; t2super_init(&sup);
    t2scr_t scr; t2scr_init(&scr);
    arb_t x; arb_init(x);
    srand(seed);
    int fails = 0;
    double maxDevP = 0, maxDevE = 0, maxRadT = 0, maxTel = 0;
    for (int i = 0; i < npts; i++) {
        double w; int side;
        if (i == 0) { w = 0.52447003038; side = 0; }       /* pilot witness */
        else if (i == 1) { w = 0.053273326334; side = 1; } /* |E97| witness */
        else if (i == 2) { w = 1.0; side = 1; }            /* seam */
        else { w = (double)rand() / RAND_MAX; side = rand() & 1; }
        double uc = w * twoN1;
        double offP = (((double)rand() / RAND_MAX) - 0.5) * 0.9;
        double u_p = uc + offP * g_tls[side].wu * 0.5;   /* point off-center */
        double frac = (((double)rand() / RAND_MAX) - 0.5) * 1.9;
        double X0u = t2_place_super(side, u_p, frac);    /* panel off-center */
        t2super_build(&sup, side, X0u, T2_E);
        t2panel_reconstruct(&pn, side, &sup, u_p, &scr);
        tpanel_eval(&pn, &g_chs[side], &T2.view[side], uc, &rT, &tm, dxpow);
        x_from_u(x, uc);
        eval_point(&g_chs[side], x, &rD, &tm);
        int ok = arb_contains(rT.pilot, rD.pilot) &&
                 arb_contains(rT.absE97, rD.absE97) &&
                 arb_contains(rT.E97re, rD.E97re) &&
                 arb_contains(rT.E97im, rD.E97im);
        for (int j = 0; j < 25; j++)
            ok = ok && arb_contains(rT.Dre[j], rD.Dre[j]) &&
                       arb_contains(rT.Dim[j], rD.Dim[j]);
        double dp = fabs(arb_mid_d(rT.pilot) - arb_mid_d(rD.pilot));
        double de = fabs(arb_mid_d(rT.absE97) - arb_mid_d(rD.absE97));
        if (dp > maxDevP) maxDevP = dp;
        if (de > maxDevE) maxDevE = de;
        if (arb_rad_d(rT.pilot) > maxRadT) maxRadT = arb_rad_d(rT.pilot);
        if (arb_rad_d(rT.telre) > maxTel) maxTel = arb_rad_d(rT.telre);
        if (!ok) fails++;
        fprintf(stderr, "[%s] %d/%d w=%.12f side=%d panelOff=%+.3f "
                "superFrac=%+.2f pilot %.16f radT %.2e\n",
                ok ? "PASS" : "FAIL", i + 1, npts, w, side, offP, frac,
                arb_mid_d(rT.pilot), arb_rad_d(rT.pilot));
    }
    printf("{ \"mode\": \"tier2-validate\", \"points\": %d, \"seed\": %u, "
           "\"containmentFailures\": %d,\n  \"maxMidDevPilot\": %.3e, "
           "\"maxMidDevE97\": %.3e, \"maxTaylorRad\": %.3e, "
           "\"maxTelescopeRad\": %.3e }\n",
           npts, seed, fails, maxDevP, maxDevE, maxRadT, maxTel);
    return fails ? 1 : 0;
}

static void mode_t2_validatedd(const char *file) {
    FILE *f = fopen(file, "r");
    if (!f) { fprintf(stderr, "cannot open %s\n", file); exit(2); }
    double ws[512]; int sides[512]; int np = 0;
    while (np < 512 && fscanf(f, "%lf %d", &ws[np], &sides[np]) == 2) np++;
    fclose(f);
    t2_setup();
    double twoN1 = (double)(2 * NWIN + 1);
    eres_t r; eres_init(&r);
    etmp_t tm; etmp_init(&tm);
    arb_struct *dxpow = (arb_struct *)malloc((size_t)(TC_DEG + 1) * sizeof(arb_struct));
    for (slong k = 0; k <= TC_DEG; k++) arb_init(dxpow + k);
    tpanel_t pn; tpanel_init(&pn);
    t2super_t sup; t2super_init(&sup);
    t2scr_t scr; t2scr_init(&scr);
    printf("[\n");
    for (int i = 0; i < np; i++) {
        double uc = ws[i] * twoN1;
        double u_p = uc + ((i % 3) - 1) * 0.29 * g_tls[sides[i]].wu;
        double X0u = t2_place_super(sides[i], u_p, ((i % 5) - 2) * 0.45);
        t2super_build(&sup, sides[i], X0u, T2_E);
        t2panel_reconstruct(&pn, sides[i], &sup, u_p, &scr);
        tpanel_eval(&pn, &g_chs[sides[i]], &T2.view[sides[i]], uc, &r, &tm, dxpow);
        print_point_json(stdout, ws[i], sides[i], &r, &g_chs[sides[i]]);
        printf("%s\n", i < np - 1 ? "," : "");
        fflush(stdout);
        fprintf(stderr, "validatedd2 %d/%d done (w=%.17g side=%d)\n",
                i + 1, np, ws[i], sides[i]);
    }
    printf("]\n");
}

/* ─────────────────────── tiercert2 slice ──────────────────────────── */
typedef struct {
    int side;
    double uLo, uHi;
    long nsupers;
    int reqP, reqE;
    long budgetCells, maxDepth;
    double minWidthU;
    long nextSuper;
    long supers, panels, cellsTaylor, cellsTierP;
    long tierB0, tierBsub, tierP, tierSseam;
    long failP, failE, pilotGapCells, unprocessed;
    double supUbP, supUbE, maxRad, maxTel;
    double superSec, reconSec, cellSec;
    tcell_t *failv; long failn, failcap;
    pthread_mutex_t mu;
} t2ctx_t;

static void t2_fail_push(t2ctx_t *c, tcell_t cl) {
    if (c->failn == c->failcap) {
        c->failcap = c->failcap ? c->failcap * 2 : 256;
        c->failv = (tcell_t *)realloc(c->failv, (size_t)c->failcap * sizeof(tcell_t));
        if (!c->failv) { fprintf(stderr, "alloc failure\n"); exit(2); }
    }
    if (c->failn < 100000) c->failv[c->failn++] = cl;
}

/* per-panel accumulators */
typedef struct {
    long cellsT, cellsP, b0, bsub, tp, seam, failP, failE, gap;
    double supP, supE, maxRad, maxTel;
} pacc_t;

/* the cell certification loop — logic mirrored VERBATIM from
   tier_worker in tier_cert.c (same criterion, same Tier-P fallback,
   same fail-closed recording); only the bookkeeping target differs */
static void t2_process_panel(t2ctx_t *cc, const tpanel_t *pn,
                             const cchart_t *ch, const tierled_t *tl,
                             double pa, double pb, eres_t *r, etmp_t *tm,
                             arb_struct *dxpow, tcell_t **pstack,
                             long *pscap, pacc_t *A) {
    arb_t x, hx, tot, t2v;
    arb_init(x); arb_init(hx); arb_init(tot); arb_init(t2v);
    arf_t ub; arf_init(ub);
    tcell_t *stack = *pstack; long scap = *pscap, sn = 0;
    double lipAliasUb = arb_ub_d(tl->lipAlias);
    double lipE97Ub = arb_ub_d(ch->lipE97);
    double thr = arf_get_d(g_thresh_lb, ARF_RND_DOWN);
    double fourpi = 4.0 * 3.14159265358979324;
    double u0 = pn->u0;
    /* center estimate -> root pre-split near the expected cell width */
    tpanel_eval(pn, ch, tl, u0, r, tm, dxpow);
    A->cellsT++;
    double vP = arb_ub_d(r->pilot), vE = arb_ub_d(r->absE97);
    double wEst = 1e300;
    if (cc->reqP) {
        double s = thr - vP;
        double w = s > 0 ? 2.0 * s / lipAliasUb / fourpi * 0.9 : (pb - pa) / 1024;
        if (w < wEst) wEst = w;
    }
    if (cc->reqE) {
        double s = thr - vE;
        double w = s > 0 ? 2.0 * s / lipE97Ub / fourpi * 0.9 : (pb - pa) / 1024;
        if (w < wEst) wEst = w;
    }
    long K0 = (long)ceil((pb - pa) / (wEst > 1e-12 ? wEst : 1e-12));
    if (K0 < 1) K0 = 1;
    if (K0 > 65536) K0 = 65536;
    for (long i = K0 - 1; i >= 0; i--) {
        tcell_t c0 = { pa + (pb - pa) * (double)i / (double)K0,
                       pa + (pb - pa) * (double)(i + 1) / (double)K0,
                       (uint8_t)cc->reqP, (uint8_t)cc->reqE, 0 };
        if (sn == scap) {
            scap = scap ? scap * 2 : 1024;
            stack = (tcell_t *)realloc(stack, (size_t)scap * sizeof(tcell_t));
            if (!stack) { fprintf(stderr, "alloc failure\n"); exit(2); }
        }
        stack[sn++] = c0;
    }
    while (sn > 0) {
        tcell_t cl = stack[--sn];
        int firstTry = (cl.depth == 0);
        double uc = 0.5 * (cl.ulo + cl.uhi);
        tpanel_eval(pn, ch, tl, uc, r, tm, dxpow);
        A->cellsT++;
        if (cl.ulo <= TC_SEAM_GUARD_U ||
            cl.uhi >= (double)(2 * NWIN + 1) - TC_SEAM_GUARD_U)
            A->seam++;
        arb_set_d(hx, cl.uhi);
        arb_set_d(t2v, cl.ulo);
        arb_sub(hx, hx, t2v, PREC);
        arb_mul(hx, hx, g_4pi, PREC);
        arb_mul_2exp_si(hx, hx, -1);
        int okP = !cl.needP, okE = !cl.needE;
        double ubPd = 0, ubEd = 0;
        if (cl.needP) {
            arb_set(tot, r->pilot);
            arb_addmul(tot, tl->lipAlias, hx, PREC);
            arb_get_ubound_arf(ub, tot, PREC);
            okP = arf_cmp(ub, g_thresh_lb) < 0;
            ubPd = arf_get_d(ub, ARF_RND_UP);
        }
        if (cl.needE) {
            arb_set(tot, r->absE97);
            arb_addmul(tot, ch->lipE97, hx, PREC);
            arb_get_ubound_arf(ub, tot, PREC);
            okE = arf_cmp(ub, g_thresh_lb) < 0;
            ubEd = arf_get_d(ub, ARF_RND_UP);
        }
        double rp = arb_rad_d(r->pilot), re2 = arb_rad_d(r->absE97);
        if (rp > A->maxRad) A->maxRad = rp;
        if (re2 > A->maxRad) A->maxRad = re2;
        double tr = arb_rad_d(r->telre), ti = arb_rad_d(r->telim);
        if (tr > A->maxTel) A->maxTel = tr;
        if (ti > A->maxTel) A->maxTel = ti;
        if (cl.needP && okP && ubPd > A->supP) A->supP = ubPd;
        if (cl.needE && okE && ubEd > A->supE) A->supE = ubEd;
        if (okP && okE) {
            if (firstTry) A->b0++; else A->bsub++;
            continue;
        }
        if (cl.depth < cc->maxDepth && (cl.uhi - cl.ulo) >= cc->minWidthU) {
            tcell_t a = { cl.ulo, uc, (uint8_t)!okP, (uint8_t)!okE, cl.depth + 1 };
            tcell_t b = { uc, cl.uhi, (uint8_t)!okP, (uint8_t)!okE, cl.depth + 1 };
            if (sn + 2 > scap) {
                scap = scap ? scap * 2 : 1024;
                stack = (tcell_t *)realloc(stack, (size_t)scap * sizeof(tcell_t));
                if (!stack) { fprintf(stderr, "alloc failure\n"); exit(2); }
            }
            stack[sn++] = b; stack[sn++] = a;
            continue;
        }
        /* Tier P: one direct O(N) ball evaluation (G3 semantics) */
        x_from_u(x, uc);
        eval_point(ch, x, r, tm);
        A->cellsP++; A->tp++;
        int okP2 = okP, okE2 = okE;
        if (!okP) {
            arb_set(tot, r->pilot);
            arb_addmul(tot, tl->lipAlias, hx, PREC);
            arb_get_ubound_arf(ub, tot, PREC);
            okP2 = arf_cmp(ub, g_thresh_lb) < 0;
        }
        if (!okE && cl.needE) {
            arb_set(tot, r->absE97);
            arb_addmul(tot, ch->lipE97, hx, PREC);
            arb_get_ubound_arf(ub, tot, PREC);
            okE2 = arf_cmp(ub, g_thresh_lb) < 0;
        }
        if (okP2 && okE2) { A->bsub++; continue; }
        if (!okP2) A->failP++;
        if (!okE2) A->failE++;
        if (!okP2 && (okE2 || !cl.needE)) A->gap++;
        pthread_mutex_lock(&cc->mu);
        t2_fail_push(cc, cl);
        pthread_mutex_unlock(&cc->mu);
    }
    *pstack = stack; *pscap = scap;
    arb_clear(x); arb_clear(hx); arb_clear(tot); arb_clear(t2v);
    arf_clear(ub);
}

static void *t2_worker(void *arg) {
    t2ctx_t *cc = (t2ctx_t *)arg;
    const cchart_t *ch = &g_chs[cc->side];
    const tierled_t *tl = &T2.view[cc->side];
    double wu = g_tls[cc->side].wu;
    eres_t r; eres_init(&r);
    etmp_t tm; etmp_init(&tm);
    arb_struct *dxpow = (arb_struct *)malloc((size_t)(TC_DEG + 1) * sizeof(arb_struct));
    for (slong k = 0; k <= TC_DEG; k++) arb_init(dxpow + k);
    tpanel_t pn; tpanel_init(&pn);
    t2super_t sup; t2super_init(&sup);
    t2scr_t scr; t2scr_init(&scr);
    tcell_t *stack = NULL; long scap = 0;
    for (;;) {
        long si;
        pthread_mutex_lock(&cc->mu);
        si = cc->nextSuper++;
        int over = (cc->budgetCells > 0 &&
                    cc->cellsTaylor + cc->cellsTierP >= cc->budgetCells);
        if (over && si < cc->nsupers) {
            double sLo = cc->uLo + (double)si * T2.SWu[cc->side];
            cc->unprocessed += (long)ceil((cc->uHi - sLo) / wu);
        }
        pthread_mutex_unlock(&cc->mu);
        if (si >= cc->nsupers || over) break;
        double sLo = cc->uLo + (double)si * T2.SWu[cc->side];
        double sHi = sLo + T2.SWu[cc->side];
        if (sHi > cc->uHi) sHi = cc->uHi;
        double X0u = sLo + 0.5 * T2.SWu[cc->side];
        double t0 = thread_cpu();
        t2super_build(&sup, cc->side, X0u, T2_E);
        double t1 = thread_cpu();
        long npan = (long)ceil((sHi - sLo) / wu - 1e-9);
        if (npan < 1) npan = 1;
        double reconS = 0, cellS = 0;
        pacc_t A; memset(&A, 0, sizeof(A));
        for (long p = 0; p < npan; p++) {
            double pa = sLo + (double)p * wu;
            double pb = pa + wu;
            if (pb > sHi) pb = sHi;
            double tr0 = thread_cpu();
            t2panel_reconstruct(&pn, cc->side, &sup, 0.5 * (pa + pb), &scr);
            double tr1 = thread_cpu();
            t2_process_panel(cc, &pn, ch, tl, pa, pb, &r, &tm, dxpow,
                             &stack, &scap, &A);
            double tr2 = thread_cpu();
            reconS += tr1 - tr0;
            cellS += tr2 - tr1;
        }
        pthread_mutex_lock(&cc->mu);
        cc->supers++;
        cc->panels += npan;
        cc->superSec += t1 - t0;
        cc->reconSec += reconS;
        cc->cellSec += cellS;
        cc->cellsTaylor += A.cellsT; cc->cellsTierP += A.cellsP;
        cc->tierB0 += A.b0; cc->tierBsub += A.bsub;
        cc->tierP += A.tp; cc->tierSseam += A.seam;
        cc->failP += A.failP; cc->failE += A.failE;
        cc->pilotGapCells += A.gap;
        if (A.supP > cc->supUbP) cc->supUbP = A.supP;
        if (A.supE > cc->supUbE) cc->supUbE = A.supE;
        if (A.maxRad > cc->maxRad) cc->maxRad = A.maxRad;
        if (A.maxTel > cc->maxTel) cc->maxTel = A.maxTel;
        if (cc->supers % 4 == 0)
            fprintf(stderr, "side %d: super %ld/%ld panels=%ld cellsT=%ld "
                    "tierP=%ld superSec=%.0f reconSec=%.0f cellSec=%.0f\n",
                    cc->side, cc->supers, cc->nsupers, cc->panels,
                    cc->cellsTaylor, cc->tierP, cc->superSec, cc->reconSec,
                    cc->cellSec);
        pthread_mutex_unlock(&cc->mu);
    }
    free(stack);
    for (slong k = 0; k <= TC_DEG; k++) arb_clear(dxpow + k);
    free(dxpow);
    tpanel_clear(&pn);
    t2super_clear(&sup);
    t2scr_clear(&scr);
    eres_clear(&r); etmp_clear(&tm);
    flint_cleanup();
    return NULL;
}

static void mode_t2_slice(double uLo, double uHi, int sideSel, int metricSel,
                          int nthreads, long budget, const char *outpath) {
    int reqP = (metricSel != 1), reqE = (metricSel != 0);
    double t0 = now_wall();
    t2_setup();
    double tSetup = now_wall() - t0;
    double twoN1 = (double)(2 * NWIN + 1);
    if (uHi <= 0) uHi = twoN1;
    FILE *f = outpath ? fopen(outpath, "w") : stdout;
    if (!f) { fprintf(stderr, "cannot open %s\n", outpath); exit(2); }
    fprintf(f, "{\n  \"mode\": \"tiercert2\", \"prec\": %ld, \"degree\": %ld, "
            "\"bins\": %ld, \"edeg\": %ld, \"threads\": %d,\n",
            (long)PREC, (long)TC_DEG, T2.B, (long)T2_E, nthreads);
    fprintf(f, "  \"threshold\": %s, \"rexExact\": %s,\n", THRESH_STR, REX_STR);
    fprintf(f, "  \"metric\": \"%s\", \"uRange\": [%.17g, %.17g],\n",
            metricSel == 0 ? "pilot" : metricSel == 1 ? "e97" : "both",
            uLo, uHi);
    fprintf(f, "  \"setupSeconds\": %.1f,\n", tSetup);
    print_ledger_json(f);
    print_t2ledger_json(f);
    fprintf(f, "  \"sides\": [\n");
    int allOk = 1;
    double totSuperSec = 0, totReconSec = 0, totCellSec = 0;
    long totSupers = 0, totPanels = 0, totCellsT = 0, totCellsP = 0;
    long totFailP = 0, totFailE = 0, totUnproc = 0;
    int nsides = 0;
    for (int side = 0; side < 2; side++) {
        if (sideSel != 2 && sideSel != side) continue;
        nsides++;
        t2ctx_t cc;
        memset(&cc, 0, sizeof(cc));
        cc.side = side;
        cc.uLo = uLo; cc.uHi = uHi;
        cc.reqP = reqP; cc.reqE = reqE;
        cc.budgetCells = budget;
        cc.maxDepth = 44;
        cc.minWidthU = 1e-9;
        cc.nsupers = (long)ceil((uHi - uLo) / T2.SWu[side]);
        pthread_mutex_init(&cc.mu, NULL);
        pthread_t th[64];
        int nt = nthreads > 64 ? 64 : nthreads;
        double tw0 = now_wall();
        for (int i = 0; i < nt; i++) pthread_create(&th[i], NULL, t2_worker, &cc);
        for (int i = 0; i < nt; i++) pthread_join(th[i], NULL);
        double twall = now_wall() - tw0;
        int complete = (cc.unprocessed == 0);
        int certified = complete && cc.failP == 0 && cc.failE == 0;
        if (!certified) allOk = 0;
        fprintf(f, "    {\"side\": %d, \"chartM\": %lu, \"supers\": %ld, "
                "\"panels\": %ld, \"cellsTaylor\": %ld, \"cellsTierP\": %ld,\n",
                side, g_chs[side].M, cc.supers, cc.panels, cc.cellsTaylor,
                cc.cellsTierP);
        fprintf(f, "     \"tierB0\": %ld, \"tierBsub\": %ld, \"tierP\": %ld, "
                "\"tierSseamCells\": %ld,\n",
                cc.tierB0, cc.tierBsub, cc.tierP, cc.tierSseam);
        fprintf(f, "     \"failPilot\": %ld, \"failE97\": %ld, "
                "\"pilotGapCells\": %ld, \"unprocessedPanels\": %ld,\n",
                cc.failP, cc.failE, cc.pilotGapCells, cc.unprocessed);
        fprintf(f, "     \"certifiedSupUbPilot\": %.17g, \"certifiedSupUbE97\": %.17g,\n",
                cc.supUbP, cc.supUbE);
        fprintf(f, "     \"maxBallRad\": %.3e, \"maxTelescopeRad\": %.3e,\n",
                cc.maxRad, cc.maxTel);
        fprintf(f, "     \"C1_pilot_certified\": %s, \"C2_e97_certified\": %s,\n",
                (reqP && certified) ? "true" : "false",
                (reqE && complete && cc.failE == 0) ? "true" : "false");
        fprintf(f, "     \"superCpuSeconds\": %.1f, \"reconCpuSeconds\": %.1f, "
                "\"cellCpuSeconds\": %.1f, \"wallSeconds\": %.1f,\n",
                cc.superSec, cc.reconSec, cc.cellSec, twall);
        fprintf(f, "     \"uncertifiedCells\": [");
        for (long i = 0; i < cc.failn && i < 1000; i++)
            fprintf(f, "%s[%.17g,%.17g,%d,%d]", i ? "," : "",
                    cc.failv[i].ulo, cc.failv[i].uhi,
                    cc.failv[i].needP, cc.failv[i].needE);
        fprintf(f, "]}%s\n", (sideSel == 2 && side == 0) ? "," : "");
        totSuperSec += cc.superSec; totReconSec += cc.reconSec;
        totCellSec += cc.cellSec;
        totSupers += cc.supers; totPanels += cc.panels;
        totCellsT += cc.cellsTaylor; totCellsP += cc.cellsTierP;
        totFailP += cc.failP; totFailE += cc.failE;
        totUnproc += cc.unprocessed;
        free(cc.failv);
    }
    fprintf(f, "  ],\n");
    double fourpi = 4.0 * 3.14159265358979324;
    double sliceX = (uHi - uLo) * fourpi * (double)nsides;
    double fullX = twoN1 * fourpi * 2.0;
    double cpuSec = totSuperSec + totReconSec + totCellSec;
    double secPerX = cpuSec / sliceX;
    /* analytic ball-op estimate at the measured mix:
       super pass: N*(5(E+1)+14); reconstruction per panel:
       pairs*(2E(E+1) [shift] + 4(D+1)(E+1) [mullow] + 12(E+1) + 4(D+1))
       + B*40 [carriers]; Taylor cell / Tier-P cell as level 1. */
    double N = (double)NWIN;
    double E1 = (double)(T2_E + 1), D1 = (double)(TC_DEG + 1);
    double pairsAvg = 0.5 * ((double)T2.pairs[0] + (double)T2.pairs[1]);
    double opsSuper = N * (5.0 * E1 + 14.0);
    double opsRecon = pairsAvg * (2.0 * (double)T2_E * E1 + 4.0 * D1 * E1 +
                                  12.0 * E1 + 4.0 * D1) + (double)T2.B * 40.0;
    double opsCellT = 52.0 * D1 + D1 + 900.0;
    double opsCellP = 8.0 * N;
    double ballOps = (double)totSupers * opsSuper +
                     (double)totPanels * opsRecon +
                     (double)totCellsT * opsCellT +
                     (double)totCellsP * opsCellP;
    fprintf(f, "  \"measured\": {\n");
    fprintf(f, "    \"sliceXUnits\": %.6e, \"cpuSeconds\": %.1f, "
            "\"cpuSecondsPerXUnit\": %.4f,\n", sliceX, cpuSec, secPerX);
    fprintf(f, "    \"superSecondsPerXUnit\": %.4f, "
            "\"reconSecondsPerXUnit\": %.4f, \"cellSecondsPerXUnit\": %.4f,\n",
            totSuperSec / sliceX, totReconSec / sliceX, totCellSec / sliceX);
    fprintf(f, "    \"cellsPerXUnit\": %.2f, \"ballOpsEstimate\": %.4e, "
            "\"ballOpsPerXUnit\": %.4e,\n",
            (double)(totCellsT + totCellsP) / sliceX, ballOps, ballOps / sliceX);
    fprintf(f, "    \"secondsPerBallOp\": %.3e\n  },\n",
            ballOps > 0 ? cpuSec / ballOps : 0.0);
    fprintf(f, "  \"fullWindowExtrapolation\": {\n");
    fprintf(f, "    \"fullXUnitsBothSides\": %.6e,\n", fullX);
    fprintf(f, "    \"cpuDaysAtSliceRate\": %.1f,\n", secPerX * fullX / 86400.0);
    fprintf(f, "    \"superPlusReconFloorCpuDays\": %.1f,\n",
            ((totSuperSec + totReconSec) / sliceX) * fullX / 86400.0);
    fprintf(f, "    \"ballOpsFullWindowAtSliceRate\": %.4e,\n",
            (ballOps / sliceX) * fullX);
    fprintf(f, "    \"level1MeasuredCpuSecondsPerXUnit\": 0.9408, "
            "\"level1FullWindowCpuDays\": 378.2,\n");
    fprintf(f, "    \"directBaselineCpuDays\": 1.64e5, "
            "\"designTierBudgetBallOps\": 1.1e13,\n");
    fprintf(f, "    \"speedupVsLevel1\": %.2f, \"speedupVsDirect\": %.1f\n  },\n",
            0.9408 / secPerX, 1.64e5 / (secPerX * fullX / 86400.0));
    int fullCover = (sideSel == 2) && (uLo == 0.0) && (uHi == twoN1) &&
                    (metricSel == 2);
    fprintf(f, "  \"fullWindowBothSides\": %s,\n", fullCover ? "true" : "false");
    fprintf(f, "  \"promotionFlag\": %s,\n",
            (allOk && fullCover && totUnproc == 0) ? "true" : "false");
    fprintf(f, "  \"certifiedSubRange\": %s,\n",
            (allOk && totFailP == 0 && totFailE == 0 && totUnproc == 0)
                ? "true" : "false");
    fprintf(f, "  \"wallSeconds\": %.1f,\n", now_wall() - t0);
    fprintf(f, "  \"honesty\": \"tier-2 chirp-level slice: certified continuum "
            "sup bounds hold only on the covered uRange and sides; identical "
            "cell criterion, ledgers, telescope gate and Tier-P fallback as "
            "level 1 (shared code); sub-range runs can never set the "
            "promotion flag; promotes no Lambda bound; NO QED; PT "
            "Lambda<=0.2 benchmark\"\n}\n");
    if (outpath) fclose(f);
}

/* ─────────────────────── main ─────────────────────────────────────── */
static void t2_parse_common(int argc, char **argv, int from) {
    if (argc > from + 0) PREC = atol(argv[from + 0]);
    if (argc > from + 1) TC_DEG = atol(argv[from + 1]);
    if (argc > from + 2) T2_B = atol(argv[from + 2]);
    if (argc > from + 3) T2_E = atol(argv[from + 3]);
}

int main(int argc, char **argv) {
    flint_set_num_threads(1);
    if (argc < 2) {
        fprintf(stderr,
            "usage: %s scan2|ledger2|selfcheck2 [prec] [degree] [bins] [edeg]\n"
            "       %s panels2 NPANELS SEED [prec] [degree] [bins] [edeg]\n"
            "       %s validate2 NPTS SEED [prec] [degree] [bins] [edeg]\n"
            "       %s validatedd2 FILE [prec] [degree] [bins] [edeg]\n"
            "       %s tiercert2 --u-lo A --u-hi B [--side 0|1|both]\n"
            "                [--metric pilot|e97|both] [--threads T] [--prec P]\n"
            "                [--degree D] [--bins B] [--edeg E]\n"
            "                [--budget-cells B] [--out FILE]\n",
            argv[0], argv[0], argv[0], argv[0], argv[0]);
        return 2;
    }
    if (strcmp(argv[1], "scan2") == 0) {
        t2_parse_common(argc, argv, 2);
        init_globals();
        return mode_t2_scan();
    }
    if (strcmp(argv[1], "ledger2") == 0) {
        t2_parse_common(argc, argv, 2);
        init_globals();
        return mode_t2_ledger();
    }
    if (strcmp(argv[1], "selfcheck2") == 0) {
        t2_parse_common(argc, argv, 2);
        init_globals();
        return mode_t2_selfcheck();
    }
    if (strcmp(argv[1], "panels2") == 0 && argc >= 4) {
        t2_parse_common(argc, argv, 4);
        init_globals();
        return mode_t2_panels(atoi(argv[2]), (unsigned)atoi(argv[3]));
    }
    if (strcmp(argv[1], "validate2") == 0 && argc >= 4) {
        t2_parse_common(argc, argv, 4);
        init_globals();
        return mode_t2_validate(atoi(argv[2]), (unsigned)atoi(argv[3]));
    }
    if (strcmp(argv[1], "validatedd2") == 0 && argc >= 3) {
        t2_parse_common(argc, argv, 3);
        init_globals();
        mode_t2_validatedd(argv[2]);
        return 0;
    }
    if (strcmp(argv[1], "tiercert2") == 0 || strcmp(argv[1], "slice2") == 0) {
        double uLo = 0.0, uHi = -1.0;
        int sideSel = 2, metricSel = 2, nth = 7;
        long budget = 0;
        const char *out = NULL;
        for (int i = 2; i < argc - 1; i++) {
            if (strcmp(argv[i], "--u-lo") == 0) uLo = strtod(argv[++i], NULL);
            else if (strcmp(argv[i], "--u-hi") == 0) uHi = strtod(argv[++i], NULL);
            else if (strcmp(argv[i], "--threads") == 0) nth = atoi(argv[++i]);
            else if (strcmp(argv[i], "--prec") == 0) PREC = atol(argv[++i]);
            else if (strcmp(argv[i], "--degree") == 0) TC_DEG = atol(argv[++i]);
            else if (strcmp(argv[i], "--bins") == 0) T2_B = atol(argv[++i]);
            else if (strcmp(argv[i], "--edeg") == 0) T2_E = atol(argv[++i]);
            else if (strcmp(argv[i], "--budget-cells") == 0) budget = atol(argv[++i]);
            else if (strcmp(argv[i], "--out") == 0) out = argv[++i];
            else if (strcmp(argv[i], "--side") == 0) {
                if (strcmp(argv[i + 1], "both") == 0) sideSel = 2;
                else sideSel = atoi(argv[i + 1]);
                i++;
            }
            else if (strcmp(argv[i], "--metric") == 0) {
                if (strcmp(argv[i + 1], "pilot") == 0) metricSel = 0;
                else if (strcmp(argv[i + 1], "e97") == 0) metricSel = 1;
                else metricSel = 2;
                i++;
            }
        }
        if (nth > 14) nth = 14; /* imp-95216 full-window run: user-authorized
                                   14 threads under nice -n 10 (was 7) */
        init_globals();
        mode_t2_slice(uLo, uHi, sideSel, metricSel, nth, budget, out);
        return 0;
    }
    fprintf(stderr, "unknown mode %s\n", argv[1]);
    return 2;
}
