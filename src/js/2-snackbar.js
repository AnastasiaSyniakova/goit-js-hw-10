import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault(); // stop page from reloading on submit

  // Read values from the form
  const delay = Number(event.target.delay.value);
  const state = event.target.state.value; // "fulfilled" or "rejected"

  // Create a promise that resolves or rejects after the delay
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay); // pass delay as the value
      } else {
        reject(delay); // pass delay as the error value
      }
    }, delay);
  });

  // Handle the promise result
  promise
    .then(delay => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });
});
