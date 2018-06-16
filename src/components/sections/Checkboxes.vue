<template>
    <div class="modifier-container">
        <checkbox-component v-for="item in checkboxes"
            :key="item.label"
            :label="item.label"
            :modifier="item.modifier"
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

    props: ['checkboxes'],

    data() {
        return {
            checked: false,
        };
    },

    methods: {
        toggleCheck(eventData) {
            this.$emit('toggleCheck', eventData);
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
