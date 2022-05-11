import React from 'react'

import { useRecoilValue } from 'recoil'
import { DBState } from '../../../reicoil/atom';

type DBStateType = [
  {
    id: string,
    view: string,
    column:{
      name: string
    }[],
    data: string[][],
  },
  any
]

const DateView = (date: Date|number) => {
  const DB = useRecoilValue(DBState) as DBStateType[0]
  console.log(DB)

  const formatDate = (date: Date|number) => {
    // convert unixtime to Date
    if(typeof date == 'number') date = new Date(date)

    const year = date.getFullYear()
    const month = date.getMonth()+1
    const day = date.getDate()
    return year + '/' + month + '/' + day
  }

  return (<div>{formatDate(date)}</div>)
}

export default DateView