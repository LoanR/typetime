<template>
    <section>
        <img src="../assets/logo.png">
        <h1>{{title}}</h1>
        <nav>
            <router-link v-bind:to="'/about'">About</router-link>
        </nav>

    </section>
</template>

<script>
import animateTitle from '../js/animateTitle.js';

export default {
    name: 'Landing',

    data() {
        return {
            title: 'TypeTime',
            shouldShuffleTitle: true,
            timeOut: null,
            firstTimeOut: 3000
        };
    },

    methods: {
        overwriteTitle() {
            clearTimeout(this.timeOut);
            this.title = animateTitle.shuffleTitle(this.title);
            this.timeOut = window.setTimeout(() => {
                this.overwriteTitle();
            }, animateTitle.randomNum(3000, 200));
        }
    },

    mounted() {
        this.timeOut = window.setTimeout(() => {
            this.overwriteTitle();
        }, this.firstTimeOut);
    }
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
</style>
