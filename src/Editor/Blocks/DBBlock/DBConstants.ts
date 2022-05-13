export const viewMenuItems = [
  {
    name: 'Table',
    type: 'Table',
    icon: require('../../Assets/Table.svg').default
  },
  {
    name: 'Calendar',
    type: 'Calendar',
    icon: require('../../Assets/Calendar.svg').default
  }
]

export const Properties = {
  Text: {
    initialData: ''
  },
  Date: {
    initialData: (() => Date.now())()
  }
}