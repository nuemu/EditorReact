import React, { useState } from 'react'

import HoverMenu from '../HoverMenu/HoverMenu'

type Props = {
  title: string, contents: any, Action: any, icon: string, id: string
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
          return <DropDownMenu title={content.name} contents={content.contents} Action={props.Action} icon={content.icon} id="none"/>
        case 'Hover':
          return <HoverMenu title={content.name} contents={content.contents} Action={props.Action} icon={content.icon}/>
      }
    }
    return (
      <div
        className="menu-title menu-item"
        id={props.id}
        onClick={() => props.Action(content.type)}
      >
        <img src={content.icon} alt="menu-icon" /><div className="menu-title menu-item" id={props.id}>{content.name}</div>
      </div>)
  }

  const title = () => {
    if(props.icon !== "") return (
      <div
        className="menu-title menu-item"
        id={props.id}
      >
        <img className="menu-title-icon menu-item" src={props.icon} alt="menu-icon" /><div className="menu-title menu-item" id={props.id}>{props.title}</div>
      </div>)
    else  return (<div
        className="menu-title menu-item"
        id={props.id}
      >
        <div className="menu-title menu-item" id={props.id}>{props.title}</div>
      </div>)
  }

  const Menu = (contents: any) => {
    return (
      <div
        className="menu-wrapper menu-item"
        onContextMenu={(e) => {e.preventDefault();setToggle(true);document.addEventListener("mousedown", handleClickOutside)}}
        onMouseLeave={() => {setToggle(false)}}
      >
        {title()}
        <div
          className={"menu-item menu-contents " + (dropdown ? "active" : "")}
        >
          {contents.map((content:any, index:number) => {
            return <div key={index} className="menu-content menu-item">{Recursion(content)}</div>
          })}
        </div>
      </div>
    )}

  return Menu(props.contents)
}

export default DropDownMenu