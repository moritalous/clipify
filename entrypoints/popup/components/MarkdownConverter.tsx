import { useMarkdownConverter } from '../hooks/useMarkdownConverter';
import { useButtonStates } from '../hooks/useButtonStates';
import { useExtractMode } from '../hooks/useExtractMode';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import ActionButtons from './ActionButtons';
import PreviewSection from './PreviewSection';
import ExtractModeToggle from './ExtractModeToggle';
import './MarkdownConverter.css';

export default function MarkdownConverter() {
  const { useReadability, modeName, toggleMode } = useExtractMode();
  const { state, result, extractedContent, error, handleAutoConvert } = useMarkdownConverter({
    useReadability,
  });
  const buttonStates = useButtonStates();

  const handleModeToggle = () => {
    const newMode = !useReadability;
    toggleMode();
    // Use the new mode value directly instead of relying on state update
    setTimeout(() => {
      handleAutoConvert({ useReadability: newMode });
    }, 100);
  };

  if (state === 'loading') {
    return (
      <div className="markdown-converter">
        <ExtractModeToggle
          useReadability={useReadability}
          modeName={modeName}
          onToggle={handleModeToggle}
        />
        <LoadingState />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="markdown-converter">
        <ExtractModeToggle
          useReadability={useReadability}
          modeName={modeName}
          onToggle={handleModeToggle}
        />
        <ErrorState error={error} onRetry={() => handleAutoConvert({ useReadability })} />
      </div>
    );
  }

  if (state === 'success' && result && extractedContent) {
    return (
      <div className="markdown-converter">
        <ExtractModeToggle
          useReadability={useReadability}
          modeName={modeName}
          onToggle={handleModeToggle}
        />

        <div className="converter-success">
          <ActionButtons
            result={result}
            extractedContent={extractedContent}
            buttonStates={{
              markdownCopySuccess: buttonStates.markdownCopySuccess,
              markdownDownloadSuccess: buttonStates.markdownDownloadSuccess,
              htmlCopySuccess: buttonStates.htmlCopySuccess,
              htmlDownloadSuccess: buttonStates.htmlDownloadSuccess,
              screenshotCopySuccess: buttonStates.screenshotCopySuccess,
              screenshotCopyLoading: buttonStates.screenshotCopyLoading,
              screenshotSaveSuccess: buttonStates.screenshotSaveSuccess,
              screenshotSaveLoading: buttonStates.screenshotSaveLoading,
            }}
            onButtonSuccess={{
              setMarkdownCopySuccess: buttonStates.setMarkdownCopySuccess,
              setMarkdownDownloadSuccess: buttonStates.setMarkdownDownloadSuccess,
              setHtmlCopySuccess: buttonStates.setHtmlCopySuccess,
              setHtmlDownloadSuccess: buttonStates.setHtmlDownloadSuccess,
              setScreenshotCopySuccess: buttonStates.setScreenshotCopySuccess,
              setScreenshotCopyLoading: buttonStates.setScreenshotCopyLoading,
              setScreenshotSaveSuccess: buttonStates.setScreenshotSaveSuccess,
              setScreenshotSaveLoading: buttonStates.setScreenshotSaveLoading,
            }}
          />

          <PreviewSection result={result} extractedContent={extractedContent} />
        </div>
      </div>
    );
  }

  return (
    <div className="markdown-converter">
      <ExtractModeToggle
        useReadability={useReadability}
        modeName={modeName}
        onToggle={handleModeToggle}
      />
    </div>
  );
}
