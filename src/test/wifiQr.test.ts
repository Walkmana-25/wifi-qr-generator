import { describe, it, expect, vi, afterEach } from 'vitest';
import QRCode from 'qrcode';
import { buildWifiString, escapeWifiString, generateWifiQrDataUrl } from '../utils/wifiQr';

describe('escapeWifiString', () => {
  it('escapes backslash', () => {
    expect(escapeWifiString('a\\b')).toBe('a\\\\b');
  });

  it('escapes semicolons', () => {
    expect(escapeWifiString('a;b')).toBe('a\\;b');
  });

  it('escapes commas', () => {
    expect(escapeWifiString('a,b')).toBe('a\\,b');
  });

  it('escapes double quotes', () => {
    expect(escapeWifiString('a"b')).toBe('a\\"b');
  });

  it('escapes colons', () => {
    expect(escapeWifiString('a:b')).toBe('a\\:b');
  });

  it('leaves normal characters unchanged', () => {
    expect(escapeWifiString('MyNetwork123')).toBe('MyNetwork123');
  });
});

describe('buildWifiString', () => {
  it('returns empty string when SSID is empty', () => {
    expect(buildWifiString({ ssid: '', password: '', security: 'WPA', hidden: false })).toBe('');
  });

  it('returns empty string when SSID is only whitespace', () => {
    expect(buildWifiString({ ssid: '   ', password: '', security: 'WPA', hidden: false })).toBe('');
  });

  it('returns empty string for WPA network with no password', () => {
    expect(buildWifiString({ ssid: 'MyNet', password: '', security: 'WPA', hidden: false })).toBe('');
  });

  it('returns empty string for WEP network with no password', () => {
    expect(buildWifiString({ ssid: 'MyNet', password: '   ', security: 'WEP', hidden: false })).toBe('');
  });

  it('builds WPA string correctly', () => {
    const result = buildWifiString({
      ssid: 'MyNetwork',
      password: 'secret123',
      security: 'WPA',
      hidden: false,
    });
    expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:secret123;;');
  });

  it('builds WEP string correctly', () => {
    const result = buildWifiString({
      ssid: 'MyNetwork',
      password: 'secret123',
      security: 'WEP',
      hidden: false,
    });
    expect(result).toBe('WIFI:T:WEP;S:MyNetwork;P:secret123;;');
  });

  it('builds open network string (no password)', () => {
    const result = buildWifiString({
      ssid: 'OpenNet',
      password: '',
      security: 'nopass',
      hidden: false,
    });
    expect(result).toBe('WIFI:T:nopass;S:OpenNet;;');
  });

  it('includes H:true for hidden networks', () => {
    const result = buildWifiString({
      ssid: 'HiddenNet',
      password: 'pass',
      security: 'WPA',
      hidden: true,
    });
    expect(result).toBe('WIFI:T:WPA;S:HiddenNet;P:pass;H:true;;');
  });

  it('escapes special characters in SSID', () => {
    const result = buildWifiString({
      ssid: 'My;Network',
      password: 'pass',
      security: 'WPA',
      hidden: false,
    });
    expect(result).toBe('WIFI:T:WPA;S:My\\;Network;P:pass;;');
  });

  it('escapes special characters in password', () => {
    const result = buildWifiString({
      ssid: 'Net',
      password: 'p@ss;word',
      security: 'WPA',
      hidden: false,
    });
    expect(result).toBe('WIFI:T:WPA;S:Net;P:p@ss\\;word;;');
  });

  it('does not include password field for nopass networks', () => {
    const result = buildWifiString({
      ssid: 'OpenNet',
      password: 'ignored',
      security: 'nopass',
      hidden: false,
    });
    expect(result).not.toContain('P:');
  });
});

describe('generateWifiQrDataUrl', () => {
  const originalCreateElement = document.createElement.bind(document);

  type MockFillText = { text: string; x: number; y: number } | null;

  interface MockContext {
    fillStyle: string;
    strokeStyle: string;
    lineWidth: number;
    textAlign: string;
    textBaseline: string;
    font: string;
    lineCap: string;
    lastFillText: MockFillText;
    beginPath: () => void;
    arc: () => void;
    fill: () => void;
    fillRect: (x: number, y: number, w: number, h: number) => void;
    stroke: () => void;
    drawImage: (image: unknown, dx: number, dy: number) => void;
    measureText: (text: string) => { width: number; actualBoundingBoxAscent: number; actualBoundingBoxDescent: number };
    fillText: (text: string, x: number, y: number) => void;
  }

  interface MockCanvas {
    width: number;
    height: number;
    lastToDataUrlSize: { width: number; height: number };
    context: MockContext;
    getContext: (contextId?: string) => MockContext;
    toDataURL: () => string;
  }

  function createMockCanvas() {
    const ctx: MockContext = {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      textAlign: '',
      textBaseline: '',
      font: '',
      lineCap: '',
      lastFillText: null,
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      fillRect: () => {},
      stroke: () => {},
      drawImage: () => {},
      measureText: (text: string) => {
        const sizeMatch = /([0-9]+)px/.exec(ctx.font);
        const size = sizeMatch ? Number(sizeMatch[1]) : 16;
        return {
          width: text.length * (size * 0.6),
          actualBoundingBoxAscent: size * 0.8,
          actualBoundingBoxDescent: size * 0.2,
        };
      },
      fillText: (text: string, x: number, y: number) => {
        ctx.lastFillText = { text, x, y };
      },
    };

    const canvas: MockCanvas = {
      width: 0,
      height: 0,
      lastToDataUrlSize: { width: 0, height: 0 },
      context: ctx,
      getContext: () => ctx,
      toDataURL: () => {
        canvas.lastToDataUrlSize = { width: canvas.width, height: canvas.height };
        return 'data:image/png;base64,mock';
      },
    };

    return { canvas, ctx };
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('draws QR with center icon and SSID label area', async () => {
    const createdCanvases: MockCanvas[] = [];

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        const { canvas } = createMockCanvas();
        createdCanvases.push(canvas);
        return canvas as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName) as HTMLElement;
    });

    vi.spyOn(QRCode, 'toCanvas').mockImplementation(async (canvas: MockCanvas) => {
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    });

    const dataUrl = await generateWifiQrDataUrl({
      ssid: 'Cafe_Wifi',
      password: 'pass12345',
      security: 'WPA',
      hidden: false,
    });

    expect(dataUrl).toBe('data:image/png;base64,mock');

    const finalCanvas = createdCanvases.at(-1);
    expect(finalCanvas).toBeDefined();
    if (!finalCanvas) return;
    expect(finalCanvas.lastToDataUrlSize.width).toBe(200);
    expect(finalCanvas.lastToDataUrlSize.height).toBeGreaterThan(200);

    expect(finalCanvas.context.lastFillText?.text).toBe('SSID: Cafe_Wifi');
  });
});
