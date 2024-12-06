import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { clinikoService } from '../services/cliniko/service';
import { LoadingSpinner } from './LoadingSpinner';

const schema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
});

type FormData = z.infer<typeof schema>;

interface ApiKeyFormProps {
  onSuccess: () => void;
}

export function ApiKeyForm({ onSuccess }: ApiKeyFormProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [syncProgress, setSyncProgress] = useState<number | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsValidating(true);
    setError('');
    setSyncProgress(null);

    try {
      // Use the API key exactly as provided without modifications
      console.log('Setting API key...');
      clinikoService.setApiKey(data.apiKey);
      
      console.log('Validating API key...');
      const isValid = await clinikoService.validateApiKey();
      
      if (!isValid) {
        throw new Error('Invalid API key. Please check your credentials and try again.');
      }

      console.log('API key is valid, starting sync...');
      setSyncProgress(0);
      
      await clinikoService.syncPatients((progress) => {
        setSyncProgress(Math.round(progress));
      });
      
      console.log('Sync complete!');
      onSuccess();
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to validate API key');
      setSyncProgress(null);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
            Cliniko API Key
          </label>
          <div className="mt-1">
            <input
              {...register('apiKey')}
              type="password"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your API key"
              autoComplete="off"
            />
            {errors.apiKey && (
              <p className="mt-1 text-sm text-red-600">{errors.apiKey.message}</p>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter your API key exactly as shown in Cliniko - do not add or remove any characters
          </p>
        </div>

        {syncProgress !== null && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Syncing patient data...</span>
              <span>{syncProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isValidating}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {isValidating ? <LoadingSpinner /> : 'Connect to Cliniko'}
        </button>
      </form>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          How to get your API key:
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Log in to your Cliniko account</li>
          <li>Go to Settings → Integrations</li>
          <li>Click "Create API Key"</li>
          <li>Copy the entire API key</li>
          <li>Paste it here exactly as shown - do not modify it</li>
        </ol>
      </div>
    </div>
  );
}