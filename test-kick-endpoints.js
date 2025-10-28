// Script de prueba para verificar endpoints de Kick
// Ejecutar con: node test-kick-endpoints.js

const API_BASE_URL = 'http://localhost:3001'

const testEndpoints = [
  '/api/kick/broadcaster/status',
  '/api/kick-admin/config',
  '/api/kick/points-config',
]

async function testEndpoint(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const status = response.status
    const statusText = response.statusText

    console.log(`${endpoint}: ${status} ${statusText}`)

    if (status === 404) {
      console.log(`  ❌ Endpoint no disponible`)
    } else if (status === 401) {
      console.log(`  🔐 Requiere autenticación`)
    } else if (status >= 200 && status < 300) {
      console.log(`  ✅ Endpoint disponible`)
    } else {
      console.log(`  ⚠️  Estado inusual`)
    }

    return { endpoint, status, available: status !== 404 }
  } catch (error) {
    console.log(`${endpoint}: ERROR - ${error.message}`)
    return { endpoint, status: 'ERROR', available: false }
  }
}

async function testAllEndpoints() {
  console.log('🧪 Probando endpoints de Kick...\n')

  const results = []
  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint)
    results.push(result)
    console.log() // Línea vacía
  }

  console.log('📊 Resumen:')
  const available = results.filter(r => r.available).length
  const total = results.length
  console.log(`  Endpoints disponibles: ${available}/${total}`)

  if (available === 0) {
    console.log('\n❌ Parece que el backend no tiene configurados los endpoints de Kick.')
    console.log('   Esto explicaría por qué la página está causando problemas de autenticación.')
  } else if (available < total) {
    console.log('\n⚠️  Algunos endpoints de Kick no están disponibles.')
    console.log('   La funcionalidad estará limitada.')
  } else {
    console.log('\n✅ Todos los endpoints de Kick están disponibles!')
  }
}

testAllEndpoints().catch(console.error)
