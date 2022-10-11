/**
 * 
 * 
 * Practica3GPC 
 * 
 * 
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js";
//import {GLTFLoader} from "../lib/GLTFLoader.module.js";
import { OrbitControls } from "../lib/OrbitControls.module.js";

// Variables estandar
let renderer, scene, camera;

// Otras globales
let cameraControls;
let cenital
let L = 50
// Acciones
init();
loadScene();
render();

function init() {
    // Instanciar el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    renderer.setClearColor(0xAAAAAA);
    renderer.autoClear = false;

    // Instanciar el nodo raiz de la escena
    scene = new THREE.Scene();

    // Instanciar la camara
    const ar = window.innerWidth / window.innerHeight;

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(130, 350, 100);
    camera.lookAt(0, 100, 0);

    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 1, 0);
    camera.lookAt(0, 1, 0);
    setCameras(ar);

    window.addEventListener('resize', updateAspectRatio);
}
function updateAspectRatio() {
    // Cambia las dimensiones del canvas
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Nuevo relacion aspecto de la camara
    const ar = window.innerWidth / window.innerHeight;

    // perspectiva
    camera.aspect = ar;
    camera.updateProjectionMatrix();

    // ortografica
    if (ar > 1) {
        cenital.left = -L * ar;
        cenital.right = L * ar;
    }
    else {
        cenital.top = L / ar;
        cenital.bottom = -L / ar;
    }


    cenital.updateProjectionMatrix();

}
function setCameras(ar) {

    // Construir las camaras ortograficas
    if (ar > 1) {
        cenital = new THREE.OrthographicCamera(-L * ar, L * ar, L, -L, -50, 500);
    }
    else {
        cenital = new THREE.OrthographicCamera(-L, L, L / ar, -L / ar, -50, 500);
    }
    cenital.position.set(0, 250, 0);
    cenital.lookAt(0, 0, 0);
    cenital.up = new THREE.Vector3(0, -1, 0);


}
function loadScene() {
    // Material sencillo
    const materialSuelo = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });
    const materialRobot = new THREE.MeshNormalMaterial({ wireframe: false, flatshading: true });

    // Suelo
    let suelo = crearSuelo(1000, 1000, materialRobot)
    scene.add(suelo)
    //Robot
    let robot = crearRobot(materialRobot)
    scene.add(robot)
}

function update() {

}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.clear();


    // El S.R. del viewport es left-bottom con X right y Y up
    if (window.innerHeight < window.innerWidth) {
        renderer.setViewport(0, 3 * window.innerHeight / 4, window.innerHeight / 4, window.innerHeight / 4);
        renderer.render(scene, cenital);

    } else {
        renderer.setViewport(0,window.innerHeight-window.innerWidth/4, window.innerWidth/4,window.innerWidth/4);
        renderer.render(scene,cenital);

    }
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);

}

function crearSuelo(width, height, material) {
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(width, height, width, height), material);
    suelo.rotation.x = -Math.PI / 2;
    suelo.position.y = -0.2;
    return suelo
}

function crearRobot(material) {
    let robot = new THREE.Object3D()
    let base = crearBase(material);

    //const materialDebug = new THREE.MeshBasicMaterial({color:'green',wireframe:true});

    //Brazo
    let brazo = new THREE.Object3D()
    let rotulaGeometry = new THREE.CylinderBufferGeometry(20, 20, 18, 20 * 2, 18 * 2)
    const rotula = new THREE.Mesh(rotulaGeometry, material)
    rotula.rotation.z = Math.PI / 2
    rotula.position.set(0, 0, 0)
    brazo.add(rotula)

    let esparragoGeometry = new THREE.BoxBufferGeometry(18, 120, 12, 18 * 2, 120 * 2, 12 * 2)
    const esparrago = new THREE.Mesh(esparragoGeometry, material)
    esparrago.position.set(0, 60, 0)
    brazo.add(esparrago)


    let ejeGeometry = new THREE.SphereBufferGeometry(20, 20 * 2, 20 * 2)
    const eje = new THREE.Mesh(ejeGeometry, material)
    eje.position.set(0, 120, 0)
    brazo.add(eje)
    //Fin brazo

    //Antebrazo
    const antebrazo = new THREE.Object3D()

    let discoGeometry = new THREE.CylinderBufferGeometry(22, 22, 6, 22 * 2, 6 * 2)
    const disco = new THREE.Mesh(discoGeometry, material)
    disco.position.set(0, 120, 0)
    antebrazo.add(disco)

    let nervios = crearNervios(material)
    antebrazo.add(nervios)

    let rotorGeometry = new THREE.CylinderBufferGeometry(15, 15, 40, 15 * 2, 40 * 2)
    const rotor = new THREE.Mesh(rotorGeometry, material)
    rotor.rotation.y = Math.PI / 2
    rotor.rotation.z = Math.PI / 2
    rotor.position.set(0, 200, 0)

    antebrazo.add(rotor)

    let mano = new THREE.Object3D()

    let pinzaIzq = new THREE.Object3D()
    let paralelipedoGeometry = new THREE.BoxBufferGeometry(19, 20, 4, 19 * 2, 20 * 2, 4 * 2)
    const paralelipedo = new THREE.Mesh(paralelipedoGeometry, material)
    paralelipedo.position.set(9, 200, -10)

    //Empiezan los cambios

    const dedoIzqGeometry = new THREE.BufferGeometry()
    const position =  
    [
        4, 20, 0,    0, 20, 0,       3, 15, 19,   1, 15, 19, //  4523 
        3, 15, 19,   1, 15, 19,      1, 5, 19,    3, 5, 19,//3210 
        4, 20, 0,    3, 5, 19,       3, 15, 19,   4, 0, 0, //4037 
        0, 20, 0,    1, 15, 19,      1, 5, 19,    0, 0, 0,//5216
        4, 20, 0,   0, 20, 0,        0, 0, 0,     4, 0, 0, //4567
        0, 0, 0,    1, 5, 19,        3, 5, 19,    4, 0, 0 //6107

    ]


    const indices = [
        2,0,1,3,2,1, //top
        7,4,5, 6,7,5, //front
        9,11,8,10,9,8,//left
        14,13,12,15,14,12, //right
        18,17,16,19,18,16, //back
        22,21,20,23,22,20//bottom
    ];
    let cero = new THREE.Vector3(3, 5, 19)
    let uno = new THREE.Vector3(1, 5, 19)
    let dos = new THREE.Vector3(1, 15, 19)
    let tres = new THREE.Vector3(3, 15, 19)
    let cuatro = new THREE.Vector3(4, 20, 0)
    let cinco = new THREE.Vector3(0, 20, 0)
    let seis = new THREE.Vector3(0, 0, 0)
    let siete = new THREE.Vector3(4, 0, 0)

    let normal = [
        //0
        calculateNormal(tres, siete, cero).toArray(), //x   
        calculateNormal(siete, uno, cero).toArray(), //y
        calculateNormal(uno, tres, cero).toArray(), //z  
        //1
        calculateNormal(tres, seis, uno).toArray(), //x   
        calculateNormal(seis, cero, uno).toArray(), //y
        calculateNormal(cero, tres, uno).toArray(), //z 
        //2
        calculateNormal(uno, cinco, dos).toArray(), //x   
        calculateNormal(cinco, tres, dos).toArray(), //y
        calculateNormal(tres, uno, dos).toArray(), //z 

        //3
        calculateNormal(cero, cuatro, tres).toArray(), //x   
        calculateNormal(cuatro, dos, tres).toArray(), //y
        calculateNormal(dos, cero, tres).toArray(), //z 

        //4
        calculateNormal(siete, tres, cuatro).toArray(), //x   
        calculateNormal(tres, cinco, cuatro).toArray(), //y
        calculateNormal(cinco, siete, cuatro).toArray(), //z 
        //5
        calculateNormal(seis, dos, cinco).toArray(), //x   
        calculateNormal(dos, cuatro, cinco).toArray(), //y
        calculateNormal(cuatro, seis, cinco).toArray(), //z 
        //6
        calculateNormal(cinco, uno, seis).toArray(), //x   
        calculateNormal(uno, siete, seis).toArray(), //y
        calculateNormal(siete, cinco, seis).toArray(), //z 
        //7
        calculateNormal(cuatro, cero, siete).toArray(), //x   
        calculateNormal(cero, seis, siete).toArray(), //y
        calculateNormal(seis, cuatro, siete).toArray(), //z 

    ]
    normal = normal.flat()
    console.log(new THREE.Float32BufferAttribute(normal, 3))
    dedoIzqGeometry.setIndex(indices)
    dedoIzqGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
    dedoIzqGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normal, 3))

    //dedoIzqGeometry.setAttribute('color', new THREE.BufferAttribute(color,3))

    //Terminan los cambios
    const materialRojo = new THREE.MeshBasicMaterial({ color: 'red' });
    const dedoIzq = new THREE.Mesh(dedoIzqGeometry, material)

    console.log(dedoIzq)
    dedoIzq.rotation.y = Math.PI / 2
    dedoIzq.position.set(18, 190, -8)
    pinzaIzq.add(dedoIzq)
    pinzaIzq.add(paralelipedo)

    dedoIzqGeometry.computeVertexNormals()

    let pinzaDerecha = pinzaIzq.clone()
    pinzaDerecha.translateZ(15)
    mano.add(pinzaIzq)
    mano.add(pinzaDerecha)

    antebrazo.add(mano)
    brazo.add(antebrazo)
    //Fin antebrazo

    robot.add(base)
    robot.add(brazo)
    const axesHelper = new THREE.AxesHelper(200);
    scene.add(axesHelper);


    //Prueba
    return robot
}
function crearBase(material) {

    let baseGeometry = new THREE.CylinderBufferGeometry(50, 50, 15, 50 * 2, 15 * 2)
    let base = new THREE.Mesh(baseGeometry, material)
    base.position.set(0, 0, 0)

    return base
}

function crearNervios(material) {

    let nervios = new THREE.Object3D()
    let nerviosGeometry = new THREE.BoxBufferGeometry(4, 80, 4, 4 * 2, 80 * 2, 4 * 2)

    const nervio1 = new THREE.Mesh(nerviosGeometry, material)
    nervio1.position.set(6, 160, -6)
    nervios.add(nervio1)

    //let nerviosGeometry2 = new THREE.BoxBufferGeometry(4,80,4)
    const nervio2 = new THREE.Mesh(nerviosGeometry, material)
    nervio2.position.set(-6, 160, 6)
    nervios.add(nervio2)

    const nervio3 = new THREE.Mesh(nerviosGeometry, material)
    nervio3.position.set(-6, 160, -6)
    nervios.add(nervio3)

    const nervio4 = new THREE.Mesh(nerviosGeometry, material)
    nervio4.position.set(6, 160, 6)
    nervios.add(nervio4)


    return nervios
}

function calculateNormal(vecino1, vecino2, position) {
    let tangent = new THREE.Vector3().subVectors(position,vecino1)
    let bitangent = new THREE.Vector3().subVectors(position, vecino2)
    let normal = new THREE.Vector3().crossVectors(tangent, bitangent).normalize()
    //normal = new THREE.Vector3(normalize(cross(tangent, bitangent)))
    return normal//.multiply(new THREE.Vector3(-1,-1,-1))
}
