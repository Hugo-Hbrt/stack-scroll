import { describe, it, expect } from 'vitest';
import { formatNumber } from './number_format';

describe('formatNumber', () => {
    it('formats numbers less than 1,000 as is', () => {
        expect(formatNumber(0)).toBe('0');
        expect(formatNumber(5)).toBe('5');
        expect(formatNumber(999)).toBe('999');
    });

    it('formats numbers in thousands with "K"', () => {
        expect(formatNumber(1000)).toBe('1K');
        expect(formatNumber(1500)).toBe('1.5K');
        expect(formatNumber(9900)).toBe('9.9K');
        expect(formatNumber(10500)).toBe('10.5K');
        expect(formatNumber(10000)).toBe('10K');
    });

    it('formats numbers in millions with "M"', () => {
        expect(formatNumber(1000000)).toBe('1M');
        expect(formatNumber(1500000)).toBe('1.5M');
        expect(formatNumber(2500000)).toBe('2.5M');
        expect(formatNumber(10000000)).toBe('10M');
    });

    it('removes unnecessary decimal zero', () => {
        expect(formatNumber(1000)).toBe('1K');
        expect(formatNumber(1000000)).toBe('1M');

    });
    it('handles edge cases', () => {
        expect(formatNumber(999999)).toBe('1M');
        expect(formatNumber(999)).toBe('999');
        expect(formatNumber(999499)).toBe('999.5K');
    });

    it('handles negative numbers', () => {
        expect(formatNumber(-999)).toBe('-999');
        expect(formatNumber(-1000)).toBe('-1K');
        expect(formatNumber(-1500000)).toBe('-1.5M');
    });
});