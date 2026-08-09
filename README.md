# FATE / 8192 — Fullscreen Release

## GitHubへのアップロード
1. このZIPをiPhoneの「ファイル」で展開します。
2. GitHubの `fate8192` リポジトリを開きます。
3. `Add file` → `Upload files`。
4. ZIPそのものではなく、展開したフォルダの**中身をすべて**アップロードします。
5. 既存ファイルと同名のものは置換し、`Commit changes`。
6. GitHub Pagesは既に有効なら設定変更不要です。
7. 数十秒〜数分後、PagesのURLをSafariで再読み込みしてください。古い画面が残る場合はSafariを一度閉じて再度開いてください。

## 必須構成
- index.html
- styles.css
- app.js
- stages.json
- manifest.webmanifest
- sw.js
- assets/backgrounds/（13枚）
- assets/sounds/（13音）
- assets/icons/

## iPhoneアプリ風に使う
SafariでゲームURL → 共有 →「ホーム画面に追加」。

## この版の画面仕様
- 通常プレイ中はiPhoneの表示領域全体がゲーム画面です。
- 統計表・ステージ一覧・実到達率などは通常画面の下には置きません。
- 右上の統計ボタンを押した場合だけ、専用の統計画面へ切り替わります。
- ゲーム画面自体は縦スクロールしません。
