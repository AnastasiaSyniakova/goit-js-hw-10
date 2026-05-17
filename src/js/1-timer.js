import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// --- DOM references ---
const startBtn = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

// --- State ---
let userSelectedDate = null; // stores the date user picked
let intervalId = null; // stores the timer ID so we can stop it

// --- flatpickr setup ---
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];

    // If selected date is in the past
    if (selected <= new Date()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true; // disable button
      userSelectedDate = null;
    } else {
      // Valid future date
      userSelectedDate = selected;
      startBtn.disabled = false; // enable button
    }
  },
};

flatpickr('#datetime-picker', options);

// --- Helper: add leading zero ---
// turns 4 into "04", leaves 14 as "14"
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// --- Helper: convert ms to days/hours/minutes/seconds ---
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// --- Update the timer display ---
function updateDisplay({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// --- Start button click ---
startBtn.addEventListener('click', () => {
  // Disable button and input while timer runs
  startBtn.disabled = true;
  input.disabled = true;

  intervalId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now; // ms remaining

    if (diff <= 0) {
      // Timer reached zero
      clearInterval(intervalId);
      updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      input.disabled = false; // re-enable input for next use
      return;
    }

    const time = convertMs(diff);
    updateDisplay(time);
  }, 1000);
});
