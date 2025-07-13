import './App.css';
import MarkdownConverter from './components/MarkdownConverter';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Clipify</h1>
      </header>
      <main className="app-main">
        <MarkdownConverter />
      </main>
    </div>
  );
}

export default App;
