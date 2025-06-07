export type Game = {
  id: string;
  statsGame: StatGame;
  bubbles: Bubble[];
};

export type StatGame = {
  durationGame: number;
  explodedBubbles: number;
};

export type Bubble = {
  position: {
    row: number;
    column: number;
  };
  color: string;
  type: string;
};
