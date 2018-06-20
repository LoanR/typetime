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
            checkboxesDatas: [],
            modifiers: [
                {
                    label: 'lexical',
                    urlBit: 'rel_trg=',
                    isChecked: false,
                    modCluster: 'parameter',
                },
                {
                    label: 'semantic',
                    urlBit: 'ml=',
                    isChecked: false,
                    modCluster: 'parameter',
                },
                {
                    label: 'phonetic',
                    urlBit: 'sl=',
                    isChecked: false,
                    modCluster: 'parameter',
                },
                {
                    label: 'rhyme',
                    urlBit: 'rel_rhy=',
                    isChecked: false,
                    modCluster: 'parameter',
                },
                {
                    label: 'español',
                    urlBit: 'ml=ahora&v=es',
                    isChecked: false,
                    modCluster: 'all',
                },
            ],
            wordsToType: [],
            nextWordsToType: [],
            startingWordsToTypeCount: 5,
            gameLevel: 1,
            apiEndpoint: 'https://api.datamuse.com/words?',
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
            this.unckeckRelatedModifiers(toggledModifier);
            toggledModifier.isChecked = !toggledModifier.isChecked;
        },

        unckeckRelatedModifiers(toggledModifier) {
            let clusterMods = [];
            if (toggledModifier.modCluster === 'all') {
                clusterMods = this.checkboxesDatas;
            } else {
                clusterMods = this.checkboxesDatas.filter(modifier => modifier.modCluster === toggledModifier.modCluster || modifier.modCluster === 'all');
            }
            for (let mod of clusterMods) {
                if (mod !== toggledModifier) {
                    mod.isChecked = false;
                }
            }
        },

        async launchGame() {
            try {
                this.wantsToPlay = true;
                this.wordsToType = await this.requestWords(this.startingWordsToTypeCount, this.queryParameter(), this.queryValue());
                this.requestNextWordsNoWait(this.wordsToTypeCount + 1);
            } catch (err) {
                window.alert(err);
            }
        },

        async requestWords(wordCount, queryParameter, queryValue, option = '') {
            try {
                let unformattedData = [];
                let i = 1;
                while (unformattedData.length < wordCount) {
                    if (i > 1) {
                        queryParameter = 'ml=';
                        if (i > 2) {
                            queryValue = 'effect';
                        }
                    }
                    const response = await fetch(this.apiEndpoint + queryParameter + queryValue + option); // new word on each request
                    unformattedData.push(...await response.json());
                    i += 1;
                }
                return this.selectWords(unformattedData, wordCount);
            } catch (err) {
                throw new Error(err);
            }
        },

        requestNextWordsNoWait(wordCount) {
            fetch(this.apiEndpoint + this.queryParameter() + this.queryValue()).then(response => {
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
                this.nextWordsToType.push(...await this.requestWords(remainingWordCount, this.queryParameter(), this.queryValue()));
            }
            this.wordsToType = this.nextWordsToType;
            this.requestNextWordsNoWait(this.wordsToTypeCount + 1);
        },

        queryParameter() {
            return this.overrideDefault('parameter') || 'ml=';
        },

        queryValue() {
            if (this.nextWordsToType.length) {
                return this.cleanQueryValue(this.nextWordsToType[this.nextWordsToType.length - 1]);
            } else if (this.wordsToType.length) {
                return this.cleanQueryValue(this.wordsToType[this.wordsToType.length - 1]);
            }
            return this.overrideDefault('word') || this.modifiers.find(mod => mod.modCluster === 'word').urlBit;
        },

        cleanQueryValue(string) {
            const trimmedStr = string.trim();
            const firstSpaceId = trimmedStr.indexOf(' ');
            return firstSpaceId !== -1 ? trimmedStr.substring(0, firstSpaceId) : trimmedStr;
        },

        overrideDefault(cluster) {
            const checkedMods = this.checkboxesDatas.filter(mod => !!mod.isChecked);
            if (checkedMods.length) {
                console.log(checkedMods.length);
                const m = checkedMods.find(mod => mod.modCluster === cluster);
                console.log(m);
                if (m) {
                    return m.urlBit;
                }
            }
            return null;
        },

        async setModifiers() {
            let mods = [this.cleanQueryValue((await this.requestWords(1, 'ml=', 'toujours', '&max=50'))[0])];
            mods.push(this.cleanQueryValue((await this.requestWords(1, 'ml=', 'voiture', '&max=50'))[0]));
            mods.push(this.cleanQueryValue((await this.requestWords(1, 'ml=', 'people', '&max=50'))[0]));
            mods.push(this.cleanQueryValue((await this.requestWords(1, 'ml=', 'places', '&max=50'))[0]));
            mods.push(this.cleanQueryValue((await this.requestWords(1, 'ml=', 'because', '&max=50'))[0]));
            mods.forEach(mod => {
                this.modifiers.push(
                    {
                        label: '"' + mod + '"',
                        urlBit: mod,
                        isChecked: false,
                        modCluster: 'word',
                    }
                );
            });
            for (let i = 0; i < 4; i++) {
                this.checkboxesDatas.push(this.modifiers.splice(random.randomNum(this.modifiers.length, 0), 1)[0]);
            }
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
        this.setModifiers();
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
