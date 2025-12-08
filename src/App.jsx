import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import Sign from './pages/sign';
import AuthSuccess from './assistant/authSuccess';
import Dashboard from './pages/dashboard';
import Chat from './pages/chat';
import UserList from './pages/userList';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sign" element={<Sign />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/users" element={<UserList />} />
          {/* Add a catch-all route to redirect to dashboard */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
