import React, { useMemo, useState } from 'react'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select as ChakraSelect,
  HStack,
  Text,
  Button,
  useColorModeValue,
  Spacer
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from '@chakra-ui/icons'

export type DataType = 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object' | 'unknown'

export interface ColumnConfig<T = unknown> {
  key: string
  label: string
  type?: DataType
  sortable?: boolean
  filterable?: boolean
  format?: (value: unknown, row: T) => React.ReactNode
  render?: (row: T) => React.ReactNode
}

export interface AdminDynamicTableProps<T = unknown> {
  data: T[]
  columns: ColumnConfig<T>[]
  pageSizeOptions?: number[]
  defaultPageSize?: number
  searchable?: boolean
  showFilters?: boolean
  actionsRightSlot?: React.ReactNode
}

function detectType(value: unknown): DataType {
  if (value === null || value === undefined) return 'unknown'
  if (Array.isArray(value)) return 'array'
  if (value instanceof Date) return 'date'
  const t = typeof value
  if (t === 'string') {
    const datePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/
    if (datePattern.test(value) && !isNaN(Date.parse(value))) return 'date'
    return 'string'
  }
  if (t === 'number') return 'number'
  if (t === 'boolean') return 'boolean'
  if (t === 'object') return 'object'
  return 'unknown'
}

export default function AdminDynamicTable<T = unknown>({
  data = [],
  columns,
  pageSizeOptions = [5, 10, 20, 50, 100],
  defaultPageSize = 10,
  searchable = true,
  showFilters = true,
  actionsRightSlot
}: AdminDynamicTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [filters, setFilters] = useState<Record<string, unknown>>({})

  const headerBg = useColorModeValue('gray.50', 'whiteAlpha.100')
  const borderClr = useColorModeValue('blackAlpha.200', 'whiteAlpha.300')
  const searchIconColor = useColorModeValue('gray.400', 'gray.500')
  const emptyColor = useColorModeValue('gray.500', 'gray.400')
  const pagTextColor = useColorModeValue('gray.600', 'gray.300')

  const autoColumns = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      type:
        col.type ||
        detectType((data[0] as Record<string, unknown> | undefined)?.[col.key as string]) ||
        'string',
      sortable: col.sortable ?? true,
      filterable: col.filterable ?? true
    }))
  }, [columns, data])

  const onSortClick = (key: string, sortable?: boolean) => {
    if (!sortable) return
    if (sortKey === key) {
      // toggle asc -> desc -> none
      if (sortDir === 'asc') {
        setSortDir('desc')
      } else {
        setSortKey(null)
      }
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  const filtered = useMemo(() => {
    let rows = [...data]

    // Global search across all primitive values for the row
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter((row) => {
        return autoColumns.some((col) => {
          if (col.render) return false // skip action-only columns
          const v = (row as Record<string, unknown>)[col.key as string]
          if (v === null || v === undefined) return false
          if (Array.isArray(v)) return v.join(',').toLowerCase().includes(q)
          return String(v).toLowerCase().includes(q)
        })
      })
    }

    // Per-column filters
    const activeKeys = Object.keys(filters).filter(
      (k) => filters[k] !== undefined && filters[k] !== ''
    )
    if (activeKeys.length) {
      rows = rows.filter((row) => {
        return activeKeys.every((k) => {
          const col = autoColumns.find((c) => c.key === k)
          if (!col) return true
          const v = (row as Record<string, unknown>)[k]
          const f = (filters as Record<string, unknown>)[k]
          const type = col.type || detectType(v)
          if (f === undefined || f === '') return true
          switch (type) {
            case 'number':
              return Number(v) === Number(f)
            case 'boolean':
              if (f === 'all') return true
              return String(v) === f
            case 'date':
              try {
                const d = new Date(v as string | number | Date)
                const fDate = new Date(f as string | number | Date)
                return d.toDateString() === fDate.toDateString()
              } catch {
                return false
              }
            case 'array':
              return (
                Array.isArray(v) &&
                String((v as unknown[]).join(','))
                  .toLowerCase()
                  .includes(String(f).toLowerCase())
              )
            default:
              return String(v ?? '')
                .toLowerCase()
                .includes(String(f).toLowerCase())
          }
        })
      })
    }

    // Sorting
    if (sortKey) {
      const col = autoColumns.find((c) => c.key === sortKey)
      rows.sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey as string]
        const bv = (b as Record<string, unknown>)[sortKey as string]
        if (av == null && bv == null) return 0
        if (av == null) return sortDir === 'asc' ? -1 : 1
        if (bv == null) return sortDir === 'asc' ? 1 : -1
        const type = col?.type || detectType(av)
        if (type === 'number') {
          return sortDir === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av)
        }
        if (type === 'date') {
          return sortDir === 'asc'
            ? new Date(av as string | number | Date).getTime() -
                new Date(bv as string | number | Date).getTime()
            : new Date(bv as string | number | Date).getTime() -
                new Date(av as string | number | Date).getTime()
        }
        const sa = String(av).toLowerCase()
        const sb = String(bv).toLowerCase()
        return sortDir === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa)
      })
    }

    return rows
  }, [data, search, filters, sortKey, sortDir, autoColumns])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const resetFilters = () => {
    setFilters({})
    setSearch('')
    setSortKey(null)
    setPage(1)
  }

  return (
    <Box>
      <HStack mb={3} gap={2} align="center">
        {searchable && (
          <HStack flex={1} maxW="600px" gap={2}>
            <Box position="relative" flex={1}>
              <SearchIcon position="absolute" top={2.5} left={3} color={searchIconColor} />
              <Input
                pl={8}
                placeholder="Buscar..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </Box>
            {(search || Object.keys(filters).length) && (
              <Button variant="ghost" onClick={resetFilters}>
                Limpiar
              </Button>
            )}
          </HStack>
        )}
        <Spacer />
        {actionsRightSlot}
      </HStack>

      <Box borderWidth="1px" borderColor={borderClr} borderRadius="md" overflowX="auto">
        <Table size="sm">
          <Thead bg={headerBg}>
            <Tr>
              {autoColumns.map((col) => (
                <Th
                  key={col.key}
                  onClick={() => onSortClick(col.key, col.sortable)}
                  cursor={col.sortable ? 'pointer' : 'default'}
                  userSelect="none"
                >
                  <HStack>
                    <Text>{col.label}</Text>
                    {sortKey === col.key ? (
                      sortDir === 'asc' ? (
                        <ChevronUpIcon boxSize={4} />
                      ) : (
                        <ChevronDownIcon boxSize={4} />
                      )
                    ) : null}
                  </HStack>
                </Th>
              ))}
            </Tr>
            {showFilters && (
              <Tr>
                {autoColumns.map((col) => (
                  <Th key={`filter-${col.key}`}>
                    {col.filterable === false ? null : col.type === 'boolean' ? (
                      <ChakraSelect
                        size="xs"
                        value={filters[col.key] ?? 'all'}
                        onChange={(e) => {
                          const v = e.target.value
                          setFilters((prev) => ({ ...prev, [col.key]: v }))
                          setPage(1)
                        }}
                      >
                        <option value="all">Todos</option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </ChakraSelect>
                    ) : col.type === 'date' ? (
                      <Input
                        size="xs"
                        type="date"
                        value={filters[col.key] ?? ''}
                        onChange={(e) => {
                          const v = e.target.value
                          setFilters((prev) => ({ ...prev, [col.key]: v }))
                          setPage(1)
                        }}
                      />
                    ) : (
                      <Input
                        size="xs"
                        placeholder={`Filtrar ${col.label}`}
                        value={filters[col.key] ?? ''}
                        onChange={(e) => {
                          const v = e.target.value
                          setFilters((prev) => ({ ...prev, [col.key]: v }))
                          setPage(1)
                        }}
                      />
                    )}
                  </Th>
                ))}
              </Tr>
            )}
          </Thead>
          <Tbody>
            {pageRows.map((row, ri) => (
              <Tr key={ri}>
                {autoColumns.map((col) => (
                  <Td key={`${ri}-${col.key}`}>
                    {(() => {
                      const cellValue = (row as Record<string, unknown>)[col.key as string]
                      if (col.render) return col.render(row as T)
                      if (col.format) return col.format(cellValue, row as T)
                      const v = cellValue as unknown
                      if (v === null || v === undefined) return null
                      if (col.type === 'array')
                        return Array.isArray(v) ? (v as unknown[]).join(', ') : String(v)
                      if (col.type === 'object') return JSON.stringify(v)
                      if (col.type === 'date') {
                        const d = new Date(v as string | number | Date)
                        return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString()
                      }
                      return String(v)
                    })()}
                  </Td>
                ))}
              </Tr>
            ))}
            {pageRows.length === 0 && (
              <Tr>
                <Td colSpan={autoColumns.length}>
                  <Box p={6} textAlign="center" color={emptyColor}>
                    Sin resultados
                  </Box>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      <HStack justify="space-between" mt={3} flexWrap="wrap" gap={3}>
        <HStack>
          <Text fontSize="sm" color={pagTextColor}>
            Mostrar
          </Text>
          <ChakraSelect
            size="sm"
            value={String(pageSize)}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value, 10))
              setPage(1)
            }}
            w="80px"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </ChakraSelect>
          <Text fontSize="sm" color={pagTextColor}>
            por página
          </Text>
        </HStack>
        <Text fontSize="sm" color={pagTextColor}>
          Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, filtered.length)} de{' '}
          {filtered.length}
        </Text>
        <HStack>
          <Button size="sm" variant="outline" onClick={() => setPage(1)} isDisabled={page === 1}>
            «
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            isDisabled={page === 1}
          >
            ‹
          </Button>
          <Text fontSize="sm">
            {page} / {totalPages}
          </Text>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            isDisabled={page === totalPages}
          >
            ›
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(totalPages)}
            isDisabled={page === totalPages}
          >
            »
          </Button>
        </HStack>
      </HStack>
    </Box>
  )
}
