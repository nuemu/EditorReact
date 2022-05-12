import React, { forwardRef, useRef } from "react";
import './Menu.css'

import { useRecoilState } from 'recoil'
import { blocksSelector, focusState, menuState } from '../recoil/atom';

import Datas from '../Blocks/BlockDatas'
import { v4 } from 'uuid'

const grid = require('../Assets/grid.svg').default
const plus = require('../Assets/plus.svg').default

type Props = {
  row_index: number,
  col_index: number
}

type Blocks = [{ id: string; type: string; data: { text: string; }; }[][], any]

const Menu = forwardRef((props: Props, ref:any) =>  {
  const [blocks, setBlocks] = useRecoilState(blocksSelector) as Blocks
  const [, setFocus] = useRecoilState(focusState)
  const [, setMenu] = useRecoilState(menuState)

  var addRef = useRef<HTMLDivElement>(null)

  const handleOptionMenu = () => {
    var newBlocks = JSON.parse(JSON.stringify(blocks))
    if(props.col_index > 0) newBlocks[props.row_index].splice(props.col_index, 1)
    else if(props.row_index > 0){
      if(newBlocks[props.row_index].length === 1) newBlocks.splice(props.row_index, 1)
      else newBlocks[props.row_index].splice(props.col_index, 1)
    }
    setBlocks(newBlocks)
    if(props.col_index > 0) handleFocus(props.row_index, props.col_index-1)
    else if(props.row_index > 0) handleFocus(props.row_index-1, props.col_index)
    else handleFocus(0, 0)
  }

  const hideDropDown = () => {
    setMenu([-1, 0])
    const element = addRef!.current!.querySelector('.dropDown') as HTMLElement
    element.style.display = 'none'
    document.removeEventListener("mousedown", handleClickOutside)
  }

  const handleClickOutside = (e:MouseEvent) => {
    const target = e.target as Node
    if (addRef.current && !addRef.current.contains(target)) {
      hideDropDown()
      const element = addRef!.current!.parentNode as HTMLElement
      element!.style.opacity = '0'
    }
  }

  const handleAddMenu = () => {
    setMenu([props.row_index, props.col_index])
    const element = addRef!.current!.querySelector('.dropDown') as HTMLElement
    element.style.display = 'block'
    document.addEventListener("mousedown", handleClickOutside)
  }

  const handleAddBlock = (index:number) => {
    var newBlocks = JSON.parse(JSON.stringify(blocks))
    newBlocks.splice(
      props.row_index+1,
      0,
      [{
        'id': v4(),
        'type': Datas[index].type,
        'data': Datas[index].initial()
      }]
    )
    setBlocks(newBlocks)
    handleFocus(props.row_index+1, 0)
    hideDropDown()
  }

  const handleFocus = (row_index:number, col_index:number) => {
    setFocus([row_index, col_index])
  }

  const addIcons = Datas.map((data, index) => (
    <div className="dropdown-item" key={index} onClick={() => handleAddBlock(index)}>
      <div className="block-icon-wrapper">
        <img src={data.icon} alt="icon" className="block-icon"/>
        &nbsp;
      </div>
      <div className="block-name">{data.name}</div>
    </div>
  ))

  return (
    <div
      className="menu-icons-wrapper"
      ref={ref}
    >
      <div
        className="add-menu"
        ref={addRef}
      >
        <img
          className="menu-icon"
          src={plus}
          alt="menu-icon"
          onClick={() => handleAddMenu()}
        />
        <div
          className="dropDown"
        >
          {addIcons}
        </div>
      </div>

      <div
        className = "option-menu"
      >
        <img
          className="menu-icon option-menu-icon"
          id={props.row_index + '-' + props.col_index}
          src = {grid}
          alt = "menu-icon"
          onClick = {() => handleOptionMenu()}
        />
        <div className="dropDown">
          dropDown
        </div>
      </div>
    </div>
  )
})

export default Menu
