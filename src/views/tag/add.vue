<template>
  <tag-details :is-edit="false" />
</template>

<script>
import TagDetails from "./components/details"
export default {
  name: "TagAdd",
  components: { TagDetails }
}
</script>
