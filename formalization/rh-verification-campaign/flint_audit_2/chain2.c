/*
 * chain2.c -- second independent audit driver for the 7.8e12 window.
 * Different chunking from pilot/chain.c: each chunk returns at most MAXZ zeros
 * (shorter chunks, different grid centres), configurable back margin, and EVERY
 * isolating interval is dumped exactly as (index, mantissa_a, exp_a, mantissa_b, exp_b)
 * with a = ma*2^ea, b = mb*2^eb (exact binary values of FLINT's arf endpoints).
 * Usage: chain2 t_start t_end n_start threads prec MAXZ BACK out_prefix
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>
#include <sys/resource.h>
#include <flint/flint.h>
#include <flint/fmpz.h>
#include <flint/arb.h>
#include <flint/arf.h>
#include <flint/arb_calc.h>
#include <flint/acb_dirichlet.h>

static double cpu_now(void){ struct rusage ru; getrusage(RUSAGE_SELF,&ru);
  return ru.ru_utime.tv_sec+1e-6*ru.ru_utime.tv_usec+ru.ru_stime.tv_sec+1e-6*ru.ru_stime.tv_usec; }

typedef struct { slong A, B, K, Ns_max, sg, si; double h, H; fmpz_t J; } params_t;
/* identical to FLINT 3.6.0 _create_heuristic_context, block n in [1e7, 2e17) */
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

static void dump_arf(FILE *f, const arf_t x)
{
    fmpz_t m, e; fmpz_init(m); fmpz_init(e);
    arf_get_fmpz_2exp(m, e, x);
    fmpz_fprint(f, m); fprintf(f, " "); fmpz_fprint(f, e);
    fmpz_clear(m); fmpz_clear(e);
}

int main(int argc, char **argv)
{
    if (argc < 9) { fprintf(stderr, "usage: %s t_start t_end n_start threads prec MAXZ BACK out_prefix\n", argv[0]); return 1; }
    fmpz_t tstart, tend, n, T, lastz, lb, tmp;
    fmpz_init(tstart); fmpz_init(tend); fmpz_init(n); fmpz_init(T); fmpz_init(lastz); fmpz_init(lb); fmpz_init(tmp);
    fmpz_set_str(tstart, argv[1], 10); fmpz_set_str(tend, argv[2], 10); fmpz_set_str(n, argv[3], 10);
    int threads = atoi(argv[4]); slong prec = atol(argv[5]); slong MAXZ = atol(argv[6]); slong BACK = atol(argv[7]);
    char fn[512];
    snprintf(fn, sizeof fn, "%s.log.jsonl", argv[8]); FILE *lg = fopen(fn, "w");
    snprintf(fn, sizeof fn, "%s.iv.txt", argv[8]); FILE *iv = fopen(fn, "w");
    flint_set_num_threads(threads);
    params_t P; fmpz_init(P.J);
    arb_t h, H; arb_init(h); arb_init(H);
    arf_interval_ptr res = _arf_interval_vec_init(MAXZ);
    static const slong RETRY[4] = {0, 200, 400, 600};
    slong chunk = 0, attempt = 0, status = 0;
    fmpz_add_si(T, tstart, BACK);
    fmpz_set(lastz, tstart);
    while (1)
    {
        params_for(&P, T);
        arb_set_d(h, P.h); arb_set_d(H, P.H);
        double c0 = cpu_now();
        slong found = a2__acb_dirichlet_platt_isolate_local_hardy_z_zeros(res, n, MAXZ, T,
                          P.A, P.B, h, P.J, P.K, P.sg, P.Ns_max, H, P.si, prec);
        double c1 = cpu_now();
        char *Ts = fmpz_get_str(NULL, 10, T), *ns = fmpz_get_str(NULL, 10, n), *Js = fmpz_get_str(NULL, 10, P.J);
        if (found <= 0)
        {
            fprintf(lg, "{\"chunk\":%ld,\"T\":\"%s\",\"n_first\":\"%s\",\"found\":0,\"status\":\"FAIL\",\"attempt\":%ld,\"cpu_s\":%.2f}\n",
                    chunk, Ts, ns, attempt, c1 - c0);
            fflush(lg); flint_free(Ts); flint_free(ns); flint_free(Js);
            attempt++;
            if (attempt >= 4) { status = 2; break; }
            fmpz_add_si(T, lastz, BACK - RETRY[attempt]);
            continue;
        }
        int ordered = 1;
        for (slong i = 0; i < found; i++)
        {
            if (arf_cmp(&res[i].a, &res[i].b) >= 0) ordered = 0;
            if (i > 0 && arf_cmp(&res[i-1].b, &res[i].a) > 0) ordered = 0;
            fmpz_add_si(tmp, n, i);
            fmpz_fprint(iv, tmp); fprintf(iv, " %ld ", chunk);
            dump_arf(iv, &res[i].a); fprintf(iv, " "); dump_arf(iv, &res[i].b); fprintf(iv, "\n");
        }
        fflush(iv);
        fmpz_add_si(tmp, n, found - 1);
        char *ms = fmpz_get_str(NULL, 10, tmp);
        char *sa = arf_get_str(&res[0].a, 22), *sb = arf_get_str(&res[found-1].b, 22);
        fprintf(lg, "{\"chunk\":%ld,\"T\":\"%s\",\"n_first\":\"%s\",\"n_last\":\"%s\",\"found\":%ld,\"t_first_lo\":\"%s\",\"t_last_hi\":\"%s\","
                    "\"ordered_disjoint\":%s,\"prec\":%ld,\"threads\":%d,\"A\":%ld,\"B\":%ld,\"K\":%ld,\"J\":\"%s\",\"sigma_grid\":%ld,\"sigma_interp\":%ld,"
                    "\"h\":%.10g,\"H\":%.10g,\"cpu_s\":%.2f,\"attempt\":%ld,\"status\":\"OK\"}\n",
                chunk, Ts, ns, ms, found, sa, sb, ordered ? "true" : "false", prec, threads, P.A, P.B, P.K, Js, P.sg, P.si,
                P.h, P.H, c1 - c0, attempt);
        fflush(lg);
        arf_get_fmpz(lb, &res[found-1].b, ARF_RND_FLOOR);
        int done = fmpz_cmp(lb, tend) >= 0;
        fmpz_set(lastz, lb);
        fmpz_add_si(T, lb, BACK);
        fmpz_add_ui(n, tmp, 1);
        attempt = 0;
        flint_free(Ts); flint_free(ns); flint_free(Js); flint_free(ms); flint_free(sa); flint_free(sb);
        chunk++;
        if (!ordered) { status = 3; break; }
        if (done) break;
    }
    fprintf(stderr, "chunks=%ld status=%ld cpu=%.1f\n", chunk, status, cpu_now());
    fclose(lg); fclose(iv);
    _arf_interval_vec_clear(res, MAXZ);
    arb_clear(h); arb_clear(H); fmpz_clear(P.J);
    fmpz_clear(tstart); fmpz_clear(tend); fmpz_clear(n); fmpz_clear(T); fmpz_clear(lastz); fmpz_clear(lb); fmpz_clear(tmp);
    flint_cleanup_master();
    return (int) status;
}
