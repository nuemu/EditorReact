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
    icon: require('../../../Assets/Plus.svg').default,
    contents: [{
      name: 'Insert Before',
      type: 'InsertColumnBefore',
      icon: require('../../../Assets/Left.svg').default,
      contents: []
    },
    {
      name: 'Insert After',
      type: 'InsertColumnAfter',
      icon: require('../../../Assets/Right.svg').default,
      contents: []
    }]
  },
  {
    name: 'Remove Column',
    type: 'RemoveColumn',
    icon: require('../../../Assets/Remove.svg').default,
    contents: []
  },
  {
    name: 'Change Property',
    type: 'Hover',
    icon: require('../../../Assets/Change.svg').default,
    contents: [
      {
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