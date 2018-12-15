<template>
    <div>
        <input type="checkbox"
            :id="label"
            :checked="isChecked"
            v-on:change="toggleCheck">
        <label :for="label" class="button-style" @mouseover="itemHover" @mouseout="itemOut"><span>{{label}}</span></label>
    </div>
</template>

<script>
export default {
    name: 'Checkbox',

    props: ['swId', 'label', 'modifier', 'isChecked', 'desc', 'mutation', 'values'],

    methods: {
        toggleCheck() {
            this.$emit('toggleCheck', this.swId);
        },

        itemHover() {
            this.$emit('changeDesc', this.desc);
        },

        itemOut() {
            this.$emit('changeDesc', '');
        },
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
        margin: 1rem 1rem;

        span {
            font-size: $small-font-size;
        }
    }

    input:active + .button-style, input:checked + .button-style {
        border: 2px solid $brand-color;
        box-shadow:
            0px 0px 5px 0px rgba(lighten( $brand-color, 30% ), 0.9),
            0px 0px 30px 0px rgba(lighten( $brand-color, 20% ), 0.5),
            0px 0px 0px 1px rgba(lighten($brand-color, 15%), 1);
        //     inset 0 1px rgba($contrast-color, 0.5),
        //     inset 0 2rem 30px rgba(255, 255, 255, 0.08),
        //     0px 2px rgba(lighten( $brand-color, 20% ), 1),
        //     0px 2px rgba(lighten( $brand-color, 20% ), 1),
        //     0px 2px rgba(lighten( $brand-color, 20% ), 1),
        //     0px 2px rgba(lighten( $brand-color, 20% ), 1),
        //     0px 0px 5px 0px rgba(lighten( $brand-color, 60% ), 0.8),
        background-color: $brand-color;

        &::before, &::after {
            box-shadow: none;
        }

        span {
            color: $light-base-color;
            // text-shadow:
            //     0px 0px 2px rgba(lighten( $brand-color, 60% ), 1),
            //     0px 1px 10px rgba(lighten( $brand-color, 60% ), 1);
        }
    }

    // input:active + .button-style span{
    //     text-shadow:
    //         0px 0px 2px rgba(lighten( $brand-color, 60% ), 1),
    //         0px 1px 10px rgba(lighten( $brand-color, 60% ), 1);
    // }

    // input:checked:not(:active) + .button-style {
    //     box-shadow:
    //         inset 0 1px rgba($contrast-color, 0.5),
    //         inset 0 2rem 30px rgba(255, 255, 255, 0.08),
    //         0px 2px rgba(lighten( $brand-color, 20% ), 1),
    //         0px 3px rgba(lighten( $brand-color, 20% ), 1),
    //         0px 4px rgba(lighten( $brand-color, 20% ), 1),
    //         0px 5px rgba(lighten( $brand-color, 20% ), 1),
    //         0px 0px 5px 0px rgba(lighten( $brand-color, 60% ), 0.8),
    //         0px 7px 5px 0px rgba(lighten( $brand-color, 60% ), 0.8),
    //         0px 4px 30px 0px rgba(lighten( $brand-color, 60% ), 0.5);
    // }
</style>
