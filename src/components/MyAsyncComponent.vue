<template>
  <h1>I've some async work to do before I can render</h1>
</template>

<script>
function asyncSetTimeout(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default {
  name: "MyAsyncComponent",
  props: {
    timeout: {
      type: Number,
      required: true
    },
    shouldFail: {
      type: Boolean,
      default: false
    }
  },
  async setup(props) {
    await asyncSetTimeout(props.timeout);

    if (props.shouldFail) {
      throw new Error("Some error happened");
    }
  }
};
</script>
