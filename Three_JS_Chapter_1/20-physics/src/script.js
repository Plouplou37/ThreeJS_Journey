import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import CANNON from 'cannon'

console.log(CANNON)
/**
 * Debug
 */
const gui = new GUI()
const debugObject = {}
const debugObjectBoxes = {}
const debugObjectResetAll = {}

debugObjectResetAll.resetAll = () =>
{
    for(const object of objectToUpdate)
    {
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.mesh)
    }
    objectToUpdate.splice(0, objectToUpdate.length)
    scene.remove(object.mesh)
}
debugObject.createSphere = () => 
{ 
    createSphere(Math.random() * 0.5,
        {x:(Math.random() -0.5) * 3,
        y:3,
        z:(Math.random() -0.5) * 3
    })
}

debugObjectBoxes.createBoxes = () =>
{
    createBoxes(2, 2, 2, {x:0, y:3, z:0})
}

gui.add(debugObject, 'createSphere')
gui.add(debugObjectBoxes, 'createBoxes')
gui.add(debugObjectResetAll, 'resetAll')


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])


/**
 * Test sphere
 */
/*const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
sphere.castShadow = true
sphere.position.y = 0.5
scene.add(sphere)*/

/**
 * Cannon World
 */

// Initialize cannon world
const world = new CANNON.World()
//add some gravity VEC3 in cannon
world.gravity.set(0, -9.82, 0)

//Initialize some material for cannon world
//const concreteMaterial = new CANNON.Material('concrete')
//const plasticMaterial = new CANNON.Material('plastic')
const defaultMaterial = new CANNON.Material('default')
//world.defaultContactMaterial = defaultContactMaterial
// what happened when a plastic material meet the concreteMaterial
const defaultConctactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.1,
    restitution: 0.7 //increase the boucing
})
world.addContactMaterial(defaultConctactMaterial)
world.allowSleep = true
world.broadphase = new CANNON.SAPBroadphase(world)

const hitSound = new Audio('/sounds/hit.mp3')
const playHitSound = (collision) =>
{
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if(impactStrength>1.5)
    {   
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}
//SPHERE CANNON WORLD
//in CANNON.js body are our object, i's lke mesh in the threejs world. A body iscomposed with a shape first.
/*const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
    material: defaultMaterial
})
sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
world.addBody(sphereBody)*/

//Floor Cannon World
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
    material: defaultMaterial
})
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)

world.addBody(floorBody)

/**
 * Floor ThreeJS World
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */
const objectToUpdate = []
const sphereGeo = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})

const createSphere = (radius, position) => {
    const mesh = new THREE.Mesh(
        sphereGeo,
        sphereMaterial, 
    )
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    //cannon js body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)

    // save in objectToUpdate
    objectToUpdate.push({
        mesh: mesh,
        body: body
    })
}

/*createSphere(0.5, {x: 0, y: 3, z: 0})
createSphere(0.5, {x: 0, y: 0, z: 3})
createSphere(0.5, {x: 3, y: 0, z: 0})*/

const createBoxes = (width, height, depth, position) => {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        sphereMaterial
    )
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    //cannon js body
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // save in objectToUpdate
    objectToUpdate.push({
        mesh: mesh,
        body: body
    })
}

/**
 * Animate
 */
const clock = new THREE.Clock()
const oldElapseTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapseTime
    //update physics world
    world.step(1/60, deltaTime, 3)

    for(const object of objectToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
        object.body.applyForce(new CANNON.Vec3(10, 0, 0), object.body.position)
    }
    //sphereBody.position.copy(sphere.position
    //apply wind to the sphere
    //sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

    //console.log(sphereBody.position)
    //sphere.position.copy(sphereBody.position)
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()