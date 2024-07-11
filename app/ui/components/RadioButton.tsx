const RadioButton = ({ name, value, onChange, placeholder, required, options, className }) => (
  <div className={className}>
    {options.map((option, index) => (
      <label key={index} className="flex items-center space-x-2">
        <input
          type="radio"
          name={name}
          value={option.Value}
          checked={value === option.Value}
          onChange={onChange}
          required={required}
          className="form-radio"
        />
        <span>{option.DisplayValue}</span>
      </label>
    ))}
  </div>
);

export default RadioButton;
