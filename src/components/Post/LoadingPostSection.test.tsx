/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import LoadingPostSection from './LoadingPostSection';

describe('LoadingPostSection', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render loading skeleton with correct structure and attributes', () => {
    render(<LoadingPostSection />);

    const loadingSection = screen.getByTestId('loading-post-section');
    
    // Check accessibility attributes
    expect(loadingSection.getAttribute('role')).toBe('status');
    expect(loadingSection.getAttribute('aria-label')).toBe('Loading post');
    expect(loadingSection.getAttribute('aria-live')).toBe('polite');
    
    // Check animation class
    expect(loadingSection.className).toContain('animate-pulse');
    
    // Check skeleton structure
    expect(loadingSection.className).toContain('flex');
    expect(loadingSection.className).toContain('flex-col');
    expect(loadingSection.className).toContain('gap-10');
    expect(loadingSection.className).toContain('p-[22px]');
    expect(loadingSection.className).toContain('rounded-[9px]');
    expect(loadingSection.className).toContain('border');
    
    // Verify skeleton elements exist
    const skeletonElements = loadingSection.querySelectorAll('.bg-gray-300');
    expect(skeletonElements.length).toBeGreaterThan(5);
  });

  it('should accept custom className prop', () => {
    render(<LoadingPostSection className="custom-class" />);

    const loadingSection = screen.getByTestId('loading-post-section');
    expect(loadingSection.className).toContain('custom-class');
  });
});