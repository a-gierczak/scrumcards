import {
  CONNECTION_LOST,
  SERVER_STATE_CHANGED,
  VOTE_CANCEL,
  VOTE_SUBMIT,
  VOTE_CHANGE,
} from './action';

import { alert } from '../sfx';

export const initialState = {
  connected: true,
  user: undefined,
  people: [],
  votes: [],
  currentVote: {
    value: '',
    canBeCancelled: true,
    submitted: false,
  },
};

let alertTimeout;
const playAlertIfWaitingForUser = (state) => {
  if (state.currentVote?.submitted) {
    return;
  }

  if (
    document.hidden &&
    state.votes.length > 0 &&
    state.votes.length === state.people.length - 1
  ) {
    alertTimeout = setTimeout(() => {
      debugger;
      alert.play();
    }, 4000);
  }
};

export const reducer = (state, action) => {
  switch (action.type) {
    case CONNECTION_LOST:
      return { ...state, connected: false };
    case SERVER_STATE_CHANGED: {
      const canCancelVote = !action.payload.votes.some((vote) => vote.revealed);
      const currentVote =
        canCancelVote && !state.currentVote.canBeCancelled
          ? initialState.currentVote
          : { ...state.currentVote, canBeCancelled: canCancelVote };

      const newState = { ...state, ...action.payload, currentVote };

      clearTimeout(alertTimeout);
      playAlertIfWaitingForUser(newState);

      return newState;
    }
    case VOTE_CANCEL:
      return {
        ...state,
        currentVote: { ...state.currentVote, submitted: false },
      };
    case VOTE_SUBMIT:
      clearTimeout(alertTimeout);
      return {
        ...state,
        currentVote: { ...state.currentVote, submitted: true },
      };
    case VOTE_CHANGE:
      clearTimeout(alertTimeout);
      return {
        ...state,
        currentVote: { ...state.currentVote, value: action.payload },
      };

    default:
      return state;
  }
};
