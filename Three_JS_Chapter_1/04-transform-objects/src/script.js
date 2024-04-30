import * as THREE from 'three'
console.log("Hello Three JS")
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
//const geometry = new THREE.BoxGeometry(1, 1, 1)
//const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
//const mesh = new THREE.Mesh(geometry, material)

const groupOfCube = new THREE.Group()
const colors =['red', 'blue', 'green']

for (let i=0; i<3; i++){
    let color = colors[i]
    let mesh = new THREE.Mesh(
        new THREE.BoxGeometry(i+1, i+1, i+1),
        new THREE.MeshBasicMaterial({color: color})
        )
    mesh.position.set(i+1, i+1, i+1)
    groupOfCube.add(mesh)
}



//position property transofrmation
/*mesh.position.set(5, 0, 0)
scale property tansformation
mesh.scale.set(10, 1, 1)
const deg = THREE.MathUtils.degToRad(90)
const pi = Math.PI
console.log(pi)
mesh.rotation.set(0, 0, deg, 'XYZ' )*/

//AxesHelper
const axesHelp = new THREE.AxesHelper(5)
scene.add(axesHelp)

groupOfCube.rotation.set(0, THREE.MathUtils.degToRad(90), 0)

scene.add(groupOfCube)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(3, 1, 8)
// LOOK AT THE CUBE WHICH IS A VECTOR3 OBJECT
camera.lookAt(groupOfCube.position)

scene.add(camera)


//console.log(mesh.position.distanceTo(camera.position))

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)