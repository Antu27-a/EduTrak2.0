import "../Css/Button.css"

export default function Button({
    children,
    variant = "primary",
    size = "md",
    icon: Icon,
    onClick,
    type = "button",
    disabled = false,
    className = "",
}) {
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`btn btn-${variant} btn-${size} ${className}`}>
            {Icon && <Icon size={size === "sm" ? 16 : 20} />}
            {children}
        </button>
    )
}
