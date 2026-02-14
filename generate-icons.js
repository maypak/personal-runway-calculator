// Quick PWA icon generator using Canvas
const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Purple gradient background (brand color)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#8B5CF6'); // violet-500
  gradient.addColorStop(1, '#6D28D9'); // violet-700
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // White money bag emoji style icon
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('💰', size / 2, size / 2);
  
  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Generated: ${filename} (${size}x${size})`);
}

generateIcon(192, 'public/icon-192.png');
generateIcon(512, 'public/icon-512.png');
