<template>
  <tag-details :is-edit="true" />
</template>

<script>
import TagDetails from "./components/details"

export default {
  name: "TagEdit",
  components: { TagDetails }
}
</script>

