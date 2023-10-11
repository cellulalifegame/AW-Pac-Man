## Game Introduction

In AW-PAC-MAN, the life's health is determined by the Conway curve. At the moment of entering the game, the number of live cells represents the total health value of the current game.

- Field of View: The life's initial field of view is 3 grid spaces (3 spaces around, not just the direction faced). Each level upgrade requires 2 skill points and adds an additional grid space to the field of view.
- Attack Power: The life's initial attack power is 5 points. Each level upgrade requires 1 skill point and increases the attack power by 1 point.
- Additional Skill Points: Each life starts with 5 additional skill points that players can freely allocate, with a maximum limit of 15 points.
- Game Over Conditions:
  [1] 🎉 Survive for 3 minutes.
  [2] 🍀 Achieve victory in the game (collect the required number of characters to win the map, rewarded with collected coins).
  [3] 🏁 Failure (life gets killed).

### Condition Evaluation

- State Evaluation
  [1] Health is greater than or equal to 50% and ghosts are within the field of view.
  [2] Health is less than or equal to 50% and ghosts are within the field of view.
  [3] The difference in required coins for victory is greater than 20, and ghosts are within the field of view.
  [4] The difference in required coins for victory is greater than 20, and ghosts are within the field of view.
- Actions
  [1] Attack: If there are ghosts within the field of view, lock onto the nearest ghost and move towards it. If there are no ghosts within the field of view, perform regular movement.
  [2] Escape: Move away from the direction of the ghosts.
  [3] Collect Coins: Lock onto the nearest coin within the field of view and move towards it.

Regular Movement: By default, the life will move towards the nearest coin. If the distances are the same, it will randomly choose one.

### Ghost Logic

| Color | Health | Attack Power | Field of View | Coins Obtained after Killing |
| ------ | ------ | ------------ | -------------- | -------------------------- |
| Red   | Health | Attack Power | 8 spaces      | 20                         |
| Pink  | Health | Attack Power | 4 spaces      | 20                         |
| Blue  | Health | Attack Power | 6 spaces      | 20                         |
| Yellow | Health | Attack Power | 8 spaces      | 20                         |

[1] Health = Base Health (50) + (Map Level ✖️ Increase in Health per Level (5)).
[2] Attack Power = Base Attack Power (2) + (Map Level ✖️ Increase in Attack Power per Level (1)).

### Development Rules

[1] Use coins on the Enhancement page to strengthen life, allowing individual life to have additional strategies or extra attribute points, but it cannot change the life's health.
[2] Each life has only 3 default execution strategies. To unlock the next one, it requires spending 1000, 2000, and 4000 coins respectively.
[3] Spend coins to increase the number of available attribute points for life. The current limit is set to 10 points.

| Skill Points | Cost |
| ------------ | ---- |
| 1            | 200  |
| 2            | 300  |
| 3            | 450  |
| 4            | 675  |
| 5            | 1000 |
| 6            | 1500 |
| 7            | 2250 |
| 8            | 3375 |
| 9            | 5000 |
| 10           | 7500 |

### Map Difficulty Levels

| Level | Map Size | Number of Ghosts | Number of Coins | Victory Condition (Coins) |
| ----- | -------- | ---------------- | --------------- | ------------------------ |
| 1     | 28*31    | 2 Red            | 80              | 80                       |
| 2     | 28*31    | 3 Red            | 120             | 120                      |
| 3     | 28*31    | 2 Red, 1 Pink     | 160             | 160                      |
| 4     | 30*33    | 2 Red, 1 Pink, 1 Blue | 200          | 200                      |
| 5     | 30*33    | 1 Red, 1 Pink, 1 Blue, 1 Yellow | 240 | 240                      |
| 6     | 30*33    | 1 Red, 1 Pink, 1 Blue, 1 Yellow | 240 | 240                      |
| 7     | 30*33    | 1 Red, 1 Pink, 1 Blue, 1 Yellow | 240 | 240                      |
| 8     | 30*33    | 1 Red, 1 Pink, 1 Blue, 1 Yellow | 240 | 240                      |
| 9     | 30*33    | 2 Red, 1 Pink, 1 Blue, 1 Yellow | 240 | 240                      |
| 10     | 30*33    | 2 Red, 1 Pink, 1 Blue, 1 Yellow | 240 | 240                      |