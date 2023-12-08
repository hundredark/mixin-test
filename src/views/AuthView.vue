<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { MixinApi, getED25519KeyPair } from '@mixin.dev/mixin-node-sdk';
import { APP_ID, APP_SECRET } from '@/utils/constant';
import router from '@/router';

const route = useRoute();

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
    const user = await client.user.profile();
    console.log(user);
    router.push('/')
  } catch {}
};

onMounted(() => {
  const code = route.query.code;
  if (!code) {
    console.error(code);
    return;
  }

  useLogin(code as string);
})
</script>
