# Block Style Editor React ver
お試し：https://tusko-ku.github.io/Editor

### 開発動機
Notionはとても良いサービスである、万のことに愛用している。それ故に、使わないブロックで肥大しすぎている、グラフが作成できない他色々な機能が欲しい、など不満を覚えてしまった。BlockStyleEditorが欲しいならWordPressを使うなり、Editor.jsのようなライブラリを用いるのも手ではあるが、いずれにせよ目的を達成するには、大幅に改造する必要があると感じたため、自作するのとそう大差なかろうということで、このEditorの開発に至った。
　
### 開発予定
Issueを使え？**太字**は優先順序高め

- [ ] **Markdown&Katex用構文解析器の作成**
  - [ ] 一旦アルゴリズム関係の勉強...

- [x] **Textブロック**
  - [x] **Markdown対応**
    - [ ] **Notion風のMarkdown入力**
    - [ ] noteやzenn風の拡張(定理のハイライト用に特殊なQuoteみたいなのが欲しい)
  - [x] **KaTeX入力対応**
- [x] **Menu**
  - [x] **Block追加機能**
  - [x] **Drag & Dropによる並び替え機能**
    - [x] **メニューアイコンでDragするように設定する**(そうでもしないと、テーブル内でのDnDができない。)
- [x] **Page単位の追加**
  - [x] **Pageの枝構造作成**
  - [x] **Page間のLink**
  - [ ] **Pageの削除**
  - [ ] PageList表示
    - [ ] サイドバーに木構造
- [ ] **DB機能作成**
  - [x] **DB部分**
    - [x] **一括削除**
    - [ ] 簡単な集計機能(SUM, AVERAGE, column間の四則演算)
    - [x] **型の設定(日付、数字、チェックボックス、タグ、etc...)**
      - [x] **Page propertyの追加**
    - [x] **DBのPageListへの追加**
  - [ ] **表示**
    - [x] **テーブル表示**
    - [x] **カレンダー表示**
      - [x] **Calender表示する要素の制限**
    - [ ] タイムライン表示
    - [ ] アルバム表示
    - [ ] **グラフ表示**
    - [ ] 地図表示
  - [ ] その他
    - [ ] **各表示でのDnDや編集機能**
- [ ] その他
  - [x] パンくず
  - [ ] レイアウトのカスタム機構
    - [ ] CSS指定
    - [ ] レイアウト指定
  - [ ] 認証機構
  - [ ] URLの設定(ドメインではなくて、各記事(Block)の参照がuuid以外にも用いられるように)
  - [ ] コメント機能(ブロック単位でコメント可能に？)
  - [ ] 編集・表示権限
  - [ ] LaTeXへの書き出し


### データの型
DBとページはほぼ同じ型で構成されている

**単位(昇順)**
- ブロック : {id: uuid, type: テキスト、ページ(リンク)、etc..., data: 内容物}
  - 各ブロックの種類とデータを担う
    - これにも編集・閲覧権限与えないとセキュリティ的には良くない？
- ページ or DB : {id: uuid, column: [{id: uuid, property: テキスト、日付、ページ、etc...}], data: [[ブロックのuuid, ...]]}
  - 各ページの種類とデータを担う
    - 編集・閲覧権限も設けたい。判定はバックエンド。
- データリスト : [{id: uuid, view: ページ or DB(テーブル、カレンダー、グラフ、etc...), list: [データリスト, ...]}]の枝構造
  - 各ユーザーの所有するページ、DBのリスト

**バックエンド構成の予定？**

ブロック用のテーブルを設けるとTwitterのような運用も可能になる他、引用などにも強苦なるが、ブロック用のテーブルにおけるクエリ発行頻度が高くなる気がする。
DBとページのブロックは分離しても良いかもしれない。

### リファクタリング案件
- [ ] (カレンダー)`type="date"`の利用についてもう少し考える
- [ ] 描画頻度の見直し
- [x] DBとPageでデータの型を合わせること
  - [ ] もっと厳密に合わせ~~てもいいかも...?~~る！
  - [ ] データベースをData(現Page, DB)、DataList(現PageList)の２種類をメインにする予定
    - [ ] Dataの負担が大きすぎるので何か良い方法はあるか？
- [ ] !,?を多用しているので見直し
- [ ] ちらつき防止のためText Blockを重ねて描画しているが挙動が安定せずイマイチ...Notion Styleのマークダウンが一番か...？
  - [ ] Notion Styleにするため、構文解析の勉強

### 不具合メモ
- [x] Caretがブロック間を移動できなくなることがある
  - [x] おそらく、DnD時の削除処理に異常がある。時々空の行が生じる
- [ ] ブロックをDnDすると、時々reading errorが出る。
- [ ] １行コピペすると改行が追加される。ContentEditableの仕様か？
- [ ] TextBlockが使いもにならないので、Notion StyleのMarkdown入力を優先

### 利用ライブラリ・他
- [React](https://ja.reactjs.org/)(MIT)
- [React Router](https://reactrouter.com/)(MIT)
- [Recoil](https://recoiljs.org/)(MIT)
- [KaTeX](https://katex.org/)(MIT)
- [highlight.js](https://highlightjs.org/)(BSD-3-Clause)
- [marked](https://github.com/markedjs/marked)(MIT)
- [uuid js](https://github.com/uuidjs/uuid)(MIT)
- [DOMPurify](https://github.com/cure53/DOMPurify)
  a) the Apache License Version 2.0, or
  b) the Mozilla Public License Version 2.0
- [Bootstrap Icons](https://icons.getbootstrap.com/)(MIT)