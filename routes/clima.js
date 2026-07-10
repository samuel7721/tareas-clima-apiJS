const express = require('express');
const router = express.Router();
const { param, validationResult } = require('express-validator');
const { obtenerClima } = require('../services/clima');

function validar(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array()
    });
  }

  next();
}

// GET /api/clima - ciudad vacía
router.get('/', (req, res) => {
  return res.status(400).json({
    error: 'El parámetro ciudad es obligatorio'
  });
});

// GET /api/clima/:ciudad - obtener clima por ciudad
router.get(
  '/:ciudad',

  param('ciudad')
    .trim()
    .notEmpty()
    .withMessage('La ciudad es obligatoria')
    .isLength({ min: 2, max: 80 })
    .withMessage('La ciudad debe tener entre 2 y 80 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s.-]+$/)
    .withMessage('La ciudad contiene caracteres inválidos'),

  validar,

  async (req, res) => {
    try {
      const ciudad = req.params.ciudad.trim();

      const clima = await obtenerClima(ciudad);

      return res.status(200).json(clima);
    } catch (error) {
      console.error('Error al consultar el clima:', error.message);

      return res.status(502).json({
        error: error.message
      });
    }
  }
);

module.exports = router;