import type { ConversionResult, ExtractedContent } from '@/types/index';
import { useState } from 'react';

type ActiveTab = 'markdown' | 'html';

interface PreviewSectionProps {
  result: ConversionResult;
  extractedContent: ExtractedContent;
}

export default function PreviewSection({ result, extractedContent }: PreviewSectionProps) {
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('markdown');

  return (
    <div className="preview-section">
      <button className="preview-toggle" onClick={() => setPreviewExpanded(!previewExpanded)}>
        <span className="toggle-icon">{previewExpanded ? '▼' : '▶'}</span>
        <span className="toggle-text">Preview Content</span>
      </button>

      {previewExpanded && (
        <div className="preview-content">
          <div className="tab-buttons">
            <button
              className={`tab-button ${activeTab === 'markdown' ? 'active' : ''}`}
              onClick={() => setActiveTab('markdown')}
            >
              <span className="tab-icon">📝</span>
              Markdown
            </button>
            <button
              className={`tab-button ${activeTab === 'html' ? 'active' : ''}`}
              onClick={() => setActiveTab('html')}
            >
              <span className="tab-icon">🔧</span>
              HTML
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'markdown' && (
              <textarea
                className="content-preview markdown-preview"
                value={result.markdown}
                readOnly
                rows={8}
              />
            )}

            {activeTab === 'html' && (
              <textarea
                className="content-preview html-preview"
                value={extractedContent.readabilityHtml}
                readOnly
                rows={8}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
