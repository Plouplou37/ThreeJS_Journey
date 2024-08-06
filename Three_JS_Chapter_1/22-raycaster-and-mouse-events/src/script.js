import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import GUI from 'lil-gui'

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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)



/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
const origin  = new THREE.Vector3(-3, 0, 0)
const direction = new THREE.Vector3(10, 0, 0)
direction.normalize() // put len of 1

raycaster.set(origin, direction)

//const intersect = raycaster.intersectObject(object2)
//console.log(intersect)

//const intersects = raycaster.intersectObjects([object1, object2, object3])
//console.log(intersects)


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
 * mouse
 */

const mouse = new THREE.Vector2()

canvas.addEventListener('mousemove', (_event) => {
    mouse.x = _event.clientX / sizes.width * 2 - 1
    mouse.y = - (_event.clientY / sizes.height) * 2 + 1

    console.log(mouse)
})

canvas.addEventListener('click', (_event) => {
    if(currentIntersect){
        switch(currentIntersect.object)
        {
            case object1: 
                console.log('click on object 1')
                break
            
            case object2: 
                console.log('click on object 2')
                break

            case object3: 
                console.log('click on object 3')
                break

        }
    }
    console.log('click anywhere')
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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


//const dracoLoader = new DRACOLoader()
//dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
//gltfLoader.setDRACOLoader(dracoLoader)
let model = null
gltfLoader.load(
    '/models/Duck/glTF-Binary/Duck.glb',

    (gltf) => {
        model = gltf.scene
        console.log(model)
        model.position.y = -1.2
        scene.add(model)
    },
)

/**
 * Light
 */

const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight()
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new THREE.Clock()

let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Move Objects
    object1.position.y = Math.sin(elapsedTime * 0.3)
    object2.position.y = Math.sin(elapsedTime * 0.5)
    object3.position.y = Math.sin(elapsedTime)

    // Cast a ray
    raycaster.setFromCamera(mouse, camera)


    const objectToTest = [object1, object2, object3] 

    //Update raycaster
    const intersects = raycaster.intersectObjects(objectToTest)
    //console.log(intersects.length)

    for(const object of objectToTest)
    {
        object.material.color.set('#ff0000')
    }

    for(const intersect of intersects)
    {
        intersect.object.material.color.set('#0000ff')
    }

    if(intersects.length)
    {
        if(currentIntersect == null)
        {
            //console.log("mouse enter")
        }
        
        currentIntersect = intersects[0]
    }else {
        if(currentIntersect == null)
        {
            //console.log("mouse leave")
        }
        currentIntersect = null
    }

    if(model)
    {
        const modelIntersects = raycaster.intersectObject(model)
        console.log('The model intersect is here --> ', modelIntersects)
    }
  

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()