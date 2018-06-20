<template>
    <div class="modifier-container">
        <checkbox-component v-for="mod in modifiers"
            :key="mod.label"
            :label="mod.label"
            :isChecked="mod.isChecked"
            @toggleCheck="toggleCheck">
        </checkbox-component>
    </div>
</template>

<script>
import checkboxComponent from '../buttons/Checkbox.vue';
export default {
    name: 'Checkboxes',

    components: {
        'checkbox-component': checkboxComponent,
    },

    props: ['modifiers'],

    methods: {
        toggleCheck(modLabel) {
            this.$emit('toggleCheck', modLabel);
        },
    },
};
</script>

<style lang="scss" scoped>
    @import '../../styles/common';

    .modifier-container {
        display: flex;
        justify-content: center;
    }
</style>
