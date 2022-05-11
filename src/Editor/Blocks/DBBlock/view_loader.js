const files = require.context('.', true, /\.tsx$/)
const modules = {}
files.keys().forEach((key) => {
     if(key !== './DBBlock.tsx') modules[key.replace(/(\.\/|View\.tsx)/g, '').split('/').pop()] = files(key)
})
export default modules