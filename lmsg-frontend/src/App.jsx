import { Routes, Route } from 'react-router-dom'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import ListFineComponent from './components/ListFineComponent'
import FineComponent from './components/FineComponent'

function App() {
  return (
    <div>
      <HeaderComponent />
      <div className="container mt-5 mb-5">
        <Routes>
          <Route path="/" element={<ListFineComponent />} />
          <Route path="/fines" element={<ListFineComponent />} />
          <Route path="/fines/add" element={<FineComponent />} />
          <Route path="/fines/edit/:id" element={<FineComponent />} />
        </Routes>
      </div>
      <FooterComponent />
    </div>
  )
}

export default App
