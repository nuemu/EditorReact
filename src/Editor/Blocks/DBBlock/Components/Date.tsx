import React from 'react'
import './Date.css'

import { useRecoilState } from 'recoil'
import { DBState } from '../../../reicoil/atom';

type DBStateType = [
  {
    id: string,
    view: string,
    column:{
      name: string
      property: string
    }[],
    data: string[][],
  },
  any
]

type Props = {
  row_index: number,
  col_index: number
}

const DateElement = (props:Props) => {
  const [DB, setDB] = useRecoilState(DBState) as DBStateType

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>, row_index:number, col_index:number) => {
    var newDB = JSON.parse(JSON.stringify(DB))
    newDB.data[row_index][col_index] = new Date(e.target.value).getTime() 
    setDB(newDB)
  }

  const initialData = () =>{
    if(DB.data[props.row_index][props.col_index]){
      const data = new Date(DB.data[props.row_index][props.col_index])
      var month = String(data.getMonth()+1)
      var date = String(data.getDate())
      if(Number(month) < 10){
        month = '0' + month
      }
      if(Number(date) < 10){
        date = '0' + date
      }
      return data.getFullYear() + '-' + month + '-' +date
    }
    return ''
  }

  return (
    <form>
      <label>
        <input
          type="date"
          className="table-data-date"
          value={initialData()}
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleDataChange(e, props.row_index, props.col_index)}
        />
      </label>
    </form>
  )
}

export default DateElement