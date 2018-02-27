# `Context.Provider`

A React component. Provides an observable to its descendants.

## Definition

```typescript
interface Provider extends Component<{
  children?: ReactNode
  onMount?(store: WrappedStateContainer): void
  onUnmount?(store: WrappedStateContainer): void
}, {}> {}
```

## Props

### `children`

Nothing special here. Just a normal React node or array of nodes. These children and their descendants will be able to consume the provided observable.

### `onMount`

Optional. This is a function that will be called in the Provider's `componentDidMount` lifecycle hook after the provider subscribes to the Context's observable.

#### Definition

```typescript
(store: WrappedStateContainer) => void
```

**store** &ndash; the provided observable. See the [WrappedStateContainer type](/types/WrappedStateContainer.md)

### `onUnmount`

Optional. This is a function that will be called in the Provider's `componentWillUnmount` lifecycle hook.

#### Definition

```typescript
(store: WrappedStateContainer) => void
```

**store** &ndash; the provided observable. See the [WrappedStateContainer type](/types/WrappedStateContainer.md)

## Example

The onMount and onUnmount hooks are useful for attaching/detaching a child store to/from a parent store.

{% include '/templates/attachChildExample.md' %}