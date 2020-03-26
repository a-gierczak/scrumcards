import React from 'react';
import { ConnectedPeople } from './components/ConnectedPeople/ConnectedPeople';
import { VoteInput } from './components/VoteInput/VoteInput';
import { CardBoard } from './components/CardBoard/CardBoard';
import { ConnectionLost } from './components/ConnectionLost/ConnectionLost';
import { Lobby } from './components/Lobby/Lobby';
import { useStore } from './state/store';

function App() {
  const [state, dispatch] = useStore();

  const renderRoute = () => {
    if (!state.connected) {
      return (
        <ConnectionLost />
      );
    }

    if (state.user === undefined) {
      return (
        <Lobby dispatch={dispatch} />
      );
    }

    return (
      <>
        <CardBoard cards={state.votes} />
        <ConnectedPeople people={state.people} />
        <VoteInput vote={state.currentVote} dispatch={dispatch} />
      </>
    );
  };

  return (
    <div className="App">
      {renderRoute()}
    </div>
  );
}

export default App;
