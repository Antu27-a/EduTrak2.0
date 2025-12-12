import "../components/css/Login.css";
import loginImg from "../assets/img/login-illustration.png";
import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(API_URL + '/IniciarSesion', { email, password });
            setSuccess('Login successful! Redirecting...');
            // Handle successful login (e.g., redirect or store token)
        } catch (err) {
            setError(err.response ? err.response.data.Error : 'Login failed. Please try again.');
        }
    };

    return (
        <div className="login-container fade-down">
            <div className="login-card">

                <div className="login-image-section">
                    <img src={loginImg} alt="Educación" />
                </div>

                <div className="login-form">
                    <h2>Ingreso al Sistema</h2>

                    <form onSubmit={handleLogin}>
                        <label>Correo institucional</label>
                        <input type="email" placeholder="ejemplo@colegio.edu.ar" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <label>Contraseña</label>
                        <input type="password" placeholder="Ingresa tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />

                        <button type="submit" className="btn-login2">Ingresar</button>
                    </form>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}

                    <p className="forgot-password">
                        ¿Olvidaste tu contraseña?
                    </p>
                </div>

            </div>
        </div>
    );
}
