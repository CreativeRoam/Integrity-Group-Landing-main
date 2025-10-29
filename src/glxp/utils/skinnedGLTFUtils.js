export default {
  buildBonesHierarchy(entity) {
    entity.joints = []
    for (let i = 0; i < entity.skinData.joints.length; i++) {
      const jointID = entity.skinData.joints[i]
      const nodeUID = entity.gltf.nodes[jointID].uid
      for (const key in entity.modelTree) {
        if (Object.hasOwnProperty.call(entity.modelTree, key)) {
          const el = entity.modelTree[key]
          if (el.transform.uid == nodeUID) {
            el.transform.jointId = i
            entity.joints.push(el.transform)
            continue
          }
        }
      }
    }
    for (let i = 0; i < entity.joints.length; i++) {
      entity.joints[i].updateMatrixWorld(true)
    }
  },

  getDataFromGltf(entity) {
    entity.geom = { options: {} }
    const primitives = entity.data.primitives
    const node = entity.node

    if (node.rotation) {
      entity.transform.quaternion.x = node.rotation[0]
      entity.transform.quaternion.y = node.rotation[1]
      entity.transform.quaternion.z = node.rotation[2]
      entity.transform.quaternion.w = node.rotation[3]
    }

    if (node.scale) {
      vec3.copy(entity.transform.scale, node.scale)
    }

    if (node.translation) {
      vec3.copy(entity.transform.position, node.translation)
    }

    // todo:  multiple primitives doesn't work.
    for (let i = 0; i < primitives.length; i++) {
      var primitive = primitives[Object.keys(primitives)[i]]

      for (let attribute in primitive.attributes) {
        switch (attribute) {
          case 'NORMAL':
            entity.defines.HAS_NORMALS = 1
            break
          case 'TANGENT':
            entity.defines.HAS_TANGENTS = 1
            break
          case 'TEXCOORD_0':
            entity.defines.HAS_UV = 1
            break
        }
      }

      // Attributes
      for (let attribute in primitive.attributes) {
        this.getAccessorData(entity, primitive.attributes[attribute], attribute)
      }
      // Indices
      this.getAccessorData(entity, primitive.indices, 'INDEX')
    }
  },

  getAccessorData(entity, accessorName, attribute) {
    if (entity.gltf.isDracoCompressed) {
      const data = accessorName.value
      switch (attribute) {
        case 'POSITION':
          entity.geom.vertices = data
          entity.geom.options.vertices = { byteStride: 0, byteOffset: 0 }
          break
        case 'NORMAL':
          entity.geom.normals = data
          entity.geom.options.normals = { byteStride: 0, byteOffset: 12 }
          break
        case 'TANGENT':
          entity.geom.tangents = data
          entity.geom.options.tangents = { byteStride: 0, byteOffset: null }
          break
        case 'TEXCOORD_0':
          entity.geom.uvs = data
          entity.geom.options.uvs = { byteStride: 0, byteOffset: 24 }
          break
        case 'JOINTS_0':
          entity.geom.joints0 = data
          entity.geom.options.joints0 = { byteStride: 0, byteOffset: 40 }
          break
        case 'WEIGHTS_0':
          entity.geom.weights0 = data
          entity.geom.options.weights0 = { byteStride: 0, byteOffset: 56 }
          break
        case 'INDEX':
          entity.geom.indices = data
          entity.geom.options.indices = { byteStride: 0, byteOffset: null }
          break
        default:
          if (attribute.includes('CUSTOM') && (data.constructor == Uint8Array || data.constructor == Uint16Array)) {
            entity.geom.joints0 = new Float32Array(Array.from(data))
            entity.geom.options.joints0 = { byteStride: 0, byteOffset: 40 }
          } else {
            entity.geom.weights0 = data
            entity.geom.options.weights0 = { byteStride: 0, byteOffset: 56 }
          }
        // console.warn('Unknown attribute semantic: ' + attribute);
      }
      return
    }

    const accessor = entity.gltf.accessors[accessorName]
    const bufferView = entity.gltf.bufferViews[accessor.bufferView]
    const arrayBuffer = entity.gltf.bin

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
      const tmpData = []
      for (let i = 0; i < data.length; i++) {
        tmpData.push(data[i])
      }
      data = new Float32Array(tmpData)
    } else {
      console.warn('no type defined for this componentType:', accessor.componentType)
    }

    if (!data) {
      console.warn('no data', accessorName, attribute, data)
    }

    switch (attribute) {
      case 'POSITION':
        entity.geom.vertices = data
        entity.geom.verticesAccessor = accessor
        entity.geom.options.vertices = { byteStride, byteOffset: 0 }
        break
      case 'NORMAL':
        entity.geom.normals = data
        entity.geom.normalsAccessor = accessor
        entity.geom.options.normals = { byteStride, byteOffset: 12 }
        break
      case 'TANGENT':
        entity.geom.tangents = data
        entity.geom.tangentsAccessor = accessor
        entity.geom.options.tangents = { byteStride, byteOffset: null }
        break
      case 'TEXCOORD_0':
        entity.geom.uvs = data
        entity.geom.uvsAccessor = accessor
        entity.geom.options.uvs = { byteStride, byteOffset: null }
        break
      case 'JOINTS_0':
        entity.geom.joints0 = data
        entity.geom.jointsAccessor = accessor
        entity.geom.options.joints = { byteStride, byteOffset: 40 }
        break
      case 'WEIGHTS_0':
        entity.geom.weights0 = data
        entity.geom.weightsAccessor = accessor
        entity.geom.options.weights = { byteStride, byteOffset: 56 }
        break
      case 'INDEX':
        entity.geom.indices = data
        entity.geom.indicesAccessor = accessor
        entity.geom.options.indices = {
          byteStride,
          byteOffset: bufferView.byteOffset ? bufferView.byteOffset : null,
        }
        break
      default:
        console.warn('Unknown attribute semantic: ' + attribute)
    }
  },
}
