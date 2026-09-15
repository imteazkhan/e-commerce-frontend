import Navbar from './components/UI/Navbar'
import Footer from './components/UI/Footer'
import Home from './components/pages/Home'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Home />
      <Footer />
    </div>
  )
}

export default App
