import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { KITS } from './kits.js'


/** ---------- BLUE SKY Grass V1---------- **/
function createDawnBackground() {
  const canvas = document.createElement('canvas')
  canvas.width = 160
  canvas.height = 120
  const ctx = canvas.getContext('2d')

  const texture = new THREE.CanvasTexture(canvas)
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.generateMipmaps = false
  texture.colorSpace = THREE.SRGBColorSpace

  const clouds = [
    { x: 12, y: 18, w: 18, h: 6, speed: 0.8 },
    { x: 56, y: 30, w: 22, h: 6, speed: 1.1 },
    { x: 92, y: 16, w: 16, h: 5, speed: 0.7 }
  ]

  function drawCloud(px, py, w, h) {
    ctx.fillStyle = '#fff4e8'
    ctx.fillRect(px, py, w, h)
    ctx.fillRect(px + 2, py - 2, Math.max(4, w - 6), 2)
    ctx.fillRect(px + 4, py + h, Math.max(4, w - 8), 2)

    ctx.fillStyle = '#ffe6d2'
    ctx.fillRect(px + 1, py + 1, Math.max(2, w - 2), Math.max(2, h - 2))
  }

  function drawSoftGrass(time) {
    const horizonY = 90

    ctx.fillStyle = '#9fb99a'
    ctx.fillRect(0, horizonY, canvas.width, 8)

    ctx.fillStyle = '#7f9b79'
    ctx.fillRect(0, horizonY + 8, canvas.width, canvas.height - (horizonY + 8))

    for (let x = 0; x < canvas.width; x += 2) {
      const sway = Math.floor(Math.sin(time * 1.8 + x * 0.25) * 1.2)
      const h = 2 + ((x / 2) % 2)
      const y = horizonY + 8 - h

      ctx.fillStyle = (x / 2) % 4 === 0 ? '#6c8a67' : '#8baa82'
      ctx.fillRect(x + sway, y, 1, h + 2)
    }

    ctx.fillStyle = '#647c60'
    ctx.fillRect(0, canvas.height - 8, canvas.width, 8)
  }

  function render(time = 0) {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
    grad.addColorStop(0, '#bfe2ff')
    grad.addColorStop(0.45, '#d8ecff')
    grad.addColorStop(0.68, '#ffd8bf')
    grad.addColorStop(0.76, '#cfd9bd')
    grad.addColorStop(1, '#91aa86')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    for (let y = 0; y < 82; y += 4) {
      ctx.fillRect(0, y, canvas.width, 1)
    }

    for (const c of clouds) {
      const offset = Math.floor((time * c.speed) % (canvas.width + c.w + 8))
      let drawX = c.x + offset
      while (drawX > canvas.width) drawX -= canvas.width + c.w + 8

      drawCloud(drawX, c.y, c.w, c.h)

      if (drawX + c.w + 6 > canvas.width) {
        drawCloud(drawX - (canvas.width + c.w + 8), c.y, c.w, c.h)
      }
    }

    drawSoftGrass(time)

    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    for (let i = 0; i < 16; i++) {
      const nx = (i * 11 + Math.floor(time * 2)) % canvas.width
      const ny = (i * 17) % canvas.height
      ctx.fillRect(nx, ny, 1, 1)
    }

    texture.needsUpdate = true
  }

  render(0)

  return {
    texture,
    update(time) {
      render(time)
    }
  }
}


/** ---------- BLUE SKY Grass V2---------- **/
function createBlueGrassBackground() {
  const canvas = document.createElement('canvas')
  canvas.width = 160
  canvas.height = 120
  const ctx = canvas.getContext('2d')

  const texture = new THREE.CanvasTexture(canvas)
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.generateMipmaps = false
  texture.colorSpace = THREE.SRGBColorSpace

  const clouds = [
    { x: 8, y: 14, w: 18, h: 6, speed: 1.2 },
    { x: 46, y: 26, w: 24, h: 7, speed: 1.8 },
    { x: 82, y: 12, w: 16, h: 5, speed: 1.0 },
    { x: 108, y: 34, w: 20, h: 6, speed: 1.4 },
    { x: 22, y: 46, w: 14, h: 4, speed: 0.8 }
  ]

  function drawCloud(px, py, w, h) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(px, py, w, h)
    ctx.fillRect(px + 2, py - 2, Math.max(4, w - 6), 2)
    ctx.fillRect(px + 4, py + h, Math.max(4, w - 8), 2)

    ctx.fillStyle = '#dff1ff'
    ctx.fillRect(px + 1, py + 1, Math.max(2, w - 2), Math.max(2, h - 2))
  }

  function drawGrassLayer(time) {
    const horizonY = 88

    ctx.fillStyle = '#6bc45e'
    ctx.fillRect(0, horizonY, canvas.width, 10)

    ctx.fillStyle = '#49a64a'
    ctx.fillRect(0, horizonY + 10, canvas.width, canvas.height - (horizonY + 10))

    for (let x = 0; x < canvas.width; x += 2) {
      const sway = Math.floor(Math.sin(time * 2.2 + x * 0.28) * 1.5)
      const h = 2 + ((x / 2) % 3)
      const y = horizonY + 10 - h

      ctx.fillStyle = (x / 2) % 4 === 0 ? '#2f7f35' : '#68c95f'
      ctx.fillRect(x + sway, y, 1, h + 2)

      if ((x / 2) % 5 === 0) {
        ctx.fillStyle = '#8fe07b'
        ctx.fillRect(x + sway + 1, y + 1, 1, Math.max(1, h))
      }
    }

    ctx.fillStyle = '#2f7f35'
    ctx.fillRect(0, canvas.height - 8, canvas.width, 8)
  }

  function render(time = 0) {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
    grad.addColorStop(0, '#72b7ff')
    grad.addColorStop(0.45, '#9fd2ff')
    grad.addColorStop(0.74, '#d9f1ff')
    grad.addColorStop(0.75, '#cdecc3')
    grad.addColorStop(1, '#7ecf6c')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    for (let y = 0; y < 84; y += 4) {
      ctx.fillRect(0, y, canvas.width, 1)
    }

    for (const c of clouds) {
      const offset = Math.floor((time * c.speed) % (canvas.width + c.w + 8))
      let drawX = c.x + offset
      while (drawX > canvas.width) drawX -= canvas.width + c.w + 8

      drawCloud(drawX, c.y, c.w, c.h)

      if (drawX + c.w + 6 > canvas.width) {
        drawCloud(drawX - (canvas.width + c.w + 8), c.y, c.w, c.h)
      }
    }

    drawGrassLayer(time)

    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    for (let i = 0; i < 20; i++) {
      const nx = (i * 17 + Math.floor(time * 3)) % canvas.width
      const ny = (i * 29) % canvas.height
      ctx.fillRect(nx, ny, 1, 1)
    }

    texture.needsUpdate = true
  }

  render(0)

  return {
    texture,
    update(time) {
      render(time)
    }
  }
}

/** ---------- BLUE SKY Grass V2---------- **/

function createGlitchBloodBackground() {
  const canvas = document.createElement('canvas')
  canvas.width = 160
  canvas.height = 120
  const ctx = canvas.getContext('2d')

  const texture = new THREE.CanvasTexture(canvas)
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.generateMipmaps = false
  texture.colorSpace = THREE.SRGBColorSpace

  const clouds = [
    { x: 8, y: 14, w: 18, h: 6, speed: 1.2 },
    { x: 46, y: 26, w: 24, h: 7, speed: 1.8 },
    { x: 82, y: 12, w: 16, h: 5, speed: 1.0 }
  ]

  function drawCloud(px, py, w, h, bloodLevel) {
    const main = bloodLevel > 0.4 ? '#ffb5b5' : '#ffffff'
    const sub = bloodLevel > 0.4 ? '#ff8a8a' : '#dff1ff'

    ctx.fillStyle = main
    ctx.fillRect(px, py, w, h)
    ctx.fillRect(px + 2, py - 2, Math.max(4, w - 6), 2)
    ctx.fillRect(px + 4, py + h, Math.max(4, w - 8), 2)

    ctx.fillStyle = sub
    ctx.fillRect(px + 1, py + 1, Math.max(2, w - 2), Math.max(2, h - 2))
  }

  function drawGrass(time, bloodLevel) {
    const horizonY = 88

    const far = bloodLevel > 0.35 ? '#8c4d4d' : '#6bc45e'
    const main = bloodLevel > 0.35 ? '#7b2323' : '#49a64a'
    const dark = bloodLevel > 0.35 ? '#4b1010' : '#2f7f35'

    ctx.fillStyle = far
    ctx.fillRect(0, horizonY, canvas.width, 10)

    ctx.fillStyle = main
    ctx.fillRect(0, horizonY + 10, canvas.width, canvas.height - (horizonY + 10))

    for (let x = 0; x < canvas.width; x += 2) {
      const sway = Math.floor(Math.sin(time * 2.2 + x * 0.28) * 1.5)
      const h = 2 + ((x / 2) % 3)
      const y = horizonY + 10 - h

      ctx.fillStyle = (x / 2) % 4 === 0 ? dark : (bloodLevel > 0.35 ? '#a23232' : '#68c95f')
      ctx.fillRect(x + sway, y, 1, h + 2)
    }

    // blood stain bands
    if (bloodLevel > 0.2) {
      ctx.fillStyle = `rgba(120, 0, 0, ${0.22 + bloodLevel * 0.35})`
      ctx.fillRect(0, canvas.height - 18, canvas.width, 6)

      ctx.fillStyle = `rgba(180, 10, 10, ${0.18 + bloodLevel * 0.28})`
      for (let i = 0; i < 14; i++) {
        const x = (i * 13 + Math.floor(time * 8)) % canvas.width
        ctx.fillRect(x, canvas.height - 20 + (i % 3), 6, 2)
      }
    }

    ctx.fillStyle = dark
    ctx.fillRect(0, canvas.height - 8, canvas.width, 8)
  }

  function drawGlitches(time, bloodLevel) {
    if (bloodLevel < 0.15) return

    const glitchCount = 3 + Math.floor(bloodLevel * 10)

    for (let i = 0; i < glitchCount; i++) {
      const y = (Math.floor(time * 25) * 7 + i * 13) % canvas.height
      const h = 1 + (i % 2)
      const xShift = ((i * 17 + Math.floor(time * 40)) % 9) - 4

      const slice = ctx.getImageData(0, y, canvas.width, h)
      ctx.putImageData(slice, xShift, y)

      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,0,0,0.14)' : 'rgba(255,255,255,0.08)'
      ctx.fillRect(0, y, canvas.width, h)
    }

    // red flicker wash
    if (Math.floor(time * 6) % 2 === 0) {
      ctx.fillStyle = `rgba(255, 0, 0, ${0.06 + bloodLevel * 0.12})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }

  function render(time = 0) {
    const pulse = (Math.sin(time * 1.7) + 1) * 0.5
    const bloodLevel = 0.35 + pulse * 0.65

    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
    grad.addColorStop(0, bloodLevel > 0.5 ? '#8f2a2a' : '#72b7ff')
    grad.addColorStop(0.45, bloodLevel > 0.5 ? '#b64040' : '#9fd2ff')
    grad.addColorStop(0.74, bloodLevel > 0.5 ? '#d86868' : '#d9f1ff')
    grad.addColorStop(0.75, bloodLevel > 0.5 ? '#7a3a3a' : '#cdecc3')
    grad.addColorStop(1, bloodLevel > 0.5 ? '#4d1616' : '#7ecf6c')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = `rgba(255,255,255,${0.04 + pulse * 0.04})`
    for (let y = 0; y < 84; y += 4) {
      ctx.fillRect(0, y, canvas.width, 1)
    }

    for (const c of clouds) {
      const offset = Math.floor((time * c.speed) % (canvas.width + c.w + 8))
      let drawX = c.x + offset
      while (drawX > canvas.width) drawX -= canvas.width + c.w + 8

      drawCloud(drawX, c.y, c.w, c.h, bloodLevel)

      if (drawX + c.w + 6 > canvas.width) {
        drawCloud(drawX - (canvas.width + c.w + 8), c.y, c.w, c.h, bloodLevel)
      }
    }

    drawGrass(time, bloodLevel)

    ctx.fillStyle = `rgba(255,255,255,${0.03 + pulse * 0.05})`
    for (let i = 0; i < 24; i++) {
      const nx = (i * 17 + Math.floor(time * 5)) % canvas.width
      const ny = (i * 29 + Math.floor(time * 3)) % canvas.height
      ctx.fillRect(nx, ny, 1, 1)
    }

    drawGlitches(time, bloodLevel)

    texture.needsUpdate = true
  }

  render(0)

  return {
    texture,
    update(time) {
      render(time)
    }
  }
}
const params = new URLSearchParams(window.location.search)
const kitId = params.get('kit') || 'v1'
const activeKit = KITS[kitId] || KITS.v1

console.log('Active kit:', activeKit)

/** ---------- Scene ---------- **/
const bg = createBackgroundByType(activeKit.background)
const scene = new THREE.Scene()
scene.background = bg.texture

//background//
function createBackgroundByType(type) {
  switch (type) {
    case 'dawn':
      return createDawnBackground()
    case 'glitch_blood':
      return createGlitchBloodBackground()
    case 'blue_grass':
    default:
      return createBlueGrassBackground()
  }
}

/** ---------- Camera ---------- **/
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
)
camera.position.set(0, 1.2, 4)

/** ---------- Renderer ---------- **/
const PIXEL_SCALE = 3

const renderer = new THREE.WebGLRenderer({
  antialias: false,
  powerPreference: 'high-performance'
})

renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setPixelRatio(1)
renderer.setSize(
  Math.floor(window.innerWidth / PIXEL_SCALE),
  Math.floor(window.innerHeight / PIXEL_SCALE),
  false
)

const canvas = renderer.domElement
canvas.style.width = '100vw'
canvas.style.height = '100vh'
canvas.style.imageRendering = 'pixelated'
canvas.style.display = 'block'

document.querySelector('#app').appendChild(canvas)

/** ---------- Postprocessing / Outline ---------- **/
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))

const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera
)
outlinePass.edgeStrength = 5.5
outlinePass.edgeThickness = 1.8
outlinePass.edgeGlow = 0.0
outlinePass.visibleEdgeColor.set(0xffee58)
outlinePass.hiddenEdgeColor.set(0x664400)
composer.addPass(outlinePass)
composer.addPass(new OutputPass())

/** ---------- OrbitControls ---------- **/
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan = false
controls.minAzimuthAngle = -Math.PI / 2
controls.maxAzimuthAngle = Math.PI / 2
controls.minPolarAngle = Math.PI * 0.15
controls.maxPolarAngle = Math.PI * 0.85

/** ---------- TransformControls ---------- **/
const tcontrols = new TransformControls(camera, renderer.domElement)
scene.add(tcontrols.getHelper())
tcontrols.setSize(1)

/** ---------- Lights ---------- **/
scene.add(new THREE.AmbientLight(0xffffff, 1.15))

const keyLight = new THREE.DirectionalLight(0xffffff, 1.8)
keyLight.position.set(5, 10, 5)
scene.add(keyLight)

const fillLight = new THREE.DirectionalLight(0xbfd8ff, 0.85)
fillLight.position.set(-4, 4, -3)
scene.add(fillLight)

/** ---------- State ---------- **/
let rootModel = null
let selected = null
let snapTargets = []
let hasDraggedSelection = false

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

/** ---------- Dialogue ---------- **/
const PART_DIALOGUES = [
  'Hmm... this piece remembers something.',
  'That click felt strangely familiar.',
  'A tiny part of a lost world.',
  'This one looks older than the others.',
  'Something about this feels unfinished.',
  'It almost sounds like plastic rain.',
  'This part wants to be somewhere else.',
  'You found another memory fragment.',
  'That shape feels important.',
  'The sky looked different back then.',
  'This piece carries a quiet story.',
  'It clicks like an old dream.',
  'Not broken. Just waiting.',
  'Maybe this belonged to someone else.',
  'A small object with a long memory.'
]

const PART_RESELECT_DIALOGUES = [
  'Again? Maybe it likes you.',
  'Still here.',
  'You picked this one twice.',
  'It must be important.',
  'This piece has more to say.'
]

/** ---------- UI ---------- **/
createOldInternetDesktopUI()
createHotkeyUI()
const dialogueUI = createDialogueUI()
/** ---------- Load GLB ---------- **/
const loader = new GLTFLoader()
loader.load(
  activeKit.model,
  (gltf) => {
    rootModel = gltf.scene
    scene.add(rootModel)

    rootModel.scale.set(2, 2, 2)
    rootModel.position.set(0, 0, 0)

    rootModel.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = false
        obj.receiveShadow = false

        const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
        materials.forEach((m) => {
          if (!m) return
          m.flatShading = true
          m.needsUpdate = true

          if (m.map) {
            m.map.magFilter = THREE.NearestFilter
            m.map.minFilter = THREE.NearestFilter
            m.map.generateMipmaps = false
            m.map.needsUpdate = true
          }
        })
      }
    })

  function markPrototypeParts(root) {
  root.traverse((obj) => {
    if (obj.name && obj.name.startsWith('part_')) {
      obj.userData.isPrototype = true
      obj.userData.prototypeSourceName = obj.name
      obj.userData.hasSpawnedClone = false
    }
  })

  // part_* 가 아닌데 rootModel 바로 아래에 있는 selectable 루트들도 prototype으로 등록
  root.children.forEach((child, index) => {
    if (!child.userData.isPrototype) {
      child.userData.isPrototype = true
      child.userData.prototypeSourceName = child.name || `root_part_${index}`
      child.userData.hasSpawnedClone = false
    }
  })
}
    frameObject(rootModel)
    rebuildSnapTargets()

    showDialogue('Welcome back. Click a part to wake it up.')
    console.log('GLB loaded ✅')
  },
  undefined,
  (err) => console.error('GLB load error ❌', err)
)

/** ---------- Transform Control Events ---------- **/
tcontrols.addEventListener('dragging-changed', (e) => {
  controls.enabled = !e.value

  if (e.value) {
    if (selected && !hasDraggedSelection) {
      maybeSpawnCloneFromPrototype()
      hasDraggedSelection = true
    }
  }

  if (!e.value) {
    checkSnap()
  }
})

tcontrols.addEventListener('objectChange', () => {
  if (tcontrols.dragging) magnetSnap()
})

/** ---------- Helpers ---------- **/
function frameObject(obj) {
  const box = new THREE.Box3().setFromObject(obj)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)

  controls.target.copy(center)

  camera.near = Math.max(0.01, maxDim / 1000)
  camera.far = maxDim * 100
  camera.updateProjectionMatrix()

  camera.position.set(
    center.x,
    center.y + maxDim * 0.6,
    center.z + maxDim * 2.2
  )
  camera.lookAt(center)
}

function isSelectable(obj) {
  return !!(obj && obj.isMesh)
}

function findOwnerPart(obj) {
  let p = obj
  let fallback = null

  while (p) {
    if (p.name && p.name.startsWith('part_')) return p

    // rootModel 바로 아래 첫 부모를 fallback으로 기억
    if (rootModel && p.parent === rootModel && !fallback) {
      fallback = p
    }

    p = p.parent
  }

  return fallback || obj
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function markPrototypeParts(root) {
  root.traverse((obj) => {
    if (obj.name && obj.name.startsWith('part_')) {
      obj.userData.isPrototype = true
      obj.userData.prototypeSourceName = obj.name
      obj.userData.hasSpawnedClone = false
    }
  })
}

/** ---------- Clone System ---------- **/
function maybeSpawnCloneFromPrototype() {
  if (!selected) return

  let prototype = selected

  // selected가 prototype이 아니면, rootModel 바로 아래 selectable 루트로 올려봄
  if (!prototype.userData?.isPrototype) {
    let p = selected
    while (p && p.parent && p.parent !== rootModel) {
      p = p.parent
    }

    if (p && p !== rootModel) {
      prototype = p
    }
  }

  // 그래도 prototype 플래그가 없으면 지금부터 prototype으로 간주
  if (!prototype.userData) prototype.userData = {}
  if (prototype.userData.isPrototype === undefined) {
    prototype.userData.isPrototype = true
    prototype.userData.prototypeSourceName = prototype.name || 'unnamed_part'
    prototype.userData.hasSpawnedClone = false
  }

  if (!prototype.userData.isPrototype) return
  if (prototype.userData.hasSpawnedClone) return

  const parent = prototype.parent
  if (!parent) return

  const originalPos = prototype.position.clone()
  const originalQuat = prototype.quaternion.clone()
  const originalScale = prototype.scale.clone()

  const clone = prototype.clone(true)

  clone.userData = {
    ...clone.userData,
    isPrototype: false,
    prototypeSourceName: prototype.userData.prototypeSourceName,
    hasSpawnedClone: false
  }

  clone.traverse((obj) => {
    obj.userData = { ...obj.userData }

    if (obj.name && obj.name.startsWith('part_')) {
      obj.userData.isPrototype = false
      obj.userData.prototypeSourceName = prototype.userData.prototypeSourceName
      obj.userData.hasSpawnedClone = false
    }
  })

  prototype.userData.hasSpawnedClone = false

  clone.position.copy(originalPos)
  clone.quaternion.copy(originalQuat)
  clone.scale.copy(originalScale)

  parent.add(clone)

  selected = clone
  tcontrols.attach(clone)
  outlinePass.selectedObjects = [clone]

  showDialogue('A fresh copy appeared.')
  console.log('CLONED ✅ from prototype:', prototype.name)
}
/** ---------- Old Internet UI ---------- **/
function createOldInternetDesktopUI() {
  const desk = document.createElement('div')
  desk.style.position = 'fixed'
  desk.style.inset = '0'
  desk.style.pointerEvents = 'none'
  desk.style.zIndex = '30'
  document.body.appendChild(desk)

  const icons = [
    { x: 18, y: 84, emoji: '🖥️', label: 'My Computer' },
    { x: 18, y: 154, emoji: '📁', label: 'My Stuff' },
    { x: 18, y: 224, emoji: '🌐', label: 'Net Explorer' },
    { x: 18, y: 294, emoji: '🗑️', label: 'Recycle Bin' }
  ]

  icons.forEach((item) => {
    const icon = document.createElement('div')
    icon.style.position = 'fixed'
    icon.style.left = `${item.x}px`
    icon.style.top = `${item.y}px`
    icon.style.width = '74px'
    icon.style.textAlign = 'center'
    icon.style.fontFamily = 'Tahoma, Arial, sans-serif'
    icon.style.fontSize = '11px'
    icon.style.color = '#fff'
    icon.style.textShadow = '1px 1px 0 #003a66'

    const ico = document.createElement('div')
    ico.textContent = item.emoji
    ico.style.fontSize = '28px'
    ico.style.lineHeight = '1'

    const txt = document.createElement('div')
    txt.textContent = item.label
    txt.style.marginTop = '4px'
    txt.style.background = 'rgba(0,75,140,0.25)'
    txt.style.display = 'inline-block'
    txt.style.padding = '1px 4px'

    icon.appendChild(ico)
    icon.appendChild(txt)
    desk.appendChild(icon)
  })

  const win = document.createElement('div')
  win.style.position = 'fixed'
  win.style.top = '18px'
  win.style.right = '20px'
  win.style.width = '220px'
  win.style.background = '#d4d0c8'
  win.style.border = '2px solid'
  win.style.borderColor = '#ffffff #808080 #808080 #ffffff'
  win.style.boxShadow = '2px 2px 0 rgba(0,0,0,0.35)'
  win.style.fontFamily = 'Tahoma, Arial, sans-serif'
  win.style.fontSize = '11px'
  win.style.color = '#111'

  const title = document.createElement('div')
  title.style.height = '22px'
  title.style.display = 'flex'
  title.style.alignItems = 'center'
  title.style.justifyContent = 'space-between'
  title.style.padding = '0 6px'
  title.style.background = 'linear-gradient(90deg, #0a2a93 0%, #1084d0 60%, #0a2a93 100%)'
  title.style.color = '#fff'
  title.style.fontWeight = 'bold'
  title.innerHTML = `<span>BuildMe.exe</span><span style="font-size:10px;">□ ✕</span>`

  const body = document.createElement('div')
  body.style.padding = '8px'
  body.style.lineHeight = '1.45'
  body.innerHTML = `
    <div style="margin-bottom:6px;"><b>Status:</b> ONLINE</div>
    <div style="margin-bottom:6px;">Detaching memory fragments...</div>
    <div style="margin-bottom:6px;">Use G / R / S to manipulate parts.</div>
    <div style="font-size:10px;color:#333;">Best viewed in 800×600</div>
  `

  win.appendChild(title)
  win.appendChild(body)
  desk.appendChild(win)

  const taskbar = document.createElement('div')
  taskbar.style.position = 'fixed'
  taskbar.style.left = '0'
  taskbar.style.right = '0'
  taskbar.style.bottom = '0'
  taskbar.style.height = '32px'
  taskbar.style.display = 'flex'
  taskbar.style.alignItems = 'center'
  taskbar.style.gap = '6px'
  taskbar.style.padding = '0 6px'
  taskbar.style.background = 'linear-gradient(180deg,#2467b3 0%,#0f5ba5 100%)'
  taskbar.style.borderTop = '1px solid #7db4e8'
  taskbar.style.boxShadow = '0 -1px 0 rgba(255,255,255,0.25) inset'

  const start = document.createElement('div')
  start.textContent = 'Start'
  start.style.height = '22px'
  start.style.padding = '0 12px'
  start.style.display = 'flex'
  start.style.alignItems = 'center'
  start.style.background = 'linear-gradient(180deg,#44a944 0%,#1f7e1f 100%)'
  start.style.borderRadius = '10px'
  start.style.border = '1px solid #175e17'
  start.style.color = '#fff'
  start.style.fontWeight = 'bold'
  start.style.fontFamily = 'Arial Black, Arial, sans-serif'
  start.style.fontSize = '12px'
  start.style.fontStyle = 'italic'

  const task = document.createElement('div')
  task.textContent = '🌐 BuildMe - Internet Explorer'
  task.style.height = '22px'
  task.style.minWidth = '190px'
  task.style.padding = '0 8px'
  task.style.display = 'flex'
  task.style.alignItems = 'center'
  task.style.background = 'linear-gradient(180deg,#4a8fcf 0%,#2b6cb0 100%)'
  task.style.border = '1px inset #5b9bd5'
  task.style.color = '#fff'
  task.style.fontSize = '11px'
  task.style.fontFamily = 'Tahoma, Arial, sans-serif'
  task.style.fontWeight = 'bold'

  const tray = document.createElement('div')
  tray.style.marginLeft = 'auto'
  tray.style.height = '22px'
  tray.style.padding = '0 10px'
  tray.style.display = 'flex'
  tray.style.alignItems = 'center'
  tray.style.background = 'linear-gradient(180deg,#1266b5 0%,#1a7ad4 100%)'
  tray.style.borderLeft = '1px solid #84b8ea'
  tray.style.color = '#fff'
  tray.style.fontFamily = 'Tahoma, Arial, sans-serif'
  tray.style.fontSize = '11px'
  tray.textContent = '12:00 AM'

  taskbar.appendChild(start)
  taskbar.appendChild(task)
  taskbar.appendChild(tray)
  desk.appendChild(taskbar)
}

function createHotkeyUI() {
  const hotkeyUI = document.createElement('div')
  hotkeyUI.style.position = 'fixed'
  hotkeyUI.style.top = '18px'
  hotkeyUI.style.left = '110px'
  hotkeyUI.style.padding = '8px 10px'
  hotkeyUI.style.background = 'rgba(255,255,255,0.78)'
  hotkeyUI.style.border = '2px solid rgba(0,0,0,0.15)'
  hotkeyUI.style.borderRadius = '6px'
  hotkeyUI.style.fontFamily = 'Tahoma, Arial, sans-serif'
  hotkeyUI.style.fontSize = '11px'
  hotkeyUI.style.lineHeight = '1.45'
  hotkeyUI.style.color = '#111'
  hotkeyUI.style.zIndex = '9999'
  hotkeyUI.style.whiteSpace = 'nowrap'
  hotkeyUI.style.backdropFilter = 'blur(2px)'
  hotkeyUI.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)'

  hotkeyUI.innerHTML = `
    <b>Controls</b><br/>
    G → Move<br/>
    R → Rotate<br/>
    S → Scale<br/>
    ESC → Deselect
  `

  document.body.appendChild(hotkeyUI)
}

function createDialogueUI() {
  const wrap = document.createElement('div')
  wrap.style.position = 'fixed'
  wrap.style.top = '16px'
  wrap.style.left = '50%'
  wrap.style.transform = 'translateX(-50%)'
  wrap.style.zIndex = '9999'
  wrap.style.width = 'min(520px, calc(100vw - 160px))'
  wrap.style.pointerEvents = 'none'

  const box = document.createElement('div')
  box.style.background = 'rgba(240, 248, 255, 0.93)'
  box.style.border = '2px solid rgba(20,20,20,0.18)'
  box.style.borderRadius = '8px'
  box.style.padding = '10px 14px'
  box.style.fontFamily = 'Tahoma, Arial, sans-serif'
  box.style.fontSize = '13px'
  box.style.lineHeight = '1.45'
  box.style.color = '#0d1a2b'
  box.style.textAlign = 'center'
  box.style.boxShadow = '0 6px 16px rgba(0,0,0,0.10)'
  box.style.opacity = '0'
  box.style.transform = 'translateY(-8px)'
  box.style.transition = 'opacity 0.18s ease, transform 0.18s ease'

  wrap.appendChild(box)
  document.body.appendChild(wrap)

  return {
    box,
    timeoutId: null
  }
}

function showDialogue(text) {
  dialogueUI.box.textContent = text
  dialogueUI.box.style.opacity = '1'
  dialogueUI.box.style.transform = 'translateY(0px)'

  if (dialogueUI.timeoutId) clearTimeout(dialogueUI.timeoutId)
  dialogueUI.timeoutId = setTimeout(() => {
    dialogueUI.box.style.opacity = '0'
    dialogueUI.box.style.transform = 'translateY(-8px)'
  }, 2600)
}

/** ---------- Selection ---------- **/
window.addEventListener('pointerdown', (e) => {
  if (!rootModel) return
  if (tcontrols.dragging) return

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const hits = raycaster.intersectObject(rootModel, true)
  const hit = hits.find((h) => isSelectable(h.object))

  if (!hit) {
    clearSelection()
    return
  }

  const part = findOwnerPart(hit.object)
console.log('hit object:', hit.object.name, '=> selecting:', (part || hit.object).name)
selectObject(part || hit.object)
})

window.addEventListener('keydown', (e) => {
  if (e.key === 'g' || e.key === 'G') {
    tcontrols.setMode('translate')
    showDialogue('Move mode.')
  }
  if (e.key === 'r' || e.key === 'R') {
    tcontrols.setMode('rotate')
    showDialogue('Rotate mode.')
  }
  if (e.key === 's' || e.key === 'S') {
    tcontrols.setMode('scale')
    showDialogue('Scale mode.')
  }
  if (e.key === 'Escape') {
    clearSelection()
    showDialogue('Nothing selected.')
  }
})

function selectObject(obj) {
  const samePart = selected && obj && selected.uuid === obj.uuid

  clearSelection(false)
  selected = obj
  hasDraggedSelection = false

  tcontrols.attach(obj)
  outlinePass.selectedObjects = [obj]

  const line = samePart
    ? pickRandom(PART_RESELECT_DIALOGUES)
    : pickRandom(PART_DIALOGUES)

  showDialogue(line)
  console.log('Selected:', obj.name)
}

function clearSelection(withDialogue = false) {
  tcontrols.detach()
  outlinePass.selectedObjects = []
  selected = null
  hasDraggedSelection = false

  if (withDialogue) {
    showDialogue('Nothing selected.')
  }
}

/** ---------- Snap System ---------- **/
function rebuildSnapTargets() {
  snapTargets = []
  if (!rootModel) return

  rootModel.updateWorldMatrix(true, true)

  rootModel.traverse((obj) => {
    if (obj.name && obj.name.startsWith('snap_')) {
      const pos = obj.getWorldPosition(new THREE.Vector3())
      snapTargets.push({ name: obj.name, pos })
    }
  })

  console.log('Snap targets:', snapTargets.length)
}

function getSnapsUnderSelected() {
  const arr = []
  if (!selected) return arr

  selected.traverse((o) => {
    if (o.name && o.name.startsWith('snap_')) arr.push(o)
  })

  return arr
}

function findBestSnapPair(maxDist) {
  if (!selected) return null

  const snaps = getSnapsUnderSelected()
  if (!snaps.length) return null

  let best = null
  let bestD2 = maxDist * maxDist
  const temp = new THREE.Vector3()

  for (const s of snaps) {
    s.getWorldPosition(temp)

    for (const t of snapTargets) {
      const d2 = temp.distanceToSquared(t.pos)
      if (d2 < bestD2) {
        bestD2 = d2
        best = {
          snapPos: temp.clone(),
          target: t.pos.clone(),
          snapName: s.name,
          targetName: t.name
        }
      }
    }
  }

  return best
}

function moveSelected(delta) {
  if (!selected) return

  const parent = selected.parent
  if (!parent) return

  const world = selected.getWorldPosition(new THREE.Vector3())
  const target = world.add(delta)
  const local = parent.worldToLocal(target.clone())

  selected.position.copy(local)
}

function checkSnap() {
  const best = findBestSnapPair(0.7)
  if (!best) return

  const delta = best.target.clone().sub(best.snapPos)
  moveSelected(delta)

  showDialogue('Locked into place.')
  console.log('SNAPPED ✅', best.snapName, '->', best.targetName)
}

function magnetSnap() {
  const best = findBestSnapPair(0.9)
  if (!best) return

  const delta = best.target.clone().sub(best.snapPos)
  moveSelected(delta.multiplyScalar(0.35))
}

/** ---------- Resize ---------- **/
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(
    Math.floor(window.innerWidth / PIXEL_SCALE),
    Math.floor(window.innerHeight / PIXEL_SCALE),
    false
  )

  composer.setSize(
    Math.floor(window.innerWidth / PIXEL_SCALE),
    Math.floor(window.innerHeight / PIXEL_SCALE)
  )

  outlinePass.setSize(
    Math.floor(window.innerWidth / PIXEL_SCALE),
    Math.floor(window.innerHeight / PIXEL_SCALE)
  )
})

/** ---------- Loop ---------- **/
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const t = clock.getElapsedTime()
  bg.update(t)

  controls.update()
  composer.render()
}

animate()