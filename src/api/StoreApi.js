import {
  attachActors,
  attachSelectors,
  flattenStore
} from '../utils/storeApi'


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
export class StoreApi {

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
  _bindControls() {
    const { dispatch, getState } = this.store
    const { actors, selectors } = this.constructor

    flattenStore(this, this.store)
    attachActors(this, actors, dispatch)
    attachSelectors(this, selectors, getState)

    return this // for chaining
  }
}