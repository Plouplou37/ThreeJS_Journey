import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import './style.css'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
//import typeFaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('./textures/matcaps/8.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font)=>
{
    const textGeometry = new TextGeometry(
        'Hello my name is Quentin',
        {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 6,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 2 
        }
    )
    textGeometry.center()

    const textMaterial = new THREE.MeshMatcapMaterial()
    //textMaterial.wireframe = true
    textMaterial.matcap = matcapTexture
    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)

    //geometry
const donutsGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
//Material
//const donutsMaterial = new THREE.MeshMatcapMaterial()

for (let i = 0;i < 100; i++)
{
    //mesh
    const donuts = new THREE.Mesh(donutsGeometry, textMaterial)
    donuts.position.x = (Math.random() - 0.5) * 20
    donuts.position.y = (Math.random() - 0.5) * 20
    donuts.position.z = (Math.random() - 0.5) * 20

    donuts.rotation.x = Math.random() * Math.PI
    const randomScale = Math.random()
    donuts.scale.x = randomScale
    donuts.scale.y = randomScale
    donuts.scale.z = randomScale
    scene.add(donuts)
}

})
/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )



// scene.add(cube)

const axesHelper = new THREE.AxesHelper(20)
scene.add(axesHelper)
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()