import React, { useEffect, useRef, useState } from 'react'
import './Table.css'

import { useRecoilState } from 'recoil'
import { DBState } from '../../../reicoil/atom';

import { rowMenuItems, colMenuItems } from './TableMenu'
import { viewMenuItems } from '../DBViews'

type DBStateType = [
  {
    id: string
    view: string,
    column:{
      name: string
    }[],
    data: string[][],
  },
  any
]

const Table = () => {
  const [DB, setDB] = useRecoilState(DBState) as DBStateType
  const keepDB = useRef(DB)

  useEffect(() => {
    var newDB = JSON.parse(JSON.stringify(DB)) //Deep Copy
    if(DB.column.length === 0){
      const newCol = {name: '', property: 'text'}
      newDB.column.splice(0, 0, newCol)
      newDB.data.map((row:any) => row.splice(0, 0, ''))
      setDB(newDB)
      keepDB.current = newDB
    }
    if(DB.data.length === 0){
      const newRow: string[] = new Array(newDB.column.length).fill('')
      newDB.data.splice(0, 0, newRow)
      setDB(newDB)
      keepDB.current = newDB
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DB])

  const [rowSelect, setRowSelect] = useState(new Array(DB.data.length).fill(''))
  const [Menu, setMenu] = useState([-1,-1])

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
      TableActions('AddRow', row_index)
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
    setDB(newDB)
  }

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>, row_index:number, col_index:number) => {
    const element = e.target as HTMLElement
    var newDB = JSON.parse(JSON.stringify(DB)) //Deep Copy
    newDB.data[row_index][col_index] = element.innerText
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
      target.classList.contains('col-menu-item') ||
      target.classList.contains('view-menu-item')
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

  const TableActions = (type: string, index: number) => {
    var newDB = JSON.parse(JSON.stringify(DB)) //Deep Copy
    
    switch(type){
      case('AddRow'):
        const newRow: string[] = new Array(newDB.column.length).fill('')
        newDB.data.splice(index+1, 0, newRow)
        break
      case('RemoveRow'):
        const startIndex = rowSelect.findIndex(row => row==='active')
        const count = rowSelect.filter(row => row==='active').length
        newDB.data.splice(startIndex, count)
        break
      case('AddColumn'):
        const newCol = {name: '', property: 'text'}
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

  const isSelectedViewMenu = () => {
    return Menu.length === 3
  }

  const handleViewMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setMenu([-1, -1, 1])
    document.addEventListener("mousedown", handleClickOutside)
  }

  const handleView = (view_name: string) => {
    var newDB = JSON.parse(JSON.stringify(DB))
    newDB.view = view_name
    setDB(newDB)
  }

  const thead = (
    <thead>
      <tr>
        <td
          className="anchor"
          onClick={(e) => handleViewMenu(e)}
        >
          #
          <div
            className={isSelectedViewMenu() ? "view-menu active" : "view-menu"}
          >
            <div className="view-menu-header">View Menu</div>
            {viewMenuItems.map(item => (
              <div
                className="view-menu-item"
                key={item.name}
                onClick={() => {handleView(item.type)}}
              >
                {item.name}
              </div>
            ))}
          </div>
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
          key={row_index}
        >
          <td>
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

export default Table