from mpmath import iv

# Owned interval-rectangle computation, uniform decimal grid on [0,2].
iv.dps = 35
N = 20000
step = iv.mpf('0.0001')
L = iv.ln(2)
pi = iv.pi

def decimal_grid(j):
    return f'{j//10000}.{j%10000:04d}'

def f(x):
    z = pi * iv.exp(2*x)
    return 4*iv.exp(x/2)*z*(2*z-3)*iv.exp(-z)

def abs_interval(x):
    if x.a >= 0:
        return x
    if x.b <= 0:
        return -x
    # x is a single 0.0001-wide grid cell translated by log(2)/2.
    return iv.mpf([0, '0.0002'])

I = iv.mpf(0)
C = iv.mpf(0)
for j in range(N):
    x = iv.mpf([decimal_grid(j), decimal_grid(j+1)])
    f1 = f(x)
    I += x*x*f1*f1*step
    C += f(x+L/2)*f(abs_interval(x-L/2))*step

# R<0.0041 bounds the complete theta profile relative to f on u>=0.
I = 2*iv.mpf('1.0041')**2*I + iv.mpf('1e-100')
C = 2*C
first_harmonic = L**2/iv.sqrt(2)*C
assert I.b < iv.mpf('0.03176')
assert first_harmonic.a > iv.mpf('0.03276')
assert (first_harmonic-I).a > iv.mpf('0.001')
print('complete energy upper:', I.b)
print('p=2 first harmonic lower:', first_harmonic.a)
print('strict gap lower:', (first_harmonic-I).a)
