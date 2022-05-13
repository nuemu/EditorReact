import React, { useEffect, useState } from 'react'

import { useRecoilState, useRecoilValue } from 'recoil'
import { blocksSelector, currentPage, DBState, pageListState, DBsState } from '../../recoil/atom';
import { DBActions, PageListActions } from '../../recoil/LocalActions';

import Components from './view_loader'

const ViewComponents = Components as any

const DB = (props: BlockProps) => {
  const [DBs, setDBs] = useRecoilState(DBsState) as [any, any]
  const [PageList, setPageList] = useRecoilState(pageListState) as [PageList, any]
  const blocks = useRecoilValue(blocksSelector) as Blocks
  const [currentDB, setDB] = useRecoilState(DBState)
  const currentPageId = useRecoilValue(currentPage)

  const [view, setView] = useState('Loading.tsx')

  const DBId = blocks[props.row_index][props.col_index].data.id

  const getList = (id:string, pageList: any) => {
    var listItem:any = null
    pageList.forEach((item:any) => {
      if(item.id === id) listItem = item
      else if(!listItem) listItem = getList(id, item.list)
    })
    return listItem
  }

  useEffect(() => {
    if(PageList[0].id !== 'loading'){
      const newDBs = JSON.parse(JSON.stringify(DBs))
      var response = getList(DBId, PageList)
      if(!response){
        (async () => {
          response = await PageListActions('add', {id: DBId, currentId: currentPageId, view: 'Table'})
          setPageList(response)
          response = await DBActions('post', {id: DBId})
          setDB(response)
          newDBs.push(response)
          setDBs(newDBs)
        })()
      }
      else{
        response = DBs.find((DB:any) => DB.id === DBId)
        if(!response)
          (async () => {
            response = await DBActions('fetch', {id: DBId})
            setDB(response)
            newDBs.push(response)
            setDBs(newDBs)
          })()
      }
    }
    if(getList(DBId, PageList) && DB !== null) setView(getList(DBId, PageList).view)
  },[PageList])

  useEffect(() => {
    if(currentDB) DBActions('patch', {data: currentDB, id: DBId})
  },[DB])

  var View = ViewComponents[view].default

  return (
    <div
      className="DB-wrapper"
    >
      <View />
    </div>)
}

export default DB