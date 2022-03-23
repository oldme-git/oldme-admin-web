<template>
  <article-category-details :is-edit="true" />
</template>

<script>
import ArticleCategoryDetails from '@/views/article-category/components/details'

export default {
  name: "ArticleCategoryEdit",
  components: { ArticleCategoryDetails }
}
</script>

