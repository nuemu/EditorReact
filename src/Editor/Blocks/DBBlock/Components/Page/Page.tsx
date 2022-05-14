import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { DBSelector, blocksSelector, currentUserState, currentPage, pageListSelector, focusState } from '../../../../recoil/atom';

import { PageActions, PageListActions } from '../../../../recoil/LocalActions';

import './Page.css'

type Props = {
  row_index: number
  col_index: number
  base_row_index: number
  base_col_index: number
  type: string
}

const PageElement = (props: Props) => {
  const [blocks, setBlocks] = useRecoilState(blocksSelector) as [Blocks, any]

  const DB = useRecoilValue(DBSelector(blocks[props.base_row_index][props.base_col_index].data.id)) as any

  const currentUser = useRecoilValue(currentUserState)
  const setCurrentPageId = useSetRecoilState(currentPage)
  const [PageList, setPageList] = useRecoilState(pageListSelector)
  const setFocus = useSetRecoilState(focusState)

  var pageId = DB.data[props.row_index][props.col_index].data
  const DBId = DB.id
  
  const getList = (id:string, pageList: any) => {
    var listItem:any = null
    pageList.forEach((item:any) => {
      if(item.id === id) listItem = item
      else if(!listItem) listItem = getList(id,item.list)
    })
    return listItem
  }

  useEffect(() => {
    var response
    var list = getList(pageId, PageList)
    if(list) response = true

    // Create New Page
    if(!response) {
      (async () => {
      
        await PageListActions('add', {currentId: DBId,id: pageId, view: 'Page'})
          .then((response) => setPageList(response))
        if(!await PageActions('fetch', {id: pageId})){
          await PageActions('post', {id: pageId})
        }
      })()
    }
  },[pageId])

  // Move to clicked Page
  const handlePage = async () => {
    await PageActions('fetch', {id: pageId})
      .then((response) => {
        setCurrentPageId(pageId)
        setBlocks(response.data)
      })
      setFocus([-1, 1])
  }

  return (
    <div className="table-data-page">
      <Link
        to={"/"+currentUser+"/"+pageId}
        onClick={() => handlePage()}
      >
        {getList(pageId, PageList) ? getList(pageId, PageList)?.title : 'Loading...'}
      </Link>
    </div>
  )
}

export default PageElement