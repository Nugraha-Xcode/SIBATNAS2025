import { useContext, useState, useEffect } from "react";
import MapContext from "../MapContext";
import { Group as LayerGroup } from "ol/layer";
import { ImageWMS as ImageWMSSource, ImageArcGISRest } from 'ol/source';
import { Image as ImageLayer } from 'ol/layer';

import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay';
import { Fill, Stroke, Style, Text, Circle } from 'ol/style';

const IndikatorLayer = ({ zIndex = 0, url, setShow, setCoordinate, setContent, layer = "pus_hamil", setKode, level, params }) => {
    const { map } = useContext(MapContext);
    let selected;

    function createStyleRange(feature, field, a, b, c, label) {
        if (feature.get(field) == null) {
            //console.log(feature.get(field))
            var style = new Style({
                fill: new Fill({
                    color: "#ffffff"
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) <= a) {
            console.log(feature.get(field));
            console.log(a);
            var style = new Style({
                fill: new Fill({
                    color: "#9bc31d"
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) > a && feature.get(field) <= b) {
            var style = new Style({
                fill: new Fill({
                    color: "#f4d53c" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) > b && feature.get(field) <= c) {
            var style = new Style({
                fill: new Fill({
                    color: "#e68d0f" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) > c) {
            var style = new Style({
                fill: new Fill({
                    color: "#cb151a" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        }
        // else if ...
        else {
            var style = new Style({
                fill: new Fill({
                    color: "#ffffff" // semi-transparent yellow
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        }
    }

    
    function createStyleRangeRed(feature, field, a, b, c, label) {
        if (feature.get(field) == null) {
            //console.log(feature.get(field))
            var style = new Style({
                fill: new Fill({
                    color: "#ffffff"
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) <= a) {
            console.log(feature.get(field));
            console.log(a);
            var style = new Style({
                fill: new Fill({
                    color: "#cb151a"
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) > a && feature.get(field) <= b) {
            var style = new Style({
                fill: new Fill({
                    color: "#e68d0f" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) > b && feature.get(field) <= c) {
            var style = new Style({
                fill: new Fill({
                    color: "#f4d53c" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) > c) {
            var style = new Style({
                fill: new Fill({
                    color: "#9bc31d" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        }
        // else if ...
        else {
            var style = new Style({
                fill: new Fill({
                    color: "#ffffff" // semi-transparent yellow
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        }
    }


    function createStyleRangeBlue(feature, field, a, b, c, label) {
        if (feature.get(field) == null) {
            //console.log(feature.get(field))
            var style = new Style({
                fill: new Fill({
                    color: "#ffffff"
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) <= a) {
            var style = new Style({
                fill: new Fill({
                    color: '#6575b7'
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) > a && feature.get(field) <= b) {
            var style = new Style({
                fill: new Fill({
                    color: "#9bc31d" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) > b && feature.get(field) <= c) {
            var style = new Style({
                fill: new Fill({
                    color: "#f4d53c" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) > c) {
            var style = new Style({
                fill: new Fill({
                    color: "#cb151a" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        }
        // else if ...
        else {
            var style = new Style({
                fill: new Fill({
                    color: "#ffffff" // semi-transparent yellow
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        }
    }

    function createStyleRangeThree(feature, field, a, b, label) {
        if (feature.get(field) == null) {
            //console.log(feature.get(field))
            var style = new Style({
                fill: new Fill({
                    color: "#ffffff"
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) <= a) {
            var style = new Style({
                fill: new Fill({
                    color: "#9bc31d"
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) > a && feature.get(field) <= b) {
            var style = new Style({
                fill: new Fill({
                    color: "#f4d53c" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) > b) {
            var style = new Style({
                fill: new Fill({
                    color: "#cb151a" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        }
        // else if ...
        else {
            var style = new Style({
                fill: new Fill({
                    color: "#ffffff" // semi-transparent yellow
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        }
    }

    function prev_stunt(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRangeBlue(feature, 'PREV_STUNT', 9.99, 19.99, 29.99, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRangeBlue(feature, 'PREV_STUNT', 9.99, 19.99, 29.99, 'WADMKK')
        } else if (lvl === "kabkot") {
            return null
        } else if (lvl === "kecamatan") {
            return null
        } else if (lvl === "desa") {
            return null
        }
    }

    function prev_wasted(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRangeBlue(feature, 'PREV_WASTE', 4.99, 9.99, 14.99, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRangeBlue(feature, 'PREV_WASTED', 4.99, 9.99, 14.99, 'WADMKK')
        } else if (lvl === "kabkot") {
            return null
        } else if (lvl === "kecamatan") {
            return null
        } else if (lvl === "desa") {
            return null
        }
    }

    function bln_0_23n(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'BLN_0_23N', 8, 12, 15, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'BLN_0_23N', 8, 13, 17, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'BLN_0_23N', 7, 13, 18, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'BLN_0_23N', 7.5, 15, 23, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'BLN_0_23N', 'V', '#ff0000')
        }
    }

    function balitan(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'BALITAN', 21, 24, 27, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'BALITAN', 13, 25, 30, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'BALITAN', 13, 25, 30, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'BALITAN', 20, 30, 40, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'BALITAN', 'V', '#ff0000')
        }
    }

    function riskn(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'RISKN', 55, 65, 75, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'RISKN', 50, 65, 80, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'RISKN', 50, 70, 85, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'RISKN', 60, 75, 90, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIconFour(feature, 'Klasifikas')
        }
    }
    function pushmln(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'PUSHMLN', 3, 3.5, 4, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'PUSHMLN', 3.5, 5, 9, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'PUSHMLN', 3, 6, 16, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'PUSHMLN', 4, 9, 23, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'PUSHMLN', 'V', '#ff0000')
        }
    }
    function jmbnlykbn(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'JMBNLYKBN', 12, 19, 30, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'JMBNLYKBN', 13, 27, 50, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'JMBNLYKBN', 15, 35, 60, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'JMBNLYKBN', 15, 45, 75, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'JMBNLYKBN', 'V', '#ff0000')
        }
    }
    function smbairbn(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'SMBAIRBN', 8, 14, 27, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'SMBAIRBN', 13, 32, 62, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'SMBAIRBN', 13, 35, 70, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'SMBAIRBN', 15, 45, 80, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'SMBAIRBN', 'V', '#ff0000')
        }
    }

    function tll_mudan(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'TLL_MUDAN', 0.8, 1.25, 2, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'TLL_MUDAN', 0.6, 1.2, 1.9, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'TLL_MUDAN', 1, 2, 4.5, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'TLL_MUDAN', 1, 2, 5, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'TLL_MUDAN', 'V', '#ff0000')
        }
    }

    function tll_tuan(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'TLL_TUAN', 23, 25, 26, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'TLL_TUAN', 23, 25, 27, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'TLL_TUAN', 20, 25, 30, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'TLL_TUAN', 15, 23, 27, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'TLL_TUAN', 'V', '#ff0000')
        }
    }


    function tll_dktn(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'TLL_DKTN', 0.6, 0.80, 1.40, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'TLL_DKTN', 1, 2, 3.5, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'TLL_DKTN', 1, 2.5, 5, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'TLL_DKTN', 0.01, 1.2, 2, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'TLL_DKTN', 'V', '#ff0000')
        }
    }
    function tll_bnykn(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'TLL_BNYKN', 20, 25, 37.5, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'TLL_BNYKN', 23, 33, 45, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'TLL_BNYKN', 20, 35, 50, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'TLL_BNYKN', 40, 50, 60, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'TLL_BNYKN', 'V', '#ff0000')
        }
    }
    function kbn(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRangeRed(feature, 'KBN', 36.01, 49.01, 66.01, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRangeRed(feature, 'KBN', 36, 50, 70, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRangeRed(feature, 'KBN', 33, 50, 75, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRangeRed(feature, 'KBN', 24, 36, 48, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleRangeRed(feature, 'KBN', 'V', '#ff0000')
        }
    }
    function risk0n(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'RISK0N', 37, 43, 48, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'RISK0N', 29, 43, 56, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'RISK0N', 27, 46, 67, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'RISK0N', 27, 46, 66, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'RISK0N', 'V', '#ff0000')
        }
    }
    function risk1n(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'RISK1N', 12, 17, 22, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'RISK1N', 13, 21, 34, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'RISK1N', 13, 25, 44, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'RISK1N', 12, 26, 42, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'RISK1N', 'V', '#ff0000')
        }
    }
    function risk2n(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'RISK2N', 8.35, 14, 17, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'RISK2N', 11, 16, 22, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'RISK2N', 9, 17, 24, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'RISK2N', 9, 17, 25, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'RISK2N', 'V', '#ff0000')
        }
    }
    function risk3n(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'RISK3N', 5.97, 13, 15, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'RISK3N', 9, 13, 17, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'RISK3N', 8, 14, 20, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'RISK3N', 8, 15, 22, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'RISK3N', 'V', '#ff0000')
        }
    }
    function risk4n(feature) {
        var lvl = document.getElementById('level').innerHTML;
        if (lvl === "negara") {
            return createStyleRange(feature, 'RISK4N', 8, 11, 13, 'WADMPR')
        } else if (lvl === "provinsi") {
            return createStyleRange(feature, 'RISK4N', 7, 12, 15, 'WADMKK')
        } else if (lvl === "kabkot") {
            return createStyleRange(feature, 'RISK4N', 6, 12, 17, 'WADMKC')
        } else if (lvl === "kecamatan") {
            return createStyleRange(feature, 'RISK4N', 6, 12, 18, 'WADMKD')
        } else if (lvl === "desa") {
            return createStyleIcon(feature, 'RISK4N', 'V', '#ff0000')
        }
    }
    function createStyleIcon(feature, field, value, color) {
        //console.log(feature.get(field), value)
        if (feature.get(field) == value) {
            return new Style({
                image: new Circle({
                    radius: 4,
                    fill: new Fill({
                        color: '#ff0000',
                    }),
                }),
            });
        }
        else {
            return new Style({
                image: new Circle({
                    radius: 4,
                    fill: new Fill({
                        color: '#00ff00',
                    }),
                }),
            });
        }
    }

    function createStyleIconFour(feature, field) {
        //console.log(feature.get(field), value)
        if (feature.get(field) == 'KRS Miskin') {
            return new Style({
                image: new Circle({
                    radius: 4,
                    fill: new Fill({
                        color: '#cb151a',
                    }),
                }),
            });
        }else  if (feature.get(field) == 'Miskin') {
            return new Style({
                image: new Circle({
                    radius: 4,
                    fill: new Fill({
                        color: '#e68d0f',
                    }),
                }),
            });
        }
        else if (feature.get(field) == 'KRS') {
            return new Style({
                image: new Circle({
                    radius: 4,
                    fill: new Fill({
                        color: '#f4d53c',
                    }),
                }),
            });
        }
        else {
            return new Style({
                image: new Circle({
                    radius: 4,
                    fill: new Fill({
                        color: '#9bc31d',
                    }),
                }),
            });
        }
    }

    function create_content(feature, layer, lvl) {
        if (layer == 'prev_stunt')
            return popUpSingle(feature, lvl, 'Prevalensi Stunting', 'PREV_STUNT')
        //else if (layer == 'prev_wasted')
        //    return popUpSingle(feature, lvl, 'Prevalensi Wasted', 'PREV_WASTE')
        else if (layer == 'bln_0_23n')
            return popUpSingle(feature, lvl, 'Persentase Keluarga dengan Anak Usia 0-23 Bulan (Baduta)', 'BLN_0_23N')
        else if (layer == 'balitan')
            return popUpSingle(feature, lvl, 'Persentase Keluarga dengan Anak Usia Balita', 'BALITAN')
        else if (layer == 'riskn')
            return popUpSingle(feature, lvl, 'Persentase Keluarga Beresiko Stunting', 'RISKN')
        else if (layer == 'pushmln')
            return popUpSingle(feature, lvl, 'Persentase PUS Hamil', 'PUSHMLN')
        else if (layer == 'jmbnlykbn')
            return popUpSingle(feature, lvl, 'Persentase Keluarga Sasaran Memiliki Jamban Tidak Layak','JMBNLYKBN')
        else if (layer == 'smbairbn')
            return popUpSingle(feature, lvl, 'Persentase Keluarga Sasaran Memiliki Sumber Air Minum Tidak Layak', 'SMBAIRBN')
        else if (layer == 'tll_mudan')
            return popUpSingle(feature, lvl, 'Presentase PUS Terlalu Muda', 'TLL_MUDAN')
        else if (layer == 'tll_tuan')
            return popUpSingle(feature, lvl, 'Presentase PUS Terlalu Tua', 'TLL_TUAN')
        else if (layer == 'tll_dktn')
            return popUpSingle(feature, lvl, 'Presentase PUS Terlalu Dekat', 'TLL_DKTN')
        else if (layer == 'tll_bnykn')
            return popUpSingle(feature, lvl, 'Presentase PUS Terlalu Banyak', 'TLL_BNYKN')
        else if (layer == 'kbn')
            return popUpSingle(feature, lvl, 'Persentase Keluarga Berpartisipasi KB', 'KBN')
        else if (layer == 'risk0n')
            return popUpSingle(feature, lvl, 'Persentase Keluarga Berisiko 0', 'RISK0N')
        else if (layer == 'risk1n')
            return popUpSingle(feature, lvl, 'Persentase Keluarga Berisiko 1', 'RISK1N')
        else if (layer == 'risk2n')
            return popUpSingle(feature, lvl, 'Persentase Keluarga Berisiko 2', 'RISK2N')
        else if (layer == 'risk3n')
            return popUpSingle(feature, lvl, 'Persentase Keluarga Berisiko 3', 'RISK3N')
        else if (layer == 'risk4n')
            return popUpSingle(feature, lvl, 'Persentase Keluarga Berisiko 4', 'RISK4N')
        
            /*
        else if (lyr == 'pra_sejahtera')
            return popUp(feature, lvl, 'Jumlah Keluarga Pra Sejahtera', 'PRASEJ', 'Presentase Keluarga Pra Sejahtera', 'PRASEJN', 'Keluarga Pra Sejahtera', 'PRASEJ')
        else if (lyr == 'air_minum')
            return popUp(feature, lvl, 'Jumlah Keluarga Sasaran Memiliki Rumah Tidak Layak Huni', 'SMBAIRB', 'Presentase Keluarga Sasaran Memiliki Sumber Air Minum Tidak Layak', 'SMBAIRBN', 'Sumber Air Minum Tidak Layak', 'SMBAIR')
        else if (lyr == 'rumah')
            return popUp(feature, lvl, 'Jumlah Keluarga Sasaran Memiliki Rumah Tidak Layak Huni', 'RMHLYKB', 'Presentase Keluarga Sasaran Memiliki Rumah Tidak Layak Huni', 'RMHLYKBN', 'Rumah Tidak Layak Huni', 'RMHLYK')
        else if (lyr == 'jamban')
            return popUp(feature, lvl, 'Jumlah Keluarga Sasaran Memiliki Jamban Tidak Layak', 'JMBNLYKB', 'Presentase Keluarga Sasaran Memiliki Jamban Tidak Layak', 'JMBNLYKBN', 'Jamban Tidak Layak', 'JMBNLYK')
        else if (lyr == 'stunting')
            return popUpDuo(feature, lvl, 'Prevalensi Stunting', 'PREV_STUNT')
        else if (lyr == 'underweight')
            return popUpDuo(feature, lvl, 'Prevalensi Underweight', 'PREV_UDRWG')
        else if (lyr == 'resiko')
            return popUp(feature, lvl, 'Jumlah Keluarga Beresiko Stunting', 'RISK', 'Presentase Keluarga Beresiko Stunting', 'RISKN', 'Keluarga Beresiko Stunting', 'RISKSTUNT')
        else if (lyr == 'anak_0_23')
            return popUp(feature, lvl, 'Jumlah Keluarga dengan Anak Usia 0-23 Bulan', 'BLN_0_23', 'Persentase Keluarga dengan Anak Usia 0-23 Bulan', 'BLN_0_23N', 'Keluarga dengan Anak Usia 0-23 Bulan', 'BADUTA')
        else if (lyr == 'anak_24_59')
            return popUp(feature, lvl, 'Jumlah Keluarga dengan Anak Usia 24-59 Bulan', 'BLN_24_59', 'Persentase Keluarga dengan Anak Usia 24-59 Bulan', 'BLN_24_59N', 'Keluarga dengan Anak Usia 24-59 Bulan', 'BADUTA')
        else if (lyr == 'balita')
            return popUp(feature, lvl, 'Jumlah Keluarga dengan Anak Usia Balita', 'BALITAB', 'Presentase Keluarga dengan Anak Usia Balita', 'BALITAN', 'Keluarga dengan Anak Usia Balita', 'BALITA')
        else if (lyr == 'stunted')
            return popUpSingle(feature, lvl, 'Kasus Balita Stunted', 'TBUTOT')
            */
    }

    function popUp(feature, lvl, a, b, c, d, e, f) {
        if (lvl === "negara")
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Provinsi {feature.get('WADMPR')}</span><br />Jumlah Keluarga: <b>{parseInt(feature.get('JML_KLG')).toLocaleString('id-ID')}</b><br />Jumlah Keluarga Sasaran: <b>{parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID')}</b><br />{a}: <b>{parseInt(feature.get(b)).toLocaleString('id-ID')}</b><br />{c}: <b>{parseFloat(feature.get(d)).toFixed(2).replace(".", ",")}%</b></>;
        else if (lvl === "provinsi")
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>{String(feature.get('WADMKK')).includes("Kota ") ? feature.get('WADMKK') : "Kabupaten " + feature.get('WADMKK')}</span><br />Jumlah Keluarga: <b>{parseInt(feature.get('JML_KLG')).toLocaleString('id-ID')}</b><br />Jumlah Keluarga Sasaran: <b>{parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID')}</b><br />{a}: <b>{parseInt(feature.get(b)).toLocaleString('id-ID')}</b><br />{c}: <b>{parseFloat(feature.get(d)).toFixed(2).replace(".", ",")}%</b></>;
        else if (lvl === "kabkot")
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Kecamatan {feature.get('WADMKC')}</span><br />Jumlah Keluarga: <b>{parseInt(feature.get('JML_KLG')).toLocaleString('id-ID')}</b><br />Jumlah Keluarga Sasaran: <b>{parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID')}</b><br />{a}: <b>{parseInt(feature.get(b)).toLocaleString('id-ID')}</b><br />{c}: <b>{parseFloat(feature.get(d)).toFixed(2).replace(".", ",")}%</b></>;
        else if (lvl === "kecamatan")
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Desa {feature.get('WADMKD')}</span><br />Jumlah Keluarga: <b>{parseInt(feature.get('JML_KLG')).toLocaleString('id-ID')}</b><br />Jumlah Keluarga Sasaran: <b>{parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID')}</b><br />{a}: <b>{parseInt(feature.get(b)).toLocaleString('id-ID')}</b><br />{c}: <b>{parseFloat(feature.get(d)).toFixed(2).replace(".", ",")}%</b></>;
        else if (lvl === "desa")
            //return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Kepala Keluarga {feature.get('KEP_KLRGA')}</span><br />RT: <b>{feature.get('NAMA_RT')}</b><br />RW: <b>{feature.get('NAMA_RW')}</b><br />{e}: <b>{feature.get(f)}</b></>;
            //return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Kepala Keluarga {feature.get('KEP_KLRGA')}</span><br />RT: <b>{feature.get('NAMA_RT')}</b><br />RW: <b>{feature.get('NAMA_RW')}</b><br />Risiko Stunting: <b>{feature.get('RISKSTUNT')}</b><br />Baduta: <b>{feature.get('BADUTA')}</b><br />Balita: <b>{feature.get('BALITA')}</b><br />PUS: <b>{feature.get('PUS')}</b><br />PUS Hamil: <b>{feature.get('PUS_HML')}</b><br />Anak 7-15 Tahun Tidak Sekolah: <b>{feature.get('ANK_TDK_SKL')}</b><br />Tidak Ada Penghasilan untuk Kebutuhan Pokok per Bulan: <b>{feature.get('PENGHSLAN')}</b><br />Lantai Tanah: <b>{feature.get('LANTAI_TNH')}</b><br />Tidak Makan Makanan Beragam: <b>{feature.get('RGM_MAKAN')}</b><br />Keluarga Pra Sejahtera: <b>{feature.get('PRASEJ')}</b><br />Tidak Ada Sumber Air Minum Layak: <b>{feature.get('SMBAIR')}</b><br />Tidak Ada Jamban Layak: <b>{feature.get('JMBNLYK')}</b><br />Tidak Punya Rumah Layak: <b>{feature.get('RMHLYK')}</b><br />Pendidikan Ibu Di Bawah SLTP: <b>{feature.get('PDDKIBU')}</b><br />PUS Terlalu Muda: <b>{feature.get('TRLLMUDA')}</b><br />PUS Terlalu Tua: <b>{feature.get('TRLLTUA')}</b><br />PUS Terlalu Dekat: <b>{feature.get('TRLLDKT')}</b><br />PUS Terlalu Banyak: <b>{feature.get('TRLLBNYK')}</b></>;
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Kepala Keluarga {feature.get('KEP_KLRGA')}</span><br />RT: <b>{feature.get('NAMA_RT')}</b><br />RW: <b>{feature.get('NAMA_RW')}</b><br />Risiko Stunting: <b>{feature.get('RISKSTUNT')}</b><br />Baduta: <b>{feature.get('BADUTA')}</b><br />Balita: <b>{feature.get('BALITA')}</b><br />PUS: <b>{feature.get('PUS')}</b><br />PUS Hamil: <b>{feature.get('PUSHMLN')}</b><br />Tidak Ada Sumber Air Minum Layak: <b>{feature.get('SMBAIR')}</b><br />Tidak Ada Jamban Layak: <b>{feature.get('JMBNLYK')}</b><br />PUS Terlalu Muda: <b>{feature.get('TRLLMUDA')}</b><br />PUS Terlalu Tua: <b>{feature.get('TRLLTUA')}</b><br />PUS Terlalu Dekat: <b>{feature.get('TRLLDKT')}</b><br />PUS Terlalu Banyak: <b>{feature.get('TRLLBNYK')}</b></>;
    }
    function popUpDuo(feature, lvl, a, b) {
        if (lvl === "negara")
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Provinsi {feature.get('WADMPR')}</span><br />Jumlah Keluarga: <b>{parseInt(feature.get('JML_KLG')).toLocaleString('id-ID')}</b><br />Jumlah Keluarga Sasaran: <b>{parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID')}</b><br />{a}: <b>{parseFloat(feature.get(b)).toFixed(2).replace(".", ",")}%</b></>;
        else if (lvl === "provinsi")
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>{String(feature.get('WADMKK')).includes("Kota ") ? feature.get('WADMKK') : "Kabupaten " + feature.get('WADMKK')}</span><br />Jumlah Keluarga: <b>{parseInt(feature.get('JML_KLG')).toLocaleString('id-ID')}</b><br />Jumlah Keluarga Sasaran: <b>{parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID')}</b><br />{a}: <b>{parseFloat(feature.get(b)).toFixed(2).replace(".", ",")}%</b></>;
        else if (lvl === "kabkot")
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Kecamatan {feature.get('WADMKC')}</span><br />Jumlah Keluarga: <b>{parseInt(feature.get('JML_KLG')).toLocaleString('id-ID')}</b><br />Jumlah Keluarga Sasaran: <b>{parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID')}</b><br />{a}: <b>{parseFloat(feature.get(b)).toFixed(2).replace(".", ",")}%</b></>;
        else if (lvl === "kecamatan")
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Desa {feature.get('WADMKD')}</span><br />Jumlah Keluarga: <b>{parseInt(feature.get('JML_KLG')).toLocaleString('id-ID')}</b><br />Jumlah Keluarga Sasaran: <b>{parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID')}</b><br />{a}: <b>{parseFloat(feature.get(b)).toFixed(2).replace(".", ",")}%</b></>;
        else if (lvl === "desa")
            //return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Kepala Keluarga {feature.get('KEP_KLRGA')}</span><br />RT: <b>{feature.get('NAMA_RT')}</b><br />RW: <b>{feature.get('NAMA_RW')}</b><br />Risiko Stunting: <b>{feature.get('RISKSTUNT')}</b><br />Baduta: <b>{feature.get('BADUTA')}</b><br />Balita: <b>{feature.get('BALITA')}</b><br />PUS: <b>{feature.get('PUS')}</b><br />PUS Hamil: <b>{feature.get('PUS_HML')}</b><br />Anak 7-15 Tahun Tidak Sekolah: <b>{feature.get('ANK_TDK_SKL')}</b><br />Tidak Ada Penghasilan untuk Kebutuhan Pokok per Bulan: <b>{feature.get('PENGHSLAN')}</b><br />Lantai Tanah: <b>{feature.get('LANTAI_TNH')}</b><br />Tidak Makan Makanan Beragam: <b>{feature.get('RGM_MAKAN')}</b><br />Keluarga Pra Sejahtera: <b>{feature.get('PRASEJ')}</b><br />Tidak Ada Sumber Air Minum Layak: <b>{feature.get('SMBAIR')}</b><br />Tidak Ada Jamban Layak: <b>{feature.get('JMBNLYK')}</b><br />Tidak Punya Rumah Layak: <b>{feature.get('RMHLYK')}</b><br />Pendidikan Ibu Di Bawah SLTP: <b>{feature.get('PDDKIBU')}</b><br />PUS Terlalu Muda: <b>{feature.get('TRLLMUDA')}</b><br />PUS Terlalu Tua: <b>{feature.get('TRLLTUA')}</b><br />PUS Terlalu Dekat: <b>{feature.get('TRLLDKT')}</b><br />PUS Terlalu Banyak: <b>{feature.get('TRLLBNYK')}</b></>;
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Kepala Keluarga {feature.get('KEP_KLRGA')}</span><br />RT: <b>{feature.get('NAMA_RT')}</b><br />RW: <b>{feature.get('NAMA_RW')}</b><br />Risiko Stunting: <b>{feature.get('RISKSTUNT')}</b><br />Baduta: <b>{feature.get('BADUTA')}</b><br />Balita: <b>{feature.get('BALITA')}</b><br />PUS: <b>{feature.get('PUS')}</b><br />PUS Hamil: <b>{feature.get('PUSHMLN')}</b><br />Tidak Ada Sumber Air Minum Layak: <b>{feature.get('SMBAIR')}</b><br />Tidak Ada Jamban Layak: <b>{feature.get('JMBNLYK')}</b><br />PUS Terlalu Muda: <b>{feature.get('TRLLMUDA')}</b><br />PUS Terlalu Tua: <b>{feature.get('TRLLTUA')}</b><br />PUS Terlalu Dekat: <b>{feature.get('TRLLDKT')}</b><br />PUS Terlalu Banyak: <b>{feature.get('TRLLBNYK')}</b></>;

    }
    function popUpSingle(feature, lvl, a, b) {
        if (lvl === "negara")
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Provinsi {feature.get('WADMPR')}</span><br />Jumlah Keluarga: <b>{parseInt(feature.get('JML_KLG')).toLocaleString('id-ID')}</b><br />Jumlah Keluarga Sasaran: <b>{parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID')}</b><br />{a}: <b>{parseInt(feature.get(b)).toLocaleString('id-ID')}%</b></>;
        else if (lvl === "provinsi")
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>{String(feature.get('WADMKK')).includes("Kota ") ? feature.get('WADMKK') : "Kabupaten " + feature.get('WADMKK')}</span><br />Jumlah Keluarga: <b>{parseInt(feature.get('JML_KLG')).toLocaleString('id-ID')}</b><br />Jumlah Keluarga Sasaran: <b>{parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID')}</b><br />{a}: <b>{parseInt(feature.get(b)).toLocaleString('id-ID')}%</b></>;
        else if (lvl === "kabkot")
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Kecamatan {feature.get('WADMKC')}</span><br />Jumlah Keluarga: <b>{parseInt(feature.get('JML_KLG')).toLocaleString('id-ID')}</b><br />Jumlah Keluarga Sasaran: <b>{parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID')}</b><br />{a}: <b>{parseInt(feature.get(b)).toLocaleString('id-ID')}%</b></>;
        else if (lvl === "kecamatan")
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Desa {feature.get('WADMKD')}</span><br />Jumlah Keluarga: <b>{parseInt(feature.get('JML_KLG')).toLocaleString('id-ID')}</b><br />Jumlah Keluarga Sasaran: <b>{parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID')}</b><br />{a}: <b>{parseInt(feature.get(b)).toLocaleString('id-ID')}%</b></>;
        else if (lvl === "desa")
            return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Kepala Keluarga {feature.get('NAMA_KK')}</span><br />Jenis Kelamin: <b>{feature.get('JNS_KLMN')}</b><br />Alamat: <b>{feature.get('ALAMAT')}</b><br />No Urut Rumah: <b>{feature.get('N_URUTRMH')}</b><br />Risiko Stunting: <b>{feature.get('RISK')}</b><br />Baduta: <b>{feature.get('BADUTA')}</b><br />Balita: <b>{feature.get('BALITA')}</b><br />PUS: <b>{feature.get('PUS')}</b><br />PUS Hamil: <b>{feature.get('PUS_HAMIL')}</b><br />Sumber Air Minum Tidak Layak: <b>{feature.get('AIRTDKLYK')}</b><br />Jamban Tidak Layak: <b>{feature.get('JMBNTDKLYK')}</b><br />PUS Terlalu Muda: <b>{feature.get('TLL_MUDA')}</b><br />PUS Terlalu Tua: <b>{feature.get('TLL_TUA')}</b><br />PUS Terlalu Dekat: <b>{feature.get('TLL_DKT')}</b><br />PUS Terlalu Banyak: <b>{feature.get('TLL_BNYK')}</b><br />Foto: <br /><img src={feature.get('FOTO1')} width="120px" /><br /><img src={feature.get('FOTO2')} width="120px" /><br /><img src={feature.get('FOTO3')} width="120px" /><br /><img src={feature.get('FOTO4')} width="120px" /></>;           
            //return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Kepala Keluarga {feature.get('KEP_KLRGA')}</span><br />RT: <b>{feature.get('NAMA_RT')}</b><br />RW: <b>{feature.get('NAMA_RW')}</b><br />Risiko Stunting: <b>{feature.get('RISKSTUNT')}</b><br />Baduta: <b>{feature.get('BADUTA')}</b><br />Balita: <b>{feature.get('BALITA')}</b><br />PUS: <b>{feature.get('PUS')}</b><br />PUS Hamil: <b>{feature.get('PUS_HML')}</b><br />Anak 7-15 Tahun Tidak Sekolah: <b>{feature.get('ANK_TDK_SKL')}</b><br />Tidak Ada Penghasilan untuk Kebutuhan Pokok per Bulan: <b>{feature.get('PENGHSLAN')}</b><br />Lantai Tanah: <b>{feature.get('LANTAI_TNH')}</b><br />Tidak Makan Makanan Beragam: <b>{feature.get('RGM_MAKAN')}</b><br />Keluarga Pra Sejahtera: <b>{feature.get('PRASEJ')}</b><br />Tidak Ada Sumber Air Minum Layak: <b>{feature.get('SMBAIR')}</b><br />Tidak Ada Jamban Layak: <b>{feature.get('JMBNLYK')}</b><br />Tidak Punya Rumah Layak: <b>{feature.get('RMHLYK')}</b><br />Pendidikan Ibu Di Bawah SLTP: <b>{feature.get('PDDKIBU')}</b><br />PUS Terlalu Muda: <b>{feature.get('TRLLMUDA')}</b><br />PUS Terlalu Tua: <b>{feature.get('TRLLTUA')}</b><br />PUS Terlalu Dekat: <b>{feature.get('TRLLDKT')}</b><br />PUS Terlalu Banyak: <b>{feature.get('TRLLBNYK')}</b></>;
            //return <><span style={{ fontWeight: 'bolder', color: '#2F4E6F' }}>Kepala Keluarga {feature.get('NAMA_KK')}</span><br />RT: <b>{feature.get('NAMA_RT')}</b><br />RW: <b>{feature.get('NAMA_RW')}</b><br />Risiko Stunting: <b>{feature.get('RISKSTUNT')}</b><br />Baduta: <b>{feature.get('BADUTA')}</b><br />Balita: <b>{feature.get('BALITA')}</b><br />PUS: <b>{feature.get('PUS')}</b><br />PUS Hamil: <b>{feature.get('PUS_HML')}</b><br />Tidak Ada Sumber Air Minum Layak: <b>{feature.get('SMBAIR')}</b><br />Tidak Ada Jamban Layak: <b>{feature.get('JMBNLYK')}</b><br />PUS Terlalu Muda: <b>{feature.get('TRLLMUDA')}</b><br />PUS Terlalu Tua: <b>{feature.get('TRLLTUA')}</b><br />PUS Terlalu Dekat: <b>{feature.get('TRLLDKT')}</b><br />PUS Terlalu Banyak: <b>{feature.get('TRLLBNYK')}</b></>;
    }

    function createStyleFour(feature, field, color, value, label) {
        console.log(field)
        if (feature.get(field) == value[0]) {
            var style = new Style({
                fill: new Fill({
                    color: color[0] // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) == value[1]) {
            var style = new Style({
                fill: new Fill({
                    color: color[1] // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) == value[2]) {
            var style = new Style({
                fill: new Fill({
                    color: color[2]// semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) == value[3]) {
            var style = new Style({
                fill: new Fill({
                    color: color[3]// semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        }
        // else if ...
        else {
            var style = new Style({
                fill: new Fill({
                    color: "#ffffff" // semi-transparent yellow
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        }
    }

    function createStyleThree(feature, field, color, value, label) {
        if (feature.get(field) == value[0]) {
            var style = new Style({
                fill: new Fill({
                    color: color[0] // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) == value[1]) {
            var style = new Style({
                fill: new Fill({
                    color: color[1] // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) == value[2]) {
            var style = new Style({
                fill: new Fill({
                    color: color[2]// semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        }
        // else if ...
        else {
            var style = new Style({
                fill: new Fill({
                    color: "#ffffff" // semi-transparent yellow
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        }
    }
    function createStyleEqual(feature, field, color, value, label) {
        if (feature.get(field) == value[0]) {
            var style = new Style({
                fill: new Fill({
                    color: color[0] // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else if (feature.get(field) == value[1]) {
            var style = new Style({
                fill: new Fill({
                    color: color[1] // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        } else {
            var style = new Style({
                fill: new Fill({
                    color: "#ffffff" // semi-transparent yellow
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });
            style.getText().setText(feature.get(label));
            return (style)
        }
    }


    useEffect(() => {
        if (!map) return;
        /*
        var wmsSource = new ImageWMSSource({
            url: 'https://geoportal.big.go.id/geoserver/bkkbn/wms',
            params: params,
            ratio: 1,
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
        });
        var wmsLayer = new ImageLayer({
            source: wmsSource,
            visible: true
        })
        wmsLayer.set('id', 'indikator_layer')
        map.addLayer(wmsLayer);
        console.log('indikator layer is initialized');
        if(params){
            wmsSource.updateParams(params);
        }
        */

        var sourceIndikator = new VectorSource({ format: new GeoJSON() });
        const vectorLayer = new VectorLayer({
            zindex: zIndex,
            source: sourceIndikator,
        });

        vectorLayer.set('id', 'indikator_layer')
        map.addLayer(vectorLayer);
        if (url)
            sourceIndikator.setUrl(url)

        const selectedStyle = new Style({
            stroke: new Stroke({
                color: 'rgba(0, 245, 255, 0.7)',
                width: 3,
            }),
        });

        const featureSelected = new VectorLayer({
            source: new VectorSource(),
            style: selectedStyle,
        });
        featureSelected.set('id', 'selected_layer')
        map.addLayer(featureSelected);

        map.on('singleclick', function (evt) {
            //
            //setShow(true);
            //setCoordinate(evt.coordinate);
            //setContent(url)
            vectorLayer.getFeatures(evt.pixel).then(function (features) {
                //console.log(features);
                const feature = features.length ? features[0] : undefined;
                //const info = document.getElementById('info');
                if (features.length) {
                    setShow(true);
                    setCoordinate(evt.coordinate);
                    var lyr = document.getElementById('layer').innerHTML;
                    var lvl = document.getElementById('level').innerHTML;
                    var k = create_content(feature, lyr, lvl);
                    console.log(k)
                    setContent(k);
                    featureSelected.getSource().clear();
                    featureSelected.getSource().addFeature(feature);
                    //console.log(feature);
                    if (lvl === "negara")
                        setKode(feature.get('KDPPUM'))
                    else if (lvl === "provinsi")
                        setKode(feature.get('KDPKAB'))
                    else if (lvl === "kabkot")
                        setKode(feature.get('KDCPUM'))
                    else if (lvl === "kecamatan")
                        setKode(feature.get('KDEPUM'))
                    else if (lvl === "desa")
                        setKode(feature.get('KDEPUM'))
                } else {
                    setShow(false);
                    featureSelected.getSource().clear();
                }
            })
        })

        map.on('pointermove', function (evt) {
            if (evt.dragging) {
                return;
            }
            const pixel = map.getEventPixel(evt.originalEvent);
            vectorLayer.getFeatures(pixel).then(function (features) {
                const feature = features.length ? features[0] : undefined;
                //const info = document.getElementById('info');
                if (features.length) {
                    document.body.style.cursor = 'pointer'
                } else {
                    document.body.style.cursor = 'default'
                }
            })
        });

        return () => {
            if (map) {
                //map.removeLayer(wmsLayer);
                map.removeLayer(vectorLayer);
            }
        };
    }, [map]);

    useEffect(() => {
        if (!map) return;
        let layers = map.getLayers().getArray();
        var idx = 0;
        layers.forEach(function (l, i) {
            if (l.get("id") === 'indikator_layer') {
                idx = i;
            }
        })

        var sourceIndikator = layers[idx].getSource();
        if (url) {
            console.log(url);
            console.log(sourceIndikator);
            sourceIndikator.setUrl(url);
            sourceIndikator.refresh();
        }

    }, [url]);

    /*
    useEffect(() => {
        if (!map) return;
        let layers = map.getLayers().getArray();
        var idx = 0;
        layers.forEach(function (l, i) {
            if (l.get("id") === 'indikator_layer') {
                idx = i;
            }
        })
        //layers[idx].setVisible(false)
        var sourceIndikator = layers[idx].getSource();
        
        if (params) {
           // console.log(params);
            //layers[idx].setVisible(true)
            sourceIndikator.updateParams(params);
            sourceIndikator.refresh();
        }
        
    }, [params]);
    */

    useEffect(() => {
        if (!map) return;

        let layers = map.getLayers().getArray();
        var idx = 0;
        layers.forEach(function (l, i) {
            if (l.get("id") === 'selected_layer') {
                idx = i;
            }
        })
        var sourceSelected = layers[idx].getSource();
        //console.log(sourceSelected)
        sourceSelected.clear()

        var idx = 0;
        layers.forEach(function (l, i) {
            if (l.get("id") === 'indikator_layer') {
                idx = i;
            }
        })

        if (layer == 'prev_stunt')
            layers[idx].setStyle(prev_stunt);
        //else if (layer == 'prev_wasted')
        //    layers[idx].setStyle(prev_wasted);
        else if (layer == 'bln_0_23n')
            layers[idx].setStyle(bln_0_23n);
        else if (layer == 'balitan')
            layers[idx].setStyle(balitan);
        else if (layer == 'riskn')
            layers[idx].setStyle(riskn);
        else if (layer == 'pushmln')
            layers[idx].setStyle(pushmln);
        else if (layer == 'jmbnlykbn')
            layers[idx].setStyle(jmbnlykbn);
        else if (layer == 'smbairbn')
            layers[idx].setStyle(smbairbn);
        else if (layer == 'tll_mudan')
            layers[idx].setStyle(tll_mudan);
        else if (layer == 'tll_tuan')
            layers[idx].setStyle(tll_tuan);
        else if (layer == 'tll_dktn')
            layers[idx].setStyle(tll_dktn);
        else if (layer == 'tll_bnykn')
            layers[idx].setStyle(tll_bnykn);
        else if (layer == 'kbn')
            layers[idx].setStyle(kbn);
        else if (layer == 'risk0n')
            layers[idx].setStyle(risk0n);
        else if (layer == 'risk1n')
            layers[idx].setStyle(risk1n);
        else if (layer == 'risk2n')
            layers[idx].setStyle(risk2n);
        else if (layer == 'risk3n')
            layers[idx].setStyle(risk3n);
        else if (layer == 'risk4n')
            layers[idx].setStyle(risk4n);
    
            else
            layers[idx].getSource().clear();

    }, [layer]);

    return null;
};
export default IndikatorLayer;