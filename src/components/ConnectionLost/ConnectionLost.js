import React from 'react';
import styles from './ConnectionLost.module.css';

export const ConnectionLost = () => (
  <div className={styles.container}>
    <div>
      <h1 className={styles.title}>Utracono połączenie :(</h1>
      <p className={styles.description}>Odśwież stronę, aby spróbować ponownie</p>
    </div>
  </div>
);