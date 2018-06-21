<template>
    <button class="button-style" @click.prevent="$emit('bigButtonClick')">
        <span>{{content}}</span>
    </button>
</template>

<script>
export default {
    name: 'Button',

    props: ['content'],
};
</script>

<style lang="scss" scoped>
    @import '../../styles/common';
    @import '../../styles/buttons';

    .button-style {
        padding: 2rem 5rem;

        span {
            font-size: $base-font-size;
        }
    }
</style>
