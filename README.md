# Wi-Fi QR Code Generator

完全オフライン・デバイス上で動作する Wi-Fi QR コードジェネレーター。

React + Vite + TypeScript + Tailwind CSS で構築されており、入力したネットワーク情報は外部に送信されません。

## 機能

- ✅ WPA/WPA2/WPA3、WEP、オープンネットワーク対応
- ✅ 隠しネットワーク (Hidden SSID) 対応
- ✅ QR コードをワンクリックでダウンロード
- ✅ Wi-Fi 文字列をクリップボードにコピー
- ✅ ライト / ダークモード対応
- ✅ 完全オフライン・オンデバイス処理
- ✅ 日本語 / English の i18n 対応
- ✅ SSG（ビルド時プリレンダリング）対応

## 開発

```bash
# 依存関係をインストール
make install

# 開発サーバーを起動
make dev

# テストを実行
make test

# プロダクションビルド
make build
```

すべての開発コマンドは `make help` で確認できます。`npm run build` 実行時は Vite ビルド後に SSG を実行し、`dist/index.html` に初期HTMLをプリレンダリングします。

## Wi-Fi QR コードの形式

```
WIFI:T:<auth>;S:<ssid>;P:<password>;H:<hidden>;;
```

- `T`: 認証方式 (`WPA`, `WEP`, `nopass`)
- `S`: SSID
- `P`: パスワード
- `H`: 隠しネットワーク (`true` / 省略)

## CI/CD

GitHub Actions を使用した CI/CD パイプライン:

- **CI** (`ci.yml`): プッシュ・PR 時に Lint → 型チェック → テスト → ビルドを実行
- **Deploy** (`deploy.yml`): `main` / `master` ブランチへのプッシュ時に GitHub Pages へ自動デプロイ
