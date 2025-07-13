import type { ConversionResult, ExtractedContent } from '@/types/index';
import { copyToClipboard } from '@/utils/converter';
import { captureAndSaveScreenshot, captureScreenshotToClipboard } from '@/utils/screenshot';

interface ActionButtonsProps {
  result: ConversionResult;
  extractedContent: ExtractedContent;
  buttonStates: {
    markdownCopySuccess: boolean;
    markdownDownloadSuccess: boolean;
    htmlCopySuccess: boolean;
    htmlDownloadSuccess: boolean;
    screenshotCopySuccess: boolean;
    screenshotCopyLoading: boolean;
    screenshotSaveSuccess: boolean;
    screenshotSaveLoading: boolean;
  };
  onButtonSuccess: {
    setMarkdownCopySuccess: () => void;
    setMarkdownDownloadSuccess: () => void;
    setHtmlCopySuccess: () => void;
    setHtmlDownloadSuccess: () => void;
    setScreenshotCopySuccess: () => void;
    setScreenshotCopyLoading: (loading: boolean) => void;
    setScreenshotSaveSuccess: () => void;
    setScreenshotSaveLoading: (loading: boolean) => void;
  };
}

export default function ActionButtons({
  result,
  extractedContent,
  buttonStates,
  onButtonSuccess,
}: ActionButtonsProps) {
  const handleMarkdownCopy = async () => {
    const success = await copyToClipboard(result.markdown);
    if (success) {
      onButtonSuccess.setMarkdownCopySuccess();
    }
  };

  const handleMarkdownDownload = () => {
    const blob = new Blob([result.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.originalTitle || 'content'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onButtonSuccess.setMarkdownDownloadSuccess();
  };

  const handleHtmlCopy = async () => {
    const success = await copyToClipboard(extractedContent.readabilityHtml);
    if (success) {
      onButtonSuccess.setHtmlCopySuccess();
    }
  };

  const handleHtmlDownload = () => {
    const blob = new Blob([extractedContent.readabilityHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.originalTitle || 'content'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onButtonSuccess.setHtmlDownloadSuccess();
  };

  const handleScreenshotCopy = async () => {
    onButtonSuccess.setScreenshotCopyLoading(true);

    try {
      const result = await captureScreenshotToClipboard();
      if (result.success) {
        onButtonSuccess.setScreenshotCopySuccess();
      }
    } catch (error) {
      console.error('Screenshot copy error:', error);
    } finally {
      onButtonSuccess.setScreenshotCopyLoading(false);
    }
  };

  const handleScreenshotSave = async () => {
    onButtonSuccess.setScreenshotSaveLoading(true);

    try {
      const result = await captureAndSaveScreenshot();
      if (result.screenshot) {
        onButtonSuccess.setScreenshotSaveSuccess();
      }
    } catch (error) {
      console.error('Screenshot save error:', error);
    } finally {
      onButtonSuccess.setScreenshotSaveLoading(false);
    }
  };

  return (
    <div className="action-grid-main">
      <button
        className={`action-button ${buttonStates.markdownCopySuccess ? 'success' : 'secondary'}`}
        onClick={handleMarkdownCopy}
      >
        <span className="action-icon">📄</span>
        <span className="action-text">
          {buttonStates.markdownCopySuccess ? 'Copied!' : 'Copy Markdown'}
        </span>
      </button>

      <button
        className={`action-button ${buttonStates.markdownDownloadSuccess ? 'success' : 'secondary'}`}
        onClick={handleMarkdownDownload}
      >
        <span className="action-icon">💾</span>
        <span className="action-text">
          {buttonStates.markdownDownloadSuccess ? 'Downloaded!' : 'Download Markdown'}
        </span>
      </button>

      <button
        className={`action-button ${buttonStates.htmlCopySuccess ? 'success' : 'secondary'}`}
        onClick={handleHtmlCopy}
      >
        <span className="action-icon">🔧</span>
        <span className="action-text">
          {buttonStates.htmlCopySuccess ? 'Copied!' : 'Copy HTML'}
        </span>
      </button>

      <button
        className={`action-button ${buttonStates.htmlDownloadSuccess ? 'success' : 'secondary'}`}
        onClick={handleHtmlDownload}
      >
        <span className="action-icon">📁</span>
        <span className="action-text">
          {buttonStates.htmlDownloadSuccess ? 'Downloaded!' : 'Download HTML'}
        </span>
      </button>

      <button
        className={`action-button ${buttonStates.screenshotCopySuccess ? 'success' : 'secondary'} ${buttonStates.screenshotCopyLoading ? 'loading' : ''}`}
        onClick={handleScreenshotCopy}
        disabled={buttonStates.screenshotCopyLoading}
      >
        <span className="action-icon">📋</span>
        <span className="action-text">
          {buttonStates.screenshotCopyLoading
            ? 'Copying...'
            : buttonStates.screenshotCopySuccess
              ? 'Copied!'
              : 'Copy Screenshot'}
        </span>
      </button>

      <button
        className={`action-button ${buttonStates.screenshotSaveSuccess ? 'success' : 'secondary'} ${buttonStates.screenshotSaveLoading ? 'loading' : ''}`}
        onClick={handleScreenshotSave}
        disabled={buttonStates.screenshotSaveLoading}
      >
        <span className="action-icon">📸</span>
        <span className="action-text">
          {buttonStates.screenshotSaveLoading
            ? 'Saving...'
            : buttonStates.screenshotSaveSuccess
              ? 'Saved!'
              : 'Save Screenshot'}
        </span>
      </button>
    </div>
  );
}
