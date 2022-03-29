<template>
  <article-details :is-edit="true" />
</template>

<script>
import ArticleDetails from '@/views/article/components/details'

export default {
  name: "ArticleEdit",
  components: { ArticleDetails }
}
</script>

