import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import WeekView from './pages/WeekView'
import DayView from './pages/DayView'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<WeekView />} />
          <Route path="/dan/:dayId" element={<DayView />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
