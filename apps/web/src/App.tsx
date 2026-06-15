import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <div className="relative z-10 min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App
