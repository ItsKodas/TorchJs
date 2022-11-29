const fs = require('fs')

const Package = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
const ProductionPackage = {
    name: Package.name,
    version: Package.version,
    description: Package.description,
    main: 'index.js',
    type: 'module',
    repository: Package.repository,
    start: "node --experimental-specifier-resolution=node .",
    dependencies: Package.dependencies
}

fs.writeFileSync('./dist/package.json', JSON.stringify(ProductionPackage, null, '\t'))