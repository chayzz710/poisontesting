import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useUser } from './lib/auth'
import LoadingPun from './components/ui/LoadingPun'
import GoogleLoginPrompt from './components/ui/GoogleLoginPrompt'
import GatePage from './pages/GatePage'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import LettersPage from './pages/LettersPage'
import MemoryJarPage from './pages/MemoryJarPage'
import PunWallPage from './pages/PunWallPage'
import MapPage from './pages/MapPage'
import PlaylistPage from './pages/PlaylistPage'
import BucketListPage from './pages/BucketListPage'
import SecretPage from './pages/SecretPage'
import StyleguidePage from './pages/StyleguidePage'
import './styles/globals.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  const gatePassed = sessionStorage.getItem('gate') === 'ok'

  if (!gatePassed) return <Navigate to="/gate" replace />
  if (loading) return <LoadingPun />
  if (!user) return <GoogleLoginPrompt />

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-center" richColors />
      <Routes>
        <Route path="/gate" element={<GatePage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
        <Route path="/letters" element={<ProtectedRoute><LettersPage /></ProtectedRoute>} />
        <Route path="/jar" element={<ProtectedRoute><MemoryJarPage /></ProtectedRoute>} />
        <Route path="/puns" element={<ProtectedRoute><PunWallPage /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/playlist" element={<ProtectedRoute><PlaylistPage /></ProtectedRoute>} />
        <Route path="/bucketlist" element={<ProtectedRoute><BucketListPage /></ProtectedRoute>} />
        <Route path="/secret" element={<ProtectedRoute><SecretPage /></ProtectedRoute>} />
        <Route path="/styleguide" element={<StyleguidePage />} />
        <Route path="*" element={<Navigate to="/gate" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
