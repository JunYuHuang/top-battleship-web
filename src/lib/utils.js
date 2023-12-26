"use strict";

function randomPos(array) {
  if (array.length < 1) throw new Error("Array is empty!");
  const pos = Math.floor(Math.random() * array.length);
  return pos;
}

function randomElement(array) {
  if (array.length < 1) throw new Error("Array is empty!");
  const pos = Math.floor(Math.random() * array.length);
  return array[pos];
}

export { randomPos, randomElement };
