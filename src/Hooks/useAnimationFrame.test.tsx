import { renderHook, act } from "@testing-library/react";
import { useAnimationFrame } from "./useAnimationFrame";

jest.useFakeTimers();

describe("useAnimationFrame Hook", () => {
    test("calls the callback function on each animation frame when run is true", () => {
        const callback = jest.fn();
        const { rerender, unmount } = renderHook(({ run }) => useAnimationFrame(run, callback), {
            initialProps: { run: true },
        });

        
        act(() => {
            jest.advanceTimersByTime(1000 / 60 * 5); 
        });

        expect(callback).toHaveBeenCalledTimes(4);

        
        rerender({ run: false });
        act(() => {
            jest.advanceTimersByTime(1000 / 60 * 5);
        });

        expect(callback).toHaveBeenCalledTimes(4); 

        unmount();
    });

    test("does not call callback when run is false", () => {
        const callback = jest.fn();
        renderHook(() => useAnimationFrame(false, callback));

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(callback).not.toHaveBeenCalled();
    });

    test("stops animation frame when component unmounts", () => {
        const callback = jest.fn();
        const { unmount } = renderHook(() => useAnimationFrame(true, callback));

        act(() => {
            jest.advanceTimersByTime(1000 / 60 * 5);
        });

        expect(callback).toHaveBeenCalledTimes(5);

        unmount();
        act(() => {
            jest.advanceTimersByTime(1000 / 60 * 5);
        });

        expect(callback).toHaveBeenCalledTimes(5); 
    });
});
