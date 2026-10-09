from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw

ROOT=Path('/Users/yu/Documents/life-coordinate')
SOURCE=ROOT/'career-png'
OUTPUT=ROOT/'career-gif'
WORK=ROOT/'.career-animation-work'
specs=json.loads((WORK/'motions.json').read_text())

def frames(name):
    im=Image.open(OUTPUT/f'{name}.gif')
    return [np.asarray((im.seek(k) or im.convert('RGBA'))) for k in range(im.n_frames)]

rows=[]
for name,spec in sorted(specs.items()):
    pixels=frames(name)
    first,peak=pixels[0].astype(np.int16),pixels[4].astype(np.int16)
    changed=np.max(np.abs(first-peak),axis=2)>4
    covered=np.zeros(changed.shape,bool)
    motion_results=[]
    for motion in spec['motions']:
        cx,cy,rx,ry,*_=motion['warp']
        y,x=np.mgrid[:966,:724]
        region=((x-cx*724/300)/(rx*724/300))**2+((y-cy*966/400)/(ry*966/400))**2<1
        covered|=region
        dark=((first[:,:,:3].max(2)<155)|(peak[:,:,:3].max(2)<155))&((first[:,:,3]>100)|(peak[:,:,3]>100))
        motion_results.append((motion['part'],int((changed&region&dark).sum())))
    outside=int((changed&~covered).sum())
    corner_alpha=[int(p[0,0,3]) for p in pixels]
    rows.append((name,len(pixels),outside,corner_alpha,motion_results))

for row in rows: print(row)
print('MISSING', sorted(set(f.stem for f in SOURCE.glob('*.png'))-set(f.stem for f in OUTPUT.glob('*.gif'))))

names=sorted(f.stem for f in SOURCE.glob('*.png'))
sheet=Image.new('RGB',(1200,((len(names)+3)//4)*405),'#abe9af')
draw=ImageDraw.Draw(sheet)
for index,name in enumerate(names):
    im=Image.open(OUTPUT/f'{name}.gif')
    im.seek(4 if name!='clinical-doctor' else 2)
    art=im.convert('RGBA').resize((270,360),Image.Resampling.LANCZOS)
    x=(index%4)*300+15; y=(index//4)*405+30
    bg=Image.new('RGBA',(270,360),'#abe9af');bg.alpha_composite(art)
    sheet.paste(bg.convert('RGB'),(x,y))
    draw.text((x,y-20),name,fill='black')
sheet.save(WORK/'overview.png')

motion_sheet=Image.new('RGB',(5*390,6*230),'#eeeeee')
labels=ImageDraw.Draw(motion_sheet)
for index,name in enumerate(sorted(specs)):
    review=Image.open(WORK/f'{name}-review.png').convert('RGB')
    x=(index%5)*390; y=(index//5)*230
    for j,offset in enumerate((0,380)):
        crop=review.crop((offset,30,offset+320,350)).resize((185,185),Image.Resampling.LANCZOS)
        motion_sheet.paste(crop,(x+5+j*190,y+30))
    labels.text((x+5,y+5),name,fill='black')
motion_sheet.save(WORK/'motions-contact.png')
