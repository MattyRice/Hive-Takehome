import { useState, useMemo } from 'react';
import VirtualizedDropdown from './VirtualizedDropdown';

const VirtualizedExample = () => {
  // Generate a very large list of options (10,000 items) for virtualization testing
  const hugeOptionsList = useMemo(() => {
    const options = [];
    for (let i = 1; i <= 10000; i++) {
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
      <h2>Virtualized Dropdown - 10,000 Items</h2>
      <p>
        This example uses virtualization to efficiently render only the visible items,
        allowing the dropdown to handle an extremely large dataset (10,000 items) with minimal performance impact.
      </p>
      
      <div className="dropdown-row">
        <div>
          <h3>Single Select (Virtualized)</h3>
          <VirtualizedDropdown
            options={hugeOptionsList}
            value={selectedOption}
            onChange={setSelectedOption}
            placeholder="Select from 10,000 items..."
            isSearchable={true}
          />
          <p>Selected: {selectedOption?.label || 'None'}</p>
        </div>
        
        <div>
          <h3>Multi Select (Virtualized)</h3>
          <VirtualizedDropdown
            options={hugeOptionsList}
            value={selectedOptions}
            onChange={setSelectedOptions}
            placeholder="Select from 10,000 items..."
            isMulti={true}
            isSearchable={true}
          />
          <p>Selected: {selectedOptions.length} items</p>
        </div>
      </div>
      
      <div className="example-note">
        <p>
          <strong>Performance Note:</strong> The virtualized dropdown only renders the items currently
          visible in the viewport, significantly improving performance for large lists. This implementation 
          handles 10,000 items smoothly, whereas a traditional approach would struggle with this volume.
        </p>
      </div>
    </div>
  );
};

export default VirtualizedExample; 