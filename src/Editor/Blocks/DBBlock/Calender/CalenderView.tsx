import React, { useEffect, useState } from 'react'
import './Calender.css'

import { useRecoilState } from 'recoil'
import { DBState } from '../../../reicoil/atom';

import { Week, currentYear, currentMonth, today } from './CalenderSettings'

import ViewMenu from '../Components/ViewMenu/ViewMenu'

type DBStateType = [
  {
    column:{
      name: string,
      property: string
    }[],
    data: any[][],
  },
  any
]

const Calender = () => {
  const [DB, setDB] = useRecoilState(DBState) as DBStateType

  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)

  useEffect(() => {
    var newDB = JSON.parse(JSON.stringify(DB))
    if(DB.column.filter(column => column.property === 'Date').length === 0){
      newDB.column.splice(0, 0, {name: 'Date', property: 'Date'})
      newDB.data.forEach((row:any[]) => {
        row.splice(0, 0, Date.now())
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

  const dayContent = (column:any, row_index:number, col_index:number) => {
    return (
      <div className="date-content" key={row_index+'-'+col_index}>
        {column}
      </div>
    )
  }

  const dayContents = (date: Date) => {
    const index = DB.column.findIndex(column => column.property==='Date')
    if(date && index >= 0){
      const contents = DB.data.filter(row => formatDate(row[index]) === formatDate(date))
      return (
        <div className="date-contents-wrapper">
          {contents.map((row, row_index) => {
            return row.map((column, col_index) => {return col_index !== index ? dayContent(column, row_index, col_index) : null})
          })}
        </div>
    )}
  }

  const dayDiv = (date: Date) => {
    if(date.getFullYear() === currentYear && date.getMonth() === currentMonth && date.getDate() === today) return <div className="date-wrapper today">{date.getDate()}{dayContents(date)}</div>
    if(date.getMonth() !== month) return <div className="date-wrapper not-current-month">{date.getDate()}{dayContents(date)}</div>
    return <div className="date-wrapper">{date.getDate()}{dayContents(date)}</div>
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
        <ViewMenu />
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