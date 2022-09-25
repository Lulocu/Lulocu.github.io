/**
 * Escena.js
 * 
 * Seminario GPC#2. Construir una escena bÃ¡sica con transformaciones e
 * importaciÃ³n de modelos.
 * 
 * 
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";

// Variables estandar
let renderer, scene, camera;

// Otras globales
let esferaCubo;
let angulo = 0;

// Acciones
init();
loadScene();
render();

function init()
{
    // Instanciar el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.getElementById('container').appendChild( renderer.domElement );

    // Instanciar el nodo raiz de la escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5,0.5,0.5);

    // Instanciar la camara
    camera= new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,1000);
    camera.position.set(130, 350, 100);
    camera.lookAt(0,100,0);
    //camera.position.set(19,200,290);
    //camera.lookAt(19,200,-9);
}

function loadScene()
{
    // Material sencillo
    const materialSuelo = new THREE.MeshBasicMaterial({color:'yellow',wireframe:true});
    const materialRobot = new THREE.MeshBasicMaterial({color:'brown',wireframe:true});

    // Suelo
    let suelo =crearSuelo(1000,1000,materialSuelo)
    scene.add(suelo)
    //Robot
    let robot = crearRobot(materialRobot)
    scene.add(robot)
    /**
    // Esfera y cubo
    const esfera = new THREE.Mesh( new THREE.SphereGeometry(1,20,20), material );
    const cubo = new THREE.Mesh( new THREE.BoxGeometry(2,2,2), material );
    esfera.position.x = 1;
    cubo.position.x = -1;

    esferaCubo = new THREE.Object3D();
    esferaCubo.add(esfera);
    esferaCubo.add(cubo);
    esferaCubo.position.y = 1.5;

    scene.add(esferaCubo);

    scene.add( new THREE.AxesHelper(3) );
    cubo.add( new THREE.AxesHelper(1) );

    // Modelos importados
    const loader = new THREE.ObjectLoader();
    loader.load('models/soldado/soldado.json', 
    function (objeto)
    {
        cubo.add(objeto);
        objeto.position.y = 1;
    });

    const glloader = new GLTFLoader();
    glloader.load('models/RobotExpressive.glb',
    function(objeto)
    {
        esfera.add(objeto.scene);
        objeto.scene.scale.set(0.5,0.5,0.5);
        objeto.scene.position.y = 1;
        objeto.scene.rotation.y = -Math.PI/2;
        console.log("ROBOT");
        console.log(objeto);
    });
    -->
     */
}

function update()
{
    //angulo += 0.01;
    //esferaCubo.rotation.y = angulo;
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(scene,camera);
}

function crearSuelo(width, height, material)
{
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(width,height, width,height), material );
    suelo.rotation.x = -Math.PI/2;
    suelo.position.y = -0.2;
    return suelo
}

function crearRobot(material)
{
    let robot = new THREE.Object3D()
    let base = crearBase(material);

    const materialDebug = new THREE.MeshBasicMaterial({color:'green',wireframe:true});


    //Brazo
    let brazo = new THREE.Object3D()
    let rotulaGeometry = new THREE.CylinderBufferGeometry(20,20,18,20*2,18*2)
    const rotula = new THREE.Mesh(rotulaGeometry,material)
    rotula.rotation.z = Math.PI/2
    rotula.position.set(0,0,0)
    brazo.add(rotula)

    let esparragoGeometry = new THREE.BoxBufferGeometry(18,120,12)
    const esparrago = new THREE.Mesh(esparragoGeometry,material)
    esparrago.position.set(0,60,0)
    brazo.add(esparrago)


    let ejeGeometry = new THREE.SphereBufferGeometry(20,20,20)
    const eje = new THREE.Mesh(ejeGeometry,material)
    eje.position.set(0,120,0)
    brazo.add(eje)
    //Fin brazo

    //Antebrazo
    const antebrazo = new THREE.Object3D()

    let discoGeometry = new THREE.CylinderBufferGeometry(22,22,6,22*2,6*2)
    const disco = new THREE.Mesh(discoGeometry,material)
    disco.position.set(0,120,0)
    antebrazo.add(disco)

    let nervios = crearNervios(material)
    antebrazo.add(nervios)

    let rotorGeometry = new THREE.CylinderBufferGeometry(15,15,40,15*2,40*2)
    const rotor = new THREE.Mesh(rotorGeometry,material)
    rotor.rotation.y = Math.PI/2
    rotor.rotation.z = Math.PI/2
    rotor.position.set(0,200,0)

    antebrazo.add(rotor)

    let mano = new THREE.Object3D()

    let pinzaIzq = new THREE.Object3D()
    let paralelipedoGeometry = new THREE.BoxBufferGeometry(19,20,4,19*2,20*2,4*2)
    const paralelipedo = new THREE.Mesh(paralelipedoGeometry,material)
    paralelipedo.position.set(9,200,-10)



    const dedoIzqGeometry = new THREE.BufferGeometry()
    const position = new Float32Array(
        [
        3,5,19,     //0
        1,5,19,     //1
        1,15,19,    //2
        3,15,19,    //3
        4,20,0,     //4
        0,20,0,     //5
        0,0,0,      //6
        4,0,0])     //7
    
    const indices = [
        0,3,7, 7,3,4, 0,1,2,
        0,2,3, 4,3,2, 4,2,5,
        6,7,4, 6,4,5, 1,5,2,
        1,6,5, 7,6,1, 7,1,0
    ]
    dedoIzqGeometry.setIndex(indices)
    dedoIzqGeometry.setAttribute('position', new THREE.BufferAttribute(position,3))
    //dedoIzqGeometry.setAttribute('color', new THREE.BufferAttribute(color,3))
    const dedoIzq = new THREE.Mesh(dedoIzqGeometry,material)
    
    dedoIzq.rotation.y = Math.PI/2
    dedoIzq.position.set(18,190,-8)
    pinzaIzq.add(dedoIzq)
    pinzaIzq.add(paralelipedo)
    console.log('dedoIzq')

    console.log(pinzaIzq)
    /*
    console.log('Disco')

    console.log(disco)
    */
    let pinzaDerecha = pinzaIzq.clone()
    pinzaDerecha.translateZ(15)
    mano.add(pinzaIzq)
    mano.add(pinzaDerecha)
    //let mano = crearMano(material)
    //antebrazo.add(mano)
    antebrazo.add(mano)
    brazo.add(antebrazo)
    //Fin antebrazo

    console.log('dedoDer')

    console.log(pinzaDerecha)

    robot.add(base)
    robot.add(brazo)
    const axesHelper = new THREE.AxesHelper( 200 );
    scene.add( axesHelper );
    return robot
}
function crearBase(material)
{   
    
    let baseGeometry = new THREE.CylinderBufferGeometry(50,50,15,50*2,15*2)
    let base = new THREE.Mesh(baseGeometry,material)
    base.position.set(0,0,0)

    return base
}

function crearNervios(material) {

    let nervios = new THREE.Object3D()
    let nerviosGeometry = new THREE.BoxBufferGeometry(4,80,4)

    const nervio1 = new THREE.Mesh(nerviosGeometry,material)
    nervio1.position.set(6,160,-6)
    nervios.add(nervio1)

    let nerviosGeometry2 = new THREE.BoxBufferGeometry(4,80,4)
    const nervio2 = new THREE.Mesh(nerviosGeometry2,material)
    nervio2.position.set(-6,160,6)
    nervios.add(nervio2)

    const nervio3 = new THREE.Mesh(nerviosGeometry,material)
    nervio3.position.set(-6,160,-6)
    nervios.add(nervio3)

    const nervio4 = new THREE.Mesh(nerviosGeometry,material)
    nervio4.position.set(6,160,6)
    nervios.add(nervio4)


    return nervios
}