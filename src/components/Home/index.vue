<template>
  <div class="home-warp">
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