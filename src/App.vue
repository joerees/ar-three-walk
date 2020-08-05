<template>
  <div id="app">
      <div id="gui-container"></div>
     <div class="threeview">
      <div id="three-scene"></div>
    </div>

  </div>
</template>

<script>
import ARScene from "./assets/js/ARScene.js";

export default {
  name: 'App',
  components: {
    
  },
    data () {
      return  {
          arScene:null
          }
    },
  mounted(){
    this.arScene = new ARScene('three-scene');
    window.addEventListener("resize", this.arScene.onWindowResize);

    console.log('WalkScene',this.arScene)
  }
}
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
  border: #42b983 solid 2px;
  background-color: transparent;
}
</style>
