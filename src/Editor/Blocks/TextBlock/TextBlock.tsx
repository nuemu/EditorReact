import React, { useEffect, useRef, useState } from "react";
import './TextBlock.css'

import { useRecoilState } from 'recoil'
import { blocksSelector, focusState } from '../../recoil/atom';

import katex from 'katex'
import 'katex/dist/katex.css'

import { marked } from 'marked'
import highlightjs from 'highlight.js'
import 'highlight.js/styles/github-dark-dimmed.css'
import DOMPurify from "dompurify";

const katexRender = (innerText:string) => {
  var newText = innerText

  // display mode true
  var split = innerText.split('$$')
  var newTexts:string[] = []
  if(split.length > 1){
    split.forEach((text, index) => {
      if(index%2 === 1){
        text = text.replaceAll('\n', '')
        newTexts.push(katex.renderToString(text, {displayMode: true}))
      }
      else newTexts.push(text)
    })
    newText = newTexts.join('')
  }

  // display mode false
  split = newText.split('$')
  newTexts = []
  if(split.length > 1){
    split.forEach((text, index) => {
      if(index%2 === 1) newTexts.push(katex.renderToString(text, {displayMode: false}))
      else newTexts.push(text)
    })
    newText = newTexts.join('')
  }

  return newText
}

marked.setOptions({
  langPrefix: 'hljs language-',
  highlight: function(code, lang) {
    return highlightjs.highlightAuto(code, [lang]).value;
  },
  pedantic: false,
  gfm: true,
  breaks: true,
  silent: true
})

function SetCaret(node:Node, caret:number){
  const selection = window.getSelection()!
  var range = document.createRange()
  range.setStart(node, caret)
  selection.removeAllRanges()
  selection.addRange(range)
}

const TextBlock = (props: BlockProps) => {
  const [blocks, setBlocks] = useRecoilState(blocksSelector) as [Blocks, any]
  const [focusing, setFocus] = useRecoilState(focusState)

  const [editing, setEdit] = useState(false)

  var ref = useRef<HTMLDivElement>(null)
  var textRef = useRef(blocks[props.row_index][props.col_index].data.text)

  useEffect(() => {
    if(focusing[0] === props.row_index && focusing[1] === props.col_index) setEdit(true)
    else setEdit(false)
    textRef.current = blocks[props.row_index][props.col_index].data.text
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[focusing])

  useEffect(() => {
    if(editing) ref!.current!!.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing])

  const processedText = (text:string) => {
    const math = katexRender(text)
    return  marked.parse(math)
  }

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
          if(newBlocks[row_index].length === 1) newBlocks.splice(row_index, 1)
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
      const rect = window.getSelection()?.getRangeAt(0)!.getClientRects()[0]

      if(rect){
        const targetTop = ref!.current!.getClientRects()[0].top
        const rangeTop = rect.top
        const range = window.getSelection()?.getRangeAt(0)

        if(Math.abs(targetTop - rangeTop) < 5 && row_index !== 0 && range?.startOffset === 0){
          if(col_index > blocks[row_index-1].length-1) handleFocus(row_index-1, blocks[row_index-1].length-1)
          else handleFocus(row_index-1, col_index)
        }
      }
      else if(ref!.current!.innerText.length === 0 && row_index>0) handleFocus(row_index-1, col_index)
    }

    // Move to Lower Block
    if(e.key==='ArrowDown'){
      const rect = window.getSelection()?.getRangeAt(0)!.getClientRects()[0]

      if(rect){
        const targetBottom = ref!.current!.getClientRects()[0].bottom
        const rangeBottom = rect.bottom
        const range = window.getSelection()?.getRangeAt(0)
        const container = range?.startContainer

        if(Math.abs(targetBottom - rangeBottom) < 5 && row_index !== blocks.length-1 && container?.nodeValue?.length === range?.startOffset){
          if(col_index > blocks[row_index+1].length-1) handleFocus(row_index+1, blocks[row_index+1].length-1)
          else handleFocus(row_index+1, col_index)
        }
      }
      else if(ref!.current!.innerText.length === 0 && row_index < blocks.length-1) handleFocus(row_index+1, col_index)
    }

    // Move to Left Block
    if(e.key==='ArrowLeft'){
      const target = e.target as HTMLElement
      const rect = window.getSelection()?.getRangeAt(0)!.getClientRects()[0]
      const range = window.getSelection()?.getRangeAt(0)
      const targetTop = target.getClientRects()[0].top
      const rectTop = rect?.top || 0
      if(
        Math.abs(targetTop - rectTop) < 5 &&
        range?.startOffset === range?.endOffset &&
        range?.startOffset === 0 &&
        col_index > 0
      ){
        handleFocus(row_index, col_index-1)
      }
    }

    // Move to Right Block
    if(e.key==='ArrowRight'){
      const target = e.target as HTMLElement
      const rect = window.getSelection()?.getRangeAt(0)!.getClientRects()[0]
      const range = window.getSelection()?.getRangeAt(0)
      const container = range?.startContainer
      const targetBottom = target.getClientRects()[0].bottom
      const rectBottom = rect?.bottom || 0
      if(
        Math.abs(targetBottom - rectBottom) < 5 &&
        range?.startOffset === range?.endOffset &&
        container?.nodeValue?.length === range?.startOffset &&
        blocks[row_index].length-1 > col_index
      ){
        handleFocus(row_index, col_index+1)
      }
    }
  }

  const handleFocus = (row_index:number, col_index:number) => {
    setFocus([row_index, col_index])
  }

  if(editing) return (
    <div
      ref={ref}
      className={"text-block"}
      id={"editable-id-"+props.row_index+"-"+props.col_index}
      contentEditable
      dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(textRef.current)}}
      onInput={(e:React.ChangeEvent<HTMLInputElement>) => handleChange(e, props.row_index, props.col_index)}
      onKeyDown={(e:React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, props.row_index, props.col_index)}
      onFocus={() => handleFocus(props.row_index, props.col_index)}
      onMouseOver={() => {setFocus([props.row_index, props.col_index])}}
    />
  )
  
  else return (
    <div
      className={"text-block-viewer"}
      ref={ref}
      dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(processedText(textRef.current))}}
      onClick={() => handleFocus(props.row_index, props.col_index)}
    />
  )
}

export default TextBlock;
