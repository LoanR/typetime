<template>
    <section>
        <game-component v-if="wantsToPlay" :words="wordsToType" @nextLevel="nextLevel"></game-component>
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
import animateTitle from '../js/animateTitle.js';

import buttonComponent from './buttons/Button.vue';
import checkboxesComponent from './sections/Checkboxes.vue';
import gameComponent from './game/Game.vue';

export default {
    name: 'Landing',

    components: {
        'button-component': buttonComponent,
        'checkboxes-component': checkboxesComponent,
        'game-component': gameComponent,
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
        };
    },

    methods: {
        overwriteTitle() {
            clearTimeout(this.timeOut);
            this.title = animateTitle.shuffleTitle(this.title);
            this.timeOut = window.setTimeout(() => {
                this.overwriteTitle();
            }, animateTitle.randomNum(3000, 200));
        },

        toggleModifiers(toggledModifierLabel) {
            const toggledModifier = this.checkboxesDatas.find(modifier => modifier.label === toggledModifierLabel);
            if (toggledModifier.isExclusive) {
                this.unckeckOtherEsclusiveModifiers(toggledModifier);
            }
            toggledModifier.isChecked = !toggledModifier.isChecked;
        },

        unckeckOtherEsclusiveModifiers(toggledModifier) {
            const exclusiveModifiers = this.checkboxesDatas.filter(modifier => !!modifier.isExclusive);
            for (let mod of exclusiveModifiers) {
                if (mod !== toggledModifier) {
                    mod.isChecked = false;
                }
            }
        },

        launchGame() {
            this.wantsToPlay = !this.wantsToPlay;
        },

        nextLevel() {
            this.wordsToType = this.nextWordsToType;
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
