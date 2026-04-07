// CSPT SINK: Composable wrapping $fetch with path construction
// Any user-controlled input passed to get/post methods flows into the URL
export const useApiService = () => ({
  get: (path: string) => $fetch(`/api${path}`),
  post: (path: string, body: any) => $fetch(`/api${path}`, { method: 'POST', body }),
})
