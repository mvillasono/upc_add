import React from "react";
import { parseCurrency } from "../../utils/currency";
import { numeroALetras } from "../../utils/numeroLetras";
import "./Ticket.css";

class Ticket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container">
        <div className="receipt">
          <h1 className="logo">PASAMAYITO</h1>
          <div className="document">RUC: 20607599727</div>
          <div className="address">
            Carr. Panamericana Sur Km 101, Asia 15690
          </div>
          <div className="phone">TELF: (01) 6622730</div>
          <div className="invoiceTitle">
            {this.props.tipoComprobante === "01"
              ? "FACTURA ELECTRÓNICA"
              : this.props.tipoComprobante === "03"
              ? "BOLETA DE VENTA ELECTRÓNICA"
              : ""}
          </div>
          <div className="invoice">
            {this.props.serie}-{this.props.correlativo}
          </div>
          <div className="invoiceDate">
            Fecha/Hora: {this.props.fecha}/{this.props.hora}
          </div>
          <hr style={{ borderTop: "1px dashed" }} />
          {this.props.cliente != null && (
            <div style={{ fontSize: "11.5px" }}>
              <div className="client">
                <b>CLIENTE:</b> {this.props.cliente.nombres}
              </div>
              <div className="clientDoc">
                <b>RUC/DNI:</b> {this.props.cliente.numDocumento}
              </div>
              <div
                className="clientAddress"
                style={{
                  display:
                    this.props.cliente.direccion === "" ? "none" : "flex",
                }}
              >
                <b>DIRECCIÓN:</b> {this.props.cliente.direccion}
              </div>
              <div
                className="clientPhone"
                style={{
                  display:
                    this.props.cliente.telCelular === "" ? "none" : "flex",
                }}
              >
                <b>TELEFONO:</b> {this.props.cliente.telCelular}
              </div>
              <div
                className="clienEmail"
                style={{
                  display: this.props.cliente.correo === "" ? "none" : "flex",
                }}
              >
                <b>CORREO:</b>
                {this.props.cliente.correo}
              </div>
            </div>
          )}
          <hr style={{ borderTop: "1px dashed" }} />
          <div className="transactionDetails">
            <div className="detail">CANT.</div>
            <div className="detail">DESC.</div>
            <div className="detail">VALOR U.</div>
            <div className="detail">DSCT.</div>
            <div className="detail">TOTAL</div>
          </div>
          {this.props.arrDetalle.map((dato) => (
            <div className="transactionDetailsItems" key={dato.id}>
              <div style={{ width: "5%" }}>{dato.cantidad}</div>
              <div style={{ width: "30%", textAlign: "right" }}>
                {dato.descripcion}
              </div>
              <div style={{ width: "15%", textAlign: "right" }}>
                {parseCurrency(dato.valorVenta)}
              </div>
              <div style={{ width: "15%", textAlign: "right" }}>
                {parseCurrency(0)}
              </div>
              <div style={{ width: "15%", textAlign: "right" }}>
                {parseCurrency(dato.valorVenta * dato.cantidad)}
              </div>
            </div>
          ))}
          <hr style={{ borderTop: "1px dashed" }} />
          <div className="transactionDetailsTotals">
            <div style={{ width: "5%" }}></div>
            <div style={{ width: "5%", textAlign: "right" }}></div>
            <div style={{ width: "40%", textAlign: "right" }}>
              OPE.GRAVADAS:
            </div>
            <div style={{ width: "15%", textAlign: "right" }}></div>
            <div style={{ width: "15%", textAlign: "right" }}>
              {parseCurrency(this.props.totales.precioVenta)}
            </div>
          </div>
          <div className="transactionDetailsTotals">
            <div style={{ width: "5%" }}></div>
            <div style={{ width: "5%", textAlign: "right" }}></div>
            <div style={{ width: "40%", textAlign: "right" }}>IGV(18%):</div>
            <div style={{ width: "15%", textAlign: "right" }}></div>
            <div style={{ width: "15%", textAlign: "right" }}>
              {parseCurrency(this.props.totales.igv)}
            </div>
          </div>
          <div className="transactionDetailsTotals">
            <div style={{ width: "5%" }}></div>
            <div style={{ width: "5%", textAlign: "right" }}></div>
            <div style={{ width: "40%", textAlign: "right" }}>
              TOTAL A PAGAR :
            </div>
            <div style={{ width: "15%", textAlign: "right" }}></div>
            <div style={{ width: "15%", textAlign: "right" }}>
              {parseCurrency(this.props.totales.valorVenta)}
            </div>
          </div>
          <hr style={{ borderTop: "1px dashed" }} />
          <div className="transactionDetailsTotals">
            <div>
              SON:
              {numeroALetras(this.props.totales.valorVenta, {
                plural: "soles",
                singular: "soles",
                centPlural: "centavos",
                centSingular: "centavo",
              }).toUpperCase()}{" "}
            </div>
          </div>
          <div className="invoiceTitle">
            <img src={this.props.qr} alt={this.props.qr} />
          </div>
          <hr style={{ borderTop: "1px dashed" }} />
          <div className="invoice">
            <div style={{ textTransform: "uppercase", fontSize: "10px" }}>
              Gracias por su compra, conserve este comprobante en caso de
              reclamo, no se realizan{" "}
              <u style={{ fontWeight: "bold" }}>devoluciones</u> de dinero
              despues de adquirido el producto.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Ticket;
