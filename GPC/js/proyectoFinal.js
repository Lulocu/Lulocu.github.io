/**
 * Proyecto final de la asignatura GPC
 * Presentación del prototipo de ventilación pasiva "Caloret" desarrollado por el grupo de generación espontánea Azalea
 * @author Luis López Cuerva
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.module.js";
//import {TWEEN} from "../lib/tween.module.min.js";
//import {GUI} from "../lib/lil-gui.module.min.js";

//variables estandar
let renderer, scene, camera;

// Otras globales
let cameraControls;

init();
loadScene();
render();

function init() 
{
    // Instanciar el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    renderer.setClearColor(0xAAAAAA);
    renderer.autoClear = false;

    // Instanciar el nodo raiz de la escena
    scene = new THREE.Scene();

    // Instanciar la camara
    setupCamera();

    window.addEventListener('resize', updateAspectRatio);
}

function loadScene() {
    // Definimos materiales //;ejor aqui no
    //const materialSuelo = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });
    //materialRobot = new THREE.MeshNormalMaterial({ wireframe: false, flatshading: true });

    // Suelo
    //let suelo = crearSuelo(1000, 1000, materialSuelo)
    //scene.add(suelo)
    //Caloret
    crearCaloret()
    
}

function render() {
    requestAnimationFrame(render);
    //update();
    renderer.clear();
    renderer.render(scene, camera);
}
function crearCaloret() {

    let materialBase = new THREE.MeshNormalMaterial({ wireframe: false, flatshading: true });
    let materialCristal = new THREE.MeshNormalMaterial({ wireframe: true, flatshading: false, opacity: 0.10  });
    let materialJuntas = new THREE.MeshNormalMaterial({ wireframe: false, flatshading: true });

    
    let caloret = new THREE.Object3D()
    scene.add(caloret)
    
    let base = crearBase(materialBase)
    caloret.add(base)

    let mampara = crearMampara(materialCristal,materialJuntas)
    caloret.add(mampara)

    const axesHelper = new THREE.AxesHelper(200);
    scene.add(axesHelper);

}
function crearBase(material) {
    let base = new THREE.Object3D()
    

    let baseMaderaInfGeometry = new THREE.BoxBufferGeometry(400,10,60)
    let maderaInf = new THREE.Mesh(baseMaderaInfGeometry, material)
    base.add(maderaInf)

    let maderaTrasera = maderaInf.clone(maderaInf)
    maderaTrasera.translateY(25)
    maderaTrasera.translateZ(-25)
    maderaTrasera.rotateX(Math.PI/2)
    
    console.log(maderaTrasera)
    base.add(maderaTrasera)

    return base
}

function crearMampara(materialCristal, materialJuntas) {
    let mampara = new THREE.Object3D()
    
    let mamparaInf = new THREE.Object3D()

    let cristal1Geometry = new THREE.BoxBufferGeometry(380/3,4,50)
    let cristal1 = new THREE.Mesh(cristal1Geometry, materialCristal)
    mamparaInf.add(cristal1)

    let cristal2 = cristal1.clone()
    cristal2.translateX(380/3 + 10)
    mamparaInf.add(cristal2)
    
    let cristal3 = cristal1.clone()
    cristal3.translateX(-380/3 - 10)
    mamparaInf.add(cristal3)

    let junta1Geometry = new THREE.BoxBufferGeometry(10,8,50)
    let junta1 = new THREE.Mesh(junta1Geometry, materialJuntas)
    junta1.translateY(-2)
    mamparaInf.add(junta1)

    let junta2 = junta1.clone(junta1)

    junta1.translateX(380/6 + 5)
    junta2.translateX(-380/6 - 5)
    mamparaInf.add(junta2)

    mampara.translateZ(28)
    mampara.translateY(30)
    mampara.rotateX(Math.PI/2)
    
    
    mampara.add(mamparaInf)


    let mamparaSup = mamparaInf.clone()
    mamparaSup.translateZ(-23)
    mamparaSup.translateY(-23)
    mamparaSup.rotateX(-Math.PI/2)
    mampara.add(mamparaSup)

    return mampara
}

/**
 * The setupCamera function sets up the camera for the scene.
 * 
 *
 *
 * @return The camera object
 *
 * @docauthor Trelent
 */
function setupCamera()
{
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(130, 350, 100);
    camera.lookAt(0, 100, 0);

    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 1, 0);
    camera.lookAt(0, 1, 0);
}

/**
 * The updateAspectRatio function updates the aspect ratio of the renderer and camera.
 * 
 *
 *
 * @return The aspect ratio of the canvas
 *
 * @docauthor Trelent
 */
function updateAspectRatio() {
    // Cambia las dimensiones del canvas
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Nuevo relacion aspecto de la camara
    const ar = window.innerWidth / window.innerHeight;

    // perspectiva
    camera.aspect = ar;
    camera.updateProjectionMatrix();

    cenital.updateProjectionMatrix();

}