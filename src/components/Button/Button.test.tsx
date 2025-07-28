import { describe, expect, it, vi, afterEach} from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Button, {buttonStyles} from '@components/Button/Button';

afterEach(async () => {
    cleanup();
});

describe('Button component', () => {
    const mockClickCallback = vi.fn();
    const mockText = "Click Me";
    
    it('renders the button', async () => {
        render(<Button onClick={mockClickCallback}>{mockText}</Button>);
        const buttonElement = screen.getByRole('button');
        await expect(buttonElement).toBeInTheDocument();
    });
    
    it('renders the button with correct text', async () => {
        render(<Button onClick={mockClickCallback}>{mockText}</Button>);
        const buttonElement = screen.getByRole('button');
        await expect(buttonElement).toHaveTextContent(mockText);
    });

    it('calls the onClick callback when clicked', async () => {
        render(<Button onClick={mockClickCallback}>{mockText}</Button>);
        const buttonElement = screen.getByRole('button');
        await buttonElement.click();
        expect(mockClickCallback).toHaveBeenCalled();
    });

    it('applies custom className', async () => {
        const customClass = "custom-class";
        render(<Button onClick={mockClickCallback} className={customClass}>{mockText}</Button>);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveClass(customClass);
    });

    it('applies primary btnStyle as default style', async () => {
        render(<Button onClick={mockClickCallback}>{mockText}</Button>);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveClass(buttonStyles.primary);
    });
});

