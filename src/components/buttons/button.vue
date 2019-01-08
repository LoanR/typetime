<template>
    <div>
        <button class="button-style" :disabled="disableButton" @click.prevent="$emit('bigButtonClick')">
            <span>{{content}}</span>
        </button>
    </div>
</template>

<script>
export default {
    name: 'Button',

    props: ['content', 'disableButton'],
};
</script>

<style lang="scss" scoped>
    @import '../../styles/common';
    @import '../../styles/buttons';

    div {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem 2rem;

        .button-style {
            width: 12rem;
            height: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;

            span {
                font-size: $base-font-size;
            }
        }
    }
</style>
