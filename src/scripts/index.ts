import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import jjj from 'url:/static/model2.glb';

let camera, scene, renderer;
let geometry, material, mesh;

export default class Sketch {
  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  scene: THREE.Scene;
  light: THREE.AmbientLight;
  time: number;
  geometry: THREE.PlaneGeometry;
  material: THREE.MeshNormalMaterial;
  mesh: THREE.Mesh<typeof geometry, typeof material>;
  controls: OrbitControls;

  constructor() {
    const canvas = document.getElementsByTagName('canvas')[0]

    this.renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    this.camera.position.x = 1
    this.camera.position.y = 1
    this.camera.position.z = 2
    this.scene.add(this.camera)

    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
  

    this.light = new THREE.AmbientLight(0x404040);
    this.scene.add(this.light);

    const loader = new GLTFLoader();

    loader.load(jjj, (gltf) => {
      this.scene.add(gltf.scene);
    })

    this.render();
  }

  render() {
    this.renderer.render( this.scene, this.camera );
    this.controls.update()
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch();

// @ts-expect-error
if (module.hot) {
  // @ts-expect-error
  module.hot.dispose(() => {
    window.location.reload();
  });
  // @ts-expect-error
  module.hot.accept();
}
 