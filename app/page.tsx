"use client";

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Section from './ui/components/Section';
import { fetchFormData, saveFormData, generateUniqueId } from './utils/formHelpers';

// Dynamic imports for form components
const TextBox = dynamic(() => import('./ui/components/TextBox'));
const EmailInput = dynamic(() => import('./ui/components/EmailInput'));
const DateInput = dynamic(() => import('./ui/components/DateInput'));
const Dropdown = dynamic(() => import('./ui/components/Dropdown'));
const TelInput = dynamic(() => import('./ui/components/TelInput'));
const CheckBox = dynamic(() => import('./ui/components/CheckBox'));
const RadioButton = dynamic(() => import('./ui/components/RadioButton'));
const ToggleButton = dynamic(() => import('./ui/components/ToggleButton'));
const TextArea = dynamic(() => import('./ui/components/TextArea'));

const componentMap = {
  text: TextBox,
  email: EmailInput,
  date: DateInput,
  select: Dropdown,
  tel: TelInput,
  checkbox: CheckBox,
  radio: RadioButton,
  toggle: ToggleButton,
  textarea: TextArea
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

  const handleChange = useCallback((e) => {
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
  }, [currentSectionIndex, data]);

  const validateSection = useCallback(() => {
    const currentSection = data.sections[currentSectionIndex];
    const sectionName = currentSection.title.trim();
    const sectionErrors = {};

    currentSection.components.forEach(component => {
      if (component.required && !formData[sectionName]?.[component.keyName.trim()]) {
        sectionErrors[component.keyName.trim()] = `${component.displayName.trim()} is required.`;
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
  }, [currentSectionIndex, data, formData]);

  const handleNext = useCallback(() => {
    if (validateSection()) {
      if (currentSectionIndex < data.sections.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
      }
    }
  }, [validateSection, currentSectionIndex, data]);

  const handleBack = useCallback(() => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  }, [currentSectionIndex]);

  const handleSubmit = useCallback(async () => {
    if (validateSection()) {
      try {
        const result = await saveFormData(formData);
        console.log('Form submitted successfully:', result);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  }, [validateSection, formData]);

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
                  <label className="mb-2 text-gray-700 font-semibold">{component.displayName}</label>
                  <Component
                    name={component.keyName.trim()}
                    value={formData[currentSection.title]?.[component.keyName.trim()] || ''}
                    onChange={handleChange}
                    placeholder={component.placeholder}
                    required={component.required}
                    options={component.options}
                    className={component.className}
                  />
                  {errors[currentSection.title]?.[component.keyName.trim()] && (
                    <span className="text-red-500">{errors[currentSection.title][component.keyName.trim()]}</span>
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
