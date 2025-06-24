export const validateMetadataStructure = (xmlData, rawXml) => {
    const errors = [];
    const warnings = [];

    if (!xmlData || !rawXml) {
        errors.push('Tidak ada data XML untuk divalidasi');
        return {
            isValid: false,
            errors,
            warnings
        };
    }

    // Handle flexible namespace - could be with or without gmd prefix
    const metadata = xmlData['gmd:MD_Metadata'] || xmlData['MD_Metadata'];
    
    if (!metadata) {
        errors.push('Root element MD_Metadata tidak ditemukan');
        return {
            isValid: false,
            errors,
            warnings
        };
    }

    // Core validation
    validateCoreElements(metadata, errors, warnings);
    
    // URL validation - WAJIB
    validateUrlElements(metadata, errors, warnings);
    
    // Reference system validation - WAJIB
    validateReferenceSystem(metadata, errors, warnings);
    
    // Contact validation
    validateContactElements(metadata, errors, warnings);
    
    // Citation validation
    validateCitationElements(metadata, errors, warnings);

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
};

const validateCoreElements = (metadata, errors, warnings) => {
    if (!metadata) {
        errors.push('Root element MD_Metadata tidak ditemukan');
        return;
    }

    // Required core elements - check with flexible namespace
    const requiredCoreElements = [
        { path: 'gmd:fileIdentifier', name: 'File Identifier' },
        { path: 'gmd:language', name: 'Bahasa Metadata' },
        { path: 'gmd:characterSet', name: 'Character Set' },
        { path: 'gmd:hierarchyLevel', name: 'Hierarchy Level' },
        { path: 'gmd:contact', name: 'Kontak Penanggung Jawab' },
        { path: 'gmd:dateStamp', name: 'Date Stamp' },
        { path: 'gmd:metadataStandardName', name: 'Metadata Standard Name' },
        { path: 'gmd:identificationInfo', name: 'Identification Info' }
    ];

    requiredCoreElements.forEach(element => {
        // Check both with and without namespace prefix
        const withPrefix = metadata[element.path];
        const withoutPrefix = metadata[element.path.replace('gmd:', '')];
        
        if (!withPrefix && !withoutPrefix) {
            errors.push(`Element wajib '${element.name}' (${element.path}) tidak ditemukan`);
        }
    });
};

const validateUrlElements = (xmlData, errors, warnings) => {
    const metadata = xmlData['gmd:MD_Metadata'];
    
    if (!metadata) return;

    // Check for distribution info - WAJIB
    if (!metadata['gmd:distributionInfo']) {
        errors.push('Element gmd:distributionInfo tidak ditemukan - WAJIB untuk URL akses data');
        return;
    }

    const distributionInfo = metadata['gmd:distributionInfo'];
    const distribution = distributionInfo['gmd:MD_Distribution'];
    
    if (!distribution) {
        errors.push('Element gmd:MD_Distribution tidak ditemukan dalam distributionInfo');
        return;
    }

    // Check for transfer options - WAJIB
    if (!distribution['gmd:transferOptions']) {
        errors.push('Element gmd:transferOptions tidak ditemukan - WAJIB untuk URL akses data');
        return;
    }

    const transferOptions = distribution['gmd:transferOptions'];
    const digitalTransfer = transferOptions['gmd:MD_DigitalTransferOptions'];
    
    if (!digitalTransfer) {
        errors.push('Element gmd:MD_DigitalTransferOptions tidak ditemukan');
        return;
    }

    // Check for online resources - WAJIB
    if (!digitalTransfer['gmd:onLine']) {
        errors.push('Element gmd:onLine tidak ditemukan - WAJIB untuk URL akses data');
        return;
    }

    const onlineResources = Array.isArray(digitalTransfer['gmd:onLine']) 
        ? digitalTransfer['gmd:onLine'] 
        : [digitalTransfer['gmd:onLine']];

    if (onlineResources.length === 0) {
        errors.push('Tidak ada online resource yang ditemukan - minimal harus ada 1 URL');
        return;
    }

    let hasValidUrl = false;
    let hasWms = false;
    let hasWfs = false;

    onlineResources.forEach((resource, index) => {
        const ciOnlineResource = resource['gmd:CI_OnlineResource'];
        
        if (!ciOnlineResource) {
            errors.push(`Online resource ${index + 1}: Element gmd:CI_OnlineResource tidak ditemukan`);
            return;
        }

        // Validate linkage - WAJIB
        const linkage = ciOnlineResource['gmd:linkage'];
        if (!linkage || !linkage['gmd:URL']) {
            errors.push(`Online resource ${index + 1}: Element gmd:linkage dengan gmd:URL tidak ditemukan - WAJIB`);
        } else {
            const url = linkage['gmd:URL'];
            if (typeof url === 'string' && url.trim()) {
                hasValidUrl = true;
                
                // Check for static URL pattern
                if (!url.includes('geoserver') && !url.includes('wms') && !url.includes('wfs')) {
                    warnings.push(`Online resource ${index + 1}: URL '${url}' tidak menggunakan format standar geoserver`);
                }
            } else {
                errors.push(`Online resource ${index + 1}: URL kosong atau tidak valid`);
            }
        }

        // Validate protocol - WAJIB
        const protocol = ciOnlineResource['gmd:protocol'];
        if (!protocol || !protocol['gco:CharacterString']) {
            errors.push(`Online resource ${index + 1}: Element gmd:protocol tidak ditemukan - WAJIB`);
        } else {
            const protocolValue = protocol['gco:CharacterString'];
            if (protocolValue === 'OGC:WMS') {
                hasWms = true;
            } else if (protocolValue === 'OGC:WFS') {
                hasWfs = true;
            }
            
            if (!protocolValue.includes('OGC:')) {
                warnings.push(`Online resource ${index + 1}: Protocol '${protocolValue}' tidak menggunakan standar OGC`);
            }
        }

        // Validate name - WAJIB
        const name = ciOnlineResource['gmd:name'];
        if (!name || !name['gco:CharacterString']) {
            errors.push(`Online resource ${index + 1}: Element gmd:name tidak ditemukan - WAJIB`);
        } else {
            const nameValue = name['gco:CharacterString'];
            if (!nameValue.includes('palapa:')) {
                warnings.push(`Online resource ${index + 1}: Nama layer '${nameValue}' tidak menggunakan format 'palapa:[IDENTIFIER]'`);
            }
        }
    });

    if (!hasValidUrl) {
        errors.push('Tidak ada URL yang valid ditemukan - minimal harus ada 1 URL yang valid');
    }

    // Recommend both WMS and WFS
    if (!hasWms && !hasWfs) {
        warnings.push('Disarankan untuk menyediakan URL WMS dan WFS untuk akses data yang lengkap');
    } else if (!hasWms) {
        warnings.push('URL WMS tidak ditemukan - disarankan untuk menyediakan WMS untuk visualisasi');
    } else if (!hasWfs) {
        warnings.push('URL WFS tidak ditemukan - disarankan untuk menyediakan WFS untuk download data');
    }
};

const validateReferenceSystem = (xmlData, errors, warnings) => {
    const metadata = xmlData['gmd:MD_Metadata'];
    
    if (!metadata) return;

    // Reference system is MANDATORY
    if (!metadata['gmd:referenceSystemInfo']) {
        errors.push('Element gmd:referenceSystemInfo tidak ditemukan - WAJIB untuk sistem koordinat');
        return;
    }

    const referenceSystemInfo = metadata['gmd:referenceSystemInfo'];
    const referenceSystem = referenceSystemInfo['gmd:MD_ReferenceSystem'];
    
    if (!referenceSystem) {
        errors.push('Element gmd:MD_ReferenceSystem tidak ditemukan');
        return;
    }

    const identifier = referenceSystem['gmd:referenceSystemIdentifier'];
    if (!identifier) {
        errors.push('Element gmd:referenceSystemIdentifier tidak ditemukan - WAJIB');
        return;
    }

    const rsIdentifier = identifier['gmd:RS_Identifier'];
    if (!rsIdentifier) {
        errors.push('Element gmd:RS_Identifier tidak ditemukan');
        return;
    }

    // Check code
    const code = rsIdentifier['gmd:code'];
    if (!code || !code['gco:CharacterString']) {
        errors.push('Kode sistem referensi tidak ditemukan - WAJIB (contoh: 4326)');
    } else {
        const codeValue = code['gco:CharacterString'];
        if (codeValue !== '4326') {
            warnings.push(`Sistem referensi '${codeValue}' digunakan. Standar yang disarankan adalah EPSG:4326`);
        }
    }

    // Check code space
    const codeSpace = rsIdentifier['gmd:codeSpace'];
    if (!codeSpace || !codeSpace['gco:CharacterString']) {
        errors.push('Code space sistem referensi tidak ditemukan - WAJIB (contoh: EPSG)');
    } else {
        const codeSpaceValue = codeSpace['gco:CharacterString'];
        if (codeSpaceValue !== 'EPSG') {
            warnings.push(`Code space '${codeSpaceValue}' digunakan. Standar yang disarankan adalah 'EPSG'`);
        }
    }
};

const validateContactElements = (xmlData, errors, warnings) => {
    const metadata = xmlData['gmd:MD_Metadata'];
    
    if (!metadata) return;

    const contacts = metadata['gmd:contact'];
    if (!contacts) {
        errors.push('Tidak ada kontak yang ditemukan - minimal harus ada 1 kontak');
        return;
    }

    const contactArray = Array.isArray(contacts) ? contacts : [contacts];
    
    if (contactArray.length === 0) {
        errors.push('Array kontak kosong - minimal harus ada 1 kontak');
        return;
    }

    let hasWalidata = false;
    let hasProdusenData = false;

    contactArray.forEach((contact, index) => {
        const responsibleParty = contact['gmd:CI_ResponsibleParty'];
        
        if (!responsibleParty) {
            errors.push(`Kontak ${index + 1}: Element gmd:CI_ResponsibleParty tidak ditemukan`);
            return;
        }

        // Check required contact fields
        if (!responsibleParty['gmd:organisationName']) {
            errors.push(`Kontak ${index + 1}: Nama organisasi tidak ditemukan - WAJIB`);
        }

        if (!responsibleParty['gmd:role']) {
            errors.push(`Kontak ${index + 1}: Role tidak ditemukan - WAJIB`);
        } else {
            const role = responsibleParty['gmd:role']['gmd:CI_RoleCode'];
            if (role && role['@_codeListValue']) {
                const roleValue = role['@_codeListValue'];
                if (roleValue === 'Walidata') {
                    hasWalidata = true;
                } else if (roleValue === 'Produsen Data') {
                    hasProdusenData = true;
                }
            }
        }

        // Validate email
        const contactInfo = responsibleParty['gmd:contactInfo'];
        if (contactInfo && contactInfo['gmd:CI_Contact']) {
            const address = contactInfo['gmd:CI_Contact']['gmd:address'];
            if (address && address['gmd:CI_Address']) {
                const email = address['gmd:CI_Address']['gmd:electronicMailAddress'];
                if (!email || !email['gco:CharacterString']) {
                    warnings.push(`Kontak ${index + 1}: Email tidak ditemukan - disarankan untuk melengkapi`);
                }
            }
        }
    });

    // Check for required roles
    if (!hasWalidata) {
        warnings.push('Kontak dengan role "Walidata" tidak ditemukan - disarankan untuk melengkapi');
    }
    
    if (!hasProdusenData) {
        warnings.push('Kontak dengan role "Produsen Data" tidak ditemukan - disarankan untuk melengkapi');
    }
};

const validateCitationElements = (xmlData, errors, warnings) => {
    const metadata = xmlData['gmd:MD_Metadata'];
    
    if (!metadata) return;

    const identificationInfo = metadata['gmd:identificationInfo'];
    if (!identificationInfo) {
        errors.push('Element gmd:identificationInfo tidak ditemukan');
        return;
    }

    const dataIdentification = identificationInfo['gmd:MD_DataIdentification'];
    if (!dataIdentification) {
        errors.push('Element gmd:MD_DataIdentification tidak ditemukan dalam identificationInfo');
        return;
    }

    // Check citation
    const citation = dataIdentification['gmd:citation'];
    if (!citation) {
        errors.push('Element gmd:citation tidak ditemukan - WAJIB');
        return;
    }

    const ciCitation = citation['gmd:CI_Citation'];
    if (!ciCitation) {
        errors.push('Element gmd:CI_Citation tidak ditemukan');
        return;
    }

    // Check title
    if (!ciCitation['gmd:title']) {
        errors.push('Title dalam citation tidak ditemukan - WAJIB');
    }

    // Check date
    if (!ciCitation['gmd:date']) {
        errors.push('Date dalam citation tidak ditemukan - WAJIB');
    }

    // Check abstract
    if (!dataIdentification['gmd:abstract']) {
        errors.push('Element gmd:abstract tidak ditemukan - WAJIB');
    }

    // Check point of contact
    if (!dataIdentification['gmd:pointOfContact']) {
        errors.push('Element gmd:pointOfContact tidak ditemukan - WAJIB');
    }
};

export const showValidationResults = (validation) => {
    if (validation.isValid) {
        if (validation.warnings.length > 0) {
            return {
                message: `Validasi berhasil dengan ${validation.warnings.length} peringatan:\n${validation.warnings.join('\n')}`,
                icon: 'warning'
            };
        } else {
            return {
                message: 'Validasi berhasil! Semua elemen wajib termasuk URL akses data sudah lengkap.',
                icon: 'success'
            };
        }
    } else {
        const errorMessage = `Validasi gagal! Ditemukan ${validation.errors.length} error kritis:\n${validation.errors.slice(0, 5).join('\n')}`;
        const additionalErrors = validation.errors.length > 5 ? `\n... dan ${validation.errors.length - 5} error lainnya` : '';
        
        return {
            message: errorMessage + additionalErrors,
            icon: 'error'
        };
    }
};

// Additional utility to check URL compliance
export const validateUrlCompliance = (xmlData) => {
    const metadata = xmlData['gmd:MD_Metadata'];
    const compliance = {
        hasDistributionInfo: false,
        hasOnlineResource: false,
        hasValidUrl: false,
        hasWmsUrl: false,
        hasWfsUrl: false,
        urlCount: 0,
        urls: []
    };

    if (!metadata || !metadata['gmd:distributionInfo']) {
        return compliance;
    }

    compliance.hasDistributionInfo = true;

    const distribution = metadata['gmd:distributionInfo']['gmd:MD_Distribution'];
    if (!distribution || !distribution['gmd:transferOptions']) {
        return compliance;
    }

    const digitalTransfer = distribution['gmd:transferOptions']['gmd:MD_DigitalTransferOptions'];
    if (!digitalTransfer || !digitalTransfer['gmd:onLine']) {
        return compliance;
    }

    compliance.hasOnlineResource = true;

    const onlineResources = Array.isArray(digitalTransfer['gmd:onLine']) 
        ? digitalTransfer['gmd:onLine'] 
        : [digitalTransfer['gmd:onLine']];

    onlineResources.forEach(resource => {
        const ciOnlineResource = resource['gmd:CI_OnlineResource'];
        if (ciOnlineResource) {
            const linkage = ciOnlineResource['gmd:linkage'];
            const protocol = ciOnlineResource['gmd:protocol'];
            
            if (linkage && linkage['gmd:URL']) {
                const url = linkage['gmd:URL'];
                compliance.urls.push({
                    url: url,
                    protocol: protocol ? protocol['gco:CharacterString'] : 'Unknown'
                });
                compliance.urlCount++;
                compliance.hasValidUrl = true;

                if (protocol && protocol['gco:CharacterString'] === 'OGC:WMS') {
                    compliance.hasWmsUrl = true;
                } else if (protocol && protocol['gco:CharacterString'] === 'OGC:WFS') {
                    compliance.hasWfsUrl = true;
                }
            }
        }
    });

    return compliance;
};