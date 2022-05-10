import React, { useRef } from 'react'
import './DBBlock.css'

import { useRecoilState } from 'recoil'
import { DBState } from '../../reicoil/atom';

import { rowMenuItems, colMenuItems } from './DBMenuItems'

type DBStateType = [
  {
    column:{
      name: string
    }[],
    data: string[][],
  },
  any
]

const DB = () => {
  const [DB, setDB] = useRecoilState(DBState) as DBStateType
  const keepDB = useRef(DB)
  
  var rowMenu = -1, colMenu = -1

  var rowMenuRefs = useRef([React.createRef()]) as any
  var dummyRefs:any[] = []
  DB.data.forEach(() => dummyRefs.push(React.createRef()))
  rowMenuRefs.current = dummyRefs

  var colMenuRefs = useRef([React.createRef()]) as any
  dummyRefs = []
  DB.column.forEach(() => dummyRefs.push(React.createRef()))
  colMenuRefs.current = dummyRefs

  var dataRefs = useRef([React.createRef()]) as any
  dummyRefs = []
  DB.data.forEach((row) => {
    var dummyRowRefs:any[] = []
    row.forEach(() => {
      dummyRowRefs.push(React.createRef())
    })
    dummyRefs.push(dummyRowRefs)
  })
  dataRefs.current = dummyRefs

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>, row_index: number, col_index: number) => {
    if(e.key === 'Enter' && e.shiftKey){
      e.preventDefault()
      DBActions('AddRow', row_index)
    }
    if(e.key === 'Enter'){
      e.preventDefault()
      if(row_index < DB.data.length-1) dataRefs.current[row_index+1][col_index].current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, row_index: number, col_index: number) => {
    switch(e.key){
      case('ArrowUp'):
        if(row_index !== 0) dataRefs.current[row_index-1][col_index].current.focus()
        break
      case('ArrowDown'):
        if(row_index < DB.data.length-1) dataRefs.current[row_index+1][col_index].current.focus()
    }
  }

  const handleHeadChange = (e: React.ChangeEvent<HTMLInputElement>, col_index: number) => {
    const element = e.target as HTMLElement
    var newDB = JSON.parse(JSON.stringify(DB)) //Deep Copy
    newDB.column[col_index].name = element.innerText
    console.log(newDB)
    setDB(newDB)
  }

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>, row_index:number, col_index:number) => {
    const element = e.target as HTMLElement
    var newDB = JSON.parse(JSON.stringify(DB)) //Deep Copy
    newDB.data[row_index][col_index] = element.innerText
    setDB(newDB)
  }

  const closeRowMenu = () => {
    const element = rowMenuRefs.current[rowMenu].current as HTMLElement
    element.style.display = 'none'
    rowMenu = -1
    document.removeEventListener("mousedown", handleClickOutside)
  }

  const closeColMenu = () => {
    const element = colMenuRefs.current[colMenu].current as HTMLElement
    element.style.display = 'none'
    colMenu = -1
    document.removeEventListener("mousedown", handleClickOutside)
  }

  const handleClickOutside = (e:MouseEvent) => {
    const target = e.target as Node
    if(rowMenu >= 0){
      if(!rowMenuRefs.current[rowMenu].current.contains(target)){
        closeRowMenu()
      }
    }
    if(colMenu >= 0){
      if(!colMenuRefs.current[colMenu].current.contains(target)){
        closeColMenu()
      }
    }
  }

  const handleRowMenu = (e: React.MouseEvent<HTMLTableDataCellElement>, row_index: number) => {
    e.preventDefault()
    rowMenu = row_index
    const element = rowMenuRefs.current[row_index].current as HTMLElement
    element.style.display = 'block'
    document.addEventListener("mousedown", handleClickOutside)
  }

  const handleColumnMenu = (e: React.MouseEvent<HTMLDivElement>, col_index: number) => {
    e.preventDefault()
    colMenu = col_index
    const element = colMenuRefs.current[col_index].current as HTMLElement
    element.style.display = 'block'
    document.addEventListener("mousedown", handleClickOutside)
  }

  const DBActions = (type: string, index: number) => {
    var newDB = JSON.parse(JSON.stringify(DB)) //Deep Copy
    
    switch(type){
      case('AddRow'):
        const newRow: string[] = new Array(newDB.column.length).fill('')
        newDB.data.splice(index+1, 0, newRow)
        break
      case('RemoveRow'):
        if(newDB.data.length > 1){
          newDB.data.splice(index, 1)
        }
        break
      case('AddColumn'):
        const newCol = {name: ''}
        newDB.column.splice(index+1, 0, newCol)
        newDB.data.map((row:any) => row.splice(index+1, 0, ''))
        break
      case('RemoveColumn'):
        if(newDB.column.length > 1){
          newDB.column.splice(index, 1)
          newDB.data.map((row:any) => row.splice(index, 1))
        }
        break
    }
    setDB(newDB)
    keepDB.current = newDB
  }

  const thead = (
    <thead>
      <tr>
        <td>#</td>
        {keepDB.current.column.map((column, index) => (
          <td
            key={index}
          >
            <div
              className="table-head"
              contentEditable
              dangerouslySetInnerHTML={{__html: column.name}}
              onContextMenu={(e) => handleColumnMenu(e, index)}
              onInput={(e:React.ChangeEvent<HTMLInputElement>) => handleHeadChange(e, index)}
            />
            <div
              ref={colMenuRefs.current[index]}
              className="col-menu"
            >
              {colMenuItems.map(item => (
                <div
                  className="col-menu-item"
                  key={item.name}
                  onClick={() => {DBActions(item.type, index);closeColMenu()}}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </td>
        ))}
        <td />
      </tr>
    </thead>
  )

  const tbody = (
    <tbody>
      {keepDB.current.data.map((row, row_index) => (
        <tr
          className="table-row"
          key={row_index}
        >
          <td
            className="row-index"
            onContextMenu={(e) => handleRowMenu(e, row_index)}
          >
            {row_index}
            <div
              ref={rowMenuRefs.current[row_index]}
              className="row-menu"
            >
              {rowMenuItems.map(item => (
                <div
                  className="row-menu-item"
                  key={item.name}
                  onClick={() => {DBActions(item.type, row_index);closeRowMenu()}}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </td>
          {
            row.map((column, col_index) => (
              <td
                key={col_index}
              >
                <div
                  ref={dataRefs.current[row_index][col_index]}
                  className="table-data"
                  contentEditable
                  dangerouslySetInnerHTML={{__html: column}}
                  onKeyPress={(e) => handleKeyPress(e, row_index, col_index)}
                  onKeyDown={(e) => handleKeyDown(e, row_index, col_index)}
                  onInput={(e:React.ChangeEvent<HTMLInputElement>) => handleDataChange(e, row_index, col_index)}
                />
              </td>
          ))}
          <td />
        </tr>
      ))}
    </tbody>
  )

  return (
    <table>
      {thead}
      {tbody}
    </table>
  )
}

export default DB