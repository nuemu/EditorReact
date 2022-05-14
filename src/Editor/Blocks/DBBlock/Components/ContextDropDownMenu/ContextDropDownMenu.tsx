import React, { useState } from 'react'

import HoverMenu from '../HoverMenu/HoverMenu'

type Props = {
  title: string, contents: any, Action: any, icon: string
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
          return <DropDownMenu title={content.name} contents={content.contents} Action={props.Action} icon={content.icon}/>
        case 'Hover':
          return <HoverMenu title={content.name} contents={content.contents} Action={props.Action} icon={content.icon}/>
      }
    }
    return (
      <div
        className="dropdown-menu-title menu-item"
        onClick={() => props.Action(content.type)}
      >
        <img src={content.icon} alt="menu-icon" /><div className="menu-title menu-item">{content.name}</div>
      </div>)
  }

  const title = () => {
    if(props.icon !== "") return (
      <div
        className="dropdown-menu-title menu-item"
      >
        <img className="menu-title-icon menu-item" src={props.icon} alt="menu-icon" /><div className="menu-title menu-item">{props.title}</div>
      </div>)
    else  return (<div
        className="dropdown-menu-title menu-item"
      >
        <div className="menu-title menu-item">{props.title}</div>
      </div>)
  }

  const Menu = (contents: any) => {
    return (
      <div
        className="dropdown-menu-wrapper menu-item"
        onContextMenu={() => {setToggle(true);document.addEventListener("mousedown", handleClickOutside)}}
        onMouseLeave={() => {setToggle(false)}}
      >
        {title()}
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