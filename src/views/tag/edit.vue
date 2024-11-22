<template>
  <tag-details :is-edit="true" />
</template>

<script>
import TagDetails from '@/views/tag/components/details'

export default {
  name: "TagEdit",
  components: { TagDetails }
}
</script>

