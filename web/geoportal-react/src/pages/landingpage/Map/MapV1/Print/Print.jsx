import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, ImageList, ImageListItem, InputLabel, ListSubheader, MenuItem, Paper, Select, Tab, Tabs, TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { useState } from 'react';
import Draggable from 'react-draggable';
import { Close } from "@material-ui/icons";

import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

export default function Print({ open, handleClosePrint }) {
    const [value, setValue] = useState(0);

    const [idCountry, setIdCountry] = useState('');

    const handleChangeSelect = (event) => {
        setIdCountry(event.target.value);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const handleClose = () => {
        handleClosePrint(false);
    };

    return (
        <Dialog
            open={open}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            fullWidth={true}
            maxWidth="sm"
        >
            <DialogTitle style={{ cursor: 'move', padding: '5px 10px', backgroundColor: '#f3f3f3' }} id="draggable-dialog-title">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h5 style={{ margin: '0px' }}>Print</h5>
                    <IconButton size="small" onClick={handleClose} >
                        <Close  />
                    </IconButton>
                </div>


            </DialogTitle>
            <DialogContent style={{ minHeight: "55vh", padding: '0px' }} >
              
            </DialogContent>

        </Dialog>
    )
}
/*
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