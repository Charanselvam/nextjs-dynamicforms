import React from 'react';
import ProfileClientComponent from './ProfileClientComponent';

const fetchUserData = async (userId: string) => {
  const response = await fetch(`http://localhost:3000/api/form/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
};

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const userId = params.userId;
  const userData = await fetchUserData(userId);

  return <ProfileClientComponent userData={userData} />;
}
