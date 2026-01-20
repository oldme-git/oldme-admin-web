<template>
  <reading-details :is-edit="false" />
</template>

<script>
import ReadingDetails from "./components/details"
export default {
  name: "ReadingAdd",
  components: { ReadingDetails }
}
</script>
