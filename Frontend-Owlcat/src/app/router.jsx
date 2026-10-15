import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AdoptPage } from '../pages/AdoptPage';
import { DashboardPage } from '../pages/DashboardPage';
import { JournalPage } from '../pages/JournalPage';
import { SkillsPage } from '../pages/SkillsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: 'adopt',
        element: (
          <ProtectedRoute>
            <AdoptPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'journal',
        element: (
          <ProtectedRoute>
            <JournalPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'skills',
        element: (
          <ProtectedRoute>
            <SkillsPage />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
