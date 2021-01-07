# Snake

A recreation of classic Snake.

I've always enjoyed Snake and this was a blast to try implementing in the DOM using asynchronous event driven JavaScript to handle user input, snake tail behavior and food generation.

**[Play Here!](https://bl.ocks.org/OwenKLenz/raw/b56c1da67d9e39c12426a390f626050e/)**


### Rules
- Use W, A, S and D keys to move up, left, down and right.
- Maneuver your snake around its own increasingly long tail and eat food (the blue dots) to keep growing.
- Each food increases your score and your highest score is tracked in local storage and displayed alongside your current score.

### Future Plans
- Smoother animation. To keep things simpler I opted to restrict movement to a grid of 10px by 10px squares with the snake moving forward one square every 150 ms. This results in a slightly laggy UX so a version featuring super smooth movement is in the works.
- As a gimmick I'm experimenting with creating an "inchworm" mode, with movement that mimics an inchworm.

