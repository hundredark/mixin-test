<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { MixinApi, WebViewApi, getED25519KeyPair, AuthenticationUserResponse } from 'mixin-sdk-test';
import { APP_ID, APP_SECRET } from '@/utils/constant';

const route = useRoute();

const assets = ref<any[]>([]);
const user = ref<AuthenticationUserResponse | undefined>()

const useToLogin = () => {
  const url = `https://mixin.one/oauth/authorize?client_id=${APP_ID}&scope=PROFILE:READ+ASSETS:READ&response_type=code`;
  location.href = url;
};
const useGetAssets = () => {
  const client = WebViewApi();
  client.getAssets(["c6d0c728-2624-429b-8e0d-d9d19b6592fa", "43d61dcd-e413-450d-80b8-101d5e903357"], (res) => {
    assets.value = res
  })
};

const useLogin = async (code: string) => {
  const { privateKey, publicKey } = getED25519KeyPair();
  let client = MixinApi();

  try {
    const token = await client.oauth.getToken({
      client_id: APP_ID,
      code: code,
      ed25519: publicKey,
      client_secret: APP_SECRET
    });
    const { scope, authorization_id } = token;

    if (!scope || scope.indexOf('ASSETS:READ') < 0) {
      console.error(scope);
      return;
    }

    const keystore = {
      user_id: APP_ID,
      scope,
      authorization_id,
      private_key: privateKey,
    };
    client = MixinApi({ keystore });
    user.value = await client.user.profile();
  } catch {}
};

onMounted(() => {
  const code = route.query.code;
  if (code) useLogin(code as string);
})
</script>

<template>
  <div class="px-20">
    <div class="flex justify-between items-center h-20 border-b-[1px] border-b-[#333]">
      <div>Home</div>
      <div v-if="user">{{ user.full_name }}}</div>
      <div v-else @click="useToLogin">Login</div>
    </div>
    <button class="mt-10" @click="useGetAssets">Get Assets</button>
    <div class="mt-4" v-for="a of assets">{{ a }}</div>
  </div>
</template>
