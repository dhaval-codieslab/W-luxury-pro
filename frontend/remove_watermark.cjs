const fs = require('fs');
const { PNG } = require('pngjs');

const inputPath = 'C:/Users/User/.gemini/antigravity-ide/brain/55a51ae9-c44e-41f3-9d46-315e44b1a9c5/media__1786097990793.png';
const outputPath = 'C:/Users/User/.gemini/antigravity-ide/brain/55a51ae9-c44e-41f3-9d46-315e44b1a9c5/w_luxury_logo_clean.png';
const projectLogoPath = 'c:/Users/User/Desktop/W Luxury Redesign/frontend/public/assets/logos/w_luxury_logo_clean.png';

fs.createReadStream(inputPath)
  .pipe(new PNG())
  .on('parsed', function() {
    const width = this.width;
    const height = this.height;
    console.log(`Image dimensions: ${width}x${height}`);

    // Sample background pixel at (10, 10)
    const idx0 = (width * 10 + 10) << 2;
    const bgR = this.data[idx0];
    const bgG = this.data[idx0 + 1];
    const bgB = this.data[idx0 + 2];
    const bgA = this.data[idx0 + 3];
    console.log(`Background RGBA: (${bgR}, ${bgG}, ${bgB}, ${bgA})`);

    // Clear bottom-right area (x > 75% of width, y > 75% of height)
    const starMinX = Math.floor(width * 0.75);
    const starMinY = Math.floor(height * 0.75);

    for (let y = starMinY; y < height; y++) {
      for (let x = starMinX; x < width; x++) {
        const idx = (width * y + x) << 2;
        this.data[idx] = bgR;
        this.data[idx + 1] = bgG;
        this.data[idx + 2] = bgB;
        this.data[idx + 3] = bgA;
      }
    }

    // Write to output paths
    const buffer = PNG.sync.write(this);
    fs.writeFileSync(outputPath, buffer);
    fs.writeFileSync(projectLogoPath, buffer);
    console.log('Successfully removed Gemini watermark!');
    console.log('Saved clean image to:', outputPath);
    console.log('Saved clean image to:', projectLogoPath);
  });
