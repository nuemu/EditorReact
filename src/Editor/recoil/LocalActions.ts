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
          //console.log('DBs:', DBs)
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
      const data = JSON.parse(JSON.stringify(params))
      await axiosInstance.patch('patch', data)
        .then(() => {
          const index = Pages.findIndex(page => page.id === data.id)
          response = Pages.splice(index, 1, data)
          //console.log('Pages:', Pages)
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
    case 'patch':
      await axiosInstance.patch('patch', params)
        .then(() => {
          const newPageList = params
          response = newPageList
          PageList = newPageList
          //console.log('PageList:',newPageList)
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
              "property": "Page"
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
                  "type": "Page",
                  "data": "ec1d2b8f-d3b1-4905-ba0c-30af053ac719"
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
                  "type": "Page",
                  "data": "4612db8c-5625-482b-8eb8-4427d0a08717"
              }
          ]
      ]
  }
]
const Pages = [
  {
      "id": "Editor",
      "column": [],
      "data": [
          [
            {
                "id": "description",
                "type": "Text",
                "data": {
                    "text": "# ????????????"
                }
            }
          ],
          [
              {
                  "id": "d24c3512-d4a2-4e93-a145-7aaf96b6ab1b",
                  "type": "Text",
                  "data": {
                      "text": "### Inspired by Notion"
                  }
              }
          ],
          [
              {
                  "id": "a",
                  "type": "Text",
                  "data": {
                      "text": "Editor.js??????????????????????????????????????????????????????????????????~~??????~~??????\n??????????????????????????????????????????"
                  }
              }
          ],
          [
              {
                  "id": "a",
                  "type": "Text",
                  "data": {
                      "text": "### ??????"
                  }
              }
          ],
          [
              {
                  "id": "a",
                  "type": "Text",
                  "data": {
                      "text": "- [??????????????????](#??????????????????)\n- [???](#???)\n- [?????????????????????](#?????????????????????)"
                  }
              }
          ],
          [
              {
                  "id": "a",
                  "type": "Text",
                  "data": {
                      "text": "### ??????????????????"
                  }
              }
          ],
          [
              {
                  "id": "a",
                  "type": "Text",
                  "data": {
                      "text": "- markdown???????????????????????????\n- $\\KaTeX$?????????????????????\n- Drag&Drop?????????????????????????????????????????????\n- DB?????????????????????????????????\n- DB??????????????????(????????????????????????????????????????????????)"
                  }
              }
          ],
          [
              {
                  "id": "a",
                  "type": "Text",
                  "data": {
                      "text": "### ???"
                  }
              }
          ],
          [
              {
                  "id": "a",
                  "type": "Text",
                  "data": {
                      "text": "????????????\n### h3\n- **List**\n   - nestedList"
                  }
              }
          ],
          [
              {
                  "id": "a",
                  "type": "Text",
                  "data": {
                      "text": "**?????????????????????**\n```c++\ninclude<iostream>\nusing namespace std;\n\nint main(){\n  cout << \"hello editor\" << endl;\n}\n```"
                  }
              },
              {
                  "id": "a",
                  "type": "Text",
                  "data": {
                      "text": "**????????????**\n- inline\n??????????????????$\\zeta(s) = \\sum_{n=0}^\\infty\\frac{1}{n^s}$?????????????????????\n- display mode\n$$\\sum_{n=0}^\\infty n = -\\frac{1}{12}$$"
                  }
              }
          ],
          [
            {
              "id": "asdasad",
              "type": "Text",
              "data": {
                      "text": "**???????????????????????????????????????????????????????????????**(?????????????????????)\n?????????#??????????????????????????????"
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
                      "text": "### ?????????????????????"
                  }
              }
          ],
          [
              {
                  "id": "a",
                  "type": "Text",
                  "data": {
                      "text": "????????????????????????[GitHub](https://github.com/tusko-ku/Editor)?????????????????????README.md?????????\n"
                  }
              }
          ]
      ]
  },
  {
      "id": "ec1d2b8f-d3b1-4905-ba0c-30af053ac719",
      "column": [],
      "data": [
          [
              {
                  "id": "tekito",
                  "type": "Text",
                  "data": {
                      "text": "?????????????????????"
                  }
              }
          ]
      ]
  },
  {
      "id": "4612db8c-5625-482b-8eb8-4427d0a08717",
      "column": [],
      "data": [
          [
              {
                  "id": "tekito",
                  "type": "Page",
                  "data": {
                      "id": "Editor"
                  }
              }
          ],
          [
              {
                  "id": "a",
                  "type": "Text",
                  "data": {
                      "text": "????????????????????????"
                  }
              }
          ]
      ]
  }
]
var PageList:PageList = [
  {
      "id": "Editor",
      "title": "Semi WYSIWYG Block Style Editor",
      "view": "Page",
      "list": [
          {
              "id": "b233ebf2-44f8-4eb0-9277-9c4ebd63f2e7",
              "title": "SampleDB",
              "view": "Calendar",
              "list": [
                  {
                      "id": "ec1d2b8f-d3b1-4905-ba0c-30af053ac719",
                      "title": "???????????????",
                      "view": "Page",
                      "list": []
                  },
                  {
                      "id": "4612db8c-5625-482b-8eb8-4427d0a08717",
                      "title": "???????????????",
                      "view": "Page",
                      "list": []
                  }
              ]
          }
      ]
  }
]