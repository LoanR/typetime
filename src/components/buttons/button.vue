<template>
    <div>
        <button class="button-style" @click.prevent="$emit('bigButtonClick')">
            <span>{{content}}</span>
        </button>
    </div>
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

    div {
        display: flex;
        align-items: center;
        justify-content: center;

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
