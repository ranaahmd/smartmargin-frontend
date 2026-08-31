import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderMarkdown, stripMarkdown } from './markdown';

describe('renderMarkdown', () => {
  it('renders headings at three levels', () => {
    render(<div>{renderMarkdown('# H1\n## H2\n### H3')}</div>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('H1');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('H2');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('H3');
  });

  it('renders bold text as a strong element', () => {
    render(<div>{renderMarkdown('this is **bold** text')}</div>);
    const strong = screen.getByText('bold');
    expect(strong.tagName).toBe('STRONG');
  });

  it('groups consecutive bullet lines into one list', () => {
    render(<div>{renderMarkdown('- one\n- two\n- three')}</div>);
    const list = screen.getByRole('list');
    expect(list.querySelectorAll('li')).toHaveLength(3);
  });

  it('never injects raw HTML — angle-bracket content renders as literal text', () => {
    render(<div>{renderMarkdown('<img src=x onerror="window.__pwned=true">')}</div>);
    expect(window.__pwned).toBeUndefined();
    expect(screen.getByText(/<img src=x/)).toBeInTheDocument();
  });
});

describe('stripMarkdown', () => {
  it('removes heading and list markers and bold syntax', () => {
    expect(stripMarkdown('# Title\n- item one\n**bold**')).toBe('Title item one bold');
  });

  it('handles empty input', () => {
    expect(stripMarkdown('')).toBe('');
    expect(stripMarkdown(undefined)).toBe('');
  });
});
