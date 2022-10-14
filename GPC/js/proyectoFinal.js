/**
 * Proyecto final de la asignatura GPC
 * Presentación del prototipo de ventilación pasiva "Caloret" desarrollado por el grupo de generación espontánea Azalea
 * @author Luis López Cuerva
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.module.js";
//import {TWEEN} from "../lib/tween.module.min.js";
import {GUI} from "../lib/lil-gui.module.min.js";

//variables estandar
let renderer, scene, camera;

// Otras globales
let cameraControls;
let controlesGUI

//variables para animaciones y zooms, etc
let ladrillo5
let base, ladrillos, mampara, tapas, tubos
let ini_pos_base,ini_pos_ladrillos,ini_pos_mampara,ini_pos_tapas,ini_pos_tubos
init();
loadScene();
render();
setupGui()

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

function setupGui()
{
    const gui = new GUI()
    controlesGUI = {
        ventilacion: false,
        zoomLadrillo: function() {ladrillo()},
        aperturaFigura: 0.0,
        foto: function() {foto()},
    }

    //Construccion menu
    const h = gui.addFolder("Caloret real")
    h.add(controlesGUI, "foto").name("Ver Caloret real").listen().onChange(foto)
    const g = gui.addFolder("Control presentación")
    g.add(controlesGUI, "aperturaFigura", 0, 100.0, 0.5).name("Separar piezas").listen().onChange(aperturaFigura)
    g.add(controlesGUI, "zoomLadrillo").name("Ver ladrillo").listen().onChange(ladrillo)
    g.add(controlesGUI, "ventilacion").name("Ventilación").listen().onChange(ladrillo)
}

function crearCaloret() {

    let materialBase = new THREE.MeshNormalMaterial({ wireframe: false, flatshading: true });
    let materialCristal = new THREE.MeshNormalMaterial({ wireframe: true, flatshading: false, opacity: 0.10  });
    let materialJuntas = new THREE.MeshNormalMaterial({ wireframe: false, flatshading: true });
    let materialTubos = new THREE.MeshNormalMaterial({ wireframe: true, flatshading: false, opacity: 0.5  });
    let materialPCM = new THREE.MeshNormalMaterial({ wireframe: true, flatshading: true, });

    
    let caloret = new THREE.Object3D()
    scene.add(caloret)
    
    base = crearBase(materialBase)
    caloret.add(base)

    ladrillos = crearLadrillos(materialPCM)
    caloret.add(ladrillos)

    mampara = crearMampara(materialCristal,materialJuntas)
    caloret.add(mampara)

    tapas = crearTapas(materialBase)
    caloret.add(tapas)

    tubos = crearTubos(materialTubos)
    caloret.add(tubos)
/*
    scene.updateMatrixWorld(true);
    ini_pos_base = base.getWorldPosition(base)
    ini_pos_ladrillos = ladrillos.getWorldPosition(ladrillos)
    ini_pos_mampara=mampara.getWorldPosition(mampara)
    ini_pos_tapas = tapas.getWorldPosition(tapas)
    ini_pos_tubos = tubos.getWorldPosition(tubos)
*/
    const axesHelper = new THREE.AxesHelper(200);
    scene.add(axesHelper);
}

/**
 * The crearBase function creates a base for the Caloret.
 * 
 *
 * @param material Define the color of the base
 *
 * @return A Object3D representing the base
 *
 * @docauthor Trelent
 */
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

/**
 * The crearMampara function creates a mampara object.
 * 
 *
 * @param materialCristal Specify the material of the glass
 * @param materialJuntas Create the material of the joints
 *
 * @return  A Object3D representing the mampara
 *
 * @docauthor Trelent
 */
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
 * The crearTapas function creates a new THREE.Object3D object that contains two
 * meshes, one for each tapa of the caja. The function takes in a material as an
 * argument and returns the newly created tapas object. 
 
 *
 * @param material Specify the color of the tapas
 *
 * @return  A Object3D representing the the two tapas of el caloret
 *
 * @docauthor Trelent
 */
function crearTapas(material) {
    let tapas = new THREE.Object3D()
    
    let tapaGeometry = new THREE.BoxBufferGeometry(60,10,60)
    let tapa1 = new THREE.Mesh(tapaGeometry, material)
    tapas.add(tapa1)

    tapa1.translateX(-205)
    tapa1.translateY(25)
    tapa1.rotateX(Math.PI/2)
    tapa1.rotateZ(Math.PI/2)
    
    let tapa2 = tapa1.clone()
    tapa2.translateY(-410)
    tapas.add(tapa2)
    
    
    return tapas
}

/**
 * The crearTubos function creates a group of three cylinders and two caps.
 * 
 *
 * @param material Specify the material used for the tubes
 *
 * @return  A Object3D representing the two tubes of ventilation
 *
 * @docauthor Trelent
 */
function crearTubos(material) {
    let tubos = new THREE.Object3D()
    
    let tubosGeometry = new THREE.CylinderBufferGeometry(10,10,45)
    let tubo1 = new THREE.Mesh(tubosGeometry, material)
    tubos.add(tubo1)

    tubo1.translateX(-220)
    tubo1.translateY(15)
    tubo1.rotateZ(Math.PI/2)
    
    let tapa2 = tubo1.clone()
    tapa2.translateY(-440)
    tubos.add(tapa2)
    
    
    return tubos
}

function crearLadrillos(material) {
    
    let ladrillos = new THREE.Object3D()
    let ladrilloBajo = ladrillosBajo(material)
    ladrillos.add(ladrilloBajo)

    let ladrilloArriba = ladrillosArriba(material)
    ladrillos.add(ladrilloArriba)
    
    return ladrillos
}
function ladrillosBajo(material) {
    let ladrillosBajo = new THREE.Object3D()

    let ladrillosGeometry = new THREE.BoxGeometry(45,6,40)
    let ladrillo1 = new THREE.Mesh(ladrillosGeometry, material)
    ladrillosBajo.add(ladrillo1)

    ladrillo1.translateX(-175)
    ladrillo1.translateZ(4)
    ladrillo1.translateY(10)
    let ladrillo2 = ladrillo1.clone()
    ladrillo2.translateX(50)
    ladrillosBajo.add(ladrillo2)

    ladrillosGeometry = new THREE.BoxGeometry(25,6,40)
    let ladrillo3 = new THREE.Mesh(ladrillosGeometry, material)
    //ladrillo2.translateX(50)
    ladrillo3.translateZ(4)
    ladrillo3.translateY(10)
    ladrillo3.translateX(-87)
    ladrillosBajo.add(ladrillo3)

    let ladrillo4 = ladrillo1.clone()
    ladrillo4.translateX(135)
    ladrillosBajo.add(ladrillo4)

    let ladrillo5 = ladrillo4.clone()
    ladrillo5.translateX(50)
    ladrillosBajo.add(ladrillo5)

    let ladrillo6 = ladrillo3.clone()
    ladrillo6.translateX(135)
    ladrillosBajo.add(ladrillo6)

    let ladrillo7 = ladrillo4.clone()
    ladrillo7.translateX(140)
    ladrillosBajo.add(ladrillo7)

    let ladrillo8 = ladrillo7.clone()
    ladrillo8.translateX(50)
    ladrillosBajo.add(ladrillo8)


    ladrillosGeometry = new THREE.BoxGeometry(20,6,40)
    let ladrillo9 = new THREE.Mesh(ladrillosGeometry, material)
    //ladrillo2.translateX(50)
    ladrillo9.translateZ(4)
    ladrillo9.translateY(10)
    ladrillo9.translateX(187)
    
    ladrillosBajo.add(ladrillo9)

    return ladrillosBajo
}

function ladrillosArriba(material) {
    let ladrillosAlto = new THREE.Object3D()

    let ladrillosGeometry = new THREE.BoxGeometry(45,6,35)
    let ladrillo1 = new THREE.Mesh(ladrillosGeometry, material)
    ladrillosAlto.add(ladrillo1)

    ladrillo1.translateX(-175)
    ladrillo1.translateZ(4)
    ladrillo1.translateY(10)
    let ladrillo2 = ladrillo1.clone()
    ladrillo2.translateX(50)
    ladrillosAlto.add(ladrillo2)

    ladrillosGeometry = new THREE.BoxGeometry(25,6,35)
    let ladrillo3 = new THREE.Mesh(ladrillosGeometry, material)
    //ladrillo2.translateX(50)
    ladrillo3.translateZ(4)
    ladrillo3.translateY(10)
    ladrillo3.translateX(-87)
    ladrillosAlto.add(ladrillo3)

    let ladrillo4 = ladrillo1.clone()
    ladrillo4.translateX(135)
    ladrillosAlto.add(ladrillo4)

    ladrillo5 = ladrillo4.clone()
    ladrillo5.translateX(50)
    ladrillosAlto.add(ladrillo5)

    let ladrillo6 = ladrillo3.clone()
    ladrillo6.translateX(135)
    ladrillosAlto.add(ladrillo6)

    let ladrillo7 = ladrillo4.clone()
    ladrillo7.translateX(140)
    ladrillosAlto.add(ladrillo7)

    let ladrillo8 = ladrillo7.clone()
    ladrillo8.translateX(50)
    ladrillosAlto.add(ladrillo8)


    ladrillosGeometry = new THREE.BoxGeometry(20,6,35)
    let ladrillo9 = new THREE.Mesh(ladrillosGeometry, material)
    //ladrillo2.translateX(50)
    ladrillo9.translateZ(4)
    ladrillo9.translateY(10)
    ladrillo9.translateX(187)
    ladrillosAlto.add(ladrillo9)

    ladrillosAlto.translateZ(-20)
    ladrillosAlto.translateY(35)
    ladrillosAlto.rotateX(Math.PI/2)


    return ladrillosAlto
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

}

function foto() {
    
}

function ladrillo() {
    
}

function aperturaFigura() {
    base.position.y = ini_pos_base.y + controlesGUI.aperturaFigura
    mampara.position.y = 10 + controlesGUI.aperturaFigura
    tapas.position.y = 200 + controlesGUI.aperturaFigura
    tubos.position.y = 3000 + controlesGUI.aperturaFigura
    ladrillos.position.y = 6000 + controlesGUI.aperturaFigura
}