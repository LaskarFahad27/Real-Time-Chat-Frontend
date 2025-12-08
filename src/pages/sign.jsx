import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';

function Sign() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-6 bg-white/30 backdrop-blur-sm p-1 rounded-2xl shadow-lg">
        <div className="flex rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-300 ${
              showLogin
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-transparent text-gray-600 hover:bg-white/50'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-300 ${
              !showLogin
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-transparent text-gray-600 hover:bg-white/50'
            }`}
          >
            Register
          </button>
        </div>
      </div>
      
      {showLogin ? <LoginForm /> : <RegistrationForm />}
    </div>
  );
}

export default Sign;