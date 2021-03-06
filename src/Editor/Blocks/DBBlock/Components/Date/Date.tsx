import React from 'react'
import './Date.css'

import { useRecoilState, useRecoilValue } from 'recoil'
import { DBSelector, blockSelector } from '../../../../recoil/atom';

type Props = {
  row_index: number
  col_index: number
  base_row_index: number
  base_col_index: number
}

const DateElement = (props: Props) => {
  const block = useRecoilValue(blockSelector({row_index: props.base_row_index, col_index: props.base_col_index})) as Block
  const DBId = block.data.id
  const [DB, setDB] = useRecoilState(DBSelector(DBId)) as [Data, any]

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>, row_index:number, col_index:number) => {
    var newDB = JSON.parse(JSON.stringify(DB))
    newDB.data[row_index][col_index].data = new Date(e.target.value).getTime() 
    setDB(newDB)
  }

  const initializeData = () =>{
    if(DB.data[props.row_index][props.col_index].type === 'Date'){
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