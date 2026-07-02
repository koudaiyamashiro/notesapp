import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Assessment from './pages/Assessment.jsx'
import Analysis from './pages/Analysis.jsx'
import Result from './pages/Result.jsx'
import LoginPage from './pages/LoginPage.jsx'
import History from './pages/History.jsx'
import Terms from './pages/Terms.jsx'
import Privacy from './pages/Privacy.jsx'
import Disclaimer from './pages/Disclaimer.jsx'
import Commerce from './pages/Commerce.jsx'
import Billing from './pages/Billing.jsx'
import BillingSuccess from './pages/BillingSuccess.jsx'
import BillingCancel from './pages/BillingCancel.jsx'
import AdvancedDiagnosis from './pages/AdvancedDiagnosis.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/commerce" element={<Commerce />} />
          <Route path="/billing/success" element={<BillingSuccess />} />
          <Route path="/billing/cancel" element={<BillingCancel />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/diagnosis" element={<Assessment />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/result" element={<Result />} />
            <Route path="/history" element={<History />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/advanced-diagnosis" element={<AdvancedDiagnosis />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
