import React from 'react'

import { useRecoilValue } from 'recoil'
import { DBState } from '../../reicoil/atom';

import Components from './view_loader'

const ViewComponents = Components as any

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

const DB = () => {
  const DB = useRecoilValue(DBState) as DBStateType[0]
  const View = ViewComponents[DB.view].default

  return <View />
}

export default DB