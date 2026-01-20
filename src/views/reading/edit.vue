<template>
  <reading-details :is-edit="true" />
</template>

<script>
import ReadingDetails from "./components/details"

export default {
  name: "ReadingEdit",
  components: { ReadingDetails }
}
</script>

