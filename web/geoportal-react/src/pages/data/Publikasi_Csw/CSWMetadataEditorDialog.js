import React, { useState, useEffect, useRef } from 'react';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { retrieve, create } from "src/redux/actions/publikasi_csw";
import swal from "sweetalert";
import { validateUrlCompliance } from './validationUtils';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
  Tooltip,
  CircularProgress,
  Input,
  Stack,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  AppBar,
  Toolbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import PublishIcon from '@mui/icons-material/Publish';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { blue } from "@mui/material/colors";

import { validateMetadataStructure, showValidationResults } from './validationUtils';
import { compareWithTemplate, getMissingElements } from './templateComparison';
import MissingElementsDialog from './MissingElementsDialog';
import { TEMPLATE_XML } from './Template';

const FormField = ({ field, value, onChange, highlight }) => {
  const fieldRef = useRef(null);

  useEffect(() => {
    if (highlight && fieldRef.current) {
      fieldRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlight]);

  return (
    <Box
      sx={{
        width: '100%',
        mb: 2,
        backgroundColor: highlight ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
        transition: 'background-color 0.3s ease'
      }}
      ref={fieldRef}
    >
      <TextField
        fullWidth
        label={field.label}
        value={value || ''}
        onChange={(e) => onChange(e, field.path)}
        variant="outlined"
        margin="normal"
        InputProps={{
          endAdornment: (
            <Tooltip
              title={
                <Typography variant="body2" sx={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>
                  {field.path}
                </Typography>
              }
            >
              <InfoOutlinedIcon color="action" fontSize="small" sx={{ ml: 1, cursor: 'pointer' }} />
            </Tooltip>
          ),
        }}
      />
    </Box>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`metadata-tabpanel-${index}`}
      aria-labelledby={`metadata-tab-${index}`}
      {...other}
      style={{ height: '100%', overflow: index === 1 ? 'hidden' : 'auto' }}
    >
      {value === index && (
        <Box sx={{ p: 3, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `metadata-tab-${index}`,
    'aria-controls': `metadata-tabpanel-${index}`,
  };
}

const AddFieldDialog = ({ open, onClose, onAdd }) => {
  const [fieldPath, setFieldPath] = useState('');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldValue, setFieldValue] = useState('');

  const handleAdd = () => {
    if (!fieldPath || !fieldLabel) return;
    onAdd({
      path: fieldPath,
      label: fieldLabel,
      value: fieldValue || '',
      type: 'string'
    });
    setFieldPath('');
    setFieldLabel('');
    setFieldValue('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="add-field-dialog-title">
      <DialogTitle id="add-field-dialog-title">Add New Field</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the details for the new metadata field.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Field Path"
          helperText="e.g., 'metadata.title' or 'gmd:MD_Metadata.gmd:identificationInfo'"
          fullWidth
          variant="outlined"
          value={fieldPath}
          onChange={(e) => setFieldPath(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Field Label"
          helperText="Human-readable name for this field"
          fullWidth
          variant="outlined"
          value={fieldLabel}
          onChange={(e) => setFieldLabel(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Initial Value (optional)"
          fullWidth
          variant="outlined"
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          color="primary"
          disabled={!fieldPath || !fieldLabel}
        >
          Add Field
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PublishDialog = ({ open, onClose, onPublish, uuid, isPublishing, xmlData, rawXml }) => {
  const [validationStatus, setValidationStatus] = useState(null);

  useEffect(() => {
    if (open && xmlData && rawXml) {
      const validation = validateMetadataStructure(xmlData, rawXml);
      setValidationStatus(validation);
    }
  }, [open, xmlData, rawXml]);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="publish-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="publish-dialog-title">Publish Metadata</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to publish this metadata? Published metadata will be available through the CSW service.
        </DialogContentText>

        {validationStatus && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Validation Status:
            </Typography>
            {validationStatus.isValid ? (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', mb: 1 }}>
                <CheckCircleIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Validation successful
                  {validationStatus.warnings.length > 0 && ` (${validationStatus.warnings.length} warnings)`}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ color: 'error.main', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ErrorIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Found {validationStatus.errors.length} critical errors
                  </Typography>
                </Box>
              </Box>
            )}

            {validationStatus.errors.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
                  Critical Errors:
                </Typography>
                {validationStatus.errors.slice(0, 3).map((error, index) => (
                  <Typography key={index} variant="caption" display="block" color="error" sx={{ ml: 2 }}>
                    • {error}
                  </Typography>
                ))}
                {validationStatus.errors.length > 3 && (
                  <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                    ... and {validationStatus.errors.length - 3} more errors
                  </Typography>
                )}
              </Box>
            )}

            {validationStatus.warnings.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="warning.main" sx={{ fontWeight: 'bold' }}>
                  Warnings:
                </Typography>
                {validationStatus.warnings.slice(0, 2).map((warning, index) => (
                  <Typography key={index} variant="caption" display="block" color="warning.main" sx={{ ml: 2 }}>
                    • {warning}
                  </Typography>
                ))}
                {validationStatus.warnings.length > 2 && (
                  <Typography variant="caption" color="warning.main" sx={{ ml: 2 }}>
                    ... and {validationStatus.warnings.length - 2} more warnings
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPublishing}>Cancel</Button>
        <Button
          onClick={() => onPublish(uuid)}
          variant="contained"
          color="primary"
          disabled={isPublishing || (validationStatus && !validationStatus.isValid)}
        >
          {isPublishing ? (
            <CircularProgress
              size={24}
              sx={{
                color: blue[500],
                position: "absolute",
                top: "50%",
                left: "40%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          ) : (
            "Publish"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const buildTreeFromFormStructure = (formStructure) => {
  const root = [];

  formStructure.forEach(field => {
    const parts = field.path.split('.');
    let current = root;

    parts.forEach((part, index) => {
      let node = current.find(n => n.key === part);
      if (!node) {
        node = {
          key: part,
          label: part,
          children: [],
          path: parts.slice(0, index + 1).join('.')
        };
        current.push(node);
      }

      if (index === parts.length - 1) {
        node.label = field.label || part;
      }

      current = node.children;
    });
  });

  return root;
};

const TreeNode = ({ node, onClick, level = 0, expandedKeys, setExpandedKeys }) => {
  const hasChildren = node.children?.length > 0;
  const isExpanded = expandedKeys[node.path] ?? true;

  const toggle = () => {
    if (hasChildren) {
      setExpandedKeys(prev => ({
        ...prev,
        [node.path]: !isExpanded
      }));
    }
    onClick(node);
  };

  return (
    <Box sx={{ pl: level * 2 }}>
      <Box
        onClick={toggle}
        sx={{
          cursor: 'pointer',
          color: 'primary.main',
          fontWeight: 'medium',
          display: 'flex',
          alignItems: 'center',
          py: 0.5,
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        {hasChildren && (
          <Box sx={{ mr: 1 }}>
            {isExpanded ? '▼' : '▶'}
          </Box>
        )}
        {node.label}
      </Box>
      {hasChildren && isExpanded && (
        <Box>
          {node.children.map((child, index) => (
            <TreeNode
              key={index}
              node={child}
              onClick={onClick}
              level={level + 1}
              expandedKeys={expandedKeys}
              setExpandedKeys={setExpandedKeys}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

const CustomTreeView = ({ treeData, onItemClick, width, onDrag, expandedKeys, setExpandedKeys }) => (
  <Box sx={{
    width,
    height: '100%',
    borderRight: '1px solid #ccc',
    p: 2,
    overflowY: 'auto',
    position: 'relative',
    userSelect: 'none'
  }}>
    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
      <Button size="small" variant="outlined" onClick={() => {
        const all = {};
        const fillAll = (nodes) => {
          nodes.forEach(n => {
            all[n.path] = true;
            if (n.children) fillAll(n.children);
          });
        };
        fillAll(treeData);
        setExpandedKeys(all);
      }}>
        Expand All
      </Button>
      <Button size="small" variant="outlined" onClick={() => {
        const none = {};
        const fillNone = (nodes) => {
          nodes.forEach(n => {
            none[n.path] = false;
            if (n.children) fillNone(n.children);
          });
        };
        fillNone(treeData);
        setExpandedKeys(none);
      }}>
        Collapse All
      </Button>
    </Stack>

    {treeData.map((node, index) => (
      <TreeNode
        key={index}
        node={node}
        onClick={onItemClick}
        expandedKeys={expandedKeys}
        setExpandedKeys={setExpandedKeys}
      />
    ))}

    <Box
      onMouseDown={onDrag}
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '5px',
        height: '100%',
        cursor: 'col-resize',
        zIndex: 10,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.1)'
        }
      }}
    />
  </Box>
);

function CSWMetadataEditorDialog({ open, onClose, metadataUrl, dataUuid }) {
  const [xmlData, setXmlData] = useState(null);
  const [formData, setFormData] = useState({});
  const [formStructure, setFormStructure] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [rawXml, setRawXml] = useState('');
  const [addFieldDialogOpen, setAddFieldDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [metadataFile, setMetadataFile] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [missingElementsDialogOpen, setMissingElementsDialogOpen] = useState(false);
  const [missingElements, setMissingElements] = useState([]);
  const [formSearchQuery, setFormSearchQuery] = useState('');
  const [xmlSearchQuery, setXmlSearchQuery] = useState('');
  const [formSearchResults, setFormSearchResults] = useState([]);
  const [xmlSearchResults, setXmlSearchResults] = useState([]);
  const [formResultIndex, setFormResultIndex] = useState(-1);
  const [xmlResultIndex, setXmlResultIndex] = useState(-1);
  const [highlightedFieldPath, setHighlightedFieldPath] = useState(null);
  const [treeWidth, setTreeWidth] = useState(300);
  const [expandedKeys, setExpandedKeys] = useState({});
  const [fileErrors, setFileErrors] = useState({ metadata: "" });
  const dispatch = useDispatch();

  const xmlEditorRef = useRef(null);
  const dialogContentRef = useRef(null);

  useEffect(() => {
    if (open && metadataUrl) {
      fetchMetadata(metadataUrl);
    }
  }, [open, metadataUrl]);

  const fetchMetadata = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(url);
      const xmlContent = response.data;
      setRawXml(xmlContent);
      parseXmlToForm(xmlContent);
      setLoading(false);
      checkAgainstTemplate(xmlContent);
    } catch (err) {
      console.error("Error fetching metadata:", err);
      setError("Failed to fetch metadata file. Please try again.");
      setLoading(false);
    }
  };

  const checkAgainstTemplate = (xmlContent) => {
    try {
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        textNodeName: '#text'
      });

      const parsedXml = parser.parse(xmlContent);
      const comparison = compareWithTemplate(parsedXml);

      if (comparison.missingElements.length > 0) {
        setMissingElements(comparison.missingElements);
        setMissingElementsDialogOpen(true);
      }
    } catch (err) {
      console.error("Error comparing with template:", err);
    }
  };

  // Enhanced function to add missing elements with static URL defaults
  const handleAddMissingElementsWithStaticUrls = (elementsToAdd) => {
    if (!xmlData) return;

    const updatedXmlData = structuredClone(xmlData);

    elementsToAdd.forEach(element => {
      const pathParts = element.path.split('.');
      let current = updatedXmlData;

      // Navigate to the correct position in the XML structure
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }

      const lastPart = pathParts[pathParts.length - 1];

      // Apply static URL values for specific elements
      if (element.path.includes('linkage')) {
        current[lastPart] = {
          'gmd:URL': 'http://localhost/geoserver/wms'
        };
      } else if (element.path.includes('protocol')) {
        current[lastPart] = {
          'gco:CharacterString': 'OGC:WMS'
        };
      } else if (element.path.includes('name') && element.path.includes('CI_OnlineResource')) {
        current[lastPart] = {
          'gco:CharacterString': 'sibatnas:[IDENTIFIER_UNIK_DATASET]'
        };
      } else if (element.path.includes('transferOptions')) {
        // Create complete transfer options structure with both WMS and WFS
        current[lastPart] = {
          'gmd:MD_DigitalTransferOptions': {
            'gmd:unitsOfDistribution': {
              'gco:CharacterString': 'Layers'
            },
            'gmd:onLine': [
              {
                'gmd:CI_OnlineResource': {
                  'gmd:linkage': {
                    'gmd:URL': 'http://localhost/geoserver/wms'
                  },
                  'gmd:protocol': {
                    'gco:CharacterString': 'OGC:WMS'
                  },
                  'gmd:name': {
                    'gco:CharacterString': 'sibatnas:[IDENTIFIER_UNIK_DATASET]'
                  }
                }
              },
              {
                'gmd:CI_OnlineResource': {
                  'gmd:linkage': {
                    'gmd:URL': 'http://localhost/geoserver/wfs'
                  },
                  'gmd:protocol': {
                    'gco:CharacterString': 'OGC:WFS'
                  },
                  'gmd:name': {
                    'gco:CharacterString': 'sibatnas:[IDENTIFIER_UNIK_DATASET]'
                  }
                }
              }
            ]
          }
        };
      } else if (element.path.includes('distributionInfo')) {
        // Create complete distribution info structure
        current[lastPart] = {
          'gmd:MD_Distribution': {
            'gmd:distributionFormat': {
              '@_gco:nilReason': 'missing'
            },
            'gmd:transferOptions': {
              'gmd:MD_DigitalTransferOptions': {
                'gmd:unitsOfDistribution': {
                  'gco:CharacterString': 'Layers'
                },
                'gmd:onLine': [
                  {
                    'gmd:CI_OnlineResource': {
                      'gmd:linkage': {
                        'gmd:URL': 'http://localhost/geoserver/wms'
                      },
                      'gmd:protocol': {
                        'gco:CharacterString': 'OGC:WMS'
                      },
                      'gmd:name': {
                        'gco:CharacterString': 'sibatnas:[IDENTIFIER_UNIK_DATASET]'
                      }
                    }
                  },
                  {
                    'gmd:CI_OnlineResource': {
                      'gmd:linkage': {
                        'gmd:URL': 'http://localhost/geoserver/wfs'
                      },
                      'gmd:protocol': {
                        'gco:CharacterString': 'OGC:WFS'
                      },
                      'gmd:name': {
                        'gco:CharacterString': 'sibatnas:[IDENTIFIER_UNIK_DATASET]'
                      }
                    }
                  }
                ]
              }
            }
          }
        };
      } else if (element.path.includes('referenceSystemInfo')) {
        // Create complete reference system structure
        current[lastPart] = {
          'gmd:MD_ReferenceSystem': {
            'gmd:referenceSystemIdentifier': {
              'gmd:RS_Identifier': {
                'gmd:code': {
                  'gco:CharacterString': '4326'
                },
                'gmd:codeSpace': {
                  'gco:CharacterString': 'EPSG'
                }
              }
            }
          }
        };
      } else {
        // Use default or sample value for other elements
        current[lastPart] = element.defaultValue || element.sampleValue || '';
      }
    });

    setXmlData(updatedXmlData);

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      format: true,
      indentBy: '  '
    });

    try {
      const xml = builder.build(updatedXmlData);
      setRawXml(xml);
      parseXmlToForm(xml);
    } catch (error) {
      console.error("Error generating XML:", error);
    }

    setMissingElementsDialogOpen(false);
  };

  const parseXmlToForm = (xmlContent) => {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text'
    });

    try {
      const result = parser.parse(xmlContent);
      setXmlData(result);

      const extractedFormStructure = extractFormStructure(result);
      setFormStructure(extractedFormStructure);

      const initialFormData = {};
      extractedFormStructure.forEach(field => {
        initialFormData[field.path] = field.value || '';
      });

      setFormData(initialFormData);
    } catch (err) {
      console.error("Error parsing XML:", err);
      setError("Error parsing XML. The file may be invalid or corrupted.");
    }
  };

  const extractFormStructure = (xmlObj) => {
    const result = [];
    const traverseObj = (obj, path = [], parentLabel = '') => {
      if (!obj) return;

      Object.keys(obj).forEach(key => {
        const currentPath = [...path, key];
        const value = obj[key];

        if (key.startsWith('@_')) return;

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          const pathStr = currentPath.join('.');
          const label = key === '#text' ? 'Text Content' :
            key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
          result.push({
            path: pathStr,
            label: `${parentLabel ? parentLabel + ' > ' : ''}${label}`,
            value: value,
            type: typeof value
          });
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              traverseObj(item, [...currentPath, index], `${key}[${index}]`);
            } else {
              const pathStr = [...currentPath, index].join('.');
              const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
              result.push({
                path: pathStr,
                label: `${parentLabel ? parentLabel + ' > ' : ''}${label}[${index}]`,
                value: item,
                type: typeof item
              });
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          traverseObj(value, currentPath, key);
        }
      });
    };

    traverseObj(xmlObj);
    return result;
  };

  const handleInputChange = (e, path) => {
    const newValue = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      [path]: newValue
    }));
  };

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      updateRawXml();
    }
  }, [formData]);

  const updateRawXml = () => {
    if (!xmlData) return;

    const updatedXmlData = updateXmlWithFormData();
    if (!updatedXmlData) return;

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      format: true,
      indentBy: '  '
    });

    try {
      const xml = builder.build(updatedXmlData);
      setRawXml(xml);
    } catch (error) {
      console.error("Error generating XML:", error);
      setError("Error generating XML.");
    }
  };

  const updateXmlWithFormData = () => {
    if (!xmlData) return null;

    const newXmlData = structuredClone(xmlData);

    Object.entries(formData).forEach(([path, value]) => {
      const pathParts = path.split('.');

      const setNestedValue = (obj, pathArr, val) => {
        if (pathArr.length === 0) return;

        const key = pathArr[0];

        if (pathArr.length === 1) {
          obj[key] = val;
          return;
        }

        if (!isNaN(pathArr[1])) {
          const index = parseInt(pathArr[1], 10);

          if (!Array.isArray(obj[key])) {
            obj[key] = [];
          }

          while (obj[key].length <= index) {
            obj[key].push(typeof obj[key][0] === 'object' ? {} : '');
          }

          setNestedValue(obj[key][index], pathArr.slice(2), val);
          return;
        }

        if (obj[key] === undefined || obj[key] === null) {
          obj[key] = {};
        }

        if (typeof obj[key] !== 'object' || Array.isArray(obj[key])) {
          obj[key] = {};
        }

        setNestedValue(obj[key], pathArr.slice(1), val);
      };

      setNestedValue(newXmlData, pathParts, value);
    });

    return newXmlData;
  };

  const handleRawXmlChange = (e) => {
    const newXml = e.target.value;
    setRawXml(newXml);

    try {
      parseXmlToForm(newXml);
    } catch (error) {
      console.error("Error parsing XML:", error);
      setError("Error parsing XML. Please check your syntax.");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFile(file, 'metadata')) return;

    setLoading(true);
    setError(null);
    setUploadedFileName(file.name);
    setMetadataFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        setRawXml(content);
        parseXmlToForm(content);
        setLoading(false);
        checkAgainstTemplate(content);
      } catch (err) {
        console.error("Error reading file:", err);
        setError("Failed to read the uploaded file. Please check the file format.");
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Error reading the file. Please try again.");
      setLoading(false);
    };

    reader.readAsText(file);
  };

  const validateFile = (file, type) => {
    setFileErrors(prev => ({ ...prev, [type]: "" }));
    if (!file) return true;

    let allowedTypes, maxSize, errorMessage;

    switch (type) {
      case 'metadata':
        allowedTypes = ['.xml'];
        maxSize = process.env.REACT_APP_MAX_METADATA_SIZE * 1024 * 1024;
        errorMessage = `Metadata must be .xml and max ${process.env.REACT_APP_MAX_METADATA_SIZE} MB`;
        break;
      default:
        return false;
    }

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setFileErrors(prev => ({ ...prev, [type]: errorMessage }));
      return false;
    }

    if (file.size > maxSize) {
      setFileErrors(prev => ({ ...prev, [type]: errorMessage }));
      return false;
    }

    if (file.size === 0) {
      return { valid: false, message: "Metadata file cannot be empty." };
    }

    return { valid: true };
  };

  const saveAsXml = () => {
    try {
      const filename = uploadedFileName || 'updated-metadata.xml';
      const blob = new Blob([rawXml], { type: 'text/xml;charset=utf-8' });
      saveAs(blob, filename, { autoBom: true });
      setMetadataFile(new File([blob], filename, { type: 'text/xml' }));
    } catch (error) {
      console.error("Error saving XML:", error);
      setError("Error saving XML file");
    }
  };

  const createXmlFileFromRawXml = () => {
    try {
      const filename = uploadedFileName || 'metadata.xml';
      const blob = new Blob([rawXml], { type: 'text/xml;charset=utf-8' });
      return new File([blob], filename, { type: 'text/xml' });
    } catch (error) {
      console.error("Error creating XML file:", error);
      setError("Error creating XML file");
      return null;
    }
  };

  const proceedWithPublish = (uuid) => {
    setIsPublishing(true);

    const metadataFileToPublish = createXmlFileFromRawXml();
    if (!metadataFileToPublish) {
      setIsPublishing(false);
      return;
    }

    const validation = validateFile(metadataFileToPublish, 'metadata');
    if (!validation.valid) {
      setIsPublishing(false);
      swal("Error", validation.message, "error", {
        buttons: false,
        timer: 3000,
      });
      return;
    }

    dispatch(create(uuid, metadataFileToPublish))
      .then((data) => {
        setIsPublishing(false);
        setPublishDialogOpen(false);

        swal("Success", "Metadata published successfully!", "success", {
          buttons: false,
          timer: 2000,
        });

        dispatch(retrieve());
        handleClose();
      })
      .catch((e) => {
        setIsPublishing(false);
        setPublishDialogOpen(false);

        swal("Error", e.response?.data?.message || "Failed to publish metadata", "error", {
          buttons: false,
          timer: 7000,
        });
        console.log(e);
      });
  };

  const validateMetadataWithUrlCheck = (uuid) => {
    if (!uuid) {
      swal("Error", "Missing dataset UUID for publishing", "error", {
        buttons: false,
        timer: 2000,
      });
      return;
    }

    const validation = validateMetadataStructure(xmlData, rawXml);
    const urlCompliance = validateUrlCompliance(xmlData);

    // Enhanced error messages
    let message = '';
    let icon = 'error';

    if (!validation.isValid) {
      message = `Validasi gagal! Ditemukan ${validation.errors.length} error kritis:\n`;
      message += validation.errors.slice(0, 3).join('\n');

      if (validation.errors.length > 3) {
        message += `\n... dan ${validation.errors.length - 3} error lainnya`;
      }

      // Add URL-specific errors
      if (!urlCompliance.hasDistributionInfo) {
        message += '\n\n⚠️ CRITICAL: Tidak ada informasi distribusi URL';
      }
      if (!urlCompliance.hasValidUrl) {
        message += '\n⚠️ CRITICAL: Tidak ada URL akses data yang valid';
      }

      swal("Validasi Gagal", message, "error", {
        button: "OK",
      });
      return;
    }

    // Check URL compliance specifically
    if (!urlCompliance.hasValidUrl) {
      swal("URL Missing", "URL akses data tidak ditemukan. Ini adalah elemen WAJIB untuk metadata yang valid.", "error", {
        button: "OK",
      });
      return;
    }

    // Success with potential warnings
    if (validation.warnings.length > 0 || !urlCompliance.hasWmsUrl || !urlCompliance.hasWfsUrl) {
      let warningMessage = 'Metadata valid namun ada beberapa rekomendasi:\n';

      if (validation.warnings.length > 0) {
        warningMessage += validation.warnings.slice(0, 2).join('\n');
      }

      if (!urlCompliance.hasWmsUrl) {
        warningMessage += '\n• Disarankan menambah URL WMS untuk visualisasi';
      }

      if (!urlCompliance.hasWfsUrl) {
        warningMessage += '\n• Disarankan menambah URL WFS untuk download';
      }

      warningMessage += `\n\nURL yang ditemukan: ${urlCompliance.urlCount}`;

      swal({
        title: "Metadata Valid dengan Peringatan",
        text: warningMessage,
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: false,
            visible: true
          },
          confirm: {
            text: "Lanjut Publish",
            value: true,
            visible: true
          }
        }
      }).then((willPublish) => {
        if (willPublish) {
          proceedWithPublish(uuid);
        }
      });
    } else {
      swal("Validasi Berhasil", `Metadata valid dan siap dipublish!\nURL ditemukan: ${urlCompliance.urlCount} (WMS: ${urlCompliance.hasWmsUrl ? '✓' : '✗'}, WFS: ${urlCompliance.hasWfsUrl ? '✓' : '✗'})`, "success", {
        buttons: false,
        timer: 2000,
      });
      setTimeout(() => {
        proceedWithPublish(uuid);
      }, 2000);
    }
  };

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = treeWidth;

    const handleMouseMove = (e) => {
      const newWidth = Math.min(Math.max(startWidth + (e.clientX - startX), 200), 600);
      setTreeWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);

    if (newValue === 0) {
      setXmlSearchQuery('');
      setXmlSearchResults([]);
      setXmlResultIndex(-1);
    } else {
      setFormSearchQuery('');
      setFormSearchResults([]);
      setFormResultIndex(-1);
      setHighlightedFieldPath(null);
    }
  };

  const handleClose = () => {
    setXmlData(null);
    setFormData({});
    setFormStructure([]);
    setRawXml('');
    setActiveTab(0);
    setError(null);
    setUploadedFileName('');
    setFormSearchQuery('');
    setXmlSearchQuery('');
    setFormSearchResults([]);
    setXmlSearchResults([]);
    setFormResultIndex(-1);
    setXmlResultIndex(-1);
    setHighlightedFieldPath(null);
    setMetadataFile(null);
    setFileErrors({ metadata: "" });
    onClose();
  };

  const handleFormSearchChange = (e) => {
    setFormSearchQuery(e.target.value);
  };

  const handleXmlSearchChange = (e) => {
    setXmlSearchQuery(e.target.value);
  };

  const clearFormSearch = () => {
    setFormSearchQuery('');
    setFormSearchResults([]);
    setFormResultIndex(-1);
    setHighlightedFieldPath(null);
  };

  const clearXmlSearch = () => {
    setXmlSearchQuery('');
    setXmlSearchResults([]);
    setXmlResultIndex(-1);
  };

  useEffect(() => {
    if (!formSearchQuery.trim()) {
      setFormSearchResults([]);
      setFormResultIndex(-1);
      setHighlightedFieldPath(null);
      return;
    }

    const results = [];
    const query = formSearchQuery.toLowerCase();

    formStructure.forEach(field => {
      const fieldValue = String(formData[field.path] || '');
      const fieldLabel = field.label || '';
      const fieldPath = field.path || '';

      if (fieldValue.toLowerCase().includes(query) ||
        fieldLabel.toLowerCase().includes(query) ||
        fieldPath.toLowerCase().includes(query)) {
        results.push({
          type: 'form',
          path: field.path,
          label: field.label
        });
      }
    });

    setFormSearchResults(results);
    setFormResultIndex(results.length > 0 ? 0 : -1);

    if (results.length > 0) {
      setHighlightedFieldPath(results[0].path);
    } else {
      setHighlightedFieldPath(null);
    }
  }, [formSearchQuery, formData, formStructure]);

  useEffect(() => {
    if (!xmlSearchQuery.trim()) {
      setXmlSearchResults([]);
      setXmlResultIndex(-1);
      return;
    }

    const results = [];
    const query = xmlSearchQuery.toLowerCase();

    if (rawXml) {
      const lines = rawXml.split('\n');
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(query)) {
          results.push({
            type: 'xml',
            lineNumber: index,
            content: line.trim()
          });
        }
      });
    }

    setXmlSearchResults(results);
    setXmlResultIndex(results.length > 0 ? 0 : -1);
  }, [xmlSearchQuery, rawXml]);

  const highlightXmlLine = (lineNumber) => {
    if (xmlEditorRef.current && activeTab === 1) {
      const textarea = xmlEditorRef.current.querySelector('textarea');
      if (!textarea) return;

      const lines = rawXml.split('\n');
      let position = 0;

      for (let i = 0; i < lineNumber; i++) {
        position += lines[i].length + 1;
      }

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(position, position + lines[lineNumber].length);

        const lineHeight = textarea.scrollHeight / lines.length;
        textarea.scrollTop = lineNumber * lineHeight - textarea.clientHeight / 2;
      }, 50);
    }
  };

  const navigateFormResults = (direction) => {
    if (formSearchResults.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (formResultIndex + 1) % formSearchResults.length;
    } else {
      newIndex = (formResultIndex - 1 + formSearchResults.length) % formSearchResults.length;
    }

    setFormResultIndex(newIndex);
    const result = formSearchResults[newIndex];
    setHighlightedFieldPath(result.path);
  };

  const navigateXmlResults = (direction) => {
    if (xmlSearchResults.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (xmlResultIndex + 1) % xmlSearchResults.length;
    } else {
      newIndex = (xmlResultIndex - 1 + xmlSearchResults.length) % xmlSearchResults.length;
    }

    setXmlResultIndex(newIndex);
    const result = xmlSearchResults[newIndex];
    highlightXmlLine(result.lineNumber);
  };

  const renderSearchBar = () => {
    if (activeTab === 0) {
      return (
        <TextField
          fullWidth
          placeholder="Search in form fields..."
          value={formSearchQuery}
          onChange={handleFormSearchChange}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {formSearchQuery && (
                  <>
                    <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                      {formSearchResults.length > 0 ?
                        `${formResultIndex + 1}/${formSearchResults.length}` :
                        '0 results'}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => navigateFormResults('prev')}
                      disabled={formSearchResults.length === 0}
                    >
                      <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => navigateFormResults('next')}
                      disabled={formSearchResults.length === 0}
                    >
                      <KeyboardArrowDownIcon />
                    </IconButton>
                    <IconButton size="small" onClick={clearFormSearch}>
                      <CloseIcon />
                    </IconButton>
                  </>
                )}
              </InputAdornment>
            )
          }}
        />
      );
    } else {
      return (
        <TextField
          fullWidth
          placeholder="Search in XML..."
          value={xmlSearchQuery}
          onChange={handleXmlSearchChange}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {xmlSearchQuery && (
                  <>
                    <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                      {xmlSearchResults.length > 0 ?
                        `${xmlResultIndex + 1}/${xmlSearchResults.length}` :
                        '0 results'}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => navigateXmlResults('prev')}
                      disabled={xmlSearchResults.length === 0}
                    >
                      <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => navigateXmlResults('next')}
                      disabled={xmlSearchResults.length === 0}
                    >
                      <KeyboardArrowDownIcon />
                    </IconButton>
                    <IconButton size="small" onClick={clearXmlSearch}>
                      <CloseIcon />
                    </IconButton>
                  </>
                )}
              </InputAdornment>
            )
          }}
        />
      );
    }
  };

  const handleValidateXml = () => {
    if (!xmlData || !rawXml) {
      swal("Error", "No XML data to validate", "error", {
        buttons: false,
        timer: 2000,
      });
      return;
    }

    const validation = validateMetadataStructure(xmlData, rawXml);
    const { message, icon } = showValidationResults(validation);

    swal("Validation Results", message, icon, {
      button: "OK",
    });
  };

  // Function to add new field
  const handleAddField = (newField) => {
    // Add to form structure
    setFormStructure(prev => [...prev, newField]);

    // Add to form data
    setFormData(prev => ({
      ...prev,
      [newField.path]: newField.value || ''
    }));

    // Create XML structure for the new field
    addFieldToXmlData(newField.path, newField.value || '');
  };

  // Function to add a field to XML data structure
  const addFieldToXmlData = (path, value) => {
    if (!xmlData) return;

    const pathParts = path.split('.');
    const updatedXmlData = structuredClone(xmlData);

    let current = updatedXmlData;
    let parent = null;
    let lastKey = null;

    // Navigate through the path and create objects/arrays if they don't exist
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];

      if (!isNaN(part)) {
        // Handle array indices
        const index = parseInt(part, 10);
        const arrayParent = pathParts[i - 1];

        // Ensure the parent is an array with enough elements
        if (!Array.isArray(current[arrayParent])) {
          current[arrayParent] = [];
        }

        // Ensure the array has enough elements
        while (current[arrayParent].length <= index) {
          current[arrayParent].push({});
        }

        parent = current;
        lastKey = arrayParent;
        current = current[arrayParent][index];
      } else {
        // Handle object properties
        if (!current[part]) {
          // Create the object property if it doesn't exist
          current[part] = {};
        }
        parent = current;
        lastKey = part;
        current = current[part];
      }
    }

    // Set the value at the final path
    const lastPart = pathParts[pathParts.length - 1];

    if (!isNaN(lastPart)) {
      // Handle array index
      const index = parseInt(lastPart, 10);
      const arrayParent = pathParts[pathParts.length - 2];

      if (!Array.isArray(current[arrayParent])) {
        current[arrayParent] = [];
      }

      while (current[arrayParent].length <= index) {
        current[arrayParent].push('');
      }

      current[arrayParent][index] = value;
    } else {
      // Handle object property
      current[lastPart] = value;
    }

    setXmlData(updatedXmlData);

    // Update raw XML after adding the field
    setTimeout(() => {
      updateRawXml();
    }, 100);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      aria-labelledby="metadata-editor-dialog-title"
      sx={{
        '& .MuiDialog-paper': {
          height: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <DialogTitle
            id="metadata-editor-dialog-title"
            sx={{ ml: 2, p: 0, flexGrow: 1 }}
          >
            CSW Metadata Editor
          </DialogTitle>
          <Box sx={{ ml: 'auto' }}>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{
        p: 2,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        position: 'sticky',
        top: 0,
        backgroundColor: 'background.paper',
        zIndex: 1
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              Upload New XML
              <Input
                type="file"
                sx={{ display: 'none' }}
                inputProps={{ accept: '.xml' }}
                onChange={handleFileUpload}
              />
            </Button>
            <Button
              variant="outlined"
              color="info"
              startIcon={<CheckCircleIcon />}
              onClick={handleValidateXml}
              disabled={loading || !xmlData}
            >
              Validate XML
            </Button>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<SaveAltIcon />}
              onClick={saveAsXml}
            >
              Save as XML
            </Button>
            {dataUuid && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PublishIcon />}
                onClick={() => validateMetadataWithUrlCheck(dataUuid)}
                disabled={loading || isPublishing}
              >
                Publish Metadata
              </Button>
            )}
          </Stack>
        </Box>

        <Box sx={{ mb: 1 }}>
          {renderSearchBar()}
        </Box>

        {uploadedFileName && (
          <Typography variant="subtitle2">
            Working with: {uploadedFileName}
          </Typography>
        )}
        {fileErrors.metadata && (
          <Typography color="error" variant="body2">
            {fileErrors.metadata}
          </Typography>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 1, display: 'flex', alignItems: 'center' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="metadata editor tabs"
            indicatorColor="primary"
            textColor="primary"
            sx={{ flexGrow: 1 }}
          >
            <Tab label="Form View" {...a11yProps(0)} />
            <Tab label="XML View" {...a11yProps(1)} />
          </Tabs>

          {xmlData && rawXml && (
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
              {(() => {
                const validation = validateMetadataStructure(xmlData, rawXml);
                if (validation.isValid) {
                  return (
                    <Tooltip title={`Validation successful${validation.warnings.length > 0 ? ` (${validation.warnings.length} warnings)` : ''}`}>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </Tooltip>
                  );
                } else {
                  return (
                    <Tooltip title={`${validation.errors.length} errors found`}>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                        <ErrorIcon fontSize="small" />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          {validation.errors.length}
                        </Typography>
                      </Box>
                    </Tooltip>
                  );
                }
              })()}
            </Box>
          )}
        </Box>
      </Box>

      <DialogContent
        dividers
        ref={dialogContentRef}
        sx={{
          p: 0,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <DialogContentText color="error" sx={{ p: 2 }}>
            {error}
          </DialogContentText>
        ) : (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
                <Box sx={{ flexShrink: 0, height: '100%' }}>
                  <CustomTreeView
                    treeData={buildTreeFromFormStructure(formStructure)}
                    onItemClick={(item) => {
                      setHighlightedFieldPath(item.path);
                      setFormSearchQuery('');
                    }}
                    width={treeWidth}
                    onDrag={handleMouseDown}
                    expandedKeys={expandedKeys}
                    setExpandedKeys={setExpandedKeys}
                  />

                </Box>

                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                  <Typography variant="h5" gutterBottom>Edit Metadata</Typography>
                  <Grid container spacing={3}>
                    {formStructure.map((field, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <FormField
                          field={field}
                          value={formData[field.path] || ''}
                          onChange={handleInputChange}
                          highlight={field.path === highlightedFieldPath}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </TabPanel>


            <TabPanel value={activeTab} index={1}>
              <Box sx={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" gutterBottom>
                  Edit Raw XML
                </Typography>

                <TextField
                  multiline
                  fullWidth
                  minRows={20}
                  maxRows={24}
                  value={rawXml}
                  onChange={handleRawXmlChange}
                  variant="outlined"
                  sx={{ flexGrow: 1 }}
                  InputProps={{
                    style: {
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      whiteSpace: 'pre',
                      height: '100%'
                    }
                  }}
                  ref={xmlEditorRef}
                />
              </Box>
            </TabPanel>
          </Box>
        )}
      </DialogContent>

      <AddFieldDialog
        open={addFieldDialogOpen}
        onClose={() => setAddFieldDialogOpen(false)}
        onAdd={handleAddField}
      />

      <MissingElementsDialog
        open={missingElementsDialogOpen}
        onClose={() => setMissingElementsDialogOpen(false)}
        missingElements={missingElements}
        onAddElements={handleAddMissingElementsWithStaticUrls}
      />

      <PublishDialog
        open={publishDialogOpen}
        onClose={() => setPublishDialogOpen(false)}
        onPublish={proceedWithPublish}
        uuid={dataUuid}
        isPublishing={isPublishing}
        xmlData={xmlData}
        rawXml={rawXml}
      />
    </Dialog>
  );
}

export default CSWMetadataEditorDialog;