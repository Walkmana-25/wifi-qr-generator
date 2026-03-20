// Simulate the WiFi icon rendering to identify the issue
const canvas = {
  width: 300,
  height: 300,
  getContext: () => {
    let arcs = [];
    let fillOperations = [];
    let arcOperations = [];
    
    return {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      lineCap: '',
      arc: function(x, y, r, startAngle, endAngle) {
        this._lastArc = { x, y, r, startAngle, endAngle };
        arcOperations.push({ x, y, r, startAngle: startAngle * 180/Math.PI, endAngle: endAngle * 180/Math.PI });
      },
      beginPath: function() {},
      stroke: function() {},
      fill: function() {
        if (this._lastArc) {
          fillOperations.push({ ...this._lastArc, fillStyle: this.fillStyle, operation: 'arc' });
        }
      },
      fillRect: function() {},
      drawImage: function() {},
      fillText: function() {},
      measureText: function(text) {
        return {
          width: text.length * 9.6,
          actualBoundingBoxAscent: 12.8,
          actualBoundingBoxDescent: 3.2
        };
      },
      font: ''
    };
  }
};

// Simulate the icon drawing code
const centerX = 150;
const centerY = 150;
const radius = 300 * 0.11; // ~33 pixels

const ctx = canvas.getContext('2d');
ctx.strokeStyle = '#1f2937';
ctx.lineWidth = 2;
ctx.lineCap = 'round';

const arcAngles = [Math.PI * 0.25, Math.PI * 0.75];
console.log('Arc angles (in degrees):');
console.log(`  Start: ${(arcAngles[0] * 180/Math.PI).toFixed(2)}°`);
console.log(`  End: ${(arcAngles[1] * 180/Math.PI).toFixed(2)}°`);
console.log(`\nCenter: (${centerX}, ${centerY}), Main radius: ${radius.toFixed(2)}`);

[radius * 0.25, radius * 0.55, radius * 0.85].forEach((r, i) => {
  ctx.beginPath();
  ctx.arc(centerX, centerY, r, arcAngles[0], arcAngles[1]);
  ctx.stroke();
  console.log(`  Arc ${i+1}: radius ${r.toFixed(2)}, angles ${arcAngles[0]} to ${arcAngles[1]}`);
});

// Dot
ctx.beginPath();
ctx.fillStyle = '#1f2937';
ctx.arc(centerX, centerY, radius * 0.15, 0, Math.PI * 2);
ctx.fill();
console.log(`  Dot: radius ${(radius * 0.15).toFixed(2)}`);

console.log('\nProblem Analysis:');
console.log('The arc angles go from 45° to 135°');
console.log('This creates arcs ABOVE the center point (looks like an inverted WiFi icon)');
console.log('WiFi icons should curve DOWN (below the center point)');
console.log('\nExpected angles for proper WiFi icon: 225° to 315° (lower half)');
console.log('Or: π + π*0.25 to π + π*0.75 = 5π/4 to 7π/4');
