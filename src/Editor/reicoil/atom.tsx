import { atom, selector } from 'recoil'
import { v4 } from 'uuid'

export const menuState = atom({
    key: 'menuState',
    default: [-1, 0]
})

export const DBState = atom({
    key: 'DBState',
    default: {
        column:[{name:'sample title 1', property: 'text'}, {name:'sample title 2', property: 'text'}],
        data:
        [
            ['sample data 1-1', 'sample data 1-2'],
            ['sample data 2-1', 'sample data 2-2']
        ]
    }
})

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
                "type": "DB",
                "data": {
                    "id": "db"
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
                    "text": "- markdownスタイルの文章修飾\n- $\\KaTeX$による数式表示\n- Drag&Dropでブロックの並び替え、並列配置"
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
                    "text": "**コードブロック**\n```c++\ninclude<iostream>\nusing namespace std;\n\nint main(){\n  cout << \"hello editor\" << endl;\n}\n```"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "**数式入力**\n- inline\nゼータ函数は$\\zeta(s) = \\sum_{n=0}^\\infty\\frac{1}{n^s}$と定義される。\n- display mode\n$$\\sum_{n=0}^\\infty n = -\\frac{1}{12}$$"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "**並列配置**"
                }
            }
        ],
        [
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "普通の文\n### h3\n- **List**\n   - nestedList"
                }
            },
            {
                "id": "a",
                "type": "Text",
                "data": {
                    "text": "数式\n$$\n\\int\\sin(x)dx\n$$"
                }
            },
            {
                "id": "c64eb1b0-f3ed-4627-9d22-5ca8c01a4e2a",
                "type": "Text",
                "data": {
                    "text": "コードブロック\n```js\nconsole.log(\"CodeBlock\")\n\n```"
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
                    "text": "このエディターの[GitHub](https://github.com/tusko-ku/Editor)レポジトリーのREADME.mdに記載\n"
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