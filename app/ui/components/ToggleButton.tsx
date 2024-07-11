import React from 'react';

const ToggleButton = ({ name, value, onChange, required }) => {
  return (
    <div className="flex items-center">
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            name={name}
            checked={value}
            onChange={onChange}
            required={required}
            className="sr-only"
          />
          <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
          <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${value ? 'transform translate-x-full bg-green-500' : 'bg-red-500'}`}></div>
        </div>
        <div className="ml-3 text-gray-700">{value ? 'Yes' : 'No'}</div>
      </label>
    </div>
  );
};

export default ToggleButton;
