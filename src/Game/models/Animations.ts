export const MIN_DELAY_BETWEEN_OBSTACLE_ANIMATIONS = 5000;
export const MAX_DELAY_BETWEEN_OBSTACLE_ANIMATIONS = 20000;

export type SpaceObstacle = {
  name: string;
  image: string;
  classNames: string;
  delay: number;
};

export const SPACE_OBSTACLES: SpaceObstacle[] = [
  {
    name: 'meteor',
    image: '/images/Game/Animations/meteor.png',
    classNames: 'meteor fly-meteor',
    delay: 2000,
  },
];
