import { Bold, Italic, Underline, List, ListOrdered, Link, Heading2 } from 'lucide-react';
import { useRef, useCallback } from 'react';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  rows?: number;
}

const ToolButton = ({
  onClick,
  children,
  title,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="cursor-pointer p-1.5 rounded hover:bg-cream text-clay hover:text-ink transition-colors"
  >
    {children}
  </button>
);

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write here...',
  rows = 6,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  const syncValue = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCmd = useCallback(
    (command: string, val?: string) => {
      document.execCommand(command, false, val);
      editorRef.current?.focus();
      syncValue();
    },
    [syncValue]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        execCmd('bold');
      }
      if (e.key === 'i' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        execCmd('italic');
      }
      if (e.key === 'u' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        execCmd('underline');
      }
    },
    [execCmd]
  );

  const addLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) execCmd('createLink', url);
  }, [execCmd]);

  const minHeight = `${rows * 1.5}rem`;

  return (
    <div className="border border-stone rounded-xl overflow-hidden bg-white">
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-cream/60 border-b border-stone">
        <ToolButton onClick={() => execCmd('bold')} title="Bold (Ctrl+B)">
          <Bold className="h-3.5 w-3.5" />
        </ToolButton>
        <ToolButton onClick={() => execCmd('italic')} title="Italic (Ctrl+I)">
          <Italic className="h-3.5 w-3.5" />
        </ToolButton>
        <ToolButton onClick={() => execCmd('underline')} title="Underline (Ctrl+U)">
          <Underline className="h-3.5 w-3.5" />
        </ToolButton>
        <div className="w-px h-4 bg-stone mx-1" />
        <ToolButton onClick={() => execCmd('insertUnorderedList')} title="Bullet List">
          <List className="h-3.5 w-3.5" />
        </ToolButton>
        <ToolButton onClick={() => execCmd('insertOrderedList')} title="Numbered List">
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolButton>
        <ToolButton onClick={() => execCmd('formatBlock', '<h2>')} title="Heading">
          <Heading2 className="h-3.5 w-3.5" />
        </ToolButton>
        <ToolButton onClick={addLink} title="Insert Link">
          <Link className="h-3.5 w-3.5" />
        </ToolButton>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncValue}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="p-3 text-xs font-sans text-ink outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-clay empty:before:pointer-events-none leading-relaxed"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
