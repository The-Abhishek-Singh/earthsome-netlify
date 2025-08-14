'use client';

import { useSession } from 'next-auth/react';

const DebugSession = () => {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Session Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <p className="text-lg">Status: <span className="font-mono">{status}</span></p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Session Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        {session?.user && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">User Object Details</h2>
            <div className="space-y-2">
              <p><strong>ID:</strong> {session.user.id || 'undefined'}</p>
              <p><strong>Email:</strong> {session.user.email || 'undefined'}</p>
              <p><strong>Name:</strong> {session.user.name || 'undefined'}</p>
              <p><strong>Image:</strong> {session.user.image || 'undefined'}</p>
              <p><strong>isAdmin:</strong> {session.user.isAdmin ? 'true' : 'false'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugSession;
