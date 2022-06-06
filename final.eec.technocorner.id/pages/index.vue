<template>
  <SignIn :show="showSignIn" @close="closeSignIn" @signedIn="signedInHandler" />
  <AddScore :show="showAddScore" @close="closeAddScore" @addScore="addScore" />
  <div
    ref="main"
    tabindex="0"
    @keyup.space="clickSendReqButton"
    class="min-w-screen min-h-screen flex flex-col p-6 outline-none"
  >
    <div class="flex justify-between items-center gap-x-4">
      <div v-if="role === 'admin'" class="flex items-center gap-x-2">
        Reset:
        <button
          class="px-2 py-1 text-sm border border-black rounded hover:bg-yellow-400 active:bg-yellow-500"
          @click="resetPlayer"
        >
          Player
        </button>
        <!-- <button
          class="px-2 py-1 text-sm border border-black rounded hover:bg-orange-400 active:bg-orange-500"
          @click="resetScore"
        >
          Score
        </button> -->
      </div>
      <p v-if="lastPing">Ping: {{ lastPing }}</p>
      <button
        @click="signInButtonClickHandler"
        type="button"
        class="ml-auto px-4 py-1 text-sm border border-black rounded"
        :class="[
          !name
            ? 'hover:bg-green-400 active:bg-green-500'
            : 'hover:bg-red-400 active:bg-red-500',
        ]"
      >
        {{ name ? name : "Masuk" }}
      </button>
    </div>
    <div
      class="m-auto flex flex-col gap-16 items-center justify-center text-center"
    >
      <h1 class="font-bold text-xl">
        Final Electrical Engineering Competition Technocorner 2022
      </h1>
      <div class="w-full flex flex-wrap justify-center gap-8">
        <TeamCard
          v-if="teams.length"
          v-for="team in teams"
          :team="team"
          :role="role"
          @addScore="showAddScoreModal"
        />
        <p
          v-if="teams.length === 0"
          class="w-full h-40 flex items-center justify-center border border-black rounded text-center"
        >
          Tidak ada tim
        </p>
      </div>
      <button
        v-if="teams.length && role !== 'admin'"
        ref="sendReqButton"
        @click="sendReq"
        class="px-16 py-8 bg-blue-400 active:bg-blue-500 border-2 border-transparent hover:border-black rounded-lg"
      >
        <p class="font-bold text-3xl">BELL</p>
        <p class="mt-4 text-xs">
          Tekan dengan tetikus atau gunakan tombol spasi
        </p>
      </button>
    </div>
    <p class="self-end">
      Status Admin:
      {{ admin.client > 0 ? `Aktif (${admin.client})` : "Nonaktif" }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SignIn from "~~/components/SignIn.vue";
import AddScore from "~~/components/AddScore.vue";
import { getData, postData } from "~~/libs/fetch";
import statusCode from "~~/libs/statusCode";
import wsServer from "../data/wsServer";

export default defineComponent({
  head() {
    return {
      title: "Final EEC Technocorner 2022",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined",
        },
      ],
    };
  },
  data() {
    return {
      wsCode: "",
      wsConn: null,
      name: "",
      role: "user",
      showSignIn: false,
      showAddScore: {
        active: false,
        team: { name: "", score: 0, isPlay: false, client: 0 },
      },
      teams: [],
      admin: { client: 0 },
      lastPing: undefined,
    };
  },
  mounted() {
    this.$refs.main.focus();
  },
  watch: {
    wsCode: function (newWsCode, _) {
      if (newWsCode) {
        this.wsConn = this.initWebSocket();
      }
    },
  },
  components: { SignIn, AddScore },
  methods: {
    addScore(val: { add: string; name: string }) {
      if (!this.checkWsConn) {
        return;
      }
      this.wsConn.send(
        JSON.stringify({
          action: "addScore",
          name: val.name,
          add: parseInt(val.add),
        })
      );
    },
    checkWsConn() {
      if (!this.wsConn || this.wsConn.readyState !== WebSocket.OPEN) {
        alert("Connection not established");
        return false;
      }
      return true;
    },
    clickSendReqButton() {
      if (document.activeElement !== this.$refs.sendReqButton) {
        this.$refs.sendReqButton.focus();
      }
      this.$refs.sendReqButton.click();
    },
    closeAddScore() {
      this.showAddScore = {
        active: false,
        team: { name: "", score: 0, isPlay: false, client: 0 },
      };
    },
    closeSignIn() {
      this.showSignIn = false;
    },
    async closeWebSocket() {
      const { status, json } = await postData("/auth/signout", {});
      if (status != statusCode.OK || !json.signedOut) {
        alert("Terjadi galat");
        return;
      }

      this.wsCode = "";
      this.name = "";
      this.admin = { client: 0 };
      this.role = "user";
      this.wsConn.close();
      this.lastPing = undefined;
    },
    initWebSocket() {
      // console.log("Starting connection to WebSocket Server");
      const wsConn = new WebSocket(`${wsServer}/${this.wsCode}`);

      wsConn.onmessage = (event) => {
        const wsData = JSON.parse(event.data);
        const teamsData = [];
        for (const data of Object.values(wsData.teams)) {
          teamsData.push(data);
        }
        this.teams = teamsData;
        this.admin = wsData.admin;
        const date = new Date(Date.now());
        const h = date.getHours();
        const m = date.getMinutes();
        const s = date.getSeconds();
        this.lastPing = `${h >= 10 ? h : "0" + h}:${m >= 10 ? m : "0" + m}:${
          s >= 10 ? s : "0" + s
        }`;
      };

      wsConn.onopen = (event) => {
        // console.log("Successfully connected to the echo websocket server...");
      };

      wsConn.onclose = (event) => {
        if (this.wsCode) {
          setTimeout(() => {
            if (wsConn.readyState >= WebSocket.CLOSING) {
              // console.log("Reconnecting");
              this.wsConn = this.initWebSocket(this.wsCode);
            }
          }, 1000);
          return;
        }
        this.teams = [];
        // console.log("closed", event);
      };

      return wsConn;
    },
    resetPlayer() {
      if (this.wsConn.readyState === 1) {
        this.wsConn.send(JSON.stringify({ action: "resetPlayer" }));
      }
      return;
    },
    resetScore() {
      if (this.wsConn.readyState === 1) {
        this.wsConn.send(JSON.stringify({ action: "resetScore" }));
      }
      return;
    },
    sendReq() {
      if (!this.checkWsConn) {
        return;
      }
      this.wsConn.send(JSON.stringify({ action: "play" }));
    },
    showAddScoreModal(val: {
      name: string;
      score: number;
      isPlay: boolean;
      client: number;
    }) {
      this.showAddScore = { active: true, team: val };
    },
    signedInHandler(val: { wsCode: string; name: string; role: string }) {
      this.wsCode = val.wsCode;
      this.name = val.name;
      this.role = val.role;
    },
    async signInButtonClickHandler() {
      if (this.wsCode) {
        this.closeWebSocket();
        return;
      }
      const { status, json } = await getData("/auth/check-signin");
      if (status != statusCode.OK || !json.wsCode) {
        this.showSignIn = true;
        return;
      }
      if (json.wsCode) {
        this.wsCode = json.wsCode;
        this.name = json.name;
        this.role = json.role;
      }
    },
  },
});
</script>
