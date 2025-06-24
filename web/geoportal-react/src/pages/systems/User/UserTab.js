import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItem,
  List,
  ListItemText,
  Divider,
  Button,
  ListItemAvatar,
  Avatar,
  Switch,
  CardHeader,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  useTheme,
  styled,
  CardContent,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import RestartAltTwoToneIcon from "@mui/icons-material/RestartAltTwoTone";
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from '@mui/icons-material/Search';

import { retrieveUserRole } from "src/redux/actions/user";
import { retrieveRole } from "src/redux/actions/role";
import UserDialog from "./UserDialog";

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

function UserTab() {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  
  const initialConfig = {
    user: null,
    role: null,
    title: "Tambah User Baru",
    mode: "add",
    action: "Submit",
    description: "Silahkan isi form berikut untuk menambahkan User baru.",
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.user);
  const roles = useSelector((state) => state.role);

  const { user: currentUser } = useSelector((state) => state.auth);
  const [listOption, setListOption] = useState([]);
  const [role, setRole] = useState();
  const [selectedOption, setSelectedOption] = useState("Pilih Role");

  const dispatch = useDispatch();
  
  // Memoized function to perform client-side filtering and pagination
  const filterData = useCallback(() => {
    setLoading(true);
    
    // Filter the data based on the search keyword
    let result = [...datas];
    
    if (keyword) {
      // Case-insensitive search on multiple fields
      result = result.filter(item => 
        item.username?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.email?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.uuid?.toLowerCase().includes(keyword.toLowerCase()) ||
        (item.roles && item.roles.some(role => 
          role.name?.toLowerCase().includes(keyword.toLowerCase())
        ))
      );
    }
    
    // Store the filtered results
    setFilteredData(result);
    setLoading(false);
  }, [datas, keyword]);

  // Effect to trigger filtering when data or search term changes
  useEffect(() => {
    filterData();
  }, [filterData]);

  useEffect(() => {
    setLoading(true);
    dispatch(retrieveRole()).finally(() => {
      setLoading(false);
    });
    dispatch(retrieveUserRole("0")).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (roles.length > 0) {
      var list = [];
      list.push({ id: "0", name: "Pilih Role" });
      roles.map((data) => {
        list.push(data);
      });
      setListOption(list);
      setRole(roles[0]);
      setConfig({ ...config, ["role"]: roles[0] });
    }
  }, [roles]);

  // Get paginated data
  const getPaginatedData = () => {
    // If no data or not array, return empty array
    if (!filteredData || !Array.isArray(filteredData)) {
      return [];
    }
    
    // Calculate the start and end index for the current page
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    // Return the sliced data for the current page
    return filteredData.slice(startIndex, endIndex);
  };

  const handleOptionChange = (e) => {
    let value = null;
    value = e.target.value;

    if (value !== "Pilih Role") {
      setSelectedOption(value);
      var a = roles.filter(function (el) {
        return el.name == value;
      });

      setConfig({ ...config, ["role"]: a[0] });
      setRole(a[0]);
      setLoading(true);
      dispatch(retrieveUserRole(a[0].id)).finally(() => {
        setLoading(false);
      });
      
      // Reset search and pagination when changing role
      setKeyword("");
      setPage(0);
    } else {
      setSelectedOption(value);
      setConfig({ ...config, ["role"]: null });
      setRole(null);
      setLoading(true);
      dispatch(retrieveUserRole("0")).finally(() => {
        setLoading(false);
      });
      
      // Reset search and pagination when clearing role
      setKeyword("");
      setPage(0);
    }
  };

  // Debounced search handler
  const handleSearchChange = (event) => {
    const value = event.target.value;
    
    // Update the search keyword state
    setKeyword(value);
    
    // Reset to first page when searching
    setPage(0);
    
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout to trigger the search
    const timeoutId = setTimeout(() => {
      // This will trigger the useEffect via filterData dependency
      filterData();
    }, 300);
    
    setSearchTimeout(timeoutId);
  };

  const handleClickAdd = () => {
    setConfig({
      user: null,
      role: role,
      title: "Tambah User Baru",
      mode: "add",
      action: "Submit",
      description: "Silahkan isi form berikut untuk menambahkan User baru.",
    });
    setOpen(true);
  };

  const handleClickEdit = (data) => {
    setConfig({
      user: data,
      title: "Edit User",
      mode: "edit",
      action: "Save",
      description: "Silahkan edit form berikut untuk mengupdate User.",
    });
    setOpen(true);
  };

  const handleClickReset = (data) => {
    setConfig({
      user: data,
      title: "Reset Password User",
      mode: "reset",
      action: "Reset",
      description: "Anda yakin akan mereset password User?",
    });
    setOpen(true);
  };

  const handleClickDelete = (data) => {
    setConfig({
      user: data,
      title: "Delete User",
      mode: "delete",
      action: "Delete",
      description: "Anda yakin akan menghapus User?",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Refresh data after dialog closes
    if (role) {
      setLoading(true);
      dispatch(retrieveUserRole(role.id)).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(true);
      dispatch(retrieveUserRole("0")).finally(() => {
        setLoading(false);
      });
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when changing rows per page
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setLoading(true);
    if (role) {
      dispatch(retrieveUserRole(role.id)).finally(() => {
        setLoading(false);
      });
    } else {
      dispatch(retrieveUserRole("0")).finally(() => {
        setLoading(false);
      });
    }
  };

  // Get the current page data
  const currentPageData = getPaginatedData();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Filter Role
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={selectedOption}
                onChange={handleOptionChange}
                label="Role"
                autoWidth
              >
                {listOption.length > 0 ? (
                  listOption.map((option) =>
                    option.name == "eksternal" ||
                    option.name == "walidata_pendukung" ? null : (
                      <MenuItem key={option.id} value={option.name}>
                        {option.name}
                      </MenuItem>
                    )
                  )
                ) : (
                  <MenuItem key={0} value={"Pilih Role"}>
                    {"Pilih Role"}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {/* Search and Action Controls */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <TextField
                placeholder="Cari user berdasarkan username, email, atau role..."
                variant="outlined"
                size="small"
                value={keyword}
                onChange={handleSearchChange}
                sx={{ minWidth: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: keyword && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={() => {
                          // Clear the search field
                          setKeyword("");
                          setPage(0);
                          // The filterData will be triggered via useEffect
                        }}
                        edge="end"
                        size="small"
                      >
                        <Typography variant="caption">×</Typography>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box>
                {currentUser.roles.includes("ROLE_ADMIN") &&
                  selectedOption != "Pilih Role" &&
                  selectedOption != "admin" && (
                  <Tooltip placement="top" title="Create User" arrow>
                    <Button
                      sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                      variant="outlined"
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                      onClick={handleClickAdd}
                    >
                      Create User
                    </Button>
                  </Tooltip>
                )}
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                >
                  Refresh
                </Button>
              </Box>
            </Box>

            <Divider />
            
            {/* Table Container with Loading */}
            <TableContainer sx={{ position: 'relative', minHeight: 200 }}>
              {loading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    zIndex: 1,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>UUID</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Roles</TableCell>
                    {currentUser.roles.includes("ROLE_ADMIN") ? (
                      <TableCell align="right">Actions</TableCell>
                    ) : (
                      ""
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading && currentPageData.length === 0 ? (
                    <TableRow key={0}>
                      <TableCell colSpan={currentUser.roles.includes("ROLE_ADMIN") ? 6 : 5} align="center">
                        {selectedOption === "Pilih Role"
                          ? "Filter belum dipilih"
                          : keyword 
                            ? `Tidak ada data yang cocok dengan pencarian "${keyword}"`
                            : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPageData.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>{user.uuid}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {format(
                            parseISO(user.createdAt),
                            "dd MMMM, yyyy - h:mm:ss a"
                          )}
                        </TableCell>
                        <TableCell>
                          {user.roles.map((role) => role.name).join(", ")}
                        </TableCell>
                        {currentUser.roles.includes("ROLE_ADMIN") ? (
                          <TableCell align="right">
                            <Tooltip title="Edit User" arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.primary.lighter,
                                  },
                                  color: theme.palette.primary.main,
                                }}
                                color="inherit"
                                size="small"
                                onClick={() => handleClickEdit(user)}
                              >
                                <EditTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {!user.roles.some(
                              (el) => el.name === "admin"
                            ) && (
                              <Tooltip
                                placement="top"
                                title="Reset Password User"
                                arrow
                              >
                                <IconButton
                                  sx={{
                                    "&:hover": {
                                      background: theme.colors.error.lighter,
                                    },
                                    color: theme.palette.error.main,
                                  }}
                                  color="inherit"
                                  size="small"
                                  onClick={() => handleClickReset(user)}
                                >
                                  <RestartAltTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {!user.roles.some(
                              (el) => el.name === "admin"
                            ) && (
                              <Tooltip
                                placement="top"
                                title="Delete User"
                                arrow
                              >
                                <IconButton
                                  sx={{
                                    "&:hover": {
                                      background: theme.colors.error.lighter,
                                    },
                                    color: theme.palette.error.main,
                                  }}
                                  color="inherit"
                                  size="small"
                                  onClick={() => handleClickDelete(user)}
                                >
                                  <DeleteTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        ) : (
                          ""
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50, 100]}
              labelRowsPerPage="Baris per halaman:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`
              }
            />
          </CardContent>

          <UserDialog open={open} onClose={handleClose} config={config} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default UserTab;