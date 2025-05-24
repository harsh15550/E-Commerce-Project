import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// ProtectedRoute Component: This component protects routes that should be accessible only to authenticated users
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(state => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children; 
};

// PublicRoute Component: This component protects routes that should not be accessible to authenticated users (like login/signup)
const PublicRoute = ({ children }) => {
  const { user } = useSelector(state => state.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const SellerProtectedRoute = ({ children }) => {
  const { user } = useSelector(state => state.user);

  if (user && user.role === 'buyer') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export { ProtectedRoute, PublicRoute, SellerProtectedRoute };
