import { Vue } from 'vue-property-decorator';
import * as go from 'gojs';
export default class VueDiagram extends Vue {
    private divEle;
    divClassName?: string;
    initDiagram: () => go.Diagram;
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray?: Array<go.ObjectData>;
    modelData?: go.ObjectData;
    private modelChangedListener;
    getDiagram(): go.Diagram | null;
    private updateDiagram;
}
