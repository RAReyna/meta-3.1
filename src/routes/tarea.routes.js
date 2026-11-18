/**
 * Rutas de Tareas
 */

import express from 'express';
import * as tareaController from '../controllers/tarea.controller.js';

const router = express.Router();

// GET: Obtener todas las tareas
router.get('/', tareaController.obtenerTodas);

// GET: Buscar tareas por título
router.get('/buscar', tareaController.buscarPorTitulo);

// GET: Obtener una tarea por ID
router.get('/:id', tareaController.obtenerPorId);

// POST: Crear una tarea
router.post('/', tareaController.crear);

// PUT: Actualizar una tarea completamente
router.put('/:id', tareaController.actualizarCompleta);

// PATCH: Actualizar una tarea parcialmente
router.patch('/:id', tareaController.actualizarParcial);

// DELETE: Eliminar una tarea
router.delete('/:id', tareaController.eliminar);

export default router;