import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper } from "@material-ui/core";
import styled from "styled-components";
import { useState } from 'react';
import Draggable from 'react-draggable';
import { Close } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core";
import JSZip from 'jszip';
import shp from "shpjs";

function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

const newDataStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10),
    },
    wrapper: {
        display: "flex",
        //justifyContent: "space-between", 
        //alignItems: "left",
    },
    form: {
        flex: 1,
        margin: "10px",
        padding: "10px",
        boxShadow: "0px 0px 10px -1px rgba(0,0,0,0.35)",
        //-webkit-box-shadow: 0px 0px 10px -1px rgba(0,0,0,0.35);
        //-moz-box-shadow: 0px 0px 10px -1px rgba(0,0,0,0.35);
    },
    right: {
        flex: 1,
        padding: "10px"
    },
    title: {
        color: "#555",
        backgroundColor: "#eee",
        padding: "5px 10px",
        borderRadius: "10px",
        marginBottom: theme.spacing(1)
    },
    input: {
        marginBottom: theme.spacing(1)
    },
    cancel: {
        marginRight: theme.spacing(1),
    },
    bottom: {
        marginTop: theme.spacing(2)
    },
    list: {
        marginTop: theme.spacing(2),
    }
}));

export default function ImportData({ open, handleCloseImportData, setMapLayer }) {

    const classes = newDataStyles();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
    const [shapeFile, setShapeFile] = useState();
    const [fileName, setFileName] = useState();
    
    /*
      function onFileChange(event) {

        // Update the state
        setSelectedFile(event.target.files[0])
        //console.log(event.target.files[0])
        //console.log(event.target)
        var a = document.getElementsByClassName('custom-file-label');
        //console.log(a);
        if(typeof (event.target.files[0].name) !== 'undefined')
            a[0].innerHTML = event.target.files[0].name
        else
            a[0].innerHTML = 'Upload File'
    } 
      
    */
    function onFileChange(event) {
        
        // Update the state
        if (event.target.files.length > 0) {
            setSelectedFile(event.target.files)


            var filesInput = event.target.files[0];
            var list = document.getElementById("list");

            JSZip.loadAsync(filesInput)                                   // 1) read the Blob
                .then(function (zip) {
                    setFileName(event.target.files[0].name.replace(".zip", ""))

                    var tabel = '<ul>';
                    var cek = false;
                    zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
                        //console.log(zipEntry.name);
                        if (zipEntry.name.includes(".shp")) {
                            if (!zipEntry.name.includes(".xml")) {
                                cek = true;
                                setShapeFile(zipEntry.name.replace(".xml", ""))
                                //fetchStore(zipEntry.name.replace(".xml", ""))
                            }

                        }
                        tabel += "<li>" + zipEntry.name + "</li>";
                        //$fileContent.append($("<li>", {
                        //    text: zipEntry.name
                        //}));
                    });
                    tabel += '</ul>';
                    if (cek) {
                        list.innerHTML = tabel;
                        //setList(tabel)
                    } else {
                        list.innerHTML = 'File not found in the given zip file';
                        setShapeFile();
                        //setList('File not found in the given zip file');
                    }
                }, function (e) {
                    console.log(e.message)
                });

        }

    }

    function onFileUpload() {

        if (selectedFile) {
            console.log(selectedFile)
            //console.log(selectedStyle)
            if (selectedFile[0].name.slice(-3) !== 'zip') {
                alert('please upload zip file!')
            } else {
                var reader = new FileReader();
                reader.onload = function () {
                    if (reader.readyState !== 2 || reader.error) {
                        return;
                    } else {
                        convertToLayer(reader.result, selectedFile[0].name);
                    }
                }
                reader.readAsArrayBuffer(selectedFile[0]); 

            }           
        }
    }

    function convertToLayer(buffer, name){
        //console.log(buffer)
        shp(buffer).then(function(geojson){	//More info: https://github.com/calvinmetcalf/shapefile-js
            //var layer = L.shapefile(geojson).addTo(map);//More info: https://github.com/calvinmetcalf/leaflet.shapefile
            //console.log(layer);
            console.log(geojson)
            //setBuffer(oldArray => [...oldArray, { id: 'uploader'+name, data: geojson }])
            //setMapLayer(oldArray => [...oldArray, { id: 'uploader' + name, title: props.buffer[0].data.fileName, server: 'local', tipe: 'zip', url: '', layer: '', original: '', pdf: '', geojson: '', kml: '', gml: '', shp: '', csv: '', excel: '', metadata: false, table: false, visible: true, opacity: 1 }]);
            //props.addBuffer(geojson)
            setMapLayer(oldArray => [...oldArray, { id: 'uploader' + name, title: name, server: 'local', tipe: 'zip', url: 'local', geom: geojson.features[0].geometry.type,layer: geojson, metadata: false, table: true, visible: true, opacity: 1 }])

            handleClose()
            setLoading(false)
            setSelectedFile()
            //props.addDataset({ id: 'uploader'+name, title: name, wms: '', kml: '', gml: '', shp: '', csv: '', excel: '' })
                        
        });
        
    }
        

    const handleSubmit = (e) => {

        e.preventDefault();
        
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            onFileUpload();
        }
    };


    function validateForm() {
        return  !loading && selectedFile && selectedFile.length > 0 && shapeFile;
    }



    const handleClose = () => {
        handleCloseImportData(false);
        setSelectedFile();
    };

    return (
        <Dialog
            open={open}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            fullWidth={true}
            maxWidth="xs"

        >
            <DialogTitle style={{ cursor: 'move', padding: '5px 10px', backgroundColor: '#f3f3f3' }} id="draggable-dialog-title">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Impor Data - Unggah Shapefile</span>
                    <IconButton size="small" onClick={handleClose}  >
                        <Close />
                    </IconButton>
                </div>


            </DialogTitle>
            <form onSubmit={(e) => handleSubmit(e)}>

            <DialogContent style={{ minHeight: "10vh" }} >
               
                    <div className={classes.input}>
                        <label htmlFor="file">Unggah Zip Shapefile (.zip)</label>
                    </div>

                    <label htmlFor="dataFile">
                        <input
                            id="dataFile"
                            name="btn-upload"
                            style={{ display: 'none' }}
                            type="file"
                            onChange={(e) => onFileChange(e)}
                        />
                        <Button
                            className="btn-choose"
                            variant="outlined"
                            component="span" 
                            size="small"
                            style={{ padding: "5px 15px", borderRadius: "20px" }}  
                        >
                            Pilih Berkas
                        </Button>
                    </label>
                    <div className="file-name">
                        {selectedFile && selectedFile.length > 0 ? selectedFile[0].name : null}
                    </div>
                    <div id="list" className={classes.list}>

                    </div>

                    <div className={classes.bottom}>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.cancel}
                    onClick={handleClose}
                    size="small"
                    style={{ padding: "5px 15px", borderRadius: "20px" }} 
                >
                    Batal
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    type="submit"
                    disabled={!validateForm()}
                    size="small"
                    style={{ padding: "5px 15px", borderRadius: "20px" }} 
                >
                    Proses
                </Button>
            </DialogActions>
            </form>
        </Dialog>
    )
}
