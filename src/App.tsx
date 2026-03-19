import WifiForm from './components/WifiForm';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-slate-900 flex flex-col">
      {/* Header */}
      <header className="py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="bg-blue-600 text-white rounded-xl p-2.5 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Wi-Fi QRコードジェネレーター
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          ネットワーク情報を入力してQRコードを生成 — 完全オフライン・デバイス上で処理
        </p>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        <WifiForm />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400 dark:text-gray-600">
        <p>すべての処理はお使いのデバイス上で完結します。パスワードは外部に送信されません。</p>
      </footer>
    </div>
  );
}

export default App;
