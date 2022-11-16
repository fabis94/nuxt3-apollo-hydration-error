<script lang="ts">
import { h } from 'vue'
export default defineComponent({
  setup() {
    const { apiResult } = useTestQuery()

    return { apiResult }
  },
  render() {
    const strVal = `Hello, ${this.apiResult || 'UNDEFINED'}!`
    return h('div', strVal)
  }
})
</script>
