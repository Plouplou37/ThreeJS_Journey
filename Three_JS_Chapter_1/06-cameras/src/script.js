import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * Cursor
 */
// The listener here listen to the event happening on the displayed window. The event type refered to 'mousemove'
// the function given in parameter determine the behavior of the code when this particular event happen.
const cursor = {
    x:0,
    y:0}

window.addEventListener('mousemove', (event) => {

    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
    //console.log("x move is ", cursor.x, "y move is ", cursor.y)
})


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.1, 100)
//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// controls.target.y = 2
// controls.update()
//const aspectRatio = sizes.width/sizes.height
// render a little further on the left and on the right for the cube to be well displayed in a rectangle renderer !
// Need to get the aspecctRatio of the renderer to adapt the cube dimension properly
//const camera = new THREE.OrthographicCamera(-6 * aspectRatio, 6 * aspectRatio, 6, -6, 0.1, 100)
// const camera = new THREE.OrthographicCamera(-6 , 6, 6 / aspectRatio, -6 / aspectRatio, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
//console.log(camera.position.distanceTo(mesh.position))
//camera.lookAt(mesh.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //mesh.rotation.y = elapsedTime;
    //When applying sin and cos on two axes. Imagine the trigonometry circle with the two axes being x and z. 
    //camera.position.x =  2*Math.sin(cursor.x * 2 * Math.PI)
    //Need to add the 2*PI to do a full circle revolution
    //camera.position.z =  2*Math.cos(cursor.x * 2 * Math.PI) 
    //camera.position.y = cursor.y * 10
    
    //camera.lookAt(mesh.position)

    //update controls. Need to update the control before each frame. 
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()