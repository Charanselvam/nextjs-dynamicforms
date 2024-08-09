'use client';

import { useEffect, useState } from 'react';
import ProfileClientComponent from '../profile/ProfileClientComponent';
import { getFormData as fetchUserData } from '../utils/formHelpers'; // Import your utility function

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetchUserData = async (userId) => {
    setLoading(true); // Start loading
    try {
      const data = await fetchUserData(userId); // Fetch the user data using the utility function
      setUserData(data);
      setError('');
    } catch (err) {
      setError('User not found');
      setUserData(null);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    async function fetchMatches() {
      const response = await fetch('/api/matches');
      const data = await response.json();
      setMatches(data);
    }

    fetchMatches();
  }, []);

  const handleCardClick = (userId) => {
    handleFetchUserData(userId); // Fetch the user data when a card is clicked
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Matches</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <MatchCard 
            key={match.userId} 
            userId={match.userId} 
            firstName={match.data['Personal Information']?.firstName}
            lastName={match.data['Personal Information']?.lastName} 
            profession={match.data['Educational Information']?.occupation} 
            onClick={() => handleCardClick(match.userId)} // Pass userId to handleCardClick
          />
        ))}
      </div>

      {loading && <p className="text-gray-500 mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {userData && <ProfileClientComponent userData={userData} userId={userData.userId} />}
    </div>
  );
}

function MatchCard({ userId, firstName, lastName, profession, onClick }) {
  return (
    <div 
      className="bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer" 
      onClick={onClick} // Trigger the function on click
    >
      <h2 className="text-xl font-semibold">{firstName || 'N/A'} {lastName}</h2>
      <p className="text-gray-700">User ID: {userId}</p>
      <p className="text-gray-700">Profession: {profession || 'N/A'}</p>
    </div>
  );
}
