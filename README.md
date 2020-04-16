# gojs-vue
![GitHub package.json version](https://img.shields.io/github/package-json/v/whu-luojian/gojs-vue)

### Based on [GoJS 2.1](https://gojs.net)

This project provides A Vue component for [GoJS](https://gojs.net/latest/index.html) Diagrams to simplify usage of GoJS within a Vue application.
the implementation of this project is inspired by [gojs-react](https://github.com/NorthwoodsSoftware/gojs-react/blob/master/IMPLEMENTATION.md).

## Installation

gojs-vue can be installed via NPM. This package has peer dependencies on `gojs` and `vue-property-decorator`, so make sure those are also installed or included on your application.

### NPM

```bash
npm install --save gojs-vue
```

## Usage

This package provides one component - VueDiagram - corresponding to the related GoJS classes.

```vue
<template>
  <VueDiagram
    divClassName='vue-diagram'
    :initDiagram="initDiagram"
    :nodeDataArray="nodeDataArray"
    :linkDataArray="linkDataArray"
    :modelData="modelData"
    @modelChange="handleModelChange"
  />
</template>
```

### Component Props

#### initDiagram
Specifies a function that is reponsible for initializing and returning
a GoJS Diagram. This is where the model and templates should be instantiated.
Node and link data do not need to be set up here,
as they will be passed in as separate props.

```js
initDiagram() {
  const $ = go.GraphObject.make
  const diagram = $(go.Diagram, {
    'undoManager.isEnabled': true,
    model: $(go.GraphLinksModel, {
      linkKeyProperty: 'key'
    })
  })
  diagram.nodeTemplate = $(go.Node, 'Auto',
    $(go.Shape, 'RoundedRectangle', { strokeWidth: 0, fill: 'white', portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer' },
      new go.Binding('fill', 'color')),
    $(go.TextBlock, {
      margin: 8,
      font: 'bold 14px sans-serif',
      stroke: '#333'
    },
    new go.Binding('text', 'key'))
  )

  diagram.linkTemplate = $(go.Link,
    new go.Binding('relinkableFrom', 'canRelink').ofModel(),
    new go.Binding('relinkableTo', 'canRelink').ofModel(),
    $(go.Shape),
    $(go.Shape, { toArrow: 'Standard' })
  )

  return diagram
}
```

#### nodeDataArray
Specifies the array of nodes for the Diagram's model.

```js
nodeDataArray: [
  { key: 'Alpha', color: 'lightblue' },
  { key: 'Beta', color: 'orange' },
  { key: 'Gamma', color: 'lightgreen' },
  { key: 'Delta', color: 'pink' }
]
```

#### Optional - divClassName
Specifies the CSS classname to add to the rendered div.
The default style of rendered div is:

```vue
<style scoped>
.gojs-diagram {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
```

#### Optional - linkDataArray
Specifies the array of links for the Diagram's model, only needed when using a GraphLinksModel,
not for Models or TreeModels. If using a GraphLinksModel, make sure to set the GraphLinksModel's
linkKeyProperty in the init function.

```js
linkDataArray: [
  { key: -1, from: 'Alpha', to: 'Beta' },
  { key: -2, from: 'Alpha', to: 'Gamma' },
  { key: -3, from: 'Beta', to: 'Beta' },
  { key: -4, from: 'Gamma', to: 'Delta' },
  { key: -5, from: 'Delta', to: 'Alpha' }
]
```

#### Optional - modelData
Specifies a modelData object for the Diagram's model, only necessary when using properties
that will be shared by the model as a whole.
See [Model.modelData](https://gojs.net/latest/api/symbols/Model.html#modelData).

```js
modelData: {
  canRelink: true
}
```

#### onModelChange
Specifies a function to be called when a GoJS transaction has completed.

```js
handleModelChange(data) {
  const insertedNodeKeys = data.insertedNodeKeys
  const modifiedNodeData = data.modifiedNodeData
  const removedNodeKeys = data.removedNodeKeys
  const insertedLinkKeys = data.insertedLinkKeys
  const modifiedLinkData = data.modifiedLinkData
  const removedLinkKeys = data.removedLinkKeys

  // ... make state changes
}
```

## License

This project is intended to be used alongside [GoJS](https://gojs.net/latest/index.html),
and is covered by the GoJS <a href="https://gojs.net/latest/license.html">software license</a>
