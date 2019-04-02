# Typetime
> Touch typing game

The game is playable here: [Typetime](https://loanr.github.io/typetime/)

## Game
[Typetime](https://loanr.github.io/typetime/) is a touch typing game.
You'll have to type words within a time limit. The more you type correctly, the better your score will get.

You can tweak your game with modifiers and difficulties on the home page.
Modifiers will have an impact on the topic of your game and difficulties will simplify or complicate it and affect score.

The launched game will display words that you'll have to type before the timer reaches 0. By default, the game is cut into levels (with time break) asking for a certain amount of words to be typed. Each level will have more, longer and unfrequent words to type in a shorter amount of time but for a better score.

If the timer reaches 0, the game will display your score and let you send it on your social media.

## Project

### Realisation
[Typetime](https://loanr.github.io/typetime/) is a front-only web app. It's deployed on Github Pages.
The word selection is done through requests on the [Datamuse API](http://www.datamuse.com/api/) which is a great ressource for generating lists of related words.

### Difficulty progression
By default, on the first level, **5** words need to be type at a ratio of **30** words per minute (namely 2 seconds per words, which is pretty short). Then on level 2, **6** words need to be type at a ratio of **31** words per minute, and so on.
Words also gets longer and less used in language.

### Modifiers and words
The [Datamuse API](http://www.datamuse.com/api/) is a great playground with many possibilities. On the landing page, you can refresh modifiers which can give your game a topic to follow.
Words of each level are based on the previous one (through phonetic or semantic) giving your game a bit of consistency.
Every response coming from the [Datamuse API](http://www.datamuse.com/api/) is going through a **random** selection module, ensuring freshness, and is also filtered to match the level requirements.

## Development
[Typetime](https://loanr.github.io/typetime/) uses the **[Vue.js](https://vuejs.org/)** framework with **[Vuex](https://vuex.vuejs.org/)**.
Styles are in SCSS.
For development purposes, **[ESLint](https://eslint.org/)** is used with custom rules, and **[Mocha](https://mochajs.org/)** is used with **[Chai](https://www.chaijs.com/)** for testing.

### Run locally
You can clone the project and:
- `npm install` to install dependencies
- `npm run dev`or `npm start` to serve with hot reload at [localhost:8080](http://localhost:8080/)
- `npm run test` to test core app
- `npm run build` to build for production

### Components
The components part of the app is used only for display purposes. The less domain logic in here the better.
The idea was to make them as little as I could. Some datas that affects game logic and rules are stored in the **[Vuex](https://vuex.vuejs.org/)** store. Other datas that are only used for visuals and infos follow the normal usage of **[Vue.js](https://vuejs.org/)**. Specific styles are scoped on the component file.

### Configuration
Every variables that affects game rules are in this folder. They set default game and are used as base values during a match to compute real values according to difficulty and progression.
This also simplyfies basic rule changes and therefore configuration of all the game.

### Core
All domain logic is in this folder.
Functions are independent from the app. The app is using it and it needs it, not the opposite.
This is the core of the game, therefore it is tested to ensure behaviour consistency.

### Tests
Tests are here to check if core logic follows the awaited behaviour.
It's built with **[Mocha](https://mochajs.org/)** and **[Chai](https://www.chaijs.com/)**.
It can be launched with `npm run test` for all tests or with the option `npm run test --recursive "./test/FILENAME.test.js"` to test a specific part of core.
They need to be launched on every modification and a new one must be created when a
new function is added in the core.

## Future iterations
A project never really ends and there are topics that need handling:
- :family_woman_girl_girl: *composability*: better usage of Vue.js composability, generisize and reuse possibility mindset
- :scroll: *documentation*: not everyone seem to be ok with absolutely no comment policy...
- :beetle: *CORS bug*: handle dev & prod cookies
- :alarm_clock: *preparation - break time screen*: real progress bar with a real meaning
- :white_check_mark: *testing*: upgrade with mocks, testing interface in browser, relative paths
- :trophy: *endgame*: more stats, balance score
- :incoming_envelope: *Datamuse API*: use workers for requests
- :fr: *i18n*
- :gear: *game rules*: better manipulation of configuration files
- :package: *webpack*: upgrade many dependencies starting with webpack 4

You can follow progression on the **[project](https://github.com/LoanR/typetime/projects/1)** page.

---

Have fun!

[Typetime](https://loanr.github.io/typetime/)
