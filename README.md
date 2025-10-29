## Dogstudio Webgl Starter

Staging: https://dogstudi-webgl-demo.netlify.app

The Vue starter with all the features you'll need to build blazing-fast websites and applications.

- Vue 3
- Vite
- Prettier
- SCSS/SASS

## Prerequisites

- [Node.js - LTS](https://nodejs.org/en/download/)

## Getting Started

```bash
git clone git@github.com:Dogstudio/dogstudio-vue-starter.git my-new-app
```

```bash
cd my-new-app
cp .env.example .env.local
```

```bash
npm i
npm run dev
```

URL parameters:
```bash
dev=true // show GUI
orbit=true // enable orbit controls and spline editor
```

## Init WebGL Manager 

How to init the webgl Manager :

```
mounted () {
    const glxpManager = WebglManager.init(this.$refs['webgl-main-container'])
    RAF.suscribe('webgl-main', glxpManager.render.bind(glxpManager), 60)

    this.$nextTick(() => {
        // const isMain = DebugController.queryDebug('main')
        WebglManager.loadScene('main').then(() => {
        WebglManager.activate('main')
        })

    })
},
```

## Documentation

We recommend the following documentations to master the stack:

- [Vue](https://vuejs.org/guide/introduction.html)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/introduction.html)
- [Style Guide](https://vuejs.org/v2/style-guide/)
- [Atomic Design Pattern](https://atomicdesign.bradfrost.com/table-of-contents/)

## References

```bash
# Run Vue in development-mode with a local server.
# Visit http://localhost:3000 to see your application running.
npm run dev

# Compile 3D Model from Collada.
npm run model [filename]

# Run Vue in production-mode and creates a production build.
npm run build

# Run Vue in production-mode with a local server.
# Visit http://localhost:3000 to see your production build.
npm run start

# Run ESLint for JS & Vue files
npm run lint

# Upgrade the dependencies and devDependencies with interactive mode
# See: https://www.npmjs.com/package/npm-check-updates
npm run upgrade
```

## Generate textures:
In the terminal at the root of the repo, run:

`npm run texture-lods.sh [directory name] -- [parameters]`

Optional parameters:
- `--wsl` : Use unix basisu bin (for Windows)
- `--flip_y` : Flip ktx2 files
- `--no_override` : Avoid replacing texture if it already exists (useful to convert new textures without updating all textures)

Example: `npm run texture-lods.sh public/glxp/textures/truck/ -- --no_override`

## Useful CLI commands:

1. Compress glb with Draco using gltf-pipeline:

    `gltf-pipeline -i truck.glb -o truck_draco.glb -d`

<br/>

2. Create ORM map from 3 textures using imagemagick:

    `magick convert texture_AO.png texture_Roughness.png texture_Metallic.png -channel RGB -combine texture_ORM.png`

    Note: if a texture is missing, use a white texture to replace it (not black), and adjust the associated channel "power" value. For example, if you have no AO map, use a white image and set OcclusionFactor to 0.



## Contributing

Please submit issues, pull requests or [contact us](devops@dogstudio.be). We are open to all kind of contributions.

## License

The `dogstudio-vue-starter` repository is [MIT licensed](/LICENSE.md).
