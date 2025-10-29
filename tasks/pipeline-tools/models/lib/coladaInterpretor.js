
function getVerticesData(data, sp){
    for (let j = 0; j < data["vertices"].length; j++) {
        const vertice = data["vertices"][j]
        if (vertice["$"]["id"] === sp.vertices.source) {
            let srcID = vertice["input"][0]["$"]["source"].split('#').join('')
            for (let k = 0; k < data["source"].length; k++) {
                const src = data["source"][k];
                if (src["$"]["id"] === srcID) {
                   return source = new Float32Array(src["float_array"][0]["_"].split(' '))
                }
            }
        }
    }
}

function getVertexDataFromID(data, srcID){
    for (let k = 0; k < data["source"].length; k++) {
        const src = data["source"][k];
        if (src["$"]["id"] === srcID) {
            return source = new Float32Array(src["float_array"][0]["_"].split(' '))
        }
    }
}


class Interpretor {
    constructor(objFromXml, options){
        this.input = objFromXml
        this.parts = []

        this.options      = options || {}
        this.onlyVertices = this.options.onlyVertices || false
        this.scale        = this.options.scale || 1        
        this.mergeUV      = this.options.mergeUV || false        
        this.flipUV       = this.options.flipUV || false        
        this.indexed      = this.options.indexed || true        
        this.optimize     = true

        this.materials = []
        
        if (this.options.optimize === false) {
            this.optimize = false
        }                

        this.getAllMaterials()
        this.findParts()

        return this.parts
    }

    walkNode(objects, parent){
        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            let name = obj["$"]["name"]

            console.log(" ")
            console.log('Found Object :', name)
            console.log("--------")
            console.log('|-- Parent :', parent)
            

            let geomMat = null

            if (obj["instance_geometry"] && obj["instance_geometry"][0]["bind_material"] !== undefined) {
                let mat = obj["instance_geometry"][0]["bind_material"][0]["technique_common"][0]["instance_material"][0]["$"]
                let matId = mat.target.split('#')[1]
                for (let j = 0; j < this.materials.length; j++) {
                    const m = this.materials[j]
                    if (matId == m.id) {
                        geomMat = m.name
                    }
                }
            }

            let geomId
            let controllerId

            if (obj["instance_geometry"] !== undefined) {
                geomId = obj["instance_geometry"][0]["$"]["url"].split('#').join('')
            } else if (obj["instance_controller"] !== undefined){
                console.log("|---- Rigged Object Detected")
                controllerId = obj["instance_controller"][0]["$"]["url"].split('#').join('')
                geomId = this.getGeomIdFromControllerId(controllerId)
            }
            
            let translate = [
                parseFloat(obj["translate"][0]["_"].split(' ')[0]),
                parseFloat(obj["translate"][0]["_"].split(' ')[1]),
                parseFloat(obj["translate"][0]["_"].split(' ')[2]),
            ]
            let scale = [
                parseFloat(obj["scale"][0]["_"].split(' ')[0]),
                parseFloat(obj["scale"][0]["_"].split(' ')[1]),
                parseFloat(obj["scale"][0]["_"].split(' ')[2]),
            ]

            let rotation = [
                parseFloat(obj["rotate"][1]["_"].split(' ')[3]) * (Math.PI / 180),
                parseFloat(obj["rotate"][0]["_"].split(' ')[3]) * (Math.PI / 180),
                parseFloat(obj["rotate"][2]["_"].split(' ')[3]) * (Math.PI / 180),
            ]

            let sid = null
            if (obj["$"]["sid"] !== undefined) {
                sid = obj["$"]["sid"]                
            }
            
            let geoms = this.computeGeomForID(geomId)

            let skin = null
            let skinData = null
            if (controllerId !== undefined) {
                skin = name + "_skin"
                skinData = this.computeSkinForId(controllerId)
                Object.assign(skinData, {
                    infos: {
                        name: name + "_skin",
                        type: "Skin",
                        parent: name
                    }
                })                
                this.parts.push(skinData)
            }

            if (geoms != undefined) {
                for (let j = 0; j < geoms.length; j++) {
                    const _geom = geoms[j];
                    console.log("|---- Object num vertices :", _geom.indices.length)
                    if (!name.includes("discard")) {
                        this.parts.push({
                            name: name,
                            type: _geom.type,
                            translate: translate,
                            scale: scale,
                            rotation: rotation,
                            parent: parent,
                            material: geomMat,
                            skin: skin,
                            vertices: _geom.vertices,
                            normal: _geom.normals != undefined ? _geom.normals : null,
                            uvs: _geom.uvs != undefined ? _geom.uvs : null,
                            indices: this.options.skipIndicies == true ? null : _geom.indices,
                            vertexIndex: this.options.skipIndicies == true ? null : _geom.vertexIndex,
                        })
                    }
                }
            } else if (geoms == null) {   
                if (!name.includes("discard")) {
                    this.parts.push({
                        name: name,
                        type: "Null",
                        translate: translate, 
                        scale: scale,
                        rotation: rotation,
                        parent: parent,
                        sid: sid,
                    })
                }
            }

            if (obj["node"]) {                                
                this.walkNode(obj["node"], name)
            }            

        }
    }

    findParts(){

        let col = this.input.COLLADA
        
        let objects = col["library_visual_scenes"][0]["visual_scene"][0]["node"]
        
        this.walkNode(objects, null)

        // this.parts.reverse()

        // Merge UV
        if (this.mergeUV) {

            let sames = {}
            let names = []

            for (let i = 0; i < this.parts.length; i++) {
                const element = this.parts[i];
                names.push(element.name)
                for (let j = 0; j < names.length; j++) {
                    if (names[j] === element.name) {                        
                        if (sames[names[j].name] == undefined) {
                            sames[names[j].name] = {
                                root: i,
                                subs: [],
                                merged: 0
                            }
                        } else {
                            if (sames[names[j].name].subs.indexOf(i) === -1) {
                                sames[names[j].name].subs.push(i)
                            }
                        }
                    }
                }
            }

            for (const key in sames) {
                if (sames.hasOwnProperty(key)) {
                    const element = sames[key]; 
                    for (let i = 0; i < element.subs.length; i++) {
                        const sub = element.subs[i];
                        element.merged ++
                        this.parts[element.root]["uvs_" + element.merged] = this.parts[sub].uvs
                        this.parts.splice(sub, 1)
                    }
                    
                }
            }
        }
    }
    

    getAllMaterials(){
        let col = this.input.COLLADA
        if (col["library_materials"]) {
            let materials = col["library_materials"][0]["material"]
            for (let i = 0; i < materials.length; i++) {
                const element = materials[i]
                this.materials.push(element["$"])
            }
        }
    }

    getGeomIdFromControllerId(id){
        let col = this.input.COLLADA
        let geomId
        let controllers = col["library_controllers"]
        let controller    
        
        
        for (let i = 0; i < controllers.length; i++) {
            for (let j = 0; j < controllers[i]["controller"].length; j++) {
                const element = controllers[i]["controller"][j]      
                if (element["$"]["id"] === id) {
                    controller = element
                }
            }
        }
        
        return controller["skin"][0]["$"]["source"].split('#').join('')
        
    }

    computeSkinForId(id){

        let col = this.input.COLLADA
        let geomId
        let controllers = col["library_controllers"]
        let controller

        for (let i = 0; i < controllers.length; i++) {
            for (let j = 0; j < controllers[i]["controller"].length; j++) {
                const element = controllers[i]["controller"][j]      
                if (element["$"]["id"] === id) {
                    controller = element
                }
            }
        }

        // Get bones node data 
        let skin = controller["skin"][0]
        let jointsSourceId, invBindMatrixId

        for (let i = 0; i < skin["joints"][0]["input"].length; i++) {
            const element = skin["joints"][0]["input"][i];
            if (element['$']["semantic"] == "JOINT") {
                jointsSourceId = element['$']["source"].split('#').join('')
            } else if (element['$']["semantic"] == "INV_BIND_MATRIX") {
                invBindMatrixId = element['$']["source"].split('#').join('')
            }
        }

        console.log('|-- Get bones data');

        let jointsSource
        let invBindMatrixSource = []

        for (let i = 0; i < skin["source"].length; i++) {
            const element = skin["source"][i];
            if (element["$"]["id"] == jointsSourceId) {
                jointsSource = element["Name_array"][0]["_"].split(' ')
            } else
            if (element["$"]["id"] == invBindMatrixId) {
                let tmpdata = element["float_array"][0]["_"].split(' ')
                for (let j = 0; j < tmpdata.length / 16; j++) {
                    let tmp = []
                    for (let k = 0; k < 16; k++) {
                        tmp.push(parseFloat(tmpdata[j * 16 + k]))
                    }
                    invBindMatrixSource.push(tmp)
                }
            }
        }
        
        let jointsData = []
        for (let i = 0; i < jointsSource.length; i++) {
            console.log('|-- Found bone sid : ', jointsSource[i]);
            jointsData.push({
                sid: jointsSource[i],
                invBindMatrrix: invBindMatrixSource[i]
            })
        }

        
        // Vertex weight
        console.log('|--- Get weight data');
        
        let skinWeight = skin["vertex_weights"][0]
        let vertexCount = parseInt(skinWeight['$']['count'])
        let maxWeigthsInfluence = 0
        
        let vcount = skinWeight['vcount'][0].split(' ').map((value) => {
            let tmp = parseInt(value)
            if (tmp > maxWeigthsInfluence) {
                maxWeigthsInfluence = tmp
            }            
            return tmp
        })

        console.log('|-- Max weights per vertices :', maxWeigthsInfluence)
        let ndxAttribNumb = Math.ceil(maxWeigthsInfluence / 4)
        console.log('|-- Numb Ndx Atrib :', ndxAttribNumb)
        console.log('|-- Computing ndx and weight')
        

        let weightSourceId
        for (let i = 0; i < skin["vertex_weights"][0]["input"].length; i++) {
            const element = skin["vertex_weights"][0]["input"][i]
            if (element['$']["semantic"] == "WEIGHT") {
                weightSourceId = element['$']["source"].split('#').join('')
            }
        }

        let weightSource
        for (let i = 0; i < skin["source"].length; i++) {
            const element = skin["source"][i];
            if (element["$"]["id"] == weightSourceId) {
                weightSource = element["float_array"][0]["_"].split(' ').map((value)=>{ return parseFloat(value) })
            }
        }

        // skin["vertex_weights"][0]["v"][0].split(' ').map((value) => { return parseInt(value) })
        let tableWeightDatat = skin["vertex_weights"][0]["v"][0].split(' ').map((value) => { return parseInt(value) })
        let tableWeight = []
        for (let i = 0; i < tableWeightDatat.length/2; i++) {
            let tmp = []
            tmp.push(tableWeightDatat[i * 2 + 0])
            tmp.push(tableWeightDatat[i * 2 + 1])
            tableWeight.push(tmp)
        }        

        let weightsData = []
        
        let currentId = 0
        for (let i = 0; i < vcount.length; i++) {
            let tmp = []
            for (let j = 0; j < vcount[i]; j++) {
                tmp.push({
                    sid: tableWeight[currentId][0],
                    weight: weightSource[tableWeight[currentId][1]],
                })
                currentId ++
            }
            weightsData.push(tmp)
        }
        
        
        let attribsNdxData = []
        let attribsWeightData = []
        for (let i = 0; i < ndxAttribNumb; i++) {
            attribsNdxData.push(new Float32Array(4 * vertexCount))
            attribsWeightData.push(new Float32Array(4 * vertexCount))
        }

        for (let i = 0; i < weightsData.length; i++) {
            const element = weightsData[i];
            for (let j = 0; j < element.length; j++) {
                const weight = element[j];                
                let stackId = Math.floor(j/4)
                let innerStackId = j - (stackId * 4)     
                attribsNdxData[stackId][(i * 4) + innerStackId] = weight.sid
                attribsWeightData[stackId][(i * 4) + innerStackId] = weight.weight
            }
            
        }

        let output = {
            joints: jointsData,
            maxJoints: maxWeigthsInfluence,
            attribStackNum: ndxAttribNumb
        }
        for (let i = 0; i < ndxAttribNumb; i++) {
            output["ndx_" + i] = attribsNdxData[i]
            output["weight_" + i] = attribsWeightData[i]
        }
        
        return output

        // console.log(jointsData);
        
        // console.log(jointsSourceId);
        
        
    }


    computeGeomForID(id){

        
        let col = this.input.COLLADA
        
        let geomData
        if (col["library_geometries"] == undefined) {
            return
        }
        let geoms = col["library_geometries"][0]["geometry"]        

        for (let i = 0; i < geoms.length; i++) {
            const element = geoms[i]
            if (element["$"]["id"] === id) {
                geomData = element["mesh"][0]
            }
        }

        if (geomData){
            if (geomData["linestrips"] != undefined) {
                console.log("|-- Object of type : LINE")
                return this.getLineGeom(geomData)
            } else if (geomData["triangles"] != undefined) {
                console.log("|-- Object of type : TRIANGLE")
                return this.getTriangleGeom(geomData)
                // this.getTriangleGeom(geomData)
                // return this.getTriangleGeomNonIndexed(geomData)
            } else {
                console.error('FOUND OBJECT NOT SUPPORTED')
            }
        } else {
            console.log("|-- Object of type : NULL")
            return null
        }

    }

    getLineGeom(data){

        let col = this.input.COLLADA

        let out = []

        let _lineStrips = data["linestrips"]
        let strips = []

        // Get components in JS array 
        for (let i = 0; i < _lineStrips.length; i++) {
            const el = _lineStrips[i]
            let inputs = el["input"]

            let tmpInputs = {
                count: parseFloat(el["$"]["count"])
            }

            for (let j = 0; j < inputs.length; j++) {
                const component = inputs[j]

                if (component["$"]["semantic"] === "VERTEX") {
                    tmpInputs["vertices"] = {
                        offset: component["$"]["offset"],
                        source: component["$"]["source"].split('#').join(''),
                        index: el["p"][j].split(" ")
                    }
                } else {
                    tmpInputs[component["$"]["semantic"]] = {
                        offset: component["$"]["offset"],
                        source: component["$"]["source"].split('#').join(''),
                        index: el["p"][j].split(" ")
                    }
                }
            }

            strips.push(tmpInputs)
        }

        for (let i = 0; i < strips.length; i++) {
            const sp = strips[i]
            
            // Getting positions Array
            let source = getVerticesData(data, sp)

            for (let j = 0; j < source.length; j++) {
                source[j] = source[j] * this.scale
            }

            // Getting indices
            let indices = new Uint32Array(sp["vertices"].index)

            out.push({
                type: 'line',
                vertices: source,
                indices: indices
            })

        }
        return out
    }

    getTriangleGeomNonIndexed(data){

        let col = this.input.COLLADA
        let out = []
        let _triangles = data["triangles"]
        let tris = []

        for (let i = 0; i < _triangles.length; i++) {
            const el = _triangles[i]
            let inputs = el["input"]
            let index = el["p"][0].split(" ").map((value) => { return parseInt(value) })
            let components = []

            let tmpInputs = {
                count: inputs.length,
                index: index
            }

            for (let j = 0; j < inputs.length; j++) {
                const component = inputs[j]
                if (component["$"]["semantic"] === "VERTEX") {
                    tmpInputs["vertices"] = {
                        offset: component["$"]["offset"],
                        source: component["$"]["source"].split('#').join(''),
                    }
                    components.push('vertices')
                } else if (component["$"]["semantic"] === "NORMAL") {
                    tmpInputs["normal"] = {
                        offset: component["$"]["offset"],
                        source: component["$"]["source"].split('#').join(''),
                    }
                    components.push('normal')
                } else if (component["$"]["semantic"] === "TEXCOORD") {
                    tmpInputs["uvs"] = {
                        offset: component["$"]["offset"],
                        source: component["$"]["source"].split('#').join(''),
                    }
                    components.push('uvs')
                } else {
                    tmpInputs[component["$"]["semantic"]] = {
                        offset: component["$"]["offset"],
                        source: component["$"]["source"].split('#').join(''),
                    }
                    components.push(component["$"]["semantic"])
                }
            }

            tmpInputs["components"] = components
            tris.push(tmpInputs)
        }


        for (let i = 0; i < tris.length; i++) {
            const sp = tris[i]

            // Getting positions Array
            let _vertices = getVerticesData(data, sp)

            // Getting normal array
            let _normals = getVertexDataFromID(data, sp.normal.source)

            // Getting uv array
            let _uvs = getVertexDataFromID(data, sp.uvs.source)                        

            // Reconstituing real vertex data
            let instructions = sp.index
            let components   = sp.components
            let vertexDim    = components.length // each component dimension vec3 pos, vec3 norm, vec2 uv

            // Order : vertex, normal, uv
            let vertices = []
            let normals  = []
            let uvs      = []
            let indices  = []
            let index    = 0


            for (let i = 0; i < instructions.length / vertexDim; i++) {

                let vertexIdx = instructions[(i * vertexDim) + 0]
                let normalIdx = instructions[(i * vertexDim) + 1]
                let uvIdx     = instructions[(i * vertexDim) + 2]
                let skip
                let tmp
                

                if (skip === true && this.optimize) {
                    for (let j = 0; j < indices.length; j++) {
                        const idx = indices[j]                    

                        let pos_x = vertices[ j * 3 + 0 ]
                        let pos_y = vertices[ j * 3 + 1 ]
                        let pos_z = vertices[ j * 3 + 2 ]

                        let uv_x = uvs[j * 2 + 0]
                        let uv_y = uvs[j * 2 + 1]
                        if (this.flipUV) {
                            uv_y *= -1
                        } 

                        let idx_of_x = pos_x === _vertices[vertexIdx * 3 + 0] * this.scale
                        let idx_of_y = pos_y === _vertices[vertexIdx * 3 + 1] * this.scale
                        let idx_of_z = pos_z === _vertices[vertexIdx * 3 + 2] * this.scale

                        

                        let idx_of_uv_x = uv_x === _uvs[vertexIdx * 2 + 0]
                        let idx_of_uv_y = uv_y === _uvs[vertexIdx * 2 + 1]                    

                        skip = idx_of_x === true && idx_of_y === true && idx_of_z === true && idx_of_uv_x === true && idx_of_uv_y === true
                        tmp = j

                        if (skip === true && this.optimize) {
                            break
                        }

                    }
                    indices.push(tmp)
                } else {

                    console.log(_vertices[vertexIdx * 3 + 0], _vertices[vertexIdx * 3 + 1], _vertices[vertexIdx * 3 + 2]);


                    indices.push(index)
                    index++

                    vertices.push(_vertices[vertexIdx * 3 + 0] * this.scale)
                    vertices.push(_vertices[vertexIdx * 3 + 1] * this.scale)
                    vertices.push(_vertices[vertexIdx * 3 + 2] * this.scale)

                    normals.push(_normals[normalIdx * 3 + 0])
                    normals.push(_normals[normalIdx * 3 + 1])
                    normals.push(_normals[normalIdx * 3 + 2])

                    uvs.push(_uvs[uvIdx * 2 + 0])
                    uvs.push(_uvs[uvIdx * 2 + 1])
                }

            }                        

            if (this.onlyVertices) {
                out.push({
                    type:       'triangle',
                    vertices:   new Float32Array(vertices),
                    indices:    new Uint32Array(indices)
                })
            } else {
                out.push({
                    type:       'triangle',
                    vertices:   new Float32Array(vertices),
                    normals:    new Float32Array(normals),
                    uvs:        new Float32Array(uvs),
                    indices:    new Uint32Array(indices)
                })
            }


        }
        return out


    }

    getTriangleGeom(data) {

        let col = this.input.COLLADA

        let out = []

        let _triangles = data["triangles"]
        
        let tris = []

        // Get components in JS array 
        for (let i = 0; i < _triangles.length; i++) {
            const el = _triangles[i]
            let inputs = el["input"]
            let index = el["p"][0].split(" ").map((value)=>{return parseInt(value)})
            let components = []

            let tmpInputs = {
                count: inputs.length,
                index: index
            }            

            for (let j = 0; j < inputs.length; j++) {
                const component = inputs[j]
                if (component["$"]["semantic"] === "VERTEX") {
                    tmpInputs["vertices"] = {
                        offset: component["$"]["offset"],
                        source: component["$"]["source"].split('#').join(''),
                    }
                    components.push('vertices')
                } else if (component["$"]["semantic"] === "NORMAL") {
                    tmpInputs["normal"] = {
                        offset: component["$"]["offset"],
                        source: component["$"]["source"].split('#').join(''),
                    }
                    components.push('normal')
                } else if (component["$"]["semantic"] === "TEXCOORD") {
                    tmpInputs["uvs"] = {
                        offset: component["$"]["offset"],
                        source: component["$"]["source"].split('#').join(''),
                    }              
                    components.push('uvs')      
                } else {
                    tmpInputs[component["$"]["semantic"]] = {
                        offset: component["$"]["offset"],
                        source: component["$"]["source"].split('#').join(''),
                    }
                    components.push(component["$"]["semantic"])      
                }
            }

            tmpInputs["components"] = components
            tris.push(tmpInputs)
        }

        for (let i = 0; i < tris.length; i++) {
            const source = tris[i]
            
            source._vertices = getVerticesData(data, source)
            source._normals = getVertexDataFromID(data, source.normal.source)
            source._uvs = getVertexDataFromID(data, source.uvs.source)    

            let vertexAssociated = []
            let vertexAssociatedCode = []
            let vertexPosAssociate = []
            let vertexUvsAssociate = []
            let vertexNormAssociate = []
            
            for (let i = 0; i < source.index.length / source.count; i++) {
                let tmp = []
                for (let j = 0; j < source.count; j++) {
                    tmp.push(source.index[i * source.count + j]);
                }
                vertexAssociated.push(tmp)
                vertexAssociatedCode.push(tmp.join(''))
            
            }

            let discretsElements = []
            let discretsData = []
            let indexTable = []

            let dicreteVerticesIndex = []
            let dicreteVertices = []
            let dicreteNormal = []
            let dicreteUvs = []         

            for (let i = 0; i < vertexAssociatedCode.length; i++) {
                const element = vertexAssociatedCode[i];
                if (discretsElements.indexOf(element) == -1) {
                    let curentIndex = discretsElements.length
                    indexTable.push(curentIndex)
                    discretsElements.push(element)
                    discretsData.push(vertexAssociated[i])
                } else {
                    indexTable.push(discretsElements.indexOf(element))
                }
            }


            for (let i = 0; i < discretsData.length; i++) {
                const data = discretsData[i];
                dicreteVerticesIndex.push(data[0])

                dicreteVertices.push([
                    source._vertices[data[source.vertices.offset] * 3 + 0],
                    source._vertices[data[source.vertices.offset] * 3 + 1],
                    source._vertices[data[source.vertices.offset] * 3 + 2],
                ])

                dicreteNormal.push([
                    source._normals[data[source.normal.offset] * 3 + 0],
                    source._normals[data[source.normal.offset] * 3 + 1],
                    source._normals[data[source.normal.offset] * 3 + 2],
                ])

                dicreteUvs.push([
                    source._uvs[data[source.uvs.offset] * 2 + 0],
                    source._uvs[data[source.uvs.offset] * 2 + 1],
                ])

            }

            let maxNewIndexValue = 0
            for (let i = 0; i < indexTable.length; i++) {
                const element = indexTable[i];
                if (element > maxNewIndexValue) {
                    maxNewIndexValue = element
                }
            }            

            let vertices = []
            for (let i = 0; i < dicreteVertices.length; i++) {
                for (let j = 0; j < dicreteVertices[i].length; j++) {
                    vertices.push(dicreteVertices[i][j])
                }
            }

            let normals = []
            for (let i = 0; i < dicreteNormal.length; i++) {
                for (let j = 0; j < dicreteNormal[i].length; j++) {
                    normals.push(dicreteNormal[i][j])
                }
            }

            let uvs = []
            for (let i = 0; i < dicreteUvs.length; i++) {
                for (let j = 0; j < dicreteUvs[i].length; j++) {
                    uvs.push(dicreteUvs[i][j])
                }
            }            

            
            if (this.onlyVertices) {
                out.push({
                    type:       'triangle',
                    vertices:   new Float32Array(vertices),
                    indices:    new Uint32Array(indexTable),
                    vertexIndex: new Uint32Array(dicreteVerticesIndex),
                })
            } else {
                out.push({
                    type:       'triangle',
                    vertices:   new Float32Array(vertices),
                    normals:    new Float32Array(normals),
                    uvs:        new Float32Array(uvs),
                    indices:    new Uint32Array(indexTable),
                    vertexIndex: new Uint32Array(dicreteVerticesIndex),
                })
            }

        }

        


        // for (let i = 0; i < tris.length; i++) {
        //     const sp = tris[i]

        //     // Getting positions Array
        //     let _vertices = getVerticesData(data, sp)
            
        //     // Getting normal array
        //     let _normals = getVertexDataFromID(data, sp.normal.source)
            
        //     // Getting uv array
        //     let _uvs = getVertexDataFromID(data, sp.uvs.source)                        

        //     // Reconstituing real vertex data
        //     let instructions = sp.index
        //     let components   = sp.components
        //     let vertexDim    = components.length // each component dimension vec3 pos, vec3 norm, vec2 uv
            
        //     // Order : vertex, normal, uv
        //     let vertices = []
        //     let normals  = []
        //     let uvs      = []
        //     let indices  = []
        //     let index    = 0

            
        //     for (let i = 0; i < instructions.length / vertexDim; i++) {
                
        //         let vertexIdx = instructions[(i * vertexDim) + 0]
        //         let normalIdx = instructions[(i * vertexDim) + 1]
        //         let uvIdx     = instructions[(i * vertexDim) + 2]
        //         let skip
        //         let tmp
                
        //         if (skip === true && this.optimize) {
        //             for (let j = 0; j < indices.length; j++) {
        //                 const idx = indices[j]                    
                        
        //                 let pos_x = vertices[ j * 3 + 0 ]
        //                 let pos_y = vertices[ j * 3 + 1 ]
        //                 let pos_z = vertices[ j * 3 + 2 ]

        //                 let uv_x = uvs[j * 2 + 0]
        //                 let uv_y = uvs[j * 2 + 1]
        //                 if (this.flipUV) {
        //                     uv_y *= -1
        //                 } 
                                            
        //                 let idx_of_x = pos_x === _vertices[vertexIdx * 3 + 0] * this.scale
        //                 let idx_of_y = pos_y === _vertices[vertexIdx * 3 + 1] * this.scale
        //                 let idx_of_z = pos_z === _vertices[vertexIdx * 3 + 2] * this.scale

        //                 let idx_of_uv_x = uv_x === _uvs[vertexIdx * 2 + 0]
        //                 let idx_of_uv_y = uv_y === _uvs[vertexIdx * 2 + 1]                    

        //                 skip = idx_of_x === true && idx_of_y === true && idx_of_z === true && idx_of_uv_x === true && idx_of_uv_y === true
        //                 tmp = j

        //                 if (skip === true && this.optimize) {
        //                     break
        //                 }
                                            
        //             }
        //             indices.push(tmp)
        //         } else {
        //             indices.push(index)
        //             index++
    
        //             vertices.push(_vertices[vertexIdx * 3 + 0] * this.scale)
        //             vertices.push(_vertices[vertexIdx * 3 + 1] * this.scale)
        //             vertices.push(_vertices[vertexIdx * 3 + 2] * this.scale)
                    
        //             normals.push(_normals[normalIdx * 3 + 0])
        //             normals.push(_normals[normalIdx * 3 + 1])
        //             normals.push(_normals[normalIdx * 3 + 2])

        //             uvs.push(_uvs[uvIdx * 2 + 0])
        //             uvs.push(_uvs[uvIdx * 2 + 1])
        //         }

        //     }                        

        //     if (this.onlyVertices) {
        //         out.push({
        //             type:       'triangle',
        //             vertices:   new Float32Array(vertices),
        //             indices:    new Uint32Array(indices)
        //         })
        //     } else {
        //         out.push({
        //             type:       'triangle',
        //             vertices:   new Float32Array(vertices),
        //             normals:    new Float32Array(normals),
        //             uvs:        new Float32Array(uvs),
        //             indices:    new Uint32Array(indices)
        //         })
        //     }
                    

        // }
        return out
    }
}

module.exports = Interpretor