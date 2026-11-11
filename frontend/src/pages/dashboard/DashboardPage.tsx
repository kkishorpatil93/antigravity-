import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardWelcome } from '../../components/dashboard/DashboardWelcome';
import { ProfileSummaryCard } from '../../components/dashboard/ProfileSummaryCard';
import { FarmingTipCard } from '../../components/dashboard/FarmingTipCard';
import { QuickActionCard } from '../../components/dashboard/QuickActionCard';
import { RecentAdvisories } from '../../components/dashboard/RecentAdvisories';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="max-w-7xl mx-auto space-y-2">
      <DashboardWelcome profile={profile} email={user?.email} />
      <ProfileSummaryCard profile={profile} />
      <QuickActionCard />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentAdvisories />
        </div>
        <div>
          <FarmingTipCard />
        </div>
      </div>
    </div>
  );
};

