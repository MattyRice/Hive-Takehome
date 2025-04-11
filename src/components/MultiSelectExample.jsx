import { useState } from 'react';
import Dropdown from './Dropdown';

const MultiSelectExample = () => {
  const options = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
    { value: 'orange', label: 'Orange' },
    { value: 'pink', label: 'Pink' },
    { value: 'brown', label: 'Brown' },
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);

  return (
    <div className="example-container">
      <h2>Multi Select Dropdown</h2>
      <p>
        Selected colors ({selectedOptions.length}): 
        {selectedOptions.length > 0 
          ? selectedOptions.map(option => option.label).join(', ')
          : ' None'}
      </p>
      
      <Dropdown
        options={options}
        value={selectedOptions}
        onChange={setSelectedOptions}
        placeholder="Select colors..."
        isMulti={true}
        isSearchable={true}
      />
      
      <div className="example-actions">
        <button onClick={() => setSelectedOptions([])}>
          Clear All
        </button>
        <button onClick={() => setSelectedOptions(options.slice(0, 3))}>
          Select RGB Colors
        </button>
        <button onClick={() => setSelectedOptions(options)}>
          Select All
        </button>
      </div>
    </div>
  );
};

export default MultiSelectExample; 