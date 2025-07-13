import { Readability } from '@mozilla/readability';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    // Listen for messages from popup
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'extractContent') {
        try {
          // Clone the document for Readability
          const documentClone = document.cloneNode(true) as Document;
          // Use Readability to extract the main content with adjusted settings
          const reader = new Readability(documentClone, {
            debug: false,
            charThreshold: 500,
          });

          const article = reader.parse();

          if (article) {
            sendResponse({
              success: true,
              data: {
                title: article.title,
                content: article.content,
                textContent: article.textContent,
                length: article.length,
                excerpt: article.excerpt,
                siteName: article.siteName,
                publishedTime: article.publishedTime,
                // Add the readability-processed HTML
                readabilityHtml: article.content,
                // 現在のページのURLを追加
                url: window.location.href,
              },
            });
          } else {
            // Fallback to full page HTML if Readability fails
            const fallbackContent = document.body.innerHTML;
            sendResponse({
              success: true,
              data: {
                title: document.title,
                content: fallbackContent,
                textContent: document.body.textContent,
                length: document.body.textContent?.length || 0,
                excerpt: '',
                siteName: window.location.hostname,
                publishedTime: null,
                readabilityHtml: fallbackContent,
                url: window.location.href,
              },
            });
          }
        } catch (error) {
          console.error('Error extracting content:', error);
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }

        return true; // Keep the message channel open for async response
      }
    });
  },
});
