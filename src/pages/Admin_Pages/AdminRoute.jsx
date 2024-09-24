// AdminRoute.js
import { Route,  } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function AdminRoute({ roles, ...rest }) {
  if (!roles.admin) {
    return <Navigate to="/login" />;
  }

  return <Route {...rest} />;
}

export default AdminRoute;
