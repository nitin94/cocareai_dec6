import { useNavigate } from 'react-router-dom';
import { ApiKeyForm } from './ApiKeyForm';

export function ClinikoSetup() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/demo-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Connect to Cliniko
          </h1>
          <p className="mt-2 text-gray-600">
            Enter your Cliniko API key to start tracking patient retention
          </p>
        </div>

        <ApiKeyForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}