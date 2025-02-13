import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, ImageList, ImageListItem, ImageListItemBar, InputLabel, ListSubheader, MenuItem, Paper, Select, Tab, Tabs, TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { useState } from 'react';
import Draggable from 'react-draggable';
import { CheckBox, CheckBoxOutlineBlank, CheckBoxOutlined, CheckCircle, CheckCircleOutlined, Close, Info, StarBorder } from "@material-ui/icons";

import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import rbi from './Layers/Basemap/thumbs/rbi.png';
import osm from './Layers/Basemap/thumbs/osm.png';
import topo from './Layers/Basemap/thumbs/topo.png';
import gray from './Layers/Basemap/thumbs/gray.png';
import imagery from './Layers/Basemap/thumbs/imagery.png';
import stamen from './Layers/Basemap/thumbs/stamen.png';

function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
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
export default function Basemap({ open, handleCloseBasemap, basemap, setBasemap }) {

    const classes = useStyles();

    const [value, setValue] = useState(0);

    const [idCountry, setIdCountry] = useState('');

    const handleChangeSelect = (event) => {
        setIdCountry(event.target.value);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const handleClose = () => {
        handleCloseBasemap(false);
    };



    const itemData = [
        {
            id: 'rbi',
            img: rbi,
            title: 'Rupabumi (RBI)',
            author: 'BIG',
        },
        {
            id: 'osm',
            img: osm,
            title: 'OSM',
            author: 'Openstreetmap',
        },
        {
            id: 'topo',
            img: topo,
            title: 'Topo',
            author: 'ESRI',
        },
        {
            id: 'gray',
            img: gray,
            title: 'Gray',
            author: 'ESRI',
        },
        {
            id: 'imagery',
            img: imagery,
            title: 'Imagery',
            author: 'ESRI',
        },
        {
            id: 'stamen',
            img: stamen,
            title: 'Stamen',
            author: 'STAMEN',
        },
    ];

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
                    <h5 style={{ margin: '0px' }}>Peta Dasar</h5>
                    <IconButton size="small" onClick={handleClose} >
                        <Close  />
                    </IconButton>
                </div>


            </DialogTitle>
            <DialogContent style={{ minHeight: "42vh", padding: '5px' }} >
                <ImageList  cols={2} rowHeight={115}>

                    {itemData.map((item) => (
                        <ImageListItem key={item.id}>
                            <img
                                src={item.img}
                                srcSet={item.img}
                                alt={item.title}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={item.title}
                                subtitle={<span>oleh: {item.author}</span>}
                                classes={{
                                    root: classes.titleBar,
                                    subtitle: item.id === basemap ? classes.titleActive : classes.title,
                                    title: item.id === basemap ? classes.titleActive : classes.title,
                                }}
                                actionIcon={
                                    <IconButton aria-label={`star ${item.title}`}  disabled={item.id === basemap} onClick={()=>setBasemap(item.id)} >
                                        {item.id === basemap ? <CheckBox className={classes.titleActive}  /> :<CheckBoxOutlineBlank className={classes.title} />}
                                    </IconButton>
                                }
                            />
                        </ImageListItem>
                    ))}

                </ImageList>
            </DialogContent>

        </Dialog>
    )
}
/*

classes={{
                                    root: {background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'},
                                    title: color: '#ff0000',
                                }}
{itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img src={item.img} alt={item.title} />
            <ImageListItemBar
              title={item.title}
              subtitle={<span>by: {item.author}</span>}
              actionIcon={
                <IconButton aria-label={`info about ${item.title}`} className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
 <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>

            */