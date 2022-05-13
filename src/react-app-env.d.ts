/// <reference types="react-scripts" />

type PageList = [{
  id: string,
  title: string,
  view: string,
  list: any[]
}]

type Block = {
  id: string;
  type: string;
  data: any
}

type Blocks = {
  id: string;
  type: string;
  data: any
}[][]

type Data = {
  id: string,
  column: {
    name: string,
    property: string,
  }[],
  data: Blocks
}

type BlockProps = {
  row_index: number
  col_index: number
}