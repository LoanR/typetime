<template>
    <div data-truc="truc">
        <input type="checkbox" name="" :id="label" v-model="checked">
        <label :for="label" class="button-style"><span>{{label}}</span></label>
    </div>
</template>

<script>
export default {
    name: 'Checkbox',

    props: ['label', 'modifier', 'specificClass'],

    data() {
        return {
            checked: false,
        };
    },
};
</script>

<style lang="scss" scoped>
    @import '../../styles/common';
    @import '../../styles/buttons';

    input {
        display: none;
    }
    .button-style {
        display: inline-block;
        width: 5rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 5rem 1rem;

        span {
            font-size: $small-font-size;
        }

        &::before, &::after {
            width: 4rem;
        }
    }

    input:active + .button-style span{
        text-shadow: none;
    }

    input:active + .button-style, input:checked + .button-style {
        box-shadow:
            inset 0 1px rgba($contrast-color, 0.5),
            inset 0 -1.3rem 30px rgba(255, 255, 255, 0.08),
            0px 2px rgba(lighten( $brand-color, 20% ), 1),
            0px 4px 30px 0px rgba(lighten( $brand-color, 50% ), 0.5);
    }

    input:active + .button-style, input:checked + .button-style {
        background-color: $brand-color;

        &::before, &::after {
            box-shadow: none;
        }

        span {
            color: $light-base-color;
        }
    }

    input:checked:not(:active) + .button-style {
        box-shadow:
            inset 0 1px rgba($contrast-color, 0.5),
            inset 0 2rem 30px rgba(255, 255, 255, 0.08),
            0px 5px rgba(lighten( $brand-color, 20% ), 1),
            0px 4px 30px 0px rgba(lighten( $brand-color, 50% ), 0.5);
    }

</style>
