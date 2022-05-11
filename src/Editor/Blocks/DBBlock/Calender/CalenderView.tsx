import React, { useEffect, useState } from 'react'
import './Calender.css'

import { useRecoilState } from 'recoil'
import { DBState } from '../../../reicoil/atom';

import { Week } from './CalenderSettings'

import { viewMenuItems } from '../DBViews'

type DBStateType = [
  {
    column:{
      name: string
    }[],
    data: string[][],
  },
  any
]

const Calender = () => {
  const [DB, setDB] = useRecoilState(DBState) as DBStateType

  const thisYear = new Date().getFullYear()
  const thisMonth = new Date().getMonth()
  const thisDate = new Date().getDate()

  const [year, setYear] = useState(thisYear)
  const [month, setMonth] = useState(thisMonth)

  const [Menu, setMenu] = useState(0)

  useEffect(() => {
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

  const dayDiv = (date: Date) => {
    if(date.getFullYear() === thisYear && date.getMonth() === thisMonth && date.getDate() === thisDate) return <div className="date-wrapper today">{date.getDate()}</div>
    if(date.getMonth() !== month) return <div className="date-wrapper not-this-month">{date.getDate()}</div>
    return <div className="date-wrapper">{date.getDate()}</div>
  }
  
  const setDates = (number: number) => {
    const nextDate = new Date(year, month+number)
    setYear(nextDate.getFullYear())
    setMonth(nextDate.getMonth())
  }

  const closeMenu = () => {
    document.removeEventListener("mousedown", handleClickOutside)
    setMenu(0)
  }

  const handleClickOutside = (e:MouseEvent) => {
    const target = e.target as HTMLElement
    if(!(
      target.classList.contains('view-menu-item')
    )) closeMenu()
  }

  const handleViewMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setMenu(1)
    document.addEventListener("mousedown", handleClickOutside)
  }

  const handleView = (view_name: string) => {
    var newDB = JSON.parse(JSON.stringify(DB))
    newDB.view = view_name
    setDB(newDB)
  }

  const isSelectedViewMenu = () => {
    return Menu === 1
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