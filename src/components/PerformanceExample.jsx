import { useState, useMemo } from 'react';
import Dropdown from './Dropdown';

const PerformanceExample = () => {
  // Generate a large list of options for performance testing
  const largeOptionsList = useMemo(() => {
    const options = [];
    for (let i = 1; i <= 1000; i++) {
      options.push({
        value: `item-${i}`,
        label: `Item ${i}`
      });
    }
    return options;
  }, []);

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  return (
    <div className="example-container">
      <h2>Performance Test - 1000 Items</h2>
      
      <div className="dropdown-row">
        <div>
          <h3>Single Select</h3>
          <Dropdown
            options={largeOptionsList}
            value={selectedOption}
            onChange={setSelectedOption}
            placeholder="Select from 1000 items..."
            isSearchable={true}
          />
          <p>Selected: {selectedOption?.label || 'None'}</p>
        </div>
        
        <div>
          <h3>Multi Select</h3>
          <Dropdown
            options={largeOptionsList}
            value={selectedOptions}
            onChange={setSelectedOptions}
            placeholder="Select from 1000 items..."
            isMulti={true}
            isSearchable={true}
          />
          <p>Selected: {selectedOptions.length} items</p>
        </div>
      </div>
      
      <div className="example-note">
        <p>
          <strong>Note:</strong> This example demonstrates the dropdown's ability
          to handle large lists efficiently. The search functionality enables quick
          filtering of the 1000 items.
        </p>
      </div>
    </div>
  );
};

export default PerformanceExample; 