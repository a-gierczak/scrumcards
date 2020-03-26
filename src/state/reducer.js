import { CONNECTION_LOST, SERVER_STATE_CHANGED, VOTE_CANCEL, VOTE_SUBMIT, VOTE_CHANGE } from './action';

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

export const reducer = (state, action) => {
  switch (action.type) {
    case CONNECTION_LOST:
      return { ...state, connected: false };
    case SERVER_STATE_CHANGED: {
      const canCancelVote = !action.payload.votes.some(vote => vote.revealed);
      const currentVote = canCancelVote && !state.currentVote.canBeCancelled
        ? initialState.currentVote
        : { ...state.currentVote, canBeCancelled: canCancelVote };
      return { ...state, ...action.payload, currentVote };
    }
    case VOTE_CANCEL:
      return { ...state, currentVote: { ...state.currentVote, submitted: false } };
    case VOTE_SUBMIT:
      return { ...state, currentVote: { ...state.currentVote, submitted: true } };;
    case VOTE_CHANGE:
      return { ...state, currentVote: { ...state.currentVote, value: action.payload } };

    default:
      return state;
  }
};
