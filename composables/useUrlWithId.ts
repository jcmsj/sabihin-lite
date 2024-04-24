export function useUrlWithId(host:Ref<string>|string, path:string, id:Ref<string | undefined>) {
  const _host = toRef(host)
  const url = computed(() => `${_host.value}/${path}/${id.value ?? ''}`)
  return { url }
}
