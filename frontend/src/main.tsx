import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// createRoot = React 18 API; mounts App into #root in index.html
// StrictMode runs effects twice in dev to help catch bugs
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
