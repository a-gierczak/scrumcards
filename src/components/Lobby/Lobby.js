import React from 'react';
import styles from './Lobby.module.css';
import { NAME_SUBMIT } from '../../state/action';

export const Lobby = ({ dispatch }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.username.value;
    dispatch({ type: NAME_SUBMIT, payload: name });
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.label}>Podaj imię:</div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            autoFocus
            name="username"
            required
          />
          <button type="submit" className={styles.button}>
            Gotów
          </button>
        </form>
      </div>
    </div>
  );
};
