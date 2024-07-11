const DateInput = ({ name, value, onChange, placeholder, required, className }) => (
  <input
    type="date"
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className={className}
  />
);

export default DateInput;
