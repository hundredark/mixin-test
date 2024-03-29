<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { MixinApi, getED25519KeyPair, type AuthenticationUserResponse, base64RawURLEncode } from '@mixin.dev/mixin-node-sdk';
import { APP_ID, APP_SECRET } from '@/utils/constant';

const route = useRoute();

const result = ref<any>();
const user = ref<AuthenticationUserResponse | undefined>()

const useToLogin = () => {
  const url = `https://mixin.one/oauth/authorize?client_id=${APP_ID}&scope=PROFILE:READ+ASSETS:READ&response_type=code`;
  location.href = url;
};

const useGetContext  = () => {
  // @ts-ignore
  result.value = window.MixinWebview.getMixinContext();
};
const useGetAssets = () => {
  // @ts-ignore
  window.MixinWebview.getAssets(["965e5c6e-434c-3fa9-b780-c50f43cd955c"], (res: any) => {
    result.value = res
  })
};
const useClose = () => {
  // @ts-ignore
  window.MixinWebview.close();
}
const useReloadTheme = () => {    
  let head = document.getElementsByTagName('head')[0]
  let metas = document.getElementsByTagName('meta')
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].name === 'theme-color') {
      head.removeChild(metas[i])
    }
  }
  let meta = document.createElement('meta')
  meta.name = 'theme-color'
  meta.content = '#3F5ACB'
  head.appendChild(meta)
  // @ts-ignore
  window.MixinWebview.reloadTheme()
};
const usePlayList = () => {
  // @ts-ignore
  window.MixinWebview.playlist(["http://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3"])
};
const useGetTipAddress = () => {
  // @ts-ignore
  window.MixinWebview.getTipAddress("43d61dcd-e413-450d-80b8-101d5e903357", (res) => {
    result.value = res
  })
};
const useTipSign = () => {
  // @ts-ignore
  window.MixinWebview.tipSign("43d61dcd-e413-450d-80b8-101d5e903357", "43d61dcd-e413-450d-80b8-101d5e903357", (res) => {
    result.value = res
  })
};

const useLogin = async (code: string) => {
  const { publicKey, seed } = getED25519KeyPair();

  try {
    let client = MixinApi();
    const token = await client.oauth.getToken({
      client_id: APP_ID,
      code: code,
      ed25519: base64RawURLEncode(publicKey),
      client_secret: APP_SECRET
    });
    const { scope, authorization_id } = token;

    if (!scope || scope.indexOf('ASSETS:READ') < 0) {
      console.error(scope);
      return;
    }

    const keystore = {
      app_id: APP_ID,
      scope,
      authorization_id,
      session_private_key: seed.toString("hex"),
    };
    client = MixinApi({ keystore });
    user.value = await client.user.profile();
  } catch {}
};

onMounted(() => {
  const code = route.query.code;
  if (code) useLogin(code as string);

  // @ts-ignore
  // window.MixinWebview = WebViewApi();
})
</script>

<template>
  <div class="px-10 sm:px-20">
    <div class="flex justify-between items-center h-20 border-b-[1px] border-b-[#333]">
      <div>Home</div>
      <div v-if="user">{{ user.full_name }}</div>
      <button v-else @click="useToLogin">Login</button>
      <div class="self-end mt-4">
        <button class="mt-10" @click="useClose">Close</button>
      </div>
    </div>
    <div class="flex flex-col">
      <button class="mt-10" @click="useGetContext">Get Context</button>
      <button class="mt-10" @click="useGetAssets">Get Assets</button>
      <button class="mt-10" @click="usePlayList">PlayList</button>
      <button class="mt-10" @click="useReloadTheme">Reload Theme</button>
      <button class="mt-10" @click="useGetTipAddress">Tip Address</button>
      <button class="mt-10" @click="useTipSign">Tip Sign</button>
    </div>
    <div class="mt-10" v-if="result">{{ result }}</div>
  </div>
</template>
