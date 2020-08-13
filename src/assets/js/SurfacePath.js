import * as THREE from "three";
import { Object3D } from "three/src/core/Object3D";

export default function SurfacePath(path) {
  Object3D.call(this);

  this.type = "Mesh";

  var extrudeSettings = {
    steps: 80,
    bevelEnabled: false,
    extrudePath: path,
  };

  var height = 0.02;
  var pts = [
    new THREE.Vector2(-height, -1),
    new THREE.Vector2(height, -1),
    new THREE.Vector2(height, 1),
    new THREE.Vector2(-height, 1),
  ];
  var shape = new THREE.Shape(pts);

  // Extrude the triangle along the CatmullRom curve
  this.geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  this.material = new THREE.MeshBasicMaterial({
    color: 0xeeeeee,
  });
}

SurfacePath.prototype = Object.assign(Object.create(THREE.Mesh.prototype), {
  constructor: SurfacePath,
});

export { SurfacePath };
