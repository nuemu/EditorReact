import React, { useRef, useState, useEffect } from "react";
import TextBlock from './Blocks/TextBlock/TextBlock'
import './base.css'

import { useRecoilState } from 'recoil'
import blocksState from './reicoil/atom';

function SetCaret(node:Node, caret:number){
  const selection = window.getSelection()!
  var range = document.createRange()
  range.setStart(node, caret)
  selection.removeAllRanges()
  selection.addRange(range)
}

function Base() {
  const [blocks, setBlocks] = useRecoilState(blocksState)
  const new_texts = blocks.blocks.map(row_blocks => row_blocks.map(col_block => col_block.data.text))
  var [texts, setTexts] = useState(new_texts);
  var [change, setChange] = useState(false);
  var [focusing, setFocus] = useState([0,0])

  // refs
  var refs = useRef([[React.createRef()]])
  var refarray:any = []
  texts.forEach(row => {
    var array:any = []
    row.forEach(() => {
      array.push(React.createRef())
    })
    refarray.push(array)
  })
  refs.current = refarray

  useEffect(() => {
    const ref = refs.current[focusing[0]][focusing[1]].current
    const element = ref as HTMLElement
    element.focus()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, row_index:number, col_index:number ) => {
    var newTexts = texts.slice()
    newTexts[row_index][col_index] = e.target.innerText
    setChange(false)
    setTexts(newTexts)
  }

  const handleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>, row_index:number, col_index:number) => {
    var newTexts = texts.slice()

    // Add New TextBlock
    if(e.key==='Enter' && e.shiftKey){
      e.preventDefault()
      
      // Split sentence to 2 by caret
      var target = e.target as HTMLElement

      const range = window.getSelection()!.getRangeAt(0)
      range.insertNode(document.createElement('split'))
      const splitedText = target.innerHTML.split('<split></split>')

      newTexts[row_index][col_index] = splitedText[0]
      newTexts.splice(row_index+1, 0, [splitedText[1]])
      setTexts(newTexts)

      setChange(change = true)
      handleFocus(row_index+1, 0)
    }

    // Tab Space config
    const spaceCount = 2;
    const substitution = Array(spaceCount + 1).join(' ');

    // Remove Tab Space
    if(e.key==='Tab' && e.shiftKey){
      e.preventDefault()

      const selection = window.getSelection()!
      const startNode = selection.anchorNode!
      const caretStart = selection.anchorOffset
      const currentText = startNode.nodeValue!

      if(currentText){
        if(currentText.substring(0, spaceCount) === substitution){
          startNode.nodeValue = currentText.substring(2, currentText.length)
  
          SetCaret(startNode, caretStart - spaceCount)
        }
  
        const target = e.target as HTMLElement
        newTexts[row_index][col_index] = target.innerText
        setTexts(texts = newTexts)
      }
    }

    // Add Tab Space
    else if(e.key==='Tab' && e.keyCode !== 229){
      e.preventDefault()

      const selection = window.getSelection()!
      var startNode = selection.anchorNode!
      const caretStart = selection.anchorOffset
      const currentText = startNode.nodeValue!

      // Trouble With null nodeValue
      if(currentText){
        startNode.nodeValue = substitution + currentText

        SetCaret(startNode, caretStart + spaceCount)
        
        const target = e.target as HTMLElement
        newTexts[row_index][col_index] = target.innerText
        setTexts(texts = newTexts)
      }
    }

    // Remove block when Backspace key down
    if(e.key==='Backspace'){
      const target = e.target as HTMLElement
      if(target.innerText === '' && newTexts.length>1){
        newTexts[row_index].splice(col_index, 1)
        setTexts(texts = newTexts)
        setChange(change = true)
        if(row_index > 0) handleFocus(row_index-1, col_index)
        else handleFocus(0, 0)
      }
      
      // If Caret is on top and leftside join with upper block
      const range = window.getSelection()?.getRangeAt(0)!.getClientRects()[0]
      if(range){
        const targetTop = target.getClientRects()[0].top
        const rangeTop = range.top

        if(Math.abs(targetTop - rangeTop) < 5){
          if(row_index !== 0 && window.getSelection()?.anchorOffset === 0){
            const text = newTexts[row_index][col_index]
            newTexts[row_index-1][col_index] = newTexts[row_index-1][col_index] + text
            newTexts[row_index].splice(col_index, 1)
            setTexts(texts = newTexts)
            setChange(change = true)
            handleFocus(row_index-1, col_index)
          }
        }
      }
    }

    // Move to Upper Block
    if(e.key==='ArrowUp'){
      const target = e.target as HTMLElement
      const range = window.getSelection()?.getRangeAt(0)!.getClientRects()[0]

      if(range){
        const targetTop = target.getClientRects()[0].top
        const rangeTop = range.top

        if(Math.abs(targetTop - rangeTop) < 5){
          if(col_index !== 0) handleFocus(row_index, col_index-1)
          else if(row_index !== 0) handleFocus(row_index-1, texts[row_index-1].length-1)
        }
      }
      else{
        if(row_index !== 0) handleFocus(row_index-1, col_index)
      }
    }

    // Move to Lower Block
    if(e.key==='ArrowDown'){
      const target = e.target as HTMLElement
      const range = window.getSelection()?.getRangeAt(0)!.getClientRects()[0]

      if(range){
        const targetBottom = target.getClientRects()[0].bottom
        const rangeBottom = range.bottom

        if(Math.abs(targetBottom - rangeBottom) < 5){
          if(col_index !== texts[row_index].length-1) handleFocus(row_index, col_index+1)
          else if(row_index !== texts.length-1) handleFocus(row_index+1, 0)
        }
      }
      else{
        if(row_index !== texts.length-1) handleFocus(row_index+1, col_index)
      }
    }
  }

  const handleFocus = (row_index:number, col_index:number) => {
    setFocus([row_index, col_index])
  }
  const block = (row_index: number, col_index: number) => (
    <div className="col-wrapper" key = {row_index + '-' + col_index}>
      <TextBlock
        ref = {refs.current[row_index][col_index]}
        text = {texts[row_index][col_index]}
        index = {row_index}
        change = {change}
        onChange = {(e) => handleChange(e, row_index, col_index)}
        onKeyDown={(e) => handleKeyDown(e, row_index, col_index)}
        onFocus={() => handleFocus(row_index, col_index)}
      />
    </div>
  )

  var blockComponents = texts.map((row, row_index) => 
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
