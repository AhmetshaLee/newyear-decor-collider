import { Navigate, createBrowserRouter } from 'react-router'
import { ImmersivePageLayout } from '@/app/layouts/ImmersivePageLayout'
import { ColliderPage } from '@/pages/ColliderPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/collider" replace />,
  },
  {
    element: <ImmersivePageLayout />,
    children: [
      {
        path: '/collider',
        element: <ColliderPage />,
      },
    ],
  },
])
