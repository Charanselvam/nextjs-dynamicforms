// Example: TextBox Component
const TextArea = ({ name, value, onChange, placeholder, required }) => (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="form-input"
    />
  );
  
  export default TextArea;
  