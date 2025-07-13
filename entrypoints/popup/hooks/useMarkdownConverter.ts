import type { ConversionResult, ExtractedContent } from '@/types/index';
import { convertToMarkdown } from '@/utils/converter';
import { useEffect, useState } from 'react';

type ConversionState = 'loading' | 'success' | 'error';

export function useMarkdownConverter() {
  const [state, setState] = useState<ConversionState>('loading');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null);
  const [error, setError] = useState<string>('');

  const handleAutoConvert = async () => {
    setState('loading');
    setError('');

    try {
      // Get current active tab
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

      if (!tab.id) {
        throw new Error('No active tab found');
      }

      // Send message to content script to extract content
      const response = await browser.tabs.sendMessage(tab.id, { action: 'extractContent' });

      if (!response.success) {
        throw new Error(response.error || 'Failed to extract content');
      }

      const extractedData = response.data as ExtractedContent;
      setExtractedContent(extractedData);

      // Convert HTML to Markdown
      const conversionResult = convertToMarkdown(extractedData);

      setResult(conversionResult);
      setState('success');
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setState('error');
    }
  };

  // Auto-convert on hook initialization
  useEffect(() => {
    handleAutoConvert();
  }, []);

  return {
    state,
    result,
    extractedContent,
    error,
    handleAutoConvert,
  };
}
