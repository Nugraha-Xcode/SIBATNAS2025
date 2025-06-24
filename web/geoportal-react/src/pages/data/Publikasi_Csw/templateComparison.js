import { TEMPLATE_XML } from './Template';
import { XMLParser } from 'fast-xml-parser';

const compareWithTemplate = (parsedXml) => {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        textNodeName: '#text',
        ignoreNameSpace: false,
        allowBooleanAttributes: true,
        trimValues: true
    });

    try {
        const template = parser.parse(TEMPLATE_XML);
        const missingElements = [];

        // More robust comparison - handle both with and without namespace
        const templateRoot = template['gmd:MD_Metadata'] || template['MD_Metadata'];
        const xmlRoot = parsedXml['gmd:MD_Metadata'] || parsedXml['MD_Metadata'];

        if (!templateRoot) {
            console.warn('Template tidak memiliki struktur MD_Metadata yang valid');
            return { missingElements: [], isValid: true };
        }

        if (!xmlRoot) {
            missingElements.push({
                path: 'gmd:MD_Metadata',
                type: 'object',
                sampleValue: 'Root metadata element',
                isRequired: true,
                description: 'Root element metadata ISO 19115'
            });
            return { missingElements, isValid: false };
        }

        // Compare with more flexible approach
        compareObjects(templateRoot, xmlRoot, 'gmd:MD_Metadata', missingElements);

        return {
            missingElements,
            isValid: missingElements.length === 0
        };
    } catch (error) {
        console.error('Error in template comparison:', error);
        return {
            missingElements: [],
            isValid: true // Don't block if comparison fails
        };
    }
};

const compareObjects = (templateObj, currentObj, path, missingElements) => {
    if (!templateObj || typeof templateObj !== 'object') return;

    Object.keys(templateObj).forEach(key => {
        const newPath = path ? `${path}.${key}` : key;

        // Skip attributes and text nodes
        if (key.startsWith('@_') || key === '#text') return;

        // Skip certain template-specific elements that shouldn't be required
        const skipElements = [
            'gmd:parentIdentifier', // Often empty
            'gmd:hierarchyLevelName', // Often same as hierarchyLevel  
            'gmd:distributionFormat' // Can be nilReason missing
        ];

        if (skipElements.some(skip => newPath.includes(skip))) {
            return;
        }

        // If template has this key but current doesn't
        if (!currentObj || !currentObj.hasOwnProperty(key)) {
            // Only add to missing if it's actually important
            const isImportantElement = isRequiredElement(key, newPath) || 
                                     newPath.includes('distributionInfo') ||
                                     newPath.includes('transferOptions') ||
                                     newPath.includes('linkage') ||
                                     newPath.includes('protocol') ||
                                     newPath.includes('referenceSystemInfo');

            if (isImportantElement) {
                missingElements.push({
                    path: newPath,
                    type: getElementType(templateObj[key]),
                    sampleValue: getSampleValue(templateObj[key]),
                    isRequired: isRequiredElement(key, newPath),
                    description: getElementDescription(key, newPath)
                });
            }
            return;
        }

        // If both are objects, recurse
        if (typeof templateObj[key] === 'object' && !Array.isArray(templateObj[key]) && templateObj[key] !== null) {
            compareObjects(templateObj[key], currentObj[key], newPath, missingElements);
        }

        // If template has an array but current doesn't have at least one item
        if (Array.isArray(templateObj[key]) && (!Array.isArray(currentObj[key]) || currentObj[key].length === 0)) {
            const isImportantArray = isRequiredElement(key, newPath) ||
                                   newPath.includes('contact') ||
                                   newPath.includes('onLine');

            if (isImportantArray) {
                missingElements.push({
                    path: newPath,
                    type: 'array',
                    sampleValue: Array.isArray(templateObj[key]) && templateObj[key].length > 0 ? getSampleValue(templateObj[key][0]) : '',
                    isRequired: isRequiredElement(key, newPath),
                    description: getElementDescription(key, newPath)
                });
            }
        }
    });
};

const getElementType = (value) => {
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    return typeof value;
};

const getSampleValue = (value) => {
    if (typeof value === 'string') {
        // Extract sample value from template placeholders
        if (value.includes('[') && value.includes(']')) {
            return value;
        }
        return value;
    }
    if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
            return value.length > 0 ? getSampleValue(value[0]) : '';
        }
        // For objects, try to get text content
        if (value['gco:CharacterString']) {
            return getSampleValue(value['gco:CharacterString']);
        }
        if (value['gco:Date']) {
            return getSampleValue(value['gco:Date']);
        }
        if (value['gco:Integer']) {
            return getSampleValue(value['gco:Integer']);
        }
        if (value['gco:Decimal']) {
            return getSampleValue(value['gco:Decimal']);
        }
        if (value['gco:Boolean']) {
            return getSampleValue(value['gco:Boolean']);
        }
        if (value['gmd:URL']) {
            return getSampleValue(value['gmd:URL']);
        }
        return JSON.stringify(value, null, 2).substring(0, 100) + '...';
    }
    return String(value);
};

const isRequiredElement = (elementName, fullPath = '') => {
    const requiredElements = [
        // Root level required elements
        'gmd:fileIdentifier',
        'gmd:language',
        'gmd:characterSet',
        'gmd:hierarchyLevel',
        'gmd:contact',
        'gmd:dateStamp',
        'gmd:metadataStandardName',
        'gmd:identificationInfo',

        // Spatial representation - WAJIB
        'gmd:spatialRepresentationInfo',
        'gmd:referenceSystemInfo',

        // Identification Info required elements
        'gmd:citation',
        'gmd:abstract',
        'gmd:pointOfContact',

        // Citation required elements
        'gmd:title',
        'gmd:date',

        // Contact required elements
        'gmd:individualName',
        'gmd:organisationName',
        'gmd:role',

        // Distribution required elements - WAJIB untuk URL
        'gmd:distributionInfo',
        'gmd:transferOptions',
        'gmd:onLine',
        'gmd:linkage',
        'gmd:protocol',
        'gmd:name',

        // Reference System required elements
        'gmd:referenceSystemIdentifier',
        'gmd:code',
        'gmd:codeSpace',

        // Extent required elements (if extent is provided)
        'gmd:geographicElement',
        'gmd:westBoundLongitude',
        'gmd:eastBoundLongitude',
        'gmd:southBoundLatitude',
        'gmd:northBoundLatitude',

        // Online Resource - WAJIB
        'gmd:CI_OnlineResource'
    ];

    // Check by element name
    const isRequiredByName = requiredElements.includes(elementName);

    // Check by full path - especially for URL/distribution elements
    const isRequiredByPath = 
        fullPath.includes('distributionInfo') ||
        fullPath.includes('transferOptions') ||
        fullPath.includes('onLine') ||
        fullPath.includes('linkage') ||
        fullPath.includes('protocol') ||
        fullPath.includes('CI_OnlineResource') ||
        fullPath.includes('referenceSystemInfo') ||
        fullPath.includes('spatialRepresentationInfo');

    return isRequiredByName || isRequiredByPath;
};

const getElementDescription = (elementName, fullPath = '') => {
    const descriptions = {
        // Root level elements
        'gmd:fileIdentifier': 'Identifikasi unik untuk metadata',
        'gmd:language': 'Bahasa yang digunakan dalam metadata',
        'gmd:characterSet': 'Set karakter yang digunakan',
        'gmd:parentIdentifier': 'Identifikasi metadata induk',
        'gmd:hierarchyLevel': 'Level hierarki data (dataset, series, dll)',
        'gmd:hierarchyLevelName': 'Nama level hierarki',
        'gmd:contact': 'Informasi kontak penanggung jawab metadata',
        'gmd:dateStamp': 'Tanggal pembuatan atau pembaruan metadata',
        'gmd:metadataStandardName': 'Nama standar metadata yang digunakan',
        'gmd:metadataStandardVersion': 'Versi standar metadata',

        // Spatial representation
        'gmd:spatialRepresentationInfo': 'Informasi representasi spasial data - WAJIB',
        'gmd:topologyLevel': 'Level topologi data vektor',

        // Reference system
        'gmd:referenceSystemInfo': 'Informasi sistem referensi spasial - WAJIB',
        'gmd:referenceSystemIdentifier': 'Identifikasi sistem referensi - WAJIB',
        'gmd:code': 'Kode sistem referensi (contoh: 4326) - WAJIB',
        'gmd:codeSpace': 'Ruang kode (contoh: EPSG) - WAJIB',

        // Identification info
        'gmd:identificationInfo': 'Informasi identifikasi dataset',
        'gmd:citation': 'Sitasi dataset',
        'gmd:title': 'Judul dataset',
        'gmd:date': 'Tanggal publikasi atau pembuatan',
        'gmd:dateType': 'Tipe tanggal (publikasi, pembuatan, revisi)',
        'gmd:abstract': 'Abstrak atau deskripsi dataset',
        'gmd:purpose': 'Tujuan pembuatan dataset',
        'gmd:credit': 'Kredit atau pengakuan',
        'gmd:pointOfContact': 'Kontak penanggung jawab dataset',
        'gmd:descriptiveKeywords': 'Kata kunci deskriptif',
        'gmd:keyword': 'Kata kunci',
        'gmd:type': 'Tipe kata kunci',
        'gmd:spatialRepresentationType': 'Tipe representasi spasial',
        'gmd:spatialResolution': 'Resolusi spasial',
        'gmd:equivalentScale': 'Skala ekuivalen',
        'gmd:denominator': 'Denominator skala',
        'gmd:topicCategory': 'Kategori topik ISO',
        'gmd:extent': 'Ekstent spasial dan temporal',
        'gmd:geographicElement': 'Elemen geografis',
        'gmd:westBoundLongitude': 'Batas barat (longitude)',
        'gmd:eastBoundLongitude': 'Batas timur (longitude)',
        'gmd:southBoundLatitude': 'Batas selatan (latitude)',
        'gmd:northBoundLatitude': 'Batas utara (latitude)',
        'gmd:supplementalInformation': 'Informasi tambahan',

        // Contact info
        'gmd:individualName': 'Nama individu penanggung jawab',
        'gmd:organisationName': 'Nama organisasi',
        'gmd:positionName': 'Jabatan atau posisi',
        'gmd:contactInfo': 'Informasi kontak detail',
        'gmd:phone': 'Informasi telepon',
        'gmd:voice': 'Nomor telepon suara',
        'gmd:facsimile': 'Nomor fax',
        'gmd:address': 'Alamat',
        'gmd:deliveryPoint': 'Alamat pengiriman',
        'gmd:city': 'Kota',
        'gmd:administrativeArea': 'Area administratif (provinsi)',
        'gmd:postalCode': 'Kode pos',
        'gmd:country': 'Negara',
        'gmd:electronicMailAddress': 'Alamat email',
        'gmd:hoursOfService': 'Jam layanan',
        'gmd:contactInstructions': 'Instruksi kontak',
        'gmd:role': 'Peran atau tanggung jawab',

        // Distribution info - ENHANCED WITH MANDATORY INDICATORS
        'gmd:distributionInfo': 'Informasi distribusi data - WAJIB untuk URL akses',
        'gmd:distributionFormat': 'Format distribusi',
        'gmd:transferOptions': 'Opsi transfer data - WAJIB untuk URL akses',
        'gmd:unitsOfDistribution': 'Unit distribusi',
        'gmd:onLine': 'Sumber daya online - WAJIB untuk URL akses',
        'gmd:linkage': 'URL statis untuk akses data - WAJIB (http://localhost/geoserver/wms)',
        'gmd:protocol': 'Protokol akses - WAJIB (OGC:WMS atau OGC:WFS)',
        'gmd:name': 'Nama layer atau service - WAJIB (sibatnas:[IDENTIFIER_UNIK_DATASET])',

        // Maintenance info
        'gmd:metadataMaintenance': 'Informasi pemeliharaan metadata',
        'gmd:maintenanceAndUpdateFrequency': 'Frekuensi pembaruan',

        // Online Resource
        'gmd:CI_OnlineResource': 'Sumber daya online - WAJIB untuk URL akses data',

        // Data types
        'gco:CharacterString': 'String karakter',
        'gco:Date': 'Tanggal',
        'gco:Integer': 'Bilangan bulat',
        'gco:Decimal': 'Bilangan desimal',
        'gco:Boolean': 'Boolean (true/false)',
        'gmd:URL': 'URL atau tautan web - WAJIB'
    };

    // Enhanced description based on path context
    let description = descriptions[elementName] || `Elemen ${elementName.replace('gmd:', '').replace('gco:', '')}`;
    
    // Add context-specific descriptions for URL/distribution elements
    if (fullPath.includes('distributionInfo') || fullPath.includes('transferOptions') || 
        fullPath.includes('linkage') || fullPath.includes('CI_OnlineResource')) {
        description += ' - WAJIB UNTUK AKSES DATA';
    }
    
    if (fullPath.includes('referenceSystemInfo')) {
        description += ' - WAJIB UNTUK SISTEM KOORDINAT';
    }

    return description;
};

const getMissingElements = (parsedXml) => {
    const comparison = compareWithTemplate(parsedXml);
    return comparison.missingElements;
};

// Helper function to get user-friendly element names for the dialog
const getElementDisplayName = (path) => {
    const pathMappings = {
        // Root level
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
        'gmd:MD_Metadata.gmd:spatialRepresentationInfo': 'Info Representasi Spasial (WAJIB)',

        // Reference system
        'gmd:MD_Metadata.gmd:referenceSystemInfo': 'Sistem Referensi Spasial (WAJIB)',

        // Identification
        'gmd:MD_Metadata.gmd:identificationInfo': 'Informasi Identifikasi',
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

        // Distribution - ENHANCED WITH MANDATORY INDICATORS
        'gmd:MD_Metadata.gmd:distributionInfo': 'Informasi Distribusi (WAJIB untuk URL)',
        'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:distributionFormat': 'Format Distribusi',
        'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions': 'Opsi Transfer (WAJIB untuk URL)',
        'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine': 'Sumber Daya Online (WAJIB)',
        'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:linkage': 'URL Dataset (WAJIB - STATIS)',
        'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:protocol': 'Protokol (WAJIB - OGC:WMS)',
        'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:name': 'Nama Layer (WAJIB)',

        // Maintenance
        'gmd:MD_Metadata.gmd:metadataMaintenance': 'Pemeliharaan Metadata'
    };

    return pathMappings[path] || path.split('.').pop().replace('gmd:', '').replace('gco:', '');
};

// Function to validate that required URL elements are present
const validateUrlElements = (parsedXml) => {
    const requiredUrlPaths = [
        'gmd:MD_Metadata.gmd:distributionInfo',
        'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions',
        'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine',
        'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:linkage',
        'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:protocol',
        'gmd:MD_Metadata.gmd:distributionInfo.gmd:MD_Distribution.gmd:transferOptions.gmd:MD_DigitalTransferOptions.gmd:onLine.gmd:CI_OnlineResource.gmd:name'
    ];

    const missingUrlElements = [];
    const errors = [];

    requiredUrlPaths.forEach(path => {
        const pathParts = path.split('.');
        let current = parsedXml;

        for (const part of pathParts) {
            if (!current || !current[part]) {
                missingUrlElements.push({
                    path,
                    element: part,
                    isRequired: true,
                    type: 'url_element'
                });
                break;
            }
            current = current[part];
        }
    });

    if (missingUrlElements.length > 0) {
        errors.push(`Elemen URL wajib hilang: ${missingUrlElements.length} elemen`);
    }

    return {
        isValid: missingUrlElements.length === 0,
        missingUrlElements,
        errors
    };
};

export { 
    compareWithTemplate, 
    getMissingElements, 
    getElementDisplayName, 
    validateUrlElements,
    isRequiredElement 
};