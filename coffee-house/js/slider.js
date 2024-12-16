const positions = [, "position_1", "position_2"];
const controls = document.querySelectorAll(".control");
const arrows = document.querySelectorAll(".slider__arrow");
const sliderWrapper = document.querySelectorAll(".slider__wrapper");
const timeAutofill = 48;
let startId;
let contId;
let autofillId;

start(0);

//mouseSwipeHandler();
touchSwipeHandler();
mouseoverHandler();

arrows[0].addEventListener("click", moveLeft);
arrows[1].addEventListener("click", moveRight);

//Auto scroll
function start(position) {
  autofill(position, timeAutofill, 0);

  startId = setInterval(() => {
    clearAutofill();

    position = scrollRight();
    let value = controls[position].querySelector("progress").value;
    autofill(position, timeAutofill, value);
  }, 5000);
}

function continueFill(position, timeline, value) {
  autofill(position, timeAutofill, value);

  contId = setTimeout(() => {
    clearAutofill();
    position = scrollRight();

    start(position);
  }, timeline);
}

//Autofill
function autofill(position, time, value) {
  autofillId = setInterval(() => {
    if (value <= 100) {
      value++;
    }
    controls[position].querySelector("progress").value = value;
  }, time);
}

//Clear
function clearAutofill() {
  clearInterval(autofillId);
  controls.forEach((el) => (el.querySelector("progress").value = 0));
}

function clearAutofillPause() {
  clearInterval(autofillId);
  let position = determinePosition();
  let value = controls[position].querySelector("progress").value;

  return value;
}

//Mouse

function mouseoverHandler() {
  sliderWrapper.forEach((el) => {
    let value;

    el.addEventListener("mouseenter", () => {
      
      value = pause();
    });

    el.addEventListener("mouseleave", (e) => {
      leavePause(value);
    });
  });
}

function mouseSwipeHandler() {
  const slider = document.querySelector(".slider");
  let x = 0;
  let y = 0;
  let distanceX = 0;
  let distanceY = 0;

  let time = 0;
  let runtime = 0;

  let maxDistanceX = 150;
  let maxDistanceY = 100;
  let maxTime = 1000;

  slider.addEventListener("mousedown", function (eventStart) {
    x = eventStart.pageX;
    y = eventStart.pageY;
    time = new Date().getTime();

    eventStart.preventDefault();
  });

  slider.addEventListener("mouseup", function (eventEnd) {
    distanceX = eventEnd.pageX - x;
    distanceY = Math.abs(eventEnd.pageY - y);

    runtime = new Date().getTime() - time;

    if (runtime <= maxTime) {
      if (Math.abs(distanceX) >= maxDistanceX && distanceY <= maxDistanceY) {
        if (distanceX > 0) {
          moveLeft();
        } else {
          moveRight();
        }
      }
    }

    eventEnd.preventDefault();
  });
}

function touchSwipeHandler() {
  const slider = document.querySelector(".slider");
  let x = 0;
  let y = 0;
  let distanceX = 0;
  let distanceY = 0;

  let time = 0;
  let runtime = 0;

  let maxDistanceX = 150;
  let maxDistanceY = 100;
  let maxTime = 1000;

  let value;

  slider.addEventListener("touchmove", function (eventMove) {
    eventMove.preventDefault();
  });

  slider.addEventListener("touchstart", function (eventStart) {
    let target = eventStart.target;
    if (
      target.classList.contains("slider__arrow") ||
      target.classList.contains("icon_arrow")
    ) {
      if (
        eventStart.target === arrows[0] ||
        eventStart.target === arrows[0].firstElementChild
      ) {
        moveLeft();
      } else {
        moveRight();
      }
    }

    eventStart.preventDefault();
  });

  slider.addEventListener("touchstart", function (eventStart) {
    let touch = eventStart.changedTouches[0];
    x = touch.pageX;
    y = touch.pageY;
    time = new Date().getTime();

    value = pause();

    eventStart.preventDefault();
  });

  slider.addEventListener("touchend", function (eventEnd) {
    let touch = eventEnd.changedTouches[0];
    distanceX = touch.pageX - x;
    distanceY = Math.abs(touch.pageY - y);

    runtime = new Date().getTime() - time;

    if (runtime <= maxTime) {
      if (Math.abs(distanceX) >= maxDistanceX && distanceY <= maxDistanceY) {
        if (distanceX > 0) {
          moveLeft();
        } else if (distanceX < 0) {
          moveRight();
        }
      } else {
        leavePause(value);
      }
    } else {
      leavePause(value);
    }
    eventEnd.preventDefault();

  });
}

//---
function scrollRight() {
  let position = determinePosition();

  if (position < 2) {
    removeClassPosition();
    addClassPosition(++position);
  } else {
    removeClassPosition();
    position = 0;
  }

  return position;
}

function moveRight() {
  clearInterval(startId);
  clearInterval(contId);
  clearAutofill();

  let position = scrollRight();

  start(position);
}

function moveLeft() {
  let position = determinePosition();

  clearInterval(startId);
  clearInterval(contId);
  clearAutofill();

  if (position > 0) {
    removeClassPosition();
    position -= 1;
  } else {
    removeClassPosition();
    position = 2;
  }

  addClassPosition(position);

  start(position);
}

function pause() {
  clearInterval(startId);
  clearInterval(contId);
  return clearAutofillPause();
}

function leavePause(value) {
  let position = determinePosition();

  let timeline = (100 - value) * 50;

  continueFill(position, timeline, value);
}

const determinePosition = () => {
  let position;
  document.querySelector(".slider__line").classList.forEach((clazz) => {
    if (positions.includes(clazz)) {
      position = positions.indexOf(clazz);
    } else {
      position = 0;
    }
  });
  return position;
};

const removeClassPosition = () => {
  document.querySelector(".slider__line").classList.remove(...positions);
};

const addClassPosition = (position) => {
  document.querySelector(".slider__line").classList.add(`position_${position}`);
};