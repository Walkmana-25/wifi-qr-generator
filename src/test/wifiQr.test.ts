import { describe, it, expect } from 'vitest';
import { buildWifiString, escapeWifiString } from '../utils/wifiQr';

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
