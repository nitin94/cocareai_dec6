import { RetentionMetrics, RetentionStage } from '../../types/demo';

interface DropOffChartProps {
  metrics: RetentionMetrics;
}

export function DropOffChart({ metrics }: DropOffChartProps) {
  const stages = [
    {
      stage: RetentionStage.PRE_FIRST_VISIT,
      label: 'Pre-First Visit',
      count: metrics.dropOffsByStage.PRE_FIRST_VISIT,
      color: 'blue',
    },
    {
      stage: RetentionStage.AFTER_FIRST_VISIT,
      label: 'After First Visit',
      count: metrics.dropOffsByStage.AFTER_FIRST_VISIT,
      color: 'green',
    },
    {
      stage: RetentionStage.DURING_TREATMENT,
      label: 'During Treatment',
      count: metrics.dropOffsByStage.DURING_TREATMENT,
      color: 'indigo',
    },
    {
      stage: RetentionStage.POST_TREATMENT,
      label: 'Post-Treatment',
      count: metrics.dropOffsByStage.POST_TREATMENT,
      color: 'purple',
    },
  ];

  const maxCount = Math.max(...Object.values(metrics.dropOffsByStage));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Patient Drop-offs by Stage
      </h2>
      <div className="space-y-6">
        {stages.map(({ stage, label, count, color }) => (
          <div key={stage}>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">{label}</span>
              <span>{count} patients</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className={`bg-${color}-600 h-3 rounded-full transition-all duration-500`}
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}