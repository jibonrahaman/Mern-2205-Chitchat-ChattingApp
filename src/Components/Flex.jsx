import React, { Children } from 'react'

function Flex({className,children}) {
  return (
    <div className={`flex ${className}`}>{children}</div>
  )
}

export default Flex