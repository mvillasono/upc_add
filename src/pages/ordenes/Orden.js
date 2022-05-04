import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";

import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Snackbar,
} from "@material-ui/core";
import clsx from "clsx";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { ListarProductos } from "../../services/sproductos";
import { useAuth } from "../../hooks/useAuth";
import { fechaHoy } from "./../../utils/fecha_hoy";
import { parseCurrency } from "./../../utils/currency";
import MuiAlert from "@material-ui/lab/Alert";
import moment from "moment";
import "moment/locale/es";

import { url_registrarOrden } from "../../services/api_url";

const useStyles = makeStyles((theme) => ({
  paper: {
    //padding: theme.spacing(2),
    display: "flex",
    overflow: "hidden",
    flexDirection: "column",
  },
  fixedHeight: {
    height: "100%",
    //height: "calc(100vh - 160px)",
  },
  paperOrder: {
    backgroundColor: "#2d3347",
    color: "#fff",
  },
  root: {
    flexGrow: 1,
    overflow: "hidden",
    padding: theme.spacing(0, 3),
  },
  paper2: {
    maxWidth: 400,
    margin: `${theme.spacing(1)}px auto`,
    //padding: theme.spacing(2),
  },
  depositContext: {
    flex: 1,
  },

  ///

  inline: {
    display: "inline",
    color: "#a6abb7",
  },
  quantity: {
    width: 40,
    height: 40,
    border: "2px solid #1a2033",
    backgroundColor: "#1a2033",
    color: "#fff",
    textAlign: "center",
    //font: "600 1.2rem Helvetica, Arial, sans-serif",
    left: `calc(50% - 30px)`,
    borderRadius: "25%",
  },
  container: {
    height: "100%", // So that grids 1 & 4 go all the way down
    //minHeight: 70, // Give minimum height to a div
    fontSize: 15,
    textAlign: "center",
  },

  //......
  ordenCompra: {
    backgroundColor: "#2d3347",
    textAlign: "left",
    paddingTop: 30,
    paddingLeft: 30,
    paddingBottom: 15,
    fontSize: "20px",
  },
  tituloTotal: {
    color: "#fff",
    fontSize: "22px",
    textAlign: "left",
    paddingLeft: 30,
    paddingBottom: 10,
  },
  precioTotal: {
    fontSize: "25px",
    color: "#ff4f6d",
    fontWeight: "bold",
  },
  tituloTotales: {
    color: "#fff",
    fontSize: "18px",
    textAlign: "left",
    paddingLeft: 30,
  },
  botones: {
    backgroundColor: "#2d3347",
    textAlign: "center",
    paddingTop: 10,
    paddingLeft: 30,
    paddingBottom: 15,
    fontSize: "20px",
  },
  centrarBotones: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
  },
  backgroundDetalle: {
    background: "#2d3347",
  },
  formControl: {
    //margin: theme.spacing(2),
    width: 200,
    color: "#fff",
    textAlign: "left",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Orden() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [subtotal, setSubTotal] = useState(0);
  const [igv, setIgv] = useState(0);
  const [total, setTotal] = useState(0);
  const { cart, setCart } = useAuth();
  const [open, setOpen] = React.useState(false);

  const [productos, setProductos] = useState([]);
  useEffect(() => {
    ListarProductos(setProductos);
  }, []);

  useEffect(() => {
    let cTotal = 0;
    let cIgv = 0;
    let cSubtotal = 0;

    cart.map((item) => {
      cTotal = cTotal + item.cantidad * item.valorVenta;
    });

    cSubtotal = cTotal / 1.18;
    cIgv = (cTotal / 1.18) * 0.18;
    //cTotal = cSubtotal + cIgv;

    setSubTotal(cSubtotal);
    setIgv(cIgv);
    setTotal(cTotal);
  }, [cart]);

  /*   const addToCart = (product) => {
    const productExist = cart.find((item) => item.id === product.id);
    console.log("productExist::::: ", productExist);
    if (productExist) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...productExist,
                quantity: productExist.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }; */

  const removeFromCart = (productRemove) => {
    setCart(cart.filter((product) => product !== productRemove));
  };

  /*******************************/
  /* AUMENTAR Y DISMINUIR ITEMS */
  const incrementQuantity = (product) => {
    const productExist = cart.find((item) => item.id === product.id);
    if (productExist) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...productExist,
                cantidad: productExist.cantidad + 1,
                //stock: productExist.stock - 1,
              }
            : item
        )
      );
    }
  };

  const decrementQuantity = (product) => {
    const productExist = cart.find((item) => item.id === product.id);
    if (productExist) {
      if (productExist.cantidad === 1) {
        //console.log("SI LA CANTIDAD ES 1 EL ITEM SE ELIMINARA DEL LISTADO");
      } else {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? {
                  ...productExist,
                  cantidad: productExist.cantidad - 1,
                  //stock: productExist.stock + 1,
                }
              : item
          )
        );
      }
    }
  };

  const addToCart = (product) => {
    const productExist = cart.find((item) => item.id === product.id);

    if (productExist) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...productExist,
                cantidad: productExist.cantidad + 1,
              }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, cantidad: 1 }]);
    }
  };

  const guardarOrden = async () => {
    const orden = {
      id: 0,
      igv: igv,
      precioVenta: subtotal,
      valorVenta: total,
      fechaRegistro: moment().format("YYYY-DD-MM"),
      estadoSunat: false,
      detalle: cart,
    };

    try {
      const res = await fetch(`${url_registrarOrden}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orden),
      });

      const data = await res.json();
      //console.log(data);
      if (data !== null) {
        handleClick();
      }
    } catch (error) {
      console.error(error);
    }

    setCart([]);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item xs={12} md={7} lg={7}>
        <div className={classes.container}>
          <Paper className={fixedHeightPaper}>
            <Grid container>
              {productos.map((item) => (
                <Grid item key={item.id} style={{ margin: 13, width: 150 }}>
                  <Card style={{ maxHeight: "150" }}>
                    <CardActionArea
                      id={item.id}
                      onClick={() => addToCart(item)}
                    >
                      <CardMedia
                        component="img"
                        alt="Contemplative Reptile"
                        height="120"
                        image={item.imagen}
                        title="Contemplative Reptile"
                      />
                      <CardContent>
                        <Typography
                          style={{
                            fontWeight: "bold",
                            height: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          variant="p"
                          component="p"
                        >
                          {item.descripcion}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </div>
      </Grid>
      <Grid item xs={12} md={5} lg={5}>
        <div className={classes.container}>
          <Paper
            className={fixedHeightPaper}
            style={{
              backgroundColor: "#1a2033",
              color: "#fff",
              margin: 0,
            }}
          >
            <div className={classes.ordenCompra}>
              <Typography variant="p" gutterBottom>
                Orden De Compra
              </Typography>
              <Typography
                variant="subtitle2"
                gutterBottom
                style={{
                  fontSize: "14px",
                  color: "#ff4f6d",
                  fontWeight: "bold",
                }}
              >
                {moment().format("MMMM Do YYYY, h:mm:ss a").toUpperCase()}
              </Typography>
            </div>
            {/*  GRID PARA ORDENES */}
            <div className={classes.backgroundDetalle}>
              {cart.length !== 0 &&
                cart.map((cart) => (
                  <React.Fragment>
                    <Grid
                      item
                      xs={12}
                      key={cart.id}
                      style={{ paddingBottom: 5 }}
                    >
                      <div
                        style={{
                          paddingLeft: 30,
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {cart.descripcion}
                      </div>
                    </Grid>
                    <Grid container direction="row" spacing={3}>
                      <Grid item xs>
                        <div
                          style={{
                            color: "#a2a5b2",
                            fontSize: "18px",
                            paddingLeft: 30,
                          }}
                        >
                          {parseCurrency(cart.valorVenta)}
                        </div>
                      </Grid>
                      <Grid item xs>
                        <div>
                          <IconButton
                            style={{ color: "#9b9fa7" }}
                            onClick={() => decrementQuantity(cart)}
                            size="small"
                          >
                            <RemoveIcon />
                          </IconButton>
                          <input
                            type="text"
                            className={classes.quantity}
                            step="1"
                            value={cart.cantidad}
                            name="cantidad"
                            //onChange={(e) => handleChangeQuantity(e, cart)}
                          />
                          <IconButton
                            style={{ color: "#9b9fa7" }}
                            size="small"
                            onClick={() => incrementQuantity(cart)}
                          >
                            <AddIcon />
                          </IconButton>
                        </div>
                      </Grid>
                      <Grid item xs>
                        <div style={{ color: "#fff", fontSize: "18px" }}>
                          {parseCurrency(cart.valorVenta * cart.cantidad)}
                          <IconButton
                            style={{ color: "#9b9fa7", marginTop: "-5px" }}
                            onClick={() => removeFromCart(cart)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </Grid>
                      {/* <Grid item xs>
                        <div>
                          <IconButton
                            style={{ color: "#9b9fa7" }}
                            onClick={() => removeFromCart(cart)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </Grid> */}
                    </Grid>
                  </React.Fragment>
                ))}
            </div>
            {/*  GRID PARA ORDENES */}

            <div>
              <Grid
                container
                direction="row"
                spacing={3}
                style={{ paddingTop: 5 }}
              >
                <Grid item xs>
                  <div className={classes.tituloTotales}>Subtotal</div>
                </Grid>
                <Grid item xs>
                  <div className={classes.container}></div>
                </Grid>
                <Grid item xs>
                  <div
                    className={classes.container}
                    style={{
                      color: "#fff",
                      fontSize: "20px",
                      textAlign: "right",
                      marginRight: 25,
                    }}
                  >
                    {parseCurrency(subtotal)}
                  </div>
                </Grid>
              </Grid>

              <Grid container direction="row" spacing={3}>
                <Grid item xs>
                  <div className={classes.tituloTotales}>IGV(18%)</div>
                </Grid>
                <Grid item xs>
                  <div className={classes.container}></div>
                </Grid>
                <Grid item xs>
                  <div
                    className={classes.container}
                    style={{
                      color: "#fff",
                      fontSize: "20px",
                      textAlign: "right",
                      marginRight: 25,
                    }}
                  >
                    {parseCurrency(igv)}
                  </div>
                </Grid>
              </Grid>
              <hr style={{ borderTop: "1px dashed", borderBottom: "0px" }} />
              <Grid container direction="row" spacing={3}>
                <Grid item xs style={{ paddingBottom: 20 }}>
                  <div className={classes.tituloTotal}>Total</div>
                </Grid>
                <Grid item xs>
                  <div className={classes.container}></div>
                </Grid>
                <Grid item xs>
                  <div
                    className={classes.precioTotal}
                    style={{ textAlign: "right", marginRight: 25 }}
                  >
                    {parseCurrency(total)}
                  </div>
                </Grid>
              </Grid>
            </div>

            <Grid container spacing={2} className={classes.botones}>
              <Grid xs className={classes.centrarBotones}>
                <div>
                  <Button
                    size="large"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    style={{
                      fontSize: "15px",
                      color: "#ff4f6d",
                      fontWeight: "bold",
                      opacity: cart.length > 0 ? 1 : 0.5,
                    }}
                    disabled={cart.length > 0 ? false : true}
                    onClick={() => guardarOrden()}
                  >
                    Generar Orden
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </Grid>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          LA ORDEN SE REGISTRO CORRECTAMENTE
        </Alert>
      </Snackbar>
    </Grid>
  );
}
