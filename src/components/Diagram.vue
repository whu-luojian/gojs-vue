<template>
  <div ref="divRef" class="gojs-diagram" :class="divClassName"></div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Ref, Watch } from 'vue-property-decorator'
import * as go from 'gojs'

@Component({})
export default class VueDiagram extends Vue {
  @Ref('divRef') private divEle: HTMLDivElement

  @Prop() divClassName?: string
  @Prop() initDiagram!: () => go.Diagram
  @Prop() nodeDataArray!: Array<go.ObjectData>
  @Prop() linkDataArray?: Array<go.ObjectData>
  @Prop() modelData?: go.ObjectData

  private modelChangedListener: ((e: go.ChangedEvent) => void) | null = null

  public getDiagram (): go.Diagram | null {
    return this.divEle ? go.Diagram.fromDiv(this.divEle) : null
  }

  /**
   * @internal
   */
  @Watch('divClassName')
  updateDiagramClass () {
    this.$nextTick(() => {
      const diagram = this.getDiagram()
      diagram.requestUpdate()
    })
  }

  /**
   * @internal
   */
  @Watch('nodeDataArray', { deep: true })
  updateNodeDataArray () {
    this.updateDiagram()
  }

  /**
   * @internal
   */
  @Watch('linkDataArray', { deep: true })
  updateLinkDataArray () {
    this.updateDiagram()
  }

  /**
   * @internal
   */
  mounted () {
    const diagram = this.initDiagram()
    diagram.div = this.divEle
    diagram.delayInitialization(() => {
      const model = diagram.model
      model.commit((m: go.Model) => {
        m.mergeNodeDataArray(m.cloneDeep(this.nodeDataArray))
        if (!!this.linkDataArray && m instanceof go.GraphLinksModel) {
          m.mergeLinkDataArray(m.cloneDeep(this.linkDataArray))
        }
        if (this.modelData) {
          m.assignAllDataProperties(m.modelData, this.modelData)
        }
      }, null)
    })

    this.modelChangedListener = (e: go.ChangedEvent) => {
      if (e.isTransactionFinished) {
        const dataChanges = e.model.toIncrementalData(e)
        if (dataChanges !== null) {
          this.$emit('modelChange', dataChanges)
        }
      }
    }
    diagram.addModelChangedListener(this.modelChangedListener)
  }

  /**
   * @internal
   */
  beforeDestroy () {
    const diagram = this.getDiagram()
    if (diagram) {
      diagram.div = null
      if (this.modelChangedListener !== null) {
        diagram.removeModelChangedListener(this.modelChangedListener)
        this.modelChangedListener = null
      }
    }
  }

  private updateDiagram () {
    const diagram = this.getDiagram()
    if (diagram) {
      const model = diagram.model
      if (this.modelChangedListener !== null) {
        model.removeChangedListener(this.modelChangedListener)
      }
      model.startTransaction('update data')
      model.mergeNodeDataArray(model.cloneDeep(this.nodeDataArray))
      if (!!this.linkDataArray && model instanceof go.GraphLinksModel) {
        model.mergeLinkDataArray(model.cloneDeep(this.linkDataArray))
      }
      if (this.modelData) {
        model.assignAllDataProperties(model.modelData, this.modelData)
      }
      model.commitTransaction('update data')
      if (this.modelChangedListener !== null) {
        model.addChangedListener(this.modelChangedListener)
      }
    }
  }
}
</script>

<style scoped>
.gojs-diagram {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
