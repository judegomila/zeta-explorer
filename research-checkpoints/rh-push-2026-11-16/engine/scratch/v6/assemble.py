import os,re
H=os.path.dirname(os.path.abspath(__file__))
C=os.path.join(H,'..','..','..','campaign','STRATEGY.md')
src=open(os.path.join(H,'..','STRATEGY.v5.md'),encoding='utf-8').read()
R=lambda n:open(os.path.join(H,n),encoding='utf-8').read().rstrip('\n')
L=src.split('\n')
def idx(prefix,start=0):
    for i in range(start,len(L)):
        if L[i].startswith(prefix): return i
    raise SystemExit('not found: '+prefix)
i0=idx('## 0. State after round 10'); i1=idx('## 1. Allocation rule'); iE=idx('Every lane, before work starts'); i2=idx('## 2. Adaptation rules')
i3=idx('## 3. Stopping rule'); i31=idx('### 3.1 Families closed'); i65=idx('65. Referee and source records of round 19'); iT=idx('Tried, not closed'); i40=idx('### 4.0 Current best lead'); i5=idx('## 5. Change log'); iD=idx('## Directive from the user')
out=[]
out+=[R('header.md'),'']
out+=L[i0:i1]
out+=[R('s0c.md'),'']
out+=[R('s1.md'),'']
out+=L[iE:i2]
sec2=L[i2:i3]
# process rule added
k=[j for j,l in enumerate(out) if l.startswith('- Before allocating, the planner checks')]
assert len(k)==1
out.insert(k[0]+1,'- (version 6) A requirement flag is entered in `lanes.jsonl` only with the name of the referee file that confirms it; a flag that a later referee file rejects is set to false by the learn step, with the first value kept in a separate field.')
ck=[j for j,l in enumerate(sec2) if l.startswith('- Checkpoint after round 20.')]; assert len(ck)==1
sec2[ck[0]:ck[0]+1]=R('s2new.md').split('\n')
sa=[j for j,l in enumerate(sec2) if l.startswith('- Screening arm (parallel workflow).')]; assert len(sa)==1
sec2[sa[0]]=sec2[sa[0]].replace('- Screening arm (parallel workflow).','- Screening arm (parallel workflow; version-5 rule, kept as the record; the version-6 rule is below).')
ex=[j for j,l in enumerate(sec2) if l.startswith('- An explore lane that passes stage A')]; assert len(ex)==1
sec2[ex[0]]=sec2[ex[0]].replace('- An explore lane that passes stage A','- An explore lane (from version 6: an inverse-explore lane) that passes stage A')
out+=sec2
out+=L[i3:i31]
h=L[i31]; assert h.rstrip().endswith('as record items)')
out.append(h.rstrip()[:-1]+'; 66 to 73: round 20, entered by the strategy review of version 6)')
out+=L[i31+1:i65+1]
out+=R('s31.md').split('\n')
out+=L[i65+1:iT]
out.append(L[iT].rstrip()+' [round 20, version 6: the quadratic / joint-prime-phase residual of U4 and both halves of U6 (c) leave this list (items 66, 69). On the list after round 20: cell U6 (g) with the P_(2,1) residue (items 64, 68; record item only); regimes 2 and 3 of Euler-shape rigidity (item 72; the lead BR of section 4.0); the restricted R1 flag of `c4-helson-discrepancy-zerofree` (not yet tested against Lemma E and HQ2 to HQ4); the DEL and THIN rows of the U4 second-order lane (undecided; no lane, since the cell is closed by ZQ and K3-M); Pick positivity on unbounded node ranges (item 70; no candidate statement).]')
out+=L[iT+1:i40]
out+=R('s40.md').split('\n')+['']
out.append('### 4.0d Record of version 5, section 4.0 (rounds 15 to 19, with the record paragraphs of rounds 16 to 19; superseded by 4.0)')
out+=L[i40+1:i5]
log=L[i5:iD]
while log and log[-1].strip()=='' : log.pop()
out+=log+[R('log.md'),'']
out+=L[iD:]
open(C,'w',encoding='utf-8').write('\n'.join(out).rstrip('\n')+'\n')
print(len(L),len(out))
