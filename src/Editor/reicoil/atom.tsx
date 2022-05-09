import { atom, selector } from 'recoil'
import { v4 } from 'uuid'

const blocksState = atom({
  key: 'blocksState',
  default: {
    id: v4(),
    blocks: [
        [
            {
                "id": "c33b2d2c-3690-4a1a-80ab-701e294a574c",
                "type": "Text",
                "data": {
                    "text": "# Semi WYSIWYG Blocks Style Editor"
                }
            }
        ],
        [
            {
                "id": "d24c3512-d4a2-4e93-a145-7aaf96b6ab1b",
                "type": "Text",
                "data": {
                    "text": "**Inspired by Notion**"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "Editor.jsに満足できなかったので、ブログ用に開発しています。\nクリックすると編集できます。"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "### 目次"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "- [今できること](#今できること)\n- [例](#例)\n- [今後の開発予定](#今後の開発予定)"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "### 今できること"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "- markdownスタイルの文章修飾\n- $\\KaTeX$による数式表示"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "### 例"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "**コードブロック**\n```c++\ninclude<iostream>\nusing namespace std;\n\n\nint main(){\n  cout << \"hello editor\" << endl;\n}\n```"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "**数式入力**\n- inline\nゼータ函数は$\\zeta(s) = \\sum_{n=0}^\\infty\\frac{1}{n^s}$と定義される。\n- display mode\n$$\\sum_{n=0}^\\infty n = -\\frac{1}{12}$$\n"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "### 今後の開発予定"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "#### DB機能"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "- 一覧表示(ブログトップページ用)\n- カレンダー表示\n- グラフ表示(Excel形式のDBを準備)"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "#### ブログ機能"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "- 目次(ちゃんと飛べるようにする、自動生成)\n- コメント機能(ブロック単位で？)\n- 自作CSS、レイアウト選択\n - タグ機能"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "#### 欲しい機能"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "- 地図表示\n- 化学式入力"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "#### その他"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "- Drag & Drop機能\n- Notionみたいなメニュー機能"
                }
            }
        ],
        [
            {
                "id": "e0f3e4e3-a08b-42d5-8320-c286e2e5226e",
                "type": "Text",
                "data": {
                    "text": "- このように"
                }
            },
            {
                "id": "908a31cf-7544-4337-b786-b92dba2f24de",
                "type": "Text",
                "data": {
                    "text": "文章の並列表示"
                }
            }
        ]
    ]
  },
});

type Blocks = { id: string; type: string; data: { text: string; }; }[][]

export const blocksSelector = selector({
  key: 'blocksSelector',
  get: ({get}) => {
    const blocks = get(blocksState).blocks
    return blocks as Blocks
  },
  set: ({get,set}, newBlocks) => {
    const newValue = {
      id: get(blocksState).id,
      blocks: newBlocks as Blocks
    }
    set(blocksState, newValue)
  }
})

export const focusState = atom({
  key: 'focusState',
  default: [-1, 0]
})