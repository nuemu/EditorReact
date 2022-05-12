import React from 'react'

import { useRecoilValue } from 'recoil'
import { currentPage, pageListState } from '../../recoil/atom';

import Components from './view_loader'

const ViewComponents = Components as any

const DB = () => {
  const PageList = useRecoilValue(pageListState) as PageList
  const currentPageId = useRecoilValue(currentPage)

  const getList = (id:string, pageList: any) => {
    var listItem:any = null
    pageList.forEach((item:any) => {
      if(item.id === id) listItem = item
      else if(!listItem) listItem = getList(id,item.list)
    })
    return listItem
  }

  const View = ViewComponents[getList(currentPageId, PageList).view].default

  return <View />
}

export default DB