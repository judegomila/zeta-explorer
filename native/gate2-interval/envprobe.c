/*
 * envprobe.c — imp-95210: envelope-scale measurement for the window-1
 * pilot certification pivot (measurement only; changes no bound; NO QED).
 *
 * Question: does the MODULUS |D_j| of each eq-(13) defect vary at a
 * scale much slower than the ladder phases (~1.9e7 turns across the
 * window), so that a certified cell subdivision can live at envelope
 * scale instead of phase scale (dry-run: 1.115e10 cells => 1.6e5
 * CPU-days at direct O(N) arb evaluation)?
 *
 * Structure used (exact, from ln-additivity theta_{pn} = theta_p +
 * theta_n and the locked convention of gate2-lane-a/main.c):
 *
 *   D_j = A_{<j} (q_p G_j - H_j),   p = p_j (descending 97..2)
 *   q_p G_j - H_j = o_j + mm_j + rr_j             (exact identity)
 *     o_j  = q_p * Tail_j,  Tail_j = sum_{n in Gset_j, p*n > M} aB_n e^{-i th_n}
 *            (direct-ladder alias/overhang: freq band nu_{pn} in
 *             [ln M, ln pM]/2 — NARROW band, width (ln p)/2)
 *     mm_j = sum_{n in Gset_j, p*n <= M} (amp_p aB_n - aB_{pn}) e^{-i th_{pn}}
 *            (amplitude-mismatch chirp: aB_{pn} = amp_p aB_n e^{2 c2 Lp Ln})
 *     rr_j = q_p RefG_j - RefH_j    (reflected ladder: does NOT telescope)
 *   where Gset_j = classes {0(coprime), 1..j}, aB_n = direct amplitude,
 *   gaA_n = gamma * reflected amplitude, RefG/RefH the reflected sums.
 *
 * The probe measures, on fine u-scans (u = window offset in q units,
 * x = 4*pi*(q0+u), dx = 4*pi*du):
 *   - |D_j|, |A_<j|, |o_j|, |mm_j|, |rr_j|, |RefG_j|, |RefH_j|, |Tail_j|
 *   - max finite-difference derivative of each modulus (lags 1/16/256)
 *   - pointwise envelope bounds and their sups:
 *       U3_j = |A_<j|(|o_j|+|mm_j|+|rr_j|)          (>= |D_j| exactly)
 *       U2_j = |A_<j|(|o_j|+|mm_j|+amp|RefG_j|+|RefH_j|)
 *       U2h_j = |A_<j| * envMass_j                  (static masses)
 *       U1_j = supA_j * envMass_j                   (fully static)
 *   - containment check U3 >= |D| - 1e-12 at every point
 *   - static mass/Lipschitz ledgers per piece (double precision here;
 *     the certifier re-derives them in Arb)
 *
 * Modes:
 *   ./envprobe masses                       (static tables, no scan)
 *   ./envprobe scan NANCH NPTS DELTA NTH SEED OUT.json
 *   ./envprobe ascan NPTS NTH               (Level-1 bound over full window)
 *
 * Measurement only. NO QED. PT Lambda <= 0.2 stays the benchmark.
 */
#define main gate2_main
#include "../gate2-lane-a/main.c"
#undef main

/* ────────────────────────── probe side state ──────────────────────── */
typedef struct {
    fastchart_t fc;
    unsigned long M;
    double *aB, *gaA;          /* split amplitudes, n = 0..M */
    uint8_t *jmaxTab;          /* per n: max j with p_j * n > M (0 if none) */
    /* per j = 1..25 (index j-1); p = PRIMES97[25-j] */
    double amp[25];            /* b_p p^{-sigmaB} */
    double nuP[25];            /* ln(p)/2 */
    double mTail[25];          /* sum aB_n over overhang set (no amp factor) */
    double mTailNuC[25];       /* sum aB_n * |nu_pn - nubar_j| (derotated Lip) */
    double mTailNu[25];        /* sum aB_n * nu_pn (full-band Lip) */
    double nubar[25];          /* band center (ln M + ln p / 2)/2 */
    double mMm[25], mMmNu[25]; /* mismatch mass, and * nu_pn */
    double mRefG[25], mRefGnuAbsP[25]; /* reflected G mass, * |nu_n - nu_p| */
    double mRefH[25], mRefHnu[25];
    double supA[25];           /* prod_{i<j} (1 + amp_i) */
    double lipA[25];           /* d|A_<j|/dx ledger */
    double envMass[25];        /* amp*mTail + mMm + amp*mRefG + mRefH */
} eside_t;

static void eside_build(eside_t *es, unsigned long M) {
    fastchart_build(&es->fc, M);
    es->M = M;
    const double c2 = T0d * 0.25;
    const double sB = es->fc.ch.sigmaB, sA = es->fc.ch.sigmaA, g = es->fc.ch.gamma;
    es->aB = (double *)malloc((M + 1) * sizeof(double));
    es->gaA = (double *)malloc((M + 1) * sizeof(double));
    es->jmaxTab = (uint8_t *)calloc(M + 1, 1);
    if (!es->aB || !es->gaA || !es->jmaxTab) { fprintf(stderr, "alloc\n"); exit(2); }
    es->aB[0] = es->gaA[0] = 0.0;
    for (unsigned long n = 1; n <= M; n++) {
        double Lh = g_lnn[n].hi;
        es->aB[n] = exp((c2 * Lh - sB) * Lh);
        es->gaA[n] = g * exp((c2 * Lh - sA) * Lh);
        /* jmax: p_j * n > M, p_j descending in j => holds for j <= jmax */
        int jm = 0;
        for (int j = 25; j >= 1; j--) {
            if ((unsigned long)PRIMES97[25 - j] * n > M) { jm = j; break; }
        }
        /* p_j decreasing with j; p_j*n > M easiest for small j (large p).
           The loop above finds the LARGEST j satisfying it. */
        es->jmaxTab[n] = (uint8_t)jm;
    }
    double lnM = g_lnn[M].hi;
    for (int j = 1; j <= 25; j++) {
        int i = 25 - j, p = PRIMES97[i];
        double Lp = g_lnn[p].hi;
        es->amp[j - 1] = es->fc.ampP[i];
        es->nuP[j - 1] = 0.5 * Lp;
        es->nubar[j - 1] = 0.5 * (lnM + 0.5 * Lp);  /* center of [lnM, ln pM]/2 */
        es->mTail[j - 1] = es->mTailNuC[j - 1] = es->mTailNu[j - 1] = 0.0;
        es->mMm[j - 1] = es->mMmNu[j - 1] = 0.0;
        es->mRefG[j - 1] = es->mRefGnuAbsP[j - 1] = 0.0;
        es->mRefH[j - 1] = es->mRefHnu[j - 1] = 0.0;
    }
    /* per-j mass passes */
    for (unsigned long n = 1; n <= M; n++) {
        int c = g_cls[n];
        double Ln = g_lnn[n].hi;
        for (int j = (c == 0 ? 1 : c); j <= 25; j++) {
            if (c != 0 && c > j) continue;      /* n must be in Gset_j */
            if (c != 0 && j < c) continue;
            int i = 25 - j;
            unsigned long p = (unsigned long)PRIMES97[i];
            double Lp = g_lnn[p].hi;
            double nupn = 0.5 * (Lp + Ln);
            if (p * n > M) {
                es->mTail[j - 1] += es->aB[n];
                double d = nupn - es->nubar[j - 1];
                es->mTailNuC[j - 1] += es->aB[n] * fabs(d);
                es->mTailNu[j - 1] += es->aB[n] * nupn;
            } else {
                double mism = es->aB[p * n] - es->amp[j - 1] * es->aB[n];
                es->mMm[j - 1] += fabs(mism);
                es->mMmNu[j - 1] += fabs(mism) * nupn;
            }
            es->mRefG[j - 1] += es->gaA[n];
            es->mRefGnuAbsP[j - 1] += es->gaA[n] * fabs(0.5 * Ln - es->nuP[j - 1]);
        }
        if (c >= 1) {
            es->mRefH[c - 1] += es->gaA[n];
            es->mRefHnu[c - 1] += es->gaA[n] * 0.5 * Ln;
        }
    }
    double prod = 1.0;
    for (int j = 1; j <= 25; j++) {
        es->supA[j - 1] = prod;
        /* lipA_j = sum_{i<j} amp_i nu_i prod_{k<j,k!=i}(1+amp_k) */
        double lip = 0.0;
        for (int a = 1; a < j; a++) {
            double t = es->amp[a - 1] * es->nuP[a - 1];
            for (int b = 1; b < j; b++)
                if (b != a) t *= (1.0 + es->amp[b - 1]);
            lip += t;
        }
        es->lipA[j - 1] = lip;
        es->envMass[j - 1] = es->amp[j - 1] * es->mTail[j - 1] + es->mMm[j - 1]
                           + es->amp[j - 1] * es->mRefG[j - 1] + es->mRefH[j - 1];
        prod *= (1.0 + es->amp[j - 1]);
    }
}

/* ────────────────────────── per-point evaluation ───────────────────── */
#define NQ 12   /* tracked modulus channels per j */
/* channel order: 0 absD, 1 absA, 2 absO, 3 absMm, 4 absRr, 5 absRefG,
   6 absRefH, 7 absTail, 8 U3, 9 U2, 10 U2h, 11 absDr */
typedef struct {
    double q[25][NQ];
    double pilot, sumU3, sumU2, sumU2h, absE97, telErr;
} epoint_t;

static void eval_probe(const eside_t *es, dd x, epoint_t *o) {
    const unsigned long M = es->M;
    dd Y = dd_mul(x, INV4PI);
    const double Yh = Y.hi, Yl = Y.lo;
    double DirR[26], DirI[26], RefR[26], RefI[26];
    double TailR[26], TailI[26];
    memset(DirR, 0, sizeof(DirR)); memset(DirI, 0, sizeof(DirI));
    memset(RefR, 0, sizeof(RefR)); memset(RefI, 0, sizeof(RefI));
    memset(TailR, 0, sizeof(TailR)); memset(TailI, 0, sizeof(TailI));
    for (unsigned long n = 1; n <= M; n++) {
        double fr = phase_frac(Yh, Yl, g_lnn[n].hi, g_lnn[n].lo);
        double th = 6.283185307179586232 * fr;
        double sn, cs;
        __sincos(th, &sn, &cs);
        double dr = es->aB[n] * cs, di = -es->aB[n] * sn;
        double rr = es->gaA[n] * cs, ri = es->gaA[n] * sn;
        int c = g_cls[n];
        DirR[c] += dr; DirI[c] += di;
        RefR[c] += rr; RefI[c] += ri;
        int jm = es->jmaxTab[n];
        int jlo = c == 0 ? 1 : c;
        for (int j = jlo; j <= jm; j++) { TailR[j] += dr; TailI[j] += di; }
    }
    /* full sums for E97 cross-check */
    double Fre = 0, Fim = 0;
    for (int c = 0; c < 26; c++) { Fre += DirR[c] + RefR[c]; Fim += DirI[c] + RefI[c]; }
    double Cre = DirR[0] + RefR[0], Cim = DirI[0] + RefI[0];

    double cgR = DirR[0], cgI = DirI[0];      /* cumulative direct G */
    double crR = RefR[0], crI = RefI[0];      /* cumulative reflected G */
    double apre = 1.0, apim = 0.0;            /* A_{<j} */
    double telre = 0.0, telim = 0.0;
    o->pilot = o->sumU3 = o->sumU2 = o->sumU2h = 0.0;
    for (int j = 1; j <= 25; j++) {
        int i = 25 - j, p = PRIMES97[i];
        double fr = phase_frac(Yh, Yl, g_lnn[p].hi, g_lnn[p].lo);
        double th = 6.283185307179586232 * fr;
        double sn, cs;
        __sincos(th, &sn, &cs);
        double amp = es->amp[j - 1];
        double qre = amp * cs, qim = -amp * sn;
        cgR += DirR[j]; cgI += DirI[j];
        crR += RefR[j]; crI += RefI[j];
        /* direct residual dr = q*DirG - DirH */
        double drR = qre * cgR - qim * cgI - DirR[j];
        double drI = qre * cgI + qim * cgR - DirI[j];
        /* overhang o = q * Tail */
        double oR = qre * TailR[j] - qim * TailI[j];
        double oI = qre * TailI[j] + qim * TailR[j];
        /* mismatch mm = dr - o (exact identity) */
        double mR = drR - oR, mI = drI - oI;
        /* reflected residual rr = q*RefG - RefH */
        double rR = qre * crR - qim * crI - RefR[j];
        double rI = qre * crI + qim * crR - RefI[j];
        /* defect D = A_<j * (dr + rr) */
        double tR = drR + rR, tI = drI + rI;
        double DR = apre * tR - apim * tI;
        double DI = apre * tI + apim * tR;
        double absD = hypot(DR, DI);
        double absA = hypot(apre, apim);
        double absO = hypot(oR, oI), absMm = hypot(mR, mI), absRr = hypot(rR, rI);
        double absRefG = hypot(crR, crI), absRefH = hypot(RefR[j], RefI[j]);
        double absTail = hypot(TailR[j], TailI[j]);
        double U3 = absA * (absO + absMm + absRr);
        double U2 = absA * (absO + absMm + amp * absRefG + absRefH);
        double U2h = absA * es->envMass[j - 1];
        double *qq = o->q[j - 1];
        qq[0] = absD; qq[1] = absA; qq[2] = absO; qq[3] = absMm; qq[4] = absRr;
        qq[5] = absRefG; qq[6] = absRefH; qq[7] = absTail;
        qq[8] = U3; qq[9] = U2; qq[10] = U2h; qq[11] = hypot(drR, drI);
        o->pilot += absD;
        o->sumU3 += U3; o->sumU2 += U2; o->sumU2h += U2h;
        telre += DR; telim += DI;
        /* advance A_{<j+1} = A_{<j} (1 - q_j) */
        double nre = apre * (1.0 - qre) + apim * qim;
        double nim = apim * (1.0 - qre) - apre * qim;
        apre = nre; apim = nim;
    }
    /* E97 = C - A97 * F, A97 = final A product */
    double Ere = Cre - (apre * Fre - apim * Fim);
    double Eim = Cim - (apre * Fim + apim * Fre);
    o->absE97 = hypot(Ere, Eim);
    o->telErr = hypot(telre - Ere, telim - Eim);
}

/* ────────────────────────── masses mode ────────────────────────────── */
static void print_masses(const eside_t *es, FILE *f) {
    fprintf(f, "  {\"M\": %lu, \"sigmaB\": %.15f, \"gamma\": %.15e,\n",
            es->M, es->fc.ch.sigmaB, es->fc.ch.gamma);
    double sumU1 = 0, sumEnv = 0, lip2 = 0, lipL1 = 0, lipAlias = 0;
    fprintf(f, "   \"perJ\": [\n");
    for (int j = 1; j <= 25; j++) {
        int p = PRIMES97[25 - j];
        double u1 = es->supA[j - 1] * es->envMass[j - 1];
        sumU1 += u1;
        sumEnv += es->envMass[j - 1];
        /* Level-2 modulus-Lipschitz ledger (per x unit):
           |o|: amp*mTailNuC (derotated) ; |mm|: mMmNu ; |rr|: amp*mRefGnuAbsP + mRefHnu */
        double lj = es->supA[j - 1] * (es->amp[j - 1] * es->mTailNuC[j - 1]
                    + es->mMmNu[j - 1]
                    + es->amp[j - 1] * es->mRefGnuAbsP[j - 1] + es->mRefHnu[j - 1])
                    + es->lipA[j - 1] * es->envMass[j - 1];
        lip2 += lj;
        lipL1 += es->lipA[j - 1] * es->envMass[j - 1];
        /* rigorous alias-decomposed ledger for the PILOT metric itself
           (raw complex differences, no derotation): per j,
           supA*(amp*mTailNu + mMmNu + amp*mRefGnuAbsP + mRefHnu)
           + lipA*envMass */
        lipAlias += es->supA[j - 1] * (es->amp[j - 1] * es->mTailNu[j - 1]
                    + es->mMmNu[j - 1]
                    + es->amp[j - 1] * es->mRefGnuAbsP[j - 1] + es->mRefHnu[j - 1])
                    + es->lipA[j - 1] * es->envMass[j - 1];
        fprintf(f, "    {\"j\": %d, \"p\": %d, \"amp\": %.6e, \"supA\": %.6f, \"lipA\": %.6e,\n"
                "     \"mTail\": %.6e, \"mTailNuC\": %.6e, \"mMm\": %.6e, \"mMmNu\": %.6e,\n"
                "     \"mRefG\": %.6e, \"mRefGnuAbsP\": %.6e, \"mRefH\": %.6e, \"mRefHnu\": %.6e,\n"
                "     \"envMass\": %.6e, \"U1\": %.6e, \"lip2ledger\": %.6e}%s\n",
                j, p, es->amp[j - 1], es->supA[j - 1], es->lipA[j - 1],
                es->mTail[j - 1], es->mTailNuC[j - 1], es->mMm[j - 1], es->mMmNu[j - 1],
                es->mRefG[j - 1], es->mRefGnuAbsP[j - 1], es->mRefH[j - 1], es->mRefHnu[j - 1],
                es->envMass[j - 1], u1, lj, j < 25 ? "," : "");
    }
    fprintf(f, "   ],\n");
    fprintf(f, "   \"sumU1static\": %.9f, \"sumEnvMass\": %.9f,\n", sumU1, sumEnv);
    fprintf(f, "   \"lip2LedgerTotalPerX\": %.6f, \"lipL1PerX\": %.6f, "
            "\"lipPilotAliasPerX\": %.6f}", lip2, lipL1, lipAlias);
}

/* ────────────────────────── scan mode ──────────────────────────────── */
typedef struct {
    double u0;      /* anchor start u */
    int side;
} sjob_t;

#define NLAG 3
static const int LAGS[NLAG] = { 1, 16, 256 };

typedef struct {
    /* global reductions (mutex) */
    double maxQ[2][25][NQ];              /* per side, j, channel: max value */
    double maxDQ[2][25][NQ][NLAG];       /* max |diff|/(lag*delta) */
    double maxPilot[2], maxSumU3[2], maxSumU2[2], maxSumU2h[2], maxE97[2];
    double maxDPilot[2][NLAG], maxDSumU3[2][NLAG], maxDSumU2h[2][NLAG];
    double maxTel;
    long containViol;
    long nPts[2];
    long excU3[2], excU2[2];      /* count sumU3 / sumU2 >= REX_EXACT */
    long excPilot[2];             /* count pilot >= REX_EXACT (expect 0) */
    double meanPilot[2], meanSumU3[2];
    long done, total;
    pthread_mutex_t mu;
} sred_t;

typedef struct {
    const eside_t *es;      /* [2] */
    sjob_t *jobs; int njobs; long next;
    long npts; double delta;
    sred_t *red;
    pthread_mutex_t mu;
} sctx_t;

static void *envscan_worker(void *arg) {
    sctx_t *c = (sctx_t *)arg;
    epoint_t *hist = (epoint_t *)malloc(sizeof(epoint_t) * (size_t)c->npts);
    if (!hist) { fprintf(stderr, "alloc\n"); exit(2); }
    for (;;) {
        long ji;
        pthread_mutex_lock(&c->mu);
        ji = c->next++;
        pthread_mutex_unlock(&c->mu);
        if (ji >= c->njobs) break;
        sjob_t *jb = &c->jobs[ji];
        const eside_t *es = &c->es[jb->side];
        for (long k = 0; k < c->npts; k++) {
            dd x = pilot_x_from_u(G3_N, jb->u0 + (double)k * c->delta);
            eval_probe(es, x, &hist[k]);
        }
        /* reduce */
        sred_t *r = c->red;
        pthread_mutex_lock(&r->mu);
        int s = jb->side;
        for (long k = 0; k < c->npts; k++) {
            epoint_t *e = &hist[k];
            if (e->pilot > r->maxPilot[s]) r->maxPilot[s] = e->pilot;
            if (e->sumU3 > r->maxSumU3[s]) r->maxSumU3[s] = e->sumU3;
            if (e->sumU2 > r->maxSumU2[s]) r->maxSumU2[s] = e->sumU2;
            if (e->sumU2h > r->maxSumU2h[s]) r->maxSumU2h[s] = e->sumU2h;
            if (e->absE97 > r->maxE97[s]) r->maxE97[s] = e->absE97;
            if (e->telErr > r->maxTel) r->maxTel = e->telErr;
            r->nPts[s]++;
            if (e->sumU3 >= REX_EXACT) r->excU3[s]++;
            if (e->sumU2 >= REX_EXACT) r->excU2[s]++;
            if (e->pilot >= REX_EXACT) r->excPilot[s]++;
            r->meanPilot[s] += e->pilot;
            r->meanSumU3[s] += e->sumU3;
            for (int j = 0; j < 25; j++) {
                for (int q = 0; q < NQ; q++)
                    if (e->q[j][q] > r->maxQ[s][j][q]) r->maxQ[s][j][q] = e->q[j][q];
                if (e->q[j][0] > e->q[j][8] + 1e-12) r->containViol++;
                if (e->q[j][0] > e->q[j][9] + 1e-9) r->containViol++;
                if (e->q[j][0] > e->q[j][10] + 1e-9) r->containViol++;
            }
            for (int L = 0; L < NLAG; L++) {
                long lag = LAGS[L];
                if (k < lag) continue;
                epoint_t *e0 = &hist[k - lag];
                double inv = 1.0 / ((double)lag * c->delta);
                double d;
                d = fabs(e->pilot - e0->pilot) * inv;
                if (d > r->maxDPilot[s][L]) r->maxDPilot[s][L] = d;
                d = fabs(e->sumU3 - e0->sumU3) * inv;
                if (d > r->maxDSumU3[s][L]) r->maxDSumU3[s][L] = d;
                d = fabs(e->sumU2h - e0->sumU2h) * inv;
                if (d > r->maxDSumU2h[s][L]) r->maxDSumU2h[s][L] = d;
                for (int j = 0; j < 25; j++)
                    for (int q = 0; q < NQ; q++) {
                        d = fabs(e->q[j][q] - e0->q[j][q]) * inv;
                        if (d > r->maxDQ[s][j][q][L]) r->maxDQ[s][j][q][L] = d;
                    }
            }
        }
        r->done++;
        fprintf(stderr, "  job %ld/%ld done (side %d, u0=%.1f)\n",
                r->done, r->total, s, jb->u0);
        pthread_mutex_unlock(&r->mu);
    }
    free(hist);
    return NULL;
}

static const char *QNAMES[NQ] = { "absD", "absA", "absO", "absMm", "absRr",
                                  "absRefG", "absRefH", "absTail", "U3", "U2",
                                  "U2h", "absDr" };

static void mode_scan(int nanch, long npts, double delta, int nth,
                      unsigned seed, const char *out) {
    struct timespec w0, w1;
    clock_gettime(CLOCK_MONOTONIC, &w0);
    fprintf(stderr, "building tables + sides...\n");
    build_tables(G3_N + 3);
    static eside_t es[2];
    eside_build(&es[0], G3_N);
    eside_build(&es[1], G3_N + 1);
    double twoN1 = (double)(2 * G3_N + 1);

    /* startup cross-validation of eval_probe against eval_fast telescope */
    {
        double ws[3] = { 0.1234, 0.524470030380, 0.860403333333 };
        double maxd = 0, maxtel = 0;
        for (int k = 0; k < 3; k++)
            for (int s = 0; s < 2; s++) {
                dd x = pilot_x_from_u(G3_N, ws[k] * twoN1);
                double Dref[50];
                pres_t a = eval_fast(&es[s].fc, x, Dref);
                epoint_t b;
                eval_probe(&es[s], x, &b);
                for (int j = 0; j < 25; j++) {
                    double dv = fabs(hypot(Dref[2 * j], Dref[2 * j + 1]) - b.q[j][0]);
                    if (dv > maxd) maxd = dv;
                }
                double dp = fabs(a.pilot - b.pilot);
                if (dp > maxd) maxd = dp;
                if (b.telErr > maxtel) maxtel = b.telErr;
            }
        fprintf(stderr, "cross-validation vs eval_fast: max|D_j| diff %.3e, "
                "max telescope err %.3e\n", maxd, maxtel);
        if (maxd > 1e-10) { fprintf(stderr, "MISMATCH — abort\n"); exit(4); }
    }

    /* anchors: pilot witnesses first, then seeded uniform */
    sjob_t *jobs = (sjob_t *)malloc(sizeof(sjob_t) * (size_t)nanch * 2);
    double span = (double)(npts - 1) * delta;
    double wits[4] = { 0.524470030380, 0.860403333333, 0.053273326334, 0.825530 };
    srand(seed);
    for (int a = 0; a < nanch; a++) {
        double u0;
        if (a < 4) u0 = wits[a] * twoN1 - 0.5 * span;
        else u0 = ((double)rand() / RAND_MAX) * (twoN1 - span);
        if (u0 < 0) u0 = 0;
        for (int s = 0; s < 2; s++) { jobs[a * 2 + s].u0 = u0; jobs[a * 2 + s].side = s; }
    }
    static sred_t red;
    memset(&red, 0, sizeof(red));
    pthread_mutex_init(&red.mu, NULL);
    red.total = nanch * 2;
    sctx_t ctx = { es, jobs, nanch * 2, 0, npts, delta, &red,
                   PTHREAD_MUTEX_INITIALIZER };
    pthread_t th[64];
    if (nth > 64) nth = 64;
    for (int i = 0; i < nth; i++) pthread_create(&th[i], NULL, envscan_worker, &ctx);
    for (int i = 0; i < nth; i++) pthread_join(th[i], NULL);
    clock_gettime(CLOCK_MONOTONIC, &w1);
    double wall = (w1.tv_sec - w0.tv_sec) + 1e-9 * (w1.tv_nsec - w0.tv_nsec);

    FILE *f = fopen(out, "w");
    if (!f) { fprintf(stderr, "cannot open %s\n", out); exit(2); }
    fprintf(f, "{\n  \"mode\": \"envprobe-scan\", \"N\": %lu,\n", (unsigned long)G3_N);
    fprintf(f, "  \"anchors\": %d, \"nptsPerAnchor\": %ld, \"deltaU\": %.6g, "
            "\"spanU\": %.4f, \"seed\": %u,\n", nanch, npts, delta, span, seed);
    fprintf(f, "  \"evaluations\": %ld, \"wallSeconds\": %.1f, \"threads\": %d,\n",
            (long)nanch * 2 * npts, wall, nth);
    fprintf(f, "  \"lagsU\": [%.6g, %.6g, %.6g],\n",
            LAGS[0] * delta, LAGS[1] * delta, LAGS[2] * delta);
    fprintf(f, "  \"containmentViolations\": %ld, \"maxTelescopeErr\": %.3e,\n",
            red.containViol, red.maxTel);
    fprintf(f, "  \"masses\": [\n");
    print_masses(&es[0], f); fprintf(f, ",\n");
    print_masses(&es[1], f); fprintf(f, "\n  ],\n");
    for (int s = 0; s < 2; s++) {
        fprintf(f, "  \"side%d\": {\n", s);
        fprintf(f, "    \"maxPilot\": %.16f, \"maxSumU3\": %.16f, \"maxSumU2\": %.16f, "
                "\"maxSumU2h\": %.16f, \"maxE97\": %.16f,\n",
                red.maxPilot[s], red.maxSumU3[s], red.maxSumU2[s],
                red.maxSumU2h[s], red.maxE97[s]);
        fprintf(f, "    \"points\": %ld, \"excSumU3geRex\": %ld, \"excSumU2geRex\": %ld, "
                "\"excPilotgeRex\": %ld,\n    \"meanPilot\": %.9f, \"meanSumU3\": %.9f,\n",
                red.nPts[s], red.excU3[s], red.excU2[s], red.excPilot[s],
                red.meanPilot[s] / (double)red.nPts[s],
                red.meanSumU3[s] / (double)red.nPts[s]);
        fprintf(f, "    \"maxDPilotPerU\": [%.6e, %.6e, %.6e],\n",
                red.maxDPilot[s][0], red.maxDPilot[s][1], red.maxDPilot[s][2]);
        fprintf(f, "    \"maxDSumU3PerU\": [%.6e, %.6e, %.6e],\n",
                red.maxDSumU3[s][0], red.maxDSumU3[s][1], red.maxDSumU3[s][2]);
        fprintf(f, "    \"maxDSumU2hPerU\": [%.6e, %.6e, %.6e],\n",
                red.maxDSumU2h[s][0], red.maxDSumU2h[s][1], red.maxDSumU2h[s][2]);
        fprintf(f, "    \"perJ\": [\n");
        for (int j = 0; j < 25; j++) {
            fprintf(f, "      {\"j\": %d, \"p\": %d", j + 1, PRIMES97[24 - j]);
            for (int q = 0; q < NQ; q++)
                fprintf(f, ", \"%s\": %.6e, \"d_%s\": [%.4e,%.4e,%.4e]",
                        QNAMES[q], red.maxQ[s][j][q], QNAMES[q],
                        red.maxDQ[s][j][q][0], red.maxDQ[s][j][q][1],
                        red.maxDQ[s][j][q][2]);
            fprintf(f, "}%s\n", j < 24 ? "," : "");
        }
        fprintf(f, "    ]\n  }%s\n", s == 0 ? "," : "");
    }
    fprintf(f, "}\n");
    fclose(f);
    printf("ENVPROBE-SCAN done: %ld evals, wall %.1fs, containViol=%ld, "
           "maxPilot=%.6f/%.6f maxSumU3=%.6f/%.6f maxSumU2h=%.6f/%.6f out=%s\n",
           (long)nanch * 2 * npts, wall, red.containViol,
           red.maxPilot[0], red.maxPilot[1], red.maxSumU3[0], red.maxSumU3[1],
           red.maxSumU2h[0], red.maxSumU2h[1], out);
}

/* ────────────────────────── ascan mode ─────────────────────────────── */
/* Level-1 bound S(u) = sum_j |A_<j(u)| * envMass_j: needs only 25 prime
   phases per point — scans the FULL window cheaply. */
typedef struct {
    const eside_t *es; long npts; double twoN1;
    double sup[2], supU[2], min[2], maxD[2];
    long next;
    pthread_mutex_t mu;
} actx_t;

static void *aenvscan_worker(void *arg) {
    actx_t *c = (actx_t *)arg;
    const long CH = 4096;
    for (;;) {
        long i0;
        pthread_mutex_lock(&c->mu);
        i0 = c->next; c->next += CH;
        pthread_mutex_unlock(&c->mu);
        if (i0 >= c->npts) break;
        long i1 = i0 + CH < c->npts ? i0 + CH : c->npts;
        double lsup[2] = { 0, 0 }, lsupU[2] = { 0, 0 };
        double lmin[2] = { 1e300, 1e300 }, lmaxD[2] = { 0, 0 };
        double prev[2] = { -1, -1 };
        double du = c->twoN1 / (double)(c->npts - 1);
        for (long i = i0 > 0 ? i0 - 1 : 0; i < i1; i++) {
            double u = (double)i * du;
            dd x = pilot_x_from_u(G3_N, u);
            dd Y = dd_mul(x, INV4PI);
            for (int s = 0; s < 2; s++) {
                const eside_t *es = &c->es[s];
                double apre = 1.0, apim = 0.0, S = 0.0;
                for (int j = 1; j <= 25; j++) {
                    int p = PRIMES97[25 - j];
                    double fr = phase_frac(Y.hi, Y.lo, g_lnn[p].hi, g_lnn[p].lo);
                    double thp = 6.283185307179586232 * fr;
                    double sn, cs;
                    __sincos(thp, &sn, &cs);
                    double amp = es->amp[j - 1];
                    double qre = amp * cs, qim = -amp * sn;
                    S += hypot(apre, apim) * es->envMass[j - 1];
                    double nre = apre * (1.0 - qre) + apim * qim;
                    double nim = apim * (1.0 - qre) - apre * qim;
                    apre = nre; apim = nim;
                }
                if (i >= i0) {
                    if (S > lsup[s]) { lsup[s] = S; lsupU[s] = u; }
                    if (S < lmin[s]) lmin[s] = S;
                    if (prev[s] >= 0) {
                        double d = fabs(S - prev[s]) / du;
                        if (d > lmaxD[s]) lmaxD[s] = d;
                    }
                }
                prev[s] = S;
            }
        }
        pthread_mutex_lock(&c->mu);
        for (int s = 0; s < 2; s++) {
            if (lsup[s] > c->sup[s]) { c->sup[s] = lsup[s]; c->supU[s] = lsupU[s]; }
            if (lmin[s] < c->min[s]) c->min[s] = lmin[s];
            if (lmaxD[s] > c->maxD[s]) c->maxD[s] = lmaxD[s];
        }
        pthread_mutex_unlock(&c->mu);
    }
    return NULL;
}

static void mode_ascan(long npts, int nth) {
    build_tables(G3_N + 3);
    static eside_t es[2];
    eside_build(&es[0], G3_N);
    eside_build(&es[1], G3_N + 1);
    actx_t c;
    c.es = es; c.npts = npts; c.twoN1 = (double)(2 * G3_N + 1);
    c.sup[0] = c.sup[1] = 0; c.min[0] = c.min[1] = 1e300;
    c.maxD[0] = c.maxD[1] = 0; c.supU[0] = c.supU[1] = 0;
    c.next = 0;
    pthread_mutex_init(&c.mu, NULL);
    pthread_t th[64];
    if (nth > 64) nth = 64;
    for (int i = 0; i < nth; i++) pthread_create(&th[i], NULL, aenvscan_worker, &c);
    for (int i = 0; i < nth; i++) pthread_join(th[i], NULL);
    printf("ASCAN L1 bound S(u)=sum_j |A_<j| envMass_j over full window (%ld pts):\n", npts);
    for (int s = 0; s < 2; s++)
        printf("  side%d: sup=%.9f at u=%.1f (w=%.6f), min=%.9f, max|dS/du|=%.6e   Rex=%.9f\n",
               s, c.sup[s], c.supU[s], c.supU[s] / c.twoN1, c.min[s], c.maxD[s],
               REX_EXACT);
}

/* ────────────────────────── main ───────────────────────────────────── */
int main(int argc, char **argv) {
    init_row();
    if (argc >= 2 && strcmp(argv[1], "masses") == 0) {
        build_tables(G3_N + 3);
        static eside_t es[2];
        eside_build(&es[0], G3_N);
        eside_build(&es[1], G3_N + 1);
        printf("[\n");
        print_masses(&es[0], stdout); printf(",\n");
        print_masses(&es[1], stdout); printf("\n]\n");
        return 0;
    }
    if (argc >= 7 && strcmp(argv[1], "scan") == 0) {
        mode_scan(atoi(argv[2]), atol(argv[3]), atof(argv[4]), atoi(argv[5]),
                  (unsigned)atoi(argv[6]), argc >= 8 ? argv[7] : "envprobe-scan.json");
        return 0;
    }
    if (argc >= 3 && strcmp(argv[1], "ascan") == 0) {
        mode_ascan(atol(argv[2]), argc >= 4 ? atoi(argv[3]) : 6);
        return 0;
    }
    fprintf(stderr, "usage: %s masses | scan NANCH NPTS DELTA NTH SEED OUT.json | "
            "ascan NPTS [NTH]\n", argv[0]);
    return 2;
}
