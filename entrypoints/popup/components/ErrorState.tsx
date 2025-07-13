interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="converter-error">
      <h3>❌ Conversion Failed</h3>
      <p>{error}</p>
      <button className="action-button secondary" onClick={onRetry}>
        🔄 Try Again
      </button>
    </div>
  );
}
