# Block Style Editor React ver
お試し：https://tusko-ku.github.io/Editor

### 開発動機
Notionはとても良いサービスであるが、それ故に、グラフが作成できない、使わないブロックで肥大しているなど、不満を覚えてしまった。Block Style Editorを自作せずとも、Editor.jsのような優れたライブラリは存在するが、大幅に改造するのであれば、自作するのとそう大差ないということで、このEditorの開発に至った。

### 開発予定
Issueを使え？
- [x] Textブロック
  - [x] Markdown対応
    - [ ] Notion風のMarkdown入力
    - [ ] noteやzenn風の拡張(定理や証明用のが欲しい)
  - [x] KaTeX入力対応
- [x] Menu
  - [x] Block追加機能
  - [x] Drag & Dropによる並び替え機能
    - [ ] メニューアイコンでDragするように設定する？
- [ ] Page単位の追加
  - [ ] Pageの枝構造作成
  - [ ] Page間のLink
- [ ] DB機能作成
  - [x] DB部分
    - [ ] 一括削除
    - [ ] 簡単な集計機能(SUM, AVERAGE, column間の四則演算)
    - [ ] 型の設定(日付、数字、チェックボックス、タグ、etc...)
  - [ ] 表示
    - [ ] 一覧表示
    - [ ] カレンダー表示
    - [ ] アルバム表示
    - [ ] グラフ表示
- [ ] その他
  - [ ] レイアウトのカスタム機構
    - [ ] CSS指定
    - [ ] レイアウト指定
  - [ ] 認証機構
  - [ ] コメント機能(ブロック単位でコメント可能に？)
  - [ ] 編集・表示権限
  - [ ] LaTeXへの書き出し

### 不具合メモ
- [x] Caretがブロック間を移動できなくなることがある
  - [x]おそらく、DnD時の削除処理に異常がある。時々空の行が生じる
  ->処理に抜けがあったのが原因と思われる、修正済み。

### 利用ライブラリ・他
- [React](https://ja.reactjs.org/)(MIT)
- [Recoil](https://recoiljs.org/)(MIT)
- [KaTeX](https://katex.org/)(MIT)
- [highlight.js](https://highlightjs.org/)(BSD-3-Clause)
- [marked](https://github.com/markedjs/marked)(MIT)
- [uuid js](https://github.com/uuidjs/uuid)(MIT)
- [DOMPurify](https://github.com/cure53/DOMPurify)
  a) the Apache License Version 2.0, or
  b) the Mozilla Public License Version 2.0
- [Bootstrap Icons](https://icons.getbootstrap.com/)(MIT)