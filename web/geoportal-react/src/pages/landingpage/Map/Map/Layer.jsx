import {
    Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, Divider,
    DialogTitle, FormControl, IconButton, ImageList, ImageListItem, ImageListItemBar, InputLabel,
    ListSubheader, MenuItem, Paper, Select, Tab, Tabs, TextField, Typography, styled,
    List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Popover, Slider
} from "@mui/material";

import { useState } from 'react';
import Draggable from 'react-draggable';
import { CheckBox, CheckBoxOutlineBlank, Close } from "@mui/icons-material";

import DeleteIcon from '@mui/icons-material/Delete';
import { GetApp, ListAlt, MoreVert, ZoomIn, Download, Language } from "@mui/icons-material";

//import { makeStyles } from '@mui/styles';
function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}
/*
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        //backgroundColor: theme.palette.background.paper,
    },
    imageList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: "lightgray",
    },
    titleActive: {
        color: "lightgreen",
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },

}));
*/
export default function Layer({ open, handleCloseLayer, mapLayer, deleteDataset, handleVisible, setZoomToMap, handleOpacity, setShowIndikator }) {

    //const classes = useStyles();

    const [value, setValue] = useState(0);

    const [idCountry, setIdCountry] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [id, setId] = useState(null);
    const [row, setRow] = useState(null);


    const handleChangeSelect = (event) => {
        setIdCountry(event.target.value);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setId(row.id)
        setRow(row)
        //console.log(row)
    };



    const handleClose = () => {
        handleCloseLayer(false);
    };

    const handleClosePop = () => {
        setAnchorEl(null);
      };

    const handleSetZoomMap = () => {
        setZoomToMap(id);
        console.log(id)
        setAnchorEl(null);
    }

    const openPop = Boolean(anchorEl);
    const idpop = openPop ? 'simple-popover' : undefined;


    function getListLayers() {
        if (mapLayer !== 'undefined') {

            if (mapLayer.length > 0) {

                return mapLayer.map((row, index) => {
                    //console.log(row)
                    //console.log(row.id.includes('uploader'))
                    //onChange={(e) => props.setLayerVisible(row.id)}

                    const labelId = `checkbox-list-label-${index}`;
                    return (
                        <>
                            <ListItem key={index} role={undefined} dense button style={{ padding: '0px' }}>
                                <ListItemIcon style={{ minWidth: '16px' }}>
                                    <Checkbox
                                        edge="start"
                                        checked={row.visible}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                        onClick={() => handleVisible(row.id)}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${row.title}`} style={{ fontSize: '10px', maxWidth: '350px' }} />
                                <ListItemSecondaryAction style={{ right: '0px' }}>
                                    <IconButton edge="end" aria-label="comments" onClick={() => deleteDataset(row.id)} >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="comments" onClick={(e) => handleClick(e, row)} >
                                        <MoreVert />
                                    </IconButton>
                                </ListItemSecondaryAction>
                                <br />
                            </ListItem>
                            <div style={{paddingRight: '10px'}}>
                            <Slider
                                value={row.opacity} min={0} max={1} step={0.01}
                                onChange={(e, v) => handleOpacity(row.id, v)}
                                
                            />
                            </div>
                        </>
                    )
                })
                //value={row.opacity} onChange={(e) => props.handleOpacity(row.id, e.target.value)}
            } else {
                return <TitleDataContent>Tidak ada layer</TitleDataContent>
            }
        }

    }



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
                    <h5 style={{ margin: '0px' }}>Pengelolaan Peta</h5>
                    <IconButton size="small" onClick={handleClose} >
                        <Close />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent style={{ minHeight: "42vh", padding: '5px' }} >
                <DataContent>
                   {
                    /*
                   <p style={{ margin: '0px' }}><b>Batas Administrasi </b></p>
                   <List>
                        {
                            //getListLayers()
                        }

                    </List>
                   */
                   }
                   <Divider />
                   <TopButton>
                   <Button size="small" fullWidth variant="contained" color="primary" style={{ marginBottom:"20px", padding: "5px 15px", borderRadius: "20px" }}  onClick={() => setShowIndikator(true)}>Lihat Daftar Indikator</Button>
                   </TopButton>
                   <Divider />
                   <p style={{ margin: '0px' }}><b>Daftar Layer Peta [{mapLayer.length}] </b></p>
                    <List>
                        {
                            getListLayers()
                        }

                    </List>
                    <Popover
                        id={idpop}
                        open={openPop}
                        anchorEl={anchorEl}
                        onClose={handleClosePop}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >

                        {
                            //<Typography>The content of the Popover. {identifier}</Typography>
                            id &&
                            <List component="nav" aria-label="main mailbox folders">
                                <ListItem button style={{ paddingTop: "0px", paddingBottom: "0px" }} onClick={() => handleSetZoomMap()}>
                                    <ListItemIcon style={{ minWidth: '40px' }}>
                                        <ZoomIn />
                                    </ListItemIcon>
                                    <ListItemText primary="Zoom To" />
                                </ListItem>
                                <ListItem button style={{ paddingTop: "0px", paddingBottom: "0px" }} onClick={() => handleSetZoomMap()}>
                                    <ListItemIcon style={{ minWidth: '40px' }}>
                                        <ListAlt />
                                    </ListItemIcon>
                                    <ListItemText primary="View Metadata" />
                                </ListItem>
                                <ListItem button style={{ paddingTop: "0px", paddingBottom: "0px" }} onClick={() => handleSetZoomMap()}>
                                    <ListItemIcon style={{ minWidth: '40px' }}>
                                        <Download />
                                    </ListItemIcon>
                                    <ListItemText primary="Download" />
                                </ListItem>
                                <ListItem button style={{ paddingTop: "0px", paddingBottom: "0px" }} onClick={() => handleSetZoomMap()}>
                                    <ListItemIcon style={{ minWidth: '40px' }}>
                                        <Language />
                                    </ListItemIcon>
                                    <ListItemText primary="Url Webservice" />
                                </ListItem>

                            </List>
                        }
                    </Popover>
                </DataContent>
            </DialogContent>

        </Dialog>
    )
}

const TitleDataContent = styled.p`
  margin:0px;
  color:#888;
`;
const TopButton = styled.div`
  margin-top: 15px;
`;

const DataContent = styled.div`
  padding: 15px;
  max-height:68vh;
  overflow-y: auto;
  overflow-x: hidden;
`;