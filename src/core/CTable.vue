<script lang="ts" setup>
export type TableHeader = {
  itemKey: string;
  text: string;
  width?: number;
};
export type TableItem = {
  // TODO: Find a better way to do this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
export interface TableProps {
  headers: TableHeader[];
  items: TableItem[];
}
defineProps<TableProps>();

function getItemValue(header: TableHeader, item: TableItem) {
  const paths = header.itemKey.split('.');
  if (paths.length === 1) {
    return item[paths[0]] ?? '';
  }
  let itemValue: TableItem | null = null;
  for (const path of paths) {
    itemValue = itemValue === null ? item[path] : itemValue[path];
  }
  return itemValue ?? '';
}
</script>

<template>
  <table>
    <thead>
      <tr class="rounded">
        <th
          class="bg-blue-500 dark:bg-blue-800 py-2 px-3 text-left"
          v-for="header in headers"
          :key="header.itemKey"
          :style="{ width: header.width ? header.width + 'px' : 'auto' }"
        >
          <slot :item="header" :name="`header-${header.itemKey}`">
            <span class="text-white text-base font-black">
              {{ header.text }}
            </span>
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, item_index) in items" :key="`item-${item_index}`">
        <td
          class="py-2 px-3 text-left"
          :class="`
            ${
              item_index % 2 === 0
                ? 'bg-neutral-300 dark:bg-neutral-800'
                : 'bg-neutral-200 dark:bg-neutral-900'
            }`"
          v-for="(header, header_index) in headers"
          :key="`header-${header_index}`"
        >
          <slot :name="`item-${header.itemKey}`" :item="item">
            <span class="text-black dark:text-white">
              {{ getItemValue(header, item) }}
            </span>
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>
