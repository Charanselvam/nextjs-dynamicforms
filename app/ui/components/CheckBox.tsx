const CheckBox = ({ name, value, onChange, placeholder, required, className }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      name={name}
      checked={value}
      onChange={onChange}
      required={required}
      className={`form-checkbox ${className}`}
    />
    <label className="ml-2 text-gray-700">{placeholder}</label>
  </div>
);

export default CheckBox;
