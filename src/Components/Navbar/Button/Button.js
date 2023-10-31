import React from 'react'
import './button.css'

function Button({className,onClick,text,disabled}) {
  return (
    <div>
        <button
        onClick={onClick} disabled={disabled} className = {className}>{text}</button>
    </div>
  )
}

export default Button