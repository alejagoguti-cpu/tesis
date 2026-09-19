# 🏛️ Tesis: Reubicación & Resiliencia en Tierrabomba (Cartagena)

> **Equipamiento Comunitario e Infraestructura Hídrica Autosuficiente frente a la Erosión Costera.**  
> Repositorio de la plataforma web interactiva y visor técnico del proyecto de grado en Arquitectura & Urbanismo.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github)](https://github.com/alejagoguti-cpu/tesis)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=flat&logo=three.js)](https://threejs.org/)

---

## 🌊 Resumen de la Problemática & Propuesta

* **Ubicación:** Isla de Tierrabomba, Cartagena de Indias, Colombia.
* **Problemática:** Ausencia total de red pública de acueducto, salinización de pozos subterráneos y una tasa de retroceso costero por erosión de hasta **1.8 m/año**.
* **Propuesta Arquitectónica:** Reubicación de equipamiento comunal clave a una cota segura (+22.00 m.s.n.m.) con diseño bioclimático caribeño, cubierta captadora de aguas pluviales (1.850 m²) y un aljibe subterráneo de **450.000 litros** con desinfección solar y fitodepuración de aguas grises.

---

## ✨ Características de la Plataforma Web

1. **Visor 3D Interactivo para Revit (BIM / WebGL):**
   - Navegación con rotación (órbita), zoom y paneo.
   - Despiece vertical (Exploded View) de cubierta y aljibe subterráneo.
   - Filtros de capas (Estructura de madera, cubiertas, celosías de arcilla, cisterna).
   - Simulación solar de azimut e iluminación.
   - Conector directo para incrustar streams de **Speckle** o **Autodesk Platform Services (APS)** desde Revit.
2. **Módulo de Planimetría & Ploteo Técnico:**
   - Visor de planos arquitectónicos (Plantas, Cortes, Fachadas y Detalles).
   - Zoom profundo (hasta 350%) y desplazamiento tipo CAD.
   - Modo plano cianotipo (Blueprint azul) y modo papel blanco.
   - Botón directo de **"Plotear / Imprimir Plano"** listo para exportar a PDF a escala.
3. **Cartografía de Diagnóstico:**
   - Mapa interactivo de la Isla de Tierrabomba con capas de riesgo de erosión costera, acuífero salinizado y la meseta segura de reubicación.
4. **Ciclo Hídrico Interactivo:**
   - Esquema hidráulico paso a paso del funcionamiento del sistema de captación, almacenamiento, filtrado y recirculación.

---

## 🚀 Cómo Ejecutar en Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/alejagoguti-cpu/tesis.git
   cd tesis
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

4. Compilar para producción:
   ```bash
   npm run build
   ```

---

## 📦 Cómo Subir tus Cambios a GitHub

Ejecuta en tu terminal dentro de la carpeta del proyecto:

```bash
git add .
git commit -m "feat: plataforma web interactiva de tesis con visor revit y planos"
git push -u origin main
```

---

## 🌐 Publicar Gratis en GitHub Pages

Para que tu web esté online y accesible públicamente para el jurado:

1. Ve a tu repositorio en GitHub: [https://github.com/alejagoguti-cpu/tesis](https://github.com/alejagoguti-cpu/tesis)
2. Entra a **Settings** > **Pages**.
3. En **Build and deployment > Source**, selecciona **GitHub Actions** o despliega desde la rama correspondiente (`gh-pages`).
4. ¡Listo! Tu página estará disponible en `https://alejagoguti-cpu.github.io/tesis/`.

---

## 📐 Cómo Conectar tu Archivo Revit (.rvt)

Existen dos maneras muy sencillas de mostrar tu geometría exacta de Revit:

1. **Opción Recomendada (Speckle - Gratis):**
   - Instala el conector de **Speckle para Revit**.
   - Haz clic en *Send* en tu vista 3D de Revit.
   - Copia el link embebido de tu visor de Speckle y pégalo en la pestaña *Conectar Revit / Speckle* de la web.
2. **Opción glTF (Three.js):**
   - Exporta tu modelo de Revit a `.gltf` / `.glb` y guárdalo en la carpeta `/public/models/`.

---

**Autoras:** Alejandra Gómez & Ana Casas  
**Tesis de Grado en Arquitectura & Urbanismo (2026)**
