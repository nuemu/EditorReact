import React from 'react'
import './Date.css'

import { useRecoilState } from 'recoil'
import { DBState } from '../../../recoil/atom';

const DateElement = (props:BlockProps) => {
  const [DB, setDB] = useRecoilState(DBState) as [Data, any]

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>, row_index:number, col_index:number) => {
    var newDB = JSON.parse(JSON.stringify(DB))
    newDB.data[row_index][col_index] = new Date(e.target.value).getTime() 
    setDB(newDB)
  }

  const initializeData = () =>{
    if(DB.data[props.row_index][props.col_index]){
      const data = new Date(DB.data[props.row_index][props.col_index].data)
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
          value={initializeData()}
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleDataChange(e, props.row_index, props.col_index)}
        />
      </label>
    </form>
  )
}

export default DateElement