import React, { useState, useEffect } from "react";
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
} from "@mui/material";

import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import RestartAltTwoToneIcon from "@mui/icons-material/RestartAltTwoTone";
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";

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

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
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
  useEffect(() => {
    dispatch(retrieveRole());
    dispatch(retrieveUserRole("0"));
  }, []);

  useEffect(() => {
    if (roles.length > 0) {
      //console.log(kategoriTematiks);
      //console.log(kategoriTematiks[0].name);
      //var a = kategoriTematiks.filter(function (el) {
      //  return el.name == kategoriTematiks[0].name;
      //});
      var list = [];
      list.push({ id: "0", name: "Pilih Role" });
      roles.map((data) => {
        list.push(data);
      });
      setListOption(list);
      //setSelectedProvinsi(provinsis[0].name);
      setRole(roles[0]);
      setConfig({ ...config, ["role"]: roles[0] });
      //dispatch(retrieveRegionProvinsi(provinsis[0].uuid));

      //dispatch(retrieveByKategori(kategoriTematiks[0].uuid));
    }
  }, [roles]);

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
      dispatch(retrieveUserRole(a[0].id));
    } else {
      setSelectedOption(value);
      setConfig({ ...config, ["role"]: null });
      setRole(null);
      dispatch(retrieveUserRole("0"));
    }
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
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
                  listOption.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))
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
            <Grid
              container
              justifyContent="end"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              {currentUser.roles.includes("ROLE_ADMIN") &&
              selectedOption != "Pilih Role" &&
              selectedOption != "admin" ? (
                <Grid item>
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
                </Grid>
              ) : (
                ""
              )}
            </Grid>

            <Divider />
            <TableContainer>
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
                  {datas.length == 0 ? (
                    <TableRow key={0}>
                      <TableCell colSpan={9}>
                        {selectedOption == "Pilih Role"
                          ? "Filter belum dipilih"
                          : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {datas &&
                    datas.map((user) => {
                      return (
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
                            {user.roles.map((role) => role.name)}
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
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            {/*
            <Box p={2}>
              <TablePagination
                component="div"
                count={100}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
            */}
          </CardContent>

          <UserDialog open={open} onClose={handleClose} config={config} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default UserTab;
