import { useState } from "react";
import { Link } from "react-router-dom";
import "../components/Css/Landing.css";
import gif1 from "../assets/img/gif1.gif";
import gif2 from "../assets/img/gif2.gif";
import gif3 from "../assets/img/gif3.gif";

export default function Landing() {

  const images = [gif1, gif2, gif3];

  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="landing-container">
      <div className="carousel">
        <button onClick={prev}>◀</button>
        <img src={images[index]} alt="carousel" />
        <button onClick={next}>▶</button>
      </div>

      <div className="text-section">
        <h1>Bienvenido a EduTrak</h1>
        <p>El sistema inteligente para gestión de asistencias escolares.</p>
      </div>

      <Link to="/login">
        <button className="btn-login">Iniciar Sesión</button>
      </Link>
    </div>
  );
}
