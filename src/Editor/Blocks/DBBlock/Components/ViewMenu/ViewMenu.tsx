import React, { useState } from 'react'
import './ViewMenu.css'

import { useRecoilState } from 'recoil'
import { DBState } from '../../../../recoil/atom';
import { viewMenuItems } from '../../DBViews'

const ViewMenu = () => {
  const [DB, setDB] = useRecoilState(DBState) as [Data, any]
  const [Menu, setMenu] = useState(0)

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

  const handleView = (view_name: string) => {
    var newDB = JSON.parse(JSON.stringify(DB))
    newDB.view = view_name
    setDB(newDB)
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
          <>
            <img src={item.icon} alt="view-menu-icon"/>
            <div
              className="view-menu-item"
              key={item.name}
              onClick={() => {handleView(item.type)}}
            >
              {item.name}
            </div>
          </>
        ))}
      </div>
    </div>)
}

export default ViewMenu