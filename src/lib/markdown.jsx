// A tiny, safe markdown-subset renderer for notes: headings, bold, and
// bullet lists only. Deliberately hand-rolled instead of pulling in a
// markdown dependency or using dangerouslySetInnerHTML — text always flows
// through React's normal (auto-escaping) text rendering, so there is no
// injection surface even though the source is user-authored.

import React from 'react';

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((p) => p !== '');
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
  });
}

export function renderMarkdown(source) {
  const lines = (source || '').split('\n');
  const blocks = [];
  let listItems = null;

  const flushList = () => {
    if (listItems) {
      blocks.push(
        <ul key={`list-${blocks.length}`} className="list-disc list-inside">
          {listItems}
        </ul>
      );
      listItems = null;
    }
  };

  lines.forEach((line, idx) => {
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    const listItem = line.match(/^[-*]\s+(.*)$/);

    if (heading) {
      flushList();
      const level = heading[1].length;
      const content = renderInline(heading[2], `h${idx}`);
      if (level === 1) blocks.push(<h1 key={idx} className="text-xl font-bold">{content}</h1>);
      else if (level === 2) blocks.push(<h2 key={idx} className="text-lg font-bold">{content}</h2>);
      else blocks.push(<h3 key={idx} className="text-base font-bold">{content}</h3>);
    } else if (listItem) {
      if (!listItems) listItems = [];
      listItems.push(<li key={idx}>{renderInline(listItem[1], `li${idx}`)}</li>);
    } else {
      flushList();
      if (line.trim() === '') {
        blocks.push(<br key={idx} />);
      } else {
        blocks.push(<p key={idx}>{renderInline(line, `p${idx}`)}</p>);
      }
    }
  });
  flushList();

  return blocks;
}

// Plain-text preview (no markup) for card summaries / previews.
export function stripMarkdown(source) {
  return (source || '')
    .replace(/^#{1,3}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();
}
