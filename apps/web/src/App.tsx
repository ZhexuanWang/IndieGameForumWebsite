import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { CreateProjectPage } from '@/pages/CreateProjectPage'
import { EditProjectPage } from '@/pages/EditProjectPage'
import { ForumPage } from '@/pages/ForumPage'
import { ForumThreadPage } from '@/pages/ForumThreadPage'
import { CreateThreadPage } from '@/pages/CreateThreadPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { MarketplacePage } from '@/pages/MarketplacePage'
import { ListingDetailPage } from '@/pages/ListingDetailPage'
import { CreateListingPage } from '@/pages/CreateListingPage'
import { EditListingPage } from '@/pages/EditListingPage'
import { MyInquiriesPage } from '@/pages/MyInquiriesPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:id" element={<ProjectDetailPage />} />
      <Route
        path="/projects/new"
        element={
          <ProtectedRoute>
            <CreateProjectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id/edit"
        element={
          <ProtectedRoute>
            <EditProjectPage />
          </ProtectedRoute>
        }
      />
      <Route path="/forum" element={<ForumPage />} />
      <Route path="/forum/:id" element={<ForumThreadPage />} />
      <Route
        path="/forum/new"
        element={
          <ProtectedRoute>
            <CreateThreadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/users/:id" element={<ProfilePage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/marketplace/:id" element={<ListingDetailPage />} />
      <Route
        path="/marketplace/new"
        element={
          <ProtectedRoute>
            <CreateListingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace/:id/edit"
        element={
          <ProtectedRoute>
            <EditListingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace/inquiries"
        element={
          <ProtectedRoute>
            <MyInquiriesPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
