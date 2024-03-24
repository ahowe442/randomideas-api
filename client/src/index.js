import '@fortawesome/fontawesome-free/css/all.css';
import './css/style.css';

const modal = document.querySelector('#modal');
const modalBtn = document.querySelector('#modal-btn');

function open() {
  modal.style.display = 'block';
}

function close() {
  modal.style.display = 'none';
}

function outsideClick(e) {
  if (e.target === modal) {
    close();
  }
}

modalBtn.addEventListener('click', outsideClick);
modalBtn.addEventListener('click', open);
