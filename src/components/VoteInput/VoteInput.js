import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Check, X } from 'react-feather';
import { VOTE_CANCEL, VOTE_SUBMIT, VOTE_CHANGE } from '../../state/action';
import styles from './VoteInput.module.css';

export const VoteInput = ({ vote, dispatch }) => {
  const [showValue, setShowValue] = useState(true);
  const toggleShowValue = () => setShowValue(!showValue);
  const inputRef = useRef();

  const submitVoteOnEnter = (event) => {
    if (event.keyCode === 13 && !vote.submitted && vote.value.trim() !== '') {
      dispatch({
        type: VOTE_SUBMIT,
        payload: vote.value
      });
    }
  }

  useEffect(() => {
    if (!vote.submitted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [vote.submitted]);

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.label}>Podaj estymację:</div>
        <button className={styles.iconButton} onClick={toggleShowValue}>
          {showValue ? (
            <Eye size={36} />
          ) : (
            <EyeOff size={36} />
          )}
        </button>
        <input
          ref={inputRef}
          type={showValue ? 'text' : 'password'}
          className={styles.input}
          disabled={vote.submitted}
          value={vote.value}
          onChange={event =>
            dispatch({ type: VOTE_CHANGE, payload: event.target.value })
          }
          onKeyUp={submitVoteOnEnter}
          autoFocus
          maxLength={6}
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
          {vote.submitted ? (
            <X size={44} />
          ) : (
            <Check size={44} />
          )}
        </button>
      </div>
    </div>
  )
};
