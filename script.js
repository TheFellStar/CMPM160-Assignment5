//import * as THREE from './node_modules/three/build/three.module.js';
import * as THREE from "three";
//import {OBJLoader} from './node_modules/three/build/OBJLoader.js';
//import { MTLLoader } from './node_modules/three/build/MTLLoader.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer();

const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.z=3;

const scene = new THREE.Scene();

const boxWidth = 5;
const boxHeight = 5;
const boxDepth = 5;
const geometryCube = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const geometry = new THREE.TetrahedronGeometry(1, 0);

const loader = new THREE.TextureLoader();
const texture = loader.load('crest of flames.jpg');
texture.coloreSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshBasicMaterial({map: texture});

document.body.appendChild(renderer.domElement);

renderer.render(scene, camera);

requestAnimationFrame(render);

const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

const cubes = [
    makeInstance(geometry, 0x44aa88,  0, material),
    makeInstance(geometry, 0x8844aa, -2, null),
    makeInstance(geometry, 0xaa8844,  2, null),
];

{
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlLoader.load('Desert shrew/DesertShrew.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load('Desert shrew/DesertShrew.obj', (root) => {
        scene.add(root);
        });
    });
}

{
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
        'autumn_field_puresky.jpg',
        () => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.colorSpace = THREE.SRGBColorSpace;
            scene.background = texture;
        });
}

function render(time){
    time *= 0.001;

    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function makeInstance(geometry, color, x, mat){
    const materialx = new THREE.MeshPhongMaterial({color});
    if(mat!=null){
        const cube = new THREE.Mesh(geometry, mat);
        scene.add(cube);
        cube.position.x = x;
        return cube;
    }else{
        const cube = new THREE.Mesh(geometry, materialx);
        scene.add(cube);
        cube.position.x = x;
        return cube;
    }
}
/*function main() {
    
    console.log("poop");
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.z=3;

    const scene = new THREE.Scene();

    scene.add(camera);//d

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new THREE.MeshBasicMaterial({color: 0x44aa88});

    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    document.body.appendChild(renderer.domElement);

    renderer.render(scene, camera);
}*/