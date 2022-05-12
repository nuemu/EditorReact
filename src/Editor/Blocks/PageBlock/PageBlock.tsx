import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import './PageBlock.css'

import { useRecoilValue, useRecoilState } from 'recoil'
import { blocksSelector, currentPage, currentUserState, pageListSelector } from '../../recoil/atom';

import { PageListActions } from '../../recoil/LocalActions';

const PageBlock = (props: BlockProps) => {
  const blocks = useRecoilValue(blocksSelector) as [Blocks, any]
  const currentUser = useRecoilValue(currentUserState)
  const currentPageId = useRecoilValue(currentPage)
  const [PageList, setPageList] = useRecoilState(pageListSelector)

  const pageId = blocks[props.row_index][props.col_index].data.id

  useEffect(() => {
    var response
    (async () => {
      response = await PageListActions('check', {id: pageId})
      if(!response) {
        await PageListActions('add', {currentId: currentPageId,id: pageId})
          .then((response) => setPageList(response))
      }
    })()
  },[])

  const getList = (id:string, pageList: any) => {
    var listItem:any = null
    pageList.forEach((item:any) => {
      if(item.id === id) listItem = item
      else if(!listItem) listItem = getList(id,item.list)
    })
    return listItem
  }

  return (
    <div className="page-block">
      <Link to={"/"+currentUser+"?q="+pageId}>{getList(pageId, PageList)? getList(pageId, PageList)?.title : 'Loading...'}</Link>
    </div>
  )
}

export default PageBlock