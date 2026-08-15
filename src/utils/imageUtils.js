// Utilidades para trabajar con las fotografías de facturas/recibos.

/** Lee un archivo de imagen y devuelve un Data URL. */
export function leerArchivoComoDataURL(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
    reader.readAsDataURL(archivo)
  })
}

/**
 * Redimensiona y comprime una imagen para que quepa en localStorage.
 * localStorage tiene un límite (~5 MB) por lo que se reduce la imagen
 * antes de guardarla como base64.
 */
export async function prepararImagen(archivo, anchoMaximo = 900, calidad = 0.75) {
  const dataUrl = await leerArchivoComoDataURL(archivo)

  return new Promise((resolve, reject) => {
    const imagen = new Image()
    imagen.onload = () => {
      const escala = Math.min(1, anchoMaximo / imagen.width)
      const ancho = Math.round(imagen.width * escala)
      const alto = Math.round(imagen.height * escala)

      const canvas = document.createElement('canvas')
      canvas.width = ancho
      canvas.height = alto

      const ctx = canvas.getContext('2d')
      ctx.drawImage(imagen, 0, 0, ancho, alto)
      resolve(canvas.toDataURL('image/jpeg', calidad))
    }
    imagen.onerror = () => reject(new Error('La imagen no es válida'))
    imagen.src = dataUrl
  })
}