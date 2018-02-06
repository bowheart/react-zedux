import {
  addActors, addHooks, addSelectors
} from '../utils/storeApi'


export function createStoreApi(store, { actors, hooks, selectors } = {}) {
  assertIsStore(store)

  const { dispatch, getState } = store
  const storeApi = Object.create(store)

  addActors(storeApi, actors, dispatch)
  addSelectors(storeApi, selectors, getState)
  addHooks(storeApi, hooks)

  return storeApi
}


function assertIsStore(store) {
  if (store && store.$$typeof === Symbol.for('zedux.store')) {
    return true
  }

  throw new TypeError(
    'React Zedux Error - createStoreApi() - '
    + 'First parameter must be a valid Zedux store.'
  )
}
