import React, { useState } from "react";
import TextBlock from './Blocks/TextBlock/TextBlock'

function Base() {
  var [texts, setTexts] = useState(["Sample Text1","Sample Text2"]);
  var [change, setChange] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index:number ) => {
    var newTexts = texts.slice()
    newTexts[index] = e.target.innerHTML
    setChange(false)
    setTexts(texts = newTexts)
  }
  const handleKeyPress = (e:React.KeyboardEvent<HTMLDivElement>, index:number) => {
    if(e.key==='Enter' && e.shiftKey){
      e.preventDefault()
      var newTexts = texts.slice()
      newTexts.splice(index+1, 0, 'Sample Text'+(texts.length+1))
      setTexts(texts = newTexts)
      setChange(change = true)
    }
  }
  const block = (index: number) => (
    <TextBlock
      text = {texts[index]}
      change = {change}
      onChange = {(e) => handleChange(e, index)}
      onKeyPress={(e) => handleKeyPress(e, index)}
    />
  )
  var blocks = texts.map(((text, index) => <div key={index} className="block-wrapper">{block(index)}</div>))

  return (
    <div className="base-wrapper">
      {blocks}
    </div>
  );
}

export default Base;
