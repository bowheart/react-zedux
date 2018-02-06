import PropTypes from 'prop-types'
import vm from 'vm'

import { storesContextName } from '../src/utils/constants'


/**
  Adds the necessary contextTypes to a component to ensure that
  the component receives the list of provided Zedux stores from
  parent Providers.
*/
export const contextifyComponent = Component => {
  Component.contextTypes = {
    [storesContextName]: PropTypes.object.isRequired
  }

  return Component
}


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
