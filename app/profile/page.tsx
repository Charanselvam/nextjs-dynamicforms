'use client';

import React, { useState } from 'react';
import ProfileClientComponent from './ProfileClientComponent';
import { getFormData as fetchUserData } from '../utils/formHelpers';



export default function ProfilePage() {
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const handleFetchUserData = async () => {
    try {
      const data = await fetchUserData(userId);
      setUserData(data);
      setError('');
    } catch (err) {
      setError('User not found');
      setUserData(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Enter Username</h1>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter User ID"
        className="border p-2 mb-4"
      />
      <button
        onClick={handleFetchUserData}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Fetch Profile
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {userData && <ProfileClientComponent userData={userData} />}
    </div>
  );
}
