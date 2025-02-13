import Stamen from "ol/source/Stamen";

function stamen() {
    return new Stamen({
        layer: 'watercolor'
    })
}

export default stamen;