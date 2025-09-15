import type { Middleware } from '@reduxjs/toolkit';

// Type guard function to assert action has a type property
function assertAction(action: unknown): asserts action is { type: string } {
  if (!action || typeof action !== 'object' || !('type' in action)) {
    throw new Error('Invalid action: must be an object with a type property');
  }
  if (typeof action.type !== 'string') {
    throw new Error('Invalid action: type must be a string');
  }
}

const logger: Middleware<{}, any, any> = (store) => (next) => (action) => {
  assertAction(action);
  console.group(`🔄 Action: ${action.type}`);
  
  // Log the action being dispatched
  console.log('📤 Dispatching:', action);
  
  // Log the current state before the action
  console.log('📋 State before:', store.getState());
  
  // Dispatch the action
  const result = next(action);
  
  // Log the state after the action
  console.log('📋 State after:', store.getState());
  
  console.groupEnd();
  
  return result;
};

export default logger;