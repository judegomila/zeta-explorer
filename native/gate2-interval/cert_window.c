/*
 * W1-CERT — Gate-2 window-1 interval certifier (Arb/FLINT ball arithmetic).
 *
 * HONESTY HEADER (frozen; fail-closed):
 *   measurement != certificate. The imp-95205 pilot values
 *   (sup Sigma|D_j| = 0.2437541384450471, sup |E97| = 0.1934424506064475)
 *   are dd SAMPLES; the 3-level zoom raised sampled sups by 2.2%, so the
 *   continuum sup exceeds any sample. This program's certify mode produces
 *   per-cell CERTIFIED upper bounds (outward-rounded balls + a rigorous
 *   global Lipschitz charge); its dry-run and validate modes are
 *   measurements only. Nothing here promotes any Lambda bound (G3 gate
 *   certification != Lambda change). NO QED. Platt-Trudgian Lambda <= 0.2
 *   stays the benchmark. Scope: LOCKED convention of
 *   native/gate2-lane-a/main.c (bnHasT0=1, bnOnBoth=1, frozenChart=1,
 *   real gamma_at) — this convention does NOT reproduce the paper anchor
 *   literal 0.2141254901198318 (best 49% off; BLOCKED-ON-CONVENTION on
 *   that literal, see gate2-lane-a/README.md). Window 1 (N = 690988)
 *   only; 54,109,011 windows remain. A pilot (Sigma|D_j|) cell failure is
 *   a stop signal for independent defect radii, not disproof of the
 *   recombined gate (G3 semantics): |E97| certification continues
 *   independently. The carrier term (5/2)(7403)(rho17+rho*) belongs to
 *   the GLOBAL gate, not this window pilot: recorded, not consumed.
 *
 * TARGET (spec W1-CERT section 0): N = 690988, t0 = 24727519/200000000,
 * y = 1809/10000 (exact rationals), q0 = N^2 - t0/16, x(u) = 4*pi*(q0+u),
 * u in [0, 2N+1] CLOSED (covers the seam point and both half-open
 * conventions). For each chart side M in {690988, 690989}:
 *   (C1) sup_W Sigma_{j=1..25} |D_j^{(M)}(x)| < 0.27968819555261474
 *   (C2) sup_W |E97^{(M)}(x)|                 < 0.27968819555261474
 * (eq-20 downward-rounded literal; strictly < Rex =
 *  0.2796881955526244146123, so passing it implies the Rex inequality).
 *
 * METHOD (this phase = the certifier skeleton; centered form):
 * amplitudes are x-independent under the locked convention, so for every
 * metric f built from the ladder sums, |f(x)-f(xc)| <= L*|x-xc| with L a
 * rigorous, x-uniform triangle-inequality ledger computed ONCE per chart
 * in Arb (each term's d/dx magnitude is bounded by amplitude * nu_n,
 * nu_n = ln(n)/2; products via the (value, derivative) mass recurrence).
 * A cell [ulo,uhi] certifies a metric iff
 *   ubound(f(center ball)) + ubound(L) * ubound(halfwidth_x) < lb(threshold)
 * under strict arf comparison. Cells that cannot certify after max-depth
 * adaptive bisection (or past --budget-cells) are RECORDED, never skipped
 * (fail-closed). The eq-(13) telescope identity Sigma_j D_j = E97 is
 * checked at EVERY evaluation: the ball of the difference must contain 0
 * or the run aborts (evaluator bug), mirroring the pilot's 8e-14 dd gate.
 *
 * Per-cell direct evaluation is O(N) (~7e5 arb_sin_cos); the G4 tier-P/B/S
 * batching (panel chirp recurrence + frequency bins + subpanel Taylor
 * models) that amortizes this to O(K) per cell is the NEXT phase; this
 * program is the semantics reference + planner it must reproduce.
 *
 * Modes:
 *   ./cert_window selfcheck [prec]
 *   ./cert_window point W SIDE [prec]        (enclosure JSON at one x)
 *   ./cert_window validate FILE [prec]       (batch enclosures, one table build)
 *   ./cert_window dryrun [samples] [prec] [threads]      (--dry-run alias)
 *   ./cert_window certify [--budget-cells B] [--max-depth D] [--threads T]
 *                         [--prec P] [--out FILE] [--side 0|1|both]
 *                         [--u-lo A] [--u-hi B]
 *
 * The certify mode is NOT to be launched in this phase (dry-run +
 * validation only); it is implemented fail-closed so the next phase can
 * run it (or replace its per-cell evaluator with the tiered one).
 */
#include <flint/flint.h>
#include <flint/arb.h>
#include <math.h>
#include <pthread.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

/* ─────────────────────────── frozen constants ─────────────────────── */
#define NWIN 690988UL           /* window-1 landmark */
#define NTAB 690992UL           /* ln/class tables cover chart 690989 */

static const char *THRESH_STR = "0.27968819555261474";      /* eq (20) */
static const char *REX_STR = "0.2796881955526244146123";    /* eq (19) */
static const double PILOT_SAMPLED_LB = 0.2437541384450471;  /* imp-95205 */
static const double E97_SAMPLED_LB = 0.1934424506064475;    /* imp-95205 */

static const int PRIMES97[25] = { 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37,
                                  41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83,
                                  89, 97 };

static slong PREC = 128;   /* ball working precision */
static slong WPHI = 192;   /* phase precision = PREC + 64 (x*ln n ~ 2^45) */

/* globals built once */
static arb_struct *g_lnn = NULL;   /* ln n at WPHI, n = 0..NTAB */
static uint8_t *g_cls = NULL;      /* 0 coprime-to-97#; j=1..25 descending:
                                      smallest prime factor 97=1 .. 2=25 */
static arb_t g_q0;                 /* N^2 - t0/16 at WPHI */
static arb_t g_4pi;                /* 4*pi at WPHI */
static arb_t g_thresh;             /* eq-20 literal ball */
static arf_t g_thresh_lb;          /* strict lower bound of the literal */

static double now_wall(void) {
    struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t);
    return (double)t.tv_sec + 1e-9 * (double)t.tv_nsec;
}

/* ─────────────────────────── table build ──────────────────────────── */
static void build_tables(void) {
    uint32_t *spf = (uint32_t *)calloc(NTAB + 1, sizeof(uint32_t));
    g_lnn = (arb_struct *)malloc((NTAB + 1) * sizeof(arb_struct));
    g_cls = (uint8_t *)calloc(NTAB + 1, 1);
    if (!spf || !g_lnn || !g_cls) { fprintf(stderr, "alloc failure\n"); exit(2); }
    for (unsigned long i = 2; i <= NTAB; i++) {
        if (spf[i] == 0) {
            spf[i] = (uint32_t)i;
            if (i * i <= NTAB)
                for (unsigned long j = i * i; j <= NTAB; j += i)
                    if (spf[j] == 0) spf[j] = (uint32_t)i;
        }
    }
    for (unsigned long n = 0; n <= NTAB; n++) arb_init(g_lnn + n);
    /* primes: direct arb_log_ui; composites: exact additive splitting */
    for (unsigned long n = 2; n <= NTAB; n++) {
        if (spf[n] == n) arb_log_ui(g_lnn + n, n, WPHI);
        else arb_add(g_lnn + n, g_lnn + spf[n], g_lnn + (n / spf[n]), WPHI);
    }
    int aidx[98]; memset(aidx, 0, sizeof(aidx));
    for (int a = 0; a < 25; a++) aidx[PRIMES97[a]] = 25 - a;
    for (unsigned long n = 2; n <= NTAB; n++)
        if (spf[n] <= 97) g_cls[n] = (uint8_t)aidx[spf[n]];
    free(spf);
}

static void init_globals(void) {
    WPHI = PREC + 64;
    arb_t t0_16, pi;
    arb_init(g_q0); arb_init(g_4pi); arb_init(g_thresh);
    arf_init(g_thresh_lb);
    arb_init(t0_16); arb_init(pi);
    /* t0/16 = 24727519 / (200000000 * 16), exact rational enclosed */
    arb_set_ui(t0_16, 24727519UL);
    arb_div_ui(t0_16, t0_16, 200000000UL, WPHI);
    arb_mul_2exp_si(t0_16, t0_16, -4);
    arb_set_ui(g_q0, NWIN);
    arb_mul_ui(g_q0, g_q0, NWIN, WPHI);       /* N^2 exact (< 2^53) */
    arb_sub(g_q0, g_q0, t0_16, WPHI);
    arb_const_pi(pi, WPHI);
    arb_mul_2exp_si(g_4pi, pi, 2);
    if (arb_set_str(g_thresh, THRESH_STR, 2 * WPHI) != 0) {
        fprintf(stderr, "threshold literal parse failure\n"); exit(2);
    }
    arb_get_lbound_arf(g_thresh_lb, g_thresh, 2 * WPHI);
    arb_clear(t0_16); arb_clear(pi);
}

/* x(u) = 4*pi*(q0 + u), u an exact double in [0, 2N+1] */
static void x_from_u(arb_t x, double u) {
    arb_t q; arb_init(q);
    arb_set_d(q, u);                      /* doubles are exact in arb */
    arb_add(q, q, g_q0, WPHI);
    arb_mul(x, g_4pi, q, WPHI);
    arb_clear(q);
}

/* ─────────────────────────── chart build ──────────────────────────── */
typedef struct {
    unsigned long M;                /* chart landmark = truncation length */
    arb_t sigmaB, sigmaA, gamma;    /* frozen at the landmark (locked conv) */
    arb_struct *P, *Q;              /* P = aB + g*aA, Q = g*aA - aB, n<=M */
    arb_t ampP[25];                 /* b_p p^{-sigmaB} (ascending primes) */
    /* rigorous x-uniform Lipschitz ledger */
    arb_t mass0[26], mass1[26];     /* per class: sum P_n, sum P_n*nu_n */
    arb_t M0, M1;                   /* totals over all n <= M */
    arb_t lipPilot, lipE97;         /* d/dx bounds (upper enclosures) */
} cchart_t;

static void cchart_build(cchart_t *ch, unsigned long M) {
    slong wp = PREC + 32;
    ch->M = M;
    arb_t q, xM, lnq, t0, y, c2, h, x2, tmp, tmp2, L, nu, aB, aA, gA;
    arb_init(q); arb_init(xM); arb_init(lnq); arb_init(t0); arb_init(y);
    arb_init(c2); arb_init(h); arb_init(x2); arb_init(tmp); arb_init(tmp2);
    arb_init(L); arb_init(nu); arb_init(aB); arb_init(aA); arb_init(gA);
    arb_init(ch->sigmaB); arb_init(ch->sigmaA); arb_init(ch->gamma);

    arb_set_ui(t0, 24727519UL);
    arb_div_ui(t0, t0, 200000000UL, wp);
    arb_set_ui(y, 1809UL);
    arb_div_ui(y, y, 10000UL, wp);              /* y = 0.1809 exact rational */
    arb_mul_2exp_si(c2, t0, -2);                /* t0/4 */

    /* q_M = M^2 - t0/16; x_M = 4*pi*q_M; lnq = ln q_M */
    arb_set_ui(q, M); arb_mul_ui(q, q, M, wp);
    arb_mul_2exp_si(tmp, t0, -4);
    arb_sub(q, q, tmp, wp);
    arb_const_pi(tmp, wp); arb_mul_2exp_si(tmp, tmp, 2);
    arb_mul(xM, tmp, q, wp);
    arb_log(lnq, q, wp);

    /* sigmaB = (1+y)/2 + (t0/4)*lnq - t0*h/(2 x^2), h = 1-3y+4y(1+y)/x^2 */
    arb_add_ui(ch->sigmaB, y, 1, wp);
    arb_mul_2exp_si(ch->sigmaB, ch->sigmaB, -1);
    arb_addmul(ch->sigmaB, c2, lnq, wp);
    arb_mul(x2, xM, xM, wp);
    arb_add_ui(tmp, y, 1, wp);
    arb_mul(tmp, tmp, y, wp);
    arb_mul_2exp_si(tmp, tmp, 2);
    arb_div(tmp, tmp, x2, wp);                  /* 4y(1+y)/x^2 */
    arb_mul_ui(tmp2, y, 3, wp);
    arb_sub_ui(tmp2, tmp2, 1, wp);
    arb_neg(tmp2, tmp2);                        /* 1 - 3y */
    arb_add(h, tmp2, tmp, wp);
    if (arb_is_positive(h)) {                   /* matches main.c h>0 branch */
        arb_mul(tmp, t0, h, wp);
        arb_div(tmp, tmp, x2, wp);
        arb_mul_2exp_si(tmp, tmp, -1);
        arb_sub(ch->sigmaB, ch->sigmaB, tmp, wp);
    }
    arb_sub(ch->sigmaA, ch->sigmaB, y, wp);
    /* gamma = exp(0.02*y - (y/2)*lnq) (real gamma_at, frozen at landmark) */
    arb_mul_2exp_si(tmp, y, -1);
    arb_mul(tmp, tmp, lnq, wp);
    arb_neg(tmp, tmp);
    arb_set_ui(tmp2, 2); arb_div_ui(tmp2, tmp2, 100, wp);
    arb_addmul(tmp, tmp2, y, wp);
    arb_exp(ch->gamma, tmp, wp);

    /* amplitude tables + per-class Lipschitz masses */
    ch->P = (arb_struct *)malloc((M + 1) * sizeof(arb_struct));
    ch->Q = (arb_struct *)malloc((M + 1) * sizeof(arb_struct));
    if (!ch->P || !ch->Q) { fprintf(stderr, "alloc failure\n"); exit(2); }
    for (int m = 0; m < 26; m++) {
        arb_init(ch->mass0[m]); arb_init(ch->mass1[m]);
        arb_zero(ch->mass0[m]); arb_zero(ch->mass1[m]);
    }
    arb_init(ch->M0); arb_init(ch->M1);
    arb_zero(ch->M0); arb_zero(ch->M1);
    for (unsigned long n = 0; n <= M; n++) { arb_init(ch->P + n); arb_init(ch->Q + n); }
    arb_zero(ch->P + 0); arb_zero(ch->Q + 0);
    for (unsigned long n = 1; n <= M; n++) {
        if (n == 1) { arb_one(aB); arb_one(aA); }
        else {
            /* aB = exp((c2*L - sigmaB)*L), aA = exp((c2*L - sigmaA)*L) */
            arb_set(L, g_lnn + n);              /* WPHI enclosure, fine at wp */
            arb_mul(tmp, c2, L, wp);
            arb_sub(tmp2, tmp, ch->sigmaB, wp);
            arb_mul(tmp2, tmp2, L, wp);
            arb_exp(aB, tmp2, wp);
            arb_sub(tmp2, tmp, ch->sigmaA, wp);
            arb_mul(tmp2, tmp2, L, wp);
            arb_exp(aA, tmp2, wp);
        }
        arb_mul(gA, ch->gamma, aA, wp);
        arb_add(ch->P + n, aB, gA, wp);
        arb_sub(ch->Q + n, gA, aB, wp);
        int cls = g_cls[n];
        arb_add(ch->mass0[cls], ch->mass0[cls], ch->P + n, wp);
        arb_mul_2exp_si(nu, g_lnn + n, -1);     /* nu_n = ln(n)/2 */
        arb_addmul(ch->mass1[cls], ch->P + n, nu, wp);
    }
    for (int m = 0; m < 26; m++) {
        arb_add(ch->M0, ch->M0, ch->mass0[m], wp);
        arb_add(ch->M1, ch->M1, ch->mass1[m], wp);
    }
    for (int i = 0; i < 25; i++) {
        arb_init(ch->ampP[i]);
        arb_set(L, g_lnn + PRIMES97[i]);
        arb_mul(tmp, c2, L, wp);
        arb_sub(tmp, tmp, ch->sigmaB, wp);
        arb_mul(tmp, tmp, L, wp);
        arb_exp(ch->ampP[i], tmp, wp);
    }

    /* Lip(E97) <= mass1[coprime] + DA*M0 + PA*M1 with (PA,DA) the
       (value, derivative) mass recurrence over the 25 A97 factors:
       |1 - q_p| <= 1 + amp_p, |q_p'| = amp_p * nu_p. */
    arb_t PA, DA;
    arb_init(PA); arb_init(DA);
    arb_one(PA); arb_zero(DA);
    for (int i = 0; i < 25; i++) {
        arb_mul_2exp_si(nu, g_lnn + PRIMES97[i], -1);
        arb_add_ui(tmp, ch->ampP[i], 1, wp);    /* 1 + amp */
        arb_mul(DA, DA, tmp, wp);
        arb_mul(tmp2, ch->ampP[i], nu, wp);
        arb_addmul(DA, PA, tmp2, wp);
        arb_mul(PA, PA, tmp, wp);
    }
    arb_init(ch->lipE97);
    arb_set(ch->lipE97, ch->mass1[0]);
    arb_addmul(ch->lipE97, DA, ch->M0, wp);
    arb_addmul(ch->lipE97, PA, ch->M1, wp);

    /* Lip(pilot) = sum_j |D_j'| bound, descending primes 97..2:
       |D_j'| <= DAj*(amp*g0 + h0) + PAj*(amp*nu*g0 + amp*g1 + h1),
       g = coprime + classes 1..j masses, h = class-j masses. */
    arb_t g0, g1, dj;
    arb_init(g0); arb_init(g1); arb_init(dj);
    arb_init(ch->lipPilot);
    arb_zero(ch->lipPilot);
    arb_set(g0, ch->mass0[0]); arb_set(g1, ch->mass1[0]);
    arb_one(PA); arb_zero(DA);
    for (int j = 1; j <= 25; j++) {
        int i = 25 - j;                          /* ascending index of p_j */
        arb_mul_2exp_si(nu, g_lnn + PRIMES97[i], -1);
        arb_add(g0, g0, ch->mass0[j], wp);
        arb_add(g1, g1, ch->mass1[j], wp);
        /* dj = DAj*(amp*g0 + h0) */
        arb_mul(tmp, ch->ampP[i], g0, wp);
        arb_add(tmp, tmp, ch->mass0[j], wp);
        arb_mul(dj, DA, tmp, wp);
        /* += PAj*(amp*nu*g0 + amp*g1 + h1) */
        arb_mul(tmp, ch->ampP[i], nu, wp);
        arb_mul(tmp, tmp, g0, wp);
        arb_addmul(tmp, ch->ampP[i], g1, wp);
        arb_add(tmp, tmp, ch->mass1[j], wp);
        arb_addmul(dj, PA, tmp, wp);
        arb_add(ch->lipPilot, ch->lipPilot, dj, wp);
        /* advance (PA, DA) by factor (1 - q_j) */
        arb_add_ui(tmp, ch->ampP[i], 1, wp);
        arb_mul(DA, DA, tmp, wp);
        arb_mul(tmp2, ch->ampP[i], nu, wp);
        arb_addmul(DA, PA, tmp2, wp);
        arb_mul(PA, PA, tmp, wp);
    }
    arb_clear(PA); arb_clear(DA); arb_clear(g0); arb_clear(g1); arb_clear(dj);
    arb_clear(q); arb_clear(xM); arb_clear(lnq); arb_clear(t0); arb_clear(y);
    arb_clear(c2); arb_clear(h); arb_clear(x2); arb_clear(tmp); arb_clear(tmp2);
    arb_clear(L); arb_clear(nu); arb_clear(aB); arb_clear(aA); arb_clear(gA);
}

/* ─────────────────────────── evaluation ───────────────────────────── */
typedef struct {
    arb_t pilot, absE97;
    arb_t E97re, E97im;
    arb_t Dre[25], Dim[25];         /* telescope defects, j = 1..25 */
    arb_t telre, telim;             /* sum_j D_j - E97 (must contain 0) */
} eres_t;

static void eres_init(eres_t *r) {
    arb_init(r->pilot); arb_init(r->absE97);
    arb_init(r->E97re); arb_init(r->E97im);
    arb_init(r->telre); arb_init(r->telim);
    for (int j = 0; j < 25; j++) { arb_init(r->Dre[j]); arb_init(r->Dim[j]); }
}
static void eres_clear(eres_t *r) {
    arb_clear(r->pilot); arb_clear(r->absE97);
    arb_clear(r->E97re); arb_clear(r->E97im);
    arb_clear(r->telre); arb_clear(r->telim);
    for (int j = 0; j < 25; j++) { arb_clear(r->Dre[j]); arb_clear(r->Dim[j]); }
}

typedef struct {           /* per-thread reusable temporaries */
    arb_t t, th, sn, cs, cre, cim, a, b, c, d;
    arb_struct ScR[26], ScI[26];
    arb_struct qre[25], qim[25];
} etmp_t;

static void etmp_init(etmp_t *m) {
    arb_init(m->t); arb_init(m->th); arb_init(m->sn); arb_init(m->cs);
    arb_init(m->cre); arb_init(m->cim);
    arb_init(m->a); arb_init(m->b); arb_init(m->c); arb_init(m->d);
    for (int i = 0; i < 26; i++) { arb_init(m->ScR + i); arb_init(m->ScI + i); }
    for (int i = 0; i < 25; i++) { arb_init(m->qre + i); arb_init(m->qim + i); }
}
static void etmp_clear(etmp_t *m) {
    arb_clear(m->t); arb_clear(m->th); arb_clear(m->sn); arb_clear(m->cs);
    arb_clear(m->cre); arb_clear(m->cim);
    arb_clear(m->a); arb_clear(m->b); arb_clear(m->c); arb_clear(m->d);
    for (int i = 0; i < 26; i++) { arb_clear(m->ScR + i); arb_clear(m->ScI + i); }
    for (int i = 0; i < 25; i++) { arb_clear(m->qre + i); arb_clear(m->qim + i); }
}

/*
 * Full locked-convention evaluation at the point ball x (WPHI):
 * class sums, A97 product, E97 = C - A97*F, eq-(13) telescope (descending
 * primes 97..2), pilot = sum_j |D_j|. Mirrors gate2-lane-a eval_fast.
 */
static void eval_point(const cchart_t *ch, const arb_t x, eres_t *r, etmp_t *m) {
    const unsigned long M = ch->M;
    for (int i = 0; i < 26; i++) { arb_zero(m->ScR + i); arb_zero(m->ScI + i); }
    for (unsigned long n = 1; n <= M; n++) {
        /* theta_n = x * ln(n) / 2, product at WPHI (x ~ 2^43 needs the
           extra 64 phase bits), sin/cos back at PREC */
        arb_mul(m->t, x, g_lnn + n, WPHI);
        arb_mul_2exp_si(m->t, m->t, -1);
        arb_sin_cos(m->sn, m->cs, m->t, PREC);
        int cls = g_cls[n];
        arb_addmul(m->ScR + cls, ch->P + n, m->cs, PREC);
        arb_addmul(m->ScI + cls, ch->Q + n, m->sn, PREC);
    }
    /* F = sum of all classes, C = class 0 */
    arb_t Fre, Fim, Are, Aim;
    arb_init(Fre); arb_init(Fim); arb_init(Are); arb_init(Aim);
    arb_zero(Fre); arb_zero(Fim);
    for (int i = 0; i < 26; i++) {
        arb_add(Fre, Fre, m->ScR + i, PREC);
        arb_add(Fim, Fim, m->ScI + i, PREC);
    }
    /* per-prime q_p = amp_p e^{-i th_p}; A97 = prod (1 - q_p) ascending */
    arb_one(Are); arb_zero(Aim);
    for (int i = 0; i < 25; i++) {
        arb_mul(m->t, x, g_lnn + PRIMES97[i], WPHI);
        arb_mul_2exp_si(m->t, m->t, -1);
        arb_sin_cos(m->sn, m->cs, m->t, PREC);
        arb_mul(m->qre + i, ch->ampP[i], m->cs, PREC);
        arb_mul(m->qim + i, ch->ampP[i], m->sn, PREC);
        arb_neg(m->qim + i, m->qim + i);
        /* factor f = 1 - q  -> (Are+iAim) *= f */
        arb_sub_ui(m->a, m->qre + i, 1, PREC); arb_neg(m->a, m->a);  /* 1-qre */
        arb_neg(m->b, m->qim + i);                                    /* -qim */
        arb_mul(m->c, Are, m->a, PREC);
        arb_submul(m->c, Aim, m->b, PREC);
        arb_mul(m->d, Are, m->b, PREC);
        arb_addmul(m->d, Aim, m->a, PREC);
        arb_set(Are, m->c); arb_set(Aim, m->d);
    }
    /* E97 = C - A*F */
    arb_mul(m->a, Are, Fre, PREC);
    arb_submul(m->a, Aim, Fim, PREC);
    arb_sub(r->E97re, m->ScR + 0, m->a, PREC);
    arb_mul(m->a, Are, Fim, PREC);
    arb_addmul(m->a, Aim, Fre, PREC);
    arb_sub(r->E97im, m->ScI + 0, m->a, PREC);
    arb_hypot(r->absE97, r->E97re, r->E97im, PREC);
    /* telescope, descending primes (j=1 -> 97): D_j = A_{<j}(q G_j - H_j) */
    {
        arb_t Gre, Gim, apre, apim;
        arb_init(Gre); arb_init(Gim); arb_init(apre); arb_init(apim);
        arb_set(Gre, m->ScR + 0); arb_set(Gim, m->ScI + 0);
        arb_one(apre); arb_zero(apim);
        arb_zero(r->pilot); arb_zero(r->telre); arb_zero(r->telim);
        for (int j = 1; j <= 25; j++) {
            int i = 25 - j;
            arb_add(Gre, Gre, m->ScR + j, PREC);
            arb_add(Gim, Gim, m->ScI + j, PREC);
            /* t = q*G - H */
            arb_mul(m->a, m->qre + i, Gre, PREC);
            arb_submul(m->a, m->qim + i, Gim, PREC);
            arb_sub(m->a, m->a, m->ScR + j, PREC);
            arb_mul(m->b, m->qre + i, Gim, PREC);
            arb_addmul(m->b, m->qim + i, Gre, PREC);
            arb_sub(m->b, m->b, m->ScI + j, PREC);
            /* D = A_{<j} * t */
            arb_mul(r->Dre[j - 1], apre, m->a, PREC);
            arb_submul(r->Dre[j - 1], apim, m->b, PREC);
            arb_mul(r->Dim[j - 1], apre, m->b, PREC);
            arb_addmul(r->Dim[j - 1], apim, m->a, PREC);
            arb_hypot(m->c, r->Dre[j - 1], r->Dim[j - 1], PREC);
            arb_add(r->pilot, r->pilot, m->c, PREC);
            arb_add(r->telre, r->telre, r->Dre[j - 1], PREC);
            arb_add(r->telim, r->telim, r->Dim[j - 1], PREC);
            /* A_{<j+1} = A_{<j} * (1 - q_j) */
            arb_sub_ui(m->a, m->qre + i, 1, PREC); arb_neg(m->a, m->a);
            arb_neg(m->b, m->qim + i);
            arb_mul(m->c, apre, m->a, PREC);
            arb_submul(m->c, apim, m->b, PREC);
            arb_mul(m->d, apre, m->b, PREC);
            arb_addmul(m->d, apim, m->a, PREC);
            arb_set(apre, m->c); arb_set(apim, m->d);
        }
        arb_sub(r->telre, r->telre, r->E97re, PREC);
        arb_sub(r->telim, r->telim, r->E97im, PREC);
        arb_clear(Gre); arb_clear(Gim); arb_clear(apre); arb_clear(apim);
    }
    /* per-evaluation telescope gate (G1 mirror): the exact identity
       sum_j D_j = E97 forces the difference ball to contain 0 */
    if (!arb_contains_zero(r->telre) || !arb_contains_zero(r->telim)) {
        fprintf(stderr, "TELESCOPE GATE VIOLATION (evaluator bug): "
                "difference ball excludes 0 at chart %lu. ABORT.\n", ch->M);
        exit(4);
    }
    arb_clear(Fre); arb_clear(Fim); arb_clear(Are); arb_clear(Aim);
}

/* ────────────────────────── shared reporting ──────────────────────── */
static double arb_rad_d(const arb_t z) { return mag_get_d(arb_radref(z)); }
static double arb_mid_d(const arb_t z) {
    return arf_get_d(arb_midref(z), ARF_RND_NEAR);
}
static double arb_ub_d(const arb_t z) {
    arf_t u; arf_init(u);
    arb_get_ubound_arf(u, z, 64);
    double v = arf_get_d(u, ARF_RND_UP);
    arf_clear(u);
    return v;
}

static void print_point_json(FILE *f, double w, int side, const eres_t *r,
                             const cchart_t *ch) {
    fprintf(f, "{ \"w\": %.17g, \"side\": %d, \"chartM\": %lu, \"prec\": %ld,\n",
            w, side, ch->M, (long)PREC);
    fprintf(f, "  \"absE97\": {\"mid\": %.17e, \"rad\": %.3e, \"ub\": %.17e},\n",
            arb_mid_d(r->absE97), arb_rad_d(r->absE97), arb_ub_d(r->absE97));
    fprintf(f, "  \"pilot\": {\"mid\": %.17e, \"rad\": %.3e, \"ub\": %.17e},\n",
            arb_mid_d(r->pilot), arb_rad_d(r->pilot), arb_ub_d(r->pilot));
    fprintf(f, "  \"E97\": {\"re\": %.17e, \"im\": %.17e, \"reRad\": %.3e, \"imRad\": %.3e},\n",
            arb_mid_d(r->E97re), arb_mid_d(r->E97im),
            arb_rad_d(r->E97re), arb_rad_d(r->E97im));
    fprintf(f, "  \"telRad\": {\"re\": %.3e, \"im\": %.3e},\n",
            arb_rad_d(r->telre), arb_rad_d(r->telim));
    fprintf(f, "  \"D\": [\n");
    for (int j = 0; j < 25; j++)
        fprintf(f, "    [%.17e, %.17e, %.3e, %.3e]%s\n",
                arb_mid_d(r->Dre[j]), arb_mid_d(r->Dim[j]),
                arb_rad_d(r->Dre[j]), arb_rad_d(r->Dim[j]),
                j < 24 ? "," : "");
    fprintf(f, "  ]\n}");
}

/* ─────────────────────────── point mode ───────────────────────────── */
static void mode_point(double w, int side) {
    build_tables();
    cchart_t ch;
    cchart_build(&ch, NWIN + (unsigned long)side);
    double twoN1 = (double)(2 * NWIN + 1);
    double u = w * twoN1;                 /* same double rounding as gate2 */
    arb_t x; arb_init(x);
    x_from_u(x, u);
    eres_t r; eres_init(&r);
    etmp_t tm; etmp_init(&tm);
    eval_point(&ch, x, &r, &tm);
    print_point_json(stdout, w, side, &r, &ch);
    printf("\n");
}

/* ─────────────────────────── validate mode ────────────────────────── */
static void mode_validate(const char *file) {
    FILE *f = fopen(file, "r");
    if (!f) { fprintf(stderr, "cannot open %s\n", file); exit(2); }
    double ws[512]; int sides[512]; int np = 0;
    while (np < 512 && fscanf(f, "%lf %d", &ws[np], &sides[np]) == 2) np++;
    fclose(f);
    build_tables();
    cchart_t chs[2];
    cchart_build(&chs[0], NWIN);
    cchart_build(&chs[1], NWIN + 1);
    double twoN1 = (double)(2 * NWIN + 1);
    eres_t r; eres_init(&r);
    etmp_t tm; etmp_init(&tm);
    arb_t x; arb_init(x);
    printf("[\n");
    for (int i = 0; i < np; i++) {
        double u = ws[i] * twoN1;
        x_from_u(x, u);
        eval_point(&chs[sides[i]], x, &r, &tm);
        print_point_json(stdout, ws[i], sides[i], &r, &chs[sides[i]]);
        printf("%s\n", i < np - 1 ? "," : "");
        fflush(stdout);
        fprintf(stderr, "validate %d/%d done (w=%.17g side=%d)\n",
                i + 1, np, ws[i], sides[i]);
    }
    printf("]\n");
}

/* ─────────────────────────── selfcheck ────────────────────────────── */
static void mode_selfcheck(void) {
    int fails = 0;
    build_tables();
    /* ln table: composite splitting vs direct log */
    {
        arb_t d; arb_init(d);
        arb_log_ui(d, 690988UL, WPHI);
        if (!arb_overlaps(d, g_lnn + 690988)) { printf("[FAIL] lnn(690988)\n"); fails++; }
        else printf("[PASS] lnn(690988) additive vs direct\n");
        arb_clear(d);
    }
    /* class table */
    if (g_cls[1] == 0 && g_cls[97] == 1 && g_cls[2] == 25 && g_cls[101] == 0 &&
        g_cls[9797] == 1 /* 97*101 */ && g_cls[10201] == 0 /* 101^2 */)
        printf("[PASS] descending-prime class table\n");
    else { printf("[FAIL] class table\n"); fails++; }
    /* chart + eval + telescope at 3 points per side */
    cchart_t chs[2];
    cchart_build(&chs[0], NWIN);
    cchart_build(&chs[1], NWIN + 1);
    printf("chart 690988: sigmaB=%.15f gamma=%.15e lipPilot<=%.6f lipE97<=%.6f\n",
           arb_mid_d(chs[0].sigmaB), arb_mid_d(chs[0].gamma),
           arb_ub_d(chs[0].lipPilot), arb_ub_d(chs[0].lipE97));
    printf("chart 690989: sigmaB=%.15f gamma=%.15e lipPilot<=%.6f lipE97<=%.6f\n",
           arb_mid_d(chs[1].sigmaB), arb_mid_d(chs[1].gamma),
           arb_ub_d(chs[1].lipPilot), arb_ub_d(chs[1].lipE97));
    eres_t r; eres_init(&r);
    etmp_t tm; etmp_init(&tm);
    arb_t x; arb_init(x);
    double twoN1 = (double)(2 * NWIN + 1);
    double wtest[3] = { 0.0, 0.5, 1.0 };
    for (int k = 0; k < 3; k++)
        for (int side = 0; side < 2; side++) {
            x_from_u(x, wtest[k] * twoN1);
            eval_point(&chs[side], x, &r, &tm);   /* aborts on telescope bug */
            double radE = arb_rad_d(r.absE97), radP = arb_rad_d(r.pilot);
            if (radE > 1e-20 || radP > 1e-20) {
                printf("[FAIL] enclosure radius blowup w=%.2f side=%d radE=%.3e radP=%.3e\n",
                       wtest[k], side, radE, radP);
                fails++;
            } else
                printf("[PASS] w=%.2f side=%d |E97|=%.16f (rad %.2e) pilot=%.16f (rad %.2e) telRad=%.2e\n",
                       wtest[k], side, arb_mid_d(r.absE97), radE,
                       arb_mid_d(r.pilot), radP, arb_rad_d(r.telre));
        }
    printf(fails ? "SELFCHECK: %d FAILURES\n" : "SELFCHECK: ALL PASS\n", fails);
    exit(fails ? 1 : 0);
}

/* ─────────────────────────── dry-run mode ─────────────────────────── */
typedef struct {
    const cchart_t *chs;   /* [2] */
    long nsamp;
    double twoN1;
    /* outputs, len nsamp*2 (sample-major, side-minor) */
    double *valP, *valE, *radMax, *telMax;
    long next;
    pthread_mutex_t mu;
} dryctx_t;

static void *dry_worker(void *arg) {
    dryctx_t *c = (dryctx_t *)arg;
    eres_t r; eres_init(&r);
    etmp_t tm; etmp_init(&tm);
    arb_t x; arb_init(x);
    for (;;) {
        long i;
        pthread_mutex_lock(&c->mu);
        i = c->next++;
        pthread_mutex_unlock(&c->mu);
        if (i >= c->nsamp * 2) break;
        long s = i / 2; int side = (int)(i % 2);
        double u = ((double)s + 0.5) / (double)c->nsamp * c->twoN1;
        x_from_u(x, u);
        eval_point(&c->chs[side], x, &r, &tm);
        c->valP[i] = arb_ub_d(r.pilot);
        c->valE[i] = arb_ub_d(r.absE97);
        double rp = arb_rad_d(r.pilot), re = arb_rad_d(r.absE97);
        c->radMax[i] = rp > re ? rp : re;
        double t1 = arb_rad_d(r.telre), t2 = arb_rad_d(r.telim);
        c->telMax[i] = t1 > t2 ? t1 : t2;
    }
    eres_clear(&r); etmp_clear(&tm); arb_clear(x);
    flint_cleanup();
    return NULL;
}

static void mode_dryrun(long nsamp, int nthreads) {
    double t0 = now_wall();
    build_tables();
    cchart_t chs[2];
    cchart_build(&chs[0], NWIN);
    cchart_build(&chs[1], NWIN + 1);
    double tBuild = now_wall() - t0;
    /* warm arb caches (pi etc.) before threading */
    { arb_t p; arb_init(p); arb_const_pi(p, 2 * WPHI); arb_clear(p); }

    double twoN1 = (double)(2 * NWIN + 1);
    dryctx_t c;
    c.chs = chs; c.nsamp = nsamp; c.twoN1 = twoN1; c.next = 0;
    c.valP = (double *)calloc((size_t)nsamp * 2, sizeof(double));
    c.valE = (double *)calloc((size_t)nsamp * 2, sizeof(double));
    c.radMax = (double *)calloc((size_t)nsamp * 2, sizeof(double));
    c.telMax = (double *)calloc((size_t)nsamp * 2, sizeof(double));
    pthread_mutex_init(&c.mu, NULL);
    pthread_t th[64];
    if (nthreads > 64) nthreads = 64;
    double t1 = now_wall();
    for (int i = 0; i < nthreads; i++) pthread_create(&th[i], NULL, dry_worker, &c);
    for (int i = 0; i < nthreads; i++) pthread_join(th[i], NULL);
    double tEval = now_wall() - t1;
    double perEval = tEval * nthreads / (double)(nsamp * 2);

    double thr = arf_get_d(g_thresh_lb, ARF_RND_DOWN);
    double windowX = arb_mid_d(g_4pi) * twoN1;
    double dX = windowX / (double)nsamp;
    /* per side/metric first-order cell estimates + combined */
    double cellsP[2] = { 0, 0 }, cellsE[2] = { 0, 0 }, cellsC[2] = { 0, 0 };
    long infeasible[2] = { 0, 0 };
    double maxP[2] = { 0, 0 }, maxE[2] = { 0, 0 }, maxRad = 0, maxTel = 0;
    double maxPU[2] = { 0, 0 }, maxEU[2] = { 0, 0 };
    double lipP[2], lipE[2];
    for (int side = 0; side < 2; side++) {
        lipP[side] = arb_ub_d(chs[side].lipPilot);
        lipE[side] = arb_ub_d(chs[side].lipE97);
    }
    for (long s = 0; s < nsamp; s++) {
        double u = ((double)s + 0.5) / (double)nsamp * twoN1;
        for (int side = 0; side < 2; side++) {
            long i = s * 2 + side;
            double sp = thr - c.valP[i], se = thr - c.valE[i];
            if (c.valP[i] > maxP[side]) { maxP[side] = c.valP[i]; maxPU[side] = u; }
            if (c.valE[i] > maxE[side]) { maxE[side] = c.valE[i]; maxEU[side] = u; }
            if (c.radMax[i] > maxRad) maxRad = c.radMax[i];
            if (c.telMax[i] > maxTel) maxTel = c.telMax[i];
            if (sp <= 0 || se <= 0) { infeasible[side]++; continue; }
            double wP = 2.0 * sp / lipP[side];
            double wE = 2.0 * se / lipE[side];
            double wC = wP < wE ? wP : wE;
            cellsP[side] += dX / wP;
            cellsE[side] += dX / wE;
            cellsC[side] += dX / wC;
        }
    }
    printf("{\n  \"mode\": \"dry-run\",\n");
    printf("  \"prec\": %ld, \"samplesPerSide\": %ld, \"threads\": %d,\n",
           (long)PREC, nsamp, nthreads);
    printf("  \"threshold\": %s, \"rexExact\": %s,\n", THRESH_STR, REX_STR);
    printf("  \"windowWidthX\": %.6e,\n", windowX);
    printf("  \"lipschitz\": {\"side0\": {\"pilot\": %.6f, \"e97\": %.6f},\n"
           "                \"side1\": {\"pilot\": %.6f, \"e97\": %.6f}},\n",
           lipP[0], lipE[0], lipP[1], lipE[1]);
    printf("  \"sampled\": {\n");
    for (int side = 0; side < 2; side++)
        printf("    \"side%d\": {\"maxPilotUb\": %.16f, \"atU\": %.3f, "
               "\"maxE97Ub\": %.16f, \"atU2\": %.3f, \"infeasibleSamples\": %ld}%s\n",
               side, maxP[side], maxPU[side], maxE[side], maxEU[side],
               infeasible[side], side == 0 ? "," : "");
    printf("  },\n");
    printf("  \"sampledLowerBoundsFromPilot\": {\"pilot\": %.16f, \"e97\": %.16f},\n",
           PILOT_SAMPLED_LB, E97_SAMPLED_LB);
    printf("  \"maxBallRad\": %.3e, \"maxTelescopeRad\": %.3e,\n", maxRad, maxTel);
    printf("  \"cellEstimateFirstOrder\": {\n");
    for (int side = 0; side < 2; side++)
        printf("    \"side%d\": {\"pilotCells\": %.3e, \"e97Cells\": %.3e, "
               "\"combinedCells\": %.3e},\n", side, cellsP[side], cellsE[side],
               cellsC[side]);
    printf("    \"total\": %.3e},\n", cellsC[0] + cellsC[1]);
    printf("  \"timing\": {\"tableBuildSeconds\": %.1f, \"evalWallSeconds\": %.1f, "
           "\"perEvalCpuSeconds\": %.3f},\n", tBuild, tEval, perEval);
    printf("  \"projectedDirectCertify\": {\"evals\": %.3e, \"cpuDays\": %.3e, "
           "\"wallDaysAt6Threads\": %.3e},\n",
           cellsC[0] + cellsC[1], (cellsC[0] + cellsC[1]) * perEval / 86400.0,
           (cellsC[0] + cellsC[1]) * perEval / 86400.0 / 6.0);
    printf("  \"honesty\": \"first-order estimate from point samples with the "
           "global Lipschitz ledger; slack between samples can be smaller, so "
           "this UNDERestimates near-peak refinement; direct O(N)-per-cell "
           "certification at this count needs the tier-P/B/S batching phase; "
           "promotes no Lambda bound; NO QED; PT Lambda<=0.2 benchmark\"\n}\n");
    free(c.valP); free(c.valE); free(c.radMax); free(c.telMax);
}

/* ─────────────────────────── certify mode ─────────────────────────── */
/* NOT to be launched in this phase; implemented fail-closed. */
typedef struct { double ulo, uhi; uint8_t needP, needE; int depth; } cell_t;

typedef struct {
    cell_t *v; long n, cap;
} cellvec_t;
static void cv_push(cellvec_t *s, cell_t c) {
    if (s->n == s->cap) {
        s->cap = s->cap ? s->cap * 2 : 1024;
        s->v = (cell_t *)realloc(s->v, (size_t)s->cap * sizeof(cell_t));
        if (!s->v) { fprintf(stderr, "alloc failure\n"); exit(2); }
    }
    s->v[s->n++] = c;
}

typedef struct {
    const cchart_t *ch;
    int side;
    cellvec_t roots;                 /* shared root queue */
    long rootNext;
    long budget, maxDepth;
    double minWidthU;
    /* accounting (mutex-guarded) */
    long processed, certifiedBoth, failP, failE, unprocessed;
    double supUbP, supUbE;           /* certified sup upper bounds */
    double maxRad, maxTel;
    cellvec_t failures;              /* recorded uncertified cells */
    pthread_mutex_t mu;
} certctx_t;

static void *cert_worker(void *arg) {
    certctx_t *cc = (certctx_t *)arg;
    eres_t r; eres_init(&r);
    etmp_t tm; etmp_init(&tm);
    arb_t x, hx, tot; arb_init(x); arb_init(hx); arb_init(tot);
    arf_t ub; arf_init(ub);
    cellvec_t stack; memset(&stack, 0, sizeof(stack));
    for (;;) {
        cell_t root;
        pthread_mutex_lock(&cc->mu);
        if (cc->rootNext >= cc->roots.n) { pthread_mutex_unlock(&cc->mu); break; }
        root = cc->roots.v[cc->rootNext++];
        pthread_mutex_unlock(&cc->mu);
        stack.n = 0;
        cv_push(&stack, root);
        while (stack.n > 0) {
            cell_t cl = stack.v[--stack.n];
            pthread_mutex_lock(&cc->mu);
            if (cc->budget > 0 && cc->processed >= cc->budget) {
                /* budget exhausted: fail-closed, record as unprocessed */
                cc->unprocessed += stack.n + 1 + (cc->roots.n - cc->rootNext);
                cc->rootNext = cc->roots.n;
                if (cc->failures.n < 100000) cv_push(&cc->failures, cl);
                pthread_mutex_unlock(&cc->mu);
                stack.n = 0;
                break;
            }
            cc->processed++;
            pthread_mutex_unlock(&cc->mu);

            double uc = 0.5 * (cl.ulo + cl.uhi);
            x_from_u(x, uc);
            eval_point(cc->ch, x, &r, &tm);
            /* halfwidth in x: 4*pi*(uhi-ulo)/2, outward */
            arb_set_d(hx, cl.uhi);
            { arb_t t2; arb_init(t2); arb_set_d(t2, cl.ulo);
              arb_sub(hx, hx, t2, PREC); arb_clear(t2); }
            arb_mul(hx, hx, g_4pi, PREC);
            arb_mul_2exp_si(hx, hx, -1);
            int okP = !cl.needP, okE = !cl.needE;
            double ubPd = 0, ubEd = 0;
            if (cl.needP) {
                arb_set(tot, r.pilot);
                arb_addmul(tot, cc->ch->lipPilot, hx, PREC);
                arb_get_ubound_arf(ub, tot, PREC);
                okP = arf_cmp(ub, g_thresh_lb) < 0;
                ubPd = arf_get_d(ub, ARF_RND_UP);
            }
            if (cl.needE) {
                arb_set(tot, r.absE97);
                arb_addmul(tot, cc->ch->lipE97, hx, PREC);
                arb_get_ubound_arf(ub, tot, PREC);
                okE = arf_cmp(ub, g_thresh_lb) < 0;
                ubEd = arf_get_d(ub, ARF_RND_UP);
            }
            pthread_mutex_lock(&cc->mu);
            double rp = arb_rad_d(r.pilot), re2 = arb_rad_d(r.absE97);
            if (rp > cc->maxRad) cc->maxRad = rp;
            if (re2 > cc->maxRad) cc->maxRad = re2;
            double tr = arb_rad_d(r.telre), ti = arb_rad_d(r.telim);
            if (tr > cc->maxTel) cc->maxTel = tr;
            if (ti > cc->maxTel) cc->maxTel = ti;
            if (cl.needP && okP && ubPd > cc->supUbP) cc->supUbP = ubPd;
            if (cl.needE && okE && ubEd > cc->supUbE) cc->supUbE = ubEd;
            pthread_mutex_unlock(&cc->mu);

            if (okP && okE) {
                pthread_mutex_lock(&cc->mu);
                cc->certifiedBoth++;
                pthread_mutex_unlock(&cc->mu);
                continue;
            }
            if (cl.depth >= cc->maxDepth || (cl.uhi - cl.ulo) < cc->minWidthU) {
                /* FAIL-CLOSED: record, never skip */
                pthread_mutex_lock(&cc->mu);
                if (!okP) cc->failP++;
                if (!okE) cc->failE++;
                if (cc->failures.n < 100000) cv_push(&cc->failures, cl);
                pthread_mutex_unlock(&cc->mu);
                continue;
            }
            cell_t a = { cl.ulo, uc, !okP, !okE, cl.depth + 1 };
            cell_t b = { uc, cl.uhi, !okP, !okE, cl.depth + 1 };
            cv_push(&stack, b);
            cv_push(&stack, a);
        }
    }
    free(stack.v);
    eres_clear(&r); etmp_clear(&tm);
    arb_clear(x); arb_clear(hx); arb_clear(tot); arf_clear(ub);
    flint_cleanup();
    return NULL;
}

static void mode_certify(long budget, long maxDepth, int nthreads,
                         const char *outpath, int sideSel,
                         double uLo, double uHi, int metricSel) {
    /* metricSel: 0 = pilot only, 1 = e97 only, 2 = both (default).
       A single-metric run can NEVER set the promotion flag (G5 needs both). */
    int reqP = (metricSel != 1), reqE = (metricSel != 0);
    double t0 = now_wall();
    build_tables();
    cchart_t chs[2];
    cchart_build(&chs[0], NWIN);
    cchart_build(&chs[1], NWIN + 1);
    { arb_t p; arb_init(p); arb_const_pi(p, 2 * WPHI); arb_clear(p); }
    double twoN1 = (double)(2 * NWIN + 1);
    if (uHi <= 0) uHi = twoN1;
    FILE *f = outpath ? fopen(outpath, "w") : stdout;
    if (!f) { fprintf(stderr, "cannot open %s\n", outpath); exit(2); }
    fprintf(f, "{\n  \"mode\": \"certify\", \"prec\": %ld, \"threads\": %d,\n",
            (long)PREC, nthreads);
    fprintf(f, "  \"threshold\": %s, \"rexExact\": %s,\n", THRESH_STR, REX_STR);
    fprintf(f, "  \"budgetCells\": %ld, \"maxDepth\": %ld,\n", budget, maxDepth);
    fprintf(f, "  \"metric\": \"%s\",\n",
            metricSel == 0 ? "pilot" : metricSel == 1 ? "e97" : "both");
    fprintf(f, "  \"uRange\": [%.17g, %.17g],\n", uLo, uHi);
    fprintf(f, "  \"sides\": [\n");
    int allOk = 1;
    for (int side = 0; side < 2; side++) {
        if (sideSel != 2 && sideSel != side) continue;
        certctx_t cc;
        memset(&cc, 0, sizeof(cc));
        cc.ch = &chs[side]; cc.side = side;
        cc.budget = budget; cc.maxDepth = maxDepth;
        cc.minWidthU = 1e-9;         /* ~1.26e-8 in x, far below need */
        pthread_mutex_init(&cc.mu, NULL);
        /* pre-split into root cells for thread parallelism */
        long nroot = (long)nthreads * 64;
        for (long i = 0; i < nroot; i++) {
            double a = uLo + (uHi - uLo) * (double)i / (double)nroot;
            double b = uLo + (uHi - uLo) * (double)(i + 1) / (double)nroot;
            cell_t c = { a, b, (uint8_t)reqP, (uint8_t)reqE, 0 };
            cv_push(&cc.roots, c);
        }
        pthread_t th[64];
        int nt = nthreads > 64 ? 64 : nthreads;
        for (int i = 0; i < nt; i++) pthread_create(&th[i], NULL, cert_worker, &cc);
        for (int i = 0; i < nt; i++) pthread_join(th[i], NULL);
        int complete = (cc.unprocessed == 0);
        int certified = complete && cc.failP == 0 && cc.failE == 0;
        if (!certified) allOk = 0;
        fprintf(f, "    {\"side\": %d, \"chartM\": %lu, \"processed\": %ld, "
                "\"certifiedBoth\": %ld,\n", side, chs[side].M, cc.processed,
                cc.certifiedBoth);
        fprintf(f, "     \"failPilot\": %ld, \"failE97\": %ld, \"unprocessed\": %ld,\n",
                cc.failP, cc.failE, cc.unprocessed);
        fprintf(f, "     \"certifiedSupUbPilot\": %.17g, \"certifiedSupUbE97\": %.17g,\n",
                cc.supUbP, cc.supUbE);
        fprintf(f, "     \"maxBallRad\": %.3e, \"maxTelescopeRad\": %.3e,\n",
                cc.maxRad, cc.maxTel);
        fprintf(f, "     \"C1_pilot_certified\": %s, \"C2_e97_certified\": %s,\n",
                (reqP && certified && cc.failP == 0) ? "true" : "false",
                (reqE && certified && cc.failE == 0) ? "true" : "false");
        fprintf(f, "     \"uncertifiedCells\": [");
        for (long i = 0; i < cc.failures.n && i < 1000; i++)
            fprintf(f, "%s[%.17g,%.17g,%d,%d]", i ? "," : "",
                    cc.failures.v[i].ulo, cc.failures.v[i].uhi,
                    cc.failures.v[i].needP, cc.failures.v[i].needE);
        fprintf(f, "]}%s\n", side == 1 || sideSel != 2 ? "" : ",");
        free(cc.roots.v); free(cc.failures.v);
    }
    fprintf(f, "  ],\n");
    /* G5 semantics: the promotion flag stays false unless this run covered
       the FULL closed window [0, 2N+1] on BOTH seam charts and every cell
       certified both metrics; sub-range / single-side runs can never set it */
    int fullCover = (sideSel == 2) && (uLo == 0.0) && (uHi == twoN1)
                    && (metricSel == 2);
    fprintf(f, "  \"fullWindowBothSides\": %s,\n", fullCover ? "true" : "false");
    fprintf(f, "  \"promotionFlag\": %s,\n", (allOk && fullCover) ? "true" : "false");
    fprintf(f, "  \"wallSeconds\": %.1f,\n", now_wall() - t0);
    fprintf(f, "  \"honesty\": \"locked convention only; window 1 only; a "
            "pilot cell failure is a stop signal for independent defect "
            "radii, not disproof of the recombined gate; carrier term "
            "(5/2)(7403)(rho17+rho*) recorded not consumed; promotes no "
            "Lambda bound; NO QED; PT Lambda<=0.2 benchmark\"\n}\n");
    if (outpath) fclose(f);
}

/* ─────────────────────────── main ─────────────────────────────────── */
int main(int argc, char **argv) {
    flint_set_num_threads(1);       /* explicit pthreads only */
    if (argc < 2) {
        fprintf(stderr,
            "usage: %s selfcheck [prec]\n"
            "       %s point W SIDE [prec]\n"
            "       %s validate FILE [prec]\n"
            "       %s dryrun [samples] [prec] [threads]\n"
            "       %s certify [--budget-cells B] [--max-depth D] [--threads T]\n"
            "                  [--prec P] [--out FILE] [--side 0|1|both]\n"
            "                  [--u-lo A] [--u-hi B] [--metric pilot|e97|both]\n",
            argv[0], argv[0], argv[0], argv[0], argv[0]);
        return 2;
    }
    if (strcmp(argv[1], "selfcheck") == 0) {
        if (argc >= 3) PREC = atol(argv[2]);
        init_globals();
        mode_selfcheck();
        return 0;
    }
    if (strcmp(argv[1], "point") == 0 && argc >= 4) {
        if (argc >= 5) PREC = atol(argv[4]);
        init_globals();
        mode_point(strtod(argv[2], NULL), atoi(argv[3]));
        return 0;
    }
    if (strcmp(argv[1], "validate") == 0 && argc >= 3) {
        if (argc >= 4) PREC = atol(argv[3]);
        init_globals();
        mode_validate(argv[2]);
        return 0;
    }
    if (strcmp(argv[1], "dryrun") == 0 || strcmp(argv[1], "--dry-run") == 0) {
        long nsamp = argc >= 3 ? atol(argv[2]) : 128;
        if (argc >= 4) PREC = atol(argv[3]);
        int nth = argc >= 5 ? atoi(argv[4]) : 6;
        init_globals();
        mode_dryrun(nsamp, nth);
        return 0;
    }
    if (strcmp(argv[1], "certify") == 0) {
        long budget = 0, maxDepth = 44;
        int nth = 6, sideSel = 2, metricSel = 2;
        const char *out = NULL;
        double uLo = 0.0, uHi = -1.0;
        for (int i = 2; i < argc - 1; i++) {
            if (strcmp(argv[i], "--budget-cells") == 0) budget = atol(argv[++i]);
            else if (strcmp(argv[i], "--max-depth") == 0) maxDepth = atol(argv[++i]);
            else if (strcmp(argv[i], "--threads") == 0) nth = atoi(argv[++i]);
            else if (strcmp(argv[i], "--prec") == 0) PREC = atol(argv[++i]);
            else if (strcmp(argv[i], "--out") == 0) out = argv[++i];
            else if (strcmp(argv[i], "--side") == 0) {
                if (strcmp(argv[i + 1], "both") == 0) sideSel = 2;
                else sideSel = atoi(argv[i + 1]);
                i++;
            }
            else if (strcmp(argv[i], "--u-lo") == 0) uLo = strtod(argv[++i], NULL);
            else if (strcmp(argv[i], "--u-hi") == 0) uHi = strtod(argv[++i], NULL);
            else if (strcmp(argv[i], "--metric") == 0) {
                if (strcmp(argv[i + 1], "pilot") == 0) metricSel = 0;
                else if (strcmp(argv[i + 1], "e97") == 0) metricSel = 1;
                else metricSel = 2;
                i++;
            }
        }
        init_globals();
        mode_certify(budget, maxDepth, nth, out, sideSel, uLo, uHi, metricSel);
        return 0;
    }
    fprintf(stderr, "unknown mode %s\n", argv[1]);
    return 2;
}
