import React, { useState } from 'react'
import './ViewMenu.css'

import { useRecoilState, useRecoilValue } from 'recoil'
import { DBState, pageListSelector } from '../../../../recoil/atom';
import { viewMenuItems } from '../../DBConstants'

const ViewMenu = () => {
  const DB = useRecoilValue(DBState) as Data
  const [Menu, setMenu] = useState(0)
  const [PageList, setPageList] = useRecoilState(pageListSelector)

  const closeMenu = () => {
    document.removeEventListener("mousedown", handleClickOutside)
    setMenu(0)
  }

  const handleClickOutside = (e:MouseEvent) => {
    const target = e.target as HTMLElement
    if(!(
      target.classList.contains('view-menu-item')
    )) closeMenu()
  }

  const handleViewMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setMenu(1)
    document.addEventListener("mousedown", handleClickOutside)
  }

  const getList = (id:string, pageList: any) => {
    var listItem:any = null
    pageList.forEach((item:any) => {
      if(item.id === id) listItem = item
      else if(!listItem) listItem = getList(id,item.list)
    })
    return listItem
  }

  const handleView = (view_name: string) => {
    var newPageList= JSON.parse(JSON.stringify(PageList))
    getList(DB.id, newPageList).view = view_name
    setPageList(newPageList)
  }

  const isSelectedViewMenu = () => {
    return Menu === 1
  }

  return (
    <div
      className="view-menu-wrapper"
      onClick={(e) => handleViewMenu(e)}
    >
      #
      <div
        className={isSelectedViewMenu() ? "view-menu active" : "view-menu"}
      >
        <div className="view-menu-header">View Menu</div>
        {viewMenuItems.map((item:any) => (
          <div className="view-menu-items-wrapper" key={item.name} onClick={() => {handleView(item.type)}}>
            <div className="view-menu-icon-wrapper">
              <img src={item.icon} alt="view-menu-icon" className="view-menu-icon"/>
            </div>
            <div
              className="view-menu-item"       
            >
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>)
}

export default ViewMenu