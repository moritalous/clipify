import { useMarkdownConverter } from '../hooks/useMarkdownConverter';
import { useButtonStates } from '../hooks/useButtonStates';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import ActionButtons from './ActionButtons';
import PreviewSection from './PreviewSection';
import './MarkdownConverter.css';

export default function MarkdownConverter() {
  const { state, result, extractedContent, error, handleAutoConvert } = useMarkdownConverter();
  const buttonStates = useButtonStates();

  if (state === 'loading') {
    return <LoadingState />;
  }

  if (state === 'error') {
    return <ErrorState error={error} onRetry={handleAutoConvert} />;
  }

  if (state === 'success' && result && extractedContent) {
    return (
      <div className="markdown-converter">
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

  return null;
}
