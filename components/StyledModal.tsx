import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalProps,
  useColorModeValue,
  HStack,
  VStack,
  Text,
  Avatar,
  Icon
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { IconType } from 'react-icons'

interface StyledModalProps extends Omit<ModalProps, 'children'> {
  title: string
  subtitle?: string
  icon?: IconType
  avatarSrc?: string
  avatarName?: string
  children: ReactNode
  footer?: ReactNode
}

export const StyledModal = ({
  title,
  subtitle,
  icon,
  avatarSrc,
  avatarName,
  children,
  footer,
  size = 'md',
  ...props
}: StyledModalProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Modal size={size} motionPreset="slideInBottom" isCentered {...props}>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" />
      <ModalContent mx={4} borderRadius="2xl" shadow="2xl" borderWidth="1px" borderColor={borderColor}>
        <ModalHeader pb={3} pt={5}>
          <HStack spacing={3}>
            {(avatarSrc || avatarName) && (
              <Avatar size="sm" name={avatarName} src={avatarSrc} />
            )}
            {icon && (
              <Icon as={icon} boxSize={5} color="blue.500" />
            )}
            <VStack align="start" spacing={0} flex={1}>
              <Text fontSize="lg" fontWeight="bold" lineHeight="shorter">
                {title}
              </Text>
              {subtitle && (
                <Text fontSize="sm" fontWeight="normal" color={mutedColor} lineHeight="shorter">
                  {subtitle}
                </Text>
              )}
            </VStack>
          </HStack>
        </ModalHeader>
        
        <ModalCloseButton top={5} right={4} />
        
        <ModalBody py={4}>{children}</ModalBody>
        
        {footer && <ModalFooter pt={2} gap={2}>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  )
}
