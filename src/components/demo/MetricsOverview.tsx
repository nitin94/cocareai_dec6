import { RetentionMetrics } from '../../types/demo';
import { formatPercent, formatCurrency } from '../../utils/format';

interface MetricsOverviewProps {
  metrics: RetentionMetrics;
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  const cards = [
    {
      title: 'Overall Retention Rate',
      value: formatPercent(metrics.overallRetentionRate),
      trend: metrics.overallRetentionRate > 80 ? 'up' : 'down',
      color: metrics.overallRetentionRate > 80 ? 'green' : 'red',
    },
    {
      title: 'After First Visit Rate',
      value: formatPercent(metrics.afterFirstVisitRate),
      trend: metrics.afterFirstVisitRate > 75 ? 'up' : 'down',
      color: metrics.afterFirstVisitRate > 75 ? 'green' : 'red',
    },
    {
      title: 'Monthly Revenue Loss',
      value: formatCurrency(metrics.monthlyRevenueLoss),
      trend: 'down',
      color: 'red',
    },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white overflow-hidden shadow-lg rounded-lg"
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">
                  {card.title}
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className={`flex-shrink-0 text-${card.color}-500`}>
                {card.trend === 'up' && (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {card.trend === 'down' && (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}