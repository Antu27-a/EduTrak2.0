import "../components/css/Login.css";
import loginImg from "../assets/img/login-illustration.png";

export default function Login() {
    return (
        <div className="login-container fade-down">
            <div className="login-card">

                <div className="login-image-section">
                    <img src={loginImg} alt="Educación" />
                </div>

                <div className="login-form">
                    <h2>Ingreso al Sistema</h2>

                    <form>
                        <label>Correo institucional</label>
                        <input type="email" placeholder="ejemplo@colegio.edu.ar" />

                        <label>Contraseña</label>
                        <input type="password" placeholder="Ingresa tu contraseña" />

                        <button type="submit" className="btn-login2">Ingresar</button>
                    </form>

                    <p className="forgot-password">
                        ¿Olvidaste tu contraseña?
                    </p>
                </div>

            </div>
        </div>
    );
}
