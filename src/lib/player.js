"use strict";

class Player {
  #_name;
  #_id;
  #_type;

  constructor(options = {}) {
    this.#_name = options.hasOwnProperty("name") ? options.name : "Player";
    this.#_id = options.hasOwnProperty("name") ? options.id : 1;
    this.#_type = options.hasOwnProperty("type") ? options.type : "human";
  }

  get name() {
    return this.#_name;
  }

  set name(newName) {
    this.#_name = newName;
  }

  get id() {
    return this.#_id;
  }

  set id(newId) {
    this.#_id = newId;
  }

  get type() {
    return this.#_type;
  }

  set type(newType) {
    this.#_type = newType;
  }
}

export default Player;
