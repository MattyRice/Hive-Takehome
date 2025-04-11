import { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Dropdown.css';

// Constants for virtualization
const ITEM_HEIGHT = 40; // Height of each dropdown item in pixels (must be fixed for virtualization to work)
const MAX_VISIBLE_ITEMS = 10; // Maximum number of items visible at once (controls the viewport size)

const VirtualizedDropdown = ({
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
  
  // State for search input
  const [searchValue, setSearchValue] = useState('');
  
  // Scroll position state
  // This tracks how far the user has scrolled and is essential for the virtualization
  const [scrollTop, setScrollTop] = useState(0);
  
  // Filtered options based on search
  const filteredOptions = useMemo(() => {
    return isSearchable 
      ? options.filter(option => 
          option.label.toLowerCase().includes(searchValue.toLowerCase()))
      : options;
  }, [options, searchValue, isSearchable]);
  
  // Refs
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  
  // Calculate visible options based on scroll position
  // This is a crucial part of the virtualization mechanism
  const visibleOptions = useMemo(() => {
    // If there are no filtered options, return an empty array
    if (!filteredOptions.length) return [];
    
    // Calculate the starting index based on current scroll position
    // We divide scrollTop by ITEM_HEIGHT to determine how many items have been scrolled past
    // Math.floor ensures we get a whole number index
    const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
    
    // Calculate the ending index by adding the maximum number of visible items
    // We use Math.min to make sure we don't exceed the length of the options array
    const endIndex = Math.min(
      startIndex + MAX_VISIBLE_ITEMS,
      filteredOptions.length
    );
    
    // Slice the filtered options to get only the visible ones
    // We map each option to include its absolute position index
    // This index is used to position the item absolutely in the virtual scroll container
    return filteredOptions.slice(startIndex, endIndex).map((option, index) => ({
      ...option,                // Keep all original option properties (value, label, etc.)
      index: startIndex + index // Add the absolute index for positioning
    }));
    
    // Only recalculate when filteredOptions or scrollTop changes
    // This optimization prevents unnecessary calculations on each render
  }, [filteredOptions, scrollTop]);
  
  // Get displayed value based on selection type (single/multi)
  const getDisplayValue = () => {
    if (!value) return placeholder;
    
    if (isMulti) {
      if (Array.isArray(value) && value.length > 0) {
        if (value.length === 1) {
          return value[0].label;
        }
        return `${value.length} items selected`;
      }
      return placeholder;
    } else {
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
      const newValue = Array.isArray(value) ? [...value] : [];
      const index = newValue.findIndex(item => item.value === option.value);
      
      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        newValue.push(option);
      }
      
      onChange(newValue);
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };
  
  // Handle select/deselect all
  const handleSelectAll = () => {
    if (!isMulti) return;
    
    if (Array.isArray(value) && value.length === options.length) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };
  
  // Handle scroll events
  // This updates the scrollTop state when the user scrolls
  // The scrollTop value is used to determine which items should be rendered
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
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
      setScrollTop(0);
    }
  }, [isOpen]);
  
  // Calculate total menu height
  // This represents the total scrollable height as if all items were rendered
  // It's used to create the correct scroll area even though we're only rendering visible items
  const menuHeight = filteredOptions.length * ITEM_HEIGHT;
  
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
        <div 
          className="dropdown-menu"
          style={{ maxHeight: `${MAX_VISIBLE_ITEMS * ITEM_HEIGHT}px` }}
        >
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
            <div 
              ref={menuRef} 
              className="dropdown-virtualized-view"
              style={{ 
                height: `${Math.min(MAX_VISIBLE_ITEMS * ITEM_HEIGHT, menuHeight)}px`,
                overflowY: 'auto' 
              }}
              onScroll={handleScroll}
            >
              {/* 
                The outer container has a fixed height (up to MAX_VISIBLE_ITEMS * ITEM_HEIGHT) 
                with overflow-y: auto to enable scrolling 
              */}
              <div style={{ height: `${menuHeight}px`, position: 'relative' }}>
                {/* 
                  This inner container has the full height of all items combined
                  It creates the scrollable area as if all items were rendered
                  The position: relative creates a positioning context for the absolute positioned items
                */}
                {visibleOptions.map(option => (
                  <div
                    key={option.value}
                    className={`dropdown-item ${isSelected(option) ? 'selected' : ''}`}
                    onClick={() => handleSelect(option)}
                    style={{
                      position: 'absolute', // Absolute positioning is key to virtualization
                      top: `${option.index * ITEM_HEIGHT}px`, // Position based on the item's index
                      height: `${ITEM_HEIGHT}px`, // Fixed height is required for calculation
                      left: 0,
                      right: 0
                    }}
                  >
                    {/* 
                      Each item is positioned absolutely at the correct offset
                      This creates the illusion that all items exist in the DOM
                      When scrolling occurs, items are repositioned or replaced as needed
                    */}
                    {isMulti && (
                      <span className="checkbox">
                        {isSelected(option) && "✓"}
                      </span>
                    )}
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

VirtualizedDropdown.propTypes = {
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

export default VirtualizedDropdown; 