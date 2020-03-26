import { useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { useConnection } from './connection';

export const useStore = () => {
  const [state, storeDispatch] = useReducer(reducer, initialState);
  const dispatch = useConnection(storeDispatch);
  return [state, dispatch];
};
