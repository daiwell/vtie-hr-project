<template>
  <div class="home-warp">
    home
    <hr />
    <button @click="addCount(10)">+1</button>
    <p>{{ $store.state.count }}</p>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from "vuex";
export default {
  name: "home",
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["addCount"]),
  },
};
</script>

<style>
</style>