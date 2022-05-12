/// <reference types="react-scripts" />

type PageList = [{
  id: string,
  title: string,
  list: PageList[]
}]

type Blocks = {
  id: string;
  type: string;
  data: any
}[][]

type Page = {
  id: string,
  column: {},
  data: Blocks
}

type BlockProps = {
  row_index: number
  col_index: number
}