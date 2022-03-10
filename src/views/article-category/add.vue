<template>
  <article-category-details :is-edit="false" />
</template>

<script>
  import ArticleCategoryDetails from "./components/details"
  export default {
    name: "ArticleCategoryAdd",
    components: { ArticleCategoryDetails }
  }
</script>
