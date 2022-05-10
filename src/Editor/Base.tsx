import React, { useEffect, useRef, useState } from "react";
import './base.css'

import LoadedBlocks from './Blocks/blocks_loader'
import Menu from './Menu/Menu'

import { useRecoilValue, useRecoilState } from 'recoil'
import { blocksSelector, focusState, menuState } from './reicoil/atom';

type BlocksState = [{ id: string; type: string; data: { text: string; }; }[][], any]

function Base() {
  const [blocks, setBlocks] = useRecoilState(blocksSelector) as BlocksState
  const [focusing, setFocus] = useRecoilState(focusState)

  const menu = useRecoilValue(menuState)

  const [dragging, setDrag] = useState([-1,0])

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
  var menuRefs = useRef([[React.createRef()]]) as any
  menuRefs.current = generateRefs()

  useEffect(() => {
    if(focusing[0] === -1 && focusing[1] === 1)setFocus([-1,0])
  })

  const handleMouseOver = (row_index:number, col_index:number) => {
    if(menu[0] < 0) menuRefs.current[row_index][col_index].current.style.opacity = 1
  }

  const handleMouseLeave = (row_index:number, col_index:number) => {
    if(menu[0] < 0) menuRefs.current[row_index][col_index].current.style.opacity = 0
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const element = e.target as HTMLElement
    if(element.classList.contains('col_wrapper')) return
    const id = element.id.split('-')
    setDrag([Number(id[0]), Number(id[1])])
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    const element = e.target as HTMLElement
    if(!element.classList.contains('dragArea')) return
    element.classList.add('active')
    e.preventDefault()
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const element = e.target as HTMLElement
    if(!element.classList.contains('dragArea')) return
    element.classList.remove('active')
  }

  const removeBlockAddLine = (dragging: number[], dropping: number[], newBlocks: BlocksState[0]) => {
    // Add new line upside of the removing block?
    if(dragging[0] > dropping[0]){
      if(newBlocks[dragging[0]+1].length > 1) newBlocks[dragging[0]+1].splice(dragging[1], 1)
      else newBlocks.splice(dragging[0]+1, 1)
    }
    else{
      if(newBlocks[dragging[0]].length > 1) newBlocks[dragging[0]].splice(dragging[1], 1)
      else newBlocks.splice(dragging[0], 1)
    }
    return newBlocks
  }
  const removeBlock = (dragging: number[], dropping: number[], newBlocks: BlocksState[0]) => {
    if(dragging[0] === dropping[0]){
      if(dragging[1] > dropping[1]) newBlocks[dragging[0]].splice(dragging[1]+1, 1)
      else newBlocks[dragging[0]].splice(dragging[1], 1)
    }
    else{
      if(newBlocks[dragging[0]].length > 1) newBlocks[dragging[0]].splice(dragging[1], 1)
      else newBlocks.splice(dragging[0], 1)
    }
    return newBlocks
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const element = e.target as HTMLElement
    if(!element.classList.contains('dragArea')) return

    if(dragging[0] >= 0){
      element.classList.remove('active')
      var newBlocks = JSON.parse(JSON.stringify(blocks))
      const id = element.id.split('-')
      const dropping = [Number(id[0]), Number(id[1])]

      const classList = element.classList
      switch(true){
        case classList.contains('top'):
          newBlocks.splice(dropping[0], 0, [newBlocks[dragging[0]][dragging[1]]])
          newBlocks = removeBlockAddLine(dragging, dropping, newBlocks)
          break
        case classList.contains('bottom'):
          newBlocks.splice(dropping[0]+1, 0, [newBlocks[dragging[0]][dragging[1]]])
          newBlocks = removeBlockAddLine(dragging, dropping, newBlocks)
          break
        case classList.contains('left'):
          newBlocks[dropping[0]].splice(dropping[1], 0, newBlocks[dragging[0]][dragging[1]])
          newBlocks = removeBlock(dragging, dropping, newBlocks)
          break
        case classList.contains('right'):
          newBlocks[dropping[0]].splice(dropping[1]+1, 0, newBlocks[dragging[0]][dragging[1]])
          newBlocks = removeBlock(dragging, dropping, newBlocks)
          break
      }
      setBlocks(newBlocks)
      setFocus([-1, 1])
      setDrag([-1,0])
    }
  }

  const BlocksComponents = LoadedBlocks as any

  const block = (row_index: number, col_index: number) => {
    const Block = BlocksComponents[blocks[row_index][col_index].type].default
    return (
    <div
      className="col-wrapper"
      id={row_index + '-' + col_index}
      key = {row_index + '-' + col_index}
      onMouseOver = {() => handleMouseOver(row_index, col_index)}
      onMouseLeave = {() => handleMouseLeave(row_index, col_index)}
      draggable
      onDragStart={(e) => handleDragStart(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={(e) => handleDragLeave(e)}
      onDrop={(e) => handleDrop(e)}
    >
      <Menu
        ref = {menuRefs.current[row_index][col_index]}
        row_index = {row_index}
        col_index = {col_index}
      />
      <div className="block-wrapper">
        <Block
          row_index = {row_index}
          col_index = {col_index}
        />
        <div className="dragArea top" id={row_index+'-'+col_index}/>
        <div className="dragArea bottom" id={row_index+'-'+col_index}/>
        <div className="dragArea left" id={row_index+'-'+col_index}/>
        <div className="dragArea right" id={row_index+'-'+col_index}/>
      </div>
    </div>
  )}

  var blockComponents = blocks.map((row, row_index) => 
    <div key={row_index} className="row-wrapper">
      {row.map((_, col_index) => {return block(row_index, col_index)})}
    </div>
  )

  return (
    <div className="editor-wrapper">
      <div className="editor-left-wrapper" onMouseOver={() => setFocus([-1, 0])}/>
      <div className="editor-right-wrapper" onMouseOver={() => setFocus([-1, 0])}/>
      {blockComponents}
    </div>
  );
}

export default Base
