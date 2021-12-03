import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import glbModel from 'url:/static/Totoro.glb';
import * as ml5 from 'ml5';

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
  eyePosition: {
    left: {
      x: number,
      y: number,
    },
    right: {
      x: number,
      y: number,
    },
  }
  nosePosition: {
    x: number,
    y: number,
  }

  constructor() {
    const canvas = document.getElementsByTagName('canvas')[0];
    const video = document.getElementById('video') as HTMLVideoElement;

    this.eyePosition = {
      left: {
        x: 0,
        y: 0,
      },
      right: {
        x: 0,
        y: 0,
      },
    }

    this.nosePosition = {
      x: 0,
      y: 0,
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream;
        video.play();
      });
    }

    // Create a new poseNet method
    const poseNet = ml5.poseNet(video);
    
    // When the model is loaded
    function modelLoaded() {
      console.log('Model Loaded!');
    }
    // Listen to new 'pose' events
    poseNet.on('pose', (results) => {
      if(results[0]) {

        // console.log(results[0].pose)
        this.eyePosition = {
          left: {
            x: results[0].pose.leftEye.x,
            y: results[0].pose.leftEye.y,
          },
          right: {
            x: results[0].pose.rightEye.x,
            y: results[0].pose.rightEye.y,
          },
        }

        this.nosePosition = {
          x: results[0].pose.nose.x,
          y: results[0].pose.nose.y,
        }
      }
    });

    // poseNet.singlePose()

    this.renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    this.camera.position.y = 0.5;
    this.camera.position.z = 3;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera)  

    this.light = new THREE.AmbientLight(0x404040);
    this.scene.add(this.light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.castShadow = true;
    directionalLight.position.set(2, 2, 1);
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight)

    const dHelper = new THREE.DirectionalLightHelper(directionalLight);
    // this.scene.add(dHelper)

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

    const planeGeometry = new THREE.PlaneBufferGeometry(30, 30);
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
    const eyeMidPointX = (this.eyePosition.right.x + this.eyePosition.left.x) / 2;
    const eyeMidPointY = (this.eyePosition.right.y + this.eyePosition.left.y) / 2;
    const distance = Math.sqrt(this.nosePosition.y - eyeMidPointY)
    this.camera.position.set((-eyeMidPointX / 500 + 0.5) * 3, 3.5 - eyeMidPointY * 0.01 , 2.5);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.renderer.render( this.scene, this.camera );
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
 