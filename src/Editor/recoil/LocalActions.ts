/*
  This File is using for Local Dev
*/

const initialPage = {
  id: 'Loading',
  column: [],
  data: [[
    {
      "id": "Loading",
      "type": "Text",
      "data": {
        "text": "Loading..."
  }}]]
}

export const DBActions = (action: string, params: any) => {
  var response: any = 'failed'
  switch(action){
    case 'fetch':
      break
  }
  return response
}

export const PageActions = (action: string, params: any|null) => {
  var response: any = 'failed'
  switch(action){
    case 'fetch':
      response = Pages.find(page => page.id === params.id)
      break
    case 'post':
      response = Pages.push(initialPage)
      break
  }
  return response
}

export const PageListActions = (action: string, params: any) => {
  var response: any = 'failed'
  switch(action){
    case 'fetch':
      response = PageList
      break
  }
  return response
}

export const DBs = []
export const Pages = [
  {
    id: 'Base',
    column: [],
    data: [
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
            "text": "- markdownスタイルの文章修飾\n- $\\KaTeX$による数式表示\n- Drag&Dropでブロックの並び替え、並列配置\n- DBの編集、行の追加・削除\n- DBのビュー変更(現状カレンダーでは編集できない。)"
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
            "text": "普通の文\n### h3\n- **List**\n   - nestedList"
          }
        },
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
            "text": "**コードブロック**\n```c++\ninclude<iostream>\nusing namespace std;\n\nint main(){\n  cout << \"hello editor\" << endl;\n}\n```"
          }
        },
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
  }
]
export const PageList = [
  {
    id: 'Base',
    title: 'Semi WYSIWYG Block Style Editor',
    list:
    [
      {
        id: 'sample',
        title: '',
        list: []
      }
    ]
  }
]