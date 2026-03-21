import { useEffect } from 'react';
import WifiForm from './components/WifiForm';
import { useTranslation } from 'react-i18next';
import { GITHUB_REPOSITORY_URL } from './constants';

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
      <header className="relative py-8 px-4 text-center">
        <a
          href={GITHUB_REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-4 top-4 inline-flex items-center justify-center rounded-full border border-gray-300/70 bg-white/85 p-2 text-gray-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:text-gray-900 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/85 dark:text-gray-200 dark:hover:text-white"
          aria-label={t('app.openGithubRepository')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M12 .297a12 12 0 00-3.795 23.39c.6.11.82-.26.82-.58v-2.16c-3.34.73-4.04-1.61-4.04-1.61a3.18 3.18 0 00-1.33-1.75c-1.08-.74.08-.73.08-.73a2.5 2.5 0 011.82 1.23 2.52 2.52 0 003.44.98 2.52 2.52 0 01.75-1.58c-2.67-.3-5.47-1.34-5.47-5.94a4.65 4.65 0 011.24-3.22 4.3 4.3 0 01.12-3.17s1-.33 3.3 1.23a11.37 11.37 0 016 0c2.31-1.56 3.3-1.23 3.3-1.23a4.3 4.3 0 01.12 3.17 4.64 4.64 0 011.23 3.22c0 4.61-2.8 5.64-5.48 5.94a2.82 2.82 0 01.8 2.2v3.26c0 .32.22.7.82.58A12 12 0 0012 .297z" />
          </svg>
        </a>
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
        <p className="text-gray-500 dark:text-gray-400 text-sm min-h-[2.5rem]">
          {t('app.subtitle')}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">{t('app.languageLabel')}:</span>
          <button
            type="button"
            onClick={() => handleLanguageChange('ja')}
            className={`min-w-[5rem] px-2 py-1 rounded-md border transition ${
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
            className={`min-w-[5rem] px-2 py-1 rounded-md border transition ${
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
        <p className="min-h-[2rem]">{t('app.footer')}</p>
      </footer>
    </div>
  );
}

export default App;
