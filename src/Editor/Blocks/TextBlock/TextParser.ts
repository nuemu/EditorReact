const ParseSettings = [
  {
    reg: /\*\*.*\*\*/,
    replace: '**',
    end: '**',
    tags: ['STRONG'],
    class: [],
  },
  {
    reg: /- /,
    replace: '- ',
    end: '\n',
    tags: ['LI'],
    class: [],
  },
  {
    reg: /```/,
    replace: '```',
    end: '\n',
    tags: ['PRE', 'CODE'],
    class: [],
  },
  {
    reg: /### /,
    replace: '### ',
    end: '\n',
    tags: ['H3'],
    class: [],
  },
  {
    reg: /## /,
    replace: '## ',
    end: '\n',
    tags: ['H2'],
    class: [],
  },
  {
    reg: /# /,
    replace: '# ',
    end: '\n',
    tags: ['H1'],
    class: [],
  },
  {
    reg: / {2}/,
    replace: '  ',
    end: '\n',
    tags: ['UL'],
    class: []
  }
]

export const textParser = (text: string) => {
  return text.split('\n\n').join('\n').split('\n').map(sentence => {
    if(sentence !== '') return Parser(sentence)
    else return '<div><br></div>'
  }).join('')
}

const Parser = (text: string) => {
  var processed = '<div>' + text + '</div>'
  return processed
}

export const textReverseParser = (element: HTMLElement) => {
  var text = element.innerText.split('\n')
  const children = Array.prototype.slice.call(element.children)
  children.forEach((item, index) => {
    ParseSettings.forEach(setting => {
      if(setting.tags[setting.tags.length-1] === item.tagName){
        text[index] = setting.replace + item.innerText + setting.end
      }
    })
  })
  return text.join('\n')
}