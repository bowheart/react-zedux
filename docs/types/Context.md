# Context

The object returned from [`createContext()`](/api/createContext.md). This object is very similar to the Context object returned by React's `createContext()`, but with a little sugar added.

## Definition

```typescript
interface Context<TWrappedContainer> {
  Provider: Component

  provide(component: ComponentType): Component

  Consumer: Component

  consume(
    mapStoreToProps?: string | string[] | ((store: WrappedStateContainer) => Object)
  ): (component: ComponentType) => Component

  Injector: Component

  inject(
    mapStoreToProps?: string | string[] | ((store: WrappedStateContainer) => Object)
  ): (component: ComponentType) => Component
}
```



## Properties

[Provider](/types/context/Provider.md)

[provide](/types/context/provide.md)

[Consumer](/types/context/Consumer.md)

[consume](/types/context/consume.md)

[Injector](/types/context/Injector.md)

[inject](/types/context/inject.md)