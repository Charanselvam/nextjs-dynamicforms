'use client';

import React from 'react';

interface ProfileClientComponentProps {
  userData: Record<string, Record<string, string>>;
}

const ProfileClientComponent: React.FC<ProfileClientComponentProps> = ({ userData }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {Object.keys(userData).map((section) => (
        <div key={section} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{section}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(userData[section]).map((key) => (
              <div key={key} className="flex flex-col">
                <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                <span>{userData[section][key]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileClientComponent;
