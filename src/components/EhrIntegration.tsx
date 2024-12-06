import { useNavigate } from 'react-router-dom';

export function EhrIntegration() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Connect Your EHR System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose how you want to get started with our platform
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Connect to Cliniko
              </h2>
              <p className="text-gray-600 mb-8 h-20">
                Sync your patient data directly from your Cliniko account for seamless integration and real-time updates.
              </p>
              <button
                onClick={() => navigate('/cliniko-setup')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect Cliniko
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Explore Demo Data
              </h2>
              <p className="text-gray-600 mb-8 h-20">
                Try out the platform with sample data to see how it works before connecting your EHR system.
              </p>
              <button
                onClick={() => navigate('/demo-dashboard')}
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Load Demo Data
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              Why connect your EHR?
            </h3>
            <ul className="grid gap-4 md:grid-cols-2">
              <li className="flex items-center text-blue-800">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Automatic patient sync
              </li>
              <li className="flex items-center text-blue-800">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Real-time updates
              </li>
              <li className="flex items-center text-blue-800">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Save time on data entry
              </li>
              <li className="flex items-center text-blue-800">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Advanced analytics
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}