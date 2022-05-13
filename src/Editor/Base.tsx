import React, { useEffect, useRef, useState } from "react";
import './base.css'

import LoadedBlocks from './Blocks/blocks_loader'
import Menu from './Menu/Menu'

import { useRecoilValue, useRecoilState } from 'recoil'
import { blocksSelector, focusState, currentPage, menuState, pageListSelector } from './recoil/atom';

import { PageActions, PageListActions } from './recoil/LocalActions'

const BlocksComponents = LoadedBlocks as any

function Base() {
  const [blocks, setBlocks] = useRecoilState(blocksSelector) as [Blocks, any]
  const [focusing, setFocus] = useRecoilState(focusState)

  // Mainly Initialize use
  const [pageList, setPageList] = useRecoilState(pageListSelector) as [PageList, any]
  const currentPageId = useRecoilValue(currentPage)

  const menu = useRecoilValue(menuState)
  const [dragging, setDrag] = useState([-1,0])

  // Initial Load
  useEffect(() => {
    (async () => {
      const newPage = await PageActions('fetch', {id: currentPageId})
      setBlocks(newPage.data)

      setFocus([-1, 1])

      const newPageList = await PageListActions('fetch')
      setPageList(newPageList)
      
      setFocus([-1, 1])
    })()
  }, [])

  const getList = (id: string, pageList: PageList) => {
    var listItem = {title: 'loading', id: 'loading'}
    pageList.forEach((item:any) => {
      if(item.id === id) listItem = item
      else if(listItem.id === 'loading') listItem = getList(id, item.list)
    })
    return listItem
  }

  const getTitle = () => {
    const newList = JSON.parse(JSON.stringify(pageList))
    const listItem = getList(currentPageId, newList)
    return listItem.title
  }

  var currentTitle = useRef(getTitle())

  // Initialize
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

  var menuRefs = useRef([[React.createRef()]]) as any
  menuRefs.current = generateRefs()

  var Refs = useRef([[React.createRef()]]) as any
  Refs.current = generateRefs()

  // forceUpdate
  useEffect(() => {
    if(focusing[0] === -1 && focusing[1] === 1){
      setFocus([-1,0])
      currentTitle.current = getTitle()
    }
  })

  // Actions
  const handleMouseOver = (row_index:number, col_index:number) => {
    if(menu[0] < 0) menuRefs.current[row_index][col_index].current.style.opacity = 1
  }

  const handleMouseLeave = (row_index:number, col_index:number) => {
    if(menu[0] < 0) menuRefs.current[row_index][col_index].current.style.opacity = 0
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const element = e.target as HTMLElement
    if(!element.classList.contains("option-menu-icon")){
      e.preventDefault()
      return
    }

    const id = element.id.split('-')
    setDrag([Number(id[0]), Number(id[1])])
    e.dataTransfer.setDragImage(Refs.current[Number(id[0])][Number(id[1])].current, 0, 0)
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

  const removeBlockAddLine = (dragging: number[], dropping: number[], newBlocks: Blocks) => {
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
  const removeBlock = (dragging: number[], dropping: number[], newBlocks: Blocks) => {
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

  const block = (row_index: number, col_index: number) => {
    const Block = BlocksComponents[blocks[row_index][col_index].type].default
    return (
      <div
        ref = {Refs.current[row_index][col_index]}
        className="col-wrapper"
        key = {row_index + '-' + col_index}
        onMouseOver = {() => handleMouseOver(row_index, col_index)}
        onMouseLeave = {() => handleMouseLeave(row_index, col_index)}
        draggable
        onDragStart={(e) => handleDragStart(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={(e) => handleDragLeave(e)}
        onDrop={(e) => handleDrop(e)}
      >
        <div className="menu-wrapper">
          <Menu
            ref = {menuRefs.current[row_index][col_index]}
            row_index = {row_index}
            col_index = {col_index}
          />
        </div>
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLHeadingElement>) => {
    const element = e.target as HTMLElement
    const newList = JSON.parse(JSON.stringify(pageList))
    const listItem = getList(currentPageId, newList)
    listItem.title = element.innerText
    
    setPageList(newList)
  }

  const title = (
    <h1
      className="title"
      contentEditable
      dangerouslySetInnerHTML={{__html: currentTitle.current}}
      onInput={(e:React.ChangeEvent<HTMLHeadingElement>) => handleTitleChange(e)}
    />)

  var blockComponents = blocks.map((row, row_index) => 
    <div key={row_index} className="row-wrapper">
      {row.map((_, col_index) => {return block(row_index, col_index)})}
    </div>
  )

  return (
    <div className="editor-wrapper">
      {title}
      <div className="editor-left-wrapper" onMouseOver={() => setFocus([-1, 0])}/>
      <div className="editor-right-wrapper" onMouseOver={() => setFocus([-1, 0])}/>
      {blockComponents}
    </div>
  );
}

export default Base