/**
 * Proyecto final de la asignatura GPC
 * Presentación del prototipo de ventilación pasiva "Caloret" desarrollado por el grupo de generación espontánea Azalea
 * @author Luis López Cuerva
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.module.js";
import {TWEEN} from "../lib/tween.module.min.js";
import {GUI} from "../lib/lil-gui.module.min.js";

//variables estandar
let renderer, scene, camera;

// Otras globales
let cameraControls;
let controlesGUI

//variables para animaciones y zooms, etc
let logo
let base, ladrillos, mampara, tapas, tubos

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
    renderer.antialias = true;
    renderer.shadowMap.enabled = true;
    
    logo = crearLogo()
    // Instanciar el nodo raiz de la escena
    scene = new THREE.Scene();

    crearLuces()
    // Instanciar la camara
    setupCamera();

    window.addEventListener('resize', updateAspectRatio);
}

function loadScene() {

    //Caloret
    crearCaloret()
    //azalea()
    
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.clear();
    renderer.render(scene, camera);
}

function update()
{
    TWEEN.update();

}

function crearLuces() {
    const ambiental = new THREE.AmbientLight(0x222222)
    scene.add(ambiental)

    const direccional = new THREE.DirectionalLight(0xFFFFFF,0.6);
    direccional.position.set(0,120,0);
    direccional.castShadow = true;
    scene.add(direccional);
    //scene.add(new THREE.CameraHelper(direccional.shadow.camera));

    const direccionalInf = new THREE.DirectionalLight(0xFFFFFF,0.35);
    direccionalInf.position.set(0,-120,-0);
    direccionalInf.castShadow = true;
    scene.add(direccionalInf);
    //scene.add(new THREE.CameraHelper(direccionalInf.shadow.camera));

    const focalFrontal = new THREE.SpotLight(0xFFFFFF,0.8);
    focalFrontal.position.set(-300,50,200);
    focalFrontal.target.position.set(0,0,0);
    focalFrontal.angle= Math.PI/2;
    focalFrontal.penumbra = 0.1;
    focalFrontal.castShadow= true
    focalFrontal.shadow.camera.far = 800;
    focalFrontal.shadow.camera.fov = 200;
    scene.add(focalFrontal);
    //scene.add(new THREE.CameraHelper(focalFrontal.shadow.camera));

    const focalTrasera = new THREE.SpotLight(0xFFFFFF,0.4);
    focalTrasera.position.set(300,50,-200);
    focalTrasera.target.position.set(0,0,0);
    focalTrasera.angle= Math.PI/2;
    focalTrasera.penumbra = 0.1;
    focalTrasera.castShadow= true
    focalTrasera.shadow.camera.far = 800;
    focalTrasera.shadow.camera.fov = 200;
    scene.add(focalTrasera);
    scene.add(new THREE.CameraHelper(focalTrasera.shadow.camera));

}

function setupGui()
{
    const gui = new GUI()
    controlesGUI = {
        azalea: function() {azalea()},
        aperturaFigura: 0.0,
        foto: false,
        video: false,
    }

    //Construccion menu
    const h = gui.addFolder("Audivisuales")
    h.add(controlesGUI, "foto").name("Ver Caloret real").listen().onChange(foto)
    h.add(controlesGUI, "video").name("¿Qué es Azalea?").listen().onChange(video)

    const g = gui.addFolder("Control presentación")
    g.add(controlesGUI, "aperturaFigura", 0, 100.0, 0.5).name("Separar piezas").listen().onChange(aperturaFigura)
    g.add(controlesGUI, "azalea").name("Azalea").listen().onChange(azalea)
}

function crearCaloret() {
    const path = "./textures/"

    const texBase = new THREE.TextureLoader().load(path+"osb.jpg");
    let materialBase = new THREE.MeshLambertMaterial({color:'white',map:texBase});

    const texJuntas = new THREE.TextureLoader().load(path+"juntas.jpeg");
    let materialJuntas = new THREE.MeshLambertMaterial({color:'white',map:texJuntas});


    const texCristal = new THREE.TextureLoader().load(path+"glass.jpg");
    let materialCristal = new THREE.MeshPhongMaterial({ 
        color:'white',
        specular:'gray',
        //shininess: 30,
        map: texCristal,
        opacity: 0.65,
        transparent: true,
          });
    
    const texTubos = new THREE.TextureLoader().load(path+"tube.jpg");
    let materialTubos = new THREE.MeshPhongMaterial({ 
        color:'white',
        specular:'gray',
        shininess: 30,
        map: texTubos,
        });


    const texPCM = new THREE.TextureLoader().load(path+"pcm.jpg");
    let materialPCM = new THREE.MeshPhongMaterial({ 
        //color:'white',
        specular:'gray',
        shininess: 30,
        map: texPCM,
        });
    
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

    maderaInf.castShadow=true
    //maderaInf.receiveShadow=true

    base.add(maderaInf)

    let maderaTrasera = maderaInf.clone(maderaInf)
    maderaTrasera.translateY(25)
    maderaTrasera.translateZ(-25)
    maderaTrasera.rotateX(Math.PI/2)

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
    junta1.castShadow=true
    junta1.receiveShadow=true

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

    tapa1.castShadow=true
    tapa1.receiveShadow=true
    
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

    tubo1.castShadow=true
    tubo1.receiveShadow=true

    
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

    ladrillo1.castShadow=true
    ladrillo1.receiveShadow=true


    let ladrillo2 = ladrillo1.clone()
    ladrillo2.translateX(50)
    ladrillosBajo.add(ladrillo2)

    ladrillosGeometry = new THREE.BoxGeometry(25,6,40)
    let ladrillo3 = new THREE.Mesh(ladrillosGeometry, material)
    //ladrillo2.translateX(50)
    ladrillo3.translateZ(4)
    ladrillo3.translateY(10)
    ladrillo3.translateX(-87)

    ladrillo3.castShadow=true
    ladrillo3.receiveShadow=true


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
    

    ladrillo9.castShadow=true
    ladrillo9.receiveShadow=true


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

    ladrillo1.castShadow=true
    ladrillo1.receiveShadow=true


    let ladrillo2 = ladrillo1.clone()
    ladrillo2.translateX(50)
    ladrillosAlto.add(ladrillo2)

    ladrillosGeometry = new THREE.BoxGeometry(25,6,35)
    let ladrillo3 = new THREE.Mesh(ladrillosGeometry, material)
    //ladrillo2.translateX(50)
    ladrillo3.translateZ(4)
    ladrillo3.translateY(10)
    ladrillo3.translateX(-87)

    ladrillo3.castShadow=true
    ladrillo3.receiveShadow=true


    ladrillosAlto.add(ladrillo3)

    let ladrillo4 = ladrillo1.clone()
    ladrillo4.translateX(135)
    ladrillosAlto.add(ladrillo4)

    let ladrillo5 = ladrillo4.clone()
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


    ladrillo9.castShadow=true
    ladrillo9.receiveShadow=true


    ladrillosAlto.add(ladrillo9)

    ladrillosAlto.translateZ(-23)
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
    logo.visible = true
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(130, 350, 100);

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

function foto() 
{
    if (controlesGUI.foto == true) {
    controlesGUI.video = false
    video()
    const direccionalInf = new THREE.DirectionalLight(0xFFFFFF,0.6);
    direccionalInf.position.set(2000,2001,2500);
    direccionalInf.castShadow = true;
    scene.add(direccionalInf);

    const texFoto = new THREE.TextureLoader().load("./textures/Caloret.png");
    let materialFoto = new THREE.MeshLambertMaterial({color:'white',map:texFoto});

    const geometry = new THREE.PlaneGeometry( 500, 200 );
    const plane = new THREE.Mesh( geometry, materialFoto );

    plane.position.x = 2000
    plane.position.y = 2001
    plane.position.z = 2000
    camera.position.set(2000, 2001, 2500 );

    camera.lookAt(2000,2001,2000)
    cameraControls.enabled = false  
    scene.add( plane );

    }

    else {
        setupCamera()
    }

    
}

function video() 
{
    if (controlesGUI.video == true) {
    controlesGUI.foto = false
    foto()

    let video = document.createElement('video');
    video.src = "./textures/AV2.mp4";
    video.load();
    video.muted = true;
    video.play();
    const texvideo = new THREE.VideoTexture(video);

    let materialFoto = new THREE.MeshBasicMaterial({color:'white',map:texvideo});
    const geometry = new THREE.PlaneGeometry( 500, 200 );
    const plane = new THREE.Mesh( geometry, materialFoto );

    plane.position.x = 4000
    plane.position.y = 4001
    plane.position.z = 4000
    camera.position.set(4000, 4001, 4500 );

    camera.lookAt(4000,4001,4000)
    //cameraControls.enabled = false  
    scene.add( plane );

    }

    else {
        setupCamera()
    }

    
}


function azalea() {
    console.log('Azalea')
    cameraControls.enabled = false  
    
    logo.visible = true
    scene.add(logo)
    logo.position.set(4600,5150,4800)
    
    camera.position.set(5000, 5100, 5600);

    camera.lookAt(5000,5000,5000)




    animacion(logo)
    //logo.visible = false
    
      
}

function aperturaFigura() {
    base.position.y = 0 - controlesGUI.aperturaFigura
    mampara.position.y = 30 + controlesGUI.aperturaFigura/2
    mampara.position.z = 28 + controlesGUI.aperturaFigura
    //tapas.position.z = 200 + controlesGUI.aperturaFigura
    tubos.position.y = 15 - controlesGUI.aperturaFigura
    ladrillos.position.y = 4 + controlesGUI.aperturaFigura
}

function crearLogo() {
    console.log('Creando logo')
    let material = new THREE.MeshBasicMaterial({ color: 0X049ef4, wireframe: false, flatshading: false });

    let logolocal = new THREE.Object3D()    
    
    let barraInfGeometry = new THREE.BoxBufferGeometry(70,10,10)
    let barraInf = new THREE.Mesh(barraInfGeometry, material)
    logolocal.add(barraInf)


    let barraVertGeometry = new THREE.BoxBufferGeometry(10,10,130)
    let barratVert = new THREE.Mesh(barraVertGeometry, material)
    barratVert.translateX(30)
    barratVert.translateY(60)
    barratVert.rotateX(Math.PI/2)
    logolocal.add(barratVert)

    let barraDerGeometry = new THREE.BoxBufferGeometry(10,10,40)
    let barratDer = new THREE.Mesh(barraDerGeometry, material)
    barratDer.translateX(45)
    barratDer.translateY(55)
    barratDer.rotateY(Math.PI/2)
    barratDer.rotateX(-Math.PI/5)
    logolocal.add(barratDer)

    let barraIzqGeometry = new THREE.BoxBufferGeometry(10,10,40)
    let barratIzq = new THREE.Mesh(barraIzqGeometry, material)
    barratIzq.translateX(15)
    barratIzq.translateY(80)
    barratIzq.rotateY(-Math.PI/2)
    barratIzq.rotateX(-Math.PI/5)
    logolocal.add(barratIzq)
    
    logolocal.position.set(0,0,0)

    return logolocal
}
function animacion(logo) {

    const tween1 = new TWEEN.Tween( logo.position ).
    to( {x:[5200],y:[5150],z:[5100]}, 5000).
    interpolation( TWEEN.Interpolation.Linear ).
    easing( TWEEN.Easing.Exponential.InOut )

    const tween2 = new TWEEN.Tween( logo.position ).
    to( {x:[4300],y:[4450],z:[4700]}, 5000).
    interpolation( TWEEN.Interpolation.Linear ).
    easing( TWEEN.Easing.Exponential.InOut )

    const tween3 = new TWEEN.Tween( logo.position ).
    to( {x:[5200],y:[4850],z:[5200]}, 5000).
    interpolation( TWEEN.Interpolation.Linear ).
    easing( TWEEN.Easing.Exponential.InOut )

    const tween4 = new TWEEN.Tween( logo.position ).
    to( {x:[5000],y:[5000],z:[4600]}, 5000).
    interpolation( TWEEN.Interpolation.Linear ).
    easing( TWEEN.Easing.Exponential.InOut )

    const tween5 = new TWEEN.Tween( logo.position ).
    to( {x:[5000],y:[5000],z:[5300]}, 5000).
    interpolation( TWEEN.Interpolation.Linear ).
    easing( TWEEN.Easing.Exponential.InOut )

    const tween6 = new TWEEN.Tween( logo.position ).
    to( {x:[5000],y:[5000],z:[5300]}, 2500).
    interpolation( TWEEN.Interpolation.Linear ).
    easing( TWEEN.Easing.Exponential.InOut ).onComplete(setupCamera)

    tween1.chain(tween2);
    tween2.chain(tween3);
    tween3.chain(tween4);
    tween4.chain(tween5);
    tween5.chain(tween6);

    tween1.start();
    console.log('Fin ANima')
    
}
