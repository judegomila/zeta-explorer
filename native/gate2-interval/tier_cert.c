/*
 * tier_cert.c — imp-95213: tier-P/B/S window-1 certifier (Arb ball
 * arithmetic; the ONE live certification path for the Gate-2 first window
 * after the imp-95210 envelope-pivot refutation).
 *
 * HONESTY HEADER (frozen; fail-closed): this program certifies continuum
 * sup bounds on SUB-RANGES it is asked to cover; a sub-range run can NEVER
 * set the window promotion flag (G5 needs the full closed window on both
 * seam charts). Nothing here promotes any Lambda bound. NO QED.
 * Platt-Trudgian Lambda <= 0.2 stays the benchmark. Locked convention of
 * native/gate2-lane-a/main.c only; window 1 (N = 690988) only.
 *
 * ARCHITECTURE (the residual option of imp-95210, W1-CERT design family):
 *
 *  Tier B (ball/ledger, cheap, most of the window by measure):
 *    the O(N) per-cell evaluation is amortized by RIGOROUS TAYLOR PANEL
 *    MODELS. One O(N) Arb pass per panel computes degree-D Taylor
 *    coefficients of all 52 class-sum series
 *        ScR_c(x) = sum_{n in c} P_n cos(nu_n x),
 *        ScI_c(x) = sum_{n in c} Q_n sin(nu_n x),   nu_n = ln(n)/2,
 *    around the panel center x_p, with the exact Lagrange remainder
 *        |R_c| <= (sum_{n in c} |amp_n| nu_n^{D+1}) h^{D+1} / (D+1)!
 *    (masses computed once per chart in Arb; h sized so the total
 *    remainder <= TC_EPS). Every cell inside the panel then costs
 *    ~52(D+1) ball-ops (arb_dot Horner) + 25 prime sin_cos + the shared
 *    assembly stage of cert_window.c (eval_from_class_sums, telescope
 *    gate at EVERY evaluation), instead of ~7e5 arb_sin_cos.
 *    A cell [ulo,uhi] certifies a metric iff
 *        ub(f(center)) + ub(L) * ub(halfwidth_x) < lb(threshold)
 *    with L the RIGOROUS ALIAS-DECOMPOSED pilot ledger (imp-95210
 *    byproduct, re-derived here in Arb: Lip(pilot) <= ~44.476/x vs the
 *    direct 84.769) and the existing Lip(E97) <= ~91.49 ledger.
 *
 *  Tier P (phase-resolving, expensive, near-sup safety net): cells that
 *    still fail at max depth / min width get ONE direct O(N) ball
 *    evaluation (eval_point) — the tightest available enclosure — and the
 *    certified target falls back to |E97| < threshold DIRECT (sum_j |D_j|
 *    was only ever a sufficient pilot; E97 enjoys the mm+rr phase
 *    cancellation, G3 semantics: a pilot cell failure is a stop signal for
 *    independent defect radii, not disproof of the recombined gate).
 *
 *  Tier S (seam/special): the closed window [0, 2N+1] is certified on
 *    BOTH one-sided seam charts M in {690988, 690989} (seam cells are
 *    counted); the o_j narrowband overhang machinery the probe validated
 *    (|o_j| <= 3e-3, derotated d/du <= 0.003) is carried as the Arb
 *    lip2Derot ledger diagnostic. MEASURED VERDICT (this build): the
 *    derotated split ledger is 39.81 vs the joint 44.48 (only 1.12x) while
 *    the split-target static overhang penalty 2*sum_j supA_j amp_j mTail_j
 *    = 2*0.676 exceeds Rex — so the per-cell split target is priced OFF
 *    the critical path and Tier S stays: seam-chart duplication + the
 *    frozen derotated-ledger record.
 *
 * Modes:
 *   ./tier_cert ledger [prec] [degree]
 *   ./tier_cert selfcheck [prec] [degree]
 *   ./tier_cert point W SIDE [prec] [degree]   (Taylor-panel enclosure JSON)
 *   ./tier_cert validate NPTS SEED [prec] [degree]
 *   ./tier_cert slice --u-lo A --u-hi B [--side 0|1|both]
 *               [--metric pilot|e97|both] [--threads T] [--prec P]
 *               [--degree D] [--budget-cells B] [--out FILE]
 */
#define main cert_window_main
#include "cert_window.c"
#undef main

/* ─────────────────────── tier parameters ──────────────────────────── */
static slong TC_DEG = 80;                 /* Taylor degree (CLI --degree) */
static const double TC_EPS = 1e-14;       /* total remainder target      */
static const double TC_SEAM_GUARD_U = 1.0;/* Tier-S seam band (q units)  */

/* frozen double cross-checks from envprobe masses (imp-95210 byproduct) */
static const double LIP_ALIAS_FROZEN[2] = { 44.476493, 44.476477 };
static const double LIP2_DEROT_FROZEN[2] = { 39.811545, 39.811525 };
static const double STATIC_OVERHANG_FROZEN[2] =
    { 0.6764938691629961, 0.676494581081089 };

/* ─────────────────────── per-chart tier ledger ────────────────────── */
typedef struct {
    arb_t lipAlias;        /* rigorous alias-decomposed Lip(pilot) per x  */
    arb_t lip2Derot;       /* Tier-S diagnostic (derotated overhang)      */
    arb_t staticOverhang;  /* sum_j supA_j amp_j mTail_j (split penalty)  */
    arb_struct MremP[26], MremQ[26];  /* per-class sum |amp| nu^{D+1}     */
    arb_struct remR[26], remI[26];    /* remainder balls at half-width hX */
    double hX;             /* panel half-width, x units                   */
    double wu;             /* panel tiling width, u units (= 2 hX / 4pi)  */
    slong D;
} tierled_t;

/* alias decomposition masses + Taylor remainder masses, all in Arb.
   Exact structure (ln-additivity theta_{pn} = theta_p + theta_n, locked
   convention): q_p G_j - H_j = o_j + mm_j + rr_j with
     |o_j'|  <= amp_j * mTailNu_j        (overhang, full band)
     |mm_j'| <= mMmNu_j                  (amplitude-mismatch chirp)
     |rr_j'| <= amp_j*mRefGnuAbsP_j + mRefHnu_j
   and |D_j(x)-D_j(xc)| <= supA_j*(sum of the above)*|dx|
                          + lipA_j*envMass_j*|dx|. */
static void tierled_build(tierled_t *tl, const cchart_t *ch, slong D) {
    const slong wp = PREC + 32;
    const unsigned long M = ch->M;
    tl->D = D;
    arb_init(tl->lipAlias); arb_init(tl->lip2Derot); arb_init(tl->staticOverhang);
    for (int c = 0; c < 26; c++) {
        arb_init(tl->MremP + c); arb_init(tl->MremQ + c);
        arb_init(tl->remR + c); arb_init(tl->remI + c);
    }
    /* split amplitudes back out of P = aB + g*aA, Q = g*aA - aB (exact):
       aB = (P - Q)/2, gaA = (P + Q)/2 */
    arb_struct *aB = (arb_struct *)malloc((M + 1) * sizeof(arb_struct));
    if (!aB) { fprintf(stderr, "alloc failure\n"); exit(2); }
    for (unsigned long n = 0; n <= M; n++) {
        arb_init(aB + n);
        arb_sub(aB + n, ch->P + n, ch->Q + n, wp);
        arb_mul_2exp_si(aB + n, aB + n, -1);
    }
    /* per-j masses */
    arb_t mTail[25], mTailNu[25], mTailNuC[25], mMm[25], mMmNu[25];
    arb_t mRefG[25], mRefGnuAbsP[25], mRefH[25], mRefHnu[25];
    arb_t nubar[25], nuP[25];
    for (int j = 0; j < 25; j++) {
        arb_init(mTail[j]); arb_init(mTailNu[j]); arb_init(mTailNuC[j]);
        arb_init(mMm[j]); arb_init(mMmNu[j]);
        arb_init(mRefG[j]); arb_init(mRefGnuAbsP[j]);
        arb_init(mRefH[j]); arb_init(mRefHnu[j]);
        arb_init(nubar[j]); arb_init(nuP[j]);
        int p = PRIMES97[25 - (j + 1)];
        arb_mul_2exp_si(nuP[j], g_lnn + p, -1);          /* ln(p)/2 */
        /* nubar = (ln M + ln(p)/2)/2 = center of the overhang band */
        arb_mul_2exp_si(nubar[j], g_lnn + p, -1);
        arb_add(nubar[j], nubar[j], g_lnn + M, wp);
        arb_mul_2exp_si(nubar[j], nubar[j], -1);
    }
    arb_t gaA, nu, nupn, t, t2, powNu, absP, absQ;
    arb_init(gaA); arb_init(nu); arb_init(nupn); arb_init(t); arb_init(t2);
    arb_init(powNu); arb_init(absP); arb_init(absQ);
    for (unsigned long n = 1; n <= M; n++) {
        int c = g_cls[n];
        arb_mul_2exp_si(nu, g_lnn + n, -1);
        arb_add(gaA, ch->P + n, ch->Q + n, wp);
        arb_mul_2exp_si(gaA, gaA, -1);
        for (int j = (c == 0 ? 1 : c); j <= 25; j++) {
            int jj = j - 1;
            int p = PRIMES97[25 - j];
            arb_add(nupn, nu, nuP[jj], wp);
            if ((unsigned long)p * n > M) {
                arb_add(mTail[jj], mTail[jj], aB + n, wp);
                arb_addmul(mTailNu[jj], aB + n, nupn, wp);
                arb_sub(t, nupn, nubar[jj], wp);
                arb_abs(t, t);
                arb_addmul(mTailNuC[jj], aB + n, t, wp);
            } else {
                arb_mul(t, ch->ampP[25 - j], aB + n, wp);
                arb_sub(t, aB + (unsigned long)p * n, t, wp);
                arb_abs(t, t);
                arb_add(mMm[jj], mMm[jj], t, wp);
                arb_addmul(mMmNu[jj], t, nupn, wp);
            }
            arb_add(mRefG[jj], mRefG[jj], gaA, wp);
            arb_sub(t, nu, nuP[jj], wp);
            arb_abs(t, t);
            arb_addmul(mRefGnuAbsP[jj], gaA, t, wp);
        }
        if (c >= 1) {
            arb_add(mRefH[c - 1], mRefH[c - 1], gaA, wp);
            arb_addmul(mRefHnu[c - 1], gaA, nu, wp);
        }
        /* Taylor remainder masses (degree D): sum |amp| nu^{D+1} per class */
        arb_pow_ui(powNu, nu, (ulong)(D + 1), wp);
        arb_abs(absP, ch->P + n);
        arb_abs(absQ, ch->Q + n);
        arb_addmul(tl->MremP + c, absP, powNu, wp);
        arb_addmul(tl->MremQ + c, absQ, powNu, wp);
    }
    /* supA_j / lipA_j via the (PA, DA) mass recurrence over |1-q| <= 1+amp */
    arb_t PA, DA, envM, lj, lj2;
    arb_init(PA); arb_init(DA); arb_init(envM); arb_init(lj); arb_init(lj2);
    arb_one(PA); arb_zero(DA);
    arb_zero(tl->lipAlias); arb_zero(tl->lip2Derot); arb_zero(tl->staticOverhang);
    for (int j = 1; j <= 25; j++) {
        int jj = j - 1, i = 25 - j;
        /* envMass_j = amp*mTail + mMm + amp*mRefG + mRefH */
        arb_mul(envM, ch->ampP[i], mTail[jj], wp);
        arb_add(envM, envM, mMm[jj], wp);
        arb_addmul(envM, ch->ampP[i], mRefG[jj], wp);
        arb_add(envM, envM, mRefH[jj], wp);
        /* per-j derivative charge, full-band overhang (the PILOT ledger) */
        arb_mul(lj, ch->ampP[i], mTailNu[jj], wp);
        arb_add(lj, lj, mMmNu[jj], wp);
        arb_addmul(lj, ch->ampP[i], mRefGnuAbsP[jj], wp);
        arb_add(lj, lj, mRefHnu[jj], wp);
        arb_mul(lj, lj, PA, wp);                 /* * supA_j */
        arb_addmul(lj, DA, envM, wp);            /* + lipA_j * envMass_j */
        arb_add(tl->lipAlias, tl->lipAlias, lj, wp);
        /* derotated variant (Tier-S diagnostic) */
        arb_mul(lj2, ch->ampP[i], mTailNuC[jj], wp);
        arb_add(lj2, lj2, mMmNu[jj], wp);
        arb_addmul(lj2, ch->ampP[i], mRefGnuAbsP[jj], wp);
        arb_add(lj2, lj2, mRefHnu[jj], wp);
        arb_mul(lj2, lj2, PA, wp);
        arb_addmul(lj2, DA, envM, wp);
        arb_add(tl->lip2Derot, tl->lip2Derot, lj2, wp);
        /* static overhang value mass */
        arb_mul(t, ch->ampP[i], mTail[jj], wp);
        arb_addmul(tl->staticOverhang, PA, t, wp);
        /* advance (PA, DA) by factor |1 - q_j| <= 1 + amp_j */
        arb_mul_2exp_si(nu, g_lnn + PRIMES97[i], -1);
        arb_add_ui(t, ch->ampP[i], 1, wp);
        arb_mul(DA, DA, t, wp);
        arb_mul(t2, ch->ampP[i], nu, wp);
        arb_addmul(DA, PA, t2, wp);
        arb_mul(PA, PA, t, wp);
    }
    /* size the panel half-width hX: total remainder <= TC_EPS.
       hX = (TC_EPS * (D+1)! / Mtot)^(1/(D+1)) via log space, then verify
       and freeze the per-class remainder balls at hX in Arb (rigorous
       whatever hX is chosen — the choice is only tuning). */
    arb_t Mtot, fac, hh;
    arb_init(Mtot); arb_init(fac); arb_init(hh);
    for (int c = 0; c < 26; c++) {
        arb_add(Mtot, Mtot, tl->MremP + c, wp);
        arb_add(Mtot, Mtot, tl->MremQ + c, wp);
    }
    arb_fac_ui(fac, (ulong)(D + 1), wp);
    {
        arb_t lnM_, lnFac;
        arb_init(lnM_); arb_init(lnFac);
        arb_log(lnM_, Mtot, wp);
        arb_log(lnFac, fac, wp);
        double lh = (log(TC_EPS) + arb_mid_d(lnFac) - arb_mid_d(lnM_))
                    / (double)(D + 1);
        tl->hX = exp(lh) * 0.999;
        arb_clear(lnM_); arb_clear(lnFac);
    }
    tl->wu = 2.0 * tl->hX / (4.0 * 3.14159265358979324) * (1.0 - 1e-12);
    arb_set_d(hh, tl->hX);
    arb_pow_ui(hh, hh, (ulong)(D + 1), wp);
    arb_div(hh, hh, fac, wp);                  /* hX^{D+1}/(D+1)! */
    for (int c = 0; c < 26; c++) {
        arb_mul(tl->remR + c, tl->MremP + c, hh, wp);
        arb_mul(tl->remI + c, tl->MremQ + c, hh, wp);
    }
    for (unsigned long n = 0; n <= M; n++) arb_clear(aB + n);
    free(aB);
    for (int j = 0; j < 25; j++) {
        arb_clear(mTail[j]); arb_clear(mTailNu[j]); arb_clear(mTailNuC[j]);
        arb_clear(mMm[j]); arb_clear(mMmNu[j]);
        arb_clear(mRefG[j]); arb_clear(mRefGnuAbsP[j]);
        arb_clear(mRefH[j]); arb_clear(mRefHnu[j]);
        arb_clear(nubar[j]); arb_clear(nuP[j]);
    }
    arb_clear(gaA); arb_clear(nu); arb_clear(nupn); arb_clear(t); arb_clear(t2);
    arb_clear(powNu); arb_clear(absP); arb_clear(absQ);
    arb_clear(PA); arb_clear(DA); arb_clear(envM); arb_clear(lj); arb_clear(lj2);
    arb_clear(Mtot); arb_clear(fac); arb_clear(hh);
}

/* ─────────────────────── Taylor panels ────────────────────────────── */
static arb_struct *g_invfact = NULL;      /* 1/k!, k = 0..TC_DEG */
static void build_invfact(void) {
    g_invfact = (arb_struct *)malloc((size_t)(TC_DEG + 1) * sizeof(arb_struct));
    arb_t f; arb_init(f); arb_one(f);
    for (slong k = 0; k <= TC_DEG; k++) {
        arb_init(g_invfact + k);
        if (k > 0) arb_div_ui(f, f, (ulong)k, WPHI);
        arb_set(g_invfact + k, f);
    }
    arb_clear(f);
}

typedef struct {
    double u0;               /* panel center (u units)  */
    arb_struct *cR, *cI;     /* 26 * (D+1) coefficients */
} tpanel_t;

static void tpanel_init(tpanel_t *pn) {
    pn->cR = (arb_struct *)malloc((size_t)26 * (TC_DEG + 1) * sizeof(arb_struct));
    pn->cI = (arb_struct *)malloc((size_t)26 * (TC_DEG + 1) * sizeof(arb_struct));
    if (!pn->cR || !pn->cI) { fprintf(stderr, "alloc failure\n"); exit(2); }
    for (slong i = 0; i < 26 * (TC_DEG + 1); i++) {
        arb_init(pn->cR + i); arb_init(pn->cI + i);
    }
}
static void tpanel_clear(tpanel_t *pn) {
    for (slong i = 0; i < 26 * (TC_DEG + 1); i++) {
        arb_clear(pn->cR + i); arb_clear(pn->cI + i);
    }
    free(pn->cR); free(pn->cI);
}

/* one O(N) pass: degree-D Taylor coefficients of all 52 class series at
   x_p = x(u0). Coefficient before scaling: a_k = sum amp * nu^k *
   trig(theta + k*pi/2); the 1/k! is applied once at the end. */
static void tpanel_build(tpanel_t *pn, const cchart_t *ch, double u0, etmp_t *m) {
    const slong D = TC_DEG;
    const unsigned long M = ch->M;
    pn->u0 = u0;
    for (slong i = 0; i < 26 * (D + 1); i++) {
        arb_zero(pn->cR + i); arb_zero(pn->cI + i);
    }
    arb_t x, pc, ps, qs, qc, f, nu;
    arb_init(x); arb_init(pc); arb_init(ps); arb_init(qs); arb_init(qc);
    arb_init(f); arb_init(nu);
    x_from_u(x, u0);
    for (unsigned long n = 1; n <= M; n++) {
        arb_mul(m->t, x, g_lnn + n, WPHI);
        arb_mul_2exp_si(m->t, m->t, -1);
        arb_sin_cos(m->sn, m->cs, m->t, PREC);
        int c = g_cls[n];
        arb_struct *cR = pn->cR + (slong)c * (D + 1);
        arb_struct *cI = pn->cI + (slong)c * (D + 1);
        arb_mul(pc, ch->P + n, m->cs, PREC);
        arb_mul(ps, ch->P + n, m->sn, PREC);
        arb_mul(qs, ch->Q + n, m->sn, PREC);
        arb_mul(qc, ch->Q + n, m->cs, PREC);
        arb_mul_2exp_si(nu, g_lnn + n, -1);
        arb_add(cR + 0, cR + 0, pc, PREC);
        arb_add(cI + 0, cI + 0, qs, PREC);
        arb_one(f);
        for (slong k = 1; k <= D; k++) {
            arb_mul(f, f, nu, PREC);
            switch (k & 3) {
            case 0: arb_addmul(cR + k, pc, f, PREC);
                    arb_addmul(cI + k, qs, f, PREC); break;
            case 1: arb_submul(cR + k, ps, f, PREC);
                    arb_addmul(cI + k, qc, f, PREC); break;
            case 2: arb_submul(cR + k, pc, f, PREC);
                    arb_submul(cI + k, qs, f, PREC); break;
            default: arb_addmul(cR + k, ps, f, PREC);
                     arb_submul(cI + k, qc, f, PREC); break;
            }
        }
    }
    for (int c = 0; c < 26; c++)
        for (slong k = 0; k <= D; k++) {
            arb_mul(pn->cR + (slong)c * (D + 1) + k,
                    pn->cR + (slong)c * (D + 1) + k, g_invfact + k, PREC);
            arb_mul(pn->cI + (slong)c * (D + 1) + k,
                    pn->cI + (slong)c * (D + 1) + k, g_invfact + k, PREC);
        }
    arb_clear(x); arb_clear(pc); arb_clear(ps); arb_clear(qs); arb_clear(qc);
    arb_clear(f); arb_clear(nu);
}

/* Taylor evaluation at cell center uc (|4pi(uc-u0)| <= hX enforced):
   class-sum balls (poly + remainder) -> shared assembly + telescope gate. */
static void tpanel_eval(const tpanel_t *pn, const cchart_t *ch,
                        const tierled_t *tl, double uc, eres_t *r, etmp_t *m,
                        arb_struct *dxpow /* D+1 temps */) {
    const slong D = TC_DEG;
    arb_t dx, x;
    arb_init(dx); arb_init(x);
    arb_set_d(dx, uc);
    { arb_t t2; arb_init(t2); arb_set_d(t2, pn->u0);
      arb_sub(dx, dx, t2, WPHI); arb_clear(t2); }
    arb_mul(dx, dx, g_4pi, WPHI);
    { /* structural guard: the remainder ball is only valid for |dx|<=hX */
        arb_t adx; arb_init(adx); arb_abs(adx, dx);
        arf_t ub; arf_init(ub); arb_get_ubound_arf(ub, adx, 64);
        if (arf_get_d(ub, ARF_RND_UP) > tl->hX * (1.0 + 1e-9)) {
            fprintf(stderr, "PANEL RANGE VIOLATION |dx|=%.6e > hX=%.6e "
                    "(tiling bug). ABORT.\n", arf_get_d(ub, ARF_RND_UP), tl->hX);
            exit(4);
        }
        arf_clear(ub); arb_clear(adx);
    }
    arb_one(dxpow + 0);
    for (slong k = 1; k <= D; k++)
        arb_mul(dxpow + k, dxpow + k - 1, dx, PREC);
    for (int c = 0; c < 26; c++) {
        arb_dot(m->ScR + c, NULL, 0, pn->cR + (slong)c * (D + 1), 1,
                dxpow, 1, D + 1, PREC);
        arb_add_error(m->ScR + c, tl->remR + c);
        arb_dot(m->ScI + c, NULL, 0, pn->cI + (slong)c * (D + 1), 1,
                dxpow, 1, D + 1, PREC);
        arb_add_error(m->ScI + c, tl->remI + c);
    }
    x_from_u(x, uc);
    eval_from_class_sums(ch, x, r, m);
    arb_clear(dx); arb_clear(x);
}

/* ─────────────────────── shared setup ─────────────────────────────── */
static cchart_t g_chs[2];
static tierled_t g_tls[2];

static void tier_setup(void) {
    build_tables();
    cchart_build(&g_chs[0], NWIN);
    cchart_build(&g_chs[1], NWIN + 1);
    build_invfact();
    tierled_build(&g_tls[0], &g_chs[0], TC_DEG);
    tierled_build(&g_tls[1], &g_chs[1], TC_DEG);
    { arb_t p; arb_init(p); arb_const_pi(p, 2 * WPHI); arb_clear(p); }
}

static void print_ledger_json(FILE *f) {
    fprintf(f, "  \"ledger\": {\n");
    for (int s = 0; s < 2; s++) {
        fprintf(f, "    \"side%d\": {\"chartM\": %lu, \"lipAlias\": %.9f, "
                "\"lip2Derot\": %.9f, \"staticOverhang\": %.9f,\n"
                "      \"lipPilotOld\": %.6f, \"lipE97\": %.6f, "
                "\"panelHalfWidthX\": %.9f, \"panelWidthU\": %.9f, "
                "\"degree\": %ld}%s\n",
                s, g_chs[s].M, arb_ub_d(g_tls[s].lipAlias),
                arb_ub_d(g_tls[s].lip2Derot), arb_ub_d(g_tls[s].staticOverhang),
                arb_ub_d(g_chs[s].lipPilot), arb_ub_d(g_chs[s].lipE97),
                g_tls[s].hX, g_tls[s].wu, (long)TC_DEG, s == 0 ? "," : "");
    }
    fprintf(f, "  },\n");
}

/* ─────────────────────── ledger mode ──────────────────────────────── */
static int mode_ledger(void) {
    tier_setup();
    printf("{\n");
    print_ledger_json(stdout);
    int fails = 0;
    for (int s = 0; s < 2; s++) {
        double la = arb_ub_d(g_tls[s].lipAlias);
        double l2 = arb_ub_d(g_tls[s].lip2Derot);
        double so = arb_ub_d(g_tls[s].staticOverhang);
        if (fabs(la - LIP_ALIAS_FROZEN[s]) / LIP_ALIAS_FROZEN[s] > 1e-4) fails++;
        if (fabs(l2 - LIP2_DEROT_FROZEN[s]) / LIP2_DEROT_FROZEN[s] > 1e-4) fails++;
        if (fabs(so - STATIC_OVERHANG_FROZEN[s]) / STATIC_OVERHANG_FROZEN[s] > 1e-4) fails++;
        if (!(la < arb_ub_d(g_chs[s].lipPilot))) fails++;
    }
    printf("  \"frozenCrossCheck\": \"%s\",\n", fails ? "FAIL" : "PASS");
    printf("  \"honesty\": \"rigorous Arb re-derivation of the imp-95210 "
           "alias-decomposed ledger; the derotated Tier-S variant and static "
           "overhang mass are diagnostics; promotes no bound; NO QED\"\n}\n");
    return fails ? 1 : 0;
}

/* ─────────────────────── selfcheck mode ───────────────────────────── */
static int mode_tier_selfcheck(void) {
    int fails = 0;
    tier_setup();
    printf("degree=%ld prec=%ld hX=%.6f (x units) panelWidthU=%.6f\n",
           (long)TC_DEG, (long)PREC, g_tls[0].hX, g_tls[0].wu);
    for (int s = 0; s < 2; s++) {
        double la = arb_ub_d(g_tls[s].lipAlias);
        double lp = arb_ub_d(g_chs[s].lipPilot);
        printf("side%d: lipAlias<=%.6f (frozen %.6f) lip2Derot<=%.6f "
               "staticOverhang<=%.6f lipPilotOld<=%.6f\n",
               s, la, LIP_ALIAS_FROZEN[s], arb_ub_d(g_tls[s].lip2Derot),
               arb_ub_d(g_tls[s].staticOverhang), lp);
        if (fabs(la - LIP_ALIAS_FROZEN[s]) / LIP_ALIAS_FROZEN[s] > 1e-4 || la >= lp) {
            printf("[FAIL] alias ledger cross-check side %d\n", s); fails++;
        } else printf("[PASS] alias ledger matches frozen doubles, < old ledger\n");
    }
    /* panel containment: Taylor ball must CONTAIN the direct Arb ball at
       several offsets across the panel (both give rigorous enclosures of
       the same true value; direct radii ~1e-33, Taylor radii ~remainder) */
    eres_t rT, rD; eres_init(&rT); eres_init(&rD);
    etmp_t tm; etmp_init(&tm);
    arb_struct *dxpow = (arb_struct *)malloc((size_t)(TC_DEG + 1) * sizeof(arb_struct));
    for (slong k = 0; k <= TC_DEG; k++) arb_init(dxpow + k);
    tpanel_t pn; tpanel_init(&pn);
    double offs[5] = { 0.0, 0.31, -0.47, 0.93, -0.93 };
    double t0 = now_wall();
    tpanel_build(&pn, &g_chs[0], 12345.25, &tm);
    double tBuild = now_wall() - t0;
    printf("panel build: %.2f s (O(N) pass, degree %ld)\n", tBuild, (long)TC_DEG);
    arb_t x;
    arb_init(x);
    for (int k = 0; k < 5; k++) {
        double uc = 12345.25 + offs[k] * g_tls[0].wu * 0.5;
        double t1 = now_wall();
        tpanel_eval(&pn, &g_chs[0], &g_tls[0], uc, &rT, &tm, dxpow);
        double tEval = now_wall() - t1;
        x_from_u(x, uc);
        eval_point(&g_chs[0], x, &rD, &tm);
        int ok = arb_contains(rT.pilot, rD.pilot) &&
                 arb_contains(rT.absE97, rD.absE97) &&
                 arb_contains(rT.E97re, rD.E97re) &&
                 arb_contains(rT.E97im, rD.E97im);
        for (int j = 0; j < 25; j++)
            ok = ok && arb_contains(rT.Dre[j], rD.Dre[j]) &&
                       arb_contains(rT.Dim[j], rD.Dim[j]);
        printf("[%s] offset %+0.2f*h: pilot mid %.16f (radT %.2e radD %.2e) "
               "|E97| mid %.16f eval %.1f ms telRad %.2e\n",
               ok ? "PASS" : "FAIL", offs[k], arb_mid_d(rT.pilot),
               arb_rad_d(rT.pilot), arb_rad_d(rD.pilot), arb_mid_d(rT.absE97),
               tEval * 1e3, arb_rad_d(rT.telre));
        if (!ok) fails++;
        if (arb_rad_d(rT.pilot) > 1e-10) {
            printf("[FAIL] Taylor radius blowup %.3e\n", arb_rad_d(rT.pilot));
            fails++;
        }
    }
    printf(fails ? "TIER SELFCHECK: %d FAILURES\n" : "TIER SELFCHECK: ALL PASS\n",
           fails);
    return fails ? 1 : 0;
}

/* ─────────────────────── point / validate modes ───────────────────── */
static void mode_tier_point(double w, int side) {
    tier_setup();
    double twoN1 = (double)(2 * NWIN + 1);
    double uc = w * twoN1;
    /* deliberate off-center panel so Horner + remainder are exercised */
    double u0 = uc + 0.31 * g_tls[side].wu;
    eres_t r; eres_init(&r);
    etmp_t tm; etmp_init(&tm);
    arb_struct *dxpow = (arb_struct *)malloc((size_t)(TC_DEG + 1) * sizeof(arb_struct));
    for (slong k = 0; k <= TC_DEG; k++) arb_init(dxpow + k);
    tpanel_t pn; tpanel_init(&pn);
    tpanel_build(&pn, &g_chs[side], u0, &tm);
    tpanel_eval(&pn, &g_chs[side], &g_tls[side], uc, &r, &tm, dxpow);
    print_point_json(stdout, w, side, &r, &g_chs[side]);
    printf("\n");
}

static int mode_tier_validate(int npts, unsigned seed) {
    tier_setup();
    double twoN1 = (double)(2 * NWIN + 1);
    eres_t rT, rD; eres_init(&rT); eres_init(&rD);
    etmp_t tm; etmp_init(&tm);
    arb_struct *dxpow = (arb_struct *)malloc((size_t)(TC_DEG + 1) * sizeof(arb_struct));
    for (slong k = 0; k <= TC_DEG; k++) arb_init(dxpow + k);
    tpanel_t pn; tpanel_init(&pn);
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
        double off = (((double)rand() / RAND_MAX) - 0.5) * 0.9;
        double u0 = uc + off * g_tls[side].wu * 0.5;
        tpanel_build(&pn, &g_chs[side], u0, &tm);
        tpanel_eval(&pn, &g_chs[side], &g_tls[side], uc, &rT, &tm, dxpow);
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
        fprintf(stderr, "[%s] %d/%d w=%.12f side=%d off=%+.3f pilot %.16f "
                "radT %.2e\n", ok ? "PASS" : "FAIL", i + 1, npts, w, side,
                off, arb_mid_d(rT.pilot), arb_rad_d(rT.pilot));
    }
    printf("{ \"mode\": \"tier-validate\", \"points\": %d, \"seed\": %u, "
           "\"containmentFailures\": %d,\n  \"maxMidDevPilot\": %.3e, "
           "\"maxMidDevE97\": %.3e, \"maxTaylorRad\": %.3e, "
           "\"maxTelescopeRad\": %.3e }\n",
           npts, seed, fails, maxDevP, maxDevE, maxRadT, maxTel);
    return fails ? 1 : 0;
}

/* batch Taylor-panel enclosures for the external dd cross-validation:
   FILE has "w side" per line; one setup, off-center panel per point,
   JSON array in cert_window's point format. */
static void mode_tier_validatedd(const char *file) {
    FILE *f = fopen(file, "r");
    if (!f) { fprintf(stderr, "cannot open %s\n", file); exit(2); }
    double ws[512]; int sides[512]; int np = 0;
    while (np < 512 && fscanf(f, "%lf %d", &ws[np], &sides[np]) == 2) np++;
    fclose(f);
    tier_setup();
    double twoN1 = (double)(2 * NWIN + 1);
    eres_t r; eres_init(&r);
    etmp_t tm; etmp_init(&tm);
    arb_struct *dxpow = (arb_struct *)malloc((size_t)(TC_DEG + 1) * sizeof(arb_struct));
    for (slong k = 0; k <= TC_DEG; k++) arb_init(dxpow + k);
    tpanel_t pn; tpanel_init(&pn);
    printf("[\n");
    for (int i = 0; i < np; i++) {
        double uc = ws[i] * twoN1;
        double u0 = uc + ((i % 3) - 1) * 0.29 * g_tls[sides[i]].wu;
        tpanel_build(&pn, &g_chs[sides[i]], u0, &tm);
        tpanel_eval(&pn, &g_chs[sides[i]], &g_tls[sides[i]], uc, &r, &tm, dxpow);
        print_point_json(stdout, ws[i], sides[i], &r, &g_chs[sides[i]]);
        printf("%s\n", i < np - 1 ? "," : "");
        fflush(stdout);
        fprintf(stderr, "validatedd %d/%d done (w=%.17g side=%d)\n",
                i + 1, np, ws[i], sides[i]);
    }
    printf("]\n");
}

/* ─────────────────────── slice (tiered certify) ───────────────────── */
typedef struct { double ulo, uhi; uint8_t needP, needE; int depth; } tcell_t;

typedef struct {
    int side;
    double uLo, uHi;
    long npanels;
    int reqP, reqE;
    long budgetCells, maxDepth;
    double minWidthU;
    /* shared cursor + accounting */
    long nextPanel;
    long panels, cellsTaylor, cellsTierP;
    long tierB0, tierBsub, tierP, tierSseam;
    long failP, failE, pilotGapCells, unprocessed;
    double supUbP, supUbE, maxRad, maxTel;
    double panelSec, cellSec;
    tcell_t *failv; long failn, failcap;   /* fail-closed record */
    pthread_mutex_t mu;
} tsctx_t;

static void ts_fail_push(tsctx_t *c, tcell_t cl) {
    if (c->failn == c->failcap) {
        c->failcap = c->failcap ? c->failcap * 2 : 256;
        c->failv = (tcell_t *)realloc(c->failv, (size_t)c->failcap * sizeof(tcell_t));
        if (!c->failv) { fprintf(stderr, "alloc failure\n"); exit(2); }
    }
    if (c->failn < 100000) c->failv[c->failn++] = cl;
}

static double thread_cpu(void) {
    struct timespec t;
    clock_gettime(CLOCK_THREAD_CPUTIME_ID, &t);
    return (double)t.tv_sec + 1e-9 * (double)t.tv_nsec;
}

static void *tier_worker(void *arg) {
    tsctx_t *cc = (tsctx_t *)arg;
    const cchart_t *ch = &g_chs[cc->side];
    const tierled_t *tl = &g_tls[cc->side];
    eres_t r; eres_init(&r);
    etmp_t tm; etmp_init(&tm);
    arb_struct *dxpow = (arb_struct *)malloc((size_t)(TC_DEG + 1) * sizeof(arb_struct));
    for (slong k = 0; k <= TC_DEG; k++) arb_init(dxpow + k);
    tpanel_t pn; tpanel_init(&pn);
    arb_t x, hx, tot, t2;
    arb_init(x); arb_init(hx); arb_init(tot); arb_init(t2);
    arf_t ub; arf_init(ub);
    tcell_t *stack = NULL; long sn = 0, scap = 0;
    double lipAliasUb = arb_ub_d(tl->lipAlias);
    double lipE97Ub = arb_ub_d(ch->lipE97);
    double thr = arf_get_d(g_thresh_lb, ARF_RND_DOWN);
    double fourpi = 4.0 * 3.14159265358979324;
    long localCellsT = 0, localCellsP = 0, localB0 = 0, localBsub = 0,
         localTierP = 0, localSeam = 0;
    for (;;) {
        long pi;
        pthread_mutex_lock(&cc->mu);
        pi = cc->nextPanel++;
        /* flush local tallies */
        cc->cellsTaylor += localCellsT; cc->cellsTierP += localCellsP;
        cc->tierB0 += localB0; cc->tierBsub += localBsub;
        cc->tierP += localTierP; cc->tierSseam += localSeam;
        localCellsT = localCellsP = localB0 = localBsub = localTierP = localSeam = 0;
        int over = (cc->budgetCells > 0 &&
                    cc->cellsTaylor + cc->cellsTierP >= cc->budgetCells);
        if (over && pi < cc->npanels)
            cc->unprocessed += cc->npanels - pi;   /* fail-closed */
        pthread_mutex_unlock(&cc->mu);
        if (pi >= cc->npanels || over) break;

        double pa = cc->uLo + (double)pi * tl->wu;
        double pb = pa + tl->wu;
        if (pb > cc->uHi) pb = cc->uHi;
        double u0 = 0.5 * (pa + pb);
        double tp0 = thread_cpu();
        tpanel_build(&pn, ch, u0, &tm);
        double tp1 = thread_cpu();

        /* center estimate -> root pre-split near the expected cell width */
        tpanel_eval(&pn, ch, tl, u0, &r, &tm, dxpow);
        localCellsT++;
        double vP = arb_ub_d(r.pilot), vE = arb_ub_d(r.absE97);
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
        sn = 0;
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
        double supP_loc = 0, supE_loc = 0, maxRad_loc = 0, maxTel_loc = 0;
        long failP_loc = 0, failE_loc = 0, gap_loc = 0;
        while (sn > 0) {
            tcell_t cl = stack[--sn];
            int firstTry = (cl.depth == 0);
            double uc = 0.5 * (cl.ulo + cl.uhi);
            tpanel_eval(&pn, ch, tl, uc, &r, &tm, dxpow);
            localCellsT++;
            if (cl.ulo <= TC_SEAM_GUARD_U ||
                cl.uhi >= (double)(2 * NWIN + 1) - TC_SEAM_GUARD_U)
                localSeam++;
            /* halfwidth in x, outward */
            arb_set_d(hx, cl.uhi);
            arb_set_d(t2, cl.ulo);
            arb_sub(hx, hx, t2, PREC);
            arb_mul(hx, hx, g_4pi, PREC);
            arb_mul_2exp_si(hx, hx, -1);
            int okP = !cl.needP, okE = !cl.needE;
            double ubPd = 0, ubEd = 0;
            if (cl.needP) {
                arb_set(tot, r.pilot);
                arb_addmul(tot, tl->lipAlias, hx, PREC);
                arb_get_ubound_arf(ub, tot, PREC);
                okP = arf_cmp(ub, g_thresh_lb) < 0;
                ubPd = arf_get_d(ub, ARF_RND_UP);
            }
            if (cl.needE) {
                arb_set(tot, r.absE97);
                arb_addmul(tot, ch->lipE97, hx, PREC);
                arb_get_ubound_arf(ub, tot, PREC);
                okE = arf_cmp(ub, g_thresh_lb) < 0;
                ubEd = arf_get_d(ub, ARF_RND_UP);
            }
            double rp = arb_rad_d(r.pilot), re2 = arb_rad_d(r.absE97);
            if (rp > maxRad_loc) maxRad_loc = rp;
            if (re2 > maxRad_loc) maxRad_loc = re2;
            double tr = arb_rad_d(r.telre), ti = arb_rad_d(r.telim);
            if (tr > maxTel_loc) maxTel_loc = tr;
            if (ti > maxTel_loc) maxTel_loc = ti;
            if (cl.needP && okP && ubPd > supP_loc) supP_loc = ubPd;
            if (cl.needE && okE && ubEd > supE_loc) supE_loc = ubEd;
            if (okP && okE) {
                if (firstTry) localB0++; else localBsub++;
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
            /* Tier P: one direct O(N) ball evaluation (tightest enclosure);
               the E97-direct target is the fallback (G3 semantics) */
            x_from_u(x, uc);
            eval_point(ch, x, &r, &tm);
            localCellsP++; localTierP++;
            int okP2 = okP, okE2 = okE;
            if (!okP) {
                arb_set(tot, r.pilot);
                arb_addmul(tot, tl->lipAlias, hx, PREC);
                arb_get_ubound_arf(ub, tot, PREC);
                okP2 = arf_cmp(ub, g_thresh_lb) < 0;
            }
            if (!okE && cl.needE) {
                arb_set(tot, r.absE97);
                arb_addmul(tot, ch->lipE97, hx, PREC);
                arb_get_ubound_arf(ub, tot, PREC);
                okE2 = arf_cmp(ub, g_thresh_lb) < 0;
            }
            if (okP2 && okE2) { localBsub++; continue; }
            /* FAIL-CLOSED record */
            if (!okP2) failP_loc++;
            if (!okE2) failE_loc++;
            if (!okP2 && (okE2 || !cl.needE)) gap_loc++;  /* pilot-only gap */
            pthread_mutex_lock(&cc->mu);
            ts_fail_push(cc, cl);
            pthread_mutex_unlock(&cc->mu);
        }
        double tp2 = thread_cpu();
        pthread_mutex_lock(&cc->mu);
        cc->panels++;
        cc->panelSec += tp1 - tp0;
        cc->cellSec += tp2 - tp1;
        if (supP_loc > cc->supUbP) cc->supUbP = supP_loc;
        if (supE_loc > cc->supUbE) cc->supUbE = supE_loc;
        if (maxRad_loc > cc->maxRad) cc->maxRad = maxRad_loc;
        if (maxTel_loc > cc->maxTel) cc->maxTel = maxTel_loc;
        cc->failP += failP_loc; cc->failE += failE_loc;
        cc->pilotGapCells += gap_loc;
        if (cc->panels % 25 == 0)
            fprintf(stderr, "side %d: panel %ld/%ld cellsT=%ld tierP=%ld "
                    "panelSec=%.0f cellSec=%.0f\n", cc->side, cc->panels,
                    cc->npanels, cc->cellsTaylor + localCellsT,
                    cc->tierP + localTierP, cc->panelSec, cc->cellSec);
        pthread_mutex_unlock(&cc->mu);
    }
    free(stack);
    for (slong k = 0; k <= TC_DEG; k++) arb_clear(dxpow + k);
    free(dxpow);
    tpanel_clear(&pn);
    eres_clear(&r); etmp_clear(&tm);
    arb_clear(x); arb_clear(hx); arb_clear(tot); arb_clear(t2); arf_clear(ub);
    flint_cleanup();
    return NULL;
}

static void mode_slice(double uLo, double uHi, int sideSel, int metricSel,
                       int nthreads, long budget, const char *outpath) {
    int reqP = (metricSel != 1), reqE = (metricSel != 0);
    double t0 = now_wall();
    tier_setup();
    double tSetup = now_wall() - t0;
    double twoN1 = (double)(2 * NWIN + 1);
    if (uHi <= 0) uHi = twoN1;
    FILE *f = outpath ? fopen(outpath, "w") : stdout;
    if (!f) { fprintf(stderr, "cannot open %s\n", outpath); exit(2); }
    fprintf(f, "{\n  \"mode\": \"tier-slice\", \"prec\": %ld, \"degree\": %ld, "
            "\"threads\": %d,\n", (long)PREC, (long)TC_DEG, nthreads);
    fprintf(f, "  \"threshold\": %s, \"rexExact\": %s,\n", THRESH_STR, REX_STR);
    fprintf(f, "  \"metric\": \"%s\", \"uRange\": [%.17g, %.17g],\n",
            metricSel == 0 ? "pilot" : metricSel == 1 ? "e97" : "both",
            uLo, uHi);
    fprintf(f, "  \"setupSeconds\": %.1f,\n", tSetup);
    print_ledger_json(f);
    fprintf(f, "  \"sides\": [\n");
    int allOk = 1;
    double totPanelSec = 0, totCellSec = 0;
    long totPanels = 0, totCellsT = 0, totCellsP = 0;
    long totFailP = 0, totFailE = 0, totUnproc = 0;
    int nsides = 0;
    for (int side = 0; side < 2; side++) {
        if (sideSel != 2 && sideSel != side) continue;
        nsides++;
        tsctx_t cc;
        memset(&cc, 0, sizeof(cc));
        cc.side = side;
        cc.uLo = uLo; cc.uHi = uHi;
        cc.reqP = reqP; cc.reqE = reqE;
        cc.budgetCells = budget;
        cc.maxDepth = 44;
        cc.minWidthU = 1e-9;
        cc.npanels = (long)ceil((uHi - uLo) / g_tls[side].wu);
        pthread_mutex_init(&cc.mu, NULL);
        pthread_t th[64];
        int nt = nthreads > 64 ? 64 : nthreads;
        double tw0 = now_wall();
        for (int i = 0; i < nt; i++) pthread_create(&th[i], NULL, tier_worker, &cc);
        for (int i = 0; i < nt; i++) pthread_join(th[i], NULL);
        double twall = now_wall() - tw0;
        int complete = (cc.unprocessed == 0);
        int certified = complete && cc.failP == 0 && cc.failE == 0;
        if (!certified) allOk = 0;
        fprintf(f, "    {\"side\": %d, \"chartM\": %lu, \"panels\": %ld, "
                "\"cellsTaylor\": %ld, \"cellsTierP\": %ld,\n",
                side, g_chs[side].M, cc.panels, cc.cellsTaylor, cc.cellsTierP);
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
        fprintf(f, "     \"panelCpuSeconds\": %.1f, \"cellCpuSeconds\": %.1f, "
                "\"wallSeconds\": %.1f,\n", cc.panelSec, cc.cellSec, twall);
        fprintf(f, "     \"uncertifiedCells\": [");
        for (long i = 0; i < cc.failn && i < 1000; i++)
            fprintf(f, "%s[%.17g,%.17g,%d,%d]", i ? "," : "",
                    cc.failv[i].ulo, cc.failv[i].uhi,
                    cc.failv[i].needP, cc.failv[i].needE);
        fprintf(f, "]}%s\n", (sideSel == 2 && side == 0) ? "," : "");
        totPanelSec += cc.panelSec; totCellSec += cc.cellSec;
        totPanels += cc.panels; totCellsT += cc.cellsTaylor;
        totCellsP += cc.cellsTierP;
        totFailP += cc.failP; totFailE += cc.failE;
        totUnproc += cc.unprocessed;
        free(cc.failv);
    }
    fprintf(f, "  ],\n");
    /* measured rate + full-window extrapolation */
    double fourpi = 4.0 * 3.14159265358979324;
    double sliceX = (uHi - uLo) * fourpi * (double)nsides;
    double fullX = twoN1 * fourpi * 2.0;      /* both sides */
    double cpuSec = totPanelSec + totCellSec;
    double secPerX = cpuSec / sliceX;
    /* ball-op estimate (analytic op counts at the measured cell/panel mix):
       panel: N*(3D+8) coefficient ops + 52(D+1) scalings;
       Taylor cell: 52(D+1) dot-ops + (D+1) powers + ~900 assembly;
       Tier-P cell: ~8N. */
    double N = (double)NWIN;
    double opsPanel = N * (3.0 * (double)TC_DEG + 8.0) + 52.0 * (TC_DEG + 1);
    double opsCellT = 52.0 * (TC_DEG + 1) + (TC_DEG + 1) + 900.0;
    double opsCellP = 8.0 * N;
    double ballOps = (double)totPanels * opsPanel +
                     (double)totCellsT * opsCellT +
                     (double)totCellsP * opsCellP;
    fprintf(f, "  \"measured\": {\n");
    fprintf(f, "    \"sliceXUnits\": %.6e, \"cpuSeconds\": %.1f, "
            "\"cpuSecondsPerXUnit\": %.4f,\n", sliceX, cpuSec, secPerX);
    fprintf(f, "    \"panelSecondsPerXUnit\": %.4f, \"cellSecondsPerXUnit\": %.4f,\n",
            totPanelSec / sliceX, totCellSec / sliceX);
    fprintf(f, "    \"cellsPerXUnit\": %.2f, \"ballOpsEstimate\": %.4e, "
            "\"ballOpsPerXUnit\": %.4e,\n",
            (double)(totCellsT + totCellsP) / sliceX, ballOps, ballOps / sliceX);
    fprintf(f, "    \"secondsPerBallOp\": %.3e\n  },\n",
            ballOps > 0 ? cpuSec / ballOps : 0.0);
    fprintf(f, "  \"fullWindowExtrapolation\": {\n");
    fprintf(f, "    \"fullXUnitsBothSides\": %.6e,\n", fullX);
    fprintf(f, "    \"cpuDaysAtSliceRate\": %.1f,\n", secPerX * fullX / 86400.0);
    fprintf(f, "    \"panelOnlyFloorCpuDays\": %.1f,\n",
            (totPanelSec / sliceX) * fullX / 86400.0);
    fprintf(f, "    \"ballOpsFullWindowAtSliceRate\": %.4e,\n",
            (ballOps / sliceX) * fullX);
    fprintf(f, "    \"directBaselineCpuDays\": 1.64e5, "
            "\"designTierBudgetBallOps\": 1.1e13,\n");
    fprintf(f, "    \"speedupVsDirect\": %.1f\n  },\n",
            1.64e5 / (secPerX * fullX / 86400.0));
    int fullCover = (sideSel == 2) && (uLo == 0.0) && (uHi == twoN1) &&
                    (metricSel == 2);
    fprintf(f, "  \"fullWindowBothSides\": %s,\n", fullCover ? "true" : "false");
    fprintf(f, "  \"promotionFlag\": %s,\n",
            (allOk && fullCover && totUnproc == 0) ? "true" : "false");
    fprintf(f, "  \"certifiedSubRange\": %s,\n",
            (allOk && totFailP == 0 && totFailE == 0 && totUnproc == 0)
                ? "true" : "false");
    fprintf(f, "  \"wallSeconds\": %.1f,\n", now_wall() - t0);
    fprintf(f, "  \"honesty\": \"tiered certifier slice: certified continuum "
            "sup bounds hold only on the covered uRange and sides; sub-range "
            "runs can never set the promotion flag; a pilot cell failure is a "
            "stop signal for independent defect radii, not disproof of the "
            "recombined gate; promotes no Lambda bound; NO QED; PT "
            "Lambda<=0.2 benchmark\"\n}\n");
    if (outpath) fclose(f);
}

/* ─────────────────────── main ─────────────────────────────────────── */
#ifndef TIER_CERT_NO_MAIN
int main(int argc, char **argv) {
    flint_set_num_threads(1);
    if (argc < 2) {
        fprintf(stderr,
            "usage: %s ledger [prec] [degree]\n"
            "       %s selfcheck [prec] [degree]\n"
            "       %s point W SIDE [prec] [degree]\n"
            "       %s validate NPTS SEED [prec] [degree]\n"
            "       %s slice --u-lo A --u-hi B [--side 0|1|both]\n"
            "                [--metric pilot|e97|both] [--threads T] [--prec P]\n"
            "                [--degree D] [--budget-cells B] [--out FILE]\n",
            argv[0], argv[0], argv[0], argv[0], argv[0]);
        return 2;
    }
    if (strcmp(argv[1], "ledger") == 0) {
        if (argc >= 3) PREC = atol(argv[2]);
        if (argc >= 4) TC_DEG = atol(argv[3]);
        init_globals();
        return mode_ledger();
    }
    if (strcmp(argv[1], "selfcheck") == 0) {
        if (argc >= 3) PREC = atol(argv[2]);
        if (argc >= 4) TC_DEG = atol(argv[3]);
        init_globals();
        return mode_tier_selfcheck();
    }
    if (strcmp(argv[1], "point") == 0 && argc >= 4) {
        if (argc >= 5) PREC = atol(argv[4]);
        if (argc >= 6) TC_DEG = atol(argv[5]);
        init_globals();
        mode_tier_point(strtod(argv[2], NULL), atoi(argv[3]));
        return 0;
    }
    if (strcmp(argv[1], "validate") == 0 && argc >= 4) {
        if (argc >= 5) PREC = atol(argv[4]);
        if (argc >= 6) TC_DEG = atol(argv[5]);
        init_globals();
        return mode_tier_validate(atoi(argv[2]), (unsigned)atoi(argv[3]));
    }
    if (strcmp(argv[1], "validatedd") == 0 && argc >= 3) {
        if (argc >= 4) PREC = atol(argv[3]);
        if (argc >= 5) TC_DEG = atol(argv[4]);
        init_globals();
        mode_tier_validatedd(argv[2]);
        return 0;
    }
    if (strcmp(argv[1], "slice") == 0) {
        double uLo = 0.0, uHi = -1.0;
        int sideSel = 2, metricSel = 2, nth = 8;
        long budget = 0;
        const char *out = NULL;
        for (int i = 2; i < argc - 1; i++) {
            if (strcmp(argv[i], "--u-lo") == 0) uLo = strtod(argv[++i], NULL);
            else if (strcmp(argv[i], "--u-hi") == 0) uHi = strtod(argv[++i], NULL);
            else if (strcmp(argv[i], "--threads") == 0) nth = atoi(argv[++i]);
            else if (strcmp(argv[i], "--prec") == 0) PREC = atol(argv[++i]);
            else if (strcmp(argv[i], "--degree") == 0) TC_DEG = atol(argv[++i]);
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
        init_globals();
        mode_slice(uLo, uHi, sideSel, metricSel, nth, budget, out);
        return 0;
    }
    fprintf(stderr, "unknown mode %s\n", argv[1]);
    return 2;
}
#endif /* TIER_CERT_NO_MAIN */
