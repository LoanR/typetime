<template>
    <div class="switch-category">
        <p class="switch-title">
            - {{titleCategory}} -
        </p>
        <div class="switch-container">
            <checkbox-component v-for="(sw, i) in switches"
                :key="sw.label + i"
                :label="sw.label"
                :isChecked="sw.isChecked"
                :desc="sw.description"
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

    props: ['switches', 'titleCategory'],

    data() {
        return {
            desc: '',
        };
    },

    methods: {
        toggleCheck(modLabel) {
            this.$emit('toggleCheck', modLabel);
        },

        changeDesc(desc) {
            this.desc = desc;
        },
    },
};
</script>

<style lang="scss" scoped>
    @import '../../styles/common';

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
