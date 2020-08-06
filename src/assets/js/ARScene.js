import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DeviceOrientationControls } from "three/examples/jsm/controls/DeviceOrientationControls.js";
import * as Dat from "dat.gui/build/dat.gui.js";
import SpotLight from "./SpotLight.js";
import SurfacePath from "./SurfacePath.js";

import isMobile from "ismobilejs";

function isMobileDevice() {
  const ua = navigator.userAgent;
  const isIOS =
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) &&
    !window.MSStream;
  return isMobile(ua).any || isIOS;
}

export default function ARScene(_container, _loadProgressCallback) {
  let loadProgressCallback = _loadProgressCallback;
  let container = document.getElementById(_container);
  let width = container.clientWidth;
  let height = container.clientHeight;
  let path = getPath();
  let scene, camera, renderer, controls, mixer;
  var percentage = 0,
    speed = 0.2; // Path animations
  let spotlights = [];
  let gui = new Dat.GUI({ autoplace: true });
  let clock = new THREE.Clock();
  let charecter = null;
  var customContainer = document.getElementById("gui-container");
  // customContainer.appendChild(gui.domElement);


  // Audio.
  var listener, sound;

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
        if (controls) {
          controls.target.set(
            settings.camera.target.x,
            settings.camera.target.y,
            settings.camera.target.z
          );
          controls.update();
        }
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

  const setupScene = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 5, 60);
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.updateProjectionMatrix();
    renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

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
    mesh.position.y = -0.02;
    scene.add(mesh);
    setupGUI();
    setupSpotLights();
    setupAudio(camera);
  };

  function setupAudio(camera) {
    var url = "./audio/Pictures_of_the_Floating_World_-_Waves.ogg";
    // create an AudioListener and add it to the camera
    listener = new THREE.AudioListener();
    camera.add(listener);
    // create the PositionalAudio object (passing in the listener)
    sound = new THREE.PositionalAudio(listener);
    // load a sound and set it as the PositionalAudio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load(url, function (buffer) {
      sound.setBuffer(buffer);
      sound.setRefDistance(2);
      loadModel();
    });
  }

  this.startApp = function (event) {
    sound.play();
    if (isMobileDevice()) {
      controls = new DeviceOrientationControls(camera);
      controls.connect();
    } else {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enableKeys = false;
      controls.minDistance = 0;
      controls.maxDistance = 100;
      controls.maxPolarAngle = Math.PI / 2.2;
      controls.target.set(0, 0, 0);
      controls.update();
      settings.camera.update();
    }
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
    scene.add(curveObject);

    var p = new SurfacePath(curve);
    p.receiveShadow = true;
    p.castShadow = true;
    scene.add(p);
  }

  // Model Loaded.
  function onLoadComplete() {
    isAnimating = true;
    drawPath();
    animate();
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
        scene.add(gltf.scene);
        gltf.scene.add(sound);
        mixer = new THREE.AnimationMixer(gltf.scene);
        var action = mixer.clipAction(gltf.animations[0]);
        action.play();

        onLoadComplete();
      },
      loadProgressCallback,

      (error) => {
        console.log(error);
      }
    );
  };

  // Set up the lights.
  var setupSpotLights = () => {
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
    let spotLight1 = new SpotLight(scene, gui, render, params);
    scene.add(spotLight1);

    params = {
      title: "Spotlight Right",
      color: 6384383,
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
    let spotLight2 = new SpotLight(scene, gui, render, params);
    scene.add(spotLight2);

    // one of thesr lights will follow path.
    spotlights = [spotLight1, spotLight2];
  };

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    var delta = clock.getDelta();
    percentage += speed * 0.005;
    percentage = percentage >= 1 - 0.001 ? 0 : percentage;
    var p1 = path.getPointAt(percentage % 1);
    var p2 = path.getPointAt(percentage + (0.0001 % 1));
    if (charecter) {
      charecter.position.x = p1.x;
      charecter.position.z = p1.z;
      charecter.lookAt(p2);
      spotlights[0].target.position.set(p1.x, 0, p1.z);
      spotlights[1].target.position.set(p1.x, 0, p1.z);
    }

    if (mixer) mixer.update(delta);
    if (isAnimating && controls) {
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
