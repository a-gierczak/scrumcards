import { CONNECTION_LOST, SERVER_STATE_CHANGED, NAME_SUBMIT, VOTE_SUBMIT, VOTE_CANCEL } from './action';
import { useEffect } from 'react';

let ws;
let wsPingInterval;

const socketProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const serverHostname = process.env.REACT_APP_HOSTNAME || 'localhost';
const serverPort = process.env.REACT_APP_PORT || undefined;

const PING_MESSAGE = JSON.stringify({ type: 'ping' });
const PING_MESSAGE_INTERVAL_MS = 10000;

const isEstablished = () => ws?.readyState === WebSocket.OPEN;

const getConnectionString = () => {
  const base = `${socketProtocol}//${serverHostname}`;
  if (serverPort) {
    return `${base}:${serverPort}`;
  }

  return base;
};

const handleConnectionOpened = () => {
  if (wsPingInterval) {
    clearInterval(wsPingInterval);
    wsPingInterval = undefined;
  }

  wsPingInterval = setInterval(() => {
    if (isEstablished()) {
      ws.send(PING_MESSAGE);
    }
  }, PING_MESSAGE_INTERVAL_MS);
};

const handleConnectionClosed = (dispatch) => () => {
  if (wsPingInterval) {
    clearInterval(wsPingInterval);
    wsPingInterval = undefined;
  }

  dispatch({ type: CONNECTION_LOST });
};

const connect = (dispatch) => {
  ws = new WebSocket(getConnectionString());
  ws.onopen = handleConnectionOpened;
  ws.onclose = handleConnectionClosed(dispatch);
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
  
    if (message.type === SERVER_STATE_CHANGED) {
      dispatch(message);
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
