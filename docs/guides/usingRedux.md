# Using Redux

Redux will work instead of Zedux for most examples in these docs. The only area where Redux struggles is attaching child stores to parent stores. Redux stores do not compose naturally like Zedux stores.

The workaround is to just use a single, global store for everything. That's a Redux best practice, so you should probably be doing that anyway. This is overkill for most situations. But the popularity of Redux attests to the fact that this is not as clumsy as it seems. And it is certainly easier for time travel.

## Some examples

```js
import { createContext } from 'react-zedux'
import { combineReducers, createStore } from 'redux'
import todosReducer from './store/todosReducer'
import visibilityFilterReducer from './store/visibilityFilterReducer'
import Todos from './components/Todos'

const rootReducer = combineReducers(
  todos: todosReducer,
  visibilityFilter: visibilityFilterReducer
)

const store = createStore(rootReducer)
const RootContext = createContext(store)

const App = () => (
  <RootContext.Provider>
    <Todos />
  </RootContext.Provider>
)
```

A Redux store can also be consumed as a normal observable:

```js
import { createContext } from 'react-zedux'
import { Observable } from 'rxjs'
import reduxStore from './store'

const state$ = Observable.from(reduxStore)
const RootContext = createContext(state$)
```

A StoreApi can wrap a Redux store:

```js
import { StoreApi, createContext } from 'react-zedux'
import rootReducer from './rootReducer'
import * as actionCreators from './actionCreators'
import * as selectors from './selectors'

class RootApi extends StoreApi {
  store = createStore(rootReducer)

  static actors = actionCreators
  static selectors = selectors
}

const RootContext = createContext(RootApi)
```