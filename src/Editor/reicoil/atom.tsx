import { atom } from 'recoil'
import { v4 } from 'uuid'

const blocksState = atom({
  key: 'blocksState',
  default: {
    id: v4(),
    blocks: [
      [{
        id: v4(),
        type: 'Text',
        data: {'text': 'Sample1-1'}
      },
      {
        id: v4(),
        type: 'Text',
        data: {'text': 'Sample1-2'}
      },
      {
        id: v4(),
        type: 'Text',
        data: {'text': 'Sample1-3'}
      }],
      [{
        id: v4(),
        type: 'Text',
        data: {'text': 'Sample2-1'}
      }],
      [{
        id: v4(),
        type: 'Text',
        data: {'text': 'Sample3-1'}
      },
      {
        id: v4(),
        type: 'Text',
        data: {'text': 'Sample3-2'}
      }]
    ]
  },
});

export default blocksState