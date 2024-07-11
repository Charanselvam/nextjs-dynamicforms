import { useState, useEffect, useRef } from 'react';

const DropdownCheckbox = ({ name, value, onChange, placeholder, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(value || []);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (optionValue) => {
    const updatedValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(val => val !== optionValue)
      : [...selectedValues, optionValue];
    
    setSelectedValues(updatedValues);
    onChange({ target: { name, value: updatedValues } });
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button" 
        className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg"
        onClick={toggleDropdown}
      >
        {selectedValues.length > 0 ? selectedValues.join(', ') : placeholder}
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white shadow-lg rounded-lg z-10">
          {options.map((option, idx) => (
            <label key={idx} className="flex items-center p-2">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.Value)}
                onChange={() => handleCheckboxChange(option.Value)}
              />
              <span className="ml-2">{option.DisplayValue}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownCheckbox;
