import { vec3 }               from 'gl-matrix'

class MeshEntityUtils {
  constructor(entity) {
    this.entity = entity
  }

  getImageInfo(uri, uniformName) {
    this.entity.localState.uniforms[uniformName] = { 'type': 'texture', 'uri': uri, 'textIndx': this.entity.maxTextureIndex }
    this.entity.maxTextureIndex++
  }
  
  defineUniform(uniformName, type, configName, defaultValue) {
    this.entity.localState.uniforms[uniformName] = { type, value: defaultValue || this.entity.config[configName].value }
  }
  
  defineTexture(uniformName, defineName, textureURI) {
    if (textureURI) {
      this.getImageInfo(textureURI, uniformName)
      this.entity.defines[defineName] = 1
    } else if (this.entity.localState.uniforms[uniformName]) {
      delete this.entity.localState.uniforms[uniformName]
    }
  }
  
  setConfigValue(configName, materialValue) {
    this.entity.config[configName].value = materialValue !== undefined ? materialValue : this.entity.config[configName].value
  }

  cleanConfig() {
    if (!this.entity.gui) return

    if (this.entity.defines['HAS_OCCLUSIONMAP'] == undefined && this.entity.defines['HAS_ORM_MAP'] == undefined) {
      this.entity.gui.params['OcclusionFactor'].hidden = true
    }
    if (this.entity.defines['HAS_EMISSIVECOLOR'] == undefined) {
      this.entity.gui.params['EmissiveColor'].hidden = true
      this.entity.gui.params['EmissivePower'].hidden = true
    }
    if (this.entity.defines['HAS_SHEEN'] == undefined) {
      this.entity.gui.params['SheenColor'].hidden = true
      this.entity.gui.params['SheenOpacity'].hidden = true
      this.entity.gui.params['SheenDepth'].hidden = true
    }
  }

  setTransformFromNode(node) {
    if (node.rotation) {
      this.entity.transform.quaternion.x = node.rotation[0]
      this.entity.transform.quaternion.y = node.rotation[1]
      this.entity.transform.quaternion.z = node.rotation[2]
      this.entity.transform.quaternion.w = node.rotation[3]
    }

    if (node.scale) {
      vec3.copy(this.entity.transform.scale, node.scale)
    }

    if (node.translation) {
      vec3.copy(this.entity.transform.position, node.translation)
    }
  }
}

export default MeshEntityUtils
