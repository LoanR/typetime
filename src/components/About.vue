<template>
    <div class="about-page">
        <h2>
            Typetime
        </h2>
        <div class="description-text">
            <p>
                Typetime is a front only <a href="https://vuejs.org/">Vuejs</a> project.
            </p>
            <p>
                The idea was to create a touch typing game where you need to type the displayed word in an allocated time.
            </p>
            <p>
                The game is cut into levels asking for a certain number of words to be typed. On each level, time is reduced and words are more difficult and unfrequent. <br>
                The word selection depends on the <a href="http://www.datamuse.com/api/">Datamuse API</a> and their great and felxible engine of word affinity.
                Each game can be tuned around themes and difficulties and it will try to follow the starting instructions.
            </p>
            <p>
                You can follow the project development on <a href="https://github.com/LoanR/Typetime-front">this page</a> or meet me on my <a href="https://github.com/LoanR">GitHub</a>!
            </p>
            <p>
                Have fun!
            </p>
        </div>
        <nav>
            <router-link v-bind:to="'/'">Home</router-link>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'about',
};
</script>

<style lang="scss" scoped>
    @import '../styles/common';

    .about-page {
        max-width: 600px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        margin: 0.5rem 1rem 2rem;

        .description-text {
            width: 100%;
        }

        nav {
            margin: 0.5rem 1rem 2rem;
        }
    }
</style>
