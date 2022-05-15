const ParseSettings = [
  {
    reg: /```[\s\S]*```/,
    replace_start: '```',
    replace_end: '```',
    tags: ['PRE', 'CODE'],
    class: [],
  },
  {
    reg: /### .*n/,
    replace_start: '### ',
    replace_end: '\n',
    tags: ['H3'],
    class: [],
  },
  {
    reg: /## .*n/,
    replace_start: '## ',
    replace_end: '\n',
    tags: ['H2'],
    class: [],
  },
  {
    reg: /# .*n/,
    replace_start: '# ',
    replace_end: '\n',
    tags: ['H1'],
    class: [],
  },
  {
    reg: /- .*n/,
    replace_start: '- ',
    replace_end: '\n',
    tags: ['LI', 'UL'],
    class: [],
  },
  {
    reg: /\*\*.*\*\*/,
    replace_start: '**',
    replace_end: '\n',
    tags: ['STRONG'],
    class: [],
  }
]

type Setting = {
  reg: RegExp,
  replace_start: string,
  tags: string[],
  class: string[],
}[]

export const textParser = (text: string) => {
  return text = Parser(text, ParseSettings)
}

const Parser = (text: string, settings: Setting) => {
  settings.forEach(setting => {
    if(setting.reg.test(text)){
      var devide = text.match(setting.reg)!.input!.split(setting.replace_start)
      text  = devide.map((tex, index) => {
        if(index%2===1){
          setting.tags.forEach(tag => {
            tex = '<'+tag+'>' + tex + '</'+tag+'>'
          })
          return tex
        }else return tex
      }).join('')
      console.log(text)
    }
  })
  text = '<div>' + text + '</div>'
  return text
}

export const textReverseParser = (element: HTMLElement) => {
  var text = element.innerText.split('\n')
  const children = Array.prototype.slice.call(element.children)
  children.forEach((item, index) => {
    ParseSettings.forEach(setting => {
      if(setting.tags[setting.tags.length-1] === item.tagName){
        text[index] = setting.replace_start + item.innerText + setting.replace_end
      }
    })
  })
  return text.join('\n')
}