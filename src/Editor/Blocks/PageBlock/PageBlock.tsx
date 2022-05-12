import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import './PageBlock.css'

import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { blocksSelector, currentPage, currentUserState, focusState, pageListSelector } from '../../recoil/atom';

import { PageActions, PageListActions } from '../../recoil/LocalActions';

const PageBlock = (props: BlockProps) => {
  const [blocks, setBlocks] = useRecoilState(blocksSelector) as [Blocks, any]
  const currentUser = useRecoilValue(currentUserState)
  const [currentPageId, setCurrentPageId] = useRecoilState(currentPage)
  const [PageList, setPageList] = useRecoilState(pageListSelector)
  const setFocus = useSetRecoilState(focusState)

  const pageId = blocks[props.row_index][props.col_index].data.id

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
    const list = getList(pageId, PageList)
    if(list) response = true

    if(!response) {
      (async () => {
      
        await PageListActions('add', {currentId: currentPageId,id: pageId})
          .then((response) => setPageList(response))
        if(!await PageActions('fetch', {id: pageId})){
          await PageActions('post', {id: pageId})
        }
      })()
    }
  },[])

  const handlePage = async () => {
    await PageActions('fetch', {id: pageId})
      .then((response) => {
        setCurrentPageId(pageId)
        setBlocks(response.data)
      })
      setFocus([-1, 1])
  }

  return (
    <div className="page-block">
      <Link
        to={"/"+currentUser+"?q="+pageId}
        onClick={() => handlePage()}
      >
        {getList(pageId, PageList)? getList(pageId, PageList)?.title : 'Loading...'}
      </Link>
    </div>
  )
}

export default PageBlock