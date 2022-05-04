import React, { useEffect, useRef, useState } from "react";

//import KeyboardArrowDown from "@material-ui/icons/keyboardArrowDown";
//import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";

import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";

import { useForm } from "react-hook-form";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles, styled } from "@material-ui/core/styles";
import {
  url_actualizarEstado,
  url_aumentarCorrelativo,
  url_buscarCliente,
  url_envio_sunat,
  url_listarClientes,
  url_listarDetalle,
  url_listarOrdenes,
  url_listarSeries,
  url_obtenerCorrelativo,
  url_obtenerDatosEnvio,
  url_registrarCliente,
} from "../../services/api_url";
import {
  TextField,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
  Dialog,
  Slide,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  InputAdornment,
} from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import { arrTipoComprobante, arrTipoDocumento } from "../../utils/data";
import { BiCommentDetail } from "react-icons/bi";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { parseCurrency } from "../../utils/currency";
import Ticket from "../../components/ticket/Ticket";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import SaveIcon from "@material-ui/icons/Save";
import MuiAlert from "@material-ui/lab/Alert";
import { useReactToPrint } from "react-to-print";

import QRCode from "qrcode";
import moment from "moment";
import { Search } from "@material-ui/icons";
import {
  BuscarClienteDocumento,
  FindByDocumentoApi,
} from "../../services/sclientes";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  container: {
    height: "100%", // So that grids 1 & 4 go all the way down
    //minHeight: 70, // Give minimum height to a div
    fontSize: 15,
    textAlign: "center",
  },
}));

export default function Listado() {
  const classes = useStyles();
  const { register } = useForm();
  const [openDialog, setOpenDialog] = useState(false);
  const [textValue, setTextValue] = useState("");
  const onTextChange = (e) => setTextValue(e.target.value);
  const [ordenes, setOrdenes] = useState([]);
  const [ordenesEnviadas, setOrdenesEnviadas] = useState([]);
  const [arrDetalle, setArrDetalle] = useState([]);
  const [right, setRight] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qr, setQr] = useState("");
  const [valorResumen, setValorResumen] = useState("");
  const [cliente, setCliente] = useState(null);
  const [clienteBuscar, setClienteBuscar] = useState(null);
  const [arrClientes, setArrClientes] = useState([]);
  const [tipoComprobante, setTipoComprobante] = useState("00");
  const [serie, setSerie] = useState("0000");
  const [arrSerie, setArrSerie] = useState([]);
  const [correlativo, setCorrelativo] = useState(0);
  const [idOrden, setIdOrden] = useState(0);
  const [estadoSunat, setEstadoSunat] = useState(false);
  const [datosEnvio, setDatosEnvio] = useState(null);
  const [datosClienteEnvio, setDatosClienteEnvio] = useState(null);
  const [dialogNuevoCliente, setDialogNuevoCliente] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);

  const [nuevoCliente, setNuevoCliente] = useState({
    id: 0,
    tipoDocumento: "",
    numDocumento: "",
    nombres: "",
    apePaterno: "",
    apeMaterno: "",
    direccion: "",
    correo: "",
    telCelular: "",
    ubigeo: "150141",
    departamento: "LIMA",
    provincia: "LIMA",
    distrito: "LA VICTORIA",
    usuarioRegistro: "mvillasono@gmail.com",
    fechaRegistro: "2022-05-04",
  });

  const handleChangeCliente = (e) => {
    setNuevoCliente({
      ...nuevoCliente,
      [e.target.name]: e.target.value,
    });
  };

  const {
    id,
    tipoDocumento,
    numDocumento,
    nombres,
    apePaterno,
    apeMaterno,
    direccion,
    correo,
    telCelular,
  } = nuevoCliente;

  const handleOpenDialogCliente = () => {
    setDialogNuevoCliente(true);
  };

  const handleCloseDialogCliente = () => {
    setNuevoCliente({
      id: 0,
      tipoDocumento: "",
      numDocumento: "",
      nombres: "",
      apePaterno: "",
      apeMaterno: "",
      direccion: "",
      correo: "",
      telCelular: "",
      ubigeo: "150141",
      departamento: "LIMA",
      provincia: "LIMA",
      distrito: "LA VICTORIA",
      usuarioRegistro: "mvillasono@gmail.com",
      fechaRegistro: "2022-05-04",
    });
    setDialogNuevoCliente(false);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    removeAfterPrint: true,
  });

  const [totales, setTotales] = useState({
    precioVenta: 0,
    valorVenta: 0,
    igv: 0,
  });

  useEffect(() => {
    listaOrdenes();
    listaOrdenesEnviadas();
  }, []);

  const listaOrdenes = async () => {
    try {
      const res = await fetch(`${url_listarOrdenes}?estado=${false}`);
      const data = await res.json();
      //console.log(data);
      setOrdenes(data.ordenes);
    } catch (error) {
      console.error(error);
    }
  };

  const listaOrdenesEnviadas = async () => {
    try {
      const res = await fetch(`${url_listarOrdenes}?estado=${true}`);
      const data = await res.json();
      //console.log(data);
      setOrdenesEnviadas(data.ordenes);
    } catch (error) {
      console.error(error);
    }
  };

  const rows = ordenes;
  const rows2 = ordenesEnviadas;

  const verDetalle = async (id, precioVenta, valorVenta, igv, estado) => {
    //console.log("VER DETALLE", id);

    setIdOrden(id);
    setEstadoSunat(estado);
    setIsLoading(true);

    if (estado) {
      getDatosEnvio(id);
    }

    setTotales({
      precioVenta: precioVenta,
      valorVenta: valorVenta,
      igv: igv,
    });

    getDetalle(id)
      .then(() => {
        getClientes();
      })
      .finally(() => {
        setOpen(true);
        setIsLoading(false);
      });
  };

  const getDetalle = async (id) => {
    try {
      const res = await fetch(`${url_listarDetalle}?id=${id}`);
      const data = await res.json();
      //console.log(data.detalle);
      setArrDetalle(data.detalle);
    } catch (error) {
      console.error(error);
    }
  };

  const getSeries = async (tipo) => {
    try {
      const res = await fetch(`${url_listarSeries}?tipo=${tipo}`);
      const data = await res.json();
      setArrSerie(data.series);
      setSerie("0000");
    } catch (error) {
      console.error(error);
    }
  };

  const getCorrelativo = async (tipo, serie) => {
    try {
      const res = await fetch(
        `${url_obtenerCorrelativo}?tipo=${tipo}&serie=${serie}`
      );
      const data = await res.json();
      setCorrelativo(data.correlativo.correlativo);
    } catch (error) {
      console.error(error);
    }
  };

  const getClientes = async () => {
    try {
      const res = await fetch(`${url_listarClientes}`);
      const data = await res.json();
      setArrClientes(data.clientes);
    } catch (error) {
      console.error(error);
    }
  };

  const getDatosEnvio = async (idOrden) => {
    try {
      const res = await fetch(`${url_obtenerDatosEnvio}?idOrden=${idOrden}`);
      const data = await res.json();
      //console.log(data);
      setDatosEnvio(data.envio);
      if (data.envio != null) {
        getDatosClienteEnvio(data.envio.idCliente);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDatosClienteEnvio = async (id) => {
    try {
      const res = await fetch(`${url_buscarCliente}?id=${id}`);
      const data = await res.json();
      //console.log(data);
      setDatosClienteEnvio(data.cliente);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTipoComprobante = (e) => {
    setTipoComprobante(e.target.value);
    getSeries(e.target.value);
  };

  const handleCorrelativo = (e) => {
    setSerie(e.target.value);
    getCorrelativo(tipoComprobante, e.target.value);
  };

  const enviarSunat = async () => {
    try {
      //console.log("cliente ", cliente);

      let cabecera = {
        tipoOperacion: "0101",
        tipoComprobante: tipoComprobante,
        moneda: "PEN",
        serie: serie,
        correlativo: correlativo,
        totalOpGravadas: Number(totales.precioVenta).toFixed(2),
        igv: Number(totales.igv).toFixed(2),
        icbper: 0,
        totalOpExoneradas: 0,
        totalOpInafectas: 0,
        totalAntesImpuestos: Number(totales.precioVenta).toFixed(2),
        totalImpuestos: Number(totales.igv).toFixed(2),
        totalDespuesImpuestos: Number(totales.valorVenta).toFixed(2),
        totalAPagar: Number(totales.valorVenta).toFixed(2),
        fechaEmision: moment().format("YYYY-MM-DD"),
        horaEmision: "19:43:00",
        fechaVencimiento: moment().format("YYYY-MM-DD"),
        formaPago: "Contado",
        montoCredito: 0,
        anexoSucursal: "0000",
      };

      let detalle = [];

      arrDetalle.map((d, index) => {
        detalle = [
          ...detalle,
          {
            item: index + 1,
            cantidad: d.cantidad,
            unidad: "NIU",
            nombre: d.descripcion,
            valorUnitario: Number(d.precioVenta).toFixed(2),
            precioLista: Number(d.valorVenta).toFixed(2),
            valorTotal: Number(d.precioVenta).toFixed(2),
            igv: Number(d.igv).toFixed(2),
            icbper: 0,
            factorIcbper: 0,
            totalAntesImpuestos: Number(d.precioVenta).toFixed(2),
            totalImpuestos: Number(d.igv).toFixed(2),
            codigo0: "S",
            codigo1: "10",
            codigo2: "1000",
            codigo3: "IGV",
            codigo4: "VAT",
          },
        ];
      });

      //console.log("cabecera ", cabecera);
      //console.log("detalle ", detalle);

      let envio = {
        idOrden: idOrden,
        idCliente: cliente.id,
        fechaEmision: moment().format("YYYY-MM-DD"),
        respuestaSunat: "",
        cabecera: cabecera,
        detalle: detalle,
        cliente: cliente,
      };

      const res = await fetch(`${url_envio_sunat}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(envio),
      });

      const data = await res.json();
      //console.log(data);
      const { respuesta } = data;
      if (respuesta.mensaje.includes("aceptada")) {
        //console.log("abrir modal");

        actualizarEstadoSunat();
        aumentarCorrelativoFacturacion();

        setValorResumen(respuesta.hash_cpe);

        QRCode.toDataURL(
          `20607599727|${tipoComprobante}|${serie}|${correlativo}|${totales.igv.toFixed(
            2
          )}|${totales.valorVenta.toFixed(2)}|${moment().format(
            "DD/MM/YYYY"
          )}|1|${respuesta.hash_cpe}`
        ).then(setQr);

        handleOpenDialog();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setTipoComprobante("00");
    setSerie("0000");
    setCorrelativo(0);
    setCliente(null);
    setOpen(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    handleClose();
    setOpenDialog(false);
  };

  const actualizarEstadoSunat = async () => {
    try {
      const res = await fetch(`${url_actualizarEstado}?id=${idOrden}`);
      const data = await res.json();

      if (data !== null) {
        listaOrdenes();
        listaOrdenesEnviadas();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const aumentarCorrelativoFacturacion = async () => {
    try {
      const res = await fetch(
        `${url_aumentarCorrelativo}?tipo=${tipoComprobante}&serie=${serie}`
      );
      const data = await res.json();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGuardarCliente = async () => {
    console.log(nuevoCliente);
    const res = await fetch(`${url_registrarCliente}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoCliente),
    });

    const data = await res.json();
    if (data !== null) {
      setOpenSnack(true);
      setNuevoCliente({
        id: 0,
        tipoDocumento: "",
        numDocumento: "",
        nombres: "",
        apePaterno: "",
        apeMaterno: "",
        direccion: "",
        correo: "",
        telCelular: "",
        ubigeo: "150141",
        departamento: "LIMA",
        provincia: "LIMA",
        distrito: "LA VICTORIA",
        usuarioRegistro: "mvillasono@gmail.com",
        fechaRegistro: "2022-05-04",
      });
      getClientes();
      handleCloseDialogCliente();
    }
  };

  const handleBuscar = async (tipo, ndocumento) => {
    try {
      //console.log("documento ", documento);
      const { documento } = await FindByDocumentoApi(
        tipo,
        ndocumento,
        setClienteBuscar,
        setNuevoCliente
      );

      let nombres = "";
      let apePaterno = "";
      let apeMaterno = "";

      if (tipo === "6") {
        nombres = documento.nombre;
      } else {
        apePaterno = documento.apellidoPaterno;
        apeMaterno = documento.apellidoMaterno;
        nombres = documento.nombres;
      }

      let obj = {
        tipoDocumento: tipo,
        numDocumento: ndocumento,
        direccion: documento.direccion,
        nombres: nombres,
        apePaterno: apePaterno,
        apeMaterno: apeMaterno,
        ubigeo: "150141",
        departamento: "LIMA",
        provincia: "LIMA",
        distrito: "LA VICTORIA",
        usuarioRegistro: "mvillasono@gmail.com",
        fechaRegistro: "2022-05-04",
      };

      setNuevoCliente(obj);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseSnack = () => {
    setOpenSnack(false);
  };

  return (
    <React.Fragment>
      <Typography variant="button">COMPROBANTES SIN ENVIAR A SUNAT</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#1a2033" }}>
              <TableCell
                align="center"
                width="10%"
                style={{ color: "#ffffff" }}
              >
                # Orden
              </TableCell>
              <TableCell
                align="center"
                width="20%"
                style={{ color: "#ffffff" }}
              >
                Precio Venta
              </TableCell>
              <TableCell
                align="center"
                width="20%"
                style={{ color: "#ffffff" }}
              >
                IGV(18%)
              </TableCell>
              <TableCell
                align="center"
                width="20%"
                style={{ color: "#ffffff" }}
              >
                Valor Venta
              </TableCell>
              <TableCell
                align="center"
                width="10%"
                style={{ color: "#ffffff" }}
              >
                Fecha Registro
              </TableCell>
              <TableCell
                align="center"
                width="20%"
                style={{ color: "#ffffff" }}
              >
                Estado
                <br />
                Sunat
              </TableCell>
              <TableCell align="center" style={{ color: "#ffffff" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">
                  {parseCurrency(row.precioVenta)}
                </TableCell>
                <TableCell align="center">{parseCurrency(row.igv)}</TableCell>
                <TableCell align="center">
                  {parseCurrency(row.valorVenta)}
                </TableCell>
                <TableCell align="center">{row.fechaRegistro}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color={row.estadoSunat ? "primary" : "secondary"}
                  >
                    {row.estadoSunat ? "ENVIADO" : "SIN ENVIAR"}
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() =>
                      verDetalle(
                        row.id,
                        row.precioVenta,
                        row.valorVenta,
                        row.igv,
                        row.estadoSunat
                      )
                    }
                  >
                    <BiCommentDetail />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <br />
      <Typography variant="button">COMPROBANTES ENVIADOS A SUNAT</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#1a2033" }}>
              <TableCell
                align="center"
                width="10%"
                style={{ color: "#ffffff" }}
              >
                # Orden
              </TableCell>
              <TableCell
                align="center"
                width="20%"
                style={{ color: "#ffffff" }}
              >
                Precio Venta
              </TableCell>
              <TableCell
                align="center"
                width="20%"
                style={{ color: "#ffffff" }}
              >
                IGV(18%)
              </TableCell>
              <TableCell
                align="center"
                width="20%"
                style={{ color: "#ffffff" }}
              >
                Valor Venta
              </TableCell>
              <TableCell
                align="center"
                width="10%"
                style={{ color: "#ffffff" }}
              >
                Fecha Registro
              </TableCell>
              <TableCell
                align="center"
                width="20%"
                style={{ color: "#ffffff" }}
              >
                Estado
                <br />
                Sunat
              </TableCell>
              <TableCell align="center" style={{ color: "#ffffff" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows2.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">
                  {parseCurrency(row.precioVenta)}
                </TableCell>
                <TableCell align="center">{parseCurrency(row.igv)}</TableCell>
                <TableCell align="center">
                  {parseCurrency(row.valorVenta)}
                </TableCell>
                <TableCell align="center">{row.fechaRegistro}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color={row.estadoSunat ? "primary" : "secondary"}
                  >
                    {row.estadoSunat ? "ENVIADO" : "SIN ENVIAR"}
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() =>
                      verDetalle(
                        row.id,
                        row.precioVenta,
                        row.valorVenta,
                        row.igv,
                        row.estadoSunat
                      )
                    }
                  >
                    <BiCommentDetail />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      verDetalle(
                        row.id,
                        row.precioVenta,
                        row.valorVenta,
                        row.igv,
                        row.estadoSunat
                      )
                    }
                  >
                    <HiOutlineDocumentDownload />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Drawer anchor="right" open={open} onClose={() => handleClose()}>
        <Box
          role="presentation"
          //onClick={toggleDrawer("right", false)}
          //onKeyDown={toggleDrawer("right", false)}
          sx={{ width: 400, margin: 30 }}
        >
          <Typography variant="button" style={{ fontWeight: "bold" }}>
            Detalle Comprobante
          </Typography>

          <Grid
            container
            spacing={2}
            style={{ display: estadoSunat ? "" : "none", marginTop: "20px" }}
          >
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <TextField
                  id="standard-read-only-input"
                  label="Mensaje Sunat"
                  defaultValue="Hello World"
                  value={datosEnvio === null ? "" : datosEnvio.respuestaSunat}
                  disabled
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <TextField
                  id="standard-read-only-input"
                  label="Cliente"
                  defaultValue="Hello World"
                  value={
                    datosClienteEnvio === null ? "" : datosClienteEnvio.nombres
                  }
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  id="standard-read-only-input"
                  label="# Documento"
                  defaultValue="Hello World"
                  value={
                    datosClienteEnvio === null
                      ? ""
                      : datosClienteEnvio.numDocumento
                  }
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  id="standard-read-only-input"
                  label="Fecha Emision"
                  defaultValue="Hello World"
                  value={datosEnvio === null ? "" : datosEnvio.fechaEmision}
                  disabled
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            style={{ display: estadoSunat ? "none" : "", marginTop: "20px" }}
          >
            <Grid item xs={12} md={4}>
              <FormControl sx={{ m: 1, minWidth: 120 }} variant="outlined">
                <InputLabel>Tipo</InputLabel>
                <Select
                  id="tipoComprobante"
                  value={tipoComprobante}
                  onChange={(e) => handleTipoComprobante(e)}
                >
                  <MenuItem value="00">
                    <em>Seleccione</em>
                  </MenuItem>
                  {arrTipoComprobante.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl
                sx={{ m: 1, minWidth: 120 }}
                variant="outlined"
                style={{ width: 120 }}
              >
                <InputLabel>Serie</InputLabel>
                <Select
                  id="serie"
                  value={serie}
                  onChange={(e) => handleCorrelativo(e)}
                >
                  <MenuItem value="0000">
                    <em>Seleccione</em>
                  </MenuItem>
                  {arrSerie.map((s) => (
                    <MenuItem key={s.serie} value={s.serie}>
                      {s.serie}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl
                sx={{ m: 1, minWidth: 120 }}
                variant="outlined"
                disabled
              >
                <InputLabel>Correlativo</InputLabel>
                <OutlinedInput
                  value={correlativo}
                  name="correlativo"
                  id="correlativo"
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            style={{ display: estadoSunat ? "none" : "", marginTop: "20px" }}
          >
            <Typography variant="button" style={{ fontWeight: "bold" }}>
              Datos cliente
            </Typography>
            <Grid item xs={12} md={12}>
              <Autocomplete
                id="cliente"
                options={arrClientes}
                value={cliente}
                getOptionLabel={(option) =>
                  option.numDocumento + " - " + option.nombres
                }
                style={{ width: 400 }}
                onChange={(e, newValue) => setCliente(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cliente"
                    variant="outlined"
                    value={cliente}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: "20px" }}>
            <Typography variant="button" style={{ fontWeight: "bold" }}>
              Detalle Orden
            </Typography>
          </Grid>

          <TableContainer>
            <TableBody>
              {arrDetalle.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <Avatar
                      sx={{ width: 40, height: 40 }}
                      alt={d.descripcion}
                      src={d.imagen}
                    />
                  </TableCell>
                  <TableCell>
                    {d.descripcion}
                    <br />
                    <label style={{ fontSize: "12px" }}>Cantidad :</label>
                    {d.cantidad}
                  </TableCell>
                  <TableCell>{parseCurrency(d.valorVenta)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell rowSpan={1} />
                <TableCell colSpan={1}>
                  <Typography variant="button" style={{ fontSize: "13px" }}>
                    SUBTOTAL
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  style={{ fontSize: "15px", fontWeight: "500" }}
                >
                  {parseCurrency(totales.precioVenta)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell rowSpan={1} />
                <TableCell colSpan={1}>
                  <Typography variant="button" style={{ fontSize: "13px" }}>
                    IGV(18%)
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  style={{ fontSize: "15px", fontWeight: "500" }}
                >
                  {parseCurrency(totales.igv)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell rowSpan={1} />
                <TableCell colSpan={1}>
                  <Typography variant="button" style={{ fontSize: "13px" }}>
                    TOTAL
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  style={{ fontSize: "16px", fontWeight: "500" }}
                >
                  {parseCurrency(totales.valorVenta)}
                </TableCell>
              </TableRow>
            </TableBody>
          </TableContainer>
        </Box>
        <Box position="relative" style={{ display: estadoSunat ? "none" : "" }}>
          <Grid container spacing={2}>
            <Grid
              xs
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <div>
                <Button
                  size="large"
                  color="primary"
                  style={{
                    fontSize: "15px",
                    //color: "#2d3347",
                    //background: "#ff4f6d",
                    fontWeight: "bold",
                  }}
                  variant="outlined"
                  startIcon={<AccessibilityNewIcon />}
                  onClick={() => handleOpenDialogCliente()}
                >
                  NUEVO CLIENTE
                </Button>
              </div>
            </Grid>
            <Grid
              xs
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <div>
                <Button
                  size="large"
                  variant="contained"
                  style={{
                    fontSize: "15px",
                    color: "#ff4f6d",
                    background: "#2d3347",
                    fontWeight: "bold",
                    opacity:
                      (tipoComprobante !== "00") &
                      (serie !== "0000") &
                      (correlativo !== 0) &
                      (cliente !== null) &
                      (arrDetalle.length > 0)
                        ? 1
                        : 0.5,
                  }}
                  disabled={
                    (tipoComprobante !== "00") &
                    (serie !== "0000") &
                    (correlativo !== 0) &
                    (cliente !== null) &
                    (arrDetalle.length > 0)
                      ? false
                      : true
                  }
                  onClick={() => enviarSunat()}
                >
                  ENVIAR SUNAT
                </Button>
              </div>
            </Grid>
          </Grid>
        </Box>

        <Dialog
          open={openDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogActions>
            {/* <Button onClick={handlePrint}>Print this out!</Button> */}
            <Button
              aria-label="delete"
              style={{
                color: "#000000",
                border: "1px solid #fff",
                opacity:
                  (tipoComprobante !== "00") &
                  (serie !== "0000") &
                  (correlativo !== 0) &
                  (cliente !== null) &
                  (arrDetalle.length > 0)
                    ? 1
                    : 0.5,
              }}
              size="large"
              onClick={handlePrint}
              startIcon={<PrintIcon />}
              disabled={
                (tipoComprobante !== "00") &
                (serie !== "0000") &
                (correlativo !== 0) &
                (cliente !== null) &
                (arrDetalle.length > 0)
                  ? false
                  : true
              }
            ></Button>
          </DialogActions>
          <DialogContent>
            <Ticket
              ref={componentRef}
              arrDetalle={arrDetalle}
              totales={totales}
              tipoComprobante={tipoComprobante}
              serie={serie}
              correlativo={correlativo}
              cliente={cliente}
              fecha={moment().format("DD/MM/YYYY")}
              hora={moment().format("HH:mm:ss")}
              qr={qr}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={dialogNuevoCliente}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialogCliente}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={handleCloseDialogCliente}
            style={{ backgroundColor: "#3f51b5", color: "#fff" }}
          >
            Crear Cliente
          </DialogTitle>

          <DialogContent style={{ width: "500px" }} dividers>
            <Grid container spacing={2}>
              <Grid container item xs={6} direction="column">
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-filled-label">
                    Tipo Documento
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    name="tipoDocumento"
                    value={tipoDocumento}
                    onChange={handleChangeCliente}
                    //error={tipoDocumentoError}
                  >
                    <MenuItem value="">
                      <em>--Seleccione--</em>
                    </MenuItem>
                    {arrTipoDocumento.map((dato) => (
                      <MenuItem key={dato.value} value={dato.value}>
                        {dato.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid container item xs={6} direction="column">
                <FormControl variant="filled" className={classes.formControl}>
                  <TextField
                    id="filled-required"
                    label="Número Documento"
                    name="numDocumento"
                    onChange={handleChangeCliente}
                    value={numDocumento}
                    //error={nroDocumentoError}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() =>
                              handleBuscar(tipoDocumento, numDocumento)
                            }
                          >
                            <Search />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid container item xs={12} direction="column">
                <FormControl variant="filled" className={classes.formControl}>
                  <TextField
                    id="filled-required"
                    label={tipoDocumento === "6" ? "Razón Social" : "Nombres"}
                    name="nombres"
                    onChange={handleChangeCliente}
                    value={nombres}
                    //error={nombres}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                  />
                </FormControl>
              </Grid>
              <Grid
                container
                item
                xs={6}
                direction="column"
                style={{ display: tipoDocumento === "6" ? "none" : "flex" }}
              >
                <FormControl variant="filled" className={classes.formControl}>
                  <TextField
                    id="filled-required"
                    label="Apellido Paterno"
                    name="apePaterno"
                    onChange={handleChangeCliente}
                    value={apePaterno}
                    //error={apePaternoError}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                  />
                </FormControl>
              </Grid>
              <Grid
                container
                item
                xs={6}
                direction="column"
                style={{ display: tipoDocumento === "6" ? "none" : "flex" }}
              >
                <FormControl variant="filled" className={classes.formControl}>
                  <TextField
                    id="filled-required"
                    label="Apellido Materno"
                    name="apeMaterno"
                    onChange={handleChangeCliente}
                    value={apeMaterno}
                    //error={apeMaternoError}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                  />
                </FormControl>
              </Grid>
              <Grid container item xs={12} direction="column">
                <FormControl variant="filled" className={classes.formControl}>
                  <TextField
                    id="filled-required"
                    label="Dirección"
                    name="direccion"
                    onChange={handleChangeCliente}
                    value={direccion}
                    //error={direccionError}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                  />
                </FormControl>
              </Grid>

              <Grid container item xs={6} direction="column">
                <FormControl variant="filled" className={classes.formControl}>
                  <TextField
                    id="filled-required"
                    label="Telefono"
                    name="telCelular"
                    onChange={handleChangeCliente}
                    value={telCelular}
                    //error={telefonoError}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                  />
                </FormControl>
              </Grid>
              <Grid container item xs={6} direction="column">
                <FormControl variant="filled" className={classes.formControl}>
                  <TextField
                    id="filled-required"
                    label="Correo"
                    name="correo"
                    onChange={handleChangeCliente}
                    value={correo}
                    //error={correoError}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                  />
                </FormControl>
              </Grid>
              <Grid container item xs={12} direction="column">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                  onClick={(e) => handleGuardarCliente(e)}
                >
                  GUARDAR CLIENTE
                </Button>
              </Grid>
            </Grid>

            <Snackbar
              open={openSnack}
              autoHideDuration={6000}
              onClose={handleCloseSnack}
            >
              <Alert onClose={handleCloseSnack} severity="success">
                ¡Cliente Registrado Con Exito!
              </Alert>
            </Snackbar>
          </DialogContent>
        </Dialog>
      </Drawer>
    </React.Fragment>
  );
}
