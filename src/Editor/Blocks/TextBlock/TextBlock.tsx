import React, {useRef} from "react";
import './TextBlock.css'

type Props = {
  text: string
  change: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyPress: (event:React.KeyboardEvent<HTMLDivElement>) => void
}

function TextBlock(props: Props) {
  var textRef = useRef(props.text)
  if(props.change) textRef.current = props.text

  return (
    <div
      className="text-block"
      contentEditable
      dangerouslySetInnerHTML={{ __html: textRef.current}}
      onInput={(e:React.ChangeEvent<HTMLInputElement>) => props.onChange(e)}
      onKeyPress={(e:React.KeyboardEvent<HTMLDivElement>) => props.onKeyPress(e)}
    />
  );
}

export default TextBlock;
