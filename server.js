require('dotenv').config();
const climaRouter = require('./routes/clima');
const tareasRouter = require('./routes/tareas');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/clima', climaRouter);
app.use('/api/tareas', tareasRouter);

app.post(
  '/api/echo',
  body('mensaje')
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .escape(),
  (req, res) => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(400).json({
        errores: errores.array()
      });
    }

    res.json({
      recibido: req.body.mensaje
    });

  }
);

app.get('/api/salud', (req, res) => {
  res.json({
    status: 'ok'
  });
});

// Endpoint para registrar un usuario
app.post(
  '/api/registro',

  // Principio de codificación segura:
  // Nunca confiar en la entrada del usuario.
  // Se valida que el nombre no esté vacío y que el correo
  // tenga un formato válido antes de procesar la información.

  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .escape(),

  body('correo')
    .isEmail()
    .withMessage('El correo no tiene un formato válido')
    .normalizeEmail(),

  (req, res) => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(400).json({
        errores: errores.array()
      });
    }

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      datos: {
        nombre: req.body.nombre,
        correo: req.body.correo
      }
    });

  }
);

module.exports = app;