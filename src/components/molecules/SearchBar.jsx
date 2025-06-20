import { useState, useEffect } from 'react'
import Input from '@/components/atoms/Input'
import { useSearchParams } from 'react-router-dom'

const SearchBar = ({ placeholder = "Search tasks...", onSearch }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (searchParams.get('search') || '')) {
        const params = new URLSearchParams(searchParams)
        if (searchTerm) {
          params.set('search', searchTerm)
        } else {
          params.delete('search')
        }
        setSearchParams(params)
      }
      onSearch?.(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, searchParams, setSearchParams, onSearch])

  return (
    <div className="w-full max-w-sm">
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon="Search"
        className="bg-surface-50 border-surface-200 focus:bg-white"
      />
    </div>
  )
}

export default SearchBar