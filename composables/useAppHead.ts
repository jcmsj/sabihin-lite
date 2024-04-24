/**
 * Should be run once in @see app.vue
 * separated this for the future
 */
export function useAppHead(title='Sabihin Lite') {
  
  return useHead({
    /**
     * @see https://nuxt.com/docs/getting-started/seo-meta#title-template
     */
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} | ${title}` : `${title}`;
    },
  });
}
