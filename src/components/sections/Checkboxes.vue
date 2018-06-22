<template>
    <div class="switch-category">
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

    props: ['switches'],

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

        .switch-container {
            display: flex;
            justify-content: center;
        }

        .description {
            height: 4rem;
            font-size: $small-font-size;
        }
    }
</style>
