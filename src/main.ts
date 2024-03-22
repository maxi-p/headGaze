import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import * as dat from 'dat.gui';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth,window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const target = new THREE.Object3D();
target.position.z = 15;
const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const cursorPlane = new THREE.Plane();
const rayCaster = new THREE.Raycaster();
let headBone: THREE.Object3D<THREE.Object3DEventMap> | undefined;

window.addEventListener('mousemove',(e)=>{
    mouse.x = (e.clientX/window.innerWidth)*2 - 1;
    mouse.y = -(e.clientY/window.innerHeight)*2 + 1;
    planeNormal.copy(camera.position).normalize();
    cursorPlane.setFromNormalAndCoplanarPoint(planeNormal, new THREE.Vector3(0,0,0));
    rayCaster.setFromCamera(mouse,camera);
    rayCaster.ray.intersectPlane(cursorPlane, intersectionPoint);
    target.position.set(intersectionPoint.x, intersectionPoint.y,7);
})

const loader = new GLTFLoader();

loader.load("models/untitled.glb", (gltf)=>{
    const model = gltf.scene;
    model.position.set(0,0,0);
    model.scale.set(5,5,5);
    scene.add(model);
    console.log(model);
    headBone = model.getObjectByName("mixamorig9Neck");
    let gaze = gui.addFolder('gaze');
    gaze.open();
    if(headBone !== undefined){
        // throw new Error("head bone not found!");
        gaze.add(headBone.rotation,"x", -0.5*Math.PI, 0.5*Math.PI);
        gaze.add(headBone.rotation,"y", -0.5*Math.PI, 0.5*Math.PI);
        gaze.add(headBone.rotation,"z", -0.5*Math.PI, 0.5*Math.PI);
    } 
    
    
},undefined, function(error){
    console.log("error "+error);
})
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0,9,5);
orbit.update();
camera.rotation.set(-0.5,0,0);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);

const gridHelper = new THREE.GridHelper(30,30);
scene.add(gridHelper);

const gui = new dat.GUI();
let cameraPerspective = gui.addFolder('Camera');
cameraPerspective.open();
let rotationPerspective = cameraPerspective.addFolder('Rotation');
rotationPerspective.open();
rotationPerspective.add(camera.rotation,"x", Math.PI*-1.0, Math.PI*1.0);
rotationPerspective.add(camera.rotation,"y", Math.PI*-1.0, Math.PI*1.0);
rotationPerspective.add(camera.rotation,"z", Math.PI*-1.0, Math.PI*1.0);
let positionPerspective = cameraPerspective.addFolder('Position');
positionPerspective.open();
positionPerspective.add(camera.position,"x", 0.0, 100.0);
positionPerspective.add(camera.position,"y", 0.0, 100.0);
positionPerspective.add(camera.position,"z", 0.0, 100.0);



function animate(){
    if(headBone !== undefined)
        headBone.lookAt(target.position);
    renderer.render(scene,camera);
}

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
renderer.render(scene,camera);
renderer.setAnimationLoop(animate);;