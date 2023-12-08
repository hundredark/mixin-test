<script setup lang="ts">
import { ref } from 'vue';
import { WebViewApi } from 'mixin-sdk-test';
import { APP_ID } from '../utils/constant';

const assets = ref<any[]>([]);

const useLogin = () => {
  const url = `https://mixin.one/oauth/authorize?client_id=${APP_ID}&scope=PROFILE:READ+ASSETS:READ&response_type=code`;
  location.href = url;
};
const useGetAssets = () => {
  const client = WebViewApi();
  client.getAssets(["c6d0c728-2624-429b-8e0d-d9d19b6592fa", "43d61dcd-e413-450d-80b8-101d5e903357"], (res) => {
    assets.value = res
  })
};
</script>

<template>
  <div class="px-20">
    <div class="flex justify-between items-center h-20 border-b-[1px] border-b-[#333]">
      <div>Home</div>
      <div @click="useLogin">Login</div>
    </div>
    <button class="mt-10" @click="useGetAssets">Get Assets</button>
    <div class="mt-4" v-for="a of assets">{{ a }}</div>
  </div>
</template>
