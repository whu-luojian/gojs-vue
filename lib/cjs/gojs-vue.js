/**
 * gojs-vue
 * v1.0.0
 * by whu-luojian
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var vuePropertyDecorator = require('vue-property-decorator');
var go = require('gojs');

var VueDiagram = /** @class */ (function (_super) {
    tslib.__extends(VueDiagram, _super);
    function VueDiagram() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.modelChangedListener = null;
        return _this;
    }
    VueDiagram.prototype.getDiagram = function () {
        return this.divEle ? go.Diagram.fromDiv(this.divEle) : null;
    };
    /**
     * @internal
     */
    VueDiagram.prototype.updateDiagramClass = function () {
        var _this = this;
        this.$nextTick(function () {
            var diagram = _this.getDiagram();
            diagram.requestUpdate();
        });
    };
    /**
     * @internal
     */
    VueDiagram.prototype.updateNodeDataArray = function () {
        this.updateDiagram();
    };
    /**
     * @internal
     */
    VueDiagram.prototype.updateLinkDataArray = function () {
        this.updateDiagram();
    };
    /**
     * @internal
     */
    VueDiagram.prototype.mounted = function () {
        var _this = this;
        var diagram = this.initDiagram();
        diagram.div = this.divEle;
        diagram.delayInitialization(function () {
            var model = diagram.model;
            model.commit(function (m) {
                m.mergeNodeDataArray(m.cloneDeep(_this.nodeDataArray));
                if (!!_this.linkDataArray && m instanceof go.GraphLinksModel) {
                    m.mergeLinkDataArray(m.cloneDeep(_this.linkDataArray));
                }
                if (_this.modelData) {
                    m.assignAllDataProperties(m.modelData, _this.modelData);
                }
            }, null);
        });
        this.modelChangedListener = function (e) {
            if (e.isTransactionFinished) {
                var dataChanges = e.model.toIncrementalData(e);
                if (dataChanges !== null) {
                    _this.$emit('modelChange', dataChanges);
                }
            }
        };
        diagram.addModelChangedListener(this.modelChangedListener);
    };
    /**
     * @internal
     */
    VueDiagram.prototype.beforeDestroy = function () {
        var diagram = this.getDiagram();
        if (diagram) {
            diagram.div = null;
            if (this.modelChangedListener !== null) {
                diagram.removeModelChangedListener(this.modelChangedListener);
                this.modelChangedListener = null;
            }
        }
    };
    VueDiagram.prototype.updateDiagram = function () {
        var diagram = this.getDiagram();
        if (diagram) {
            var model = diagram.model;
            if (this.modelChangedListener !== null) {
                model.removeChangedListener(this.modelChangedListener);
            }
            model.startTransaction('update data');
            model.mergeNodeDataArray(model.cloneDeep(this.nodeDataArray));
            if (!!this.linkDataArray && model instanceof go.GraphLinksModel) {
                model.mergeLinkDataArray(model.cloneDeep(this.linkDataArray));
            }
            if (this.modelData) {
                model.assignAllDataProperties(model.modelData, this.modelData);
            }
            model.commitTransaction('update data');
            if (this.modelChangedListener !== null) {
                model.addChangedListener(this.modelChangedListener);
            }
        }
    };
    tslib.__decorate([
        vuePropertyDecorator.Ref('divRef')
    ], VueDiagram.prototype, "divEle", void 0);
    tslib.__decorate([
        vuePropertyDecorator.Prop()
    ], VueDiagram.prototype, "divClassName", void 0);
    tslib.__decorate([
        vuePropertyDecorator.Prop()
    ], VueDiagram.prototype, "initDiagram", void 0);
    tslib.__decorate([
        vuePropertyDecorator.Prop()
    ], VueDiagram.prototype, "nodeDataArray", void 0);
    tslib.__decorate([
        vuePropertyDecorator.Prop()
    ], VueDiagram.prototype, "linkDataArray", void 0);
    tslib.__decorate([
        vuePropertyDecorator.Prop()
    ], VueDiagram.prototype, "modelData", void 0);
    tslib.__decorate([
        vuePropertyDecorator.Watch('divClassName')
    ], VueDiagram.prototype, "updateDiagramClass", null);
    tslib.__decorate([
        vuePropertyDecorator.Watch('nodeDataArray', { deep: true })
    ], VueDiagram.prototype, "updateNodeDataArray", null);
    tslib.__decorate([
        vuePropertyDecorator.Watch('linkDataArray', { deep: true })
    ], VueDiagram.prototype, "updateLinkDataArray", null);
    VueDiagram = tslib.__decorate([
        vuePropertyDecorator.Component({})
    ], VueDiagram);
    return VueDiagram;
}(vuePropertyDecorator.Vue));

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = VueDiagram;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    ref: "divRef",
    staticClass: "gojs-diagram",
    class: _vm.divClassName
  })
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-3757022f_0", { source: "\n.gojs-diagram[data-v-3757022f] {\r\n  position: relative;\r\n  width: 100%;\r\n  height: 100%;\n}\r\n", map: {"version":3,"sources":["D:\\work\\packages\\github\\gojs-vue\\src\\components\\Diagram.vue"],"names":[],"mappings":";AAwHA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;AACA","file":"Diagram.vue","sourcesContent":["<template>\r\n  <div ref=\"divRef\" class=\"gojs-diagram\" :class=\"divClassName\"></div>\r\n</template>\r\n\r\n<script lang='ts'>\r\nimport { Component, Vue, Prop, Ref, Watch } from 'vue-property-decorator'\r\nimport * as go from 'gojs'\r\n\r\n@Component({})\r\nexport default class VueDiagram extends Vue {\r\n  @Ref('divRef') private divEle: HTMLDivElement\r\n\r\n  @Prop() divClassName?: string\r\n  @Prop() initDiagram!: () => go.Diagram\r\n  @Prop() nodeDataArray!: Array<go.ObjectData>\r\n  @Prop() linkDataArray?: Array<go.ObjectData>\r\n  @Prop() modelData?: go.ObjectData\r\n\r\n  private modelChangedListener: ((e: go.ChangedEvent) => void) | null = null\r\n\r\n  public getDiagram (): go.Diagram | null {\r\n    return this.divEle ? go.Diagram.fromDiv(this.divEle) : null\r\n  }\r\n\r\n  /**\r\n   * @internal\r\n   */\r\n  @Watch('divClassName')\r\n  updateDiagramClass () {\r\n    this.$nextTick(() => {\r\n      const diagram = this.getDiagram()\r\n      diagram.requestUpdate()\r\n    })\r\n  }\r\n\r\n  /**\r\n   * @internal\r\n   */\r\n  @Watch('nodeDataArray', { deep: true })\r\n  updateNodeDataArray () {\r\n    this.updateDiagram()\r\n  }\r\n\r\n  /**\r\n   * @internal\r\n   */\r\n  @Watch('linkDataArray', { deep: true })\r\n  updateLinkDataArray () {\r\n    this.updateDiagram()\r\n  }\r\n\r\n  /**\r\n   * @internal\r\n   */\r\n  mounted () {\r\n    const diagram = this.initDiagram()\r\n    diagram.div = this.divEle\r\n    diagram.delayInitialization(() => {\r\n      const model = diagram.model\r\n      model.commit((m: go.Model) => {\r\n        m.mergeNodeDataArray(m.cloneDeep(this.nodeDataArray))\r\n        if (!!this.linkDataArray && m instanceof go.GraphLinksModel) {\r\n          m.mergeLinkDataArray(m.cloneDeep(this.linkDataArray))\r\n        }\r\n        if (this.modelData) {\r\n          m.assignAllDataProperties(m.modelData, this.modelData)\r\n        }\r\n      }, null)\r\n    })\r\n\r\n    this.modelChangedListener = (e: go.ChangedEvent) => {\r\n      if (e.isTransactionFinished) {\r\n        const dataChanges = e.model.toIncrementalData(e)\r\n        if (dataChanges !== null) {\r\n          this.$emit('modelChange', dataChanges)\r\n        }\r\n      }\r\n    }\r\n    diagram.addModelChangedListener(this.modelChangedListener)\r\n  }\r\n\r\n  /**\r\n   * @internal\r\n   */\r\n  beforeDestroy () {\r\n    const diagram = this.getDiagram()\r\n    if (diagram) {\r\n      diagram.div = null\r\n      if (this.modelChangedListener !== null) {\r\n        diagram.removeModelChangedListener(this.modelChangedListener)\r\n        this.modelChangedListener = null\r\n      }\r\n    }\r\n  }\r\n\r\n  private updateDiagram () {\r\n    const diagram = this.getDiagram()\r\n    if (diagram) {\r\n      const model = diagram.model\r\n      if (this.modelChangedListener !== null) {\r\n        model.removeChangedListener(this.modelChangedListener)\r\n      }\r\n      model.startTransaction('update data')\r\n      model.mergeNodeDataArray(model.cloneDeep(this.nodeDataArray))\r\n      if (!!this.linkDataArray && model instanceof go.GraphLinksModel) {\r\n        model.mergeLinkDataArray(model.cloneDeep(this.linkDataArray))\r\n      }\r\n      if (this.modelData) {\r\n        model.assignAllDataProperties(model.modelData, this.modelData)\r\n      }\r\n      model.commitTransaction('update data')\r\n      if (this.modelChangedListener !== null) {\r\n        model.addChangedListener(this.modelChangedListener)\r\n      }\r\n    }\r\n  }\r\n}\r\n</script>\r\n\r\n<style scoped>\r\n.gojs-diagram {\r\n  position: relative;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n</style>\r\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-3757022f";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

exports.VueDiagram = __vue_component__;
