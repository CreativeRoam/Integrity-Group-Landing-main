import { Transform } from '@/glxp/ogl/core/Transform.js'
import { GenerateUID } from '@/glxp/utils/math'
import AnimationPlayer from '@/glxp/animations/AnimationPlayer'
import { Vec3 } from '@/glxp/ogl/math/Vec3.js'

export default {
  buildNodeTree(gltf, modelRoot = null) {
    //Build node Tree
    let modelTree = {}
    const isDraco = gltf.isDracoCompressed

    for (let i = 0; i < gltf.nodes.length; i++) {
      gltf.nodes[i].uid = GenerateUID()
    }

    for (let i = 0; i < gltf.nodes.length; i++) {
      const node = gltf.nodes[i]
      // if(node.mesh !== undefined) {continue}
      if (modelTree[node.name] !== undefined) {
        node.name += `__${node.uid.slice(0, -28)}`
      }
      modelTree[node.name] = {
        transform: new Transform(),
        childrenNames: [],
        childrenUIds: [],
        uid: node.uid,
        name: node.name,
      }
      if (node.translation) {
        modelTree[node.name].transform.position.copy(node.translation)
      }
      if (node.scale) {
        modelTree[node.name].transform.scale.copy(node.scale)
      }
      if (node.rotation) {
        modelTree[node.name].transform.quaternion.x = node.rotation[0]
        modelTree[node.name].transform.quaternion.y = node.rotation[1]
        modelTree[node.name].transform.quaternion.z = node.rotation[2]
        modelTree[node.name].transform.quaternion.w = node.rotation[3]
      }
      // modelTree[node.name].transform.setParent(modelRoot)
      modelTree[node.name].transform.updateMatrixWorld(true)
      modelTree[node.name].transform.name = node.name
      modelTree[node.name].transform.uid = node.uid
      modelTree[node.name].transform.offsetPosition = new Vec3()
      modelTree[node.name].transform.offsetRotation = new Vec3()

      if (node.children) {
        for (let j = 0; j < node.children.length; j++) {
          if (isDraco) {
            modelTree[node.name].childrenNames.push(node.children[j].name)
            modelTree[node.name].childrenUIds.push(node.children[j].uid)
          } else {
            modelTree[node.name].childrenNames.push(gltf.nodes[node.children[j]].name)
            modelTree[node.name].childrenUIds.push(gltf.nodes[node.children[j]].uid)
          }
        }
      }
    }

    for (const key in modelTree) {
      if (Object.hasOwnProperty.call(modelTree, key)) {
        const node = modelTree[key]
        // if (node.name == treeRootName) {
        //   node.transform.setParent(modelRoot)
        // }
        for (let i = 0; i < node.childrenUIds.length; i++) {
          const childrenUId = node.childrenUIds[i]
          for (const subkey in modelTree) {
            if (Object.hasOwnProperty.call(modelTree, subkey)) {
              const child = modelTree[subkey]
              if (childrenUId == child.uid) {
                child.transform.setParent(node.transform)
              }
            }
          }
        }
      }
    }
    if (modelRoot !== null) {
      for (const key in modelTree) {
        if (Object.hasOwnProperty.call(modelTree, key)) {
          const node = modelTree[key]
          if (node.transform.parent == null) {
            node.transform.setParent(modelRoot)
          }
        }
      }
    }
    return modelTree
  },

  getParentInNodeTree(tree, meshUid) {
    for (const key in tree) {
      if (Object.hasOwnProperty.call(tree, key)) {
        const el = tree[key]
        if (el.childrenUIds.indexOf(meshUid) > -1) {
          return el.transform
        }
      }
    }
    return undefined
  },

  getNodeInTree(tree, meshUid) {
    for (const key in tree) {
      if (Object.hasOwnProperty.call(tree, key)) {
        const el = tree[key]
        if (el.uid == meshUid) {
          return el.transform
        }
      }
    }
    return undefined
  },

  // Legacy:
  buildAnimationsPlayers(scene, objs, { timeScale = 1, loop = true } = {}) {
    for (let i = 0; i < objs.length; i++) {
      objs[i].hasPlayer = true
      objs[i].players = []
      for (const key in objs[i].animations) {
        if (Object.hasOwnProperty.call(objs[i].animations, key)) {
          objs[i].animations[key].player = new AnimationPlayer(scene, null, key, objs[i].animations[key], {
            timeScale: timeScale,
            autoUpdate: false,
            loop: loop,
            optimised: true,
          })
          objs[i].maxTime = objs[i].animations[key].player.maxTime
          objs[i].players.push(objs[i].animations[key].player)
        }
      }
    }
  },
  buildMeshList(glb, modelTree, { draco = null } = {}) {
    const meshList = []

    if (draco == null) {
      draco = glb.isDracoCompressed
    }

    if (draco == true) {
      for (let i = 0; i < glb.nodes.length; i++) {
        const node = glb.nodes[i]
        if (node.mesh !== undefined) {
          const meshData = node.mesh
          const meshName = meshData.name
          const meshUid = node.uid
          for (let p = 0; p < meshData.primitives.length; p++) {
            const prim = meshData.primitives[p]
            const materialName = meshData.primitives[p].material.name
            const parent = this.getParentInNodeTree(modelTree, meshUid)
            const transform = this.getNodeInTree(modelTree, meshUid)
            const material = meshData.primitives[p].material
            let out = {
              meshData: { primitives: [prim] },
              meshName,
              meshUid,
              materialName,
              node,
              parent,
              transform,
              material: material,
            }
            if (node.skin !== undefined && node.skin !== null) {
              Object.assign(out, {
                skin: node.skin,
              })
            }
            meshList.push(out)
          }
        }
      }
      return meshList
    } else {
      for (let i = 0; i < glb.nodes.length; i++) {
        const node = glb.nodes[i]
        if (node.mesh !== undefined) {
          const meshData = glb.meshes[node.mesh]
          const meshName = meshData.name
          const meshUid = node.uid
          for (let p = 0; p < meshData.primitives.length; p++) {
            const prim = meshData.primitives[p]
            const material = glb.materials ? glb.materials[meshData.primitives[p].material] : undefined
            const materialName = material?.name
            const parent = this.getParentInNodeTree(modelTree, meshUid)
            let out = {
              meshData: { primitives: [prim] },
              meshName,
              meshUid,
              materialName,
              node,
              parent,
              material: material,
            }
            if (node.skin !== undefined && node.skin !== null) {
              Object.assign(out, {
                skin: glb.skins[node.skin],
              })
            }
            meshList.push(out)
          }
        }
      }
      return meshList
    }
  },

  getGeometryDataFromGltf(data, defines, gltf) {
    const geom = { options: {} }
    const primitives = data.primitives

    // todo:  multiple primitives doesn't work.
    for (let i = 0; i < primitives.length; i++) {
      var primitive = primitives[Object.keys(primitives)[i]]

      for (let attribute in primitive.attributes) {
        switch (attribute) {
          case 'NORMAL':
            defines.HAS_NORMALS = 1
            break
          case 'TANGENT':
            defines.HAS_TANGENTS = 1
            break
          case 'TEXCOORD_0':
            defines.HAS_UV = 1
            break
        }
      }

      // Attributes
      for (let attribute in primitive.attributes) {
        this.getAccessorData(gltf, geom, primitive.attributes[attribute], attribute)
      }
      // Indices
      this.getAccessorData(gltf, geom, primitive.indices, 'INDEX')
    }

    return geom
  },

  getAccessorData(gltf, geom, accessorName, attribute) {
    if (gltf.isDracoCompressed) {
      const data = accessorName.value
      switch (attribute) {
        case 'POSITION':
          geom.vertices = data
          geom.options.vertices = { byteStride: 0, byteOffset: 0 }
          break
        case 'NORMAL':
          geom.normals = data
          geom.options.normals = { byteStride: 0, byteOffset: 12 }
          break
        case 'TANGENT':
          geom.tangents = data
          geom.options.tangents = { byteStride: 0, byteOffset: null }
          break
        case 'TEXCOORD_0':
          geom.uvs = data
          geom.options.uvs = { byteStride: 0, byteOffset: 24 }
          break
        case 'INDEX':
          geom.indices = data
          geom.options.indices = { byteStride: 0, byteOffset: null }
          break
        default:
          console.warn('Unknown attribute semantic: ' + attribute)
      }
      return
    }

    const accessor = gltf.accessors[accessorName]
    const bufferView = gltf.bufferViews[accessor.bufferView]
    const arrayBuffer = gltf.bin

    let byteStride = null
    if (bufferView && bufferView.byteStride) byteStride = bufferView.byteStride

    let byteOffset = bufferView.byteOffset ? bufferView.byteOffset : 0

    const start = byteOffset
    const end = start + bufferView.byteLength
    const slicedBuffer = arrayBuffer.slice(start, end)

    let data
    if (accessor.componentType === 5126) {
      data = new Float32Array(slicedBuffer)
    } else if (accessor.componentType === 5123) {
      data = new Uint16Array(slicedBuffer)
    } else if (accessor.componentType === 5125) {
      data = new Uint32Array(slicedBuffer)
    } else if (accessor.componentType === 5121) {
      data = new Uint8Array(slicedBuffer)
    } else {
      console.warn('no type defined for this componentType:', accessor.componentType)
    }

    if (!data) {
      console.warn('no data', accessorName, attribute, data)
    }

    switch (attribute) {
      case 'POSITION':
        geom.vertices = data
        geom.verticesAccessor = accessor
        geom.options.vertices = { byteStride, byteOffset: 0 }
        break
      case 'NORMAL':
        geom.normals = data
        geom.normalsAccessor = accessor
        geom.options.normals = { byteStride, byteOffset: 12 }
        break
      case 'TANGENT':
        geom.tangents = data
        geom.tangentsAccessor = accessor
        geom.options.tangents = { byteStride, byteOffset: null }
        break
      case 'TEXCOORD_0':
        geom.uvs = data
        geom.uvsAccessor = accessor
        geom.options.uvs = { byteStride, byteOffset: 24 }
        break
      case 'INDEX':
        geom.indices = data
        geom.indicesAccessor = accessor
        geom.options.indices = {
          byteStride,
          byteOffset: bufferView.byteOffset ? bufferView.byteOffset : null,
        }
        break
      default:
        console.warn('Unknown attribute semantic: ' + attribute)
    }
  },

  /** [{ name: string, data: [{ node, interpolation, times, values }] }]> */
  parseGLTFAnimations({ animations, nodes, accessors }) {
    if (!animations || !animations.length) return;

    return animations.map(
      (
        {
          channels, // required
          samplers, // required
          name, // optional
          // extensions, // optional
          // extras,  // optional
        },
        animationIndex
      ) => {

        /** [{ node, interpolation, times, values }] */
        const data = channels.map(
          ({
            sampler: samplerIndex, // required
            target, // required
            // extensions, // optional
            // extras, // optional
          }) => {
            const {
              input: inputIndex, // required
              interpolation = 'LINEAR',
              output: outputIndex, // required
              // extensions, // optional
              // extras, // optional
            } = samplers[samplerIndex];

            const {
              node: nodeIndex, // optional
              path, // required
              // extensions, // optional
              // extras, // optional
            } = target;

            if (typeof path === "undefined" || path === null) throw new Error(`No path found for animation ${animationIndex}`)
            if (typeof nodeIndex === "undefined" || nodeIndex === null) throw new Error(`No node found for animation ${animationIndex}`)

            const node = nodes[nodeIndex];

            const times = accessors[inputIndex].value;
            const values = accessors[outputIndex].value;

            return {
              node,
              interpolation,
              times,
              values,
              path
            };
          }
        );

        return {
          name,
          data
        };
      }
    );
  }
}
