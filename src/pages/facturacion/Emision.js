import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { useForm } from "react-hook-form";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { makeStyles } from "@material-ui/core/styles";
import { FormInputText } from "../../components/form/FormInputText";
import { FormInputDropdown } from "../../components/form/FormInputDropdown";
import {
  arrEmisor,
  arrFormaPago,
  arrMoneda,
  arrTipoComprobante,
  arrTipoDocumento,
} from "../../utils/data";
import { FormInputDate } from "../../components/form/FormInputDate";
import { ListaCliente } from "../../services/sclientes";
import { FormInputAdornment } from "../../components/form/FormInputAdornment";

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

const defaultValues = {
  textValue: "",
  radioValue: "",
  checkboxValue: [],
  dateValue: new Date(),
  dropdownValue: "",
  sliderValue: 0,
};

export default function Emision() {
  const classes = useStyles();
  const methods = useForm();
  const { handleSubmit, reset, control, setValue, watch } = methods;
  const onSubmit = (data) => console.log(data);

  const [cliente, setCliente] = useState([]);

  /* useEffect(() => {
    ListaCliente(setClientes);
  }, []); */

  useEffect(() => {
    console.log("cliente ", cliente);
    setValue("nomRazonSocial", cliente.nombres);
    watch("nomRazonSocial", cliente.nombres, { shouldValidate: true });

    setValue("direccion", cliente.direccion);
  }, [cliente]);

  return (
    <Paper
      style={{
        display: "grid",
        gridRowGap: "20px",
        padding: "20px",
        //margin: "10px 300px",
      }}
    >
      <Typography variant="h6">Registar Nueva Venta</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={8}>
          <Paper
            style={{
              display: "grid",
              gridRowGap: "20px",
              padding: "20px",
              //margin: "10px 300px",
            }}
          >
            <Typography variant="button">Datos Comprobante</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={4}>
                <FormInputDropdown
                  name="emisor"
                  control={control}
                  label="Facturar por"
                  options={arrEmisor}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <FormInputDropdown
                  name="tipoComprobante"
                  control={control}
                  label="Tipo Comprobante"
                  options={arrTipoComprobante}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={4}>
                <FormInputDate
                  name="fechaEmision"
                  control={control}
                  label="Fecha Emision"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <FormInputText name="serie" control={control} label="Serie" />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <FormInputText
                  name="correlativo"
                  control={control}
                  label="Correlativo"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={4}>
                <FormInputDate
                  name="fechaVencimientp"
                  control={control}
                  label="Fecha Vencimiento"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <FormInputDropdown
                  name="moneda"
                  control={control}
                  label="Moneda"
                  options={arrMoneda}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <FormInputDropdown
                  name="formaPago"
                  control={control}
                  label="Forma Pago"
                  options={arrFormaPago}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Paper
            style={{
              display: "grid",
              gridRowGap: "20px",
              padding: "20px",
              //margin: "10px 300px",
            }}
          >
            <Typography variant="button">Datos Cliente</Typography>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputDropdown
                name="tipoDocumento"
                control={control}
                label="Tipo Documento"
                options={arrTipoDocumento}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputAdornment
                name="nroDocumento"
                control={control}
                label="# Documento"
                setCliente={setCliente}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                name="nomRazonSocial"
                control={control}
                label="Nombre / Raz.Social"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                name="direccion"
                control={control}
                label="Dirección"
              />
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Button onClick={handleSubmit(onSubmit)} variant={"contained"}>
        {" "}
        Submit{" "}
      </Button>
      <Button onClick={() => reset()} variant={"outlined"}>
        {" "}
        Reset{" "}
      </Button>
    </Paper>
  );
}
