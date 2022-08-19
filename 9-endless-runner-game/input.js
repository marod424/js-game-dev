export const ARROW_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
export const ACTION_KEYS = [...ARROW_KEYS, 'Enter', ' '];

export default class InputHandler {
  constructor(game) {
    this.keys = [];
    this.game = game;

    window.addEventListener('keydown', e => {
      if (e.key === ' ') {
        this.game.pause();
      }
      
      if (ACTION_KEYS.includes(e.key) && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      }

      console.log(e.key, this.keys);
    });

    window.addEventListener('keyup', e => {
      if (ACTION_KEYS.includes(e.key)) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
      console.log(e.key, this.keys);
    });
  }
}