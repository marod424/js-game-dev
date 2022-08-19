export const ARROW_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
export const ACTION_KEYS = [...ARROW_KEYS, 'Shift'];

export default class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];

    window.addEventListener('keydown', e => {
      if (ACTION_KEYS.includes(e.key) && this.keys.indexOf(e.key) === -1) this.keys.push(e.key);
      else if (e.key === ' ') this.game.pause();
      else if (e.key === 'd') this.game.debug = !this.game.debug;
    });

    window.addEventListener('keyup', e => {
      if (ACTION_KEYS.includes(e.key)) this.keys.splice(this.keys.indexOf(e.key), 1);
    });
  }
}