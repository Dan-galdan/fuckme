import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface MathEnhancedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MathEnhancedInput({
  value,
  onChange,
  placeholder = "Enter text or LaTeX math...",
  className = ""
}: MathEnhancedInputProps) {

  // Extract LaTeX expressions from text
  const renderWithMath = (text: string) => {
    // Simple regex to find LaTeX between \( and \) or $ and $
    const parts = text.split(/(\\\(.*?\\\)|\$.*?\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        // Remove the \( and \) wrappers
        const latex = part.slice(2, -2);
        return <InlineMath key={index} math={latex} />;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Remove the $ wrappers
        const latex = part.slice(1, -1);
        return <InlineMath key={index} math={latex} />;
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Input field - user types LaTeX here */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 font-mono"
      />

      {/* Live preview showing how it will render */}
      {value && (
        <div className="p-3 border rounded bg-gray-50">
          <div className="text-sm text-gray-600 mb-1">Preview:</div>
          <div className="text-lg min-h-6">
            {renderWithMath(value)}
          </div>
        </div>
      )}
    </div>
  );
}