import { useEffect } from 'react';
import WifiForm from './components/WifiForm';
import { useTranslation } from 'react-i18next';
import { GITHUB_ISSUES_URL } from './constants';

function normalizeLanguage(lang: string): 'ja' | 'en' {
  return lang.startsWith('en') ? 'en' : 'ja';
}

function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const preferredLanguage = localStorage.getItem('wifi-qr-lang') ?? navigator.language.slice(0, 2);
    const lang = normalizeLanguage(preferredLanguage);
    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
    // Run once after initial hydration to avoid SSR/SSG mismatch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const lang = normalizeLanguage(i18n.language);
    document.documentElement.lang = lang;
    if (localStorage.getItem('wifi-qr-lang') !== lang) {
      localStorage.setItem('wifi-qr-lang', lang);
    }
  }, [i18n.language]);

  const handleLanguageChange = (lang: 'ja' | 'en') => {
    void i18n.changeLanguage(lang);
  };

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
            {t('app.title')}
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {t('app.subtitle')}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">{t('app.languageLabel')}:</span>
          <button
            type="button"
            onClick={() => handleLanguageChange('ja')}
            className={`px-2 py-1 rounded-md border transition ${
              i18n.language.startsWith('ja')
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'
            }`}
          >
            {t('app.languageJa')}
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`px-2 py-1 rounded-md border transition ${
              i18n.language.startsWith('en')
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'
            }`}
          >
            {t('app.languageEn')}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        <WifiForm />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400 dark:text-gray-600">
        <a
          href={GITHUB_ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 mb-2"
        >
          {t('app.viewSourceOnGithub')}
        </a>
        <p>{t('app.footer')}</p>
      </footer>
    </div>
  );
}

export default App;
