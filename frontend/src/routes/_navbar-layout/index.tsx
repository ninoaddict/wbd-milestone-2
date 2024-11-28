import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_navbar-layout/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="p-2 min-h-screen bg-[#f4f2ee]">
      <h3>Welcome Home!</h3>
    </div>
  )
}
