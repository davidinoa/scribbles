import { Check, Plus, X } from 'lucide-react'
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
import { useQuery } from '@tanstack/react-query'

type TagSelectorProps = {
  placeholder?: string
  emptyMessage?: string
  onChange?: (values: string[]) => void
  initialSelectedTags?: string[]
}

export function TagSelector({
  placeholder = 'Search for an option...',
  emptyMessage = 'No tags found.',
  onChange,
  initialSelectedTags = [],
}: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedTags, setSelectedTags] =
    useState<string[]>(initialSelectedTags)
  const [inputValue, setInputValue] = useState('')

  // Update selectedTags when initialSelectedTags changes
  useEffect(() => {
    if (initialSelectedTags.length > 0) {
      setSelectedTags(initialSelectedTags)
    }
  }, [initialSelectedTags])

  const tagsQuery = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTagOptions,
  })

  const tags = tagsQuery.data ?? []
  const isLoading = tagsQuery.isLoading

  // Update selected tags when tags data is loaded
  useEffect(() => {
    if (!isLoading && tags.length > 0 && initialSelectedTags.length > 0) {
      // Make sure all initialSelectedTags exist in the available tags
      const validTags = initialSelectedTags.filter((tagId) =>
        tags.some((tag) => tag.value === tagId),
      )
      if (validTags.length > 0) {
        setSelectedTags(validTags)
      }
    }
  }, [isLoading, tags, initialSelectedTags])

  const handleSelect = (value: string) => {
    const newSelectedTags = selectedTags.includes(value)
      ? selectedTags.filter((item) => item !== value)
      : [...selectedTags, value]
    setSelectedTags(newSelectedTags)
    onChange?.(newSelectedTags)
    setInputValue('')
  }

  const handleCreateTag = useCallback(async () => {
    if (!inputValue.trim()) return
    try {
      const exists = tags.some(
        (tag) =>
          tag.value.toLowerCase() === inputValue.toLowerCase() ||
          tag.label.toLowerCase() === inputValue.toLowerCase(),
      )

      if (!exists) {
        const newTag = await createTag({
          data: { name: inputValue.trim() },
        })

        tagsQuery.refetch()
        handleSelect(newTag.value)
      } else {
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

  const handleRemoveTag = useCallback(
    (value: string) => {
      const newSelectedTags = selectedTags.filter((item) => item !== value)
      setSelectedTags(newSelectedTags)
      // Ensure the onChange callback is called with the updated tags
      if (onChange) {
        onChange(newSelectedTags)
      }
    },
    [selectedTags, onChange],
  )

  const filteredTags = tags.filter(
    (tag) =>
      tag.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      tag.value.toLowerCase().includes(inputValue.toLowerCase()),
  )

  const showCreateButton =
    inputValue &&
    !filteredTags.some(
      (tag) =>
        tag.label.toLowerCase() === inputValue.toLowerCase() ||
        tag.value.toLowerCase() === inputValue.toLowerCase(),
    )

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-10 w-full justify-between border-none p-0 shadow-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
          >
            <div className="flex flex-wrap gap-1 py-1">
              {selectedTags.length > 0 ? (
                selectedTags.map((value) => {
                  const tag = tags.find((tag) => tag.value === value)
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="mb-1 mr-1"
                    >
                      {tag?.label || value}
                      <button
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                        {tag.label}
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
              <div className="border-t px-2 py-2">
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
