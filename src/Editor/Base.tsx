import React, { useRef, useEffect } from "react";
import './base.css'

import LoadedBlocks from './Blocks/blocks_loader'

import { useRecoilValue } from 'recoil'
import { blocksSelector, focusState } from './reicoil/atom';

type BlocksState = { id: string; type: string; data: { text: string; }; }[][]

function Base() {
  const blocks = useRecoilValue(blocksSelector) as BlocksState
  const focusing = useRecoilValue(focusState)

  // initialize refs
  var refs = useRef([[React.createRef()]])
  var dummyRefs:any = []
  blocks.forEach(row => {
    var colRefs:any = []
    row.forEach(() => {
      colRefs.push(React.createRef())
    })
    dummyRefs.push(colRefs)
  })
  refs.current = dummyRefs

  useEffect(() => {
    const ref = refs.current[focusing[0]][focusing[1]].current
    const element = ref as HTMLElement
    element.focus()
  },[focusing]);

  const BlocksComponents = LoadedBlocks as any

  const block = (row_index: number, col_index: number) => {
    const Block = BlocksComponents[blocks[row_index][col_index].type].default
    return (
    <div className="col-wrapper" key = {row_index + '-' + col_index}>
      <Block
        ref = {refs.current[row_index][col_index]}
        row_index = {row_index}
        col_index = {col_index}
      />
    </div>
  )}

  var blockComponents = blocks.map((row, row_index) => 
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
