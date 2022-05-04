import { url_listaProductos } from "./api_url";

export const ListarProductos = async (setProductos) => {
  try {
    const data = await fetch(`${url_listaProductos}`);
    const res = await data.json();
    if (res != null) setProductos(res.productos);
    else setProductos([]);
  } catch (error) {
    console.error(error);
  }
};
