import {
    Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, FormControl, IconButton, ImageList, ImageListItem, ImageListItemBar, InputLabel,
    ListSubheader, MenuItem, Paper, Select, Tab, Tabs, TextField, Typography,
    List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Popover, Slider,
    TableContainer, Table, TableHead, TableRow, TableBody, TableCell
} from "@mui/material";
import styled from "styled-components";
import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { CheckBox, CheckBoxOutlineBlank, Close } from "@mui/icons-material";

import DeleteIcon from '@mui/icons-material/Delete';
import { GetApp, ListAlt, MoreVert, ZoomIn } from "@mui/icons-material";
import PropTypes from 'prop-types';

import { makeStyles } from '@mui/styles';
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


function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}
export default function ListIndikator({ open, handleCloseIndikator, setMapLayer }) {

    const classes = useStyles();

    const [value, setValue] = useState(0);

    const [idCountry, setIdCountry] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [id, setId] = useState(null);
    const [row, setRow] = useState(null);

    const [province, setProvince] = useState([]);
    const [kabupaten, setKabupaten] = useState([]);
    const [kecamatan, setKecamatan] = useState([]);
    const [desa, setDesa] = useState([]);


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
        handleCloseIndikator(false);
    };


    const openPop = Boolean(anchorEl);
    const idpop = openPop ? 'simple-popover' : undefined;

    useEffect(() => {
        setProvince(oldArray => [...oldArray,
        { id: 'provinsi_stunting', title: 'Prevalensi Stunting', layer: 'big:provinsi_stunting' },
        { id: 'provinsi_underweight', title: 'Prevalensi Underweight', layer: 'big:provinsi_underweight' },
        { id: 'provinsi_pus_hamil', title: 'PUS Hamil', layer: 'big:provinsi_pus_hamil' },
        { id: 'provinsi_pra_sejahtera', title: 'Keluarga Pra Sejahtera', layer: 'big:provinsi_pra_sejahtera' },
        { id: 'provinsi_air_minum', title: 'Keluarga dengan Balita memiliki Sumber Air Minum Tidak Layak', layer: 'big:provinsi_air_minum' },
        { id: 'provinsi_rumah', title: 'Keluarga dengan Balita memiliki Rumah Tidak Layak Huni', layer: 'big:provinsi_rumah' },
        { id: 'provinsi_jamban', title: 'Keluarga dengan Balita memiliki Jamban Tidak Layak', layer: 'big:provinsi_jamban' },
        { id: 'provinsi_anak_0_23', title: 'Keluarga dengan Anak Usia 0-23 Bulan', layer: 'big:provinsi_anak_0_23' },
        { id: 'provinsi_anak_24_59', title: 'Keluarga dengan Anak Usia 24-59 Bulan', layer: 'big:provinsi_anak_24_59' },
        { id: 'provinsi_balita', title: 'Keluarga dengan Anak Usia Balita', layer: 'big:provinsi_balita' }
        ])
        setKabupaten(oldArray => [...oldArray,
        { id: 'kabupaten_stunted', title: 'Jumlah Kasus Balita Stunted', layer: 'big:kabupaten_stunted' },
        { id: 'kabupaten_stunting', title: 'Prevalensi Stunting', layer: 'big:kabupaten_stunting' },
        { id: 'kabupaten_underweight', title: 'Prevalensi Underweight', layer: 'big:kabupaten_underweight' },
        { id: 'kabupaten_pus_hamil', title: 'PUS Hamil', layer: 'big:kabupaten_pus_hamil' },
        { id: 'kabupaten_pra_sejahtera', title: 'Keluarga Pra Sejahtera', layer: 'big:kabupaten_pra_sejahtera' },
        { id: 'kabupaten_air_minum', title: 'Keluarga dengan Balita memiliki Sumber Air Minum Tidak Layak', layer: 'big:kabupaten_air_minum' },
        { id: 'kabupaten_rumah', title: 'Keluarga dengan Balita memiliki Rumah Tidak Layak Huni', layer: 'big:kabupaten_rumah' },
        { id: 'kabupaten_jamban', title: 'Keluarga dengan Balita memiliki Jamban Tidak Layak', layer: 'big:kabupaten_jamban' },
        { id: 'kabupaten_anak_0_23', title: 'Keluarga dengan Anak Usia 0-23 Bulan', layer: 'big:kabupaten_anak_0_23' },
        { id: 'kabupaten_anak_24_59', title: 'Keluarga dengan Anak Usia 24-59 Bulan', layer: 'big:kabupaten_anak_24_59' },
        { id: 'kabupaten_anak_24_59', title: 'Keluarga dengan Anak Usia Balita', layer: 'big:kabupaten_balita' }
        ])
        setKecamatan(oldArray => [...oldArray,
        { id: 'kecamatan_stunted', title: 'Jumlah Kasus Balita Stunted', layer: 'big:kecamatan_stunted' },
        { id: 'kecamatan_pus_hamil', title: 'PUS Hamil', layer: 'big:kecamatan_pus_hamil' },
        { id: 'kecamatan_pra_sejahtera', title: 'Keluarga Pra Sejahtera', layer: 'big:kecamatan_pra_sejahtera' },
        { id: 'kecamatan_air_minum', title: 'Keluarga dengan Balita memiliki Sumber Air Minum Tidak Layak', layer: 'big:kecamatan_air_minum' },
        { id: 'kecamatan_rumah', title: 'Keluarga dengan Balita memiliki Rumah Tidak Layak Huni', layer: 'big:kecamatan_rumah' },
        { id: 'kecamatan_jamban', title: 'Keluarga dengan Balita memiliki Jamban Tidak Layak', layer: 'big:kecamatan_jamban' },
        { id: 'kecamatan_anak_0_23', title: 'Keluarga dengan Anak Usia 0-23 Bulan', layer: 'big:kecamatan_anak_0_23' },
        { id: 'kecamatan_anak_24_59', title: 'Keluarga dengan Anak Usia 24-59 Bulan', layer: 'big:kecamatan_anak_24_59' },
        { id: 'kecamatan_balita', title: 'Keluarga dengan Anak Usia Balita', layer: 'big:kecamatan_balita' }
        ])

        setDesa(oldArray => [...oldArray,
            { id: 'desa_stunted', title: 'Desa Jumlah Kasus Balita Stunted', layer: 'big:desa_stunted' },
            { id: 'desa_pus_hamil', title: 'Desa PUS Hamil', layer: 'big:desa_pus_hamil' },
            { id: 'desa_pra_sejahtera', title: 'Desa Keluarga Pra Sejahtera', layer: 'big:desa_pra_sejahtera' },
            { id: 'desa_air_minum', title: 'Desa Keluarga dengan Balita memiliki Sumber Air Minum Tidak Layak', layer: 'big:desa_air_minum' },
            { id: 'desa_rumah', title: 'Desa Keluarga dengan Balita memiliki Rumah Tidak Layak Huni', layer: 'big:desa_rumah' },
            { id: 'desa_jamban', title: 'Desa Keluarga dengan Balita memiliki Jamban Tidak Layak', layer: 'big:desa_jamban' },
            { id: 'desa_anak_0_23', title: 'Desa Keluarga dengan Anak Usia 0-23 Bulan', layer: 'big:desa_anak_0_23' },
            { id: 'desa_anak_24_59', title: 'Desa Keluarga dengan Anak Usia 24-59 Bulan', layer: 'big:desa_anak_24_59' },
            { id: 'desa_balita', title: 'Desa Keluarga dengan Anak Usia Balita', layer: 'big:desa_balita' }
            ])

    }, []);

    function getRowsProvince() {
        if (typeof (province) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (province !== null) {
                if (province.length > 0) {
                    return province.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell><Button size="small" variant="contained" color="primary" style={{ padding: "5px 15px", borderRadius: "20px" }} onClick={() => handlingAddLayer(row)}>Tampilkan</Button></TableCell>
                        </TableRow>
                    ))
                }
            } else {
                return null
            }
        } else {
            return null
        }
    }

    function getRowsKabupaten() {
        if (typeof (kabupaten) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (kabupaten !== null) {
                if (kabupaten.length > 0) {
                    return kabupaten.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell><Button size="small" variant="contained" color="primary" style={{ padding: "5px 15px", borderRadius: "20px" }} onClick={() => handlingAddLayer(row)}>Tampilkan</Button></TableCell>
                        </TableRow>
                    ))
                }
            } else {
                return null
            }
        } else {
            return null
        }
    }


    function getRowsKecamatan() {
        if (typeof (kecamatan) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (kecamatan !== null) {
                if (kecamatan.length > 0) {
                    return kecamatan.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell><Button size="small" variant="contained" color="primary" style={{ padding: "5px 15px", borderRadius: "20px" }} onClick={() => handlingAddLayer(row)}>Tampilkan</Button></TableCell>
                        </TableRow>
                    ))
                }
            } else {
                return null
            }
        } else {
            return null
        }
    }


    function getRowsDesa() {
        if (typeof (desa) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (desa !== null) {
                if (desa.length > 0) {
                    return desa.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell><Button size="small" variant="contained" color="primary" style={{ padding: "5px 15px", borderRadius: "20px" }} onClick={() => handlingAddLayer(row)}>Tampilkan</Button></TableCell>
                        </TableRow>
                    ))
                }
            } else {
                return null
            }
        } else {
            return null
        }
    }




    function handlingAddLayer(row) {
        // console.log(row);
        setMapLayer(oldArray => [...oldArray, { id: row.id, title: row.title, server: 'geoserver', tipe: 'wms', url: 'https://geoportal.big.go.id/geoserver/big/wms', geom: '', layer: row.layer, metadata: false, table: false, visible: true, opacity: 1 }].reverse())
        //setMapLayer(oldArray => [...oldArray, { id: identifier, title: layerName, server: server, tipe: 'wms', url: urlWMS, geom:'', layer: layerWMS, metadata: true, table: layerGeojson ? true : false, visible: true, opacity: 1 }])

    }



    return (
        <Dialog
            open={open}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            fullWidth={true}
            maxWidth="md"
        >
            <DialogTitle style={{ cursor: 'move', padding: '5px 10px', backgroundColor: '#f3f3f3' }} id="draggable-dialog-title">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h5 style={{ margin: '0px' }}>Daftar Indikator</h5>
                    <IconButton size="small" onClick={handleClose} >
                        <Close />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent style={{ minHeight: "42vh", padding: '5px' }} >
                <Paper square>
                    <Tabs
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChange}
                        aria-label="select and search area study"
                        variant="fullWidth"
                    >
                        <Tab label="Provinsi" {...a11yProps(0)} />
                        <Tab label="Kabupaten" {...a11yProps(1)} />
                        <Tab label="Kecamatan" {...a11yProps(2)} />
                        <Tab label="Desa" {...a11yProps(3)} />
                    </Tabs>
                </Paper>
                <TabPanel value={value} index={0}>
                    <TableContainer>
                        <Table size="small" aria-label="a dense table">
                            <TableHead color="#ddd">
                                <TableRow>
                                    <TableCell>No </TableCell>
                                    <TableCell>Nama Indikator</TableCell>
                                    <TableCell> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    getRowsProvince()
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <TableContainer>
                        <Table size="small" aria-label="a dense table">
                            <TableHead color="#ddd">
                                <TableRow>
                                    <TableCell>Id </TableCell>
                                    <TableCell>Nama Indikator</TableCell>
                                    <TableCell> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    getRowsKabupaten()
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <TableContainer>
                        <Table size="small" aria-label="a dense table">
                            <TableHead color="#ddd">
                                <TableRow>
                                    <TableCell>Id </TableCell>
                                    <TableCell>Nama Indikator</TableCell>
                                    <TableCell> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    getRowsKecamatan()
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <TableContainer>
                        <Table size="small" aria-label="a dense table">
                            <TableHead color="#ddd">
                                <TableRow>
                                    <TableCell>No </TableCell>
                                    <TableCell>Nama Indikator</TableCell>
                                    <TableCell> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    getRowsDesa()
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
            </DialogContent>

        </Dialog>
    )
}

const TitleDataContent = styled.p`
  margin:0px;
  color:#888;
`;


const DataContent = styled.div`
  padding: 15px;
  max-height:68vh;
  overflow-y: auto;
  overflow-x: hidden;
`;