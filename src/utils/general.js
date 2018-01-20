/**
  Throws a TypeError if Component is not a React component
*/
export const assertIsComponent = (Component, method, paramName) => {
  if (typeof Component === 'function') return true

  throw new TypeError(
    `ReactZeduxError - ${method}() - ${paramName}`
    + ` must be a React component. Received ${typeof paramName}.`
  )
}


/**
  Retrieve the displayName of a component

  Returns 'Unknown' if no displayName is found
*/
export const getDisplayName = Component =>
  Component.displayName
    || Component.name
    || 'Unknown'
