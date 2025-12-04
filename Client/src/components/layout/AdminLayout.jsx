import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

import "./../Css/AdminLayout.css"

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <Sidebar />
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    )
}
