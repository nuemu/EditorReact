import React, { useRef, useState, useEffect } from "react";
import TextBlock from './Blocks/TextBlock/TextBlock'
import './base.css'

function SetCaret(node:Node, caret:number){
  const selection = window.getSelection()!
  var range = document.createRange()
  range.setStart(node, caret)
  selection.removeAllRanges()
  selection.addRange(range)
}

function Base() {
  var [texts, setTexts] = useState(['']);
  var [change, setChange] = useState(false);
  var [focusing, setFocus] = useState(0);

  // refs
  var refs = useRef([React.createRef()])
  texts.forEach((_, index) => {
    refs.current[index] = React.createRef()
  })
  useEffect(() => {
    const ref = refs.current[focusing].current
    const element = ref as HTMLElement
    element.focus()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index:number ) => {
    var newTexts = texts.slice()
    newTexts[index] = e.target.innerText
    setChange(false)
    setTexts(texts = newTexts)
  }

  const handleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>, index:number) => {
    var newTexts = texts.slice()

    // Add New TextBlock
    if(e.key==='Enter' && e.shiftKey){
      e.preventDefault()
      newTexts.splice(index+1, 0, '')
      setTexts(texts = newTexts)
      setChange(change = true)
      handleFocus(index+1)
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
        newTexts[index] = target.innerText
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
        newTexts[index] = target.innerText
        setTexts(texts = newTexts)
      }
    }

    // Remove block when Backspace key down
    if(e.key==='Backspace'){
      const target = e.target as HTMLElement
      if(target.innerText === '' && newTexts.length>1){
        newTexts.splice(index, 1)
        setTexts(texts = newTexts)
        setChange(change = true)
        if(index > 0) handleFocus(index-1)
        else handleFocus(0)
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
          if(index !== 0) handleFocus(index-1)
        }
      }
      else{
        if(index !== 0) handleFocus(index-1)
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
          if(index !== texts.length-1) handleFocus(index+1)
        }
      }
      else{
        if(index !== texts.length-1) handleFocus(index+1)
      }
    }

  }
  const handleFocus = (index:number) => {
    setFocus(focusing = index)
  }
  const block = (index: number) => (
    <TextBlock
      ref = {refs.current[index]}
      text = {texts[index]}
      index = {index}
      change = {change}
      onChange = {(e) => handleChange(e, index)}
      onKeyDown={(e) => handleKeyDown(e, index)}
      onFocus={() => handleFocus(index)}
    />
  )
  var blocks = texts.map(((text, index) => <div key={index} className={"block-wrapper-"+index}>{block(index)}</div>))

  return (
    <div className="base-wrapper">
      {blocks}
    </div>
  );
}

export default Base;
