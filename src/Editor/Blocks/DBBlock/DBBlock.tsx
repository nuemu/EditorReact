import React, { useEffect, useState } from 'react'

import { useRecoilState, useRecoilValue } from 'recoil'
import { blockSelector, currentPage, DBSelector, pageListState, DBsState } from '../../recoil/atom';
import { DBActions, PageListActions } from '../../recoil/LocalActions';

import Components from './view_loader'

const ViewComponents = Components as any

const DB = (props: BlockProps) => {
  const [DBs, setDBs] = useRecoilState(DBsState) as [any, any]
  const [PageList, setPageList] = useRecoilState(pageListState) as [PageList, any]
  const block = useRecoilValue(blockSelector(props)) as Block
  
  const DBId = block.data.id
  const [currentDB, setDB] = useRecoilState(DBSelector(DBId))
  const currentPageId = useRecoilValue(currentPage)

  const [view, setView] = useState('Loading.tsx')

  const getList = (id:string, pageList: any) => {
    var listItem:any = null
    pageList.forEach((item:any) => {
      if(item.id === id) listItem = item
      else if(!listItem) listItem = getList(id, item.list)
    })
    return listItem
  }

  useEffect(() => {
    var viewStyle = view
    if(getList(DBId, PageList) && DB !== null) viewStyle = getList(DBId, PageList).view
    setView(viewStyle)
  },[currentDB, PageList])

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
  },[PageList])

  useEffect(() => {
    if(currentDB) DBActions('patch', {data: currentDB, id: DBId})
  },[currentDB])

  var View = ViewComponents[view].default

  return (
    <div
      className="DB-wrapper"
    >
      <View row_index={props.row_index} col_index={props.col_index}/>
    </div>)
}

export default DB