// Example: TextBox Component
const TextBox = ({ name, value, onChange, placeholder, required }) => (
  <input
    type="text"
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className="form-input"
  />
);

export default TextBox;
