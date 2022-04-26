import React, { forwardRef, useRef } from "react";
import './TextBlock.css'

type Props = {
  text: string
  index: number
  change: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (event:React.KeyboardEvent<HTMLDivElement>) => void
  onFocus: () => void
}

const TextBlock = forwardRef((props: Props, ref:any) => {
  var textRef = useRef(props.text)
  if(props.change) textRef.current = props.text

  return (
    <div
      ref={ref}
      className={"text-block"}
      id={"editable-id-"+props.index}
      contentEditable
      dangerouslySetInnerHTML={{ __html: textRef.current}}
      onInput={(e:React.ChangeEvent<HTMLInputElement>) => props.onChange(e)}
      onKeyDown={(e:React.KeyboardEvent<HTMLDivElement>) => props.onKeyDown(e)}
      onFocus={() => props.onFocus()}
    />
  );
})

export default TextBlock;
