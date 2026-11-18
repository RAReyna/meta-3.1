/**
 * Controlador de Tareas
 * Maneja las peticiones HTTP y responde con JSON
 */

import * as tareaModel from '../models/tarea.model.js';

// Convierte el parámetro a entero; devuelve NaN si no es un entero válido
const parsearId = (valor) => {
  const id = Number(valor);
  return Number.isInteger(id) ? id : NaN;
};

const tituloValido = (titulo) =>
  typeof titulo === 'string' && titulo.trim() !== '';


// Enviar tareas en JSON o texto plano
const responderTareas = (req, res, tareas) => {

  if (req.query.formato === 'text') {
    const texto = tareas.map(tarea =>
      `ID: ${tarea.id} | Título: ${tarea.titulo} | Completada: ${tarea.completada ? 'Sí' : 'No'}`
    ).join('\n');

    return res.type('text/plain').send(texto || 'No se encontraron tareas.');
  }

  res.json({
    success: true,
    data: tareas,
    count: tareas.length
  });
};

// GET /api/tareas - Obtener todas las tareas
const obtenerTodas = (req, res) => {
  try {
    const tareas = tareaModel.obtenerTodas();
    responderTareas(req, res, tareas);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las tareas',
      error: error.message
    });
  }
};

// GET /api/tareas/:id - Obtener una tarea por ID
const obtenerPorId = (req, res) => {
  try {
    const id = parsearId(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. Debe ser un número'
      });
    }

    const tarea = tareaModel.obtenerPorId(id);

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`
      });
    }

    res.json({
      success: true,
      data: tarea
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la tarea',
      error: error.message
    });
  }
};

// POST /api/tareas - Crear una nueva tarea
const crear = (req, res) => {
  try {
    const { titulo, completada } = req.body ?? {};

    if (!tituloValido(titulo)) {
      return res.status(400).json({
        success: false,
        message: 'El campo "titulo" es requerido y debe ser un texto no vacío'
      });
    }

    if (completada !== undefined && typeof completada !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'El campo "completada" debe ser booleano (true o false)'
      });
    }

    const nuevaTarea = tareaModel.crear({ titulo: titulo.trim(), completada });

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: nuevaTarea
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la tarea',
      error: error.message
    });
  }
};

// PUT /api/tareas/:id - Actualizar tarea completamente
const actualizarCompleta = (req, res) => {
  try {
    const id = parsearId(req.params.id);
    const { titulo, completada } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. Debe ser un número'
      });
    }

    // Validar datos requeridos
    if (!titulo) {
      return res.status(400).json({
        success: false,
        message: 'El campo "titulo" es requerido'
      });
    }

    const tareaActualizada = tareaModel.actualizarCompleta(id, { titulo, completada });

    if (!tareaActualizada) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`
      });
    }

    res.json({
      success: true,
      message: 'Tarea actualizada completamente',
      data: tareaActualizada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la tarea',
      error: error.message
    });
  }
};

// PATCH /api/tareas/:id - Actualizar tarea parcialmente
const actualizarParcial = (req, res) => {
  try {
    const id = parsearId(req.params.id);
    const { titulo, completada } = req.body ?? {};
    const datosParciales = {};

    if (titulo !== undefined) {
      if (!tituloValido(titulo)) {
        return res.status(400).json({
          success: false,
          message: 'El campo "titulo" debe ser un texto no vacío'
        });
      }
      datosParciales.titulo = titulo.trim();
    }

    if (completada !== undefined) {
      if (typeof completada !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'El campo "completada" debe ser booleano (true o false)'
        });
      }
      datosParciales.completada = completada;
    }

    if (Object.keys(datosParciales).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe enviar al menos un campo válido para actualizar (titulo o completada)'
      });
    }

    const tareaActualizada = tareaModel.actualizarParcial(id, datosParciales);

    if (!tareaActualizada) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`
      });
    }

    res.json({
      success: true,
      message: 'Tarea actualizada parcialmente',
      data: tareaActualizada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la tarea',
      error: error.message
    });
  }
};

// DELETE /api/tareas/:id - Eliminar una tarea
const eliminar = (req, res) => {
  try {
    const id = parsearId(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. Debe ser un número'
      });
    }

    const tareaEliminada = tareaModel.eliminar(id);

    if (!tareaEliminada) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`
      });
    }

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente',
      data: tareaEliminada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la tarea',
      error: error.message
    });
  }
};

// GET /api/tareas/buscar?q=express
const buscarPorTitulo = (req, res) => {
  try {
    const { q } = req.query;

    if (typeof q !== 'string' || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un título para buscar mediante el parámetro q'
      });
    }

    const tareas = tareaModel.buscarPorTitulo(q.trim());

    responderTareas(req, res, tareas);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar tareas',
      error: error.message
    });
  }
};

// Exportar todos los métodos del controlador
export {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizarCompleta,
  actualizarParcial,
  eliminar,
  buscarPorTitulo
};