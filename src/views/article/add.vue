<template>
  <article-details :is-edit="false" />
</template>

<script>
  import ArticleDetails from "./components/details"
  export default {
    name: "ArticleAdd",
    components: { ArticleDetails }
  }
</script>
