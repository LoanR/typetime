<template>
    <div>
        <button class="bouton">
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

    .bouton {
        font-family: $base-font;
        font-size: $base-font-size;
        font-weight: $bold-weight;
        border-radius: 7px;
        padding: 2rem 5rem;
        border: none;
        background-color: $light-base-color;
        box-shadow:
            inset 0 1px rgba($contrast-color, 0.5),
            inset 0 2rem 30px rgba(255, 255, 255, 0.08),
            0px 2px rgba($light-base-color, 0.2),
            0px 3px rgba($light-base-color, 0.1),
            0px 4px rgba($light-base-color, 0.07),
            0px 5px rgba($base-color, 1),
            0px 8px 2px 0px rgba(0, 0, 0, 0.5);
        position: relative;
        top: 0;
        transition: all 0.2s cubic-bezier(0,0,0,1);

        span {
            color: darken($brand-color, 10%);
            position: relative;
            top: 0;
            transition: top 0.3s cubic-bezier(0.5,0,0,1);
            text-shadow: 0px 1px rgba(255, 255, 255, 0.1), 0px -1px rgba(0, 0, 0, 0.1);
        }

        &::before, &::after {
            position: absolute;
            content: '';
            width: 10rem;
            height: 0.7rem;
            transition: all 0.2s cubic-bezier(0,0,0,1);
        }

        &::before {
            left: 3px;
            top: 3px;
            border-radius: 6px 0;
            box-shadow:
                inset 1px 1px 1px rgba(255, 255, 255, 0.08),
                -1px -1px 1px rgba(255, 255, 255, 0.08);
        }

        &::after {
            right: 2px;
            bottom: 2px;
            border-radius: 6px 0;
            box-shadow:
                inset -1px -1px 1px rgba(0, 0, 0, 0.1),
                1px 1px 1px rgba(0, 0, 0, 0.1);
        }

        &:hover {
            box-shadow:
                inset 0 1px rgba($contrast-color, 0.5),
                inset 0 2rem 30px rgba(255, 255, 255, 0),
                0px 2px rgba($light-base-color, 0.2),
                0px 3px rgba($light-base-color, 0.1),
                0px 4px rgba($light-base-color, 0.07),
                0px 5px rgba($base-color, 1),
                0px 8px 2px 0px rgba(0, 0, 0, 0.5);

            span {
                color: $brand-color;
                top: 1px;
            }
        }

        &:focus {
            outline: 0;
        }

        &:active {
            outline: 0;
            box-shadow:
                inset 0 1px rgba($contrast-color, 0.5),
                inset 0 -1.3rem 30px rgba(255, 255, 255, 0.08),
                0px 1px rgba($light-base-color, 0.2),
                0px 2px rgba($base-color, 0.5),
                0px 4px 2px 0px rgba(0, 0, 0, 0.5);
            top: 3px;

            span{
                top: 3px;
                text-shadow: 0 0 2px lighten( $brand-color, 10% );
            }

            &::before {
                box-shadow:
                    inset 1px 1px 1px rgba(0, 0, 0, 0.1),
                    -1px -1px 1px rgba(0, 0, 0, 0.1);
            }

            &::after {
                box-shadow:
                    inset -1px -1px 1px rgba(255, 255, 255, 0.08),
                    1px 1px 1px rgba(255, 255, 255, 0.08);
            }
        }
    }
</style>
