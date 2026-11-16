import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/lilita-one/400.css'
import '@fontsource/source-sans-3/400.css'
import '@fontsource/source-sans-3/500.css'
import '@fontsource/source-sans-3/600.css'
import '@fontsource/source-sans-3/700.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
