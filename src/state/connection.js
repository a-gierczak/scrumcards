import { CONNECTION_LOST, SERVER_STATE_CHANGED, NAME_SUBMIT, VOTE_SUBMIT, VOTE_CANCEL } from './action';
import { useEffect } from 'react';

let ws;
const socketProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const serverHostname = process.env.REACT_APP_HOSTNAME || 'localhost';
const serverPort = process.env.REACT_APP_PORT || undefined;

setInterval(() => {
  if (ws) {
    ws.send('ping');
  }
}, 1000);

const isEstablished = () => ws && ws.readyState === WebSocket.OPEN;

const getConnectionString = () => {
  const base = `${socketProtocol}//${serverHostname}`;
  if (serverPort) {
    return `${base}:${serverPort}`;
  }

  return base;
};

const connect = (dispatch) => {
  ws = new WebSocket(getConnectionString());
  ws.onclose = () => dispatch({ type: CONNECTION_LOST });
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    if (message.type === 'STATE_CHANGED') {
      dispatch({ type: SERVER_STATE_CHANGED, payload: message.payload });
      return;
    }

    console.warn(`Unknown message type: ${message.type}`);
  };
};

const emitMessageOnAction = (action) => {
  if (!isEstablished()) {
    return;
  }

  switch (action.type) {
    case NAME_SUBMIT:
    case VOTE_SUBMIT:
    case VOTE_CANCEL:
      ws.send(JSON.stringify(action));
      break;
  }
};

const enhanceDispatch = (dispatch) => (action) => {
  emitMessageOnAction(action);
  dispatch(action);
};

export const useConnection = (dispatch) => {
  const enhancedDispatch = enhanceDispatch(dispatch);
  
  useEffect(() => {
    connect(enhancedDispatch);
  }, []);

  return enhancedDispatch;
};
