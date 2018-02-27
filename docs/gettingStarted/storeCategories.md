# Store Categories

In a React Zedux app, there are two types of stores:

1. Global store &ndash; lives as long as the application does unless lazy-loaded (#codesplitting) or explicitly destroyed.

2. Component-bound (fractal) store &ndash; born when its component is mounted and dies when its component is unmounted.

```js
import React, { Component } from 'react'
import { createStore } from 'zedux'

// I am a global store.
const globalStore = createStore()

class MyComponent extends Component {

  // I am a component-bound store.
  store = createStore().hydrate('woot!')

  render() {
    return this.store.getState()
  }
}
```

Not all stores have to be part of the global store hierarchy. Components can create completely isolated stores if they want. But for awesome debugging experiences, it can be useful to attach component-bound stores to the global store hierarchy. More on that in the [time travel guide](/guided/timeTravel.md).

## Notes

See the [StoreApi doc](/api/StoreApi.md) for examples of creating component-bound stores.