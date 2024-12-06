import { useState, useEffect } from 'react';
import { demoDataService } from '../../services/demoData';
import { ActionableInsight } from '../../types/demo';
import { formatCurrency } from '../../utils/format';

interface ActionableInsightsProps {
  onActionClick: () => void;
}

export function ActionableInsights({ onActionClick }: ActionableInsightsProps) {
  const [insights, setInsights] = useState<ActionableInsight[]>([]);

  useEffect(() => {
    const loadInsights = async () => {
      const data = await demoDataService.getActionableInsights();
      setInsights(data);
    };
    loadInsights();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Actionable Insights
      </h2>
      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getPriorityColor(
                      insight.priority
                    )}-100 text-${getPriorityColor(insight.priority)}-800`}
                  >
                    {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)} Priority
                  </span>
                  <span className="text-sm text-gray-500">
                    Potential Impact: {formatCurrency(insight.impact)}
                  </span>
                </div>
                <p className="text-sm text-gray-900">{insight.description}</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={onActionClick}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="mr-2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                {insight.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}