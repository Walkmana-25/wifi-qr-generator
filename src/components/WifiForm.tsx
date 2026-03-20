import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { WifiConfig, SecurityType } from '../types';
import { buildWifiString, generateWifiQrDataUrl } from '../utils/wifiQr';
import QrDisplay from './QrDisplay';

/** Sanitizes a string for safe use as a filename across OS platforms. */
function sanitizeFilename(name: string): string {
  // eslint-disable-next-line no-control-regex
  return name.trim().replace(/[\\/:*?"<>|\x00-\x1f]/g, '_') || 'qr';
}

export default function WifiForm() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<WifiConfig>({
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false,
  });
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  // Cleanup all pending timers on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const updateConfig = useCallback(
    (partial: Partial<WifiConfig>) => {
      const updated = { ...config, ...partial };
      setConfig(updated);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      // Clear QR immediately when input is incomplete
      const wifiString = buildWifiString(updated);
      if (!wifiString) {
        setQrDataUrl('');
        setIsGenerating(false);
        return;
      }

      // Use a monotonically increasing request ID to discard stale async results
      debounceRef.current = setTimeout(async () => {
        const reqId = ++requestIdRef.current;
        setIsGenerating(true);
        try {
          const url = await generateWifiQrDataUrl(updated);
          if (reqId === requestIdRef.current) {
            setQrDataUrl(url);
          }
        } catch {
          if (reqId === requestIdRef.current) {
            setQrDataUrl('');
          }
        } finally {
          if (reqId === requestIdRef.current) {
            setIsGenerating(false);
          }
        }
      }, 300);
    },
    [config]
  );

  const handleCopy = useCallback(async () => {
    const text = buildWifiString(config);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied or unavailable — fail silently
    }
  }, [config]);

  const handleDownload = useCallback(() => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `wifi-${sanitizeFilename(config.ssid)}.png`;
    a.click();
  }, [qrDataUrl, config.ssid]);

  const needsPassword = config.security !== 'nopass';
  const securityOptions: { value: SecurityType; label: string }[] = [
    { value: 'WPA', label: t('form.securityWpa') },
    { value: 'WEP', label: t('form.securityWep') },
    { value: 'nopass', label: t('form.securityOpen') },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-4xl mx-auto">
      {/* Form */}
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          {t('form.heading')}
        </h2>

        <div className="space-y-5">
          {/* SSID */}
          <div>
            <label
              htmlFor="ssid"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              {t('form.ssidLabel')}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="ssid"
              type="text"
              value={config.ssid}
              onChange={(e) => updateConfig({ ssid: e.target.value })}
              placeholder={t('form.ssidPlaceholder')}
              autoComplete="off"
              aria-required="true"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition"
            />
          </div>

          {/* Security Type */}
          <div>
            <label
              htmlFor="security"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              {t('form.securityLabel')}
            </label>
            <select
              id="security"
              value={config.security}
              onChange={(e) => updateConfig({ security: e.target.value as SecurityType })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition cursor-pointer"
            >
              {securityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          {needsPassword && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                {t('form.passwordLabel')}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={config.password}
                  onChange={(e) => updateConfig({ password: e.target.value })}
                  placeholder={t('form.passwordPlaceholder')}
                  autoComplete="off"
                  aria-required="true"
                  className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-300 dark:border-gray-600
                    bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t('form.hidePassword') : t('form.showPassword')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600
                    dark:hover:text-gray-200 transition"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Hidden Network */}
          <div className="flex items-center gap-3">
            <input
              id="hidden"
              type="checkbox"
              checked={config.hidden}
              onChange={(e) => updateConfig({ hidden: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600
                focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="hidden"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {t('form.hiddenLabel')}
            </label>
          </div>
        </div>

        {/* Action buttons — only shown when a valid QR exists, disabled while regenerating */}
        {qrDataUrl && (
          <div className="mt-6 flex gap-3 flex-wrap">
            <button
              onClick={handleCopy}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                hover:bg-gray-200 dark:hover:bg-gray-700 transition
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {t('form.copyDone')}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {t('form.copyText')}
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                bg-blue-600 text-white hover:bg-blue-700 transition
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t('form.downloadQr')}
            </button>
          </div>
        )}
      </div>

      {/* QR Display */}
      <div className="lg:w-72 flex-shrink-0">
        <QrDisplay
          dataUrl={qrDataUrl}
          ssid={config.ssid}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
