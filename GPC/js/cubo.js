/**
*   CuboRGBtexto.js
*   Seminarios GPC #2. Ejemplo: Cubo RGB girando con letras R,G y B
*   en los vÃ©rtices transformadas de diferente manera.
*   Cubo con color por vertice usando la clase BufferGeometry.
*
*   En sentido antihorario las caras son:
*     Delante:   7,0,3,4
*     Derecha:   0,1,2,3
*     Detras:    1,6,5,2
*     Izquierda: 6,7,4,5
*     Arriba:    3,2,5,4
*     Abajo:     0,7,6,1
*   Donde se han numerado de 0..7 los ertices del cubo.
*   
*   Se han aÃ±adido normales como atributo de vertice. Dado que cada vertice
*   tiene una normal diferente segun la cara, hay que repetirlos 3 veces (coordenadas y colores).
*   Hay que considerar cada cara como un poligono independiente:
*   6caras x 4vertices x 3coordenadas = 72floats
*   Para formar los triangulos necesitamos: 6caras x 2triangulos x 3vertices = 36indices
*  
*   @author:  <rvivo@upv.es>, 2022
*/

// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import {TextGeometry} from "../lib/TextGeometry.module.js";
import {FontLoader} from "../lib/FontLoader.module.js";

// Globales
let renderer, scene, camera, cubo, R, G, B;
const angulo = 0.01;

// Acciones
init();
loadCubo(1.0);
render();

function init()
{
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( new THREE.Color(0xFFFFFF) );
  document.getElementById('container').appendChild( renderer.domElement );

  scene = new THREE.Scene();

  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera( 40, aspectRatio , 0.1, 100 );
  camera.position.set( 1, 1.5, 2 );
  camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

  window.addEventListener('resize', updateAspectRatio );
}

function loadCubo(lado)
{
   // Instancia el objeto BufferGeometry
   const malla = new THREE.BufferGeometry();
   // Construye la lista de coordenadas y colores por vertice
   const semilado = lado/2.0;
   const coordenadas = [ // 6caras x 4vert x3coor = 72float
                 // Front 
                 -semilado,-semilado, semilado, // 7 -> 0
                 semilado,-semilado, semilado,  // 0 -> 1
                 semilado, semilado, semilado,  // 3 -> 2
                 -semilado, semilado, semilado, // 4 -> 3
                 // Right
                 semilado,-semilado, semilado,  // 0 -> 4
                 semilado,-semilado,-semilado,  // 1 -> 5
                 semilado, semilado,-semilado,  // 2 -> 6
                 semilado, semilado, semilado,  // 3 -> 7
                 // Back
                 semilado,-semilado,-semilado,  // 1 -> 8
                 -semilado,-semilado,-semilado, // 6 -> 9
                 -semilado, semilado,-semilado, // 5 ->10
                 semilado, semilado,-semilado,  // 2 ->11
                 // Left
                 -semilado,-semilado,-semilado, // 6 ->12
                 -semilado,-semilado, semilado, // 7 ->13
                 -semilado, semilado, semilado, // 4 ->14
                 -semilado, semilado,-semilado, // 5 ->15
                 // Top
                 semilado, semilado, semilado,  // 3 ->16
                 semilado, semilado,-semilado,  // 2 ->17
                 -semilado, semilado,-semilado, // 5 ->18
                 -semilado, semilado, semilado, // 4 ->19
                 // Bottom
                 semilado,-semilado, semilado,  // 0 ->20
                 -semilado,-semilado, semilado, // 7 ->21 
                 -semilado,-semilado,-semilado, // 6 ->22
                 semilado,-semilado,-semilado   // 1 ->23
   ]
   const colores = [ // 24 x3
                 0,0,0,   // 7
                 1,0,0,   // 0
                 1,1,0,   // 3
                 0,1,0,   // 4
 
                 1,0,0,   // 0
                 1,0,1,   // 1
                 1,1,1,   // 2
                 1,1,0,   // 3
 
                 1,0,1,   // 1
                 0,0,1,   // 6
                 0,1,1,   // 5
                 1,1,1,   // 2
 
                 0,0,1,   // 6
                 0,0,0,   // 7
                 0,1,0,   // 4
                 0,1,1,   // 5
 
                 1,1,0,   // 3
                 1,1,1,   // 2
                 0,1,1,   // 5
                 0,1,0,   // 4
 
                 1,0,0,   // 0
                 0,0,0,   // 7
                 0,0,1,   // 6
                 1,0,1    // 1
   ]
   const normales = [ // 24 x3
                 0,0,1, 0,0,1, 0,0,1, 0,0,1,      // Front
                 1,0,0, 1,0,0, 1,0,0, 1,0,0,      // Right
                 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,  // Back 
                 -1,0,0, -1,0,0, -1,0,0, -1,0,0,  // Left
                 0,1,0, 0,1,0, 0,1,0, 0,1,0,      // Top 
                 0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0   // Bottom
                 ];
 
   const indices = [ // 6caras x 2triangulos x3vertices = 36
               0,1,2,    2,3,0,    // Front
               4,5,6,    6,7,4,    // Right 
               8,9,10,   10,11,8,  // Back
               12,13,14, 14,15,12, // Left
               16,17,18, 18,19,16, // Top
               20,21,22, 22,23,20  // Bottom
                  ];
 
   // Geometria por att arrays en r140
   malla.setIndex( indices );
   malla.setAttribute( 'position', new THREE.Float32BufferAttribute(coordenadas,3));
   malla.setAttribute( 'normal', new THREE.Float32BufferAttribute(normales,3));
   malla.setAttribute( 'color', new THREE.Float32BufferAttribute(colores,3));
   const materialRojo = new THREE.MeshBasicMaterial( { color: 'red' } );
   const materialVerde = new THREE.MeshBasicMaterial( { color: 'green' } );
   const materialAzul = new THREE.MeshBasicMaterial( { color: 'blue' } );
   // Configura un material
   const material = new THREE.MeshNormalMaterial({wireframe:true,flatshading:true});
 
   // Construye el objeto grafico 
   cubo = new THREE.Mesh( malla, material );
   console.log(cubo)
   // AÃ±ade el objeto grafico a la escena
   scene.add( cubo );

  // Configura mas materiales


  scene.add( new THREE.AxesHelper() );

}                 

/**
 * The updateAspectRatio function updates the aspect ratio of the camera and renderer to match
 * that of the window. This is necessary for when we resize our browser window, as it will
 * change our aspect ratio, which in turn means we need to update our camera's projection matrix.
 
 *
 *
 * @return The aspect ratio of the window
 *
 * @docauthor Trelent
 */
function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function update()
{
  // rotacion acumulativa
  //cubo.rotateOnAxis( new THREE.Vector3(0,1,0), angulo );
  //if(R) R.rotateOnAxis( new THREE.Vector3(0,1,0), angulo*5 );
  //if(G) G.rotateOnAxis( new THREE.Vector3(0,1,0), angulo*5 );
  //if(B) B.rotateOnAxis( new THREE.Vector3(0,1,0), angulo*5 );
}

function render()
{
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}