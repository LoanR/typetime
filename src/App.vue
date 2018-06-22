<template>
    <div id="app" class="slide-container">
        <transition :name="slideTransition">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'App',

    data() {
        return {
            shouldSlideFromRight: false,
        };
    },

    computed: {
        slideTransition() {
            return this.shouldSlideFromRight ? 'slide-fade-right' : 'slide-fade-left';
        },
    },

    watch: {
        '$route'(to, from) {
            const toDepth = to.meta.depth;
            const fromDepth = from.meta.depth;
            this.shouldSlideFromRight = toDepth > fromDepth;
        },
    },
};
</script>

<style lang="scss">
    @import './styles/common';
    @import './styles/slides';

    #app {
        width: 100%;
        height: 100vh;
    }
</style>
