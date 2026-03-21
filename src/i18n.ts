import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ja: {
    translation: {
        app: {
          title: 'Wi-Fi QRコードジェネレーター',
          subtitle: 'ネットワーク情報を入力してQRコードを生成 — 完全オフライン・デバイス上で処理',
          footer:
            'すべての処理はお使いのデバイス上で完結します。パスワードは外部に送信されません。',
          openGithubRepository: 'GitHub リポジトリを開く',
          languageLabel: '言語',
          languageJa: '日本語',
          languageEn: 'English',
        },
      form: {
        heading: 'ネットワーク情報を入力',
        ssidLabel: 'ネットワーク名 (SSID)',
        securityLabel: 'セキュリティタイプ',
        securityWpa: 'WPA/WPA2/WPA3',
        securityWep: 'WEP',
        securityOpen: 'オープン (パスワードなし)',
        passwordLabel: 'パスワード',
        passwordPlaceholder: 'Wi-Fiパスワード',
        showPassword: 'パスワードを表示',
        hidePassword: 'パスワードを隠す',
        hiddenLabel: '隠しネットワーク (Hidden SSID)',
        copyDone: 'コピー完了',
        copyText: '文字列をコピー',
        downloadQr: 'QRコードをダウンロード',
        ssidPlaceholder: '例: MyHomeNetwork',
      },
      qr: {
        generating: '生成中...',
        scanToConnect: 'カメラをかざして接続',
        emptyLine1: 'ネットワーク名を入力すると',
        emptyLine2: 'QRコードが表示されます',
        imageAlt: 'WiFiネットワーク {{ssid}} のQRコード',
      },
    },
  },
  en: {
    translation: {
        app: {
          title: 'Wi-Fi QR Code Generator',
          subtitle:
            'Enter network info to generate a QR code — fully offline, processed on your device',
          footer: 'Everything is processed on your device. Your password is never sent externally.',
          openGithubRepository: 'Open GitHub repository',
          languageLabel: 'Language',
          languageJa: '日本語',
          languageEn: 'English',
        },
      form: {
        heading: 'Enter network information',
        ssidLabel: 'Network name (SSID)',
        securityLabel: 'Security type',
        securityWpa: 'WPA/WPA2/WPA3',
        securityWep: 'WEP',
        securityOpen: 'Open (no password)',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Wi-Fi password',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        hiddenLabel: 'Hidden network (Hidden SSID)',
        copyDone: 'Copied',
        copyText: 'Copy string',
        downloadQr: 'Download QR code',
        ssidPlaceholder: 'e.g. MyHomeNetwork',
      },
      qr: {
        generating: 'Generating...',
        scanToConnect: 'Scan with your camera to connect',
        emptyLine1: 'Enter the network name',
        emptyLine2: 'to display a QR code',
        imageAlt: 'QR code for WiFi network {{ssid}}',
      },
    },
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'ja',
  lng: 'ja',
  supportedLngs: ['ja', 'en'],
  nonExplicitSupportedLngs: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
