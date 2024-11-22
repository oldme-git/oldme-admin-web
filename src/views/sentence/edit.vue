<template>
  <sentence :is-edit="true" />
</template>

<script>
import Sentence from "./components/details"

export default {
  name: "SentenceEdit",
  components: { Sentence }
}
</script>

