# Typetime
> Touch typing game

[Typetime](https://loanr.github.io/typetime/)

## Project
The starting idea was to create a game were the player needed to type a certain word in a allocated time.
The game is cut into levels asking for a certain number of words to be typed.
On the first level 5 words needs to be type at a ratio of 30 words per minute.
Each level needs one additional word typed and the ratio is also raised by one per minute. The complexity of words is also raised on each new level.
An error should be notified to the player and if the countdown reaches 0.00, it's game over.

## Realisation
This game is a Vuejs front-only project with SCSS stylesheets.
Not many pages are required so it's a kinda single page app.
It's deployed on GitHub Pages so paths and Webpack have been configured this way.
The word selection is done through requests on the [Datamuse API](http://www.datamuse.com/api/) which is a great ressource for generating lists of linked words.

### Random mods
The [Datamuse API](http://www.datamuse.com/api/) was a great playground with many possibilities so I choosed to use a bit of it through randomness.
You can request words with constraints like meaning, sounds, spelling and ask for additional values like frequency. So I gave different random choices to the player on each new game to use this range of options which the game will try to follow if the request response is consistent.
Each new list of words (for each new level) depends on the previous one. This way, I could 'thematise' each game around a word or a constraint.
The game modificators are rebuild on each new match.

It's done through a configuration - interpretation pair file. This way, if a new request type needs to be created, you just need to modify the configuration which is a simple key-value data (so dict, hash, associative array, JSON...). The engine will normally be able to understand that.

### Game rules
The starting game rules are somewhat hard enough. So my idea was to offer different difficulty levels for the player to select. So you can start with more time to type, keep and add time between words, remove the preparation screen between levels and ask for more difficult and unfrequent words. Each rules are independant and can be played at the same time.

The idea was to follow the configuration - interpretation schema but my problem was that difficulties touches the core of game rules. The next iteration could be to generalize game rules for them to be more receptive to modification...

## Instruction
Well, nothing in particular, just choose your game type on the landing screen and play! And above all, have fun!

[Typetime](https://loanr.github.io/typetime/)
