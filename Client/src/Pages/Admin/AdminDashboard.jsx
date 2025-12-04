import Sidebar from "../../components/layout/Sidebar"
import "../../components/Css/Sidebar.css"

export default function AdminDashboard() {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <main
                style={{
                    
                    padding: "32px",
                    width: "100%",
                    minHeight: "100vh",
                    backgroundColor: "#f5f7fa",
                }}
            >
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#07454e", marginBottom: "8px" }}>Dashboard</h1>
                <p style={{ color: "#666", marginBottom: "32px",fontSize: "19px" }}>Bienvenido al panel de administración</p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {[
                        { title: "Total Usuarios", value: "1,234", color: "#07454e" },
                        { title: "Cursos Activos", value: "45", color: "#438791" },
                        { title: "Alumnos", value: "892", color: "#00796b" },
                        { title: "Asistencia Hoy", value: "87%", color: "#558b2f" },
                    ].map((card, index) => (
                        <div
                            key={index}
                            style={{
                                background: "white",
                                padding: "24px",
                                borderRadius: "12px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                borderLeft: `4px solid ${card.color}`,
                            }}
                        >
                            <p style={{ color: "#666", fontSize: "17px", marginBottom: "8px" }}>{card.title}</p>
                            <p style={{ fontSize: "32px", fontWeight: "700", color: card.color }}>{card.value}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
