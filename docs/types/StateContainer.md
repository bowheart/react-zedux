# StateContainer

A StateContainer is what's passed to [`createContext()`](/api/createContext.md). This is either an [Observable](/types/Observable.md) or a [StoreApi](/api/StoreApi.md) with an observable `store` property.

## Definition

```typescript
type StateContainer<TState> = Observable<TState>
  | StoreApiConstructor<TState>
```

See the [Observable](/types/Observable.md) and [StoreApiConstructor](/types/StoreApiConstructor.md) types.
