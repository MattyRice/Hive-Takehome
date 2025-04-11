import { useState } from 'react';
import Dropdown from './Dropdown';

const SingleSelectExample = () => {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'durian', label: 'Durian' },
    { value: 'elderberry', label: 'Elderberry' },
    { value: 'fig', label: 'Fig' },
    { value: 'grape', label: 'Grape' },
    { value: 'honeydew', label: 'Honeydew' },
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className="example-container">
      <h2>Single Select Dropdown</h2>
      <p>Current selection: {selectedOption ? selectedOption.label : 'None'}</p>
      
      <Dropdown
        options={options}
        value={selectedOption}
        onChange={setSelectedOption}
        placeholder="Select a fruit..."
        isSearchable={true}
      />
      
      <div className="example-actions">
        <button onClick={() => setSelectedOption(null)}>
          Clear Selection
        </button>
        <button onClick={() => setSelectedOption(options[3])}>
          Select Durian
        </button>
      </div>
    </div>
  );
};

export default SingleSelectExample; 