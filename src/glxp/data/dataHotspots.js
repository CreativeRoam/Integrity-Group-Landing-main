import { Vec2 } from '~/glxp/ogl/math/Vec2.js'
import { Vec3 } from '~/glxp/ogl/math/Vec3.js'

// EXEMPLES
export const HOTSPOTS = [
  {
    name: 'hotspot-1',
    worldPosition: new Vec3(0, 0, 0),
    screenPosition: new Vec3(),
    screenPositionPx: new Vec2(),
    distanceToCamera: 1,
    inView: false,
    visibility: 1
  },
]