import {
  url_buscarclientedocumento,
  url_clientes,
  url_findByDocumentoApi,
} from "./api_url";

export const ListaCliente = async (setClientes) => {
  try {
    const data = await fetch(`${url_clientes}`);
    const res = await data.json();
    if (res != null) setClientes(res.clientes);
    else setClientes([]);
  } catch (error) {
    console.error(error);
  }
};

export const BuscarClienteDocumento = async (documento, setCliente) => {
  try {
    console.log(documento);
    const data = await fetch(
      `${url_buscarclientedocumento}?documento=${documento}`
    );
    const res = await data.json();
    if (res != null) setCliente(res.cliente);
    else setCliente([]);
  } catch (error) {
    console.error(error);
  }
};

export const FindByDocumentoApi = async (
  tipo,
  numero,
  setClienteBuscar,
  setNuevoCliente
) => {
  try {
    const data = await fetch(
      `${url_findByDocumentoApi}?tipo=${tipo}&numero=${numero}`
    );
    const res = await data.json();
    if (res != null) {
      setClienteBuscar(res.documento);

      let nombres = "";
      let apePaterno = "";
      let apeMaterno = "";

      if (tipo === "6") {
        nombres = res.documento.nombre;
      } else {
        apePaterno = res.documento.apellidoPaterno;
        apeMaterno = res.documento.apellidoMaterno;
        nombres = res.documento.nombres;
      }

      setNuevoCliente({
        tipoDocumento: tipo,
        numDocumento: numero,
        direccion: res.documento.direccion,
        nombres: nombres,
        apePaterno: apePaterno,
        apeMaterno: apeMaterno,
      });

      return {
        documento: res.documento,
      };
    } else setClienteBuscar([]);
  } catch (error) {
    console.error(error);
  }
};
