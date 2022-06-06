<template>
  <div
    v-if="show.active"
    @click="closeModal"
    class="absolute w-full h-full flex justify-center items-center transform-gpu bg-slate-200/10 backdrop-blur-sm"
  >
    <div
      @click.stop=""
      class="w-11/12 sm:w-96 p-4 sm:p-6 flex flex-col items-center transform-gpu bg-slate-50 rounded-3xl border border-black"
    >
      <p class="font-bold">Tambah Skor</p>
      <form
        @submit.prevent="submitHandler"
        class="mt-2 sm:mt-4 w-full flex flex-col text-xs"
      >
        <p class="font-bold">{{ show.team.name }}</p>
        <div
          class="my-1 sm:my-2 px-3 flex items-center border-2 border focus-within:border-sky-500 rounded-xl"
        >
          <p>{{ show.team.score }} +</p>
          <input
            name="addScore"
            type="text"
            placeholder="Tambah skor"
            autocomplete="off"
            required
            class="flex-1 py-0.5 sm:py-2.5 px-1 bg-transparent outline-none autofill:caret-white"
          />
        </div>
        <button
          class="w-full mt-3 py-1.5 rounded-full bg-[#04BFAD] sm:leading-7"
          type="submit"
        >
          Tambah
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    show: Object as PropType<{
      active: boolean;
      team: { name: string; score: number; isPlay: boolean; client: number };
    }>,
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    submitHandler(event: Event) {
      const target = event.target as typeof event.target & {
        addScore: { value: string };
      };
      const addScore = target.addScore.value;
      this.$emit("addScore", { name: this.show.team.name, add: addScore });
      target.addScore.value = ""
      this.closeModal();
    },
  },
});
</script>
