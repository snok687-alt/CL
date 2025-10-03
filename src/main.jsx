import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import './style/button.css'
import './style/profile_rank.css'
import './style/profile.css'
import './style/fire_videocard.css'
import './style/image_in_profilepage.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
