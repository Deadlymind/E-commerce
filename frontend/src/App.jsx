import { useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

import Login from './views/auth/Login';
import Register from './views/auth/Register';

function App() {
  const [count, setCount] = useState(0);

  return (
    
    <BrowserRouter>
    
      <Routes>
        
        {/* Add a route for "/" */}
        <Route path="/" element={<Navigate to="/" />} />
        {/* Define the "/login" route */}
        <Route path="/login" element={<Login />} />
        {/* Define the "/register" route */}
        <Route path="/register" element={<Register />} />
        {/* Add a fallback route for unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Fallback "Not Found" Component
function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

export default App;
