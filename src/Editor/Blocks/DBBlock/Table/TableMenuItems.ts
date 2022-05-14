export const rowMenuItems = [
  {
    name: 'Remove Rows',
    type: 'RemoveRow',
    icon: require('../../../Assets/Remove.svg').default,
    contents: []
  },
  {
    name: 'Add Row',
    type: 'AddRow',
    icon: require('../../../Assets/Plus.svg').default,
    contents: []
  }
]

export const colMenuItems = [
    {
      name: 'Edit Title',
      type: 'EditColumnName',
      icon: require('../../../Assets/Right.svg').default,
      contents: []
    },
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
        type: 'ChangePropertyToPage',
        icon: require('../../../Assets/Page.svg').default,
        contents: []
      },
      {
        name: 'Date',
        type: 'ChangePropertyToDate',
        icon: require('../../../Assets/Calendar.svg').default,
        contents: []
      },
      {
        name: 'Text',
        type: 'ChangePropertyToText',
        icon: require('../../../Assets/Text.svg').default,
        contents: []
      }]
  }
]