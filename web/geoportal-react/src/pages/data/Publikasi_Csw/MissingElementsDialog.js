import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    Typography,
    Divider,
    Box,
    Chip,
    Tooltip,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MissingElementsDialog = ({ open, onClose, missingElements, onAddElements }) => {
    const [selectedElements, setSelectedElements] = useState([]);

    // Enhanced path mappings based on template with Indonesian names
    const getElementDisplayName = (path) => {
        const pathMappings = {
            // Root level elements
            'gmd:MD_Metadata.gmd:fileIdentifier': 'Identifikasi File',
            'gmd:MD_Metadata.gmd:language': 'Bahasa Metadata',
            'gmd:MD_Metadata.gmd:characterSet': 'Set Karakter',
            'gmd:MD_Metadata.gmd:parentIdentifier': 'Identifikasi Induk',
            'gmd:MD_Metadata.gmd:hierarchyLevel': 'Level Hierarki',
            'gmd:MD_Metadata.gmd:hierarchyLevelName': 'Nama Level Hierarki',
            'gmd:MD_Metadata.gmd:contact': 'Kontak Penanggung Jawab',
            'gmd:MD_Metadata.gmd:dateStamp': 'Tanggal Metadata',
            'gmd:MD_Metadata.gmd:metadataStandardName': 'Standar Metadata',
            'gmd:MD_Metadata.gmd:metadataStandardVersion': 'Versi Standar',

            // Spatial representation
            'gmd:MD_Metadata.gmd:spatialRepresentationInfo': 'Info Representasi Spasial',

            // Reference system - WAJIB
            'gmd:MD_Metadata.gmd:referenceSystemInfo': 'Sistem Referensi Spasial',

            // Identification
            'gmd:MD_Metadata.gmd:identificationInfo': 'Informasi Identifikasi',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification': 'Data Identifikasi',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:citation': 'Sitasi Dataset',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:abstract': 'Abstrak Dataset',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:purpose': 'Tujuan Dataset',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:credit': 'Kredit/Pengakuan',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:pointOfContact': 'Kontak Dataset',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:descriptiveKeywords': 'Kata Kunci',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:spatialRepresentationType': 'Tipe Representasi Spasial',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:spatialResolution': 'Resolusi Spasial',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:language': 'Bahasa Dataset',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:characterSet': 'Set Karakter Dataset',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:topicCategory': 'Kategori Topik',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:extent': 'Ekstent Data',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:supplementalInformation': 'Informasi Tambahan',

            // Distribution - WAJIB UNTUK URL
            'gmd:MD_Metadata.gmd:distributionInfo': 'Informasi Distribusi',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution': 'Distribusi Data',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:distributionFormat': 'Format Distribusi',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions': 'Opsi Transfer',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine': 'Sumber Daya Online',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:linkage': 'URL Dataset (WAJIB)',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:protocol': 'Protokol (WAJIB)',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:name': 'Nama Layer (WAJIB)',

            // Maintenance
            'gmd:MD_Metadata.gmd:metadataMaintenance': 'Pemeliharaan Metadata',

            // Contact details
            'gmd:CI_ResponsibleParty': 'Pihak Bertanggung Jawab',
            'gmd:individualName': 'Nama Individu',
            'gmd:organisationName': 'Nama Organisasi',
            'gmd:positionName': 'Jabatan',
            'gmd:contactInfo': 'Info Kontak',
            'gmd:phone': 'Telepon',
            'gmd:address': 'Alamat',
            'gmd:electronicMailAddress': 'Email',
            'gmd:role': 'Peran',

            // Citation details
            'gmd:title': 'Judul',
            'gmd:date': 'Tanggal',
            'gmd:dateType': 'Tipe Tanggal',

            // Online resource
            'gmd:linkage': 'Tautan URL (WAJIB)',
            'gmd:protocol': 'Protokol (WAJIB)',
            'gmd:name': 'Nama Layer/Service (WAJIB)',

            // Additional elements based on template
            'gmd:CI_Citation': 'Sitasi',
            'gmd:CI_Contact': 'Kontak',
            'gmd:CI_Address': 'Alamat',
            'gmd:CI_Telephone': 'Telepon',
            'gmd:CI_OnlineResource': 'Sumber Online (WAJIB)',
            'gmd:MD_Distribution': 'Distribusi',
            'gmd:MD_DigitalTransferOptions': 'Opsi Transfer Digital',
            'gmd:MD_Keywords': 'Kata Kunci',
            'gmd:MD_Resolution': 'Resolusi',
            'gmd:MD_MaintenanceInformation': 'Info Pemeliharaan',
            'gmd:EX_Extent': 'Ekstent',
            'gmd:EX_GeographicBoundingBox': 'Bounding Box Geografis'
        };

        // Enhanced fallback processing
        const lastPart = path.split('.').pop().replace('gmd:', '').replace('gco:', '');
        return pathMappings[path] || pathMappings[lastPart] ||
            lastPart.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    // Enhanced element description with template-based defaults
    const getElementDescription = (element) => {
        if (element.description) {
            return element.description;
        }

        const descriptions = {
            'gmd:MD_Metadata.gmd:fileIdentifier': 'UUID unik untuk mengidentifikasi file metadata',
            'gmd:MD_Metadata.gmd:language': 'Bahasa yang digunakan dalam metadata (default: eng)',
            'gmd:MD_Metadata.gmd:characterSet': 'Set karakter yang digunakan (default: utf8)',
            'gmd:MD_Metadata.gmd:parentIdentifier': 'Identifikasi metadata induk (jika ada)',
            'gmd:MD_Metadata.gmd:hierarchyLevel': 'Level hierarki data (default: dataset)',
            'gmd:MD_Metadata.gmd:hierarchyLevelName': 'Nama level hierarki (default: dataset)',
            'gmd:MD_Metadata.gmd:contact': 'Kontak penanggung jawab metadata (Walidata & Produsen Data)',
            'gmd:MD_Metadata.gmd:dateStamp': 'Tanggal pembuatan atau pembaruan metadata',
            'gmd:MD_Metadata.gmd:metadataStandardName': 'Nama standar metadata (ISO 19115)',
            'gmd:MD_Metadata.gmd:metadataStandardVersion': 'Versi standar metadata',
            'gmd:MD_Metadata.gmd:spatialRepresentationInfo': 'Informasi representasi spasial (vector/raster)',
            'gmd:MD_Metadata.gmd:referenceSystemInfo': 'Sistem referensi koordinat (EPSG:4326) - WAJIB',
            'gmd:MD_Metadata.gmd:identificationInfo': 'Informasi identifikasi dataset',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification': 'Data identifikasi dataset',
            'gmd:abstract': 'Deskripsi singkat dan jelas tentang dataset',
            'gmd:citation': 'Referensi sitasi untuk dataset',
            'gmd:title': 'Judul atau nama dataset',
            'gmd:purpose': 'Tujuan penggunaan dataset',
            'gmd:credit': 'Kredit atau pengakuan (nama daerah)',
            'gmd:pointOfContact': 'Kontak penanggung jawab dataset',
            'gmd:descriptiveKeywords': 'Kata kunci untuk mendeskripsikan data',
            'gmd:spatialRepresentationType': 'Tipe representasi spasial (vector)',
            'gmd:spatialResolution': 'Resolusi atau skala data spasial',
            'gmd:language': 'Bahasa dataset (Indonesia)',
            'gmd:characterSet': 'Set karakter dataset',
            'gmd:topicCategory': 'Kategori topik ISO',
            'gmd:extent': 'Batasan geografis dan temporal data',
            'gmd:supplementalInformation': 'Informasi tambahan tentang dataset',
            'gmd:distributionInfo': 'Informasi cara mendistribusikan data - WAJIB untuk URL',
            'gmd:distributionFormat': 'Format distribusi data',
            'gmd:transferOptions': 'Opsi transfer data (WMS, WFS) - WAJIB',
            'gmd:linkage': 'URL layanan WMS/WFS - WAJIB dan harus statis',
            'gmd:protocol': 'Protokol layanan (OGC:WMS, OGC:WFS) - WAJIB',
            'gmd:name': 'Nama layer dalam layanan - WAJIB',
            'gmd:metadataMaintenance': 'Informasi pemeliharaan metadata',
            'gmd:CI_ResponsibleParty': 'Informasi pihak bertanggung jawab',
            'gmd:individualName': 'Nama lengkap penanggung jawab',
            'gmd:organisationName': 'Nama instansi/organisasi',
            'gmd:positionName': 'Jabatan penanggung jawab',
            'gmd:contactInfo': 'Informasi kontak lengkap',
            'gmd:phone': 'Nomor telepon dan fax',
            'gmd:address': 'Alamat lengkap instansi',
            'gmd:electronicMailAddress': 'Email resmi',
            'gmd:role': 'Peran (Walidata/Produsen Data)',
            'gmd:CI_OnlineResource': 'Sumber daya online - WAJIB untuk akses data'
        };

        return descriptions[element.path] || descriptions[element.path?.split('.').pop()] ||
            `${element.type || 'Element'} - ${element.sampleValue || 'Akan diisi dengan nilai default'}`;
    };

    // Generate default values based on template with static URLs
    const generateDefaultValue = (element) => {
        const defaultValues = {
            'gmd:MD_Metadata.gmd:fileIdentifier': 'UUID akan di-generate otomatis',
            'gmd:MD_Metadata.gmd:language': 'eng',
            'gmd:MD_Metadata.gmd:characterSet': 'utf8',
            'gmd:MD_Metadata.gmd:hierarchyLevel': 'dataset',
            'gmd:MD_Metadata.gmd:hierarchyLevelName': 'dataset',
            'gmd:MD_Metadata.gmd:dateStamp': 'Tanggal saat ini',
            'gmd:MD_Metadata.gmd:metadataStandardName': 'ISO 19115',
            'gmd:MD_Metadata.gmd:metadataStandardVersion': 'ISO19115:2003/Cor 1 2006',
            'gmd:language': 'Indonesia',
            'gmd:spatialRepresentationType': 'vector',
            'gmd:protocol': 'OGC:WMS',
            'gmd:country': 'Indonesia',
            'gmd:hoursOfService': '07.30-16.00',
            'gmd:spatialResolution': '1:250000',
            'gmd:purpose': 'Diperuntukan hanya untuk Aplikasi Web Geoportal',
            
            // STATIC URL VALUES - WAJIB
            'gmd:linkage': 'http://localhost/geoserver/wms',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:linkage': 'http://localhost/geoserver/wms',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:protocol': 'OGC:WMS',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:name': 'sibatnas:[IDENTIFIER_UNIK_DATASET]',
            
            // Additional static URLs for WFS
            'gmd:linkage_wfs': 'http://localhost/geoserver/wfs',
            'gmd:protocol_wfs': 'OGC:WFS',
            'gmd:name_wfs': 'sibatnas:[IDENTIFIER_UNIK_DATASET]',
            
            // Reference system
            'gmd:MD_Metadata.gmd:referenceSystemInfo': 'EPSG:4326 (WGS84)',
            'gmd:code': '4326',
            'gmd:codeSpace': 'EPSG'
        };

        return defaultValues[element.path] || defaultValues[element.path?.split('.').pop()] || 'Nilai default akan diisi';
    };

    // Check if element is required, with special emphasis on URL elements
    const isElementRequired = (element) => {
        const requiredPaths = [
            // Core metadata requirements
            'gmd:MD_Metadata.gmd:fileIdentifier',
            'gmd:MD_Metadata.gmd:language',
            'gmd:MD_Metadata.gmd:characterSet',
            'gmd:MD_Metadata.gmd:hierarchyLevel',
            'gmd:MD_Metadata.gmd:contact',
            'gmd:MD_Metadata.gmd:dateStamp',
            'gmd:MD_Metadata.gmd:metadataStandardName',
            'gmd:MD_Metadata.gmd:identificationInfo',
            
            // Reference system - WAJIB
            'gmd:MD_Metadata.gmd:referenceSystemInfo',
            
            // Distribution and URL - WAJIB
            'gmd:MD_Metadata.gmd:distributionInfo',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:linkage',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:protocol',
            'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:name',
            
            // Identification requirements
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:citation',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:abstract',
            'gmd:MD_Metadata.gmd:identificationInfo.gmd:MD_DataIdentification.gmd:pointOfContact',
            
            // Citation requirements
            'gmd:title',
            'gmd:date',
            'gmd:linkage',
            'gmd:protocol',
            'gmd:name',
            'gmd:CI_OnlineResource'
        ];

        // Check if element path is in required list or if it's a URL-related element
        const isRequired = requiredPaths.includes(element.path) || 
                          element.isRequired || 
                          element.path?.includes('linkage') ||
                          element.path?.includes('protocol') ||
                          element.path?.includes('transferOptions') ||
                          element.path?.includes('CI_OnlineResource') ||
                          element.path?.includes('distributionInfo');

        return isRequired;
    };

    const handleToggle = (element) => () => {
        const currentIndex = selectedElements.findIndex(el => el.path === element.path);
        const newSelected = [...selectedElements];

        if (currentIndex === -1) {
            newSelected.push(element);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        setSelectedElements(newSelected);
    };

    const handleAddSelected = () => {
        // Enhance elements with default values before adding
        const enhancedElements = selectedElements.map(element => ({
            ...element,
            defaultValue: generateDefaultValue(element),
            isRequired: isElementRequired(element)
        }));
        
        onAddElements(enhancedElements);
        setSelectedElements([]);
        onClose();
    };

    const handleSelectAll = () => {
        setSelectedElements([...missingElements]);
    };

    const handleDeselectAll = () => {
        setSelectedElements([]);
    };

    const handleAddAllRequired = () => {
        const requiredElements = missingElements.filter(el => isElementRequired(el));
        const enhancedRequired = requiredElements.map(element => ({
            ...element,
            defaultValue: generateDefaultValue(element),
            isRequired: true
        }));
        
        onAddElements(enhancedRequired);
        onClose();
    };

    const handleAddAllWithDefaults = () => {
        // Filter out non-critical elements
        const criticalElements = missingElements.filter(element => {
            // Skip non-critical elements
            const nonCritical = [
                'parentIdentifier',
                'hierarchyLevelName', 
                'distributionFormat'
            ];
            
            return !nonCritical.some(skip => element.path.includes(skip));
        });

        // Add all critical elements with default values
        const elementsWithDefaults = criticalElements.map(element => ({
            ...element,
            defaultValue: generateDefaultValue(element),
            isRequired: isElementRequired(element)
        }));
        
        onAddElements(elementsWithDefaults);
        onClose();
    };

    // Group elements by category with URL emphasis
    const groupedElements = missingElements.reduce((groups, element) => {
        let category = 'Lainnya';

        if (element.path.includes('linkage') || element.path.includes('transferOptions') || 
            element.path.includes('CI_OnlineResource') || element.path.includes('protocol')) {
            category = '🌐 URL & Distribusi Data (WAJIB)';
        } else if (element.path.includes('contact') || element.path.includes('CI_ResponsibleParty')) {
            category = '👤 Kontak & Penanggung Jawab';
        } else if (element.path.includes('identificationInfo')) {
            category = '📋 Identifikasi Dataset';
        } else if (element.path.includes('distributionInfo')) {
            category = '📦 Distribusi Data';
        } else if (element.path.includes('spatialRepresentation') || element.path.includes('referenceSystem')) {
            category = '🗺️ Informasi Spasial (WAJIB)';
        } else if (element.path.includes('metadataMaintenance')) {
            category = '🔧 Pemeliharaan Metadata';
        } else if (!element.path.includes('.')) {
            category = '⚙️ Metadata Dasar';
        }

        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push({
            ...element,
            isRequired: isElementRequired(element)
        });
        return groups;
    }, {});

    // Count required elements with enhanced logic
    const requiredCount = missingElements.filter(el => isElementRequired(el)).length;
    const optionalCount = missingElements.length - requiredCount;
    const urlElementsCount = missingElements.filter(el => 
        el.path?.includes('linkage') || 
        el.path?.includes('transferOptions') || 
        el.path?.includes('CI_OnlineResource') ||
        el.path?.includes('distributionInfo')
    ).length;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <WarningIcon color="warning" sx={{ mr: 1.5 }} />
                        <Typography variant="h5" fontWeight="600">
                            Elemen yang Hilang dari Template ISO 19115
                        </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                        <Chip
                            icon={<ErrorIcon />}
                            label={`${requiredCount} Wajib`}
                            color="error"
                            size="small"
                            variant="outlined"
                        />
                        {urlElementsCount > 0 && (
                            <Chip
                                icon={<WarningIcon />}
                                label={`${urlElementsCount} URL/Distribusi`}
                                color="warning"
                                size="small"
                                variant="filled"
                            />
                        )}
                        <Chip
                            icon={<InfoIcon />}
                            label={`${optionalCount} Opsional`}
                            color="default"
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent>
                <DialogContentText sx={{ mb: 2, fontSize: '1rem' }}>
                    Beberapa elemen tidak ditemukan dibandingkan dengan template standar ISO 19115.
                    <strong> Elemen URL dan distribusi data adalah WAJIB dan akan menggunakan URL statis.</strong>
                    Pilih elemen yang ingin Anda tambahkan atau gunakan tombol untuk menambah semua dengan nilai default.
                </DialogContentText>

                {/* Enhanced Selection Controls */}
                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    <Button
                        size="small"
                        onClick={handleSelectAll}
                        startIcon={<CheckCircleIcon />}
                        variant="outlined"
                    >
                        Pilih Semua ({missingElements.length})
                    </Button>
                    <Button
                        size="small"
                        onClick={handleDeselectAll}
                        color="secondary"
                        variant="outlined"
                    >
                        Batal Pilih
                    </Button>
                    <Button
                        size="small"
                        onClick={handleAddAllRequired}
                        color="error"
                        variant="contained"
                        startIcon={<ErrorIcon />}
                        disabled={requiredCount === 0}
                    >
                        Tambah Semua Wajib ({requiredCount})
                    </Button>
                    <Button
                        size="small"
                        onClick={handleAddAllWithDefaults}
                        color="success"
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                    >
                        Tambah Semua + Default ({missingElements.length})
                    </Button>
                </Box>

                {/* URL Warning Box */}
                {urlElementsCount > 0 && (
                    <Box 
                        sx={{ 
                            mb: 2, 
                            p: 2, 
                            backgroundColor: '#fff3e0', 
                            border: '2px solid #ff9800',
                            borderRadius: 1
                        }}
                    >
                        <Typography variant="subtitle2" color="warning.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                            ⚠️ PERHATIAN: Elemen URL & Distribusi Data
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • URL akan diset secara statis ke: <code>http://localhost/geoserver/wms</code><br/>
                            • Protokol akan diset ke: <code>OGC:WMS</code><br/>
                            • Nama layer akan diset ke: <code>sibatnas:[IDENTIFIER_UNIK_DATASET]</code><br/>
                            • Elemen ini WAJIB ada untuk compliance ISO 19115
                        </Typography>
                    </Box>
                )}

                {/* Grouped Elements */}
                <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                    {Object.entries(groupedElements).map(([category, elements]) => (
                        <Accordion 
                            key={category} 
                            defaultExpanded={
                                category.includes('URL') || 
                                category.includes('Metadata Dasar') || 
                                category.includes('Informasi Spasial')
                            }
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" fontWeight="600">
                                    {category}
                                </Typography>
                                <Chip
                                    label={elements.length}
                                    size="small"
                                    sx={{ ml: 1 }}
                                    color={category.includes('WAJIB') ? 'error' : 'primary'}
                                    variant="outlined"
                                />
                            </AccordionSummary>
                            <AccordionDetails>
                                <List dense>
                                    {elements.map((element, index) => {
                                        const isRequired = isElementRequired(element);
                                        const isUrlElement = element.path?.includes('linkage') || 
                                                           element.path?.includes('transferOptions') ||
                                                           element.path?.includes('CI_OnlineResource');
                                        
                                        return (
                                            <React.Fragment key={`${category}-${index}`}>
                                                <ListItem
                                                    button
                                                    onClick={handleToggle(element)}
                                                    sx={{
                                                        py: 1.5,
                                                        '&:hover': { backgroundColor: '#f5f5f5' },
                                                        borderLeft: isRequired ? '4px solid #d32f2f' : '4px solid #2196f3',
                                                        borderRadius: 1,
                                                        mb: 1,
                                                        backgroundColor: isUrlElement ? '#fff8e1' : 'transparent'
                                                    }}
                                                >
                                                    <Checkbox
                                                        edge="start"
                                                        checked={selectedElements.some(el => el.path === element.path)}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        sx={{ mr: 1 }}
                                                    />

                                                    <ListItemText
                                                        primary={
                                                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                                                <Typography variant="subtitle1" fontWeight="500">
                                                                    {getElementDisplayName(element.path)}
                                                                </Typography>
                                                                <Chip
                                                                    label={isRequired ? 'Wajib' : 'Opsional'}
                                                                    size="small"
                                                                    color={isRequired ? 'error' : 'default'}
                                                                    variant="outlined"
                                                                    sx={{ fontSize: '0.75rem', height: 20 }}
                                                                />
                                                                {isUrlElement && (
                                                                    <Chip
                                                                        label="URL STATIS"
                                                                        size="small"
                                                                        color="warning"
                                                                        variant="filled"
                                                                        sx={{ fontSize: '0.7rem', height: 18 }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <Box sx={{ mt: 0.5 }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {getElementDescription(element)}
                                                                </Typography>
                                                                <Box display="flex" alignItems="center" gap={1} mt={0.5} flexWrap="wrap">
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Path: {element.path}
                                                                    </Typography>
                                                                    <Chip
                                                                        label={`Default: ${generateDefaultValue(element)}`}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        color={isUrlElement ? "warning" : "success"}
                                                                        sx={{ fontSize: '0.7rem', height: 18 }}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        }
                                                    />
                                                </ListItem>
                                            </React.Fragment>
                                        );
                                    })}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>

                {/* Enhanced Summary */}
                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 1,
                        border: '1px solid #e9ecef'
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        <strong>Ringkasan:</strong> {selectedElements.length} dari {missingElements.length} elemen dipilih
                        {selectedElements.filter(el => isElementRequired(el)).length > 0 &&
                            ` (${selectedElements.filter(el => isElementRequired(el)).length} wajib)`
                        }
                        {urlElementsCount > 0 && (
                            <><br/><strong>URL & Distribusi:</strong> {urlElementsCount} elemen akan menggunakan URL statis</>
                        )}
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1, flexWrap: 'wrap' }}>
                <Button onClick={onClose} color="inherit" size="large">
                    Batal
                </Button>
                <Button
                    onClick={handleAddAllRequired}
                    color="error"
                    variant="outlined"
                    size="large"
                    startIcon={<ErrorIcon />}
                    disabled={requiredCount === 0}
                >
                    Tambah Semua Wajib ({requiredCount})
                </Button>
                <Button
                    onClick={handleAddSelected}
                    color="primary"
                    variant="contained"
                    disabled={selectedElements.length === 0}
                    size="large"
                    startIcon={<CheckCircleIcon />}
                >
                    Tambah Terpilih ({selectedElements.length})
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MissingElementsDialog;