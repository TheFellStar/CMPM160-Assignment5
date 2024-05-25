//import * as THREE from './node_modules/three/build/three.module.js';
import * as THREE from "three";
//import {OBJLoader} from './node_modules/three/build/OBJLoader.js';
//import { MTLLoader } from './node_modules/three/build/MTLLoader.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer();

const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.set(0, 10, 20);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0,5,0);
controls.update();

const scene = new THREE.Scene();

const boxWidth = 4;
const boxHeight = 4;
const boxDepth = 4;
const geometryCube = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const geometry = new THREE.TetrahedronGeometry(5, 0);
const geometrySphere = new THREE.SphereGeometry(3, 32, 16);

const loader = new THREE.TextureLoader();
const texture = loader.load('crest of flames.jpg');
texture.coloreSpace = THREE.SRGBColorSpace;

{
    //ground stuff
    const planeSize = 40;
    const groundTexture = loader.load('ground.png');
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.magFilter = THREE.NearestFilter;
    groundTexture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize/2;
    groundTexture.repeat.set(repeats,repeats);
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
        map: groundTexture,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
}

//Hemisphere Light
{
    const skyColor = 0xB1E1FF;
    const groundColor = 0xB97A20;
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
}

//DirectionalLight
{
    const color = 0xFFFFFF;
    const intensity = 4;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10,0);
    light.target.position.set(0,5,-1);
    scene.add(light);
    scene.add(light.target);
}

//Point light
{
    const color = 0xFFFFFF;
    const intensity = 150;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 10, 5);
    scene.add(light);
}

const material = new THREE.MeshBasicMaterial({map: texture});

document.body.appendChild(renderer.domElement);

renderer.render(scene, camera);

requestAnimationFrame(render);

const triangles = [
    makeInstance(geometry, 0x44aa88,  0, 5, 0, material),
    makeInstance(geometry, 0x8844aa, -5, 5, 0, null),
    makeInstance(geometry, 0xaa8844,  5, 5, 0, null),
];

const g_map=[
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1],
];

drawMap();

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

//misc shapes
{
    const materialx = new THREE.MeshPhongMaterial({color: '#CA8'});
    const sphere = new THREE.Mesh(geometrySphere, materialx);
    sphere.position.set(-3 - 1, 3 + 2, 7);
    scene.add(sphere);
}

function drawMap(){
    for(var x=0;x<10;x++){
        for(var y=0;y<10;y++){
            if(g_map[x][y]==1){
                makeInstance(geometryCube, 0xFFFFFF, x*4-20, 0, y*4-20, null);
            }
        }
    }
}

function render(time){
    time *= 0.001;

    triangles.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function makeInstance(geometry, color, x, y, z, mat){
    const materialx = new THREE.MeshPhongMaterial({color});
    if(mat!=null){
        const cube = new THREE.Mesh(geometry, mat);
        scene.add(cube);
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        return cube;
    }else{
        const cube = new THREE.Mesh(geometry, materialx);
        scene.add(cube);
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
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
