<template>
  <admin-group-details :is-edit="true" />
</template>

<script>
import AdminGroupDetails from '@/views/admin-group/components/details'

export default {
  name: "AdminGroupEdit",
  components: { AdminGroupDetails }
}
</script>

