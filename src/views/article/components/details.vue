<template>
  <div class="post-container">
    <tinymce v-model="content" :height="300" />
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  name: 'ArticleDetails',
  components: { Tinymce },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: `
        <p>123</p>
      `
    }
  },
}
</script>
