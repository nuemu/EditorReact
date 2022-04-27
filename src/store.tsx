import React, { createContext, useState } from 'react';

type blocksData = {
  id: string | null;
  name: string | null;
};

type blocksContextType = {
  blocks: blocksData | null;
  setBlocks: (blocks: blocksData) => void;
};

export const BlocksContext = createContext<blocksContextType>({
  blocks: {id: 'asd', name: 'sample'},
  setBlocks: (blocks) => {},
});

export const BlocksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [blocks, setBlocks] = useState<blocksData | null>(null);

  return <BlocksContext.Provider value={{ blocks, setBlocks }}>{children}</BlocksContext.Provider>;
};