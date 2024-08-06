'use client';

import React, { useState, useEffect } from 'react';
import { fetchFormData } from '../utils/formHelpers';

interface ProfileClientComponentProps {
  userData: Record<string, Record<string, string>>;
}

const ProfileClientComponent: React.FC<ProfileClientComponentProps> = ({ userData }) => {
  const [formConfig, setFormConfig] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const loadFormConfig = async () => {
      try {
        const config = await fetchFormData();
        setFormConfig(config);
      } catch (error) {
        console.error('Failed to fetch form configuration:', error);
      }
    };

    loadFormConfig();
  }, []);

  const handleEditClick = (section: string) => {
    setEditSection(section);
    setEditData({ ...userData[section] });
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: string) => {
    if (editData) {
      setEditData({ ...editData, [key]: e.target.value });
    }
  };

  const handleSave = () => {
    if (editSection && editData) {
      userData[editSection] = editData;
      setIsEditing(false);
      setEditSection(null);
      setEditData(null);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setEditSection(null);
    setEditData(null);
  };

  const getDisplayValue = (section: string, key: string, value: string) => {
    const sectionConfig = formConfig.sections?.find((sec: any) => sec.title === section)?.components.find((comp: any) => comp.keyName === key);
    if (sectionConfig?.options) {
      const option = sectionConfig.options.find((opt: any) => opt.Value === value);
      return option ? option.DisplayValue : value;
    }
    return value;
  };

  const getDisplayName = (section: string, key: string) => {
    const sectionConfig = formConfig.sections?.find((sec: any) => sec.title === section)?.components.find((comp: any) => comp.keyName === key);
    return sectionConfig ? sectionConfig.displayName : key;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>

      {Object.keys(userData).map((section) => (
        <div key={section} className="mb-8 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-600">{section}</h2>
            <button
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => handleEditClick(section)}
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(userData[section]).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-semibold text-gray-600">
                  {getDisplayName(section, key).replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </span>
                <span className="text-lg font-medium text-gray-800">
                  {getDisplayValue(section, key, value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {isEditing && editSection && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 max-h-full overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Edit {editSection}</h3>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(editData).map(([key, value]) => {
                const sectionConfig = formConfig.sections?.find((sec: any) => sec.title === editSection)?.components.find((comp: any) => comp.keyName === key);
                return (
                  <div key={key} className="flex flex-col mb-4">
                    <label className="font-medium text-gray-700 mb-2">
                      {getDisplayName(editSection, key).replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    {sectionConfig?.options ? (
                      <select 
                        value={value}
                        onChange={(e) => handleInputChange(e, key)}
                        className="p-2 bg-white border border-gray-300 rounded-md"
                      >
                        {sectionConfig.options.map((option: any) => (
                          <option key={option.Value} value={option.Value}>
                            {option.DisplayValue}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input 
                        type={sectionConfig?.type || "text"}
                        value={value}
                        onChange={(e) => handleInputChange(e, key)}
                        className="p-2 bg-white border border-gray-300 rounded-md"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={handleSave} 
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Save
              </button>
              <button 
                onClick={handleClose} 
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileClientComponent;
