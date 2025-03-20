import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState, type InputHTMLAttributes } from 'react'
import { cn } from '~/lib/utils'
import { Input } from './ui/input'

type SearchInputProps = {
  search: string
  placeholder?: string
} & InputHTMLAttributes<HTMLInputElement>

export function SearchInput({
  search,
  placeholder = 'Search by title, content, or tags...',
  ...props
}: SearchInputProps) {
  const navigate = useNavigate({
    from: '/',
  })

  const [searchDraft, setSearchDraft] = useState(search)

  useEffect(() => {
    setSearchDraft(search)
  }, [search])

  useEffect(() => {
    navigate({
      search: (old) => ({
        ...old,
        filterBy: searchDraft || undefined,
      }),
      replace: true,
    })
  }, [searchDraft])

  return (
    <Input
      type="search"
      value={searchDraft}
      placeholder={placeholder}
      className={cn(props.className)}
      onChange={(e) => setSearchDraft(e.target.value)}
    />
  )
}
