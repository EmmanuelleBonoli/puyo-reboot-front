<template>
  <Dialog :style="{ width: '80%' }" :visible="isOpenStore" @update:visible="updateVisible" modal dismissableMask :closable="false">
    <Tabs :value="0" scrollable>
      <TabList>
        <Tab v-for="(tab, index) in storeDetails" :value="index" as="div" class="store-tab">
          <Avatar :image="tab.iconImage" shape="circle" size="large" />
          <span class="store-title">{{ tab.title }}</span>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="(tab, index) in storeDetails" :value="index" as="div">
          <component :is="tab.component" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Dialog>
</template>

<script setup lang="ts">
import { Avatar, Dialog, Tab, TabList, TabPanel, TabPanels, Tabs } from 'primevue';
import InventoryStore from './InventoryStore.vue';
import CoinStore from './CoinStore.vue';

const props = defineProps({
  isOpenStore: Boolean,
});

const storeDetails = [
  {
    title: 'Magasin',
    iconImage: '/images/Game/Store/iconStoreInventory.png',
    component: InventoryStore,
  },
  {
    title: 'Pièces',
    iconImage: '/images/Game/Store/iconStoreCoin.png',
    component: CoinStore,
  },
];

const emit = defineEmits(['update:isOpenStore']);

function updateVisible(): void {
  emit('update:isOpenStore', !props.isOpenStore);
}
</script>

<style scoped>
.p-tabs {
  height: 300px;
}

.store-tab {
  display: flex;
  align-items: center;
}

.store-title {
  padding-left: 10px;
}
</style>
