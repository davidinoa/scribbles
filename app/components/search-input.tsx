import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Input } from './ui/input'

export function SearchInput({ search }: { search: string }) {
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
      placeholder="Search by title, content, or tags..."
      value={searchDraft}
      onChange={(e) => setSearchDraft(e.target.value)}
    />
  )
}
