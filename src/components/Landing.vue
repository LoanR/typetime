<template>
    <section>
        <game-hub-component v-if="wantsToPlay"
            :words="wordsToType"
            :level="gameLevel"
            :levelWordsCount="wordsToTypeCount"
            @nextLevel="nextLevel">
        </game-hub-component>
        <div v-else>
            <header>
                <img src="../assets/logo.png">
                <h1>{{title}}</h1>
            </header>
            <button-component :content="startContent" @lauchGame="launchGame"></button-component>
            <checkboxes-component
                :checkboxes="checkboxesDatas"
                @toggleCheck="toggleModifiers">
            </checkboxes-component>
            <nav>
                <router-link v-bind:to="'/about'">About</router-link>
            </nav>
        </div>

    </section>
</template>

<script>
import random from '../js/random.js';

import buttonComponent from './buttons/Button.vue';
import checkboxesComponent from './sections/Checkboxes.vue';
import gameHubComponent from './game/GameHub.vue';

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
            shouldShuffleTitle: true,
            timeOut: null,
            firstTimeOut: 3000,
            wantsToPlay: false,
            startContent: 'start',
            checkboxesDatas: [
                {
                    label: 'label',
                    modifier: 'modifier',
                    isChecked: false,
                    isExclusive: true,
                },
                {
                    label: 'label2',
                    modifier: 'modifier2',
                    isChecked: true,
                    isExclusive: true,
                },
                {
                    label: 'labelx',
                    modifier: 'modifierx',
                    isChecked: false,
                    isExclusive: true,
                },
                {
                    label: 'label3',
                    modifier: 'modifier3',
                    isChecked: false,
                    isExclusive: false,
                },
            ],
            wordsToType: [],
            nextWordsToType: [],
            startingWordsToTypeCount: 5,
            gameLevel: 1,
        };
    },

    methods: {
        overwriteTitle() {
            clearTimeout(this.timeOut);
            this.title = this.shuffleTitle();
            this.timeOut = window.setTimeout(() => {
                this.overwriteTitle();
            }, random.randomNum(3000, 200));
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

        toggleModifiers(toggledModifierLabel) {
            const toggledModifier = this.checkboxesDatas.find(modifier => modifier.label === toggledModifierLabel);
            if (toggledModifier.isExclusive) {
                this.unckeckOtherExclusiveModifiers(toggledModifier);
            }
            toggledModifier.isChecked = !toggledModifier.isChecked;
        },

        unckeckOtherExclusiveModifiers(toggledModifier) {
            const exclusiveModifiers = this.checkboxesDatas.filter(modifier => !!modifier.isExclusive);
            for (let mod of exclusiveModifiers) {
                if (mod !== toggledModifier) {
                    mod.isChecked = false;
                }
            }
        },

        async launchGame() {
            try {
                this.wantsToPlay = true;
                this.wordsToType = await this.requestWords(this.startingWordsToTypeCount);
                this.requestNextWordsNoWait(this.wordsToTypeCount + 1);
            } catch (err) {
                window.alert(err);
            }
        },

        async requestWords(wordCount) {
            try {
                let unformattedData = [];
                while (unformattedData.length < wordCount) {
                    const response = await fetch('https://api.datamuse.com/words?sp=évider'); // new word on each request
                    unformattedData.push(...await response.json());
                }
                return this.selectWords(unformattedData, wordCount);
            } catch (err) {
                throw new Error(err);
            }
        },

        requestNextWordsNoWait(wordCount) {
            fetch('https://api.datamuse.com/words?sp=truc').then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            }).then(unformattedData => {
                this.nextWordsToType = this.selectWords(unformattedData, Math.min(wordCount, unformattedData.length));
            }).catch((err) => window.alert(err));
        },

        selectWords(jsonResponse, wordCount) {
            let selectedWords = [];
            for (let i = 1; i <= wordCount; i++) {
                const wordData = jsonResponse.splice(random.randomNum(jsonResponse.length, 0), 1)[0];
                selectedWords.push(wordData.word);
            }
            return selectedWords;
        },

        async nextLevel() {
            this.gameLevel += 1;
            while (this.nextWordsToType.length < this.wordsToTypeCount) {
                const remainingWordCount = this.wordsToTypeCount - this.nextWordsToType.length;
                this.nextWordsToType.push(...await this.requestWords(remainingWordCount));
            }
            this.wordsToType = this.nextWordsToType;
            this.requestNextWordsNoWait(this.wordsToTypeCount + 1);
        },
    },

    computed: {
        wordsToTypeCount() {
            return this.startingWordsToTypeCount + this.gameLevel - 1;
        },
    },

    mounted() {
        if (this.shouldShuffleTitle) {
            this.timeOut = window.setTimeout(() => {
                this.overwriteTitle();
            }, this.firstTimeOut);
        };
    },
};
</script>

<style lang="scss" scoped>
    @import '../styles/common';

    header {
        height: 200px;
        position: relative;
        padding: 50px 0;
        h1 {
            margin: 0;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }

    section {
        width: 100%;
        height: 100%;
        text-align: center;
    }

    h1 {
        font-weight: $bold-weight;
        font-size: $big-font-size;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }

    .modifier-container {
        display: flex;
        justify-content: center;
    }

</style>
