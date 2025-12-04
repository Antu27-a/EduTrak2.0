import { Outlet } from "react-router-dom"
import PreceptorSidebar from "./PreceptorSidebar"
import "../Css/PreceptorLayout.css"

export default function PreceptorLayout() {
    return (
        <div className="preceptor-layout">
            <PreceptorSidebar />
            <main className="preceptor-main">
                <Outlet />
            </main>
        </div>
    )
}
