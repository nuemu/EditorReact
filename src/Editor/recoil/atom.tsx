import { atom, selector } from 'recoil'
import { v4 } from 'uuid'

export const menuState = atom({
    key: 'menuState',
    default: [-1, 0]
})

export const DBState = atom({
  key: 'DBState',
  default: {
    id: v4(),
    view: 'Table',
    column:[
      {name:'Date', property: 'Date'},
      {name:'作成中の', property: 'Text'},
      {name:'DB', property: 'Text'}
    ],
    data:
    [
      ['', '行は複数選択可能', '一括削除も'],
      ['', '列はこれから', '色々拡張予定']
    ]
  }
})

export const currentPage = atom({
  key: 'currentPageId',
  default: 'Base'
})

export const pageListState = atom<PageList|null>({
  key: 'pageListState',
  default: [{
    id: 'loading',
    title: 'Loading...',
    list: []
  }]
})

export const pageListSelector = selector({
  key: 'pageListSelector',
  get: ({get}) => {
    return get(pageListState)
  },
  set: ({set}, newPageList) => {
    const newList = newPageList as PageList
    set(pageListState, newList)
  }
})

export const pageState = atom<Page>({
  key: 'pageState',
  default: {
    id: 'loading',
    column: [],
    data: [[
      {
        "id": "Loading",
        "type": "Text",
        "data": {
          "text": "Loading..."
    }}]]
  }
});

export const blocksSelector = selector({
  key: 'blocksSelector',
  get: ({get}) => {
    return get(pageState)!.data as Blocks
  },
  set: ({get,set}, newBlocks) => {
    const newValue = {
      id: get(pageState)!.id,
      column: [],
      data: newBlocks as Blocks
    }
    set(pageState, newValue)
  }
})

export const focusState = atom({
  key: 'focusState',
  default: [-1, 0]
})