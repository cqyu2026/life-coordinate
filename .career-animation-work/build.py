"""Build locally articulated career GIFs from the existing transparent PNGs."""
from pathlib import Path
import json
import math
import shutil
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path('/Users/yu/Documents/life-coordinate')
SOURCE = ROOT / 'career-png'
WORK = ROOT / '.career-animation-work'
OUTPUT = ROOT / 'career-gif'
SIZE = (724, 966)
REFERENCE = Path('/Users/yu/.codex/attachments/3549bd74-76f8-4b10-9b32-cfffa8f8ae67/image-1.gif')


def annotations():
    return json.loads((WORK / 'motions.json').read_text())


def warp(original, motions, phase):
    """Smooth compact-support inverse warp; exactly unchanged outside marked limbs."""
    source = np.asarray(original).astype(np.float32)
    result = source.copy()
    height, width = source.shape[:2]
    for motion in motions:
        cx, cy, rx, ry, dx, dy = motion['warp']
        dx, dy = dx*1.5, dy*1.5
        sx, sy = width / 300, height / 400
        cx, rx, dx = cx*sx, rx*sx, dx*sx
        cy, ry, dy = cy*sy, ry*sy, dy*sy
        amplitude = math.sin(phase * motion.get('speed', 1))
        if abs(amplitude) < 1e-9:
            continue
        x0, x1 = max(0, int(cx-rx)-1), min(width, int(cx+rx)+2)
        y0, y1 = max(0, int(cy-ry)-1), min(height, int(cy+ry)+2)
        yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
        radius2 = ((xx-cx)/rx)**2 + ((yy-cy)/ry)**2
        influence = np.maximum(0, 1-radius2)**3
        sample_x = np.clip(xx-dx*amplitude*influence, 0, width-1)
        sample_y = np.clip(yy-dy*amplitude*influence, 0, height-1)
        left, top = np.floor(sample_x).astype(int), np.floor(sample_y).astype(int)
        right, bottom = np.minimum(left+1,width-1), np.minimum(top+1,height-1)
        fx, fy = (sample_x-left)[...,None], (sample_y-top)[...,None]
        # Interpolate premultiplied pixels so transparent boundaries cannot acquire colour fringes.
        patch = np.zeros((y1-y0,x1-x0,4),np.float32)
        for px,py,weight in ((left,top,(1-fx)*(1-fy)),(right,top,fx*(1-fy)),
                             (left,bottom,(1-fx)*fy),(right,bottom,fx*fy)):
            value = source[py,px].copy()
            value[:,:,:3] *= value[:,:,3:4]/255
            patch += value*weight
        alpha = patch[:,:,3:4]
        patch[:,:,:3] = np.divide(patch[:,:,:3]*255,alpha,
                                  out=np.zeros_like(patch[:,:,:3]),where=alpha>0)
        original_patch = source[y0:y1,x0:x1]
        colored_prop = ((original_patch[:,:,:3].max(2)-original_patch[:,:,:3].min(2))>40) & (original_patch[:,:,3]>80)
        active = (radius2 < 1) & ~colored_prop
        result[y0:y1,x0:x1][active] = patch[active]
    return Image.fromarray(np.clip(np.rint(result),0,255).astype(np.uint8),'RGBA')


def encode(frames, path):
    matte = Image.new('RGBA',SIZE,'white')
    matte.alpha_composite(frames[0])
    palette_image = matte.convert('RGB').quantize(colors=255,method=Image.Quantize.MEDIANCUT)
    palette = [255,255,255] + palette_image.getpalette()[:765]
    encoded = []
    for frame in frames:
        matte = Image.new('RGBA',SIZE,'white')
        matte.alpha_composite(frame)
        quantized = matte.convert('RGB').quantize(palette=palette_image,dither=Image.Dither.NONE)
        indices = np.asarray(quantized).astype(np.uint16)+1
        indices[np.asarray(frame.getchannel('A'))<48] = 0
        image = Image.fromarray(indices.astype(np.uint8),'P')
        image.putpalette(palette)
        encoded.append(image)
    encoded[0].save(path,save_all=True,append_images=encoded[1:],duration=90,loop=0,
                    transparency=0,disposal=2,optimize=False)


def make(name, spec):
    original = Image.open(SOURCE/f'{name}.png').convert('RGBA').resize(SIZE,Image.Resampling.LANCZOS)
    frames = [warp(original,spec['motions'],2*math.pi*k/16) for k in range(16)]
    OUTPUT.mkdir(exist_ok=True)
    encode(frames,OUTPUT/f'{name}.gif')


def source_sheet(names, target):
    sheet = Image.new('RGB',(1240,850),'#eeeeee')
    draw = ImageDraw.Draw(sheet)
    for index,name in enumerate(names):
        x = index*620+10
        picture = Image.open(SOURCE/f'{name}.png').convert('RGBA').resize((600,800),Image.Resampling.LANCZOS)
        bg = Image.new('RGBA',(600,800),'#abe9af'); bg.alpha_composite(picture)
        sheet.paste(bg.convert('RGB'),(x,35))
        draw.text((x,10),name,fill='black')
        for px in range(0,301,25):
            draw.line((x+px*2,35,x+px*2,835),fill='#999999',width=1)
            if px<300: draw.text((x+px*2+2,36),str(px),fill='#333333')
        for py in range(25,400,25):
            draw.line((x,35+py*2,x+600,35+py*2),fill='#999999',width=1)
            draw.text((x+2,35+py*2+2),str(py),fill='#333333')
    sheet.save(target)


def review(name,spec):
    gif = Image.open(OUTPUT/f'{name}.gif')
    motions = spec['motions']
    width = 380
    sheet = Image.new('RGB',(width*3,360*len(motions)),'#abe9af')
    draw = ImageDraw.Draw(sheet)
    for j,motion in enumerate(motions):
        cx,cy,rx,ry,_,_ = motion['warp']
        pad = max(rx,ry)+10
        box = tuple(map(int,((cx-pad)*SIZE[0]/300,(cy-pad)*SIZE[1]/400,
                            (cx+pad)*SIZE[0]/300,(cy+pad)*SIZE[1]/400)))
        for i,frame_number in enumerate((0,4,12)):
            gif.seek(frame_number)
            crop = gif.convert('RGBA').crop(box)
            crop = crop.resize((320,320),Image.Resampling.NEAREST)
            background = Image.new('RGBA',crop.size,'#abe9af'); background.alpha_composite(crop)
            sheet.paste(background.convert('RGB'),(i*width,j*360+30))
            draw.text((i*width+5,j*360+5),f'{name} / {j+1} / frame {frame_number}',fill='black')
    sheet.save(WORK/f'{name}-review.png')


if __name__=='__main__':
    specs = annotations()
    for name in sys.argv[1:] or specs:
        make(name,specs[name])
        review(name,specs[name])
        print(name,flush=True)
