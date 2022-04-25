import React, {useCallback} from "react";
import './TextBlock.css'

type Props = {
  text: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyPress: (event:React.KeyboardEvent<HTMLDivElement>) => void
}

function TextBlock(props: Props) {
  const text = useCallback(
    (props: Props) => {return props.text}, []
  )

  return (
    <div
      className="text-block"
      contentEditable
      dangerouslySetInnerHTML={{ __html: text(props)}}
      onInput={(e:React.ChangeEvent<HTMLInputElement>) => props.onChange(e)}
      onKeyPress={(e:React.KeyboardEvent<HTMLDivElement>) => props.onKeyPress(e)}
    />
  );
}

export default TextBlock;
