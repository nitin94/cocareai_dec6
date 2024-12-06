import { User } from 'firebase/auth';
import { auth } from '../config/firebase';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="text-center">
      <img
        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`}
        alt={user.displayName || 'User'}
        className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full mx-auto mb-4 md:mb-6"
      />
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2 md:mb-3">
        Welcome, {user.displayName || user.email}!
      </h2>
      <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base lg:text-lg">
        {user.email}
      </p>
      <button
        onClick={() => auth.signOut()}
        className="bg-red-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base font-medium"
      >
        Sign Out
      </button>
    </div>
  );
}