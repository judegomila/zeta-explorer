/* Certified finite Weil matrix producer using FLINT/Arb.
   Binding formulas: CCM-ZST-v1 (4.2)--(4.4), Q = pole - arch - prime.
   This program never reads binary64 source parameters or zero tables. */
#include <flint/flint.h>
#include <flint/arb.h>
#include <flint/arb_mat.h>
#include <flint/acb.h>
#include <flint/acb_calc.h>
#include <flint/acb_hypgeom.h>
#include <flint/fmpq.h>
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { slong n,m,prec; arb_t L,pi; } arch_param;

static int parse_decimal(fmpq_t q, const char *s) {
    size_t len=strlen(s), frac=0, dots=0, j=0; char *digits=flint_malloc(len+2);
    if (!len) { flint_free(digits); return 0; }
    for (size_t i=0;i<len;i++) {
        if (s[i]=='.') { if (++dots>1) { flint_free(digits); return 0; } frac=len-i-1; }
        else if (isdigit((unsigned char)s[i]) || (i==0 && (s[i]=='+' || s[i]=='-'))) digits[j++]=s[i];
        else { flint_free(digits); return 0; }
    }
    digits[j]='\0'; fmpz_t num,den,ten; fmpz_init(num);fmpz_init(den);fmpz_init_set_ui(ten,10);
    if (fmpz_set_str(num,digits,10)!=0) { fmpz_clear(num);fmpz_clear(den);fmpz_clear(ten);flint_free(digits);return 0; }
    fmpz_pow_ui(den,ten,frac); fmpq_set_fmpz_frac(q,num,den); fmpq_canonicalise(q);
    fmpz_clear(num);fmpz_clear(den);fmpz_clear(ten);flint_free(digits);return 1;
}

static int is_prime(ulong n) {
    if (n<2) return 0;
    if (n%2==0) return n==2;
    for (ulong d=3;d<=n/d;d+=2) if (n%d==0) return 0;
    return 1;
}
static void acb_set_arb_real(acb_t z, const arb_t x) { arb_set(acb_realref(z),x); arb_zero(acb_imagref(z)); }

/* Entire regularization of (exp(x/2) omega_nm(x)-omega_nm(0))/(2 sinh x). */
static int arch_integrand(acb_ptr out,const acb_t x,void *vp,slong order,slong prec) {
    arch_param *p=(arch_param*)vp; if (order>1) return 1;
    acb_t L,pi,an,am,axn,axm,ix,den,ehalf,tmp,tmp2,num,one,two;
    acb_init(L);acb_init(pi);acb_init(an);acb_init(am);acb_init(axn);acb_init(axm);acb_init(ix);
    acb_init(den);acb_init(ehalf);acb_init(tmp);acb_init(tmp2);acb_init(num);acb_init(one);acb_init(two);
    acb_set_arb_real(L,p->L);acb_set_arb_real(pi,p->pi);acb_one(one);acb_set_ui(two,2);
    acb_mul_2exp_si(tmp,x,-1); acb_exp(ehalf,tmp,prec);
    acb_mul_onei(ix,x); acb_sinc(den,ix,prec); /* sinh(x)/x */
    acb_mul(an,pi,two,prec); acb_mul_si(an,an,p->n,prec); acb_div(an,an,L,prec);
    acb_mul(am,pi,two,prec); acb_mul_si(am,am,p->m,prec); acb_div(am,am,L,prec);
    acb_mul(axn,an,x,prec); acb_mul(axm,am,x,prec);
    if (p->n!=p->m) {
        acb_sinc(tmp,axm,prec); acb_mul(tmp,tmp,am,prec);
        acb_sinc(tmp2,axn,prec); acb_mul(tmp2,tmp2,an,prec); acb_sub(num,tmp,tmp2,prec);
        acb_mul(num,num,ehalf,prec); acb_div(num,num,den,prec);
        acb_mul(tmp,pi,two,prec); acb_mul_si(tmp,tmp,p->n-p->m,prec); acb_div(out,num,tmp,prec);
    } else {
        /* ((g(x)-1)/x)/(sinh(x)/x), g=e^(x/2)(1-x/L)cos(an*x). */
        acb_mul_2exp_si(tmp,x,-1);
        acb_hypgeom_1f1(num,one,two,tmp,0,prec); /* exprel(x/2) */
        acb_div(tmp,x,L,prec); acb_neg(tmp,tmp); acb_add_ui(tmp,tmp,1,prec);
        acb_cos(tmp2,axn,prec); acb_mul(num,num,tmp,prec); acb_mul(num,num,tmp2,prec); acb_mul_2exp_si(num,num,-1);
        /* -(an^2*x/2)*sinc(an*x/2)^2 */
        acb_mul(tmp,an,an,prec); acb_mul(tmp,tmp,x,prec); acb_mul_2exp_si(tmp,tmp,-1);
        acb_mul_2exp_si(axn,axn,-1); acb_sinc(axn,axn,prec); acb_mul(axn,axn,axn,prec); acb_mul(tmp,tmp,axn,prec); acb_sub(num,num,tmp,prec);
        acb_cos(tmp2,axm,prec); acb_div(tmp2,tmp2,L,prec); acb_sub(num,num,tmp2,prec);
        acb_div(out,num,den,prec);
    }
    acb_clear(L);acb_clear(pi);acb_clear(an);acb_clear(am);acb_clear(axn);acb_clear(axm);acb_clear(ix);
    acb_clear(den);acb_clear(ehalf);acb_clear(tmp);acb_clear(tmp2);acb_clear(num);acb_clear(one);acb_clear(two); return 0;
}

static void q_kernel(arb_t out,slong n,slong m,const arb_t x,const arb_t L,const arb_t pi,slong prec) {
    arb_t a,b,t;arb_init(a);arb_init(b);arb_init(t);
    if (n==m) {
        arb_div(a,x,L,prec);arb_neg(a,a);arb_add_ui(a,a,1,prec);
        arb_mul(b,pi,x,prec);arb_mul_si(b,b,2*n,prec);arb_div(b,b,L,prec);arb_cos(b,b,prec);
        arb_mul(out,a,b,prec);arb_mul_2exp_si(out,out,1);
    } else {
        arb_mul(a,pi,x,prec);arb_mul_si(a,a,2*m,prec);arb_div(a,a,L,prec);arb_sin(a,a,prec);
        arb_mul(b,pi,x,prec);arb_mul_si(b,b,2*n,prec);arb_div(b,b,L,prec);arb_sin(b,b,prec);arb_sub(a,a,b,prec);
        arb_mul_si(t,pi,n-m,prec);arb_div(out,a,t,prec);
    }
    arb_clear(a);arb_clear(b);arb_clear(t);
}

static void pole_closed(arb_t out,slong n,slong m,const arb_t L,const arb_t pi,slong prec) {
    arb_t L2,pi2,num,d1,d2,t,s;arb_init(L2);arb_init(pi2);arb_init(num);arb_init(d1);arb_init(d2);arb_init(t);arb_init(s);
    arb_mul(L2,L,L,prec);arb_mul(pi2,pi,pi,prec);arb_mul_2exp_si(pi2,pi2,4);
    arb_mul_si(t,pi2,m*n,prec);arb_sub(num,L2,t,prec);
    arb_mul_2exp_si(t,L,-2);arb_sinh(s,t,prec);arb_mul(s,s,s,prec);arb_mul(num,num,s,prec);arb_mul(num,num,L,prec);arb_mul_2exp_si(num,num,5);
    arb_mul_si(t,pi2,m*m,prec);arb_add(d1,L2,t,prec);arb_mul_si(t,pi2,n*n,prec);arb_add(d2,L2,t,prec);arb_mul(d1,d1,d2,prec);arb_div(out,num,d1,prec);
    arb_clear(L2);arb_clear(pi2);arb_clear(num);arb_clear(d1);arb_clear(d2);arb_clear(t);arb_clear(s);
}

static int arch_entry(arb_t out,slong n,slong m,const arb_t L,const arb_t pi,slong prec) {
    arch_param par;par.n=n;par.m=m;par.prec=prec;arb_init(par.L);arb_init(par.pi);arb_set(par.L,L);arb_set(par.pi,pi);
    acb_t a,b,res;acb_init(a);acb_init(b);acb_init(res);acb_zero(a);acb_set_arb_real(b,L);
    mag_t tol;mag_init(tol);mag_set_ui_2exp_si(tol,1,-prec+16);acb_calc_integrate_opt_t opt;acb_calc_integrate_opt_init(opt);opt->depth_limit=20;opt->eval_limit=100000;
    int status=acb_calc_integrate(res,arch_integrand,&par,a,b,prec/2,tol,opt,prec);
    arb_set(out,acb_realref(res));
    /* omega(0)/2 is 1 on the diagonal and 0 off diagonal. */
    if (n==m) {
        arb_t c,eL,t;arb_init(c);arb_init(eL);arb_init(t);arb_const_euler(c,prec);arb_exp(eL,L,prec);
        arb_sub_ui(t,eL,1,prec);arb_add_ui(eL,eL,1,prec);arb_div(t,t,eL,prec);arb_mul(t,t,pi,prec);arb_mul_ui(t,t,4,prec);arb_log(t,t,prec);arb_add(c,c,t,prec);arb_add(out,out,c,prec);
        arb_clear(c);arb_clear(eL);arb_clear(t);
    }
    if (!arb_is_zero(acb_imagref(res))) status=1;
    mag_clear(tol);acb_clear(a);acb_clear(b);acb_clear(res);arb_clear(par.L);arb_clear(par.pi);return status;
}

static void prime_entry(arb_t out,slong n,slong m,ulong bound,const arb_t L,const arb_t pi,slong prec) {
    arb_zero(out);arb_t x,q,lp,t;arb_init(x);arb_init(q);arb_init(lp);arb_init(t);
    for (ulong p=2;p<=bound;p++) if (is_prime(p)) {
        arb_log_ui(lp,p,prec);
        for (ulong k=p;k<=bound;) {
            arb_log_ui(x,k,prec);q_kernel(q,n,m,x,L,pi,prec);arb_mul(q,q,lp,prec);arb_sqrt_ui(t,k,prec);arb_div(q,q,t,prec);arb_add(out,out,q,prec);
            if (k>bound/p) break; k*=p;
        }
    }
    arb_clear(x);arb_clear(q);arb_clear(lp);arb_clear(t);
}

int main(int argc,char **argv) {
    const char *lambda_s=NULL,*output=NULL;slong N=-1,prec=256;
    for (int i=1;i<argc;i++) { if (!strcmp(argv[i],"--lambda")&&i+1<argc)lambda_s=argv[++i];else if(!strcmp(argv[i],"--N")&&i+1<argc)N=atol(argv[++i]);else if(!strcmp(argv[i],"--prec")&&i+1<argc)prec=atol(argv[++i]);else if(!strcmp(argv[i],"--output")&&i+1<argc)output=argv[++i];else return 2; }
    if (!lambda_s||N<0||prec<64) return 2;
    if(output&&!freopen(output,"w",stdout))return 2;
    fmpq_t lq,lq2;fmpq_init(lq);fmpq_init(lq2);
    if(!parse_decimal(lq,lambda_s)||fmpq_cmp_ui(lq,1)<=0)return 2;
    fmpq_mul(lq2,lq,lq);fmpz_t bnd;fmpz_init(bnd);fmpz_fdiv_q(bnd,fmpq_numref(lq2),fmpq_denref(lq2));
    if(!fmpz_abs_fits_ui(bnd)||fmpz_sgn(bnd)<0)return 2;
    ulong bound=fmpz_get_ui(bnd);
    arb_t lam,L,pi;arb_init(lam);arb_init(L);arb_init(pi);arb_set_fmpq(lam,lq,prec);arb_log(L,lam,prec);arb_mul_2exp_si(L,L,1);arb_const_pi(pi,prec);
    slong d=2*N+1;arb_mat_t P,A,R,Q;arb_mat_init(P,d,d);arb_mat_init(A,d,d);arb_mat_init(R,d,d);arb_mat_init(Q,d,d);
    int failed=0;for(slong i=0;i<d;i++)for(slong j=0;j<d;j++){slong n=i-N,m=j-N;pole_closed(arb_mat_entry(P,i,j),n,m,L,pi,prec);failed|=arch_entry(arb_mat_entry(A,i,j),n,m,L,pi,prec);prime_entry(arb_mat_entry(R,i,j),n,m,bound,L,pi,prec);arb_sub(arb_mat_entry(Q,i,j),arb_mat_entry(P,i,j),arb_mat_entry(A,i,j),prec);arb_sub(arb_mat_entry(Q,i,j),arb_mat_entry(Q,i,j),arb_mat_entry(R,i,j),prec);if(!arb_is_finite(arb_mat_entry(Q,i,j))||arb_rel_accuracy_bits(arb_mat_entry(Q,i,j))<prec/2)failed=1;}
    printf("META lambda=%s N=%ld prec=%ld cutoff=%lu status=%s\n",lambda_s,N,prec,bound,failed?"FAIL":"BALL_OUTPUT");
    for(slong i=0;i<d;i++)for(slong j=0;j<d;j++){printf("ENTRY %ld %ld P ",i-N,j-N);arb_printn(arb_mat_entry(P,i,j),prec/3,ARB_STR_MORE);printf("\nENTRY %ld %ld A ",i-N,j-N);arb_printn(arb_mat_entry(A,i,j),prec/3,ARB_STR_MORE);printf("\nENTRY %ld %ld R ",i-N,j-N);arb_printn(arb_mat_entry(R,i,j),prec/3,ARB_STR_MORE);printf("\nENTRY %ld %ld Q ",i-N,j-N);arb_printn(arb_mat_entry(Q,i,j),prec/3,ARB_STR_MORE);char *dump=arb_dump_str(arb_mat_entry(Q,i,j));printf("\nDUMPQ %ld %ld %s\n",i-N,j-N,dump);flint_free(dump);}
    for(slong i=0;i<d;i++)for(slong j=0;j<d;j++){if(!arb_overlaps(arb_mat_entry(Q,i,j),arb_mat_entry(Q,j,i)))failed=1;if(!arb_overlaps(arb_mat_entry(Q,i,j),arb_mat_entry(Q,d-1-i,d-1-j)))failed=1;}
    printf("CHECK hermitian_and_inversion_overlap=%s min_accuracy_target=%ld\n",failed?"FAIL":"PASS",prec/2);
    arb_mat_clear(P);arb_mat_clear(A);arb_mat_clear(R);arb_mat_clear(Q);arb_clear(lam);arb_clear(L);arb_clear(pi);fmpq_clear(lq);fmpq_clear(lq2);fmpz_clear(bnd);flint_cleanup();return failed?1:0;
}
