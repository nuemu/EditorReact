/// <reference types="react-scripts" />

type PageList = [{
  id: string,
  title: string,
  list: PageList[]
}]

type Blocks = {
  id: string;
  type: string;
  data: { text: string; }
}[][]

type Page = {
  id: string,
  column: {},
  data: Blocks
}