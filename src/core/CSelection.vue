<script setup lang="ts">
import { computed, ref } from 'vue';
import { useClickOutside } from '@/hooks/useClickOutside';

type SelectionItem = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  text: string;
};

interface SelectionProps {
  selecctions: Array<SelectionItem>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedValue: any;
  label: string;
  disabled?: boolean;
  required?: boolean;
}
const props = withDefaults(defineProps<SelectionProps>(), {
  disabled: false,
  required: true,
});
const emit = defineEmits(['update:selectedValue']);

const focused = ref(false);
const isLabelTop = computed(() => focused.value || props.selectedValue);
const { element } = useClickOutside(() => {
  focused.value = false;
});

const show = computed(() => {
  if (!focused.value || props.selecctions.length === 0) return false;
  return true;
});

function selectSource(selection: SelectionItem) {
  emit('update:selectedValue', selection.value);
  focused.value = false;
}

function getSelectedText() {
  const selectedItem = props.selecctions.find(
    (selection) => String(selection.value) === String(props.selectedValue),
  );
  return selectedItem ? selectedItem.text : '';
}
</script>

<template>
  <div
    ref="element"
    :class="[
      'relative w-full h-[40px] flex flex-col items-center justify-center border rounded-lg',
      `${focused ? 'border-accent-primary' : 'border-chart-grayLight'}`,
      { 'opacity-80': disabled },
    ]"
  >
    <button
      type="button"
      class="h-full w-full text-left px-4 text-primary bg-surface rounded-lg"
      @focus="focused = true"
    >
      <p class="truncate text-sm">
        {{ getSelectedText() }}
      </p>
    </button>

    <label
      :class="[
        'text-secondary bg-surface',
        'block pointer-events-none absolute left-2 top-1/2 px-2',
        'transition-transform ease-in-out duration-100',
        `${isLabelTop ? 'text-xs -translate-y-7' : '-translate-y-1/2'}`,
      ]"
      >{{ label }}
      <span
        v-if="required && !isLabelTop"
        class="text-accent-negative font-bold"
        >*</span
      ></label
    >

    <div
      v-if="show"
      :class="[
        'absolute right-[-1px] left-[-1px] top-[42px] z-20',
        'border border-chart-grayLight rounded-lg overflow-hidden shadow-soft',
      ]"
    >
      <div class="flex flex-col">
        <button
          type="button"
          v-for="(selecction, index) in selecctions"
          :key="selecction.text"
          :class="[
            'text-primary outline-none p-2 text-left text-sm',
            'z-10 bg-surface hover:bg-chart-grayLight',
            {
              'border-b border-chart-grayLight':
                index !== selecctions.length - 1,
            },
          ]"
          @click="() => selectSource(selecction)"
        >
          {{ selecction.text }}
        </button>
      </div>
    </div>
  </div>
</template>
