/* export const url_clientes = "http://159.223.188.90:8082";
export const url_productos = "http://159.223.188.90:8082";
export const url_ordenes = "http://159.223.188.90:8082";
export const url_correlativos = "http://159.223.188.90:8082";
export const url_sunat = "http://159.223.188.90:8083"; */

export const url_clientes = "http://localhost:8082";
export const url_productos = "http://localhost:8082";
export const url_ordenes = "http://localhost:8082";
export const url_correlativos = "http://localhost:8082";
export const url_sunat = "http://localhost:8083";

export const url_listarClientes = `${url_clientes}/clientes/listarClientes`;
export const url_buscarCliente = `${url_clientes}/clientes/buscarCliente`;
export const url_registrarCliente = `${url_clientes}/clientes/registrarCliente`;
export const url_findByDocumentoApi = `${url_clientes}/clientes/findByDocumentoApi`;

export const url_buscarclientedocumento = `${url_clientes}/clientes/buscarClienteDocumento`;
export const url_listaProductos = `${url_productos}/productos/listaProductos`;

export const url_registrarOrden = `${url_ordenes}/ordenes/registrarOrden`;
export const url_listarOrdenes = `${url_ordenes}/ordenes/listarOrdenes`;
export const url_listarDetalle = `${url_ordenes}/ordenes/listarDetalle`;
export const url_actualizarEstado = `${url_ordenes}/ordenes/actualizarEstado`;

export const url_listarSeries = `${url_correlativos}/correlativos/listarSeries`;
export const url_obtenerCorrelativo = `${url_correlativos}/correlativos/obtenerCorrelativo`;
export const url_aumentarCorrelativo = `${url_correlativos}/correlativos/aumentarCorrelativo`;

export const url_envio_sunat = `${url_sunat}/envio-sunat/send-sunat`;
export const url_obtenerDatosEnvio = `${url_sunat}/envio-sunat/obtenerDatosEnvio`;
