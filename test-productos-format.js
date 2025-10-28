// Script para verificar el formato de datos de productos CORREGIDO
// Ejecutar con: node test-productos-format.js

const API_BASE_URL = 'http://localhost:3001'

async function testNewProductLogic() {
  console.log('🔍 Verificando nueva lógica de productos para administradores...\n')

  // Simular lo que hace el hook para administradores
  console.log('📋 Simulando lógica para administradores:')
  try {
    // Paso 1: Obtener lista completa
    console.log('  1️⃣ Obteniendo lista completa de debug...')
    const debugResponse = await fetch(`${API_BASE_URL}/api/productos/debug/all`)
    const debugData = await debugResponse.json()
    const allProductIds = debugData.productos.map(p => p.id)
    console.log(`     - IDs encontrados: [${allProductIds.join(', ')}]`)

    // Paso 2: Obtener productos públicos (con imágenes)
    console.log('  2️⃣ Obteniendo productos públicos...')
    const publicResponse = await fetch(`${API_BASE_URL}/api/productos`)
    const publicData = await publicResponse.json()
    const publicIds = publicData.map(p => p.id)
    console.log(`     - IDs públicos: [${publicIds.join(', ')}]`)
    console.log(`     - Con imágenes: ${publicData.every(p => p.imagen_url) ? 'SÍ' : 'NO'}`)

    // Paso 3: Identificar productos faltantes
    const missingIds = allProductIds.filter(id => !publicIds.includes(id))
    console.log(`  3️⃣ Productos faltantes: [${missingIds.join(', ') || 'ninguno'}]`)

    // Paso 4: Obtener productos faltantes individualmente
    const missingProducts = []
    for (const id of missingIds) {
      console.log(`     - Obteniendo producto ${id}...`)
      try {
        const productResponse = await fetch(`${API_BASE_URL}/api/productos/${id}`)
        if (productResponse.ok) {
          const productData = await productResponse.json()
          missingProducts.push(productData)
          console.log(`       ✅ Obtenido con imagen: ${productData.imagen_url ? 'SÍ' : 'NO'}`)
        } else {
          console.log(`       ❌ Error ${productResponse.status}`)
        }
      } catch (error) {
        console.log(`       ❌ Error: ${error.message}`)
      }
    }

    // Resultado final
    const finalProducts = [...publicData, ...missingProducts]
    console.log(`  🎯 Resultado final: ${finalProducts.length} productos`)
    console.log(`     - Con imágenes: ${finalProducts.filter(p => p.imagen_url).length}`)
    console.log(`     - Sin imágenes: ${finalProducts.filter(p => !p.imagen_url).length}`)

    if (finalProducts.length > 0) {
      console.log(`  📊 Estados incluidos:`)
      const estados = finalProducts.reduce((acc, p) => {
        acc[p.estado] = (acc[p.estado] || 0) + 1
        return acc
      }, {})
      Object.entries(estados).forEach(([estado, count]) => {
        console.log(`     - ${estado}: ${count}`)
      })
    }

  } catch (error) {
    console.log(`  ❌ Error en simulación: ${error.message}`)
  }
  console.log()

  console.log('✅ La nueva lógica debería:')
  console.log('  1. Preservar todas las imágenes de productos públicos')
  console.log('  2. Incluir productos en borrador con sus datos completos')
  console.log('  3. Mostrar todos los estados para administradores')
  console.log('  4. Mantener compatibilidad con usuarios normales')
}

testNewProductLogic().catch(console.error)
