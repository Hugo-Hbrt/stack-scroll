import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, renderHook } from '@testing-library/react';
import { useScreenSize, ScreenSize } from './useScreenSize';

describe('useScreenSize hook', () => {
    beforeEach(() => {
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024);
        vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(768);
    });

    it('should return the current screen size when it is desktop', () => {
        const { result } = renderHook(() => useScreenSize());
        expect(result.current).toEqual(ScreenSize.Desktop);
    });
    // Simulate Mobile browser width
    it('should return the current screen size when it is mobile', () => {
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(375);
        const { result } = renderHook(() => useScreenSize());
        expect(result.current).toEqual(ScreenSize.Mobile);
    });

    it('should update the screen size on window resize', () => {
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024);
        const { result } = renderHook(() => useScreenSize());
        expect(result.current).toEqual(ScreenSize.Desktop);
        
        // Simulate window resize
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500);
        fireEvent.resize(window);
        expect(result.current).toEqual(ScreenSize.Mobile);
    });
});
