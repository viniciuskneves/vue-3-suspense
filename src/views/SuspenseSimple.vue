<template>
  <Suspense>
    <template #default>
      <MyAsyncComponent :timeout="1000" />
    </template>
    <template #fallback>
      <span>Loading... Please wait 1s.</span>
    </template>
  </Suspense>
  <hr />
  <Suspense>
    <template #default>
      <MyAsyncComponent :timeout="2000" />
    </template>
    <template #fallback>
      <span>Loading... Please wait 2s.</span>
    </template>
  </Suspense>
  <hr />
  <h1 v-if="error">I failed to load</h1>
  <Suspense v-else>
    <template #default>
      <MyAsyncComponent :timeout="3000" should-fail />
    </template>
    <template #fallback>
      <span>Loading... Please wait 3s.</span>
    </template>
  </Suspense>
  <hr />
  <SuspenseWithError>
    <template #default>
      <MyAsyncComponent :timeout="4000" should-fail />
    </template>
    <template #fallback>
      <span>Loading... Please wait 4s.</span>
    </template>
    <template #error>
      <h1>I failed to load</h1>
    </template>
  </SuspenseWithError>
</template>

<script>
import { ref, onErrorCaptured } from "vue";

import MyAsyncComponent from "@/components/MyAsyncComponent.vue";
import SuspenseWithError from "@/components/SuspenseWithError.vue";

export default {
  name: "Suspense simple",
  components: { MyAsyncComponent, SuspenseWithError },
  setup() {
    const error = ref(null);

    onErrorCaptured(e => {
      error.value = e;

      return true;
    });

    return { error };
  }
};
</script>
