const files = require.context('.', false, /\.tsx$/)
const modules = {}
files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.tsx)/g, '').split('/').pop()] = files(key)
})
export default modules