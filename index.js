const express = require('express');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
app.use(express.json());

// 👉 Servir archivos estáticos (HTML, CSS, JS, videos)
app.use(express.static(path.join(__dirname, 'public')));

app.post('/registrar-visita', (req, res) => {
  const { usuario, video, tiempoVisualizacion } = req.body;

  if (!usuario || !video || tiempoVisualizacion == null) {
    return res.status(400).json({ mensaje: 'Datos incompletos' });
  }

  const nuevaVisita = {
    usuario,
    video,
    tiempoVisualizacion,
    fecha: new Date().toISOString(),
  };

  console.log('Nueva visita registrada:', nuevaVisita);

  const filePath = path.join(__dirname, 'visitas.xlsx');

  let workbook, worksheet;
  if (fs.existsSync(filePath)) {
    workbook = xlsx.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const datos = xlsx.utils.sheet_to_json(worksheet);
    datos.push(nuevaVisita);  // Añadir nueva visita
    worksheet = xlsx.utils.json_to_sheet(datos);
  } else {
    worksheet = xlsx.utils.json_to_sheet([nuevaVisita]);
    workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Visitas');
  }

  xlsx.writeFile(workbook, filePath); // Guarda el archivo actualizado

  res.json({ mensaje: 'Visita registrada correctamente' });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});


