import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import glbModel from 'url:/static/Totoro.glb';

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
    this.renderer.shadowMap.enabled = true;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    this.camera.position.y = 0.5;
    this.camera.position.z = 3
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera)

    // this.controls = new OrbitControls(this.camera, canvas)
    // this.controls.enableDamping = true
  

    this.light = new THREE.AmbientLight(0x404040);
    this.scene.add(this.light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.castShadow = true;
    directionalLight.position.set(2, 2, 1);
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight)

    const dHelper = new THREE.DirectionalLightHelper(directionalLight);
    this.scene.add(dHelper)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(ambientLight)


    const loader = new GLTFLoader();

    loader.load(glbModel, (model) => {
      model.scene.position.set(0, -0.5, 0)
      model.scene.scale.set(0.08, 0.08, 0.08)
      model.scene.traverse( ( node ) => {
        node.castShadow = true;
      } );
      // model.scene.castShadow = true;
      this.scene.add(model.scene);
    })

    const planeGeometry = new THREE.PlaneBufferGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({color: '#dddddd'});

    const plane1 = new THREE.Mesh(
      planeGeometry,
      planeMaterial,
    )
    plane1.receiveShadow = true;
    plane1.position.set(0, 0.8, -1);

    const plane2 = new THREE.Mesh(
      planeGeometry,
      planeMaterial,
    )
    plane2.receiveShadow = true;
    plane2.rotateX(-Math.PI / 2)
    plane2.position.set(0, -0.5, 0);

    this.scene.add(plane1, plane2);

    this.render();
  }

  render() {
    this.renderer.render( this.scene, this.camera );
    // this.controls.update()
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
 