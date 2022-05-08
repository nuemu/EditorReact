import React, { forwardRef, useEffect, useRef } from "react";
import './TextBlock.css'

import { useRecoilState } from 'recoil'
import { blocksSelector, focusState } from '../../reicoil/atom';

type Props = {
  row_index: number
  col_index: number
}

type Blocks = [{ id: string; type: string; data: { text: string; }; }[][], any]

function SetCaret(node:Node, caret:number){
  const selection = window.getSelection()!
  var range = document.createRange()
  range.setStart(node, caret)
  selection.removeAllRanges()
  selection.addRange(range)
}

const TextBlock = forwardRef((props: Props, ref:any) => {
  const [blocks, setBlocks] = useRecoilState(blocksSelector) as Blocks
  const [focusing, setFocus] = useRecoilState(focusState)

  var textRef = useRef(blocks[props.row_index][props.col_index].data.text)

  useEffect(() => {
    textRef.current = blocks[props.row_index][props.col_index].data.text
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[focusing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, row_index:number, col_index:number ) => {
    var newBlocks = JSON.parse(JSON.stringify(blocks)) //Deep Copy
    newBlocks[row_index][col_index].data.text = e.target.innerText
    setBlocks(newBlocks)
  }

  const handleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>, row_index:number, col_index:number) => {
    var newBlocks = JSON.parse(JSON.stringify(blocks)) //Deep Copy

    // Add New TextBlock
    if(e.key==='Enter' && e.shiftKey){
      e.preventDefault()
      
      // Split sentence to 2 by caret
      var target = e.target as HTMLElement

      const range = window.getSelection()!.getRangeAt(0)
      range.insertNode(document.createElement('split'))
      const splitedText = target.innerHTML.split('<split></split>')
      target.innerHTML = splitedText[0]

      newBlocks[row_index][col_index].data.text = splitedText[0]
      newBlocks.splice(row_index+1, 0, [{id: 'a', type: 'Text', data: {text: splitedText[1]}}])
      setBlocks(newBlocks)

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
        newBlocks[row_index][col_index].data.text = target.innerText
        setBlocks(newBlocks)
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
        newBlocks[row_index][col_index].data.text = target.innerText
        setBlocks(newBlocks)
      }
    }

    // Remove block when Backspace key down
    if(e.key==='Backspace'){
      const target = e.target as HTMLElement
      if(target.innerText === ''){
        if(col_index > 0) newBlocks[row_index].splice(col_index, 1)
        else if(row_index > 0){
          if(newBlocks[row_index].length === 0) newBlocks.splice(row_index, 1)
          else newBlocks[row_index].splice(col_index, 1)
        }
        setBlocks(newBlocks)
        if(col_index > 0) handleFocus(row_index, col_index-1)
        else if(row_index > 0) handleFocus(row_index-1, col_index)
        else handleFocus(0, 0)
      }
      
      // If Caret is on top and leftside join with upper block
      const range = window.getSelection()?.getRangeAt(0)!.getClientRects()[0]
      if(range){
        const targetTop = target.getClientRects()[0].top
        const rangeTop = range.top

        if(
          Math.abs(targetTop - rangeTop) < 5 &&
          window.getSelection()?.anchorOffset === window.getSelection()?.focusOffset &&
          window.getSelection()?.anchorOffset === 0
        ){
          if(col_index !== 0){
            const text = newBlocks[row_index][col_index].data.text
            newBlocks[row_index][col_index-1].data.text = newBlocks[row_index][col_index-1].data.text + text
            newBlocks[row_index].splice(col_index, 1)
            setBlocks(newBlocks)
            handleFocus(row_index, col_index-1)
          }
          else if(row_index !== 0){
            const text = newBlocks[row_index][col_index].data.text
            newBlocks[row_index-1][col_index].data.text = newBlocks[row_index-1][col_index].data.text + text
            newBlocks[row_index].splice(col_index, 1)
            setBlocks(newBlocks)
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
          else if(row_index !== 0) handleFocus(row_index-1, blocks[row_index-1].length-1)
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
          if(col_index !== blocks[row_index].length-1) handleFocus(row_index, col_index+1)
          else if(row_index !== blocks.length-1) handleFocus(row_index+1, 0)
        }
      }
      else{
        if(row_index !== blocks.length-1) handleFocus(row_index+1, col_index)
      }
    }
  }

  const handleFocus = (row_index:number, col_index:number) => {
    setFocus([row_index, col_index])
  }

  return (
    <div
      ref={ref}
      className={"text-block"}
      id={"editable-id-"+props.row_index+"-"+props.col_index}
      contentEditable
      dangerouslySetInnerHTML={{ __html: textRef.current}}
      onInput={(e:React.ChangeEvent<HTMLInputElement>) => handleChange(e, props.row_index, props.col_index)}
      onKeyDown={(e:React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, props.row_index, props.col_index)}
      onFocus={() => handleFocus(props.row_index, props.col_index)}
    />
  );
})

export default TextBlock;
