import { useState } from 'react';
import { TimeFrameOption } from '../../types/demo';
import { useRetentionMetrics } from '../../services/cliniko/hooks/useRetentionMetrics';
import { MetricsOverview } from './MetricsOverview';
import { DropOffChart } from './DropOffChart';
import { ActionableInsights } from './ActionableInsights';
import { LoadingSpinner } from '../LoadingSpinner';

const TIME_FRAME_OPTIONS: TimeFrameOption[] = [
  { label: 'Last 30 Days', value: 30 },
  { label: 'Last 90 Days', value: 90 },
  { label: 'Last 180 Days', value: 180 },
];

export function RetentionDashboard() {
  const [timeFrame, setTimeFrame] = useState<number>(30);
  const { metrics, isLoading, error } = useRetentionMetrics(timeFrame);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Patient Retention Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(Number(e.target.value))}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {TIME_FRAME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <MetricsOverview metrics={metrics} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <DropOffChart metrics={metrics} />
          <ActionableInsights onActionClick={() => {}} />
        </div>
      </div>
    </div>
  );
}