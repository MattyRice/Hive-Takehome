import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Dropdown.css';

const Dropdown = ({
  options = [],
  value = null,
  onChange,
  placeholder = 'Select...',
  isMulti = false,
  isSearchable = false,
  className = '',
  disabled = false,
}) => {
  // State for managing dropdown visibility
  const [isOpen, setIsOpen] = useState(false);
  
  // State for search input (optional feature)
  const [searchValue, setSearchValue] = useState('');
  
  // Filtered options based on search
  const filteredOptions = isSearchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchValue.toLowerCase()))
    : options;
  
  // Ref for handling clicks outside
  const dropdownRef = useRef(null);
  
  // Get displayed value based on selection type (single/multi)
  const getDisplayValue = () => {
    if (!value) return placeholder;
    
    if (isMulti) {
      // For multi-select, show selected count or labels
      if (Array.isArray(value) && value.length > 0) {
        if (value.length === 1) {
          return value[0].label;
        }
        return `${value.length} items selected`;
      }
      return placeholder;
    } else {
      // For single select, show selected label
      return value.label || placeholder;
    }
  };
  
  // Check if option is selected
  const isSelected = (option) => {
    if (!value) return false;
    
    if (isMulti) {
      return Array.isArray(value) && value.some(item => item.value === option.value);
    } else {
      return value.value === option.value;
    }
  };
  
  // Handle option selection
  const handleSelect = (option) => {
    if (isMulti) {
      // For multi-select, toggle selection
      const newValue = Array.isArray(value) ? [...value] : [];
      const index = newValue.findIndex(item => item.value === option.value);
      
      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        newValue.push(option);
      }
      
      onChange(newValue);
    } else {
      // For single select, set the value and close dropdown
      onChange(option);
      setIsOpen(false);
    }
  };
  
  // Handle select/deselect all
  const handleSelectAll = () => {
    if (!isMulti) return;
    
    if (Array.isArray(value) && value.length === options.length) {
      // Deselect all if all are selected
      onChange([]);
    } else {
      // Select all
      onChange([...options]);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  
  // Reset search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchValue('');
    }
  }, [isOpen]);
  
  return (
    <div 
      className={`dropdown-container ${className} ${disabled ? 'disabled' : ''}`}
      ref={dropdownRef}
    >
      <div 
        className={`dropdown-header ${isOpen ? 'open' : ''}`} 
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="dropdown-selected-value">{getDisplayValue()}</div>
        <div className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
          <span>▼</span>
        </div>
      </div>
      
      {isOpen && !disabled && (
        <div className="dropdown-menu">
          {isSearchable && (
            <div className="dropdown-search">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          
          {isMulti && (
            <div 
              className="dropdown-item select-all"
              onClick={handleSelectAll}
            >
              {Array.isArray(value) && value.length === options.length
                ? "Deselect All"
                : "Select All"
              }
            </div>
          )}
          
          {filteredOptions.length === 0 ? (
            <div className="dropdown-no-options">No options found</div>
          ) : (
            filteredOptions.map(option => (
              <div
                key={option.value}
                className={`dropdown-item ${isSelected(option) ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {isMulti && (
                  <span className="checkbox">
                    {isSelected(option) && "✓"}
                  </span>
                )}
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  // Array of options with value and label
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  // Selected value(s) - object for single, array for multi
  value: PropTypes.oneOfType([
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
      })
    ),
  ]),
  // Change handler
  onChange: PropTypes.func.isRequired,
  // Placeholder text when no selection
  placeholder: PropTypes.string,
  // Whether multiple selections are allowed
  isMulti: PropTypes.bool,
  // Whether to enable search functionality
  isSearchable: PropTypes.bool,
  // Additional CSS class name
  className: PropTypes.string,
  // Whether the dropdown is disabled
  disabled: PropTypes.bool,
};

export default Dropdown; 