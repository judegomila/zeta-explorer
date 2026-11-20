"""Build the research checkpoint PDF; proof checkers are separate files."""
from pathlib import Path
from fractions import Fraction
from io import BytesIO
import json
import re
import matplotlib
matplotlib.use('Agg')
from matplotlib.mathtext import math_to_image
from matplotlib.font_manager import FontProperties
from PIL import Image as PILImage
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FONTROOT=Path('/usr/share/fonts/truetype/dejavu')
for name,file in [('ResearchBody','DejaVuSerif.ttf'),('ResearchBodyBold','DejaVuSerif-Bold.ttf'),('ResearchHead','DejaVuSans.ttf'),('ResearchHeadBold','DejaVuSans-Bold.ttf'),('ResearchCode','DejaVuSansMono.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(FONTROOT/file)))
pdfmetrics.registerFontFamily('ResearchBody',normal='ResearchBody',bold='ResearchBodyBold',italic='ResearchBody',boldItalic='ResearchBodyBold')
pdfmetrics.registerFontFamily('ResearchHead',normal='ResearchHead',bold='ResearchHeadBold',italic='ResearchHead',boldItalic='ResearchHeadBold')

ROOT=Path(__file__).parent
OUT=ROOT/'Mobius_Bridge_Reduction.pdf'
cert=json.loads((ROOT/'parameter_certificate.json').read_text())
new=cert['new_stage']
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyResearch',fontName='ResearchBody',fontSize=9.8,leading=13.2,spaceAfter=8))
styles.add(ParagraphStyle(name='TitleResearch',fontName='ResearchHeadBold',fontSize=21,leading=26,textColor=colors.HexColor('#102d3b'),spaceAfter=13))
styles.add(ParagraphStyle(name='SectionResearch',fontName='ResearchHeadBold',fontSize=14,leading=18,textColor=colors.HexColor('#102d3b'),spaceAfter=12))
styles.add(ParagraphStyle(name='SmallResearch',fontName='ResearchHead',fontSize=8,leading=10.8,spaceAfter=7))
styles.add(ParagraphStyle(name='CodeResearch',fontName='ResearchCode',fontSize=7.3,leading=9.5,spaceAfter=5))
story=[]
width=A4[0]-100

def p(t,style='BodyResearch'): story.append(Paragraph(t.replace('face="Courier"','face="ResearchCode"'),styles[style]))
def eq(t,fontsize=13):
    t=re.sub(r'\\frac\s*([A-Za-z0-9])\s*([A-Za-z0-9])',lambda m:r'\frac{'+m.group(1)+'}{'+m.group(2)+'}',t)
    t=re.sub(r'\\sqrt\s+([A-Za-z0-9])',lambda m:r'\sqrt{'+m.group(1)+'}',t)
    bio=BytesIO()
    math_to_image('$'+t+'$',bio,prop=FontProperties(size=fontsize),dpi=260,format='png',color='#102d3b')
    bio.seek(0); im=PILImage.open(bio); w,h=im.size
    wp,hp=w*72/260,h*72/260
    ratio=min(1,width/wp)
    story.append(Image(bio,width=wp*ratio,height=hp*ratio,hAlign='LEFT'))
    story.append(Spacer(1,10))
def title(n,t):
    p('RESEARCH CHECKPOINT  /  '+n,'SmallResearch'); p(t,'SectionResearch')
def table(rows,colWidths=None,small=False):
    ss=styles['SmallResearch']
    data=[[Paragraph(str(v),ss) for v in row] for row in rows]
    tab=Table(data,colWidths=colWidths,hAlign='LEFT')
    tab.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e9f0f2')),('VALIGN',(0,0),(-1,-1),'TOP'),('BOX',(0,0),(-1,-1),.4,colors.HexColor('#b7c6cc')),('INNERGRID',(0,0),(-1,-1),.3,colors.HexColor('#d6dfe2')),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
    story.append(tab); story.append(Spacer(1,12))
def footer(canvas,doc):
    canvas.setStrokeColor(colors.HexColor('#c8d4d9')); canvas.line(50,43,A4[0]-50,43)
    canvas.setFont('ResearchHead',7); canvas.setFillColor(colors.HexColor('#576b74'))
    canvas.drawString(50,29,'MOBIUS BRIDGE  /  CONDITIONAL PARAMETER REFINEMENT')
    canvas.drawRightString(A4[0]-50,29,str(doc.page))

p('MATHEMATICS  /  20 OCTOBER 2026','SmallResearch')
p('A small certified reduction,<br/>and the remaining<br/>Mobius bridge estimate','TitleResearch')
p('Prepared for Jude Gomila. Exact algebraic certificate and research checkpoint.','SmallResearch')
eq(r'0.874886700\quad\longrightarrow\quad 0.874886650',20)
p('<b>Result and scope.</b> The numerical hypotheses of the Xu-Sang v2 closure lemma pass at the new rational parameters below. Importing that lemma and its analytic assumptions gives the smaller boundary 17497733/20000000. The gain is exactly 1/20000000 = 5 x 10<super>-8</super>. This is a parameter refinement of that source, not an independently proved twin-ladder zero-free theorem. No literature-priority claim is made.')
table([['Quantity','Exact value','Role'],['New boundary B','17497733 / 20000000','0.87488665'],['Prime length ell','2506801 / 15000000','Increased from the reported choice'],['Imbalance b','17307 / 200000','Retained'],['Moment parameter kappa','29991 / 40000','Retained; within source range'],['Margins g, zeta, g*','10<super>-10</super>, 10<super>-12</super>, 10<super>-11</super>','All strictly positive gates pass']],[130,175,width-305])
p('The source first-stage boundary 69991/80000 licenses this moment parameter exactly. Both stages are checked by the supplied rational programs. For zeta, functional-equation symmetry then gives the conditional strip below.')
eq(r'0.12511335\ \leq\ \operatorname{Re}\rho\ \leq\ 0.87488665')
p('<b>Larger goal.</b> The target 0.8748 is not reached. A separate exact obstruction below proves that it cannot be reached inside the source\'s stated admissibility system by parameter changes alone. The direct Mobius-bridge correlation bound remains unproved.')
p('Source: Yuanda Xu and Hejian Sang, <i>Amplified moments and a refinement of the quasi-Riemann hypothesis</i>, arXiv:2610.15291v2 (15 October 2026), equations (10), (21), (28), Section 6.2 and Lemma 8.1. The imported analytic machinery has not been independently reproduced in this checkpoint.','SmallResearch')
story.append(PageBreak())

title('01','The exact endpoint certificate')
p('Use the source endpoint E and positive denominator J from equations (21) and (28). The following algebra is a new certificate at the stated rational parameters. Set y = 1/2 - x, alpha = 5/6 and c = 1/(3 kappa). Define the polynomial ingredients:')
eq(r'D(y)=\frac52-c+(1+2c)y,\qquad P(y)=1-\frac c2+2y+2cy^2')
eq(r'J=(\alpha-\delta)D+\delta P,\qquad h=\frac{1+b+3\ell}{2},\quad l_y=\frac{1+b-\ell}{2}')
eq(r'C_0=-\frac14+\frac b6+\frac{5\ell}{4},\quad t=\ell+c\left(\frac h4-\frac{l_y}{2}\right)')
eq(r'U(y)=\frac12+\left(\frac12-y\right)t-\frac{3h}{4}')
p('Clearing the denominator in -E-g gives a quadratic in delta. Its unscaled coefficients follow directly:')
eq(r'a=-2(P-D)U+\frac{3h}{4}P')
eq(r'b_1=-2(P-D)(C_0+g)-2\alpha DU-\frac{3h\alpha}{4}P')
eq(r'c_1=-2\alpha D(C_0+g)')
p('Multiply all three by M = 112086563940000000000, giving integer polynomials A, Bp and C. The identity is')
eq(r'2MJ(-E-g)=A(y)\delta^2+B_p(y)\delta+C(y).')
p('Every coefficient of A and of Delta(y) = 4 A(y) C(y) - Bp(y)<super>2</super> is strictly positive. Since y is nonnegative, A and Delta are positive. Completing the square yields')
eq(r'4A(A\delta^2+B_p\delta+C)=(2A\delta+B_p)^2+\Delta>0.')
p('Also D and P have positive coefficients, so J &gt; 0 for 0 &le; delta &le; 5/6. Therefore E &lt; -10<super>-10</super> on the whole rectangle 0 &le; delta &le; 5/6, 0 &le; x &le; 1/2. This is a continuum certificate; no mesh approximation is used for acceptance.')
story.append(PageBreak())

title('02','Integer witness and remaining gates')
p('Coefficients below are in increasing powers of y. They completely specify the new endpoint witness; the JSON stores the same integers.')
for label,key in [('A','A_coefficients_low_to_high'),('Bp','Bpoly_coefficients_low_to_high'),('C','C_coefficients_low_to_high'),('Delta = 4AC - Bp^2','four_AC_minus_B_squared_coefficients_low_to_high')]:
    p('<b>'+label+'</b>','SmallResearch')
    for i,v in enumerate(new[key]): p(f'{i}: {v}','CodeResearch')
p('All other numerical conditions in source Section 6.2 were evaluated exactly as rational inequalities. Selected positive margins are shown as rounded diagnostics; exact fractions are in the certificate.')
names=[('Prime supply above 21/100','prime_supply_minus_21_100'),('Six kappa ell above 3/4','six_kappa_ell_minus_three_quarters'),('Small-delta gate','small_delta_bound_margin'),('Detector-floor gate','floor_bound_margin'),('Small-row gate','small_row_bound_margin'),('g - 2 zeta - g*','endpoint_margin_after_extension')]
table([['Gate','Positive margin']]+[[label,f'{float(Fraction(new["strict_scalar_margins"][key])):.12g}'] for label,key in names],[310,width-310])
p('The generator constructs the polynomial witness. A separate checker reads the JSON, evaluates the rational endpoint directly, verifies the polynomial identity on an exact 5 by 5 interpolation grid, recomputes the discriminant polynomial, and checks every scalar gate. The cleared identity has bidegree at most (2,3), so the exact interpolation check identifies it globally. Both programs use Python integers and Fraction for all acceptance decisions. Neither checks the imported analytic estimates.')
story.append(PageBreak())

title('03','Why retuning cannot reach 0.8748')
p('<b>Proposition.</b> No parameters satisfying the source\'s stated admissibility range can attain B &le; 0.8748. This obstruction is specific to that endpoint system and says nothing against other analytic estimates.')
p('Take the single admissible test point delta = 9387/20000, x = 1/2. For the row-count expression R, direct differentiation gives')
eq(r'\frac{\partial R}{\partial c}=-\frac{(\alpha-\delta)^2\delta x(1-x)^2}{J^2}\leq0.')
p('The source requires h &lt; 2 ly. Hence, at this positive delta and x,')
eq(r'\frac{\partial E}{\partial c}=\delta x\left(\frac h4-\frac{l_y}{2}\right)+\frac{3h}{4}\frac{\partial R}{\partial c}<0.')
p('Since c = 1/(3 kappa), E increases with kappa. Its smallest allowed kappa is 29991/40000. Fix that value. At the chosen test point, E is affine in b and ell.')
p('The proposed boundary requires ell &ge; 314/1875. Admissibility gives ell &le; 1/5 and 0 &lt; b &lt; ell, so the parameter set is contained in the rectangle 0 &le; b &le; 1/5, 314/1875 &le; ell &le; 1/5. Exact evaluation at its four vertices gives:')
table([['b','ell','E (rounded)'],['0','314/1875','0.0003776169913977'],['1/5','314/1875','0.0003772214536248'],['0','1/5','0.0358064289091132'],['1/5','1/5','0.0358060333713403']],[90,140,width-230])
p('Every vertex value is rigorously greater than 3/10000. Affinity gives the same lower bound on the entire rectangle. Increasing kappa cannot reduce it. Thus E &gt; 3/10000 at this one row class for every candidate, contradicting the required negative endpoint saving.')
p('Floating-point optimization suggests a local limiting boundary near 0.8748866496166 at the permitted minimum kappa. That numerical value is exploratory, not an optimality theorem. The exact certificate uses the slightly larger rational boundary 0.87488665. The exact obstruction above establishes only the stated exclusion of 0.8748 within this parameter system.')
story.append(PageBreak())

title('04','The direct Mobius bridge: a complete criterion')
p('This section concerns the existing twin-ladder packet, independently of the parameter refinement. Let k be the pole-cancelling spline packet from the prior audit rh_global_bound_v3.pdf. Its support is [-1/2,1/2]. Its transform is')
eq(r'K(z)=\frac{(1/4-z^2)^2}{q}\left(\frac{\sinh(z/32)}{z/32}\right)^{16},\quad q=\frac{3733353825443981}{6810804000}.',11.5)
p('Define the finite sums')
eq(r'F(y)=\sum_{m\geq2}\frac{\log m}{\sqrt m}k(\log m-y),\quad S(u)=\sum_{d\geq1}\frac{\mu(d)}{\sqrt d}F(u-\log d).',11.5)
p('The identity Lambda = mu * log identifies S with the prime-power packet. Initially for Re z &gt; 1/2, direct integration gives')
eq(r'\int_0^\infty S(u)e^{-zu}\,du=-K(z)\frac{\zeta^{\prime}}{\zeta}\left(\frac12+z\right).')
p('<b>Energy implication.</b> Suppose 1/2 &lt; B &lt; 1 and, for all sufficiently large integers j,')
eq(r'\int_j^{j+1}|S(u)|^2\,du\leq C e^{(2B-1)j}.')
p('Cauchy-Schwarz on each block bounds the absolute Laplace integral by a geometric series for Re z &gt; B - 1/2, locally uniformly. It is therefore holomorphic there. The displayed identity continues from its original domain. The only zeros of K with nonzero real part are at z = +/-1/2. Thus an off-line zeta zero with Re rho &gt; B would give an uncancelled pole, a contradiction. The source pole at s=1 is cancelled by K. Consequently the energy estimate implies zero-freeness for Re s &gt; B, with the principal pole allowed.')
p('For B = 0.8748 the needed energy exponent is 0.7496. This implication is established here; the hypothesis is not. The parameter refinement on earlier pages neither proves this new energy bound nor constitutes a direct estimate for its signed cross-terms.')
p('The previous audit gives F(y)=0 for y &le; a=log 2-1/2 and |F(y)| &le; 6265357271(1+y)e<super>-19y/2</super> for y &ge; 0. These bounds suffice for the unconditional pair estimates on the next page. Their large constants do not affect the asymptotic exponents.')
story.append(PageBreak())

title('05','Two pair classes already meet the target')
p('Write X=e<super>u</super> and f<sub>X</sub>(n)=n<super>-1/2</super>F(log(X/n)). The filter bound implies a finite constant A = sup<sub>y</sub> e<super>y/2</super>|F(y)|. Put c<sub>0</sub>=e<super>-a</super>. Then')
eq(r'|f_X(n)|\leq A X^{-1/2},\qquad f_X(n)=0\ \ (n\geq c_0X).')
p('Expand |S(u)|<super>2</super> into the diagonal and ordered off-diagonal pairs. The diagonal is at most c<sub>0</sub>A<super>2</super>. For integers G,H &ge; 1, elementary counting gives')
eq(r'\sum_{\gcd(m,n)>G}|f_X(m)f_X(n)|\leq\frac{c_0^2 A^2X}{G},')
eq(r'\sum_{0<|m-n|\leq H}|f_X(m)f_X(n)|\leq2c_0A^2H.')
p('For the first inequality, sum over common divisors d &gt; G. There are at most floor(c<sub>0</sub>X/d)<super>2</super> ordered divisible pairs; use sum<sub>d&gt;G</sub> d<super>-2</super> &le; 1/G. For the second, each m has at most 2H partners. Dropping the Mobius signs only enlarges these bounds.')
p('On u in [L,L+1], choose G=floor(e<super>0.2504L</super>) and H=floor(e<super>0.7496L</super>). After integration, both classes are O(e<super>0.7496L</super>). Their union is therefore harmless at the proposed energy exponent. The remaining task is a one-sided bound of that size for the signed pairs satisfying')
eq(r'\gcd(m,n)\leq G,\qquad |m-n|>H.')
p('These estimates hold at all sufficiently large scales. They do not control the remaining class. The multiplicative factorization m=da, n=db, (a,b)=1 gives mu(m)mu(n)=mu(d)<super>2</super>mu(a)mu(b) when (d,ab)=1, and zero otherwise; it retains the exact signs for that next step.')
p('<b>Finite diagnostic.</b> The supplied script checks the actual spline packet at L=4,6,8 and partitions every pair. The largest prime/Mobius identity discrepancy is below 3.5 x 10<super>-14</super>; the partition discrepancy is below 6 x 10<super>-16</super>. The remaining signed pair sum is negative at L=4,6 and positive at L=8. These floating-point checks establish no asymptotic saving.')
p('<b>Reproduce.</b> Run <font face="Courier">python certify_parameters.py</font>, then <font face="Courier">python verify_certificate.py</font>. Both use only the Python standard library. The optional <font face="Courier">mobius_sector_check.py</font> requires NumPy and SciPy. Use ordinary Python, without -O. The exploratory optimizer is not part of the certificate.')
p('Files: parameter_certificate.json; target_obstruction.json; two exact checkers; finite diagnostic and results; this report and its build script. External reference: https://arxiv.org/html/2610.15291v2. Internal reference: Jude Gomila, rh_global_bound_v3.pdf, 30 September 2026.','SmallResearch')

doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=50,leftMargin=50,topMargin=49,bottomMargin=58,title='A certified parameter refinement and the Mobius bridge remainder',author='Research checkpoint prepared for Jude Gomila',subject='Conditional rational refinement from 0.8748867 to 0.87488665; direct correlation target remains open')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print(OUT)
