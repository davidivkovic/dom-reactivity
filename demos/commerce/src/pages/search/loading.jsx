import Grid from "components/grid"

const items = Array(12).fill(0)

export default function Loading() {
  return (
    <Grid class="sm:grid-cols-2 lg:grid-cols-3">
      {items.map(() => (
        <Grid.Item
          class="animate-pulse bg-neutral-100 dark:bg-neutral-900"
        />
      ))}
    </Grid>
  )
}