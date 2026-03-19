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

  return QRCode.toDataURL(wifiString, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 300,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
}
