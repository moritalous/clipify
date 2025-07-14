import './ExtractModeToggle.css';

interface ExtractModeToggleProps {
  useReadability: boolean;
  modeName: string;
  onToggle: () => void;
}

export default function ExtractModeToggle({
  useReadability,
  modeName,
  onToggle,
}: ExtractModeToggleProps) {
  return (
    <div className="extract-mode-toggle">
      <label className="toggle-label">
        <span className="toggle-text">Mode: {modeName}</span>
        <div className="toggle-switch">
          <input
            type="checkbox"
            checked={useReadability}
            onChange={onToggle}
            className="toggle-input"
          />
          <span className="toggle-slider"></span>
        </div>
      </label>
      <div className="mode-description">
        {useReadability
          ? 'Smart extraction using Mozilla Readability'
          : 'Semantic HTML extraction (main, article, content areas)'}
      </div>
    </div>
  );
}
