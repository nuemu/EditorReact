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
    name: 'Insert Column',
    type: 'Hover',
    contents: [{
      name: 'Insert Before',
      type: 'InsertColumnBefore',
      contents: []
    },
    {
      name: 'Insert After',
      type: 'InsertColumnAfter',
      contents: []
    }]
  },
  {
    name: 'Remove Column',
    type: 'RemoveColumn',
    contents: []
  },
  {
    name: 'Change Property',
    type: 'Hover',
    contents: [{
      name: 'Page',
      type: 'Page',
      contents: []
    },
    {
      name: 'Date',
      type: 'Date',
      contents: []
    },
    {
      name: 'Text',
      type: 'Text',
      contents: []
    }]
  }
]