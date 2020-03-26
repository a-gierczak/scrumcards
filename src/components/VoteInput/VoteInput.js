import React from 'react';
import { VOTE_CANCEL, VOTE_SUBMIT, VOTE_CHANGE } from '../../state/action';
import styles from './VoteInput.module.css';

export const VoteInput = ({ vote, dispatch }) => (
  <div className={styles.container}>
    <div>
      <div className={styles.label}>Podaj estymację:</div>
      <input
        type="text"
        className={styles.input}
        disabled={vote.submitted}
        value={vote.value}
        onChange={event =>
          dispatch({ type: VOTE_CHANGE, payload: event.target.value })
        }
        autoFocus
      />
      <button
        type="button"
        className={styles.button}
        disabled={!vote.canBeCancelled}
        onClick={() =>
          dispatch({
            type: vote.submitted ? VOTE_CANCEL : VOTE_SUBMIT,
            payload: vote.value
          })
        }
      >
        {vote.submitted ? '❌' : '✔️'}
      </button>
    </div>
  </div>
);
