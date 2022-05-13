import React, { useState } from 'react'
import './Hover.css'

import DropDownMenu from '../DropDownMenu/DropDownMenu'

type Props = {
  title:string, contents:any, Action: any, icon:string
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
          return <DropDownMenu title={content.name} contents={content.contents} Action={props.Action} icon={content.icon} />
        case 'Hover':
          return <HoverMenu title={content.name} contents={content.contents} Action={props.Action} icon={content.icon} />
      }
    }
    return (
      <div
        className="hover-menu-title menu-item"
        onClick={() => props.Action(content.type)}
      >
        <img src={content.icon} alt="menu-icon" /><div className="menu-title  menu-item">{content.name}</div>
      </div>)
  }

  const title = () => {
    if(props.icon !== "") return (
      <div
        className="hover-menu-title menu-item"
      >
        <img className="menu-title-icon menu-item" src={props.icon} alt="menu-icon" /><div className="menu-title menu-item">{props.title}</div>
      </div>)
    else  return (<div
        className="hover-menu-title menu-item"
      >
        <div className="menu-title">{props.title}</div>
      </div>)
  }

  const Menu = (contents: any) => {
    return (
      <div
        className="hover-menu-wrapper menu-item"
        onMouseOver={() => {setToggle(true);document.addEventListener("mousedown", handleClickOutside)}}
        onMouseLeave={() => {setToggle(false)}}
      >
        {title()}
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