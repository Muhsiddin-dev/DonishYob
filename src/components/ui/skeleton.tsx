import { cn } from '@/lib/utils'

type SkeletonProps = React.ComponentProps<'div'>

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

function BookCardSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4 rounded-full" />
      <Skeleton className="h-3 w-1/2 rounded-full" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-3 w-14 rounded-full" />
      </div>
    </div>
  )
}

function BookDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[300px_1fr] items-start">
        <Skeleton className="h-72 w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 rounded-full" />
          <Skeleton className="h-5 w-1/2 rounded-full" />
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-5/6 rounded-full" />
          <Skeleton className="h-4 w-2/3 rounded-full" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  )
}

interface TableRowSkeletonProps {
  columns?: number
}

function TableRowSkeleton({ columns = 4 }: TableRowSkeletonProps) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4 whitespace-nowrap">
          <Skeleton className="h-4 w-full rounded-full" />
        </td>
      ))}
    </tr>
  )
}

export { Skeleton, BookCardSkeleton, BookDetailsSkeleton, TableRowSkeleton, type SkeletonProps }
