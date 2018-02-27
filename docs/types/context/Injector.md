# `Context.Injector`

A React component. Simultaneously provides and consumes the observable.

This is just a shorthand for convenience. The following two examples are equivalent:

```js
<Context.Provider>
  <Context.Consumer>
    {renderProp}
  </Context.Consumer>
</Context.Provider>
```

```js
<Context.Injector>
  {renderProp}
</Context.Injector>
```

Unlike [`Context.Consumer`](/types/context/Consumer.md), will not throw an error if the Context's [Provider](/types/context/Provider.md) is not an ancestor of the injected component. This is because injected components get their own Providers.

## Definition

```typescript
export interface Injector extends Component<{
  children: (value: WrappedStateContainer) => ReactNode
  onMount?(store: WrappedStateContainer): void
  onUnmount?(store: WrappedStateContainer): void
}, {}> {}
```

Note that the Injector is just a combination of the Context's [Provider](/types/context/Provider.md) and [Consumer](/types/context/Consumer.md).

**children** &ndash; A render prop! Required. Inherited from [`Context.Consumer`](/types/context/Consumer.md).

**onMount** &ndash; Optional. Function. Inherited from [`Context.Provider`](/types/context/Provider.md).

**onUnmount** &ndash; Optional. Function. Inherited from [`Context.Provider`](/types/context/Provider.md).

## Use case: Provider-turned-Consumer

Consider the following code:

```js
import React from 'react'
import TodosContext from '../contexts/TodosContext'
import TodoList from './TodoList'
import TodoFilters from './TodoFilters'

const Todos = () => (
  <TodosContext.Provider>
    <p>
      Todos remaining:{' '}
      <TodosContext.Consumer>
        {store => store.state.length}
      </TodosContext.Consumer>
    </p>
    <TodoList />
    <TodoFilters />
  </TodosContext.Provider>
)
```

The `<Todos>` component is a wrapper around our entire Todos application. So naturally he encapsulates his children in the Context's `<Provider>`. But he is also a consumer! The `<p>` tag needs access to the store's state. This tag is small enough that moving it into its own component would be a premature abstraction. But it's still annoying.

Enter the Injector:

```js
const Todos = () => (
  <TodosContext.Injector>
    {store => (
      <p>
        Todos remaining: {store.state.length}
      </p>
      <TodoList />
      <TodoFilters />
    )}
  </TodosContext.Injector>
)
```

Now the provider accurately reflects the fact that he is also a consumer. Good boy.

Note that we can simplify this further with the Injector's companion `inject()` HOC:

```js
const Todos = TodosContext.inject('store')(({ store }) => (
  <p>
    Todos remaining: {store.state.length}
  </p>
  <TodoList />
  <TodoFilters />
))
```

## Separation of data and UI

Injectors can be used to encourage a strict separation of data and UI. This becomes a replacement for React's local component state management:

```js
import { StoreApi, createContext } from 'react-zedux'
import { createStore } from 'zedux'

class ProfileFormState extends StoreApi {
  store = createStore()
    .hydrate({
      firstName: '',
      email: ''
    })
  
  setField = ({ currentTarget: { name, value } }) => {

    // React Zedux merges the store into `this`, so the store's
    // `setState()` method is accessible like so:
    this.setState({
      [name]: value
    })
  }

  submit = event => {
    event.preventDefault()

    // some clever ajax stuff here, or something
  }
}

export default createContext(ProfileFormState)
  .inject(ProfileForm)

function ProfileForm({
  submit,
  setField,
  state: { email, firstName }
}) {
  return (
    <form onSubmit={submit}>
      <input
        name="firstName"
        onChange={setField}
        value={firstName}
      />
      <input
        name="email"
        onChange={setField}
        value={email}
      />
    </form>
  )
}
```

Do we encourage this? Nope. There's nothing wrong with it, but React's local component state management is fine. Use it first before reaching for other tools!