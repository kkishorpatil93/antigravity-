import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { Settings, Globe, ShieldAlert, Trash2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    const confirmation = prompt(
      'WARNING: This will permanently delete your account, soil profiles, and all advisory records. Type "DELETE" to confirm:'
    );
    if (confirmation !== 'DELETE') return;

    setDeleteLoading(true);
    setErrorMsg(null);
    try {
      await api.account.delete();
      await signOut();
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete account');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-agri-950">
            {t.common.settings}
          </h1>
          <p className="text-xs text-gray-500">
            Manage your language preferences and farmer account credentials
          </p>
        </div>
      </div>

      {errorMsg && <Alert type="danger">{errorMsg}</Alert>}

      <Card title="Language & Regional Localization">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div>
            <div className="flex items-center gap-2 font-semibold text-sm text-agri-950">
              <Globe className="w-4 h-4 text-agri-700" />
              <span>Preferred Advisory Output Language</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 max-w-md">
              Switching language translates both the application user interface and all Gemini AI-generated agronomic recommendations.
            </p>
          </div>
          <LanguageSelector />
        </div>
      </Card>

      <Card title="Account Information">
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Registered Email</span>
            <span className="font-semibold text-gray-900">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Full Name</span>
            <span className="font-semibold text-gray-900">{profile?.full_name || 'Not set'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Account ID</span>
            <span className="font-mono text-xs text-gray-500">{user?.id}</span>
          </div>
        </div>
      </Card>

      <Card title="Danger Zone" className="border-red-200 bg-red-50/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div>
            <div className="flex items-center gap-2 font-semibold text-sm text-red-950">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Delete Farmer Account</span>
            </div>
            <p className="text-xs text-red-800 mt-1 max-w-md">
              Permanently delete your login, personal land data, and all historical crop pathology and advisory records.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            isLoading={deleteLoading}
            onClick={handleDeleteAccount}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

