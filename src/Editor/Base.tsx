import React, { useRef, useEffect, useState } from "react";
import './base.css'

import LoadedBlocks from './Blocks/blocks_loader'
import Menu from './Menu/Menu'

import { useRecoilState, useRecoilValue } from 'recoil'
import { blocksSelector, focusState, menuState } from './reicoil/atom';

type BlocksState = { id: string; type: string; data: { text: string; }; }[][]

function Base() {
  const blocks = useRecoilValue(blocksSelector) as BlocksState
  const focusing = useRecoilValue(focusState)

  const [menu, setMenu] = useRecoilState(menuState)

  const generateRefs = () => {
    var dummyRefs:any = []
    blocks.forEach(row => {
      var dummyColRefs:any = []
      row.forEach(() => {
        dummyColRefs.push(React.createRef())
      })
      dummyRefs.push(dummyColRefs)
    })
    return dummyRefs
  }

  // initialize refs
  var refs = useRef([[React.createRef()]])
  refs.current = generateRefs()

  var menuRefs = useRef([[React.createRef()]]) as any
  menuRefs.current = generateRefs()

  useEffect(() => {
    if(focusing[0] > 0){
      const ref = refs.current[focusing[0]][focusing[1]].current
      const element = ref as HTMLElement
      element.focus()
    }
  },[focusing]);

  const handleMouseOver = (row_index:number, col_index:number) => {
    menuRefs.current[row_index][col_index].current.style.opacity = 1
  }

  const handleMouseLeave = (row_index:number, col_index:number) => {
    menuRefs.current[row_index][col_index].current.style.opacity = 0
  }

  const BlocksComponents = LoadedBlocks as any

  const block = (row_index: number, col_index: number) => {
    const Block = BlocksComponents[blocks[row_index][col_index].type].default
    return (
    <div
      className="col-wrapper"
      key = {row_index + '-' + col_index}
      onMouseOver = {() => handleMouseOver(row_index, col_index)}
      onMouseLeave = {() => handleMouseLeave(row_index, col_index)}
    >
      <Menu
        ref = {menuRefs.current[row_index][col_index]}
        row_index = {row_index}
        col_index = {col_index}
      />
      <Block
        ref = {refs.current[row_index][col_index]}
        row_index = {row_index}
        col_index = {col_index}
      />
    </div>
  )}

  var blockComponents = blocks.map((row, row_index) => 
    <div key={row_index} className="row-wrapper">
      {row.map((_, col_index) => {return block(row_index, col_index)})}
    </div>
  )

  return (
    <div className="base-wrapper">
      {blockComponents}
    </div>
  );
}

export default Base
