// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Customisation from './components/User/Customisation'
import HomePage from './components/User/HomePage'
import AboutPage from './components/User/AboutPage'
import SelectSportPage from './components/User/SelectSportPage'
import CustomizePage from './components/User/CustomizePage';
import OrderFormPage from './components/User/OrderFormPage'
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/select-sport" element={<SelectSportPage />} />
        <Route path="/customize/:sport/:fit" element={<CustomizePage />} />
        <Route path="/design-editor" element={<Customisation />} />
        <Route path="/order-form" element={<OrderFormPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  )
}
