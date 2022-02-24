<template>
  <admin-details  :is-edit="false" />
</template>

<script>
  import AdminDetails from "./components/details"
  export default {
    name: "AdminAdd",
    components: { AdminDetails }
  }
</script>
