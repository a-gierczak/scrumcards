import React from 'react';
import styles from './ConnectedPeople.module.css';

export const ConnectedPeople = ({ people = [] }) => (
  <div className={styles.container}>
    <ul className={styles.list}>
      {people.map((person) => (
        <li key={person.id}>
          <span className={styles.badge} style={{ backgroundColor: person.badgeColor }} />
          <span className={styles.name}>{person.name}</span>
        </li>
      ))}
    </ul>
  </div>
);
