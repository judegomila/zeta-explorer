/*
 * b145-D chain worker: prototype campaign worker.
 *
 * Verifies consecutive Platt grids (FLINT 3.6.0 interval implementation,
 * Turing-method anchors) from height t_start upward until the last certified
 * zero exceeds t_end, gluing chunks by exact zero index:
 *   chunk c returns certified zeros with indices n_c .. m_c,
 *   chunk c+1 is requested to start at index m_c + 1.
 * Index continuity is the gluing condition: N is exact at every anchor, so
 * no zero of zeta lies strictly between certified zeros m_c and m_c + 1
 * (see PLAN.md, section "Gluing").
 *
 * Usage: ./chain <t_start> <t_end> <n_start|auto> <threads> <prec> <log.jsonl> [zeros.bin]
 *   n_start = auto -> smooth N0(t_start) (the library certifies the actual
 *   index; the first returned zero's index is exact).
 *   On restart, pass the last logged (t_last_hi, n_last + 1).
 *
 * Log: one JSON line per chunk (checkpoint), flushed + fsync'd.
 * zeros.bin (optional): per zero, the isolating interval [a, b] as two
 * float64 offsets from the chunk centre T (16 bytes/zero); for audit only,
 * NOT needed for the verification claim.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>
#include <unistd.h>
#include <sys/resource.h>
#include <flint/flint.h>
#include <flint/fmpz.h>
#include <flint/arb.h>
#include <flint/arf.h>
#include <flint/arb_calc.h>
#include <flint/acb_dirichlet.h>

static double now(void)
{
    struct timespec ts;
    clock_gettime(CLOCK_MONOTONIC, &ts);
    return ts.tv_sec + 1e-9 * ts.tv_nsec;
}
static double cpu_now(void)
{
    struct rusage ru;
    getrusage(RUSAGE_SELF, &ru);
    return ru.ru_utime.tv_sec + 1e-6 * ru.ru_utime.tv_usec + ru.ru_stime.tv_sec + 1e-6 * ru.ru_stime.tv_usec;
}
static double maxrss_mb(void)
{
    struct rusage ru;
    getrusage(RUSAGE_SELF, &ru);
#ifdef __APPLE__
    return ru.ru_maxrss / 1048576.0;
#else
    return ru.ru_maxrss / 1024.0;
#endif
}

static void smooth_n_fmpz(fmpz_t n, const fmpz_t tz, slong prec)
{
    arb_t t, x, pi, tmp, r;
    arb_init(t); arb_init(x); arb_init(pi); arb_init(tmp); arb_init(r);
    arb_set_fmpz(t, tz);
    arb_const_pi(pi, prec);
    arb_mul_2exp_si(x, pi, 1);
    arb_div(x, t, x, prec);
    arb_log(x, x, prec);
    arb_mul(x, x, t, prec);
    arb_mul_2exp_si(x, x, -1);
    arb_mul_2exp_si(tmp, t, -1);
    arb_sub(x, x, tmp, prec);
    arb_mul_2exp_si(tmp, pi, -3);
    arb_sub(x, x, tmp, prec);
    arb_div(r, x, pi, prec);
    arb_add_ui(r, r, 1, prec);
    arf_get_fmpz(n, arb_midref(r), ARF_RND_FLOOR);
    arb_clear(t); arb_clear(x); arb_clear(pi); arb_clear(tmp); arb_clear(r);
}

/* FLINT 3.6.0 heuristic Platt parameters for n in [1e7, 2e17) */
typedef struct { slong A, B, K, Ns_max, sg, si; double h, H; fmpz_t J; } params_t;
static void params_for(params_t *P, const fmpz_t T)
{
    double x = log(fmpz_get_d(T)), x2 = x*x, x3 = x2*x, x4 = x2*x2;
    P->A = 8; P->B = 4096; P->Ns_max = 200;
    double dlogJ = -0.4035 + 0.49086*x + 0.00016299*x2 + -3.6139e-06*x3 + 2.9323e-08*x4;
    double dK = 79.032 + -1.781*x + 0.039243*x2 + -0.00094859*x3 + 7.3149e-06*x4;
    double dgrid = 1186.9 + 130.17*x + -7.4059*x2 + 0.17895*x3 + -0.001602*x4;
    double dinterp = -24.252 + 7.3231*x + -0.38971*x2 + 0.0088745*x3 + -7.4331e-05*x4;
    P->h = 178.66 + -15.127*x + 0.93132*x2 + -0.02311*x3 + 0.00022146*x4;
    P->H = 2.5499 + -0.24402*x + 0.014953*x2 + -0.00037347*x3 + 3.5596e-06*x4;
    fmpz_set_si(P->J, (slong) exp(dlogJ));
    P->K = (slong) dK;
    P->sg = ((slong) (dgrid / 2)) * 2 + 1;
    P->si = ((slong) (dinterp / 2)) * 2 + 1;
}

#define BACK_MARGIN 780   /* default: grid centre this far above the next requested zero */
/* retry ladder after a FAIL (0 zeros) or a short chunk: (margin, prec) */
static const slong RETRY_MARGIN[4] = {780, 400, 100, 400};
static const slong RETRY_PREC_ADD[4] = {0, 0, 0, 64};
#define SHORT_SPAN 800     /* a chunk advancing less than this triggers margin 400 next */
#define LEN_MAX 16000

int main(int argc, char **argv)
{
    if (argc < 7)
    {
        fprintf(stderr, "usage: %s t_start t_end n_start|auto threads prec log.jsonl [zeros.bin]\n", argv[0]);
        return 1;
    }
    fmpz_t tstart, tend, n, T, tmp;
    fmpz_init(tstart); fmpz_init(tend); fmpz_init(n); fmpz_init(T); fmpz_init(tmp);
    fmpz_set_str(tstart, argv[1], 10);
    fmpz_set_str(tend, argv[2], 10);
    if (strcmp(argv[3], "auto") == 0) smooth_n_fmpz(n, tstart, 256);
    else fmpz_set_str(n, argv[3], 10);
    int threads = atoi(argv[4]);
    slong prec = atol(argv[5]);
    FILE *log = fopen(argv[6], "a");
    FILE *zb = (argc > 7) ? fopen(argv[7], "ab") : NULL;
    flint_set_num_threads(threads);

    params_t P;
    fmpz_init(P.J);
    arb_t h, H;
    arb_init(h); arb_init(H);
    arf_interval_ptr iv = _arf_interval_vec_init(LEN_MAX);

    fmpz_add_si(T, tstart, BACK_MARGIN);
    slong chunk = 0, total_zeros = 0;
    double W0 = now(), C0 = cpu_now();
    int status = 0;

    slong attempt = 0, retries_total = 0, short_total = 0;
    fmpz_t lastz; fmpz_init(lastz); fmpz_set(lastz, tstart); /* floor of last certified zero (or start) */
    while (1)
    {
        slong wprec = prec + RETRY_PREC_ADD[attempt];
        params_for(&P, T);
        arb_set_d(h, P.h);
        arb_set_d(H, P.H);
        double w0 = now(), c0 = cpu_now();
        slong found = _acb_dirichlet_platt_isolate_local_hardy_z_zeros(
            iv, n, LEN_MAX, T, P.A, P.B, h, P.J, P.K, P.sg, P.Ns_max, H, P.si, wprec);
        double w1 = now(), c1 = cpu_now();
        char *Ts = fmpz_get_str(NULL, 10, T), *ns = fmpz_get_str(NULL, 10, n);
        if (found <= 0)
        {
            fprintf(log, "{\"chunk\":%ld,\"T\":\"%s\",\"n_first\":\"%s\",\"found\":0,\"status\":\"FAIL\",\"attempt\":%ld,\"prec\":%ld,\"wall_s\":%.3f,\"cpu_s\":%.3f}\n",
                    chunk, Ts, ns, attempt, wprec, w1 - w0, c1 - c0);
            fflush(log); fsync(fileno(log));
            flint_free(Ts); flint_free(ns);
            attempt++; retries_total++;
            if (attempt >= 4) { status = 2; break; }   /* escalate: needs manual / high-prec handling */
            fmpz_add_si(T, lastz, RETRY_MARGIN[attempt]);
            continue;
        }
        int ordered = 1;
        for (slong i = 0; i < found; i++)
        {
            if (arf_cmp(&iv[i].a, &iv[i].b) >= 0) ordered = 0;
            if (i > 0 && arf_cmp(&iv[i - 1].b, &iv[i].a) > 0) ordered = 0;
        }
        if (zb)
        {
            double Td = fmpz_get_d(T);
            for (slong i = 0; i < found; i++)
            {
                double ab[2];
                arf_t d;
                arf_init(d);
                arf_sub_fmpz(d, &iv[i].a, T, 128, ARF_RND_DOWN); ab[0] = arf_get_d(d, ARF_RND_DOWN);
                arf_sub_fmpz(d, &iv[i].b, T, 128, ARF_RND_UP);   ab[1] = arf_get_d(d, ARF_RND_UP);
                arf_clear(d);
                fwrite(ab, sizeof(double), 2, zb);
            }
            (void) Td;
            fflush(zb);
        }
        fmpz_add_si(tmp, n, found - 1); /* last index */
        char *ms = fmpz_get_str(NULL, 10, tmp);
        char *sa = arf_get_str(&iv[0].a, 20), *sb = arf_get_str(&iv[found - 1].b, 20);
        fprintf(log, "{\"chunk\":%ld,\"T\":\"%s\",\"n_first\":\"%s\",\"n_last\":\"%s\",\"found\":%ld,"
                     "\"t_first_lo\":\"%s\",\"t_last_hi\":\"%s\",\"ordered_disjoint\":%s,\"prec\":%ld,"
                     "\"wall_s\":%.3f,\"cpu_s\":%.3f,\"maxrss_MB\":%.1f,\"attempt\":%ld,\"status\":\"OK\"}\n",
                chunk, Ts, ns, ms, found, sa, sb, ordered ? "true" : "false", wprec,
                w1 - w0, c1 - c0, maxrss_mb(), attempt);
        fflush(log); fsync(fileno(log));
        total_zeros += found;

        /* next chunk: start index = last + 1; grid centre BACK_MARGIN above the last zero */
        arf_t lastb;
        arf_init(lastb);
        arf_set(lastb, &iv[found - 1].b);
        fmpz_t lb;
        fmpz_init(lb);
        arf_get_fmpz(lb, lastb, ARF_RND_FLOOR);
        int done = (fmpz_cmp(lb, tend) >= 0);
        fmpz_t adv; fmpz_init(adv); fmpz_sub(adv, lb, lastz);
        int is_short = (fmpz_cmp_si(adv, SHORT_SPAN) < 0);
        fmpz_clear(adv);
        if (is_short) short_total++;
        fmpz_set(lastz, lb);
        attempt = 0;
        fmpz_add_si(T, lb, is_short ? RETRY_MARGIN[1] : BACK_MARGIN);
        fmpz_add_ui(n, tmp, 1);
        fmpz_clear(lb);
        arf_clear(lastb);
        flint_free(Ts); flint_free(ns); flint_free(ms); flint_free(sa); flint_free(sb);
        chunk++;
        if (!ordered) { status = 3; break; }
        if (done) break;
    }
    fprintf(stderr, "chunks=%ld zeros=%ld wall=%.1f cpu=%.1f retries=%ld short=%ld status=%d\n",
            chunk, total_zeros, now() - W0, cpu_now() - C0, retries_total, short_total, status);
    fmpz_clear(lastz);
    _arf_interval_vec_clear(iv, LEN_MAX);
    arb_clear(h); arb_clear(H);
    fmpz_clear(P.J);
    fmpz_clear(tstart); fmpz_clear(tend); fmpz_clear(n); fmpz_clear(T); fmpz_clear(tmp);
    fclose(log);
    if (zb) fclose(zb);
    flint_cleanup_master();
    return status;
}
