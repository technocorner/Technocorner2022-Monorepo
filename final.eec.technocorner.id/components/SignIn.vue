<template>
  <div
    v-if="show"
    @click="closeModal"
    class="absolute w-full h-full flex justify-center items-center transform-gpu bg-slate-200/10 backdrop-blur-sm"
  >
    <div
      @click.stop=""
      class="w-11/12 sm:w-96 p-4 sm:p-6 flex flex-col items-center transform-gpu bg-slate-50 rounded-3xl border border-black"
    >
      <p class="font-bold">MASUK</p>
      <form
        @submit.prevent="submitHandler"
        class="mt-2 sm:mt-4 w-full flex flex-col text-xs"
      >
        <p class="font-bold">ID Tim</p>
        <input
          name="code"
          type="text"
          placeholder="Masukkan ID tim"
          autocomplete="off"
          required
          class="my-1 sm:my-2 py-0.5 sm:py-2.5 px-3 border-2 border focus-within:border-sky-500 rounded-xl bg-transparent outline-none autofill:caret-white"
        />
        <p class="text-black/30">ID tim dapat dilihat pada laman dasbor tim</p>
        <button
          class="w-full mt-6 py-1.5 rounded-full bg-[#04BFAD] sm:leading-7 font-bold text-white"
          type="submit"
        >
          Masuk
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { postData } from "~~/libs/fetch";
import statusCode from "~~/libs/statusCode";

export default defineComponent({
  props: { show: Boolean, wsCode: String },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    async submitHandler(event: Event) {
      const target = event.target as typeof event.target & {
        code: { value: string };
      };
      const code = target.code.value;

      const { status, json } = await postData("/auth/signin", {
        code,
      });

      if (status != statusCode.OK || !json) {
        alert(`${json && json.error ? json.error : "Terjadi galat"}`);
        return;
      }

      this.$emit("signedIn", json);
      this.closeModal();
    },
  },
});
</script>
