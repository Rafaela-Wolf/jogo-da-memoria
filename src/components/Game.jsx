import { useState } from 'react';
import Board from './Board';

const shuffleArray = (array) => {

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

const generateCards = () => {

  const values = ["A", "B", "C", "D", "E", "F", "G", "H"];

  const cards = values.map((value) => ({
    value,
    isFlipped: false
  }));

  const duplicateCards = [...cards, ...cards].map((card, index) => ({ ...card, id: index }));

  return shuffleArray(duplicateCards);
}

const Game = () => {

  const [cards, setCards] = useState(generateCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [chances, setChances] = useState(50);
  const playerChances = 50;

  const result = cards.filter((card) => card.isFlipped).length;

  const handleCardClick = (clickedCard) => {
    if (chances === 0) return;

    if(flippedCards.length === "?") return;

    const newCards =  cards.map((card) => {
      return card.id === clickedCard.id ? {...card, isFlipped: true} : card;
    });

    setCards(newCards);

    setFlippedCards([...flippedCards, clickedCard]);

    if(flippedCards.length === 1) {
      setTimeout(() => {
        setFlippedCards((prevFlippedCards) => {
          const [firstCard] = prevFlippedCards;
          if (firstCard.value !== clickedCard.value) {
            setCards((prevCards) =>
              prevCards.map((card) =>
                card.id === firstCard.id || card.id === clickedCard.id ? { ...card, isFlipped: false } : card
              )
            );
            setChances((prev) => prev - 1);
          }
          return [];
        });
      }, 600)
    }
  };

  const resetGame = () => {
    setChances(playerChances);
    setFlippedCards([]);
    setCards(generateCards());
  }

  return (
    <div className="game">
      <Board cards={cards} onCardClick={handleCardClick} />
      {chances === 0 ? (
        <p>Suas tentativas terminaram...</p>
      ) : result === cards.length ? (
        <h2>Parabéns! Você ganhou.</h2>
      ) : (
        <p>Você tem {chances} tentativas restantes.</p>
      )}
      <button className="btn" onClick={resetGame}>Reiniciar jogo</button>
    </div>
  )
}

export default Game;