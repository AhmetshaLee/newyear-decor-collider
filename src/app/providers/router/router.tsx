import { Navigate, createBrowserRouter } from 'react-router'
import { BasePageLayout } from '@/app/layouts/BasePageLayout'
import { ImmersivePageLayout } from '@/app/layouts/ImmersivePageLayout'
import { CalendarPage } from '@/pages/CalendarPage'
import { ColliderPage } from '@/pages/ColliderPage'
import { CollectionPage } from '@/pages/CollectionPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/collider" replace />,
  },
  {
    element: <BasePageLayout />,
    children: [
      {
        path: '/calendar',
        element: <CalendarPage />,
      },
      {
        path: '/collection',
        element: <CollectionPage />,
      },
    ],
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
