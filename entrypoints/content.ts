import { Readability } from '@mozilla/readability';
import type { ExtractOptions } from '../types';

function cleanHTML(html: string): string {
  // Clone HTML and remove unwanted elements
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Remove all script tags
  const scripts = tempDiv.querySelectorAll('script');
  scripts.forEach(script => script.remove());

  // Remove all style tags
  const styles = tempDiv.querySelectorAll('style');
  styles.forEach(style => style.remove());

  // Remove stylesheet links
  const styleLinks = tempDiv.querySelectorAll('link[rel="stylesheet"]');
  styleLinks.forEach(link => link.remove());

  // Remove unwanted navigation elements
  const unwantedElements = tempDiv.querySelectorAll(
    'nav, .nav, .navigation, .menu, .sidebar, .aside, .widget, .advertisement, .ads, .social-share, .comments, .comment-section'
  );
  unwantedElements.forEach(element => element.remove());

  return tempDiv.innerHTML;
}

function extractRawHTML(): string {
  // Define semantic elements and commonly used classes/IDs in priority order
  const semanticSelectors = [
    'main',
    'article',
    '[role="main"]',
    '.main-content',
    '#main-content',
    '.content',
    '#content',
    '.post-content',
    '.entry-content',
    '.article-content',
    '.page-content',
  ];

  // Search for semantic elements according to priority
  for (const selector of semanticSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent && element.textContent.trim().length > 200) {
      console.log(`Found semantic content with selector: ${selector}`);
      return cleanHTML(element.innerHTML);
    }
  }

  console.log('No semantic content found, falling back to body');
  // Clean up entire body if no semantic elements are found
  return cleanHTML(document.body.innerHTML);
}

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    // Listen for messages from popup
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'extractContent') {
        try {
          const options: ExtractOptions = message.options || { useReadability: true };

          if (options.useReadability) {
            // Existing Readability processing
            const documentClone = document.cloneNode(true) as Document;
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
                  readabilityHtml: article.content,
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
          } else {
            // Semantic element priority Raw HTML mode
            const rawContent = extractRawHTML();
            const textContent = document.body.textContent || '';

            sendResponse({
              success: true,
              data: {
                title: document.title,
                content: rawContent,
                textContent: textContent,
                length: textContent.length,
                excerpt: textContent.substring(0, 200) + (textContent.length > 200 ? '...' : ''),
                siteName: window.location.hostname,
                publishedTime: null,
                readabilityHtml: rawContent,
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
