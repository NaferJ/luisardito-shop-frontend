import React, { useState, useRef, useEffect } from 'react'
import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  useColorModeValue,
  Icon
} from '@chakra-ui/react'
import { MdSearch, MdKeyboardArrowDown } from 'react-icons/md'
import { UserBadge, UserAvatarWithBadge } from '../components/UserBadge'
import { useCombobox } from 'downshift'

interface LeaderboardUser {
  usuario_id: number
  nickname: string
  puntos: number
  position: number
  position_change: number
  change_indicator: 'up' | 'down' | 'neutral' | 'new'
  previous_position: number | null
  previous_points: number | null
  is_vip: boolean
  is_subscriber: boolean
  kick_data: {
    avatar_url?: string
    username?: string
  } | null
  discord_info?: {
    linked: boolean
    id: string
    username: string
    discriminator: string
    avatar: string
    display_name: string
    linked_at: string
  }
}

interface SearchUserComboboxProps {
  users: LeaderboardUser[]
}

export const SearchUserCombobox: React.FC<SearchUserComboboxProps> = ({ users }) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const bgInput = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.300', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'gray.200')
  const secondaryText = useColorModeValue('gray.600', 'gray.400')
  const highlightColor = useColorModeValue('rgba(66, 153, 225, 0.1)', 'rgba(66, 153, 225, 0.2)')

  const filteredUsers = users.filter(user =>
    user.nickname.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 10) // Limitar a 10 resultados para rendimiento

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectItem,
    openMenu,
    closeMenu
  } = useCombobox({
    items: filteredUsers,
    itemToString: (item) => item?.nickname || '',
    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue || '')
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        handleSelectUser(selectedItem)
      }
    },
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: false,
            highlightedIndex: -1,
          }
        default:
          return changes
      }
    }
  })

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, closeMenu])

  const handleSelectUser = (user: LeaderboardUser) => {
    setInputValue('')
    // Scroll hacia el usuario
    const element = document.getElementById(`user-${user.usuario_id}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Resaltar temporalmente
      element.style.backgroundColor = highlightColor
      setTimeout(() => {
        element.style.backgroundColor = ''
      }, 2000)
    }
  }

  const handleInputFocus = () => {
    if (inputValue.length > 0) {
      openMenu()
    }
  }

  return (
    <Box position="relative" w="full" maxW="xs" ref={containerRef}>
      <Box>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={MdSearch} color={secondaryText} boxSize={5} />
          </InputLeftElement>
          <Input
            {...getInputProps({
              ref: inputRef,
              placeholder: "Buscar usuario en el ranking...",
              onFocus: handleInputFocus,
            })}
            bg={bgInput}
            borderColor={borderColor}
            _hover={{ borderColor: 'blue.400' }}
            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
            fontSize="sm"
            borderRadius="md"
            pr={10}
          />
          {inputValue && (
            <InputLeftElement right={2} pointerEvents="none">
              <Icon as={MdKeyboardArrowDown} color={secondaryText} boxSize={4} />
            </InputLeftElement>
          )}
        </InputGroup>
      </Box>

      <Box {...getMenuProps()}>
        {isOpen && filteredUsers.length > 0 && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            bg={bgInput}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            shadow="lg"
            zIndex={10}
            maxH="200px"
            overflowY="auto"
            mt={1}
          >
            <VStack spacing={0} align="stretch">
              {filteredUsers.map((user, index) => (
                <Box
                  key={user.usuario_id}
                  {...getItemProps({ item: user, index })}
                  px={4}
                  py={3}
                  bg={highlightedIndex === index ? highlightColor : 'transparent'}
                  _hover={{ bg: hoverBg }}
                  cursor="pointer"
                >
                  <HStack spacing={3} w="full">
                    <UserAvatarWithBadge
                      user={{
                        id: user.usuario_id,
                        email: '',
                        puntos: user.puntos,
                        rol_id: user.is_vip ? 5 : 1,
                        nickname: user.nickname,
                        discord_username: user.kick_data?.username,
                        user_type: user.is_subscriber
                          ? 'subscriber'
                          : user.is_vip
                            ? 'vip'
                            : 'regular',
                        vip_info: user.is_vip ? { is_active: true } : undefined,
                        subscriber_status: user.is_subscriber
                          ? { is_active: true, expires_soon: false }
                          : undefined
                      }}
                    >
                      <Avatar
                        size="sm"
                        name={user.nickname}
                        src={user.kick_data?.avatar_url}
                        bg="blue.500"
                      />
                    </UserAvatarWithBadge>
                    <VStack align="start" spacing={0} flex={1}>
                      <HStack spacing={2}>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>
                          {user.nickname}
                        </Text>
                        <UserBadge
                          user={{
                            id: user.usuario_id,
                            email: '',
                            puntos: user.puntos,
                            rol_id: user.is_vip ? 5 : 1,
                            nickname: user.nickname,
                            discord_username: user.kick_data?.username,
                            user_type: user.is_subscriber
                              ? 'subscriber'
                              : user.is_vip
                                ? 'vip'
                                : 'regular',
                            vip_info: user.is_vip ? { is_active: true } : undefined,
                            subscriber_status: user.is_subscriber
                              ? { is_active: true, expires_soon: false }
                              : undefined
                          }}
                          size="sm"
                          fontSize="2xs"
                          px={0}
                          py={0}
                          maxW="10px"
                        />
                      </HStack>
                      <Text fontSize="xs" color={secondaryText}>
                        Posición #{user.position} • {user.puntos.toLocaleString()} puntos
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </Box>
    </Box>
  )
}
