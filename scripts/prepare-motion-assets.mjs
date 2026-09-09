import sharp from 'sharp';
import {mkdir,writeFile,readFile} from 'node:fs/promises';

// Official Pexels photo pages and license were checked on 2026-09-10.
const photos = [
 ['hero-back',3065208,'Engin Akyurt','woman-s-hairstyle',560,840],
 ['hero-detail',4327414,'josue Verdejo','unrecognizable-hairdresser-spraying-hair-of-female-client',600,720],
 ['hair-long',20414932,'Marcella Soáres','woman-with-brown-hair-looking-back',760,1000],
 ['hair-short',11725269,'Hesam_ zaeim','portrait-of-a-woman-with-short-hair',760,1000],
 ['space-mirror',1654834,'Asad Photo Maldives','woman-standing-in-front-of-woman-sitting-on-chair-inside-room',600,800],
 ['space-care',3993449,'cottonbro studio','person-washing-woman-s-hair',600,800],
 ['space-styling',36553502,'Alexander Mass','woman-getting-hair-styled-in-salon',600,800],
];
await mkdir('assets/motion-originals',{recursive:true});
await mkdir('public/images/motion',{recursive:true});
await mkdir('evidence/art-direction',{recursive:true});
const entries = [];
for(const [name,id,photographer,slug,width,height] of photos){
 const source = `https://www.pexels.com/photo/${slug}-${id}/`;
 const download = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1800`;
 const original = `assets/motion-originals/${id}.jpg`;
 let bytes;
 try { bytes = await readFile(original); } catch {
  const response = await fetch(download);
  if(!response.ok) throw new Error(`${id}: ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(original,bytes);
 }
 const file = `public/images/motion/${name}.webp`;
 await sharp(bytes).rotate().resize(width,height,{fit:'cover',position:'centre'}).webp({quality:82,effort:6}).toFile(file);
 const metadata={file:file.replace('public',''),source,download,photographer,photoId:id,license:'https://www.pexels.com/license/',licenseName:'Pexels License',checkedOn:'2026-09-10',width,height,quality:82,fit:'cover',position:'centre',use:'Ảnh stock minh họa; không phải nhân sự, khách hàng, tác phẩm hay mặt bằng thật của Sol.',bytes:(await readFile(file)).length};
 await writeFile(`${file}.json`,JSON.stringify(metadata,null,2)+'\n');
 entries.push(metadata);
}
await writeFile('public/images/motion/sources.json',JSON.stringify({images:entries},null,2)+'\n');
const thumbs=await Promise.all(entries.map(async (e,i)=>({input:await sharp(`public${e.file}`).resize(200,270).png().toBuffer(),left:i*200,top:0})));
await sharp({create:{width:1400,height:270,channels:3,background:'#fff'}}).composite(thumbs).png().toFile('evidence/art-direction/asset-contact-sheet.png');
console.log(entries.map(e=>({file:e.file,bytes:e.bytes})));
