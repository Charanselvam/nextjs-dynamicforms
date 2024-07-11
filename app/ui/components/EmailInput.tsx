const EmailInput = ({ name, value, onChange, placeholder, required, className }) => (
  <input
    type="email"
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className={className}
  />
);

export default EmailInput;
