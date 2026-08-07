const fs = require('fs');
const { PNG } = require('pngjs');

const inputPath = 'c:/Users/User/Desktop/W Luxury Redesign/frontend/public/assets/logos/w_luxury_logo_clean.png';
const brainPath = 'C:/Users/User/.gemini/antigravity-ide/brain/55a51ae9-c44e-41f3-9d46-315e44b1a9c5/w_luxury_logo_clean.png';

fs.createReadStream(inputPath)
  .pipe(new PNG())
  .on('parsed', function() {
    const width = this.width;
    const height = this.height;
    console.log(`Image dimensions: ${width}x${height}`);

    // Scan rows from bottom upwards to find where the phone number starts and ends
    let phoneMinY = height;
    let phoneMaxY = 0;

    for (let y = Math.floor(height * 0.75); y < height; y++) {
      let hasPixel = false;
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;
        const alpha = this.data[idx + 3];
        if (alpha > 10) {
          hasPixel = true;
          break;
        }
      }
      if (hasPixel) {
        if (y < phoneMinY) phoneMinY = y;
        if (y > phoneMaxY) phoneMaxY = y;
      }
    }

    console.log(`Phone number vertical bounds: y=${phoneMinY} to y=${phoneMaxY}`);

    // Clear the phone number pixels (set alpha = 0, RGBA = 0,0,0,0)
    for (let y = phoneMinY - 5; y <= phoneMaxY + 5; y++) {
      if (y >= 0 && y < height) {
        for (let x = 0; x < width; x++) {
          const idx = (width * y + x) << 2;
          this.data[idx] = 0;
          this.data[idx + 1] = 0;
          this.data[idx + 2] = 0;
          this.data[idx + 3] = 0;
        }
      }
    }

    const buffer = PNG.sync.write(this);
    fs.writeFileSync(inputPath, buffer);
    fs.writeFileSync(brainPath, buffer);
    console.log('Successfully removed phone number from w_luxury_logo_clean.png!');
  });
