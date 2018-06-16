<template>
    <section>
        <div v-if="wantsToPlay"></div>
        <div v-else>
            <header>
                <img src="../assets/logo.png">
                <h1>{{title}}</h1>
            </header>
            <button-component :content="startContent"></button-component>
            <checkboxes-component
                :checkboxes="checkboxesDatas"
                @toggleCheck="mutateModifiers">
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

export default {
    name: 'Landing',

    components: {
        'button-component': buttonComponent,
        'checkboxes-component': checkboxesComponent,
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
                },
                {
                    label: 'label2',
                    modifier: 'modifier2',
                    isChecked: false,
                },
                {
                    label: 'labelx',
                    modifier: 'modifierx',
                    isChecked: false,
                },
                {
                    label: 'label3',
                    modifier: 'modifier3',
                    isChecked: false,
                },
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

        mutateModifiers(toggledModifier) {
            this.checkboxesDatas.find(modifier => modifier.label === toggledModifier.label).isChecked = toggledModifier.isChecked;
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
        margin-bottom: 50px;
        h1 {
            margin: 0;
            position: absolute;
            left: 50%;                        /* horizontal alignment */
            top: 50%;                         /* vertical alignment */
            transform: translate(-50%, -50%); /* precise centering; see link below */
        }
    }

    section {
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
