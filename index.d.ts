import { Component, ComponentClass, ComponentType, ReactNode } from 'react'

import { Actor, Selector } from 'zedux'

/**
 * Create an api around an observable (e.g. a Zedux store).
 * The observable must be exposed on each instance of the class
 * as a property named `store`.
 *
 * A class that extends StoreApi can be passed to
 * ReactZedux.createContext()
 *
 * React Zedux will instantiate the class and bind actors
 * and selectors to the store.
 *
 * @prop {ActorsMap} [actors] - A hash (can be nested) of actors
 *   to bind to the store and attach to the StoreApi instance.
 *
 * @prop {SelectorsMap} [selectors] - A hash (can be nested) of selectors
 *   to bind to the store and attach to the StoreApi instance.
 *
 * @export
 * @class StoreApi
 */
export abstract class StoreApi<TState> {

  /**
   * Performs the actor/selector binding and flattening.
   *
   * React Zedux uses this internally, but it can be useful for testing.
   *
   * Will throw an error if the StoreApi instance does not have a visible
   * `store` property.
   *
   * @returns {StoreApi} for chaining
   * @memberof StoreApi
   */
  _bindControls(): StoreApi<TState>
}


/**
 * Creates a consumable context out of a state container.
 *
 * The state container can be either:
 *   1. An observable (e.g. a Zedux store)
 *   2. A class that extends ReactZedux.StoreApi
 *
 * Since `new [class that extends StoreApi]()` must return an object that
 * has an observable `store` property, option 2 is really just an
 * extension of option 1. But since it will be instantiated once for
 * every <Provider>, it allows for dynamic observable creation.
 *
 * Returns an object containing 3 First-Order Components:
 *
 * <Provider>, <Consumer>, and <Injector>
 *
 * and their corresponding Higher-Order Components:
 *
 * provide(), consume(), inject()
 *
 * Provider and Consumer must be used together.
 * An error will be thrown if Consumer is used alone.
 *
 * Use Injector to simultaneously provide and consume the context.
 *
 * @export
 * @template TState The state type emitted by the observable
 * @template TContainer The state container type
 * @param {TContainer} stateContainer The state container.
 *   Can be either an observable or a class that extends ReactZedux.StoreApi
 *
 * @returns {Context<WrappedStateContainer<TState, TContainer>>}
 */
export function createContext<
  TState,
  TContainer extends StateContainer<TState> = StateContainer<TState>
>(
  stateContainer: TContainer
): Context<WrappedStateContainer<TState, typeof stateContainer>>

export function createContext<TState, TStoreApi extends StoreApi<TState>>(
  stateContainer: StoreApiConstructor<TState>
): Context<
  WrappedStateContainer<
    TState,
    StoreApiConstructor<TState>['actors']
      & StoreApiConstructor<TState>['selectors']
      & TStoreApi
      & TStoreApi['store']
  >
>


export interface ActorsMap {
  [key: string]: Actor
}


export interface Consumer<TWrappedContainer> extends Component<
  ConsumerProps<TWrappedContainer>,
  {}
> {}


export interface ConsumerComponentEnhancer<
  TEnhancerProps,
  TConsumerProps extends TEnhancerProps
> {
  (component: ComponentType): ComponentClass<
    Omit<TConsumerProps, keyof TEnhancerProps>
  >
}


export interface ConsumerProps<TWrappedContainer> {
  children: (value: TWrappedContainer) => ReactNode
}


export interface Context<TWrappedContainer> {
  Provider: Provider<TWrappedContainer>

  provide<TProps extends Object = {}>(
    component: ComponentType
  ): ComponentClass<TProps>

  Consumer: Consumer<TWrappedContainer>

  consume<TConsumerProps extends TWrappedContainer>():
    ConsumerComponentEnhancer<TWrappedContainer, TConsumerProps>

  // A single string
  consume<
    TConsumerProps extends { [key in TStorePropName]: any },
    TStorePropName extends string = ''
  >(
    mapStoreToProps: TStorePropName
  ): ConsumerComponentEnhancer<
    { [key in TStorePropName]: TWrappedContainer },
    TConsumerProps
  >

  // An array of values to pluck
  consume<
    TConsumerProps extends {},
    TListOfPropsToPluck extends keyof TConsumerProps
  >(
    mapStoreToProps: TListOfPropsToPluck[]
  ): ConsumerComponentEnhancer<
    Partial<TConsumerProps>,
    TConsumerProps
  >

  // A storeFields-to-props map
  consume<
    TConsumerProps extends { [key in TAliasedProps]: any },
    TAliasedProps extends string
  >(
    mapStoreToProps: { [key in keyof TWrappedContainer]?: TAliasedProps }
  ): ConsumerComponentEnhancer<
    Partial<TConsumerProps>,
    TConsumerProps
  >

  // A custom storeFields-to-props mapper function
  consume<
    TConsumerProps extends TMappedProps,
    TMappedProps extends Object
  >(
    mapStoreToProps: (store: TWrappedContainer) => TMappedProps
  ): ConsumerComponentEnhancer<
    TMappedProps,
    TConsumerProps
  >

  Injector: Injector<TWrappedContainer>

  inject<TConsumerProps extends TWrappedContainer>():
    ConsumerComponentEnhancer<TWrappedContainer, TConsumerProps>

  // A single string
  inject<
    TConsumerProps extends {[key in TStorePropName]: any },
    TStorePropName extends string = ''
  >(
    mapStoreToProps: TStorePropName
  ): ConsumerComponentEnhancer<
    {[key in TStorePropName]: TWrappedContainer },
    TConsumerProps
  >

  // An array of values to pluck
  inject<
    TConsumerProps extends {},
    TListOfPropsToPluck extends keyof TConsumerProps
  >(
    mapStoreToProps: TListOfPropsToPluck[]
  ): ConsumerComponentEnhancer<
    Partial<TConsumerProps>,
    TConsumerProps
  >

  // A storeFields-to-props map
  inject<
    TConsumerProps extends {[key in TAliasedProps]: any },
    TAliasedProps extends string
  >(
    mapStoreToProps: {[key in keyof TWrappedContainer]?: TAliasedProps }
  ): ConsumerComponentEnhancer<
    Partial<TConsumerProps>,
    TConsumerProps
  >

  // A custom storeFields-to-props mapper function
  inject<
    TConsumerProps extends TMappedProps,
    TMappedProps extends Object
  >(
    mapStoreToProps: (store: TWrappedContainer) => TMappedProps
  ): ConsumerComponentEnhancer<
    TMappedProps,
    TConsumerProps
  >
}


export interface Injector<TWrappedContainer> extends Component<
  Omit<ProviderProps<TWrappedContainer>, 'children'>
    & ConsumerProps<TWrappedContainer>,
  {}
> {}


export interface Observable<TState> {
  getState?(): TState
  subscribe(observer: Observer<TState>): Subscription | (() => void)
}


export interface Provider<TWrappedContainer> extends Component<
  ProviderProps<TWrappedContainer>,
  {}
> {}


export interface ProviderProps<TWrappedContainer> {
  children?: ReactNode
  onMount?: (store: TWrappedContainer) => void
  onUnmount?: (store: TWrappedContainer) => void
}


export interface SelectorsMap {
  [key: string]: Selector
}


export interface StoreApi<TState> {
  store: Observable<TState>
}


export interface StoreApiConstructor<TState> {
  new (): StoreApi<TState>
  actors?: ActorsMap
  selectors?: SelectorsMap
}


export interface Subscription {
  unsubscribe(): void
}


export type ListOfPropsToPluck<TWrappedContainer> =
  Array<keyof TWrappedContainer>


export type Observer<TState> = { next(newState: TState): void }
  | ((newState: TState) => void)
  | (() => void)


export type StateContainer<TState> = Observable<TState>
  | StoreApiConstructor<TState>


export type StorePropName = string


export type StoreToPropsMap<TWrappedContainer> = StorePropName
  | ListOfPropsToPluck<TWrappedContainer>
  | StoreToPropsMapper<TWrappedContainer>


export type StoreToPropsMapper<TWrappedContainer> =
  (store: TWrappedContainer) => { [key: string]: any }


export type WrappedStateContainer<TState, TContainer> = TContainer & {
  state: Readonly<TState>
  store: TContainer
}


type Diff<
  T extends string,
  U extends string
> = (
  {[P in T]: P }
  & {[P in U]: never }
  & { [x: string]: never }
)[T]


type Omit<
  T,
  K extends keyof T
> = Pick<
  T,
  Diff<keyof T, K>
>