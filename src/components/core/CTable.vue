<script lang="ts" setup>

export type TableHeader = {
  itemKey: string
  text: string,
  width?: number;
}
export type TableItem = {
  [key: string]: any;
}
export interface TableProps {
  headers: TableHeader[],
  items: TableItem[]
}
defineProps<TableProps>();

function getItemValue(header: TableHeader, item: TableItem) {
  const paths = header.itemKey.split('.');
  if (paths.length === 1) {
    return item[paths[0]] ?? '';
  }
  let itemValue: TableItem | null = null;
  for (const path of paths) {
    itemValue = itemValue === null
      ? item[path]
      : itemValue[path];
  }
  return itemValue ?? '';
}
</script>

<template>
  <table class="table">
    <tr>
      <th 
        v-for="header in headers" 
        :key="header.itemKey"
        :style="{ width: header.width ? header.width + 'px' : 'auto' }"
      >
        {{ header.text }}
      </th>
    </tr>
    <tr v-for="item in items">
      <td v-for="header in headers">
        <slot 
          :name="`item-${header.itemKey}`" 
          :item="item"
        >
          {{ getItemValue(header, item) }}
        </slot>
      </td>
    </tr>
  </table>
</template>

<style scoped>
.table {
  border-collapse: collapse;
  color: var(--color-white-500);
}

.table th, 
.table td {
  border: 1px solid var(--color-white-300);
  padding: 8px;
}
</style>