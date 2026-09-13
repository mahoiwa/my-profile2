import './style.css';

document.querySelector('#app').innerHTML = `
  <h1>カウンター</h1>
  <p id="count">0</p>
  <button id="increasebtn">増やす</button>
  <button id="decreasebtn">減らす</button>
  <button id="reset">リセット</button>
`;

const countEl = document.querySelector('#count');
const increasebtn = document.querySelector('#increasebtn');
const decreasebtn = document.querySelector('#decreasebtn');
const reset = document.querySelector('#reset')
let count = 0;

increasebtn.addEventListener('click', () => {
  count += 1;
  countEl.textContent = count;
});

decreasebtn.addEventListener('click', () => {
  count -= 1;
  countEl.textContent = count;
});

reset.addEventListener('click', () => {
  count = 0;
  countEl.textContent = count;
});

