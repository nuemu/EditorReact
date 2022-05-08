import { atom, selector } from 'recoil'
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

type Blocks = { id: string; type: string; data: { text: string; }; }[][]

const blocksSelector = selector({
  key: 'blocksSelector',
  get: ({get}) => {
    const blocks = get(blocksState).blocks
    return blocks as Blocks
  },
  set: ({get,set}, newBlocks) => {
    const newValue = {
      id: get(blocksState).id,
      blocks: newBlocks as Blocks
    }
    set(blocksState, newValue)
  }
})

export default blocksSelector