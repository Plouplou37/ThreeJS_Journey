import * as THREE from 'three'
import gsap from 'gsap'
console.log(gsap)


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

//AxesHelper
scene.add(new THREE.AxesHelper(10))

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

//const clock = new THREE.Clock()
gsap.to(mesh.position, {duration:1, delay:1, x:2})

//Animation
const tick = () => {
    console.log('tick')

    // elapsedTime is changing per second ! 
    //const elapsedTime = clock.getElapsedTime()
    //console.log(elapsedTime)

    //
    //mesh.position.y = Math.sin(elapsedTime * 1 * Math.PI)
    //mesh.position.x = Math.cos(elapsedTime * 1 * Math.PI)
    //camera.lookAt(mesh.position)
    renderer.render(scene, camera)
    //The parameter is the name of the function. AT each frame it say to call the function on the next frame again and again
    window.requestAnimationFrame(tick)
}

tick()