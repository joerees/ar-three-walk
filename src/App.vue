<template>
  <div id="app">
    <div id="gui-container"></div>
    <div class="threeview">
      <div id="three-scene"></div>
    </div>
  
   <transition name="fade">
    <div class="overlay" v-if="loadStage===1">
      <div class="loading">
        <div class="loading-bar" v-bind:style="{ transform: `scaleX(${loadProgress})` }"> </div>
      
      </div>
        <button  v-if="loadProgress===1" class="start-button" @click="onStart">Start</button>
    </div>
   </transition>

    <transition name="fade">
    <div class="overlay" v-if="loadStage===2">
        <button  class="start-button" @click="onBegin">Load Demo </button>
    </div>
    </transition>

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
      loadStage: 2,
      loadProgress: 0,
    };
  },
  mounted() {
   
  },
  methods: {
    onBegin(e){
      this.loadStage=1;
      this.arScene = new ARScene("three-scene", this.onSceneLoadProgress);
      window.addEventListener("resize", this.arScene.onWindowResize);
    },

    onStart(e) {
      this.loadStage=0;
       this.arScene.startApp(e);
    },
    onSceneLoadProgress(progressEvent) {
      this.loadProgress = progressEvent.loaded /  progressEvent.total; 
    },
    computed(){

    }
  },
};
</script>

<style>
body {
    overflow:hidden;
}
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
  background: rgba(0,0,0, 1);
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
  display: flex;
  flex-direction: column;
}
.overlay .start-button {
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  font-size: 3rem;
  align-self: center;
  padding: 3rem;
  flex-direction: unset;
  margin: 40px auto;
  border-radius: 5%;
  outline: none;
  user-select: none;
}
.overlay .start-button:hover {
  background-color: rgb(48, 45, 42);
  color: rgb(255, 255, 255);
}

.loading {
      background-color: rgb(78, 75, 72);
    height: 10px;
    width: 80%;
    align-self: center;
    margin: auto;
    border-radius: 10px;
    overflow: hidden;
}

.loading-bar {
  background: rgb(255, 255, 255);
  height: 100%;
  width: 100%;
  transform: scaleX(0.1);
  transform-origin: left;
      transition: all 0.3s;

}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
