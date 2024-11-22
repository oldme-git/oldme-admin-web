<template>
  <sentence :is-edit="false" />
</template>

<script>
import Sentence from "./components/details"
export default {
  name: "SentenceAdd",
  components: { Sentence }
}
</script>
