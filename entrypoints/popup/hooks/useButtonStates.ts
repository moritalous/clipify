import { useState } from 'react';

export function useButtonStates() {
  // Button states
  const [markdownCopySuccess, setMarkdownCopySuccess] = useState(false);
  const [markdownDownloadSuccess, setMarkdownDownloadSuccess] = useState(false);
  const [htmlCopySuccess, setHtmlCopySuccess] = useState(false);
  const [htmlDownloadSuccess, setHtmlDownloadSuccess] = useState(false);
  const [screenshotCopySuccess, setScreenshotCopySuccess] = useState(false);
  const [screenshotCopyLoading, setScreenshotCopyLoading] = useState(false);
  const [screenshotSaveSuccess, setScreenshotSaveSuccess] = useState(false);
  const [screenshotSaveLoading, setScreenshotSaveLoading] = useState(false);

  const setSuccessState = (setter: (value: boolean) => void, duration: number = 2000) => {
    setter(true);
    setTimeout(() => setter(false), duration);
  };

  return {
    // States
    markdownCopySuccess,
    markdownDownloadSuccess,
    htmlCopySuccess,
    htmlDownloadSuccess,
    screenshotCopySuccess,
    screenshotCopyLoading,
    screenshotSaveSuccess,
    screenshotSaveLoading,

    // Setters
    setMarkdownCopySuccess: () => setSuccessState(setMarkdownCopySuccess),
    setMarkdownDownloadSuccess: () => setSuccessState(setMarkdownDownloadSuccess),
    setHtmlCopySuccess: () => setSuccessState(setHtmlCopySuccess),
    setHtmlDownloadSuccess: () => setSuccessState(setHtmlDownloadSuccess),
    setScreenshotCopySuccess: () => setSuccessState(setScreenshotCopySuccess, 3000),
    setScreenshotCopyLoading,
    setScreenshotSaveSuccess: () => setSuccessState(setScreenshotSaveSuccess, 3000),
    setScreenshotSaveLoading,
  };
}
