import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputBase, MenuItem, Paper, Tab, Tabs, TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { useState } from 'react';
import Draggable from 'react-draggable';
import { Close } from "@material-ui/icons";
import PropTypes from 'prop-types';
import {
    alpha,
    ThemeProvider,
    withStyles,
    makeStyles,
    createTheme,
} from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import JSZip from 'jszip';

import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
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


export default function Statistic({ open, handleCloseDigsig }) {
    const classes = useStyles();

    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    
    const [selectedFile, setSelectedFile] = useState();
    const [shapeFile, setShapeFile] = useState();
    const [digitalSignature, setDigitalSignature] = useState();
    
    const [fileName, setFileName] = useState();

    const handleCloseBackDrop = () => {
        setOpenBackdrop(false);
    };

  

    const handleClose = () => {
        handleCloseDigsig(false);
        setDigitalSignature();
        setSelectedFile();
        setError(false);
        setSuccess(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        
    };

    function onFileChange(event) {
        // Update the state
        setDigitalSignature();
        setSelectedFile();
        setError(false);
        setSuccess(false);

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
                        if (zipEntry.name.includes("digital_signature.png")) {
                            setDigitalSignature(zipEntry.name)
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

    
    function validateForm() {
        return  !loading && selectedFile && selectedFile.length > 0 && shapeFile;
    }

    const handleSubmit = (e) => {

        e.preventDefault();
        
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            setTimeout(
                function(){ 
                     
                    setLoading(false);
                    if (digitalSignature) {
                        setSuccess(true);
                        setError(false);
                    }else{
                        setError(true);
                        setSuccess(false)
                    }
                }
            , 10000);
            //onFileUpload();
        }
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
                    <span>Check Digital Signature</span>
                    <IconButton size="small" onClick={handleClose} >
                        <Close />
                    </IconButton>
                </div>


            </DialogTitle>
            <form onSubmit={(e) => handleSubmit(e)}>
            <DialogContent style={{ minHeight: "10vh", padding: '0px' }} >
                <Paper square>
                    <Tabs
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChange}
                        aria-label="select and search area study"
                        variant="fullWidth"
                    >
                        <Tab label="File Verification" {...a11yProps(0)} />
                    </Tabs>
                </Paper>
                <TabPanel value={value} index={0}>
                    
                    
                <div className={classes.input}>
                        <label htmlFor="file">Upload Zip Shape File (.zip)</label>
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
                            component="span" size="small" >
                            Choose Files
                        </Button>
                    </label>
                    <Backdrop className={classes.backdrop} open={openBackdrop} >
                        <CircularProgress color="inherit"  />
                    </Backdrop>
                    <div className="file-name">
                        {selectedFile && selectedFile.length > 0 ? selectedFile[0].name : null}
                    </div>
                    <div id="list" className={classes.list}>

                    </div>

                    <div className={classes.bottom}>
                        {
                            //variant="determinate"
                        }
                        {loading && <><CircularProgress size={24} value={85} className={classes.buttonProgress} /> Processing..</>}
                        {success && <Alert severity="success">File is VALID from BADAN INFORMASI GEOSPASIAL</Alert>}
                        {error && <Alert severity="error">File is NOT VALID</Alert>}
                    </div>
                </TabPanel>

            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.cancel}
                    onClick={handleClose}
                    size="small"
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    type="submit"
                    disabled={!validateForm()}
                    size="small"
                >
                    Submit
                </Button>
            </DialogActions>
            </form>
        </Dialog>
    )
}


const FormInput = styled.div`
  margin:0px;
  display: flex;
`;

const Label = styled.div`
    width: 150px;
`;
const Entry = styled.div`
    flex-grow: 1;
    display: flex;
`;

const EntryMiddle = styled.div`
    flex-grow: 1;
    padding-right: 10px;
`;