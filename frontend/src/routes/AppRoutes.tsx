import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';

import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { CropRecommendationPage } from '../pages/advisory/CropRecommendationPage';
import { CropRecommendationResultPage } from '../pages/advisory/CropRecommendationResultPage';
import { DiseaseDetectionPage } from '../pages/advisory/DiseaseDetectionPage';
import { DiseaseDetectionResultPage } from '../pages/advisory/DiseaseDetectionResultPage';
import { FertilizerPage } from '../pages/advisory/FertilizerPage';
import { FertilizerResultPage } from '../pages/advisory/FertilizerResultPage';
import { IrrigationPage } from '../pages/advisory/IrrigationPage';
import { IrrigationResultPage } from '../pages/advisory/IrrigationResultPage';
import { AssistantPage } from '../pages/assistant/AssistantPage';
import { HistoryPage } from '../pages/history/HistoryPage';
import { HistoryDetailPage } from '../pages/history/HistoryDetailPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Dashboard Pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/advisory/crop-recommendation" element={<CropRecommendationPage />} />
          <Route
            path="/advisory/crop-recommendation/result/:id"
            element={<CropRecommendationResultPage />}
          />
          <Route path="/advisory/disease-detection" element={<DiseaseDetectionPage />} />
          <Route
            path="/advisory/disease-detection/result/:id"
            element={<DiseaseDetectionResultPage />}
          />
          <Route path="/advisory/fertilizer" element={<FertilizerPage />} />
          <Route
            path="/advisory/fertilizer/result/:id"
            element={<FertilizerResultPage />}
          />
          <Route path="/advisory/irrigation" element={<IrrigationPage />} />
          <Route
            path="/advisory/irrigation/result/:id"
            element={<IrrigationResultPage />}
          />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<HistoryDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

