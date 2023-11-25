# Planning Notes

## Battleship Standard Game Rules

- 2 player game
- zero sum game
  - game ends in victory for 1 player and loss for the other
  - no tie possible
- win condition: a player has "sunk" every cell of every warship owned by the enemy player
- players consecutively alternate turns until one player wins regardless of whether a shot made is a miss or a hit
- game phases
  - warship placement
  - taking shots
- played with 4 boards
  - 2 boards for both players to place their ships
  - 2 boards for both players to mark their shots
  - each board is a 10 x 10 grid
- each player owns 5 total ships (1990 Milton Bradley version)
  - 1 x Carrier (of 1 x 5 cells)
  - 1 x Battleship (of 1 x 4 cells)
  - 1 x Cruiser (of 1 x 3 cells)
  - 1 x Submarine (of 1 x 3 cells)
  - 1 x Destroyer (of 1 x 2 cells)
- ship placement rules
  - a ship must be placed within the 10 x 10 board
  - a placed ship cannot be move once the "warship placement" game phase is over
  - a ship can only be placed vertically or horizontally
  - a ship cannot be placed horizontally
  - any cell occupied by a ship cannot overlap with any cell of an existing already placed (allied) ship
  - any cell that will be occupied by a ship must be a cell that is empty and in-bounds
- (calling) shot rules
  - a shot is a single cell or coordinate that is within the 10 x 10 board
  - each cell on the board can only be called at most once
    - a shot called on a cell that has already been called upon before is not valid
  - a shot is either a hit or a miss
    - a hit shot is one that matches the coordinate of some part of an enemy ship
    - a missed shot is one that does not match the coordinate of some part of an enemy ship

## MVP Requirements

- standard battleship game rules
- write (unit) tests for all non-UI app logic code via TDD
- code
  - has a `Ship` class / factory
  - has a `Gameboard` class / factory
  - has a `Player` class / factory
  - has a module for DOM / UI interaction
  - has a main game loop
  - has a `Game` module?
- functionality
  - allow each player to take a shot at the enemy player's board
  - allow each player to place their own ships
- human player vs computer player (algorithm)
- extras and optionals
  - allow human player to reset game
  - improve computer player algorithm but having it guess adjacent slots after getting a hit

## Pseudocode

- basic game loop for phase "warship placement"
  - exit loop if player has placed all their ships
  - get ship subarray region placement from player
  - if the ship placement is valid,
    - place the ship
    - decrement the count of to-be-placed ships for the current player
  - else
    - do nothing

- basic game loop for phase "taking shots"
  - exit loop if all of a player's ships have been sunk
    - end game and display game end result
  - get shot cell placement from current player
  - if the shot cell placement is valid,
    - place the shot
    - mark the cell as visited
    - if the shot was a hit,
      - update the enemy ship's state to indicate which part of it was hit
      - if enemy ship that was hit has no more hit points,
        - mark the ship as sunk
        - update the game state accordingly
    - else
      - mark the shot as a miss
  - else
    - keep prompting the player for a valid shot cell placement
  - switch the current turn to the other player

## Expanded Pseudocode

- `Ship` class
  - fields
    - `_length`: int in range \[0, 5]
    - `_hitCount`: int in range \[0, 5]
    - `_isSunk`: boolean
  - getter and setter methods for all individual fields
  - `hit()` method
    - return if `hitCount` >= `length`
    - `hitCount++`
  - `isSunk()` method
    - returns `_hitCount` == `_length`
- `Gameboard` class
  - fields
    - `_board`: 10 x 10 string 2D array
    - `_shotCells`:
  - `canPlaceShipAt(ship, cell)`
    - TODO
  - `placeShipAt(ship, cell)`
    - TODO
  - `receiveAttack(cell)`
    - TODO
- `Player` class
  - TODO
- `UIController` module
  - TODO
- `Game` module?
  - TODO?
