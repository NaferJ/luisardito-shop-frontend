import { useState, useRef, useEffect, useCallback } from 'react'
import { Box, Button, HStack, Image, Input, Progress, Text, VStack, useToast, useColorModeValue, Icon } from '@chakra-ui/react'
import { uploadImageToCloudinary } from '../utils/cloudinary'
import { ArrowUpIcon } from '@chakra-ui/icons'

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
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  // Sync when parent provides/changes value (e.g., edit page loads existing image)
  useEffect(() => {
    setPreview(value || null)
  }, [value])

  const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300')
  const hoverBorder = useColorModeValue('blue.300', 'cyan.400')
  const bgIdle = useColorModeValue('gray.50', 'whiteAlpha.100')
  const bgDragging = useColorModeValue('blue.50', 'whiteAlpha.200')
  const hintColor = useColorModeValue('gray.600', 'gray.300')
  const mutedColor = useColorModeValue('gray.500', 'gray.400')

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      toast({ title: 'Formato no soportado', description: 'Usa JPG, PNG, WEBP o GIF', status: 'error' })
      return false
    }
    const maxBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      toast({ title: 'Archivo demasiado grande', description: `Máximo ${maxSizeMB}MB`, status: 'error' })
      return false
    }
    return true
  }

  const startUpload = async (file: File) => {
    if (!validateFile(file)) return
    setIsUploading(true)
    setProgress(0)
    try {
      const res = await uploadImageToCloudinary(file, { folder, onProgress: setProgress })
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

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) startUpload(file)
  }

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!isUploading) setIsDragging(true)
  }, [isUploading])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (isDragging) setIsDragging(false)
  }, [isDragging])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false)
    if (isUploading) return
    const file = e.dataTransfer.files?.[0]
    if (file) startUpload(file)
  }, [isUploading])

  const triggerFile = () => {
    if (!isUploading) fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
  }

  return (
    <VStack align="stretch" spacing={2}>
      <Text fontWeight="semibold">{label}</Text>

      {/* Dropzone / Preview */}
      {preview ? (
        <VStack align="stretch" spacing={2}>
          <Box borderRadius="md" overflow="hidden" borderWidth="1px" borderColor={borderColor} bg={useColorModeValue('gray.100','whiteAlpha.100')}>
            <Image src={preview} alt="Preview" w="100%" h="200px" objectFit="contain" objectPosition="center" fallbackSrc="/no-image.png" />
          </Box>
          <Text fontSize="xs" color={hintColor} isTruncated title={preview}>{preview}</Text>
          <HStack>
            <Button size="sm" variant="outline" onClick={triggerFile} isDisabled={isUploading}>Reemplazar</Button>
            <Button size="sm" variant="ghost" colorScheme="red" onClick={handleRemove} isDisabled={isUploading}>Quitar</Button>
          </HStack>
        </VStack>
      ) : (
        <Box
          role="button"
          tabIndex={0}
          onClick={triggerFile}
          onKeyDown={(e:any)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); triggerFile() } }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          borderWidth="2px"
          borderStyle="dashed"
          borderColor={isDragging ? hoverBorder : borderColor}
          bg={isDragging ? bgDragging : bgIdle}
          borderRadius="md"
          p={8}
          textAlign="center"
          transition="all 0.2s ease"
          _hover={{ borderColor: hoverBorder }}
          cursor={isUploading ? 'not-allowed' : 'pointer'}
        >
          <VStack spacing={2}>
            <Icon as={ArrowUpIcon} boxSize={10} color={mutedColor} />
            <Text fontSize="sm" color={hintColor}>
              <Text as="span" fontWeight="semibold">Haz clic para subir</Text> o arrastra y suelta
            </Text>
            <Text fontSize="xs" color={mutedColor}>Formatos: JPG, PNG, WEBP, GIF. Tamaño máx: {maxSizeMB}MB</Text>
          </VStack>
          <Input ref={fileInputRef} type="file" accept="image/*" onChange={onInputChange} display="none" />
        </Box>
      )}

      {/* Progress */}
      {isUploading && (
        <Box pt={1}>
          <Progress value={progress} size="sm" colorScheme="blue" borderRadius="full" />
          <Text fontSize="xs" color={mutedColor} mt={1}>{progress}%</Text>
        </Box>
      )}
    </VStack>
  )
}
