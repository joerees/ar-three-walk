<script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>
<template>
 <a-scene 
      
      arjs="sourceType: webcam; debugUIEnabled: false;" renderer="antialias: true;
                   colorManagement: true;
                   sortObjects: true;
                   physicallyCorrectLights: true;"
                   shadow="shadowMapType: pcfsoft">

     <a-entity walk-world></a-entity>
</a-scene>
</template>



<script>
import 'aframe'
import World from "@/assets/js/World.js";

export default {
  name: "AFrame",
  components: {},
  data() {
    return {
    };
  },
  beforeCreate() {
    var world = new World();
    AFRAME.registerComponent('walk-world', {
      init: function () {
        var obj = new THREE.Object3D();
        obj.add(world);
         var el = this.el;
         el.setObject3D('object3d', obj);
      },
      tick:()=>{
       world.update();
      }
    });
  }
};
</script>

<style>
body {
    overflow:hidden;
}
#AFrame {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
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
