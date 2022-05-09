import React, { forwardRef, useRef } from "react";
import './Menu.css'

import { useRecoilState } from 'recoil'
import { blocksSelector, focusState } from '../reicoil/atom';

import Loaded from '../Blocks/blocks_loader'

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

  const handleAddMenu = () => {
    addRef!.current!.style.display = 'block'
  }

  const handleFocus = (row_index:number, col_index:number) => {
    setFocus([row_index, col_index])
  }

  const addIcons = Object.keys(Loaded).map(name => <div key={name}>{name}</div>)

  return (
    <div
      className="menu-wrapper"
      ref={ref}
    >
      <div
        className="add-menu"
      >
        <img
          src={plus}
          alt="menu-icon"
          onClick={() => handleAddMenu()}
        />
        <div
          className="dropDown"
          ref={addRef}
        >
          {addIcons}
        </div>
      </div>

      <div
        className = "option-menu"
      >
        <img
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
