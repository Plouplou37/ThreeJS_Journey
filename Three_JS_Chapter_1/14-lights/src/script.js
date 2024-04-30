import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
//With AmbientLight the light comes from everywhere. There are no directions. 
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 1

const ambientLightGUI = gui.addFolder('Ambient Light Parameters')
ambientLightGUI.add(ambientLight, 'intensity').min(0).max(3).step(0.001)

scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight()
directionalLight.color = new THREE.Color(0xff0000)
directionalLight.position.set(9, 0, 0)
directionalLight.intensity = 0.9

scene.add(directionalLight)

const directionLightGUI = gui.addFolder('Directional Light Parameters')
directionLightGUI.add(directionalLight, 'intensity').min(0).max(3).step(0.001)

const hemisphereLight = new THREE.HemisphereLight()
hemisphereLight.skyColor = new THREE.Color(0xAAAAAA)
hemisphereLight.groundColor = new THREE.Color(0xff0000)
hemisphereLight.intensity = 0.9

scene.add(hemisphereLight)

const hemisphereLightGUI = gui.addFolder('Hemisphere Light Parameters')
hemisphereLightGUI.add(hemisphereLight, 'intensity').min(0).max(3).step(0.001)


const pointLight = new THREE.PointLight()
pointLight.color = new THREE.Color(0xffff00)
pointLight.intensity = 0.9
pointLight.position.set(1, -0.5, 1)
pointLight.decay = 1
pointLight.distance = 0


const pointLightGUI = gui.addFolder('Point Light Parameters')
pointLightGUI.add(pointLight, 'intensity').min(0).max(3).step(0.001)
pointLightGUI.add(pointLight, 'distance').min(0).max(10).step(0.001)
pointLightGUI.add(pointLight, 'decay').min(0).max(10).step(0.001)

scene.add(pointLight)

const reactAreaLight = new THREE.RectAreaLight()
reactAreaLight.color = new THREE.Color(0x4e13bb)
reactAreaLight.intensity = 0.9
reactAreaLight.width = 10
reactAreaLight.height = 10
reactAreaLight.position.set(5, 0, 5)
reactAreaLight.lookAt(0,0,0)

const reactAreaLightGUI = gui.addFolder('Rect Area Light Parameters')
reactAreaLightGUI.add(reactAreaLight, 'intensity').min(0).max(10).step(0.001)
reactAreaLightGUI.add(reactAreaLight, 'width').min(0).max(10).step(0.001)
reactAreaLightGUI.add(reactAreaLight, 'height').min(0).max(10).step(0.001)

scene.add(reactAreaLight)

const helperLight= new RectAreaLightHelper(reactAreaLight)
scene.add(helperLight)

const axes = new THREE.AxesHelper(10)
scene.add(axes)

/**
 * Objects
 */
// Material
// The MeshStandardMaterial need light !!!
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()