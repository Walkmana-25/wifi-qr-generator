interface QrDisplayProps {
  dataUrl: string;
  ssid: string;
  isGenerating: boolean;
}

export default function QrDisplay({ dataUrl, ssid, isGenerating }: QrDisplayProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-64">
      {isGenerating ? (
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">生成中...</span>
        </div>
      ) : dataUrl ? (
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <img
              src={dataUrl}
              alt={`QR code for WiFi network: ${ssid}`}
              className="w-52 h-52"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            カメラをかざして接続
          </p>
          {ssid && (
            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-lg max-w-full truncate">
              {ssid}
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-gray-300 dark:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="5" y="5" width="3" height="3" fill="currentColor" />
            <rect x="16" y="5" width="3" height="3" fill="currentColor" />
            <rect x="5" y="16" width="3" height="3" fill="currentColor" />
            <path strokeLinecap="round" d="M14 14h2v2h-2zM18 14h3v2h-3zM14 18h2v3h-2zM18 18h3v3h-3z" />
          </svg>
          <p className="text-sm text-center">
            ネットワーク名を入力すると<br />QRコードが表示されます
          </p>
        </div>
      )}
    </div>
  );
}
