# Custom Dropdown Component

A flexible, reusable, and accessible dropdown component built from scratch without relying on any component libraries. This dropdown supports both single and multi-select modes with various additional features for enhanced usability.

## Live Demo

Check out the live demo: [https://hive-takehome.vercel.app](https://hive-takehome.vercel.app)

The live demo showcases:
- Single-select dropdown with searchable functionality
- Multi-select dropdown with select/deselect all capability
- Performance test with 1,000 items
- Virtualized dropdown handling 10,000 items efficiently

## Getting Started

### Prerequisites

- Node.js (version 14.0 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MattyRice/Hive-Takehome.git
   cd custom-dropdown
   ```

2. Install dependencies:
   ```bash
   npm install
   # or if you use yarn
   yarn install
   ```

### Running the Project

To start the development server:
```bash
npm run dev
# or with yarn
yarn dev
```

This will start the application at `http://localhost:5173/` (or another port if 5173 is in use).

### Building for Production

To create a production build:
```bash
npm run build
# or with yarn
yarn build
```

The built files will be in the `dist` directory.

## Features

- **Single and Multi-select Modes**: Flexible support for both selection modes
- **Search Functionality**: Filter dropdown options with real-time search
- **Select/Deselect All**: One-click option to select or deselect all items in multi-select mode
- **Virtualization Support**: Efficiently handle extremely large lists (10,000+ items) with minimal performance impact
- **Keyboard Navigation**: Full keyboard accessibility support
- **Custom Styling**: Easily customizable with CSS
- **Accessibility**: ARIA attributes for improved screen reader support
- **Outside Click Detection**: Automatically closes when clicking outside
- **Controlled Component API**: Fully controllable through React props

## Components

The package includes two dropdown implementations:

1. **Dropdown.jsx**: Standard dropdown component for general use cases
2. **VirtualizedDropdown.jsx**: Performance-optimized component for extremely large lists

## Props API

Both dropdown components accept the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Array` | `[]` | Array of option objects with `value` and `label` properties |
| `value` | `Object\|Array` | `null` | Selected value(s) - object for single select, array for multi-select |
| `onChange` | `Function` | Required | Callback function called when selection changes |
| `placeholder` | `String` | `'Select...'` | Placeholder text when no option is selected |
| `isMulti` | `Boolean` | `false` | Enable multi-select mode |
| `isSearchable` | `Boolean` | `false` | Enable search functionality |
| `className` | `String` | `''` | Additional CSS class name for styling |
| `disabled` | `Boolean` | `false` | Disable the dropdown |

## Usage Examples

### Single Select

```jsx
import { useState } from 'react';
import Dropdown from './components/Dropdown';

function SingleSelectExample() {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];
  
  const [selectedOption, setSelectedOption] = useState(null);
  
  return (
    <Dropdown
      options={options}
      value={selectedOption}
      onChange={setSelectedOption}
      placeholder="Select a fruit..."
    />
  );
}
```

### Multi Select

```jsx
import { useState } from 'react';
import Dropdown from './components/Dropdown';

function MultiSelectExample() {
  const options = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
  ];
  
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  return (
    <Dropdown
      options={options}
      value={selectedOptions}
      onChange={setSelectedOptions}
      placeholder="Select colors..."
      isMulti={true}
    />
  );
}
```

### Virtualized Dropdown for Large Lists

```jsx
import { useState } from 'react';
import VirtualizedDropdown from './components/VirtualizedDropdown';

function LargeListExample() {
  // Generate a large list of options
  const largeOptionsList = Array.from({ length: 10000 }, (_, i) => ({
    value: `item-${i+1}`,
    label: `Item ${i+1}`
  }));
  
  const [selectedOption, setSelectedOption] = useState(null);
  
  return (
    <VirtualizedDropdown
      options={largeOptionsList}
      value={selectedOption}
      onChange={setSelectedOption}
      placeholder="Select from 10,000 items..."
      isSearchable={true}
    />
  );
}
```

## Performance Considerations

The standard `Dropdown` component works well for lists with up to several hundred items. For larger lists (1,000+ items), consider using the `VirtualizedDropdown` component, which only renders the visible items in the viewport, resulting in significant performance improvements.

## Styling

The dropdown can be styled by modifying the `Dropdown.css` file or by providing a custom class name via the `className` prop and defining styles for it in your CSS.
