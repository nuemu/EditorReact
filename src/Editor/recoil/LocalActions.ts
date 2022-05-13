/*
  This File is using for Local Dev
*/

// wait for ajax request test... https://httpbin.org/
import axios from 'axios'
import { v4 } from 'uuid'

const axiosInstance = axios.create({
  baseURL: 'https://httpbin.org/'
})

export const DBActions = async (action: string, params: any) => {
  var response: any = null
  switch(action){
    case 'fetch':
      response = DBs.find(DB => DB.id === params.id)
      if(!response){
        axiosInstance.get('get')
          .then(() => {
            response = DBs.find(DB => DB.id === params.id)
          })
      }
      break
    case 'post':
      const newDB = {
        id: params.id,
        column: [{
          name: '',
          property: 'Text'
        }],
        data: [[
          {
            id: v4(),
            type: 'text',
            data: ''
          }
        ]]
      }
      if(DBs.filter(DB => DB.id === params.id).length === 0) DBs.push(newDB)
      response = newDB
      break
    case 'patch':
      const data = JSON.parse(JSON.stringify(params.data))
      await axiosInstance.patch('patch', params)
        .then(() => {
          const index = DBs.findIndex(DB => DB.id === params.id)
          response = DBs.splice(index, 1, data)
        })
      break
  }
  return response
}

export const PageActions = async (action: string, params: any|null) => {
  var response: any = 'failed'
  switch(action){
    case 'fetch':
      await axiosInstance.get('get')
        .then(() => response = Pages.find(page => page.id === params.id))
      break
    case 'post':
      await axiosInstance.post('post')
        .then(() => {
          const newPage = {
            id: params.id,
            column: [],
            data: [[
              {
                "id": v4(),
                "type": "Text",
                "data": {
                  "text": ""
            }}]]
          }
          if(Pages.filter(page => page.id === params.id).length === 0) Pages.push(newPage)
          response = Pages
        })
      break
    case 'patch':
      const data = JSON.parse(JSON.stringify(params.data))
      await axiosInstance.patch('patch', params)
        .then(() => {
          const index = Pages.findIndex(page => page.id === params.id)
          response = Pages.splice(index, 1, data)
        })
  }
  return response
}

const getList = (id:string, pageList: any) => {
  var listItem:any = null
  pageList.forEach((item:any) => {
    if(item.id === id) listItem = item
    else if(!listItem) listItem = getList(id,item.list)
  })
  return listItem
}

export const PageListActions = async (action: string, params?: any) => {
  var response: any = false
  switch(action){
    case 'fetch':
      await axiosInstance.get('get')
        .then(() => response = PageList)
      break
    case 'add':
      await axiosInstance.patch('patch', params)
        .then(() => {
          const newPageList = JSON.parse(JSON.stringify(PageList))
          const newItem = {id: params.id, title: 'New Page', view: params.view, list: []} as PageList[0]
          if(!getList(params.id, newPageList)) getList(params.currentId, newPageList).list.push(newItem)
          response = newPageList
          PageList = newPageList
        })
      break
  }
  return response
}

const DBs:Data[] = [
  {
    "id": "b233ebf2-44f8-4eb0-9277-9c4ebd63f2e7",
    "column": [
        {
            "name": "Date",
            "property": "Date"
        },
        {
            "name": "memo",
            "property": "Text"
        }
    ],
    "data": [
        [
            {
                "id": "d5f3e499-96a9-43ef-a513-ef34713ae5f4",
                "type": "Date",
                "data": 1651968000000
            },
            {
                "id": "62dd889d-7972-4d4b-bea5-0876509a6057",
                "type": "text",
                "data": "この辺で復活"
            }
        ],
        [
            {
                "id": "2e787347-074c-4617-aca7-9858655be15c",
                "type": "Date",
                "data": 1652412286341
            },
            {
                "id": "99f42e10-fe55-4a14-9484-267494860955",
                "type": "Text",
                "data": "最終更新日"
            }
        ]
    ]
}
]
const Pages = [
  {
    id: 'Editor',
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
          "id": "sample",
          "type": "DB",
          "data": {
            "id": "b233ebf2-44f8-4eb0-9277-9c4ebd63f2e7"
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
      ],
    ]
  }
]
var PageList:PageList = [
  {
    id: 'Editor',
    title: 'Semi WYSIWYG Block Style Editor',
    view: 'Page',
    list:[
      {
        id: "b233ebf2-44f8-4eb0-9277-9c4ebd63f2e7",
        title: "newDB",
        view: "Table",
        list: []
      }
    ]
  }
]