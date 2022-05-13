import React, { useEffect, useRef, useState } from 'react'
import './Table.css'

import { useRecoilState, useRecoilValue } from 'recoil'
import { DBSelector, blocksSelector } from '../../../recoil/atom';

import { rowMenuItems, colMenuItems } from './TableMenuItems'

import ViewMenu from '../Components/ViewMenu/ViewMenu'
import { Properties } from '../DBConstants'

import DBElements from '../Components/DBElements_loader.js'
import { v4 } from 'uuid';

const Property = Properties as any
const Elements = DBElements as any

const Table = (props: BlockProps) => {
  const blocks = useRecoilValue(blocksSelector) as Blocks

  const DBId = blocks[props.row_index][props.col_index].data.id
  const [DB, setDB] = useRecoilState(DBSelector(DBId)) as [Data, any]
  const keepDB = useRef(DB)

  useEffect(() => {
    var newDB = JSON.parse(JSON.stringify(DB)) //Deep Copy
    if(DB.column.length === 0){
      const newCol = {name: '', property: 'Text'}
      newDB.column.splice(0, 0, newCol)
      newDB.data.map((row:any) => row.splice(0, 0, ''))
      setDB(newDB)
      keepDB.current = newDB
    }
    if(DB.data.length === 0){
      const newRow = generateRow(newDB)
      newDB.data.splice(0, 0, newRow)
      setDB(newDB)
      keepDB.current = newDB
    }
  }, [DB])

  const [rowSelect, setRowSelect] = useState(new Array(DB.data.length).fill(''))
  const [Menu, setMenu] = useState([-1,-1])

  var rowMenuRefs = useRef([React.createRef()]) as any
  rowMenuRefs.current = keepDB.current.data.map(() => React.createRef())

  var colMenuRefs = useRef([React.createRef()]) as any
  colMenuRefs.current = keepDB.current.column.map(() => React.createRef())

  var dataRefs = useRef([React.createRef()]) as any
  var dummyRefs:any = []
  keepDB.current.data.forEach((row) => {
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
      TableActions('AddRow', row_index)
    }
  }

  const handleHeadChange = (e: React.ChangeEvent<HTMLInputElement>, col_index: number) => {
    const element = e.target as HTMLElement
    var newDB = JSON.parse(JSON.stringify(DB)) //Deep Copy
    newDB.column[col_index].name = element.innerText
    setDB(newDB)
  }

  const closeMenu = () => {
    setMenu([-1, -1])
    document.removeEventListener("mousedown", handleClickOutside)
  }

  const handleClickOutside = (e:MouseEvent) => {
    const target = e.target as HTMLElement
    if(!(
      target.classList.contains('row-menu-item') ||
      target.classList.contains('col-menu-item')
    )) closeMenu()
  }

  const handleRowMenu = (e: React.MouseEvent<HTMLDivElement>, row_index: number) => {
    e.preventDefault()
    setMenu([row_index, -1])
    document.addEventListener("mousedown", handleClickOutside)

    if(rowSelect.filter(row => row==='active').length < 2){
      var select:string[] = new Array(DB.data.length).fill('')
      select[row_index] = 'active'
      setRowSelect(select)
    }
  }

  const handleColumnMenu = (e: React.MouseEvent<HTMLDivElement>, col_index: number) => {
    e.preventDefault()
    setMenu([-1, col_index])
    document.addEventListener("mousedown", handleClickOutside)
  }

  const generateRow = (newDB: Data) => {
    return newDB.column.map(item => {const data = {id: v4(), type: item.property, data: Property[item.property].initialData}; return data})
  }

  const TableActions = (type: string, index: number) => {
    var newDB = JSON.parse(JSON.stringify(DB)) //Deep Copy
    
    switch(type){
      case('AddRow'):
        const newRow = generateRow(newDB)
        newDB.data.splice(index+1, 0, newRow)
        break
      case('RemoveRow'):
        const startIndex = rowSelect.findIndex(row => row==='active')
        const count = rowSelect.filter(row => row==='active').length
        newDB.data.splice(startIndex, count)
        break
      case('AddColumn'):
        const newCol = {name: '', property: 'Text'}
        newDB.column.splice(index+1, 0, newCol)
        newDB.data.map((row:any) => row.splice(index+1, 0, ''))
        break
      case('RemoveColumn'):
        newDB.column.splice(index, 1)
        newDB.data.map((row:any) => row.splice(index, 1))
        break
    }
    setDB(newDB)
    keepDB.current = newDB
  }

  const handleRowSelect = (e: React.MouseEvent<HTMLDivElement>,row_index: number) => {
    var select:string[] = new Array(DB.data.length).fill('')
    if(e.shiftKey){
      select = JSON.parse(JSON.stringify(rowSelect))
      const selectedIndex = select.findIndex(row => row==='active')
      if(selectedIndex >=0 ){
        select = select.map((row, index) => {
          if(row_index < selectedIndex){
            if(row_index <= index && index <= selectedIndex) return 'active'
            else return ''
          }
          else{
            if(row_index >= index && index >= selectedIndex) return 'active'
            else return ''
          }
        })
      }
    }
    if(rowSelect[row_index] !== 'active') select[row_index] = 'active'
    else select[row_index] = ''
    setRowSelect(select)
  }

  const isSelectedRowMenu = (row_index:number) => {
    return row_index === Menu[0]
  }

  const isSelectedColwMenu = (col_index:number) => {
    return col_index === Menu[1]
  }

  const renderElement = (row_index:number, col_index: number) => {
    const Element = Elements[DB.column[col_index].property].default
    return (
      <Element
        row_index={row_index}
        col_index={col_index}
        base_row_index={props.row_index}
        base_col_index={props.col_index}
      />)
  }

  const thead = (
    <thead>
      <tr>
        <td
          className="anchor"
        >
          <ViewMenu row_index={props.row_index} col_index={props.col_index}/>
        </td>
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
              className={isSelectedColwMenu(index) ? "col-menu active": "col-menu"}
            >
              {colMenuItems.map(item => (
                <div
                  className="col-menu-item"
                  key={item.name}
                  onClick={() => {TableActions(item.type, index);closeMenu()}}
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
          className={"table-row "+rowSelect[row_index]}
          key={keepDB.current.id+"-"+row_index}
        >
          <td className="row-index-wrapper">
            <div
              className="row-index"
              onClick={(e) => handleRowSelect(e, row_index)}
              onContextMenu={(e) => handleRowMenu(e, row_index)}
            >
              {row_index}
            </div>
            
            <div
              ref={rowMenuRefs.current[row_index]}
              className={isSelectedRowMenu(row_index) ? "row-menu active" : "row-menu"}
            >
              {rowMenuItems.map(item => (
                <div
                  className="row-menu-item"
                  key={item.type}
                  onClick={() => {TableActions(item.type, row_index);closeMenu()}}
                >
                  {item.name(rowSelect.filter(row => row==='active').length > 1)}
                </div>
              ))}
            </div>
          </td>
          {
            row.map((_, col_index) => (
              <td
                key={keepDB.current.id+"-"+col_index}
              >
                <div
                  ref={dataRefs.current[row_index][col_index]}
                  className="table-data-wrapper"
                  onKeyPress={(e) => handleKeyPress(e, row_index, col_index)}
                >
                  {renderElement(row_index, col_index)}
                </div>
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

export default Table