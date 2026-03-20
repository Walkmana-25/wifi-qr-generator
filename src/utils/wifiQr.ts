import QRCode from 'qrcode';
import type { WifiConfig } from '../types';

/**
 * Escapes special characters for the WiFi QR code string format.
 * Characters that need escaping: \ ; , " :
 */
export function escapeWifiString(value: string): string {
  return value.replace(/([\\;,":])/g, '\\$1');
}

/**
 * Builds a WiFi QR code string following the ZXing/WPA format:
 * WIFI:T:<auth>;S:<ssid>;P:<password>;H:<hidden>;;
 */
export function buildWifiString(config: WifiConfig): string {
  const { ssid, password, security, hidden } = config;

  if (!ssid.trim()) {
    return '';
  }

  // Secured networks without a password produce an unusable QR code
  if (security !== 'nopass' && !password.trim()) {
    return '';
  }

  const escapedSsid = escapeWifiString(ssid);
  const escapedPassword = security !== 'nopass' ? escapeWifiString(password) : '';

  const parts = [
    'WIFI:',
    `T:${security};`,
    `S:${escapedSsid};`,
    security !== 'nopass' ? `P:${escapedPassword};` : '',
    hidden ? 'H:true;' : '',
    ';',
  ];

  return parts.join('');
}

/**
 * Generates a QR code as a data URL from a WiFi config.
 * Runs entirely in the browser / on-device — no network requests.
 */
export async function generateWifiQrDataUrl(config: WifiConfig): Promise<string> {
  const wifiString = buildWifiString(config);
  if (!wifiString) {
    return '';
  }

  const qrCanvas = document.createElement('canvas');

  await QRCode.toCanvas(qrCanvas, wifiString, {
    errorCorrectionLevel: 'H', // Higher error correction to tolerate center overlay
    margin: 2,
    width: 300,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  const finalCanvas = document.createElement('canvas');
  const ctx = finalCanvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  const padding = 12;
  const label = `SSID: ${config.ssid}`;
  let fontSize = 16;
  ctx.font = `600 ${fontSize}px "Inter", "Noto Sans JP", system-ui, sans-serif`;

  const availableTextWidth = qrCanvas.width - padding * 2;
  while (fontSize > 10 && ctx.measureText(label).width > availableTextWidth) {
    fontSize -= 1;
    ctx.font = `600 ${fontSize}px "Inter", "Noto Sans JP", system-ui, sans-serif`;
  }

  const textMetrics = ctx.measureText(label);
  const textHeight =
    (textMetrics.actualBoundingBoxAscent || fontSize * 0.8) +
    (textMetrics.actualBoundingBoxDescent || fontSize * 0.2);
  const textAreaHeight = Math.ceil(textHeight + padding * 2);

  finalCanvas.width = qrCanvas.width;
  finalCanvas.height = qrCanvas.height + textAreaHeight;

  // White background for the whole image
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  // Draw the QR code
  ctx.drawImage(qrCanvas, 0, 0);

  // Center WiFi icon overlay (simple arcs + dot)
  const centerX = qrCanvas.width / 2;
  const centerY = qrCanvas.height / 2;
  const radius = qrCanvas.width * 0.11;

  // White circle backdrop to keep the code scannable
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  const arcAngles = [Math.PI * 1.25, Math.PI * 1.75];
  [radius * 0.25, radius * 0.55, radius * 0.85].forEach((r) => {
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, arcAngles[0], arcAngles[1]);
    ctx.stroke();
  });

  ctx.beginPath();
  ctx.fillStyle = '#1f2937';
  ctx.arc(centerX, centerY, radius * 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Label under the QR
  ctx.fillStyle = '#111827';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${fontSize}px "Inter", "Noto Sans JP", system-ui, sans-serif`;
  const textY = qrCanvas.height + textAreaHeight / 2;
  ctx.fillText(label, finalCanvas.width / 2, textY);

  return finalCanvas.toDataURL('image/png');
}
