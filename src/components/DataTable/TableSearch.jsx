import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * TableSearch Component - Real-time search input for DataTable
 *
 * @param {Object} props
 * @param {String} props.value - Current search value
 * @param {Function} props.onChange - onChange handler
 * @param {String} props.placeholder - Input placeholder
 */
export const TableSearch = ({
  value,
  onChange,
  placeholder = 'Search...'
}) => {
  return (
    <div className="relative flex-1 max-w-md">
      <MagnifyingGlassIcon className="w-5 h-5 text-text-secondary absolute left-3 top-1/2 transform -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-accent transition-colors"
          title="Clear search"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
