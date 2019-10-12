# Soundsearcher
A minimalist auditory exploration game created for [Ludum Dare 45](https://ldjam.com/events/ludum-dare/45).

## Getting started
Open [the index file](https://nicross.github.io/ludum-dare-45/) in your favorite evergreen browser.
This game is designed for playing with your eyes closed.
Headphones are strongly recommended.

### Objective
**You start with nothing.** The world is filled with harmless creatures and sounds. And things to pick up:
- Footsteps
- Compass
- Three synthesizers that change pitch as you explore

Each play is randomized. Reload to start over.

### Controls
The user interface provides controls for forward and backward movement and turning left and right:
  - **Mouse:** Hover over the edges of the screen
  - **Touch:** Tap and hold the edges of the screen

#### Keyboard
The keyboard controls allow play with one or both hands:

|Action|Controls|
|-|-|
|Move forward|<kbd>W</kbd> or <kbd aria-label="Up Arrow">↑</kbd>|
|Move backward|<kbd>S</kbd> or <kbd aria-label="Down Arrow">↓</kbd>|
|Strafe left|<kbd>A</kbd>|
|Strafe right|<kbd>D</kbd>|
|Turn left|<kbd>E</kbd> or <kbd aria-label="Left Arrow">←</kbd>|
|Turn right|<kbd>Q</kbd> or <kbd aria-label="Right Arrow">→</kbd>|

## Technical information
- Vanilla JavaScript
- No base code, external libraries, or tools
- All sounds synthesized via Web Audio API

### Engine features
- Procedurally generated world
- 2d spatial audio system
- Movement physics
