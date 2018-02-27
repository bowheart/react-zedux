import vm from 'vm'


export const nonPlainObjects = [
  undefined,
  null,
  'a',
  1,
  [],
  () => {},
  new Map(),
  Object.create(null)
]


export const plainObjects = [
  {},
  Object.create(Object.prototype),
  vm.runInNewContext('placeholder = {}')
]
