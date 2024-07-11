"use client";

import { useState, useEffect } from 'react';
import TextBox from './ui/components/TextBox';
import EmailInput from './ui/components/EmailInput';
import DateInput from './ui/components/DateInput';
import Dropdown from './ui/components/Dropdown';
import TelInput from './ui/components/TelInput';
import CheckBox from './ui/components/CheckBox';
import RadioButton from './ui/components/RadioButton';
import Section from './ui/components/Section';
import ToggleButton from './ui/components/ToggleButton';
import { fetchFormData, saveFormData, generateUniqueId } from './utils/formHelpers';

const componentMap = {
  text: TextBox,
  email: EmailInput,
  date: DateInput,
  select: Dropdown,
  tel: TelInput,
  checkbox: CheckBox,
  radio: RadioButton,
  toggle: ToggleButton
};

const IndexPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const initializeForm = async () => {
      try {
        const jsonData = await fetchFormData();
        setData(jsonData);
      } catch (error) {
        console.error('Error initializing form:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeForm();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const sectionName = data.sections[currentSectionIndex].title.trim();

    setFormData(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [name.trim()]: type === 'checkbox' ? checked : value
      }
    }));

    // Clear errors for the field being edited
    setErrors(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [name.trim()]: ''
      }
    }));
  };

  const validateSection = () => {
    const currentSection = data.sections[currentSectionIndex];
    const sectionName = currentSection.title.trim();
    const sectionErrors = {};

    currentSection.components.forEach(component => {
      if (component.required && !formData[sectionName]?.[component.name.trim()]) {
        sectionErrors[component.name.trim()] = `${component.name.trim()} is required.`;
      }
    });

    if (Object.keys(sectionErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        [sectionName]: sectionErrors
      }));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateSection()) {
      console.log("Form data after completing current section:", formData);
      if (currentSectionIndex < data.sections.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (validateSection()) {
      try {
        const result = await saveFormData(formData);
        console.log('Form submitted successfully:', result);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Error loading form configuration.</div>;
  }

  const currentSection = data.sections[currentSectionIndex];
  const nextSectionName = data.sections[currentSectionIndex + 1]?.title;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{currentSection.title}</h1>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
        <Section title={currentSection.title}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSection.components.map((component, idx) => {
              const Component = componentMap[component.type];
              if (!Component) return null;

              return (
                <div key={idx} className="flex flex-col">
                  <label className="mb-2 text-gray-700 font-semibold">{component.name.trim()}</label>
                  <Component
                    name={component.name.trim()}
                    value={formData[currentSection.title]?.[component.name.trim()] || ''}
                    onChange={handleChange}
                    placeholder={component.placeholder}
                    required={component.required}
                    options={component.options}
                    className={component.className}
                  />
                  {errors[currentSection.title]?.[component.name.trim()] && (
                    <span className="text-red-500">{errors[currentSection.title][component.name.trim()]}</span>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className={`py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 ${currentSectionIndex === 0 && 'opacity-50 cursor-not-allowed'}`}
            disabled={currentSectionIndex === 0}
          >
            Back
          </button>
          {currentSectionIndex < data.sections.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Continue to {nextSectionName}
            </button>
          ) : (
            <button
              type="submit"
              className="py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default IndexPage;
