import React, { useEffect, useState } from 'react'
import './Calendar.css'

import { v4 } from 'uuid'

import { useRecoilState, useRecoilValue } from 'recoil'
import { blocksSelector, DBSelector } from '../../../recoil/atom';

import ContextDropDownMenu from '../../../Components/Menu/ContextDropDownMenu/ContextDropDownMenu'

import { Week, currentYear, currentMonth, today } from './CalendarSettings'

import ViewMenu from '../Components/ViewMenu/ViewMenu'
import DBElements from '../Components/DBElements_loader.js'
const Elements = DBElements as any

const Calender = (props: BlockProps) => {
  const blocks = useRecoilValue(blocksSelector) as Blocks
  const DBId = blocks[props.row_index][props.col_index].data.id
  const [DB, setDB] = useRecoilState(DBSelector(DBId)) as [Data, any]

  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)

  useEffect(() => {
    var newDB = JSON.parse(JSON.stringify(DB))
    if(DB.column.filter(column => column.property === 'Date').length === 0){
      newDB.column.splice(0, 0, {name: 'Date', property: 'Date'})
      newDB.data.forEach((row:any[]) => {
        row.splice(0, 0, {id: v4(), type:'Date', data: Date.now()})
      })
      setDB(newDB)
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DB])

  const firstDayOfMonth = () => {
    return new Date(year, month, 1)
  }
  
  const generateCalender = () => {
    const calender = new Array(35)
    const firstDay = firstDayOfMonth().getDay()
    for(let i=0; i<35; i++){
      calender[i] = new Date(year, month, i+1-firstDay)
    }
    const calender2d = [];
    while(calender.length) calender2d.push(calender.splice(0,7))
    return calender2d
  }

  const formatDate = (date: Date|number) => {
    // convert unixtime to Date
    if(typeof date == 'number') date = new Date(date)
    if(typeof date == 'string') date = new Date(Number(date))

    const year = date.getFullYear()
    const month = date.getMonth()+1
    const day = date.getDate()
    return year + '/' + month + '/' + day
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, array: number[]) => {
    const element = e.target as HTMLElement
    if(!element.classList.contains("date-content")){
      e.preventDefault()
      return
    }
    e.dataTransfer.clearData()
    e.dataTransfer.setData('id', JSON.stringify(array))
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    const element = e.target as HTMLElement
    if(!element.classList.contains('date-wrapper')) return
    e.preventDefault()
    return
  }
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const element = e.target as HTMLElement
    const date = new Date(element.id).getTime()
    const array = JSON.parse(e.dataTransfer.getData('id'))
    var newDB = JSON.parse(JSON.stringify(DB))

    const index = newDB.data[array[0]].findIndex((column: any) => column.type==='Date')
    newDB.data[array[0]][index].data = date
    setDB(newDB)
  }

  const dayContent = (column:any, row_index:number, col_index:number) => {
    if(column.type === 'Page'){
      return (
        <div
          className="date-content"
          key={row_index+'-'+col_index}
          draggable
          onDragStart={(e) => handleDragStart(e, [row_index, col_index])}
        >
          {renderElement(row_index, col_index)}
        </div>
      )}
    return null
  }

  const dayContents = (date: Date) => {
    const index = DB.column.findIndex(column => column.property==='Date')
    if(date && index >= 0){
      return (
        <div className="date-contents-wrapper">
          {DB.data.map((row, row_index) => {
            if(formatDate(row[index].data) === formatDate(date)){
              return row.map((column, col_index) => {return col_index !== index ? dayContent(column, row_index, col_index) : null})
            }
            return null
          })}
        </div>
    )}
  }

  const dayDiv = (date: Date) => {
    if(date.getFullYear() === currentYear && date.getMonth() === currentMonth && date.getDate() === today){
      return (
        <div
          className="date-wrapper today"
          id={date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e)}
        >
          {date.getDate()}{dayContents(date)}
        </div>)
    }
    if(date.getMonth() !== month){
      return (
        <div
          className="date-wrapper not-current-month"
          id={date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e)}
        >
          {date.getDate()}{dayContents(date)}
        </div>)
    }
    return (
      <div
        className="date-wrapper"
        id={date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e)}
      >
        {date.getDate()}{dayContents(date)}
      </div>)
  }
  
  const setDates = (number: number) => {
    const nextDate = new Date(year, month+number)
    setYear(nextDate.getFullYear())
    setMonth(nextDate.getMonth())
  }

  const thead = (
    <thead>
      <tr>
        {Week.map(day => (
          <td key={day}>{day}</td>
        ))}
      </tr>
    </thead>
  )

  const tbody = (
    <tbody>
      {generateCalender().map((week, index) => (
        <tr key={index}>
          {week.map((day, index) => (
            <td className="date" key={index}>
              {dayDiv(day)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )

  const header = (
    <div className="calender-header">
      <div
        className="calender-header-item left"
      >
        <ViewMenu row_index={props.row_index} col_index={props.col_index}/>
      </div>
      <div className="calender-header-item">
        <button className="change-month-button" onClick={() => setDates(-1)}> &lt; </button>
        &nbsp; {year+'/'+(month+1)}&nbsp;
        <button className="change-month-button" onClick={() => setDates(1)}> &gt; </button>
      </div>
      <div className="calender-header-item right"></div>
    </div>
  )

  return (
    <>
      {header}
      <table>
        {thead}
        {tbody}
      </table>
    </>
  )
}

export default Calender