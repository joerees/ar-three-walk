import * as THREE from "three";

export default function SpotLight(scene, gui, render, _params) {
  //  console.log('SpotLight', scene, gui)
  var _gui = gui;
  var _title = _params.title || new Date() + "";

  var renderCallback = render;

  var spotLight = new THREE.SpotLight(0xffffff, 1); //THREE.SpotLight(0xffffff,5,10,THREE.Math.degToRad(10),0.25);
  spotLight.position.set(2, 4, 2);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.05;
  spotLight.decay = 2;
  spotLight.distance = 200;
  spotLight.castShadow = true;
  // spotLight.shadowDarkness = 0.5;
  // spotLight.shadowCameraVisible = true;

  this.spotLight = spotLight;

  //Set up shadow properties for the light
  spotLight.shadow.mapSize.width = 2048; // default
  spotLight.shadow.mapSize.height = 2048; // default
  spotLight.shadow.camera.near = 0.5; // default
  spotLight.shadow.camera.far = 500; // default

  var spotLightHelper = new THREE.SpotLightHelper(spotLight, 0x00ffff);
  spotLight.add(spotLightHelper);

  spotLight.position.set(3, 50, 140);
  //spotLight.target = spotLightTarget;

  scene.add(spotLight.target);

  var params = _params || {
    color: 12500676,
    intensity: 1.580113734275375,
    distance: 971.497501292435,
    angle: 0.6399039318530303,
    penumbra: 0.4787179045321385,
    decay: 1.809581251077029,
    near: 10,
    far: 3574,
    x: params.x,
    y: params.y,
    z: params.z,
    target: { x: params.target.x, y: params.target.y, z: params.target.z },
    shadowMap: {
      size: spotLight.shadow.mapSize.width,
      near: spotLight.shadow.camera.near,
      far: spotLight.shadow.camera.far,
    },
  };

  var updateSpotLight = function () {
    spotLight.color.setHex(params.color);
    spotLight.intensity = params.intensity;
    spotLight.distance = params.distance;
    spotLight.angle = params.angle;
    spotLight.penumbra = params.penumbra;
    spotLight.position.x = params.x;
    spotLight.position.y = params.y;
    spotLight.position.z = params.z;
    spotLight.decay = params.decay;
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.target.position.set(
      params.target.x,
      params.target.y,
      params.target.z
    );

    spotLight.shadow.mapSize.width = params.shadowMap.size;
    spotLight.shadow.camera.near = params.shadowMap.near;
    spotLight.shadow.camera.far = params.shadowMap.far;

    // spotLight.target = spotLightTarget;
    // spotLight.lookAt(spotLightTarget);
    spotLightHelper.update();

    console.log(JSON.stringify(params));
    renderCallback();
  };

  var setupGUI = function () {
    var gui = _gui.addFolder(_title);

    gui.addColor(params, "color").onChange(updateSpotLight);
    gui.add(params, "intensity", 0, 2).onChange(updateSpotLight);
    gui.add(params, "distance", 0, 1200).onChange(updateSpotLight);
    gui.add(params, "angle", 0, Math.PI / 3).onChange(updateSpotLight);
    gui.add(params, "penumbra", 0, 1).onChange(updateSpotLight);
    gui.add(params, "decay", 1, 2).onChange(updateSpotLight);
    gui.add(params, "x", -40, 40, 0.005).onChange(updateSpotLight);
    gui.add(params, "y", -40, 40, 0.005).onChange(updateSpotLight);
    gui.add(params, "z", -40, 40, 0.005).onChange(updateSpotLight);
    var f = gui.addFolder("target");
    f.add(params.target, "x", -40, 40, 0.005).onChange(updateSpotLight);
    f.add(params.target, "y", -40, 40, 0.005).onChange(updateSpotLight);
    f.add(params.target, "z", -40, 40, 0.005).onChange(updateSpotLight);

    f = gui.addFolder("shadowmap");
    f.add(params.shadowMap, "size", 0, 2048, 0.005).onChange(updateSpotLight);
    f.add(params.shadowMap, "near", 0, 2048, 0.005).onChange(updateSpotLight);
    f.add(params.shadowMap, "far", 0, 2048, 0.005).onChange(updateSpotLight);
  };

  setupGUI();
  updateSpotLight();

  this.update = function () {
    updateSpotLight();
  };

  this.setPosition = function () {
    // rootNode.position =
  };

  this.update = function (delta) {
    this.carControls.update(delta);
  };

  return spotLight;
}

SpotLight.prototype = {
  get position() {
    return this.spotLight.position;
  },

  loadModel: function () {
    console.log("Car.prototype : loadModel");
    // model
  },

  setupHeadlights: function () {
    console.log("setupHeadlights");
  },
};
export { SpotLight };
