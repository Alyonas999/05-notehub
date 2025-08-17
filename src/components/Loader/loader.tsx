import css from "./loader.module.css";
import { PacmanLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className={css.wrapper}>
      <PacmanLoader color="#ff9800" size={25} />
    </div>
  );
}