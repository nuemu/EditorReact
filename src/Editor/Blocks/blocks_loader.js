const files = require.context('.', true, /\.tsx$/)
const modules = {}
files.keys().forEach((key) => {
     modules[key.replace(/(\.\/|Block\.tsx)/g, '').split('/').pop()] = files(key)
})
export default modules