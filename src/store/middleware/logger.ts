import type { Middleware } from '@reduxjs/toolkit';

const logger: Middleware = (store) => (next) => (action) => {
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