const express = require('express');
const uuid = require('uuid').v4;
const randomcolor = require('randomcolor');
const path = require('path');

const app = express();
const expressWs = require('express-ws')(app);
const wsServer = expressWs.getWss();

const appBuildPath = path.resolve(__dirname, '../../app/build');

app.use('/static', express.static(path.join(appBuildPath, 'static')));

const state = {
  people: [],
  votes: [],
};

const socketToUserMap = new WeakMap();

const broadcastNewState = () =>
  wsServer.clients.forEach((ws) => {
    const user = socketToUserMap.get(ws);
    const message = {
      type: 'STATE_CHANGED',
      payload: { ...state, user }
    }
    ws.send(JSON.stringify(message));
  });

const removeVote = (id) => {
  const newVotes = state.votes.filter(vote => vote.id !== id);

  if (newVotes.length !== state.votes.length) {
    if (voteFinishTimeout) {
      clearTimeout(voteFinishTimeout);
      voteFinishTimeout = undefined;
    }

    state.votes = newVotes;
    return true;
  }

  return false;
};

let voteFinishTimeout;

app.ws('/', (ws, req) => {
  ws.on('message', (json) => {
    const message = JSON.parse(json);
    switch (message.type) {
      case 'NAME_SUBMIT': {
        const user = {
          id: uuid(),
          name: message.payload,
          badgeColor: randomcolor(),
        };
        state.people.push(user);
        socketToUserMap.set(ws, user);

        broadcastNewState();
        break;
      }
      case 'VOTE_CANCEL': {
        const user = socketToUserMap.get(ws);
        if (!user) {
          return;
        }

        const removed = removeVote(user.id);
        if (removed) {
          broadcastNewState();
        }

        break;
      }
      case 'VOTE_SUBMIT': {
        const user = socketToUserMap.get(ws);
        if (!user) {
          return;
        }

        removeVote(user.id);
        const vote = {
          id: user.id,
          value: message.payload,
          color: user.badgeColor,
          revealed: false,
        };
        state.votes.push(vote);
        broadcastNewState();

        if (state.votes.length === state.people.length) {
          for (let vote of state.votes) {
            vote.revealed = true;
          }

          voteFinishTimeout = setTimeout(() => {
            state.votes = [];
            broadcastNewState();
          }, 20000);
        }

        broadcastNewState();
        break;
      }
    }
  });

  ws.on('close', () => {
    const user = socketToUserMap.get(ws);
    const index = state.people.indexOf(user);
    if (index !== -1) {
      state.people.splice(index, 1);
      broadcastNewState();
    }
  });

});

app.get('/', (req, res) => {
  res.sendFile(path.join(appBuildPath, 'index.html'));
})

const PORT = 3300;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`)
});
