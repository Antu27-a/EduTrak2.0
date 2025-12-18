const roleMiddleware = (rolPermitido) => {
    return (req, res, next) => {
        if (!req.userRol || req.userRol !== rolPermitido) {
            return res.status(403).json({
                Error: "No tenés permisos para realizar esta acción",
            })
        }
        next()
    }
}

module.exports = roleMiddleware
