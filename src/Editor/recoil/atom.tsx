import { atom, selector, selectorFamily } from 'recoil'

export const currentUserState = atom({
  key: 'currentUserState',
  default: 'Editor'
})

export const menuState = atom({
    key: 'menuState',
    default: [-1, 0]
})

export const DBsState = atom({
  key: 'DBsState',
  default: []
})

export const DBSelector = selectorFamily({
  key: 'DBselector',
  get: (id) => ({get}) => {
    return get(DBsState).find((DB: any) => DB.id === id)
  },
  set: (id) => ({set, get}, newDB) => {
    const newDBs = JSON.parse(JSON.stringify(get(DBsState)))
    const index = newDBs.findIndex((DB:any) => DB.id === id)
    newDBs.splice(index, 1, newDB)
    set(DBsState, newDBs)
  }
})

export const currentPage = atom({
  key: 'currentPageId',
  default: 'Editor'
})

export const pageListState = atom<PageList|null>({
  key: 'pageListState',
  default: [{
    id: 'loading',
    title: 'Loading...',
    view: 'Page',
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

export const pageState = atom<Data|null>({
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
      id: get(currentPage),
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