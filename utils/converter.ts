import type { ConversionResult, ExtractedContent } from '@/types/index';
import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined',
  linkReferenceStyle: 'full',
});

// Remove unwanted elements
turndownService.remove(['script', 'style', 'noscript', 'iframe', 'embed', 'object']);

// Custom rule for processing entire tables (with HTML tag preservation)
turndownService.addRule('customTable', {
  filter: 'table',
  replacement: function (content, node) {
    try {
      const rows = Array.from(node.querySelectorAll('tr'));
      if (rows.length === 0) return '';

      let result = '\n';

      rows.forEach((row, rowIndex) => {
        const cells = Array.from(row.querySelectorAll('td, th'));
        const cellContents = cells.map(cell => {
          let html = cell.innerHTML;

          // Remove unnecessary attributes and tags
          html = html.replace(/\s*tabindex="[^"]*"/gi, '');
          html = html.replace(/<\/?span[^>]*>/gi, '');

          // Convert p tags to br tags
          html = html.replace(/<\/p>\s*<p[^>]*>/gi, '<br>');
          html = html.replace(/<p[^>]*>/gi, '');
          html = html.replace(/<\/p>/gi, '');

          // Clean up extra whitespace
          return html.replace(/\s+/g, ' ').trim() || ' ';
        });

        result += '| ' + cellContents.join(' | ') + ' |\n';

        if (rowIndex === 0) {
          const separator = cellContents.map(() => '---').join(' | ');
          result += '| ' + separator + ' |\n';
        }
      });

      return result + '\n';
    } catch (error) {
      console.warn('Table processing error:', error);
      return content;
    }
  },
});

// Simple code block processing rule
turndownService.addRule('codeBlock', {
  filter: 'pre',
  replacement: function (content, node) {
    const cleanContent = (node.textContent || '').trim();
    return '\n```\n' + cleanContent + '\n```\n';
  },
});

export function convertToMarkdown(extractedContent: ExtractedContent): ConversionResult {
  const markdown = turndownService.turndown(extractedContent.content);

  const frontmatter = createYAMLFrontmatter(extractedContent);
  const finalMarkdown = `${frontmatter}\n\n${markdown}`;

  return {
    markdown: finalMarkdown,
    originalTitle: extractedContent.title,
    siteName: extractedContent.siteName,
    wordCount: extractedContent.textContent.split(/\s+/).filter(word => word.length > 0).length,
  };
}

function createYAMLFrontmatter(content: ExtractedContent): string {
  const frontmatterData: Record<string, string | number | null> = {};

  if (content.title) {
    frontmatterData.title = content.title;
  }

  if (content.url) {
    frontmatterData.source_url = content.url;
  }

  if (content.siteName) {
    frontmatterData.source = content.siteName;
  }

  if (content.publishedTime) {
    frontmatterData.published_time = content.publishedTime;
  }

  frontmatterData.extracted_at = new Date().toISOString();

  const wordCount = content.textContent.split(/\s+/).filter(word => word.length > 0).length;
  frontmatterData.word_count = wordCount;

  if (content.length) {
    frontmatterData.content_length = content.length;
  }

  if (content.excerpt) {
    frontmatterData.excerpt = content.excerpt;
  }

  const yamlLines = ['---'];

  Object.entries(frontmatterData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      // Quote strings that contain special characters
      if (
        typeof value === 'string' &&
        (value.includes(':') || value.includes('#') || value.includes('\n'))
      ) {
        yamlLines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
      } else {
        yamlLines.push(`${key}: ${value}`);
      }
    }
  });

  yamlLines.push('---');

  return yamlLines.join('\n');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
