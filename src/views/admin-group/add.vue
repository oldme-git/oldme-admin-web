<template>
  <admin-group-details  :is-edit="false" />
</template>

<script>
  import AdminGroupDetails from "./components/details"
  export default {
    name: "AdminGroupAdd",
    components: { AdminGroupDetails }
  }
</script>
