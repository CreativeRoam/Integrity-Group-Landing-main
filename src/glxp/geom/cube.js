export default {
  vertices: {
    size: 3,
    data: new Float32Array([
      -0.5,
      0.5,
      0, // vertex 0
      -0.5,
      -0.5,
      0, // vertex 1
      0.5,
      0.5,
      0, // vertex 2
      0.5,
      -0.5,
      0, // vertex 3
    ]),
  },
  uvs: {
    size: 2,
    data: new Float32Array([
      0,
      1, // vertex 0
      1,
      1, // vertex 1
      0,
      0, // vertex 2
      1,
      0, // vertex 3
    ]),
  },

  // the indices attribute must use the name 'index' to be treated as an ELEMENT_ARRAY_BUFFER
  indices: { data: new Uint16Array([0, 1, 2, 1, 3, 2]) },
}
