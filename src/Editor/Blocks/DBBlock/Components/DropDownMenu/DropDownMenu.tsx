import React, { useState } from 'react'
import './DropDown.css'

import HoverMenu from '../HoverMenu/HoverMenu'

type Props = {
  title:string, contents:any, Action: any
}

const DropDownMenu = (props: Props) => {
  const [dropdown, setToggle] = useState(false)

  const handleClickOutside = (e:MouseEvent) => {
    const target = e.target as HTMLElement
    if(!(
      target.classList.contains('menu-item')
    )) setToggle(false)
  }

  const Recursion = (content:any) => {
    if(content.contents.length > 0){
      switch(content.type){
        case 'DropDown':
          return <DropDownMenu title={content.name} contents={content.contents} Action={props.Action} />
        case 'Hover':
          return <HoverMenu title={content.name} contents={content.contents} Action={props.Action} />
      }
    }
    return (
      <div
        className="menu-item"
        onClick={() => props.Action(content.type)}
      >
        {content.name}
      </div>)
  }

  const Menu = (contents: any) => {
    return (
      <div
        className="dropdown-menu-wrapper menu-item"
        onClick={() => {setToggle(true);document.addEventListener("mousedown", handleClickOutside)}}
        onMouseLeave={() => {setToggle(false)}}
      >
        <div
          className="dropdown-menu-title menu-item"
        >
          {props.title}
        </div>
        <div
          className={"menu-item dropdown-menu-contents " + (dropdown ? "active" : "")}
        >
          {contents.map((content:any, index:number) => {
            return <div key={index} className="dropdown-menu-content menu-item">{Recursion(content)}</div>
          })}
        </div>
      </div>
    )}

  return Menu(props.contents)
}

export default DropDownMenu