<template>
    <div class="transition-window">
        <span>{{preparationMessage}}</span>
        <div class="circle-spinner spinner" data-anim="base wrapper">
            <div class="half-left-circle spinner" data-anim="base left"></div>
            <div class="half-right-circle spinner" data-anim="base right"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TransitionScreen',

    props: ['words', 'level'],

    data() {
        return {
            welcomeMessage: 'Ready?',
        };
    },

    methods: {
        nextLevel() {
            this.$emit('nextLevel');
        },
    },

    computed: {
        preparationMessage() {
            return this.welcomeMessage;
        },
    },
};
</script>

<style lang="scss" scoped>
    @import '../../styles/common';

    @keyframes right-spin {
        from {transform: rotate(0deg);}
        to {transform: rotate(180deg);}
    }
    /* Rotate the left side of the progress bar from 0 to 360 degrees */
    @keyframes left-spin {
        from {transform: rotate(0deg);}
        to {transform: rotate(360deg);}
    }
    /* Set the wrapper clip to auto, effectively removing the clip */
    @keyframes end-spin {
        to {clip: rect(auto, auto, auto, auto);}
    }

    .transition-window {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .spinner {
            animation-iteration-count: 1;
            animation-fill-mode: forwards;
            animation-timing-function: linear;
        }

        .circle-spinner {
            width: 300px;
            height: 300px;
            position: absolute;
            clip: rect(0px, 300px, 300px, 150px);
            animation-duration: 0.01s;
            animation-delay: 0.8s;
            animation-name: end-spin;

            .half-left-circle, .half-right-circle {
                width: 200px;
                height: 200px;
                border: 50px solid $light-base-color;
                border-radius: 150px;
                position: absolute;
                clip: rect(0px, 150px, 300px, 0px);
            }

            .half-left-circle {
                animation-duration: 3s;
                border: 50px solid $light-base-color;
                animation-timing-function: cubic-bezier(0,0,.375,1);
                animation-name: left-spin;
            }

            .half-right-circle {
                animation-duration: 0.8s;
                animation-name: right-spin;
            }
        }
    }

</style>
