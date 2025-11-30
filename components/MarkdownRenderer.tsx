import React from 'react';

// A simple approach to render the markdown-like text returned by LLM
// For production, react-markdown is recommended, but we are keeping files minimal.

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-purple-300 prose-a:text-blue-400 max-w-none whitespace-pre-wrap">
      {content}
    </div>
  );
};
