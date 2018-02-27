# Using observables

> We'll use [RxJS](https://github.com/reactivex/rxjs) in this guide, but the principles should be generally applicable to FRP libraries.

React Zedux is designed specially for use with Zedux, but it can be used to consume any observable:

```js
import { Observable } from 'rxjs'
import { createContext } from 'react-zedux'

const tick$ = Observable.interval(1000)
const TickContext = createContext(tick$)

const Clock = TickContext.inject()(
  () => 'Current Time: ' + new Date().toTimeString()
)
```

The `Clock` component will now be re-rendered every second, allowing it to update the displayed time like a normal clock.

## Finite observables

When a finite observable is consumed, the last emitted value will become the permanent static state of the observable.

```js
import { Observable } from 'rxjs'
import { createContext } from 'react-zedux'

const userData$ = Observable.ajax.get('/user')
  .map(({ response }) => response)

const UserDataContext = createContext(userData$)

const Header = UserDataContext.inject([ 'state' ])(
  ({ state }) => (
    <header>
      Hello, {state.name}!
    </header>
  )
)
```

Now when the `/user` get request completes, its response value will be set as the permanent static state of the `UserDataContext`.

But we've introduced 2 problems:

1. Since this ajax request is tied to the Context's Provider, the request will be sent every time a `<Header>` component is mounted. Probably not what we want.

2. Since there is no default value of the observable, our header will throw an error, `Cannot read property 'name' of undefined`.

We could remove problem 1 by providing the `UserDataContext` in our top-level App component:

```js
const App = () => (
  <UserDataContext.Provider>
    ...
  </UserDataContext.Provider>
)
```

And then just consuming the context in the Header:

```js
const Header = UserDataContext.consume([ 'state' ])(
  ({ state }) => (
    <header>
      Hello, {state.name}!
    </header>
  )
)
```

But that introduces another problem: What if we need to invalidate and re-request that data? Unmounting and re-mounting the `App` component is no good.

## BehaviorSubject

Alright, it turns out there's a fairly easy solution to all this. In RxJS, it's the BehaviorSubject. This is just a stateful data bus. We can wrap it in a StoreApi to handle cache invalidation:

```js
import { StoreApi, createContext } from 'react-zedux'
import { BehaviorSubject } from 'rxjs'

class UserDataApi extends StoreApi {
  static requested = false

  constructor() {
    super()

    // Set the required `store` property to a BehaviorSubject.
    // We can give it a default state to solve problem 2.
    this.store = new BehaviorSubject({})

    // Attempt to fetch every time. Will do nothing after the
    // first time, unless invalidated.
    this.fetch()
  }

  fetch() {

    // Can't request again unless cache is invalidated
    if (UserDataApi.requested) return
    UserDataApi.requested = true

    fetch('/user')
      .then(response => response.json())

      // Push the data to the store.
      .then(data => this.store.next(data))
  }

  invalidate = () => {
    UserDataApi.requested = false

    // And re-request immediately, just to keep this example simple
    this.fetch()
  }
}

const UserDataContext = createContext(UserDataApi)
```

That's it! Not too bad. Now the user data will be fetched when the App first mounts. All that's left is to add a check to the Header to wait for the data:

```js
const Header = UserDataContext.consume([ 'state' ])(
  ({ state }) => (
    <header>
      {state.name && `Hello, ${state.name}!`}
    </header>
  )
)
```

Any component can now consume the UserDataContext and specifically invalidate the cache:

```js
const CacheInvalidator = UserDataContext.consume([ 'invalidate' ])(
  ({ invalidate }) => (
    <button onClick={invalidate}>Invalidate user data cache</button>
  )
)
```

Clicking that button will force the request to be sent again, and the whole page to be populated with any new data.

## StoreApi wrappers

We just saw this, but just to reiterate: A StoreApi can wrap any observable. It doesn't have to be a Zedux or Redux store. Specifically, the following pattern is very common:

```js
import { StoreApi } from 'react-zedux'
import { BehaviorSubject } from 'rxjs'

class SomeApi extends StoreApi {
  store = new BehaviorSubject(/* default state */)
}
```

## Notes

Zedux/Redux stores naturally come with a default state. Using a BehaviorSubject really just gets us closer to full-fledged stores.

Notice how the BehaviorSubject's default value closely mimics React's `createContext(defaultValue)`. React has some things right! Don't be afraid to use raw React just because you have an abstraction on top of it.