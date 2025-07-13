export interface ScreenshotResult {
  success: boolean;
  dataUrl?: string;
  error?: string;
}

/**
 * Capture screenshot of the current tab
 */
export async function captureScreenshot(): Promise<ScreenshotResult> {
  try {
    // Get the current active tab
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

    if (!tab.id) {
      return { success: false, error: 'No active tab found' };
    }

    // Capture screenshot
    const dataUrl = await browser.tabs.captureVisibleTab(tab.windowId, {
      format: 'png',
      quality: 100,
    });

    return { success: true, dataUrl };
  } catch (error) {
    console.error('Screenshot capture error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to capture screenshot',
    };
  }
}

/**
 * Copy data URL to clipboard
 */
export async function copyScreenshotToClipboard(dataUrl: string): Promise<boolean> {
  try {
    // Convert data URL to Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Create ClipboardItem and write to clipboard
    const clipboardItem = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([clipboardItem]);

    return true;
  } catch (error) {
    console.error('Clipboard copy error:', error);
    return false;
  }
}

/**
 * Download screenshot as a file
 */
export function downloadScreenshot(dataUrl: string, filename?: string): void {
  const defaultFilename = `screenshot_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
  const finalFilename = filename || defaultFilename;

  // Create download link
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = finalFilename;

  // Temporarily add to DOM and click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Capture screenshot and copy to clipboard only
 */
export async function captureScreenshotToClipboard(): Promise<{
  success: boolean;
  error?: string;
}> {
  const result = await captureScreenshot();

  if (!result.success || !result.dataUrl) {
    return {
      success: false,
      error: result.error,
    };
  }

  const clipboardSuccess = await copyScreenshotToClipboard(result.dataUrl);

  return {
    success: clipboardSuccess,
    error: clipboardSuccess ? undefined : 'Failed to copy to clipboard',
  };
}

/**
 * Capture screenshot and save to both clipboard and file
 */
export async function captureAndSaveScreenshot(filename?: string): Promise<{
  screenshot: boolean;
  clipboard: boolean;
  download: boolean;
  error?: string;
}> {
  const result = await captureScreenshot();

  if (!result.success || !result.dataUrl) {
    return {
      screenshot: false,
      clipboard: false,
      download: false,
      error: result.error,
    };
  }

  // Copy to clipboard
  const clipboardSuccess = await copyScreenshotToClipboard(result.dataUrl);

  // Download file
  try {
    downloadScreenshot(result.dataUrl, filename);
    return {
      screenshot: true,
      clipboard: clipboardSuccess,
      download: true,
    };
  } catch (error) {
    console.error('Download error:', error);
    return {
      screenshot: true,
      clipboard: clipboardSuccess,
      download: false,
      error: 'Failed to download file',
    };
  }
}
