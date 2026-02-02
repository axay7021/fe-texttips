/**
 * Zustand Store Setup
 *
 * This file demonstrates how to create Zustand stores with TypeScript
 * Create your stores here as you need them
 *
 * Example store structure:
 *
 * import { create } from 'zustand';
 * import { devtools, persist } from 'zustand/middleware';
 *
 * interface ExampleState {
 *   count: number;
 *   increment: () => void;
 *   decrement: () => void;
 * }
 *
 * export const useExampleStore = create<ExampleState>()(
 *   devtools(
 *     persist(
 *       (set) => ({
 *         count: 0,
 *         increment: () => set((state) => ({ count: state.count + 1 })),
 *         decrement: () => set((state) => ({ count: state.count - 1 })),
 *       }),
 *       { name: 'example-storage' }
 *     ),
 *     { name: 'ExampleStore' }
 *   )
 * );
 *
 * Usage in components:
 * const { count, increment } = useExampleStore();
 */

// Add your stores here
