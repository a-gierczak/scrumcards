import React from 'react';
import cn from 'classnames';
import styles from './CardBoard.module.css';

export const CardBoard = ({ cards = [] }) => (
  <div className={styles.container}>
    <div className={styles.cards}>
      {cards.map(card => (
        <div
          key={card.color}
          className={cn(styles.card, { [styles.revealed]: card.revealed })}
        >
          <div
            className={styles.cardBack}
            style={{ backgroundColor: card.color }}
          />
          <div
            className={styles.cardFront}
            style={{ backgroundColor: card.color }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  </div>
);
