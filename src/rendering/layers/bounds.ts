import * as THREE from 'three'

const COLOR = 0xffffff
const OPACITY = 0.5

export const makeBounds = (
  dimensions: number,
  radius: number,
): THREE.Object3D => {
  switch (dimensions) {
    case 0:
      return new THREE.Group()
    case 1:
      return makeLine(radius)
    case 2:
      return makeCircle(radius)
    default:
      return makeSphere(radius)
  }
}

const makeLine = (radius: number): THREE.Object3D => {
  const positions = new Float32Array(6).fill(0)
  positions[0] = -radius // source x
  positions[3] = radius // target x
  const geometry = new THREE.BufferGeometry()
  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.computeBoundingSphere()
  return new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({
      blending: THREE.AdditiveBlending,
      transparent: true,
      color: COLOR,
      opacity: OPACITY,
    }),
  )
}

const DIVISIONS = 64
const makeCircle = (radius: number): THREE.Object3D => {
  const shape = new THREE.Shape()
  shape.arc(0, 0, radius, 0, 2 * Math.PI, false)
  shape.autoClose = true
  const points2 = shape.getSpacedPoints(DIVISIONS)
  const points3 = points2.map(
    (p: THREE.Vector2): THREE.Vector3 => new THREE.Vector3(p.x, p.y, 0),
  )
  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints(points3)
  const material = new THREE.LineBasicMaterial({
    blending: THREE.AdditiveBlending,
    transparent: true,
    color: COLOR,
    opacity: OPACITY,
  })
  return new THREE.Line(geometry, material)
}

const SEGMENTS = 32
const RINGS = 32
const makeSphere = (radius: number): THREE.Object3D =>
  new THREE.Mesh(
    new THREE.SphereBufferGeometry(radius, SEGMENTS, RINGS),
    new THREE.ShaderMaterial({
      uniforms: {
        c: {
          type: 'f',
          value: 1.0,
        },
        p: {
          type: 'f',
          value: 1.4,
        },
        glowColor: {
          type: 'c',
          value: new THREE.Color(0xffffff),
        },
        viewVector: {
          type: 'v3',
          value: new THREE.Vector3(0, 0, 40 * 7),
        },
      },
      vertexShader: bubbleShaders.vertex,
      fragmentShader: bubbleShaders.fragment,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    }),
  )

const bubbleShaders = {
  vertex: `
    uniform vec3 viewVector;
    uniform float c;
    uniform float p;
    varying float intensity;
    void main()
    {
      vec3 vNormal = normalize( normalMatrix * normal );
      vec3 vNormel = normalize( normalMatrix * viewVector );
      intensity = pow( c - dot(vNormal, vNormel), p );
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragment: `
    uniform vec3 glowColor;
    varying float intensity;
    void main()
    {
      vec3 glow = glowColor * intensity;
      gl_FragColor = vec4( glow, 1.0 );
    }
  `,
}
