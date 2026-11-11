import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { AdvisoryRecord } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { ArrowLeft, Trash2, Calendar, FileText } from 'lucide-react';

export const HistoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [advisory, setAdvisory] = useState<AdvisoryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      api.history
        .get(id)
        .then((data) => setAdvisory(data))
        .catch((err) => setError(err.message || 'Advisory not found'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = async () => {
    if (!id || !confirm('Permanently delete this advisory record?')) return;
    try {
      await api.history.delete(id);
      navigate('/history');
    } catch (err: any) {
      alert(err.message || 'Failed to delete advisory');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 py-8">
        <SkeletonLoader className="h-8 w-64" />
        <SkeletonLoader className="h-40 w-full" />
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <Alert type="danger" title="Not Found">
          {error || 'Advisory record not found'}
        </Alert>
        <Link to="/history" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            &larr; Back to History
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-agri-700 hover:text-agri-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Records</span>
        </Link>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          icon={<Trash2 className="w-4 h-4" />}
        >
          Delete Record
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-2 text-xs font-semibold text-agri-700 mb-1">
          <FileText className="w-4 h-4" />
          <span className="uppercase tracking-wider">{advisory.advisory_type.replace('_', ' ')}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-agri-950 mb-2">
          {advisory.title}
        </h1>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Calendar className="w-3.5 h-3.5" />
          <span>Recorded on {new Date(advisory.created_at).toLocaleString()}</span>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-cream-50 p-4 rounded-xl border border-earth-100">
            <h3 className="font-bold text-agri-950 mb-2">Input Telemetry</h3>
            <pre className="text-xs bg-white p-3 rounded-lg border border-gray-200 overflow-x-auto text-gray-800">
              {JSON.stringify(advisory.input_data, null, 2)}
            </pre>
          </div>

          <div className="bg-white p-4 rounded-xl border border-earth-100">
            <h3 className="font-bold text-agri-950 mb-2">AI Response Protocol</h3>
            <pre className="text-xs bg-cream-50 p-3 rounded-lg border border-gray-200 overflow-x-auto text-gray-800">
              {JSON.stringify(advisory.result_data, null, 2)}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
};

