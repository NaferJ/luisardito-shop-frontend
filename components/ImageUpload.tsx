import { useState, useRef } from 'react'
import { Box, Button, HStack, Image, Input, Progress, Text, VStack, useToast } from '@chakra-ui/react'
import { uploadImageToCloudinary } from '../utils/cloudinary'

interface ImageUploadProps {
  label?: string
  value?: string | null
  onChange: (url: string | null) => void
  folder?: string
  maxSizeMB?: number
}

export default function ImageUpload({
  label = 'Imagen del producto',
  value,
  onChange,
  folder = 'luisardito-shop/productos',
  maxSizeMB = 5
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validaciones
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      toast({ title: 'Formato no soportado', description: 'Usa JPG, PNG, WEBP o GIF', status: 'error' })
      return
    }

    const maxBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      toast({ title: 'Archivo demasiado grande', description: `Máximo ${maxSizeMB}MB`, status: 'error' })
      return
    }

    setIsUploading(true)
    setProgress(0)

    try {
      const res = await uploadImageToCloudinary(file, {
        folder,
        onProgress: setProgress
      })
      const url = res.secure_url || res.url
      setPreview(url)
      onChange(url)
      toast({ title: 'Imagen subida', status: 'success' })
    } catch (err: any) {
      const msg = err?.message || 'No se pudo subir la imagen'
      toast({ title: 'Error al subir', description: msg, status: 'error' })
    } finally {
      setIsUploading(false)
      setProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
  }

  return (
    <VStack align="stretch" spacing={2}>
      <Text fontWeight="semibold">{label}</Text>

      {preview ? (
        <HStack spacing={3} align="center">
          <Box boxSize="96px" borderRadius="md" overflow="hidden" borderWidth="1px">
            <Image src={preview} alt="Preview" boxSize="96px" objectFit="cover" />
          </Box>
          <VStack align="start" spacing={2} flex="1">
            <Text fontSize="sm" color="gray.600" isTruncated>{preview}</Text>
            <HStack>
              <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} isDisabled={isUploading}>
                Cambiar
              </Button>
              <Button size="sm" colorScheme="red" variant="ghost" onClick={handleRemove} isDisabled={isUploading}>
                Quitar
              </Button>
            </HStack>
          </VStack>
        </HStack>
      ) : (
        <HStack>
          <Input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button onClick={() => fileInputRef.current?.click()} isDisabled={isUploading}>
            Seleccionar
          </Button>
        </HStack>
      )}

      {isUploading && (
        <Box pt={1}>
          <Progress value={progress} size="sm" colorScheme="blue" />
          <Text fontSize="xs" color="gray.500" mt={1}>{progress}%</Text>
        </Box>
      )}

      <Text fontSize="xs" color="gray.500">Formatos: JPG, PNG, WEBP, GIF. Tamaño máx: {maxSizeMB}MB</Text>
    </VStack>
  )
}
