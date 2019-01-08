<template>
    <div class="switch-category">
        <p class="switch-title">
            - {{titleCategory}} <a v-if="refreshable" class="refresher" @click="refreshCheckboxes"><i class="fa fa-refresh" aria-hidden="true"></i></a> -
        </p>
        <div class="switch-container">
            <checkbox-component v-for="(sw, i) in switches"
                :key="sw.label + i"
                :swId="sw.id"
                :label="sw.label"
                :isChecked="sw.isChecked"
                :desc="sw.description"
                :mutation="sw.ruleMutation"
                :values="sw.values"
                :disableButton="disableButtons"
                @toggleCheck="toggleCheck"
                @changeDesc="changeDesc">
            </checkbox-component>
        </div>
        <p class="description">
            {{desc}}
        </p>
    </div>
</template>

<script>
import checkboxComponent from '../buttons/Checkbox.vue';
export default {
    name: 'Checkboxes',

    components: {
        'checkbox-component': checkboxComponent,
    },

    props: ['switches', 'titleCategory', 'disableButtons', 'refreshable'],

    data() {
        return {
            desc: '',
        };
    },

    methods: {
        toggleCheck(modId) {
            this.$emit('toggleCheck', modId);
        },

        changeDesc(desc) {
            this.desc = desc;
        },

        refreshCheckboxes() {
            this.$emit('refreshCheckboxes');
        },
    },
};
</script>

<style lang="scss" scoped>
    @import '../../styles/common';

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        25% {
            transform: rotate(360deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .switch-category {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0.5rem 1rem 2rem;

        .switch-title, .description {
            font-size: $small-font-size;
            margin: 0;
            height: 1rem;

            .refresher {
                padding: 0 3px 0 4px;
                cursor: pointer;
                color: $contrast-color;
                text-decoration: none;
                position: relative;
                transition: color 0.5s cubic-bezier(0,0,0,1);

                &::after {
                    content: none;
                }

                &:hover {
                    color: $brand-color;
                }

                &:active {
                    text-shadow:
                        0 0 15px lighten( $brand-color, 5%),
                        0 0 4px lighten( $brand-color, 10%);
                }

                i {
                    animation: rotation 3s ease-in-out 2s normal infinite none running;
                }
            }
        }

        .switch-container {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            align-items: center;
            width: 100%;

            @media all and (max-width: 500px) {
                width: 300px;
            }

            @media all and (max-width: 280px) {
                width: 200px;
            }
        }
    }
</style>
