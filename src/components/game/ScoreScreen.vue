<template>
    <div>
        <p>{{gameOverMessage}}</p>
        <p>{{endGameScoreMessage}}</p>
        <p>
            You were not fast enough to type the letter "{{nemesisLetter}}" of the word
            "{{stuckWordPart1}}<span class="nemesis-letter">{{nemesisLetter}}</span>{{stuckWordPart2}}"
            on level {{gameLevel}}.
        </p>
        <button-component :content="buttonContent" @bigButtonClick="returnHome"></button-component>
        <social-sharing
            url="https://loanr.github.io/typetime/"
            :title="socialMessage"
            description="What a funny game!"
            quote=""
            hashtags="typing,nofilter,waw"
            twitter-user=""
            inline-template>
            <div class="socials">
                <network network="facebook">
                    <i class="fa fa-facebook"></i>
                </network>
                <network network="twitter">
                    <i class="fa fa-twitter"></i>
                </network>
            </div>
        </social-sharing>
    </div>
</template>
<script>
import buttonComponent from '@/components/buttons/Button.vue';
import {SCORE_MESSAGES, GAME_OVER_MESSAGE, REMATCH_BUTTON_CONTENT, END_GAME_SOCIAL_MESSAGE} from '@/conf/strings.js';

export default {
    name: 'ScoreScreen',

    components: {
        'button-component': buttonComponent,
    },

    data() {
        return {
            gameOverMessage: GAME_OVER_MESSAGE,
            buttonContent: REMATCH_BUTTON_CONTENT,
        };
    },

    methods: {
        returnHome() {
            this.$store.commit('stopGame');
            this.$emit('rematch');
        },
    },

    computed: {
        endGameScoreMessage() {
            const scoreMessage = SCORE_MESSAGES[Object.keys(SCORE_MESSAGES).find(scoreKey => this.gameScore < scoreKey)];
            return scoreMessage[0] + this.difficultyDescription + scoreMessage[1] + this.gameScore + scoreMessage[2];
        },

        socialMessage() {
            const intro = this.difficultyDescription ? this.difficultyDescription.charAt(0).toUpperCase() + this.difficultyDescription.slice(1) : '';
            return intro + END_GAME_SOCIAL_MESSAGE[0] + this.gameScore + END_GAME_SOCIAL_MESSAGE[1];
        },

        gameLevel() {
            return this.$store.state.rules.levelRules.currentLevel;
        },

        gameScore() {
            return this.$store.state.score.gameScore;
        },

        difficultyDescription() {
            return this.$store.state.score.difficultyNaming;
        },

        nemesisLetter() {
            return this.$store.state.score.nemesisLetter;
        },

        stuckWordPart1() {
            return this.$store.state.score.stuckWordPart1;
        },

        stuckWordPart2() {
            return this.$store.state.score.stuckWordPart2;
        },
    },
};
</script>
<style lang="scss" scoped>
    @import '../../styles/common';

    .nemesis-letter {
        color: $warning-color;
    }

    .socials {
        display: flex;
        justify-content: space-evenly;
    }
</style>
