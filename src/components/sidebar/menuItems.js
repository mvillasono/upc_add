import { BsCardChecklist } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { AiOutlineFileDone } from "react-icons/ai";

export const menuItems = [
  {
    text: "Listado",
    icon: <BsCardChecklist />,
    path: "/",
  },
  {
    text: "Orden",
    icon: <AiOutlineShoppingCart />,
    path: "/orden",
  },
];
