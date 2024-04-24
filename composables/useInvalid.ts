export default function useInvalid() {
    const isInvalid = ref(false);
    return {
        isInvalid,
        onInput(e: Event) {
            isInvalid.value = !(e.target as HTMLInputElement).checkValidity();
        }
    }
}
