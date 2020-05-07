const action = {
  CONNECTION_LOST: 'CONNECTION_LOST',
  SERVER_STATE_CHANGED: 'SERVER_STATE_CHANGED',
  NAME_SUBMIT: 'NAME_SUBMIT',
  VOTE_CHANGE: 'VOTE_CHANGE',
  VOTE_SUBMIT: 'VOTE_SUBMIT',
  VOTE_CANCEL: 'VOTE_CANCEL',
};

// use commonjs export because server imports this file aswell
exports = module.exports = action;