function Input({
  label,
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="mb-5">
      <label className="block text-gray-300 mb-2">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500"
      />
    </div>
  );
}

export default Input;