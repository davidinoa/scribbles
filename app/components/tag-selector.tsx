import { Check, Plus, X } from 'lucide-react'
import { useCallback, useState } from 'react'
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
import { Skeleton } from '~/components/ui/skeleton'
import { useTagSelector } from '~/lib/hooks/use-tag-selector'
import { cn } from '~/lib/utils'

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
  const [inputValue, setInputValue] = useState('')

  const {
    tags,
    isLoading,
    selectedTagIds,
    createTag: handleCreateTagRequest,
    toggleTag,
    removeTag,
  } = useTagSelector({
    initialSelectedTagIds: initialSelectedTags,
    onSelectedTagsChange: onChange,
  })

  // Check if we have all the label data for the selected tags
  const hasAllTagLabels = selectedTagIds.every((tagId) =>
    tags.some((tag) => tag.value === tagId),
  )

  // Only show skeleton if we don't have tag data yet
  const showSkeleton =
    isLoading || (selectedTagIds.length > 0 && !hasAllTagLabels)

  const handleSelect = (value: string) => {
    toggleTag(value)
    setInputValue('')
  }

  const handleCreateTag = useCallback(async () => {
    if (!inputValue.trim()) return

    const newTag = await handleCreateTagRequest(inputValue)
    if (newTag) {
      handleSelect(newTag.value)
    }

    setInputValue('')
  }, [inputValue, handleCreateTagRequest, handleSelect])

  const handleRemoveTag = (value: string) => {
    removeTag(value)
  }

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
              {showSkeleton ? (
                <div className="flex gap-1">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ) : selectedTagIds.length > 0 ? (
                selectedTagIds.map((value) => {
                  const tag = tags.find((tag) => tag.value === value)
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="mb-1 mr-1"
                    >
                      {tag?.label}
                      <button
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveTag(value)
                        }}
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
                <div className="space-y-2 p-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-5 w-3/5" />
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
                            selectedTagIds.includes(tag.value)
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
