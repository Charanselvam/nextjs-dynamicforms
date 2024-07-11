export const generateUniqueId = () => {
    return 'user-' + Math.random().toString(36).substr(2, 9);
  };
  
  export const fetchFormData = async () => {
    try {
      const response = await fetch('/formConfig.json');
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error('Error fetching form configuration:', error);
      throw error;
    }
  };
  
  export const saveFormData = async (formData) => {
    try {
      const response = await fetch('/api/form/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: generateUniqueId(),
          formData
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving form data:', error);
      throw error;
    }
  };
  