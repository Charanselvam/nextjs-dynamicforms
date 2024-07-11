const TelInput = ({ name, value, onChange, placeholder, required, className }) => (
  <input
    type="tel"
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className={className}
  />
);

export default TelInput;
