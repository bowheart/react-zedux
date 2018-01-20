import { Component, ComponentClass, ComponentType, ReactNode } from 'react'

import { Observable } from 'zedux'

export * from 'zedux'


type Diff<
  T extends string,
  U extends string
> = (
  { [P in T]: P }
  & { [P in U]: never }
  & { [x: string]: never }
)[T]

type Omit<
  T,
  K extends keyof T
> = Pick<
  T,
  Diff<keyof T, K>
>


export interface StoreComponentEnhancer<
  TInjectedProps,
  P extends TInjectedProps
> {
  (
    component: ComponentType<P>
  ): ComponentClass<
    Omit<P, keyof TInjectedProps>
  > & { WrappedComponent: Component<P> }
}


export interface PropsToStoreIdsMap {
  [s: string]: StoreId
}


export interface ProviderComponentEnhancer<P> {
  (component: ComponentType): ComponentClass<P>
    & { WrappedComponent: Component<P> }
}


export interface ProviderProps {
  children: ReactNode
  id?: any
  store: Observable<any>
}


/**
  A component that provides a store to its descendants.
  Any descendant can grab the store using `withStores()`.

  Since a Zedux app will typically have many stores, each Provided
  store in the component hierarchy needs an identifier of some sort.

  For singleton stores, the identifier can be the store itself.

  For component-bound stores, the identifier may be a component
  that composes this Provider. For example:

    class TodosProvider extends Component {
      store = createStore()

      render() {
        return (
          <Provider id={TodosProvider} store={this.store}>
            {this.props.children}
          </Provider>
        )
      }
    }
*/
export class Provider extends Component<ProviderProps, {}> {}


/**
  Wraps a component in a Provider.

  Useful when a component needs to provide a store to its children
  but also needs access to the store.

  Only supports a single Provider. If multiple are needed, they
  can be composed together.

  Example usage:

    const provideAndConsume = compose(
      withProvider(TodosProvider),
      withProvider(TodontsProvider),
      withStores({
        todos: TodosProvider,
        todonts: TodontsProvider
      })
    )

    const WrappedTodos = provideAndConsume(Todos)

    @template P The props type of the wrapped component
*/
export function withProvider<P = {}>(
  provider: Provider
): ProviderComponentEnhancer<P>


/**
  Accesses a store provided by a parent, passing it as a prop
  to the wrapped component.

  Since multiple parents may provide stores, each store needs an
  identifier of some sort. This identifier must be the "id" prop
  of a parent Provider:

    <Provider id={theId} ... > ... </Provider>

  This identifier must then be used to link this child store to
  the provided store:

    withStores({ storePropName: theId })(Child)

  @template TPropsToStoreIdsMap A map of prop names to store ids.
    Each store will be located by its id and passed to the wrapped
    component as the given prop

  @template P The props type of the wrapped component

  @returns {StoreComponentEnhancer}
*/
export function withStores<
  TPropsToStoreIdsMap extends PropsToStoreIdsMap = {},
  P extends TPropsToStoreIdsMap = TPropsToStoreIdsMap
>(
  propsToStoreIdsMap: TPropsToStoreIdsMap
): StoreComponentEnhancer<TPropsToStoreIdsMap, P>


export type StoreId = any