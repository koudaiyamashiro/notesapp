import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Assessment from './pages/Assessment.jsx'
import Analysis from './pages/Analysis.jsx'
import Result from './pages/Result.jsx'
import LoginPage from './pages/LoginPage.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/diagnosis" element={<Assessment />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/result" element={<Result />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
