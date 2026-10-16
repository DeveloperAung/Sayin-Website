// Pure Node.js PNG generator with no external dependencies
import fs from 'fs';
import zlib from 'zlib';

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCrcTable();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

export function generatePNG(width, height, drawFn, outputPath) {
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData, { level: 9 });

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const finalPng = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outputPath, finalPng);
}

fs.mkdirSync('assets/screens', { recursive: true });

// 1. Apple Touch Icon (180x180)
generatePNG(180, 180, (x, y, w, h) => {
  const nx = x / w;
  const ny = y / h;
  const r = Math.round(10 + ny * 5);
  const g = Math.round(78 - ny * 35 + nx * 30);
  const b = Math.round(64 - ny * 25 + nx * 20);
  return [r, g, b, 255];
}, 'assets/apple-touch-icon.png');

// 2. Favicon (32x32)
generatePNG(32, 32, (x, y, w, h) => {
  const ny = y / h;
  return [15, Math.round(80 - ny * 30), 65, 255];
}, 'assets/favicon.png');

// Screens generator helper
const screens = [
  'screen-dashboard.png',
  'screen-groups.png',
  'screen-add.png',
  'screen-remittance.png',
  'screen-account.png',
  'screen-dashboard-en.png',
  'screen-groups-en.png',
  'screen-add-en.png',
  'screen-activity-en.png',
  'screen-account-en.png'
];

screens.forEach(s => {
  generatePNG(390, 844, (x, y, w, h) => {
    let r = 10, g = 38, b = 32;
    if (y < 60) {
      r = 7; g = 26; b = 22;
    } else if (y > 760) {
      r = 9; g = 32; b = 27;
    } else {
      const inCard1 = y > 100 && y < 220 && x > 20 && x < 370;
      const inCard2 = y > 240 && y < 420 && x > 20 && x < 370;
      const inCard3 = y > 440 && y < 720 && x > 20 && x < 370;
      if (inCard1 || inCard2 || inCard3) {
        r = 15; g = 51; b = 44;
      }
    }
    return [r, g, b, 255];
  }, `assets/screens/${s}`);
});

console.log('All PNG placeholders generated successfully.');
