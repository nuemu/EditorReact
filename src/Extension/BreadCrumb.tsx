import React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import './BreadCrumb.css'

import { Link } from 'react-router-dom'

import { blocksSelector, currentPage, pageListSelector } from '../Editor/recoil/atom'
import { PageActions } from '../Editor/recoil/LocalActions'

const BreadCrumb = () => {
  const pageList = useRecoilValue(pageListSelector)
  const [currentPageId, setCurrentPageId] = useRecoilState(currentPage)
  const setBlocks = useSetRecoilState(blocksSelector)

  const listUp = (id:string, pageList: any) => {
    var end = false
    var branch:any = []
  
    pageList.forEach((item:any) => {
      if(item.id === id){
        end = true
        branch = [{id: item.id, title: item.title, view: item.view}]
      }
      else if(item.list.length > 0) {
        if(listUp(id, item.list)[1]){
          branch = listUp(id, item.list)[0].concat([{id: item.id, title: item.title, view: item.view}])
          end = true
        }
      }
    })

    return [branch, end]
  }

  const breadCrumbLists = listUp(currentPageId, pageList)[0].reverse().filter((item: any) => item.view === 'Page')

  const handlePage = async (id: string) => {
    await PageActions('fetch', {id: id})
      .then((response) => {
        if(response){
          setCurrentPageId(id)
          setBlocks(response.data)
        }
      })
  }

  const breadCrumbLinks = breadCrumbLists.map((list:any, index:number) => (
    <span key={index}><Link className="bread-crumb-link" to={"/Editor/"+list.id} onClick={() => handlePage(list.id)}>{list.title}</Link>&nbsp;/&nbsp;</span>
    ))

  return <div className="bread-crumb">{breadCrumbLinks}</div>
}

export default BreadCrumb