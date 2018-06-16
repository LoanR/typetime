<template>
    <section>
        <div v-if="wantsToPlay"></div>
        <div v-else>
            <img src="../assets/logo.png">
            <h1>{{title}}</h1>
            <button-component :content="startContent"></button-component>
            <checkboxes-component :checkboxes="checkboxesDatas"></checkboxes-component>
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
                },
                {
                    label: 'label2',
                    modifier: 'modifier2',
                },
                {
                    label: 'label3',
                    modifier: 'modifier3',
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
