<template>
  <div id="app">
    <div id="gui-container"></div>
    <div class="threeview">
      <div id="three-scene"></div>
    </div>
    
    <div class="overlay" v-if="showOverlay">
     
      <div class="loading">
        <div class="loading-bar" v-bind:style="{ transform: `scaleX(${loadProgress})` }"> {{loadProgress}}</div>
        <button v-if="loadProgress==1" class="start-button" @click="onStart">Start</button>
      </div>
    </div>
  </div>
</template>

<script>
import ARScene from "./assets/js/ARScene.js";

export default {
  name: "App",
  components: {},
  data() {
    return {
      arScene: null,
      showOverlay: true,
      loadProgress: 0,
    };
  },
  mounted() {
    this.arScene = new ARScene("three-scene", this.onSceneLoadProgress);
    window.addEventListener("resize", this.arScene.onWindowResize);
  },
  methods: {
    onStart(e) {
      console.log("start");
      this.showOverlay = false;
       this.arScene.startApp(e);
    },
    onSceneLoadProgress(progressEvent) {
      this.loadProgress = progressEvent.loaded /  progressEvent.total; 
      console.log("onSceneLoadProgress", progressEvent);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#gui-container {
  position: absolute;
  top: 100px;
  right: 20px;
  z-index: 10;
}
#three-scene {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: transparent;
}
.overlay {
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
  display: flex;
}
.overlay .start-button {
  background-color: rgb(200, 100, 0);
  color: rgb(255, 255, 255);
  font-size: 3rem;
  align-self: center;
  padding: 3rem;
  flex-direction: unset;
  margin: auto;
  border-radius: 5%;
  outline: none;
  user-select: none;
}
.overlay .start-button:hover {
  background-color: rgb(48, 45, 42);
  color: rgb(255, 255, 255);
}

.loading {
  background-color: rgb(200, 100, 0);
  height: 20px;
  width: 80%;
  align-self: center;
  margin: auto;
}

.loading-bar {
  background: rgb(255, 255, 255);
  height: 100%;
  width: 100%;
  transform: scaleX(0.1);
  transform-origin: left;
      transition: all 1s cubic-bezier(0.2, 0.3, 0, 1);

}
</style>
