import type { ConversionResult, ExtractedContent, ExtractOptions } from '@/types/index';
import { convertToMarkdown } from '@/utils/converter';
import { useCallback, useEffect, useState } from 'react';

type ConversionState = 'loading' | 'success' | 'error';

export function useMarkdownConverter(extractOptions?: ExtractOptions) {
  const [state, setState] = useState<ConversionState>('loading');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null);
  const [error, setError] = useState<string>('');

  const handleAutoConvert = useCallback(
    async (options?: ExtractOptions) => {
      setState('loading');
      setError('');

      try {
        // Get current active tab
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

        if (!tab.id) {
          throw new Error('No active tab found');
        }

        // Use provided options or default to extractOptions or default behavior
        const extractionOptions = options || extractOptions || { useReadability: true };

        // Send message to content script to extract content
        const response = await browser.tabs.sendMessage(tab.id, {
          action: 'extractContent',
          options: extractionOptions,
        });

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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [extractOptions?.useReadability]
  );

  // Auto-convert on hook initialization or when extractOptions change
  useEffect(() => {
    handleAutoConvert();
  }, [handleAutoConvert]);

  return {
    state,
    result,
    extractedContent,
    error,
    handleAutoConvert,
  };
}
