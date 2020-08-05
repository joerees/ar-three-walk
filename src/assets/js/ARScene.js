import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as Dat from "dat.gui/build/dat.gui.js";
import SpotLight from "./SpotLight.js";

export default function ARScene(_container) {
  let container = document.getElementById(_container);
  let width = container.clientWidth;
  let height = container.clientHeight;
  let scene, camera, renderer, controls, mixer;
  let gui = new Dat.GUI({ autoplace: true });
  let clock = new THREE.Clock();
  var customContainer = document.getElementById("gui-container");
  customContainer.appendChild(gui.domElement);

  var isAnimating = false;

  var settings = {
    camera: {
      fov: 45,
      near: 0.1,
      far: 1000,
      position: {
        x: -0.5,
        y: 1.5,
        z: 3,
      },
      target: {
        x: 0,
        y: 1,
        z: 0,
      },
      update: () => {
        camera.fov = settings.camera.fov;
        camera.near = settings.camera.near;
        camera.far = settings.camera.far;
        camera.position.set(
          settings.camera.position.x,
          settings.camera.position.y,
          settings.camera.position.z
        );
        controls.target.set(
          settings.camera.target.x,
          settings.camera.target.y,
          settings.camera.target.z
        );
        controls.update();
        camera.updateProjectionMatrix();
        render();
        console.log(settings);
      },
    },
    fog: {
      near: 1,
      far: 2000,
      update: () => {
        scene.fog.near = settings.fog.near;
        scene.fog.far = settings.fog.far;
        render();
      },
    },
  };

  //, controls, spotLight, target
  console.log("_container");
  const setupScene = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 5, 1000);
    // setupEnvironment(scene);
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.updateProjectionMatrix();
    // Renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    /* renderer.gammaFactor = 1.2;
    renderer.outputEncoding = THREE.GammaEncoding;
    renderer.physicallyBasedShading = true;*/
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableKeys = false;
    controls.minDistance = 0;
    controls.maxDistance = 100;
    //controls.rotateSpeed = -1.5;
    controls.maxPolarAngle = Math.PI / 2.2;
    //controls.minPolarAngle = Math.PI / 3.5;
    // controls.addEventListener("change", render);
    controls.target.set(0, 0, 0);
    controls.update();
    settings.camera.update();

    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);

    let size = 100;
    var gridHelper = new THREE.GridHelper(
      size / 100,
      size / 100,
      new THREE.Color(0xffffff),
      new THREE.Color(0x000000)
    );
    gridHelper.position.y = -0.4;
    gridHelper.visible = true;
    scene.add(gridHelper);

    var mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(size, size),
      new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.position.y = -0;
    scene.add(mesh);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    scene.add(cube);

    setupGUI();
    setupSpotLights();
    loadModel();
  };

  var setupGUI = function () {
    let f = gui.addFolder("Camera");
    f.add(settings.camera, "fov", 0, 100, 1).onChange(settings.camera.update);
    f.add(settings.camera, "near", 0, 1000, 1).onChange(settings.camera.update);
    f.add(settings.camera, "far", 0, 1000, 1).onChange(settings.camera.update);

    let cameraPosition = f.addFolder("position");
    cameraPosition
      .add(settings.camera.position, "x", 0, 20, 1)
      .onChange(settings.camera.update);
    cameraPosition
      .add(settings.camera.position, "y", 0, 20, 1)
      .onChange(settings.camera.update);
    cameraPosition
      .add(settings.camera.position, "z", 0, 20, 1)
      .onChange(settings.camera.update);

    let cameraTarget = f.addFolder("target");
    cameraTarget
      .add(settings.camera.target, "x", 0, 20, 1)
      .onChange(settings.camera.update);
    cameraTarget
      .add(settings.camera.target, "y", 0, 20, 1)
      .onChange(settings.camera.update);
    cameraTarget
      .add(settings.camera.target, "z", 0, 20, 1)
      .onChange(settings.camera.update);
    var debugCamera = {
      LogCamera: function () {
        console.log("camera.position :", camera.position);
      },
    };
    gui.add(debugCamera, "LogCamera");

    f = gui.addFolder("Fog");
    f.add(settings.fog, "near", 0, 100, 1).onChange(settings.fog.update);
    f.add(settings.fog, "far", 0, 1000, 1).onChange(settings.fog.update);
  };

  function onLoadComplete() {
    isAnimating = true;
    animate();
  }

  const loadModel = () => {
    const loader = new GLTFLoader();

    loader.load(
      "/3d/scene.glb",
      (gltf) => {
        gltf.scene.traverse(function (node) {
          if (node.isMesh) {
            console.log(node);
            node.receiveShadow = true;
            node.castShadow = true;
          }
        });
        console.log("gltf", gltf);
        scene.add(gltf.scene);

        mixer = new THREE.AnimationMixer(gltf.scene);
        var action = mixer.clipAction(gltf.animations[0]);
        action.play();

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        onLoadComplete();
      },
      (progress) => {
        console.log("progress", progress);
      },

      (error) => {
        console.log(error);
      }
    );
  };

  // Set up the lights.
  var setupSpotLights = () => {
    var params = {
      title: "Spotlight Left",
      color: 16777215,
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
    let spotLight = new SpotLight(scene, gui, render, params);
    scene.add(spotLight);

    params = {
      title: "Spotlight Right",
      color: 11184810,
      intensity: 0.4942271239014303,
      distance: 18.611063243150095,
      angle: 0.46666428871177007,
      penumbra: 1,
      decay: 1.77649491642254,
      near: 62.650000000000006,
      far: 10000,
      x: 2.71,
      y: 3.59,
      z: 0,
      target: { x: 0, y: 0, z: 0 },
      shadowMap: { size: 512, near: 0.5, far: 500 },
    };
    spotLight = new SpotLight(scene, gui, render, params);
    scene.add(spotLight);
  };

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    var delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    if (isAnimating) {
      controls.update();
    }
    renderer.render(scene, camera);
  }

  this.onWindowResize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
  };

  setupScene();
}
