<template>
    <section class="slide-container">
        <transition :name="slideTransition">
            <game-hub-component v-if="currentlyPlaying" @rematch="restartGame"></game-hub-component>
            <div v-else class="landing-container">
                <header>
                    <img src="../assets/images/typetime_logo.svg">
                    <h1 @mouseover="resetTitle" @mouseout="restartShuffle">{{shuffledTitle}}</h1>
                </header>
                <div class="interactions">
                    <div>
                        <button-component :content="startContent" @bigButtonClick="launchGame"></button-component>
                    </div>
                    <div class="mod-diff-container">
                        <checkboxes-component
                            :switches="selectedModifiers"
                            :titleCategory="modTitle"
                            @toggleCheck="toggleModifiers">
                        </checkboxes-component>
                        <checkboxes-component
                            :switches="difficulties"
                            :titleCategory="diffTitle"
                            @toggleCheck="toggleDifficulties">
                        </checkboxes-component>
                    </div>
                </div>
                <nav>
                    <router-link v-bind:to="'/typetime/about'" v-on:click.native="resetTitle">About</router-link>
                </nav>
            </div>
        </transition>
    </section>
</template>

<script>
import random from '@/core/random.js';
import gameTuning from '@/core/gameTuning.js';
import wordSelection from '@/core/wordSelection.js';
import {searchForWordsToType} from '@/mixins/wordSetter.js';

import buttonComponent from '@/components/buttons/Button.vue';
import checkboxesComponent from '@/components/sections/Checkboxes.vue';
import gameHubComponent from '@/components/game/GameHub.vue';

import {requestDataWords} from '@/core/wordRequest';

export default {
    name: 'Landing',

    components: {
        'button-component': buttonComponent,
        'checkboxes-component': checkboxesComponent,
        'game-hub-component': gameHubComponent,
    },

    data() {
        return {
            title: 'TypeTime',
            shuffledTitle: 'TypeTime',
            shouldShuffleTitle: true,
            shouldSlideFromRight: true,
            timeOut: null, // rules conf file
            firstTimeOut: 3000, // rules conf file
            startContent: 'start',
            modTitle: 'Modifiers',
            diffTitle: 'Difficulties',
            selectedModifiers: gameTuning.getEmptyMods(),
            modifiers: gameTuning.getModifiers(),
            // difficulties: gameTuning.getDifficulties(),
            wordsPerMinute: 30, // rules conf file
            // wordsToType: [], // game run file
            // nextWordsToType: [], // game run file
            startingWordsToTypeCount: 5, // rules conf file
            gameLevel: 1, // rules file
            apiEndpoint: 'https://api.datamuse.com/words?', // game run file
            frequencyParameter: '&md=f', // game run file
            keySounds: [
                require('@/assets/sounds/key1.mp3'),
                require('@/assets/sounds/key2.mp3'),
                require('@/assets/sounds/key3.mp3'),
            ],
        };
    },

    methods: {
        overwriteTitleCycle() {
            clearTimeout(this.timeOut);
            if (this.shouldShuffleTitle) {
                this.shuffledTitle = this.shuffleTitle();
                new Audio(this.keySounds[random.randomNum(this.keySounds.length)]).play();
                this.timeOut = window.setTimeout(this.overwriteTitleCycle, random.randomNum(3000, 200));
            }
        },

        shuffleTitle() {
            let movableLettersIndices = [1, 2, 3, 5, 6];
            let titleCopy = this.title.split('');
            const firstLetterIndice = movableLettersIndices.splice(random.randomNum(movableLettersIndices.length, 0), 1);
            const firstLetter = this.title[firstLetterIndice];
            const secondLetterIndice = movableLettersIndices.splice(random.randomNum(movableLettersIndices.length, 0), 1);
            const secondLetter = titleCopy.splice(secondLetterIndice, 1, firstLetter)[0];
            titleCopy.splice(firstLetterIndice, 1, secondLetter).join('');
            return titleCopy.join('');
        },

        resetTitle() {
            this.shouldShuffleTitle = false;
            this.shuffledTitle = this.title;
        },

        restartShuffle() {
            this.shouldShuffleTitle = true;
            this.overwriteTitleCycle();
        },

        toggleModifiers(toggledModifierId) {
            const toggledModifier = this.selectedModifiers.find(modifier => modifier.id === toggledModifierId);
            this.uncheckRelatedModifiers(toggledModifier);
            toggledModifier.isChecked = !toggledModifier.isChecked;
            this.$store.commit(
                'setWordsContext',
                {
                    wordsContext: gameTuning.getWordsContext(this.modifiers, this.selectedModifiers),
                }
            );
        },

        uncheckRelatedModifiers(toggledModifier) {
            let clusterMods = [];
            if (toggledModifier.modCluster === 'all') {
                clusterMods = this.selectedModifiers;
            } else {
                clusterMods = this.selectedModifiers.filter(modifier => modifier.modCluster === toggledModifier.modCluster || modifier.modCluster === 'all');
            }
            for (let mod of clusterMods) {
                if (mod !== toggledModifier) {
                    mod.isChecked = false;
                }
            }
        },

        async launchGame() {
            try {
                this.shouldShuffleTitle = false;
                this.shouldSlideFromRight = true;
                this.$store.commit('resetLevelRules'); // reusable -> store action ?
                this.$store.commit('resetScore'); // reusable -> store action ?
                this.defineDifficultyNaming();
                this.$store.commit('togglePlay');
                this.$store.commit('setWordsSelectionRules', {wordsSelectionRules: wordSelection.getLevelRule(this.$store.state.rules.gameDifficulties.isMasochist, this.$store.state.rules.levelRules.currentLevel)}); // reusable -> store action ?
                searchForWordsToType(this.$store); // reusable -> store action ?
                // const query = this.getUrlQuery();
                // this.wordsToType = await this.requestDataWords(this.startingWordsToTypeCount, query[0], query[1], query[2]);
                // this.requestNextWordsNoWait(this.wordsToTypeCount + 1);
            } catch (err) {
                this.restartGame();
                window.alert('We couldn\'t find enough words to type, please launch a new game...');
            }
        },

        // async requestDataWords(wordCount, queryParameter, queryValue, option = '', filterAgainstRules = true) {
        //     try {
        //         let unformattedData = [];
        //         let i = 1;
        //         while (unformattedData.length < wordCount) {
        //             if (i > 1) {
        //                 queryParameter = 'ml=';
        //                 if (i > 2) {
        //                     queryValue = 'effect';
        //                 }
        //             }
        //             const response = await fetch(this.apiEndpoint + queryParameter + queryValue + option + this.frequencyParameter);
        //             if (i > 1) {
        //                 unformattedData.unshift(...await response.json());
        //             } else {
        //                 unformattedData.push(...await response.json());
        //             }
        //             i += 1;
        //         }
        //         return this.selectWords(unformattedData, wordCount, filterAgainstRules);
        //     } catch (err) {
        //         throw new Error(err);
        //     }
        // },

        // requestNextWordsNoWait(wordCount) {
        //     const query = this.getUrlQuery();
        //     fetch(this.apiEndpoint + query[0] + query[1] + query[2] + this.frequencyParameter).then(response => {
        //         if (response.ok) {
        //             return response.json();
        //         }
        //     }).then(unformattedData => {
        //         this.nextWordsToType = this.selectWords(unformattedData, Math.min(wordCount, unformattedData.length));
        //     });
        // },

        // selectWords(jsonResponse, wordCount, filterAgainstRules = true) {
        //     let selectedWords = [];
        //     const filteredData = filterAgainstRules ? wordSelection.filterWordsOnRule(jsonResponse, this.gameLevel, gameTuning.isMasochist(this.difficulties), wordCount) : jsonResponse;
        //     for (let i = 1; i <= wordCount; i++) {
        //         const wordData = filteredData.splice(random.randomNum(filteredData.length, 0), 1)[0];
        //         selectedWords.push(this.mayMutateCase(wordData.word));
        //     }
        //     return selectedWords;
        // },

        // mayMutateCase(word) {
        //     const rand = random.randomNum(3, 0);
        //     if (!rand && ((gameTuning.isMasochist(this.difficulties) && this.gameLevel >= 3) || this.gameLevel >= 5)) {
        //         return word.charAt(0).toUpperCase() + word.slice(1);
        //     }
        //     return word;
        // },

        // async nextLevel() {
        //     try {
        //         this.gameLevel += 1;
        //         const query = this.getUrlQuery();
        //         // while (this.nextWordsToType.length < this.wordsToTypeCount) {
        //         //     const remainingWordCount = this.wordsToTypeCount - this.nextWordsToType.length;
        //         //     this.nextWordsToType.unshift(...await this.requestDataWords(remainingWordCount, query[0], query[1], query[2]));
        //         // }
        //         this.$store.dispatch(
        //             'requestAndSetWordsToType',
        //             {
        //                 wordAmount: this.wordsToTypeCount,
        //                 queryParameter: query[0],
        //                 queryValue: query[1],
        //                 queryOption: query[2],
        //                 gameLevel: this.gameLevel,
        //                 isMasochist: gameTuning.isMasochist(this.difficulties),
        //                 capitalizeProbability: wordSelection.getLevelRule(gameTuning.isMasochist(this.difficulties), this.gameLevel).capitalizeProbability,
        //             }, // all in state level rule
        //         );
        //         // this.wordsToType = this.nextWordsToType;
        //         // this.requestNextWordsNoWait(this.wordsToTypeCount + 1);
        //     } catch (error) {
        //         this.restartGame();
        //         window.alert('We couldn\'t find enough words for the next level, please launch a new game...');
        //     }
        // },

        // getUrlQuery() {
        //     const checkedMods = this.selectedModifiers.filter(mod => !!mod.isChecked);
        //     const randWordModifier = this.modifiers.find(mod => mod.modCluster === 'word');
        //     let param = 'ml=';
        //     let value = !randWordModifier ? 'care' : randWordModifier.value;
        //     let option = '';
        //     if (checkedMods.length) {
        //         param = this.getParamFromMods(checkedMods) || param; // state level rule constraint
        //         value = this.getValueFromMods(checkedMods) || value; // state level rule theme
        //         option = this.getOptionFromMods(checkedMods) || option; // state level rule option
        //     }
        //     const levelTheme = this.thematiseGame();
        //     if (levelTheme) {
        //         value = levelTheme;
        //     }
        //     return [param, value, option];
        // },

        // getParamFromMods(mods) {
        //     const m = mods.filter(mod => mod.param !== '');
        //     if (m.length === 1) {
        //         return m[0].param;
        //     }
        // },

        // getValueFromMods(mods) {
        //     const m = mods.filter(mod => mod.value !== '');
        //     if (m.length === 1) {
        //         return m[0].value;
        //     }
        // },

        // getOptionFromMods(mods) {
        //     const m = mods.filter(mod => mod.option !== '');
        //     if (m.length === 1) {
        //         return m[0].option;
        //     }
        // },

        thematiseGame() { // get theme level from state
            if (this.$store.state.wordsRelated.wordsToType.length) {
                return this.$store.state.wordsRelated.wordsToType[this.$store.state.wordsRelated.wordsToType.length - 1];
            }
            return null;
        },

        async selectModifiers() {
            // this.availableModifiers.push(...await this.getNewModifiers());
            this.modifiers.push(...await this.getNewModifiers());
            for (let i = 0; i < 4; i++) {
                // this.gameModifiers.splice(i, 1, this.modifiers.splice(random.randomNum(this.modifiers.length, 0), 1)[0]); // why [0] ?
                this.selectedModifiers.splice(i, 1, this.modifiers.splice(random.randomNum(this.modifiers.length, 0), 1)[0]);
            }
            this.$store.commit(
                'setWordsContext',
                {
                    wordsContext: gameTuning.getWordsContext(this.modifiers, this.selectedModifiers),
                }
            );
        },

        async getNewModifiers() {
            const accentValues = ['*é*', '*è*', '*ê*', '*ë*', '*â*', '*ï*'];
            const rareAccentValues = ['*á*', '*å*', '*ë*', '*â*', '*í*', '*ö*', '*ó*', '*ü*', '*ú*'];
            const modWords = [
                {param: 'ml=', value: 'toujours'}, // need more random
                {param: 'ml=', value: 'voiture'}, // need more random
                {param: 'ml=', value: 'live'}, // need more random
                {param: 'ml=', value: 'reason'}, // need more random
                {param: 'sp=', value: accentValues[random.randomNum(accentValues.length, 0)]},
                {param: 'sp=', value: rareAccentValues[random.randomNum(rareAccentValues.length, 0)]},
            ];
            let mods = [];
            for (const modWord of modWords) {
                mods = await this.addWordModifier(mods, modWord.param, modWord.value);
            }
            const modsToAdd = [];
            for (const mod of mods) {
                modsToAdd.push(
                    {
                        id: '"' + mod + '"',
                        label: '"' + mod + '"',
                        values: {wordsTheme: mod},
                        isChecked: false,
                        modCluster: 'word',
                        description: 'Suggest the game to search for words around "' + mod + '".',
                    }
                );
            }
            return modsToAdd;
        },

        async addWordModifier(mods, param, value) {
            try {
                const word = random.selectRandomEntities(1, wordSelection.cleanDataWords(await requestDataWords(1, param, value, '', false)))[0];
                if (mods.indexOf(word) !== -1) {
                    return null;
                }
                mods.push(word);
                return mods;
            } catch (error) {
                this.restartGame();
                window.alert('We couldn\'t build consistent modifiers, please launch a new game...');
            }
        },

        toggleDifficulties(toggledDifficultyId) {
            const toggledDifficulty = this.difficulties.find(dif => dif.id === toggledDifficultyId);
            this.$store.commit('setDifficulty', {settingId: toggledDifficultyId, isChecked: !toggledDifficulty.isChecked});
            if (toggledDifficultyId === 'isSnail') {
                this.wordsPerMinute = this.wordsPerMinute === 30 ? 10 : 30; // magic
            }
        },

        defineDifficultyNaming() {
            let checkedDifficulties = this.difficulties.filter(d => d.isChecked);
            checkedDifficulties.sort((d1, d2) => d1.stringOrder - d2.stringOrder);
            this.$store.commit('setDifficultyNaming', {
                difficultyNaming: checkedDifficulties.length ? ('as ' + checkedDifficulties[0].article + ' "' + checkedDifficulties.map(d => d.label).join(' ') + '", ') : '',
            });
        },

        restartGame() {
            this.shouldSlideFromRight = false;
            this.shouldShuffleTitle = true;
            this.overwriteTitleCycle();
            this.selectedModifiers = gameTuning.getEmptyMods();
            this.modifiers = gameTuning.getModifiers();
            this.selectModifiers();
            this.$store.commit('togglePlay');
            // this.wordsToType = [];
            // this.nextWordsToType = [];
        },
    },

    computed: {
        wordsToTypeCount() {
            return this.startingWordsToTypeCount + this.gameLevel - 1;
        },

        slideTransition() {
            return this.shouldSlideFromRight ? 'slide-fade-right' : 'slide-fade-left';
        },

        currentlyPlaying() {
            return this.$store.state.currentlyPlaying;
        },

        difficulties() {
            return gameTuning.getDifficulties().map(difficulty => {
                difficulty.isChecked = this.$store.state.rules.gameDifficulties[difficulty.id];
                return difficulty;
            });
        },

        // selectedModifiers() {
        //     console.log('---------');
        //     console.log(this.modifiers);
        //     console.log('---------');
        //     const selectedModifiers = this.modifiers.filter(mod => mod.isSelected);
        //     if (selectedModifiers.length < 4) {
        //         return gameTuning.getEmptyMods();
        //     }
        //     return selectedModifiers;
        // },
    },

    mounted() {
        console.log('new mount');
        if (this.shouldShuffleTitle) {
            this.timeOut = window.setTimeout(() => {
                this.overwriteTitleCycle();
            }, this.firstTimeOut);
        };
        this.selectModifiers();
    },
};
</script>

<style lang="scss" scoped>
    @import '../styles/common';
    @import '../styles/slides';

    .slide-container {
        width: 100%;
        height: 100%;
        text-align: center;

        &>div {
            width: 100%;
            height: 100%;
        }

        .landing-container {

            header {
                height: 200px;
                position: relative;
                padding: 2rem;

                img {
                    max-width: 200px;
                }

                h1 {
                    font-weight: $bold-weight;
                    font-size: $big-font-size;
                    margin: 0;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            }

            nav {
                padding: 0.5rem 1rem 2rem;
            }
        }
    }
</style>
