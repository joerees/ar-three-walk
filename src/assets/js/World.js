import * as THREE from "three";
import { Object3D } from "three/src/core/Object3D";
import SurfacePath from "./SurfacePath.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import SpotLight from "./SpotLight.js";

export default function World() {
  Object3D.call(this);

  let clock = new THREE.Clock();
  let path = getPath();
  let spotlights = [];
  var percentage = 0,
    speed = 0.2; // Path animations
  var mixer;
  var charecter;
  this.type = "Object3D";

  var el = new THREE.Object3D();
  this.add(el);

  function init() {
    setupSpotLights();
    addGridHelper();
    drawPath();
    loadModel();
  }
  function addGridHelper() {
    let size = 200;
    let gridHelper = new THREE.GridHelper(
      size / 10,
      size / 10,
      new THREE.Color(0xffffff),
      new THREE.Color(0x000000)
    );
    gridHelper.position.y = -0.4;
    gridHelper.position.z = -10;
    gridHelper.visible = true;

    el.add(gridHelper);
  }

  // Charecture walk path
  function getPath() {
    var curve = new THREE.CatmullRomCurve3([
      //  new THREE.Vector3(0, 0, -5.5),
      new THREE.Vector3(2, 0, -6),
      new THREE.Vector3(5, 0, -7.5),
      new THREE.Vector3(8, 0, -8),
      new THREE.Vector3(8, 0, -10),
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(-8, 0, -10),
      new THREE.Vector3(-8, 0, -8),
      new THREE.Vector3(-5, 0, -7.5),
      new THREE.Vector3(-2, 0, -6),
    ]);
    curve.type = "catmullrom";
    curve.closed = true;
    return curve;
  }
  // Add path to scene
  function drawPath() {
    var curve = getPath();
    var points = curve.getPoints(50);
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    var curveObject = new THREE.Line(geometry, material);
    el.add(curveObject);

    var p = new SurfacePath(curve);
    p.receiveShadow = true;
    p.castShadow = true;
    el.add(p);
  }

  const loadModel = () => {
    const loader = new GLTFLoader();

    loader.load(
      "./3d/scene.glb",
      (gltf) => {
        charecter = gltf.scene;
        gltf.scene.traverse(function (node) {
          if (node.isMesh) {
            node.receiveShadow = true;
            node.castShadow = true;
          }
        });

        el.add(gltf.scene);
        //gltf.scene.add(sound);
        mixer = new THREE.AnimationMixer(gltf.scene);
        var action = mixer.clipAction(gltf.animations[0]);
        action.play();

        // onLoadComplete();
      },
      null,

      (error) => {
        console.log(error);
      }
    );
  };

  var spotLightHelper;
  // Set up the lights.

  var params = {
    title: "Spotlight Left",
    color: 15443845,
    intensity: 0.47216956746510425,
    distance: 45.08013096674134,
    angle: 0.35117119328426316,
    penumbra: 0.6134601832276251,
    decay: 1.77649491642254,
    near: 62.650000000000006,
    far: 10000,
    x: -6.115,
    y: 4.4750000000000005,
    z: 0,
    target: { x: -0.49, y: 0, z: 0 },
    shadowMap: { size: 512, near: 0.5, far: 500 },
  };
  var setupSpotLights = () => {
    var spotLight1 = new THREE.SpotLight(0x616aff, 1);
    spotLight1.position.set(2, 4, 2);
    spotLight1.angle = 0.35117119328426316;
    spotLight1.penumbra = 0.6134601832276251;
    spotLight1.decay = 1.7;
    spotLight1.distance = 45;
    spotLight1.castShadow = true;
    spotLight1.intensity = 0.47;
    spotLight1.position.x = -6.115;
    spotLight1.position.y = 12.59;
    spotLight1.position.z = 0;
    spotLight1.shadow.mapSize.width = 512;
    spotLight1.shadow.mapSize.height = 512;
    spotLight1.target.position.set(-0.49, 0, 0);
    spotLight1.shadow.mapSize.width = 512; // default
    spotLight1.shadow.mapSize.height = 512; // default
    spotLight1.shadow.camera.near = 0.5; // default
    spotLight1.shadow.camera.far = 500; // default

    el.add(spotLight1);
    el.add(spotLight1.target);

    spotLightHelper = new THREE.SpotLightHelper(spotLight1, 0x00ffff);
    el.add(spotLightHelper);

    var spotLight2 = new THREE.SpotLight(0xcef542, 1);
    spotLight2.position.set(2, 4, 2);
    spotLight2.angle = 0.35117119328426316;
    spotLight2.penumbra = 0.6134601832276251;
    spotLight2.decay = 1.7;
    spotLight2.distance = 45;
    spotLight2.castShadow = true;
    spotLight2.intensity = 0.47;
    spotLight2.position.x = 2.7;
    spotLight2.position.y = 12.59;
    spotLight2.position.z = 0;
    spotLight2.shadow.mapSize.width = 512;
    spotLight2.shadow.mapSize.height = 512;
    spotLight2.target.position.set(-0.49, 0, 0);
    spotLight2.shadow.mapSize.width = 512; // default
    spotLight2.shadow.mapSize.height = 512; // default
    spotLight2.shadow.camera.near = 0.5; // default
    spotLight2.shadow.camera.far = 500; // default

    el.add(spotLight2);
    el.add(spotLight2.target);

    // one of thesr lights will follow path.
    spotlights = [spotLight1, spotLight2];
  };

  this.update = () => {
    var delta = clock.getDelta();
    percentage += speed * 0.003;
    percentage = percentage >= 1 - 0.001 ? 0 : percentage;
    var p1 = path.getPointAt(percentage % 1);
    var p2 = path.getPointAt(percentage + (0.0001 % 1));
    if (charecter) {
      charecter.position.x = p1.x;
      charecter.position.z = p1.z;
      charecter.lookAt(p2);
      if (mixer) mixer.update(delta);
      spotlights[0].target.position.set(p1.x, 0, p1.z);
      spotlights[0].target.updateMatrix();

      spotlights[1].target.position.set(p1.x, 0, p1.z);
      spotlights[1].target.updateMatrix();
    }
  };
  init();
}

World.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
  constructor: World,
});

export { World };
