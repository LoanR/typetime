<template>
    <section>
        <game-hub-component v-if="wantsToPlay" :words="wordsToType" :level="gameLevel" @nextLevel="nextLevel"></game-hub-component>
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
            wordsToType: [ // request wordsToType on start button <= game needs to wait for this list
                'abc',
                'cou',
                'truc',
                'batte',
                'haut',
            ],
            nextWordsToType: [ // then request future words from a word of the first request <= on background
                'bla',
                'machin',
                'Érythrocyte', // death upon you
                'xylophone',
                'véritable',
                'besoin',
            ],
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
                await this.launchLevel();
                this.wantsToPlay = !this.wantsToPlay;
            } catch (err) {
                window.alert(err);
            }
        },

        async launchLevel() {
            try {
                const response = await fetch('https://api.datamuse.com/words?ml=vache');
                const unformattedData = await response.json();
                this.wordsToType = this.selectWords(unformattedData, this.startingWordsToTypeCount + this.gameLevel - 1);
            } catch (err) {
                throw new Error(err);
            }
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
            try {
                this.gameLevel += 1;
                await this.launchLevel();
            } catch (err) {
                window.alert(err);
            }
            // this.wordsToType = this.nextWordsToType;
            // request a new nextWordsToType list
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
