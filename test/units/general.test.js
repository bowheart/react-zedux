import { getDisplayName, isPlainObject } from '../../src/utils/general'
import { nonPlainObjects, plainObjects } from '../utils'


describe('getDisplayName()', () => {

  test('returns the displayName of a component', () => {

    const Component = () => 'a'
    Component.displayName = 'A'

    expect(getDisplayName(Component)).toBe('A')

  })


  test('returns the name of a component if no displayName is present', () => {

    const Component = () => 'a'

    expect(getDisplayName(Component)).toBe('Component')

  })


  test('returns "Unknown" if the component has no displayName and is anonymous (has no name)', () => {

    expect(getDisplayName(() => 'a')).toBe('Unknown')

  })

})


describe('isPlainObject()', () => {

  test('returns true if the given variable is a plain object', () => {

    plainObjects.forEach(
      plainObject => expect(isPlainObject(plainObject)).toBe(true)
    )

  })


  test('returns false if the given variable is not a plain object', () => {

    nonPlainObjects.forEach(
      nonPlainObject => expect(isPlainObject(nonPlainObject)).toBe(false)
    )

  })

})
