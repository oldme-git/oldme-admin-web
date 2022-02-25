<template>
  <admin-details :is-edit="true" />
</template>

<script>
import AdminDetails from "./components/details"

export default {
  name: "AdminEdit",
  components: { AdminDetails }
}
</script>

