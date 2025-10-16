import * as THREE from 'https://esm.sh/three@0.165.0';
import { GLTFLoader } from 'https://esm.sh/three@0.165.0/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'https://esm.sh/three@0.165.0/examples/jsm/environments/RoomEnvironment.js';

const canvas = document.createElement('canvas');
canvas.id = 'webgl-bg';
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 0.35));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
keyLight.position.set(0.8, 1.2, 0.6);
scene.add(keyLight);

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.05, 1000);
camera.position.set(0.0, 0.18, 0.55);
camera.lookAt(0, 0, 0);

const rotationPivot = new THREE.Group();
scene.add(rotationPivot);

let kingModel = null;
const gltfLoader = new GLTFLoader();

gltfLoader.load('assets/3d/kingChessPiece.glb', (gltf) => {
  kingModel = gltf.scene;

  const bounds = new THREE.Box3().setFromObject(kingModel);
  const originalSize = bounds.getSize(new THREE.Vector3());

  const targetHeight = 0.3;
  const scaleFactor = targetHeight / originalSize.y;
  kingModel.scale.setScalar(scaleFactor);

  const boundsAfterScale = new THREE.Box3().setFromObject(kingModel);
  const centerAfterScale = boundsAfterScale.getCenter(new THREE.Vector3());
  kingModel.position.sub(centerAfterScale);

  rotationPivot.add(kingModel);
}, undefined, (err) => console.error('GLB load error:', err));

let previousMouseX = null;
const rotationSensitivity = 0.005;

addEventListener('mousemove', (e) => {
  if (previousMouseX !== null) {
    const deltaX = e.clientX - previousMouseX;
    rotationPivot.rotation.y += deltaX * rotationSensitivity;
  }
  previousMouseX = e.clientX;
});

addEventListener('mouseleave', () => { previousMouseX = null; });

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();

addEventListener('resize', () => {
  const width = innerWidth, height = innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});