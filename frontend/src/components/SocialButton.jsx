import React from 'react'

const SocialButton = ({ onClick, Icon, children }) => {
  return (
    <button type="button" onClick={onClick} className="flex items-center w-70 bg-slate-50 text-black border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <Icon className="h-6 w-6 mr-2" />
      <span>{children}</span>
    </button>
  )
}

export default SocialButton
