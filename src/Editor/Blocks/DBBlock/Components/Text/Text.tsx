import React, { useEffect, useRef, useState } from 'react'

import { useRecoilState, useRecoilValue } from 'recoil'
import { DBSelector, blockSelector } from '../../../../recoil/atom';

import './Text.css'

type Props = {
  row_index: number
  col_index: number
  base_row_index: number
  base_col_index: number
}

const TextElement = (props: Props) => {
  const block = useRecoilValue(blockSelector({row_index: props.base_row_index, col_index: props.base_col_index})) as Block
  const DBId = block.data.id
  const [DB, setDB] = useRecoilState(DBSelector(DBId)) as [Data, any]

  const text = useRef(DB.data[props.row_index][props.col_index].data)
  const [focusing, setFocus] = useState(false)

  useEffect(() => {
    if(!focusing) text.current = DB.data[props.row_index][props.col_index].data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DB])

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>, row_index:number, col_index:number) => {
    const element = e.target as HTMLElement
    var newDB = JSON.parse(JSON.stringify(DB))
    newDB.data[row_index][col_index].data = element.innerText
    setDB(newDB)
  }

  return (
    <div
      className="table-data-text"
      contentEditable
      dangerouslySetInnerHTML={{__html: text.current}}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
      onInput={(e:React.ChangeEvent<HTMLInputElement>) => handleDataChange(e, props.row_index, props.col_index)}
    />)
}

export default TextElement