export const rowMenuItems = [
  {
    name: (multiple:boolean) => multiple ? 'Remove Rows' : 'Remove Row',
    type: 'RemoveRow'
  },
  {
    name: () => 'Add Row',
    type: 'AddRow'
  }
]

export const colMenuItems = [
  {
    name: 'Add Column',
    type: 'AddColumn'
  },
  {
    name: 'Remove Column',
    type: 'RemoveColumn'
  }
]