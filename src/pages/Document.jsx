import React, { useContext } from 'react';
import { AuthContext } from '../App';

const Document = () => {
  const { auth } = useContext(AuthContext);

  if (auth.status !== 'Active') {
    alert('You have been inactive. Please contact admin@example.com for activation.');
    return null;
  }

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Document Page</h1>
      <p className="mt-4">
        {auth.permissions.includes('Write')
          ? 'Contribute on this document!'
          : 'Go on! You can read this document.'}
      </p>
    </div>
  );
};

export default Document;
