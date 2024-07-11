const Dropdown = ({ name, value, onChange, placeholder, required, options, className }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    required={required}
    className={className}
  >
    <option value="" disabled>{placeholder}</option>
    {options.map((option, index) => (
      <option key={index} value={option.Value}>{option.DisplayValue}</option>
    ))}
  </select>
);

export default Dropdown;
