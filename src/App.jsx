import SingleSelectExample from './components/SingleSelectExample';
import MultiSelectExample from './components/MultiSelectExample';
import PerformanceExample from './components/PerformanceExample';
import VirtualizedExample from './components/VirtualizedExample';
import './components/Examples.css';

function App() {
  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="app-header">
          <h1>Custom Dropdown Component</h1>
          <p>
            A flexible and reusable dropdown component built from scratch,
            supporting both single and multi-select functionality.
          </p>
        </header>

        <div className="examples-grid">
          <SingleSelectExample />
          <MultiSelectExample />
        </div>

        <PerformanceExample />
        <VirtualizedExample />
      </div>
    </div>
  );
}

export default App;
