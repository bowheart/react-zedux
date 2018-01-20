import { getDisplayName } from '../../src/utils/general'


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
