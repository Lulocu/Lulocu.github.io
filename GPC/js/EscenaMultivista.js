/**
 * EscenaMultivista.js
 * 
 * Seminario GPC#3. Construir una escena con varias vistas
 * 
 * 
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";
import {OrbitControls}from "../lib/OrbitControls.module.js"


// Variables estandar
let renderer, scene, camera;


//camaras adiciones
let planta, alzado, perfil
const L = 5 //lado de la cámara
// Otras globales
let esferaCubo;
let angulo = 0;
let cameraControls;
// Acciones
init();
loadScene();
render();

function setCameras(ar) {
    let cameraOrtografica

    if (ar > 1) {
        cameraOrtografica = new THREE.OrthographicCamera(-L*ar,L*ar,L,-L,-10,100)

    } else {
        cameraOrtografica = new THREE.OrthographicCamera(-L,L,L/ar,-L/ar,-10,100)

    }
    alzado = cameraOrtografica.clone()
    alzado.position.set(0,0,L)
    alzado.lookAt(0,0,0)

    planta = cameraOrtografica.clone()
    planta.position.set(0,L,0)
    planta.lookAt(0,0,0)
    planta.update = new THREE.Vector3(0,0,-1)

    perfil = cameraOrtografica.clone()
    perfil.position.set(L,0,0)
    perfil.lookAt(0,0,0)
}
function init()
{
    // Instanciar el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.getElementById('container').appendChild( renderer.domElement );
    renderer.autoClear = false
    renderer.setClearColor(new THREE.Color(0.5,0.5,0.5))

    // Instanciar el nodo raiz de la escena
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0.5,0.5,0.5);

    // Instanciar la camara
    camera= new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,100);
    camera.position.set(0.5,2,7);
    const ar = window.innerWidth/window.innerHeight
    setCameras(ar) //ar = aspect ratio
    //const ar = window.innerWidth/window.innerHeight
    //camera = new THREE.OrthographicCamera(-2*ar,2*ar,2,-2,1,100)
    //camera.position.set(0.5,2,7)



    camera.lookAt(0,1,0);

    cameraControls = new OrbitControls(camera,renderer.domElement)
    cameraControls.target.set(0,1,0)
    //captura de eventos
    window.addEventListener('resize',updateAspectRatio)
}

function loadScene()
{
    // Material sencillo
    const material = new THREE.MeshBasicMaterial({color:'yellow',wireframe:true});

    // Suelo
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(10,10, 10,10), material );
    suelo.rotation.x = -Math.PI/2;
    suelo.position.y = -0.2;
    scene.add(suelo);

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


}


function updateAspectRatio() {
    //fijar tamaño del marco
    renderer.setSize(window.innerWidth,window.innerHeight)

    const ar = window.innerWidth/innerHeight
    //actualizar la vista de la camara perspectiva

    camera.aspect = ar
    camera.updateProjectionMatrix()

    //actualizar la vista de las camaras ortograficas

    if (ar > 1) {
        alzado.left = planta.left = perfil.left = -L*ar
        alzado.rigth = planta.rigth = perfil.rigth = L*ar
        alzado.top = planta.top = perfil.top = L
        alzado.bottom = planta.bottom = perfil.bottom = -L

    } else {
        alzado.left = planta.left = perfil.left = -L
        alzado.rigth = planta.rigth = perfil.rigth = L
        alzado.top = planta.top = perfil.top = L/ar
        alzado.bottom = planta.bottom = perfil.bottom = -L/ar        
    }
    alzado.updateProjectionMatrix()
    planta.updateProjectionMatrix()
    perfil.updateProjectionMatrix()
    //camera.left = -2*ar
    //camera.rigth = 2*ar

    //fin ortografica
}
function update()
{
    angulo += 0.01;
    esferaCubo.rotation.y = angulo;
}

function render()
{
    requestAnimationFrame(render);
    update();

    //Borrar una unica vez
    renderer.clear()

    //repartir canvass a 4 viewports con la misma relacion
    renderer.setViewport(0,0,window.innerWidth/2,window.innerHeight/2)
    renderer.render(scene,planta);

    renderer.setViewport(0,window.innerHeight/2,window.innerWidth/2,window.innerHeight/2)
    renderer.render(scene,alzado);

    renderer.setViewport(window.innerWidth/2,window.innerHeight/2,window.innerWidth/2,window.innerHeight/2)
    renderer.render(scene,perfil);

    renderer.setViewport(window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2)
    renderer.render(scene,camera);
}