import { Check, ChevronsUpDown, GripVertical, Plus, X } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { useCallback, useState, useEffect } from 'react'
import { fetchTagOptions } from '~/lib/server-fns/fetch-tag-options'
import { createTag } from '~/lib/server-fns/create-tag'

type TagSelectorProps = {
  tags?: { value: string; label: string }[]
  placeholder?: string
  emptyMessage?: string
  onChange?: (values: string[]) => void
  maxTags?: number
  allowCreation?: boolean
}

export function TagSelector({
  tags: propTags,
  placeholder = 'Search for an option...',
  emptyMessage = 'No tags found.',
  onChange,
  maxTags,
  allowCreation = true,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [tags, setTags] = useState<{ value: string; label: string }[]>(
    propTags || [],
  )
  const [isLoading, setIsLoading] = useState(!propTags)

  // Fetch tags from the database when the component mounts
  useEffect(() => {
    if (propTags) return
    const loadTags = async () => {
      try {
        setIsLoading(true)
        const fetchedTags = await fetchTagOptions()
        setTags(fetchedTags.length > 0 ? fetchedTags : [])
      } catch (error) {
        console.error('Error fetching tags:', error)
        setTags([])
      } finally {
        setIsLoading(false)
      }
    }
    loadTags()
  }, [propTags])

  // Update local tags state if prop tags change
  useEffect(() => {
    if (propTags) {
      setTags(propTags)
    }
  }, [propTags])

  const handleSelect = useCallback(
    (value: string) => {
      setSelectedTags((prev) => {
        if (prev.includes(value)) {
          return prev.filter((item) => item !== value)
        } else {
          if (maxTags && prev.length >= maxTags) {
            return prev
          }
          return [...prev, value]
        }
      })
      setInputValue('')
    },
    [maxTags],
  )

  const handleCreateTag = useCallback(async () => {
    if (!inputValue.trim()) return

    try {
      // Check if tag already exists in the current list
      const exists = tags.some(
        (tag) =>
          tag.value.toLowerCase() === inputValue.toLowerCase() ||
          tag.label.toLowerCase() === inputValue.toLowerCase(),
      )

      if (!exists) {
        // Create new tag in the database
        const newTag = await createTag({
          data: { name: inputValue.trim() },
        })

        // Add the new tag to the local state
        setTags((prevTags) => [...prevTags, newTag])

        // Select the new tag
        handleSelect(newTag.value)
      } else {
        // If tag exists, find and select it
        const existingTag = tags.find(
          (tag) =>
            tag.label.toLowerCase() === inputValue.toLowerCase() ||
            tag.value.toLowerCase() === inputValue.toLowerCase(),
        )
        if (existingTag) {
          handleSelect(existingTag.value)
        }
      }
    } catch (error) {
      console.error('Error creating tag:', error)
    }

    setInputValue('')
  }, [inputValue, tags, handleSelect])

  const handleRemoveTag = useCallback((value: string) => {
    setSelectedTags((prev) => prev.filter((item) => item !== value))
  }, [])

  useEffect(() => {
    if (onChange) {
      onChange(selectedTags)
    }
  }, [selectedTags, onChange])

  const filteredTags = tags.filter(
    (tag) =>
      tag.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      tag.value.toLowerCase().includes(inputValue.toLowerCase()),
  )

  const showCreateButton =
    allowCreation &&
    inputValue &&
    !filteredTags.some(
      (tag) =>
        tag.label.toLowerCase() === inputValue.toLowerCase() ||
        tag.value.toLowerCase() === inputValue.toLowerCase(),
    )

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10 p-0 border-none"
          >
            <div className="flex flex-wrap gap-1 py-1">
              {selectedTags.length > 0 ? (
                selectedTags.map((value) => {
                  const tag = tags.find((tag) => tag.value === value)
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="mr-1 mb-1"
                    >
                      {tag?.label}
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={() => handleRemoveTag(value)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  )
                })
              ) : (
                <span className="text-muted-foreground">
                  Select an option or create one
                </span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder}
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Loading tags...
                </div>
              ) : (
                <>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {filteredTags.map((tag) => (
                      <CommandItem
                        key={tag.value}
                        value={tag.value}
                        onSelect={handleSelect}
                      >
                        <div className="flex items-center">
                          <GripVertical className="mr-2 h-4 w-4 text-muted-foreground" />
                          {tag.label}
                        </div>
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedTags.includes(tag.value)
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
            {showCreateButton && (
              <div className="px-2 py-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleCreateTag}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create "{inputValue}"
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
