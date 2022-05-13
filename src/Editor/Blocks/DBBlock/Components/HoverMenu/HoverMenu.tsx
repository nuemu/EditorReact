import React, { useState } from 'react'
import './Hover.css'

import DropDownMenu from '../DropDownMenu/DropDownMenu'

type Props = {
  title:string, contents:any, Action: any
}

const HoverMenu = (props: Props) => {
  const [toggle, setToggle] = useState(false)

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
        className="hover-menu-wrapper menu-item"
        onMouseOver={() => {setToggle(true);document.addEventListener("mousedown", handleClickOutside)}}
        onMouseLeave={() => {setToggle(false)}}
      >
        <div
          className="hover-menu-title menu-item"
        >
          {props.title}
        </div>
        <div
          className={"menu-item hover-menu-contents " + (toggle ? "active" : "")}
        >
          {contents.map((content:any, index:number) => {
            return <div key={index} className="hover-menu-content menu-item">{Recursion(content)}</div>
          })}
        </div>
      </div>
    )}

  return Menu(props.contents)
}

export default HoverMenu