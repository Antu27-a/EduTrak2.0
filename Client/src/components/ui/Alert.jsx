import { useEffect } from "react"
import "../Css/Alert.css"

export default function Alert({ message, type = "success", isVisible, onClose }) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose()
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isVisible, onClose])

    if (!isVisible) return null

    return (
        <div className={`alert alert-${type}`}>
            <span>{message}</span>
            <button className="alert-close" onClick={onClose}>
                ×
            </button>
        </div>
    )
}
