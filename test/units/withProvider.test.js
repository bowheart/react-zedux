import React from 'react'
import PropTypes from 'prop-types'
import { mount, render } from 'enzyme'

import { withProvider } from '../../src/index'


describe('withProvider()', () => {

  test('throws an error if the Provider is not a React component', () => {

    expect(withProvider('a')).toThrowError(/must be a react component/i)

  })


  test('throws an error if the WrappedComponent is not a React component', () => {

    expect(
      withProvider(() => 'a').bind(null, 'b')
    ).toThrowError(/must be a react component/i)

  })


  test('returns a component whose displayName contains the names of both wrapped components', () => {

    const A = () => 'a'
    const B = () => 'b'

    const Provider = withProvider(A)(B)

    expect(typeof Provider).toBe('function')
    expect(typeof Provider.prototype.render).toBe('function')
    expect(Provider.displayName).toBe('WithProvider(A)(B)')

  })


  test('renders the WrappedComponent wrapped in the Provider', () => {

    const A = ({ children }) => <div>a{children}</div>
    A.propTypes = {
      children: PropTypes.node
    }

    const B = () => 'b'

    const Provider = withProvider(A)(B)

    const wrapper = render(<Provider />)

    expect(wrapper.text()).toBe('ab')

  })


  test('passes props along to the WrappedComponent', () => {

    const A = ({ children }) => <div>a{children}</div>
    A.propTypes = {
      children: PropTypes.node
    }

    const B = jest.fn(() => 'b')

    const Provider = withProvider(A)(B)

    const wrapper = mount(<Provider c={1} d={2} />)

    expect(wrapper.text()).toBe('ab')

    wrapper.unmount()

    expect(B).toHaveBeenCalledWith({ c: 1, d: 2 }, {})

  })

})
