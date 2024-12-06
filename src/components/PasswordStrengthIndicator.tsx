import { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    return Math.min(score, 4);
  }, [password]);

  const getColor = () => {
    switch (strength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getMessage = () => {
    switch (strength) {
      case 0: return 'Enter a password';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="mt-1">
      <div className="flex gap-1 h-1 mb-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-full w-1/4 rounded-full transition-colors ${
              i < strength ? getColor() : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${strength > 2 ? 'text-green-600' : 'text-gray-500'}`}>
        {getMessage()}
      </p>
    </div>
  );
};