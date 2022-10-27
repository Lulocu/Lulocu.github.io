/**
 * 
 * 
 * Practica4 GPC 
 * 
 * 
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.module.js";
import {TWEEN} from "../lib/tween.module.min.js";
import {GUI} from "../lib/lil-gui.module.min.js";

// Variables estandar
let renderer, scene, camera;

// Otras globales
let cameraControls;
let cenital
let L = 50
let materialRobot
let controles
// Variables robot

let robot, brazo, antebrazo, mano, nervio1,nervio2,nervio3,nervio4,pinzaIzq,pinzaDerecha,dedoIzq,base,paralelipedo,rotula,esparrago,eje,disco,rotor,paralelipedoDer,dedoDer
// Acciones
init();
loadScene();
render();
setupGui()
function init() {
    // Instanciar el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    renderer.setClearColor(0xAAAAAA);
    renderer.autoClear = false;

    //Activar antialising
    renderer.antialias = true
    renderer.shadowMap.enabled = true
    //Activarsombras




    // Instanciar el nodo raiz de la escena
    scene = new THREE.Scene();

    //Crear luces

    //Ambiental
    let luzAmbiental = new THREE.AmbientLight('yellow')
    //luzAmbiental.castShadow = true
    scene.add(luzAmbiental)
    //Direccional
    let luzDireccional = new THREE.DirectionalLight(0XFFFFFF,0.75)
    luzDireccional.position.set(200,300,100)
    luzDireccional.castShadow = true
    scene.add(luzDireccional)
    //scene.add(new THREE.CameraHelper(luzDireccional.shadow.camera));
    //Focal

    const focal = new THREE.SpotLight(0xFFFFFF,0.75);
    focal.position.set(400,300,50)
    focal.target.position.set(0,0,0);
    focal.angle= Math.PI/7;
    focal.penumbra = 0.3;
    focal.castShadow= true;
    focal.shadow.camera.far = 2000;
    focal.shadow.camera.fov = 80;
    scene.add(focal);
    //scene.add(new THREE.CameraHelper(focal.shadow.camera));


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
    let sueloTx = new THREE.TextureLoader().load('./images/pisometalico_1024.jpg')
    console.log(sueloTx)
    sueloTx.repeat.set(10,10)    
    sueloTx.wrapS = sueloTx.wrapT = THREE.RepeatWrapping;
    sueloTx.magFilter = THREE.LinearFilter
    sueloTx.minFilter = THREE.LinearFilter

    const materialSuelo = new THREE.MeshStandardMaterial({ color: 0XFFFFFF, map:sueloTx });


    // Suelo
    let suelo = crearSuelo(1000, 1000, materialSuelo)

    scene.add(suelo)

    //Paredes:  Lambert + texttura superposicion
    let path = "./images/"

    const paredes = []

    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
        map: new THREE.TextureLoader().load(path+"posx.jpg")}) );
paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
        map: new THREE.TextureLoader().load(path+"negx.jpg")}) );
paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
        map: new THREE.TextureLoader().load(path+"posy.jpg")}) );
paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
        map: new THREE.TextureLoader().load(path+"negy.jpg")}) );
paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
        map: new THREE.TextureLoader().load(path+"posz.jpg")}) );
paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
        map: new THREE.TextureLoader().load(path+"negz.jpg")}) );

    const habGeometry = new THREE.BoxGeometry(700,700,700)
    const hab = new THREE.Mesh(habGeometry,paredes)
    hab.receiveShadow = true
    scene.add(hab)


    //Robot

    const texArriba = new THREE.TextureLoader().load(path+"dorada.jpg");
    const texAbajo = new THREE.TextureLoader().load(path+"metal.png");
    const rot = [ path+"posx.jpg", path+"negx.jpg",
                      path+"posy.jpg", path+"negy.jpg",
                      path+"posz.jpg", path+"negz.jpg"];
    const texRot = new THREE.CubeTextureLoader().load(rot);

    const materialArriba = new THREE.MeshLambertMaterial({color:'white',map:texArriba});
    const materialAbajo = new THREE.MeshLambertMaterial({color:'white',map:texAbajo});
    const materialRotula = new THREE.MeshPhongMaterial({color:'white',
            specular:'gray',
            shininess: 30,
            envMap: texRot });
    crearRobot(materialArriba,materialAbajo,materialRotula)
    
}

function update()
{
    TWEEN.update();

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
    suelo.receiveShadow = true
    return suelo
}

function crearRobot(materialArriba, materialAbajo, materialRotula) {
    robot = new THREE.Object3D()
    scene.add(robot)

    let baseGeometry = new THREE.CylinderBufferGeometry(50, 50, 15)//, 50 * 2, 15 * 2)
    base = new THREE.Mesh(baseGeometry, materialAbajo)
    base.position.set(0, 0, 0)
    base.castShadow = true
    base.receiveShadow = true
    robot.add(base)

    //Brazo
    brazo = new THREE.Object3D()
    base.add(brazo)
    let rotulaGeometry = new THREE.CylinderBufferGeometry(20, 20, 18)//, 20 * 2, 18 * 2)
    rotula = new THREE.Mesh(rotulaGeometry, materialAbajo) ///Este es mapa de entorno
    rotula.rotation.z = Math.PI / 2
    rotula.position.set(0, 0, 0)
    rotula.castShadow = true
    rotula.receiveShadow = true
    brazo.add(rotula)

    let esparragoGeometry = new THREE.BoxBufferGeometry(18, 120, 12)//, 18 * 2, 120 * 2, 12 * 2)
    esparrago = new THREE.Mesh(esparragoGeometry, materialAbajo)
    esparrago.position.set(0, 60, 0)
    esparrago.castShadow = true
    esparrago.receiveShadow = true
    brazo.add(esparrago)


    let ejeGeometry = new THREE.SphereBufferGeometry(20)//, 20 * 2, 20 * 2)
    eje = new THREE.Mesh(ejeGeometry, materialRotula)
    eje.position.set(0, 120, 0)
    eje.castShadow = true
    eje.receiveShadow = true
    brazo.add(eje)
    //Fin brazo

    //Antebrazo
    antebrazo = new THREE.Object3D()
    
    eje.add(antebrazo)


    let discoGeometry = new THREE.CylinderBufferGeometry(22, 22, 6)//, 22 * 2, 6 * 2)
    disco = new THREE.Mesh(discoGeometry, materialArriba)
    //disco.position.set(0, 120, 0)
    disco.castShadow = true
    disco.receiveShadow = true
    antebrazo.add(disco)

    let nervios = crearNervios(materialArriba)
    antebrazo.add(nervios)

    mano = new THREE.Object3D()
    antebrazo.add(mano)

    let rotorGeometry = new THREE.CylinderBufferGeometry(15, 15, 40)//, 15 * 2, 40 * 2)
    rotor = new THREE.Mesh(rotorGeometry, materialArriba)
    rotor.rotation.y = Math.PI / 2
    rotor.rotation.z = Math.PI / 2
    rotor.castShadow = true
    rotor.receiveShadow = true
    mano.position.set(0, 80, 0)
    mano.add(rotor)

    pinzaIzq = new THREE.Object3D()
    let paralelipedoGeometry = new THREE.BoxBufferGeometry(19, 20, 4)//, 19 * 2, 20 * 2, 4 * 2)
    paralelipedo = new THREE.Mesh(paralelipedoGeometry, materialArriba)
    paralelipedo.castShadow = true
    paralelipedo.receiveShadow = true
    pinzaIzq.add(paralelipedo)
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
        2,0,1,3,2,1, //bot
        4,5,7, 7,5,6, //izq //BIEN
        9,11,8,9,8,10,//enfrente //izq el de arriba //o
        13,12,14,15,14,12, //atras 14,13,12,15,14,12, //o
        18,17,16,19,18,16, //back //invisible
        22,21,20,23,22,20//arriba
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

    dedoIzq = new THREE.Mesh(dedoIzqGeometry, materialArriba)
    dedoIzq.castShadow = true
    dedoIzq.receiveShadow = true
    dedoIzq.rotation.y = Math.PI / 2
    dedoIzq.position.set(9, -10, 2)
    pinzaIzq.add(dedoIzq)
    pinzaIzq.rotateX(Math.PI / 2)
    pinzaIzq.rotateZ(Math.PI / 2)
    pinzaIzq.position.set(0, 10, 15)


    dedoDer = dedoIzq.clone()
    paralelipedoDer =paralelipedo.clone()
    pinzaDerecha= new THREE.Object3D()
    pinzaDerecha.add(dedoDer)
    pinzaDerecha.add(paralelipedoDer)


    pinzaDerecha.rotateX(Math.PI / 2)
    pinzaDerecha.rotateZ(Math.PI / 2)
    pinzaDerecha.position.set(0, 10, 15)


    pinzaDerecha.translateZ(20)
    rotor.add(pinzaIzq)
    rotor.add(pinzaDerecha)
    
    //rotor.rotateX(Math.PI / 2)


    //Fin antebrazo
    const axesHelper = new THREE.AxesHelper(200);
    scene.add(axesHelper);
    teclado()
    //Prueba
    
}

function teclado() {
    var keyboard = new THREEx.KeyboardState(renderer.domElement);
    renderer.domElement.setAttribute("tabIndex", "0");
    renderer.domElement.focus();

    keyboard.domElement.addEventListener('keydown', function (event) {
        if (keyboard.eventMatches(event, 'left')) {
            robot.position.x -= 4;
        }
        if (keyboard.eventMatches(event, 'right')) {
            robot.position.x += 4;
        }
        if (keyboard.eventMatches(event, 'up')) {
            robot.position.z -= 4;
        }
        if (keyboard.eventMatches(event, 'down')) {
            robot.position.z += 4;
        }
    })
}

function crearNervios(material) {

    let nervios = new THREE.Object3D()
    let nerviosGeometry = new THREE.BoxBufferGeometry(4, 80, 4)//, 4 * 2, 80 * 2, 4 * 2)

    nervio1 = new THREE.Mesh(nerviosGeometry, material)
    nervio1.position.set(6, 40, -6)
    nervio1.castShadow = true
    nervio1.receiveShadow = true
    nervios.add(nervio1)

    //let nerviosGeometry2 = new THREE.BoxBufferGeometry(4,80,4)
    nervio2 = new THREE.Mesh(nerviosGeometry, material)
    nervio2.position.set(-6, 40, 6)
    nervios.add(nervio2)

    nervio3 = new THREE.Mesh(nerviosGeometry, material)
    nervio3.position.set(-6, 40, -6)
    nervios.add(nervio3)

    nervio4 = new THREE.Mesh(nerviosGeometry, material)
    nervio4.position.set(6, 40, 6)
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

function setupGui()
{
    const gui = new GUI()
    controles = {
        giroBaseY: 0.0,
        giroBrazoZ: 0.0,
        giroAntebrazoY: 0.0,
        giroAntebrazoZ: 0.0,
        giroPinzaZ: 0.0,
        giroAperturaPinzaZ: 15.0,
        alambre: false,
        animacion: function() {animacion()},
    }

    //Construccion menu
    const h = gui.addFolder("Control Robot")
    h.add(controles, "giroBaseY", -180.0, 180.0, 0.025).name("Giro Base").listen().onChange(giroBaseY)
    h.add(controles, "giroBrazoZ", -45.0, 45.0, 0.025).name("Giro Brazo").listen().onChange(giroBrazoZ)
    h.add(controles, "giroAntebrazoY", -180.0, 180.0, 0.025).name("Giro Antebrazo Y").listen().onChange(giroAntebrazoY)
    h.add(controles, "giroAntebrazoZ", -90.0, 90.0, 0.025).name("Giro Antebrazo Z").listen().onChange(giroAntebrazoZ)
    h.add(controles, "giroPinzaZ", -40.0, 220.0, 0.025).name("Giro Pinza").listen().onChange(giroPinzaZ)
    h.add(controles, "giroAperturaPinzaZ", 0.0, 15.0, 0.025).name("Apertura Pinza").listen().onChange(giroAperturaPinzaZ)
    h.add(controles, "alambre").name("Alambres").listen().onChange(alambre)
    h.add(controles, "animacion").name("Anima").listen().onChange(animacion)
}

function giroBaseY() {
    base.rotation.y = (controles.giroBaseY * Math.PI)/180
}
function giroBrazoZ() {
    brazo.rotation.z = (controles.giroBrazoZ * Math.PI)/180
}
function giroAntebrazoY() {
    antebrazo.rotation.y = (controles.giroAntebrazoY * Math.PI)/180
}
function giroAntebrazoZ() {
    antebrazo.rotation.z = (controles.giroAntebrazoZ * Math.PI)/180
    //antebrazo.rotateX(controles.giroAntebrazoZ * Math.PI)
}
function giroPinzaZ() {
    mano.rotation.z = (controles.giroPinzaZ * Math.PI)/180
}
function giroAperturaPinzaZ() {
    //pinzaIzq.position.y = (controles.giroAperturaPinzaZ * Math.PI)/180
    pinzaIzq.position.y = 0 + controles.giroAperturaPinzaZ
    pinzaDerecha.position.y = 0 -controles.giroAperturaPinzaZ
}
function alambre() {
    console.log('AAAA')
    materialRobot = new THREE.MeshNormalMaterial({ wireframe: controles.alambre, flatshading: !controles.alambre });
    //let mate = new THREE.MeshBasicMaterial({ color: 'brown', opacity: 1.0, wireframe: true });
    nervio1.material=materialRobot
    nervio2.material=materialRobot
    nervio3.material=materialRobot
    nervio4.material=materialRobot
    base.material=materialRobot
    paralelipedo.material=materialRobot
    rotula.material=materialRobot
    esparrago.material=materialRobot
    dedoIzq.material=materialRobot
    eje.material=materialRobot
    disco.material=materialRobot
    rotor.material=materialRobot
    pinzaIzq.material=materialRobot
    paralelipedoDer.material=materialRobot
    dedoDer.material=materialRobot
}
function animacion() {
    console.log('Animando')

    const tween1 = new TWEEN.Tween( antebrazo.rotation ).
    to( {x:[Math.PI],y:[0],z:[Math.PI/2]}, 1000 ).
    interpolation( TWEEN.Interpolation.Linear ).
    easing( TWEEN.Easing.Exponential.InOut )

    const tween2 = new TWEEN.Tween( robot.translate ).
    to( {x:[10],y:[0],z:[10]}, 1000 ).
    interpolation( TWEEN.Interpolation.Bezier ).
    easing( TWEEN.Easing.Back.Out )

    const tween3 = new TWEEN.Tween( robot.translate ).
    to( {x:[20],y:[0],z:[20]}, 1000 ).
    interpolation( TWEEN.Interpolation.Bezier ).
    easing( TWEEN.Easing.Elastic.InOut)

    const tween4 = new TWEEN.Tween( brazo.rotation ).
    to( {x:[15*Math.PI],y:[0],z:[Math.PI/2]}, 1000 ).
    interpolation( TWEEN.Interpolation.Bezier ).
    easing( TWEEN.Easing.Bounce.InOut )

    const tween5 = new TWEEN.Tween( base.rotation ).
    to( {x:[Math.PI],y:[0],z:[2*Math.PI/2]}, 1000 ).
    interpolation( TWEEN.Interpolation.Linear ).
    easing( TWEEN.Easing.Circular.InOut )

    const tween6 = new TWEEN.Tween( mano.rotation ).
    to( {x:[9*Math.PI],y:[0],z:[Math.PI/2]}, 1000 ).
    interpolation( TWEEN.Interpolation.Linear ).
    easing( TWEEN.Easing.Back.InOut )

    const tween7 = new TWEEN.Tween( robot.translate ).
    to( {x:[Math.PI],y:[0],z:[0]}, 1000 ).
    interpolation( TWEEN.Interpolation.Linear ).
    easing( TWEEN.Easing.Exponential.InOut )

    const tween8 = new TWEEN.Tween( antebrazo.rotation ).
    to( {x:[0],y:[0],z:[0]}, 1000 ).
    interpolation( TWEEN.Interpolation.CatmullRom ).
    easing( TWEEN.Easing.Exponential.InOut )

    const tween9 = new TWEEN.Tween( brazo.rotation ).
    to( {x:[0],y:[0],z:[0]}, 1000 ).
    interpolation( TWEEN.Interpolation.Linear ).
    easing( TWEEN.Easing.Exponential.InOut )

    const tween10 = new TWEEN.Tween( mano.rotation ).
    to( {x:[0],y:[0],z:[0]}, 1000 ).
    interpolation( TWEEN.Interpolation.CatmullRom ).
    easing( TWEEN.Easing.Exponential.InOut )

    const tween11 = new TWEEN.Tween( base.rotation ).
    to( {x:[0],y:[0],z:[0]}, 1000 ).
    interpolation( TWEEN.Interpolation.CatmullRom ).
    easing( TWEEN.Easing.Exponential.InOut )


    tween1.chain(tween2);
    tween2.chain(tween3);
    tween3.chain(tween4);
    tween4.chain(tween5);
    tween5.chain(tween6);
    tween6.chain(tween7);
    tween7.chain(tween8);
    tween8.chain(tween9);
    tween9.chain(tween10);
    tween10.chain(tween11);


    tween1.start();
    console.log('Fin ANima')

}
