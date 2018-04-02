const ALIVE = true;
const DEAD = false;

window.onload = () => {
  let dom = {};
  dom.container = document.getElementById('container');
  dom.clear = document.getElementById('clear');
  dom.random = document.getElementById('random');
  dom.start = document.getElementById('start');
  dom.speed = document.getElementById('speed');
  dom.size = document.getElementById('size');

  let game = new Game(dom);
};
