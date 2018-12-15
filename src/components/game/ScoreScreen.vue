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

export default {
    name: 'ScoreScreen',

    components: {
        'button-component': buttonComponent,
    },

    data() {
        return {
            gameOverMessage: 'GameOver...', // conf
            buttonContent: 'rematch', // conf
        };
    },

    methods: {
        returnHome() {
            this.$store.commit('stopGame');
            this.$emit('rematch');
        },
    },

    computed: {
        endGameScoreMessage() { // conf ?
            let scoreMessage = 'You could have done better, but ' + this.difficultyDescription + ' you made a total of ' + this.gameScore + ' points. It is not that bad!';
            if (this.gameScore < 0) {
                scoreMessage = 'Do you know your keyboard? I mean ' + this.difficultyDescription + ' you now have a debt of ' + this.gameScore + ' points. I\'m disappointed.';
            } else if (this.gameScore === 0) {
                scoreMessage = 'Did you type anything? Well, ' + this.difficultyDescription + ' you made 0 points, that\'s not really time efficient...';
            } else if (this.gameScore < 400) {
                scoreMessage = 'You where not truly good, but ' + this.difficultyDescription + ' you made ' + this.gameScore + ' points. It is at least something...';
            } else if (this.gameScore > 2000) {
                scoreMessage = 'You\'re a beast, ' + this.difficultyDescription + ' you made ' + this.gameScore + ' points! Bravo!';
            }
            return scoreMessage;
        },

        socialMessage() {
            const intro = this.difficultyDescription ? this.difficultyDescription.charAt(0).toUpperCase() + this.difficultyDescription.slice(1) : '';
            return intro + 'I made a score of ' + this.gameScore + ' points on Typetime. This game made my day. Now, come fight me!'; // conf
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
