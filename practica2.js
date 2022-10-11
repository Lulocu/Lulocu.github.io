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
import { GLTFLoader } from "../lib/GLTFLoader.module.js";

// Variables estandar
let renderer, scene, camera;

// Otras globales
let esferaCubo;
let angulo = 0;
let materialRobot
// Acciones
init();
loadScene();
render();

function init() {
    // Instanciar el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // Instanciar el nodo raiz de la escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);

    // Instanciar la camara
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    //camera.position.set(130, 350, 100);
    //camera.lookAt(0, 100, 0);
    camera.position.set(50, 75, 50);
    camera.lookAt(0, 0, 0);
}

function loadScene() {
    // Material sencillo
    const materialSuelo = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });
    materialRobot = new THREE.MeshBasicMaterial({ color: 'brown', opacity: 1.0, wireframe: false });

    // Suelo
    let suelo = crearSuelo(1000, 1000, materialSuelo)
    //scene.add(suelo)
    //Robot
    let robot = crearRobot(materialRobot)
    //scene.add(robot)
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

function update() {
    //angulo += 0.01;
    //esferaCubo.rotation.y = angulo;
}

function render() {
    requestAnimationFrame(render);
    update();
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

    const materialDebug = new THREE.MeshBasicMaterial({ color: 'green', wireframe: true });


    //Brazo
    let brazo = new THREE.Object3D()
    let rotulaGeometry = new THREE.CylinderBufferGeometry(20, 20, 18, 20 * 2, 18 * 2)
    const rotula = new THREE.Mesh(rotulaGeometry, material)
    rotula.rotation.z = Math.PI / 2
    rotula.position.set(0, 0, 0)
    brazo.add(rotula)

    let esparragoGeometry = new THREE.BoxBufferGeometry(18, 120, 12)
    const esparrago = new THREE.Mesh(esparragoGeometry, material)
    esparrago.position.set(0, 60, 0)
    brazo.add(esparrago)


    let ejeGeometry = new THREE.SphereBufferGeometry(20, 20, 20)
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



    const dedoIzqGeometry = new THREE.BufferGeometry()
    const position = new Float32Array(
        [

            1, 15, 19, 0, 20, 0, 4, 20, 0, 3, 15, 19, // 2 5 4 3 //TOP
            3, 5, 19, 4, 0, 0, 4, 20, 0, 3, 15, 19, // 0 7 4 3 //FRONT
            1, 5, 19, 0, 0, 0, 0, 20, 0, 1, 15, 19,//1 6 5 2BACK
            1, 5, 19, 0, 0, 0, 4, 0, 0, 3, 5, 19,  // 1 6 7 0 BOT
            1, 5, 19, 1, 15, 19, 3, 15, 19, 3, 5, 19,//1 2 3 0 LEFT
            0, 0, 0, 0, 20, 0, 4, 20, 0, 4, 0, 0,//6 5 4 7 RIGHT
        ])/*

            3, 5, 19,     //0 1 2 3 top
            1, 5, 19,     //1
            1, 15, 19,    //2
            3, 15, 19,    //3
            4, 20, 0,     //4
            0, 20, 0,     //5
            0, 0, 0,      //6
            4, 0, 0])     //7 */
    /*const indices = [ // 6caras x 2triangulos x3vertices = 36
        1,6,5,    5,2,1,    // Front
        0,1,3,    1,3,2,    // DER 
        2,5,3,    4,3,5,  // TOP
        6,7,4,    6,4,5, // IZQ
        0,7,4,    4,3,0, // back
        1,6,0,    7,0,6  // BOT
            ];*/
    const indices = [
        1, 0, 2, 1, 2, 3, //top
        5, 4, 7, 5, 7, 6, //front
        8, 11, 9, 8, 9, 10, //left
        12, 13, 14, 12, 14, 15, //right
        16, 17, 18, 16, 18, 19, //back
        20, 21, 22, 20, 22, 23 //bottom
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
    console.log("Normal")
    console.log(normal)
    console.log(new THREE.Float32BufferAttribute(normal, 3))
    dedoIzqGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
    dedoIzqGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normal, 3))
    dedoIzqGeometry.setIndex(indices)


    const pion = new THREE.MeshNormalMaterial({ wireframe: true, flatshading: false });
    const dedoIzq = new THREE.Mesh(dedoIzqGeometry, pion)


    dedoIzq.rotation.y = Math.PI / 2
    //dedoIzq.position.set(18, 190, -8)
    //dedoIzq.position.set(0, 0, 0)
    pinzaIzq.add(dedoIzq)
    pinzaIzq.add(paralelipedo)
    console.log('dedoIzq')
    //pinzaIzq.position.set(0, 0, 0)
    console.log(dedoIzq)
    //dedoIzqGeometry.computeVertexNormals()
    scene.add(dedoIzq)


    /*
    console.log('Disco')

    console.log(disco)
    */
    //let pinzaDerecha = pinzaIzq.clone()
    //pinzaDerecha.translateZ(15)
    mano.add(pinzaIzq)
    //mano.add(pinzaDerecha)
    //let mano = crearMano(material)
    //antebrazo.add(mano)
    antebrazo.add(mano)
    brazo.add(antebrazo)
    //Fin antebrazo

    console.log('paralelipedo')

    console.log(paralelipedo)

    robot.add(base)
    robot.add(brazo)
    const axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);
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
    let nerviosGeometry = new THREE.BoxBufferGeometry(4, 80, 4)

    const nervio1 = new THREE.Mesh(nerviosGeometry, material)
    nervio1.position.set(6, 160, -6)
    nervios.add(nervio1)

    let nerviosGeometry2 = new THREE.BoxBufferGeometry(4, 80, 4)
    const nervio2 = new THREE.Mesh(nerviosGeometry2, material)
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
    let tangent = new THREE.Vector3().subVectors(vecino1, position)
    let bitangent = new THREE.Vector3().subVectors(vecino2, position)
    let normal = new THREE.Vector3().crossVectors(tangent, bitangent).normalize()
    //normal = new THREE.Vector3(normalize(cross(tangent, bitangent)))
    /*
    let angles = new

        // the starting point will be the 'base' and the two adjacent points will be normalized against it
        a1 = (p2 - p1).Angle(p3 - p1);    // p1 is the 'base' here
        a2 = (p3 - p2).Angle(p1 - p2);    // p2 is the 'base' here
        a3 = (p1 - p3).Angle(p2 - p3);    // p3 is the 'base' here
*/
    return normal //.multiply(new THREE.Vector3(-1,-1,-1))
}