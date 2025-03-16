import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { createTag } from '~/lib/server-fns/create-tag'
import { fetchTagOptions } from '~/lib/server-fns/fetch-tag-options'

type TagOption = {
  value: string
  label: string
}

type UseTagSelectorOptions = {
  initialSelectedTagIds?: string[]
  onSelectedTagsChange?: (selectedTagIds: string[]) => void
}

/**
 * useTagSelector - A custom hook for managing tag selection in the TagSelector component
 *
 * This hook provides state management and operations for a tag selection interface.
 * It handles fetching available tags, tracking selected tags, and providing
 * methods to modify the selection.
 *
 * @param {Object} options - Configuration options
 * @param {string[]} [options.initialSelectedTagIds=[]] - Initially selected tag IDs
 * @param {Function} [options.onSelectedTagsChange] - Callback triggered when selected tags change
 *
 * @returns {Object} The tag selection state and actions
 * @returns {TagOption[]} returns.tags - Available tags with value/label pairs
 * @returns {string[]} returns.selectedTagIds - Currently selected tag IDs
 * @returns {boolean} returns.isLoading - Whether tags are currently loading
 * @returns {Function} returns.createTag - Create a new tag with the given name
 * @returns {Function} returns.addTag - Add a tag to the selection
 * @returns {Function} returns.removeTag - Remove a tag from the selection
 * @returns {Function} returns.toggleTag - Toggle a tag's selection state
 *
 * @example
 * ```tsx
 * const {
 *   tags,
 *   selectedTagIds,
 *   isLoading,
 *   createTag,
 *   toggleTag,
 *   removeTag
 * } = useTagSelector({
 *   initialSelectedTagIds: ['tag-1', 'tag-2'],
 *   onSelectedTagsChange: (selectedIds) => console.log(selectedIds)
 * });
 * ```
 */
export function useTagSelector({
  initialSelectedTagIds = [],
  onSelectedTagsChange,
}: UseTagSelectorOptions = {}) {
  const queryClient = useQueryClient()

  // Fetch all available tags
  const tagsQuery = useQuery({
    queryKey: ['tag-options'],
    queryFn: fetchTagOptions,
  })

  const tags = tagsQuery.data ?? []

  // Get valid tags (those that exist in available tags)
  const getValidTags = useCallback(
    (tagIds: string[]) => {
      if (!tags.length) return []
      return tagIds.filter((tagId) => tags.some((tag) => tag.value === tagId))
    },
    [tags],
  )

  // Memoize the selectedTagIds based on initialSelectedTagIds and available tags
  const selectedTagIds = useMemo(() => {
    return getValidTags(initialSelectedTagIds)
  }, [initialSelectedTagIds, getValidTags, tags.length])

  // Update selected tags (external handler)
  const updateSelectedTags = useCallback(
    (newSelectedTagIds: string[]) => {
      onSelectedTagsChange?.(newSelectedTagIds)
    },
    [onSelectedTagsChange],
  )

  // Add a tag to selection
  const addTag = useCallback(
    (tagId: string) => {
      if (!selectedTagIds.includes(tagId)) {
        const newSelectedTags = [...selectedTagIds, tagId]
        updateSelectedTags(newSelectedTags)
      }
    },
    [selectedTagIds, updateSelectedTags],
  )

  // Remove a tag from selection
  const removeTag = useCallback(
    (tagId: string) => {
      if (selectedTagIds.includes(tagId)) {
        const newSelectedTags = selectedTagIds.filter((id) => id !== tagId)
        updateSelectedTags(newSelectedTags)
      }
    },
    [selectedTagIds, updateSelectedTags],
  )

  // Toggle a tag selection
  const toggleTag = useCallback(
    (tagId: string) => {
      const newSelectedTags = selectedTagIds.includes(tagId)
        ? selectedTagIds.filter((id) => id !== tagId)
        : [...selectedTagIds, tagId]
      updateSelectedTags(newSelectedTags)
    },
    [selectedTagIds, updateSelectedTags],
  )

  // Helper function to create a new tag
  const createNewTag = useCallback(
    async (name: string) => {
      if (!name.trim()) return null

      try {
        const exists = tags.some(
          (tag) =>
            tag.value.toLowerCase() === name.toLowerCase() ||
            tag.label.toLowerCase() === name.toLowerCase(),
        )

        if (!exists) {
          const newTag = await createTag({
            data: { name: name.trim() },
          })

          // Update cache with the new tag instead of refetching
          queryClient.setQueryData(['tags'], (oldData: TagOption[] = []) => [
            ...oldData,
            { value: newTag.value, label: newTag.label },
          ])

          return newTag
        } else {
          // Return existing tag if found
          return (
            tags.find(
              (tag) =>
                tag.label.toLowerCase() === name.toLowerCase() ||
                tag.value.toLowerCase() === name.toLowerCase(),
            ) || null
          )
        }
      } catch (error) {
        console.error('Error creating tag:', error)
        return null
      }
    },
    [tags, queryClient],
  )

  return {
    // Data
    tags,
    selectedTagIds,
    isLoading: tagsQuery.isLoading,

    // Actions
    createTag: createNewTag,
    addTag,
    removeTag,
    toggleTag,
  }
}
