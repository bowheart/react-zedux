```js
import React from 'react'
import { StoreApi, createContext } from 'react-zedux'
import { createStore } from 'zedux'

class CounterApi extends StoreApi {
  static idCounter = 0

  id = CounterApi.idCounter++
  store = createStore().hydrate(0)
}

const rootStore = createStore()
const CounterContext = createContext(CounterApi)

const Counter = () => (
  <CounterContext.Injector
    onMount={counterStore => {

      // Attach to the root store when the component mounts
      rootStore.use({
        [counterStore.id]: counterStore
      })
    }}
    onUnmount={counterStore => {

      // Unattach this store when the component unmounts
      rootStore.use({
        [counterStore.id]: null
      })
    }}
  >
    {counterStore => JSON.stringify(rootStore.state)}
  </CounterContext.Injector>
)
```