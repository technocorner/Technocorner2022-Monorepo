<template>
  <div
    class="w-44 h-44 p-2 flex gap-y-4 flex-col items-center justify-center border border-black rounded text-center"
    :class="{
      'bg-green-400': team.isPlay,
      'hover:cursor-pointer': role === 'admin',
    }"
    @click="addScore(team)"
  >
    <p class="w-full text-xl truncate">{{ team.name }}</p>
    <p class="font-bold text-7xl truncate">{{ team.score }}</p>
    <p class="text-xs">Connected: {{ team.client }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    team: {
      type: Object as PropType<{
        name: String;
        score: Number;
        isPlay: Boolean;
        client: Number;
      }>,
    },
    role: String,
  },
  methods: {
    addScore(team: {
      name: string;
      score: number;
      isPlay: boolean;
      client: number;
    }) {
      if (this.role !== "admin") {
        return;
      }
      this.$emit("addScore", team);
    },
  },
});
</script>
