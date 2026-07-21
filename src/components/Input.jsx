function Input({
  label,
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="mb-5">
      {/* Label - transitions between dark text (light mode) and light text (dark mode) */}
      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium transition-colors duration-300">
        {label}
      </label>

      {/* Input - transitions background, border, text, and placeholder colors */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-blue-500 transition-all duration-300"
      />
    </div>
  );
}

export default Input;