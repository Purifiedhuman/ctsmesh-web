'use client'

import { useEffect, useState } from 'react'
import BreadCrumb from '@/components/breadcrumb'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TweetsInfo } from '@/components/TweetsInfo'
const breadcrumbItems = [{ title: 'Alpha', link: '/dashboard/kanban' }]

export default function Page() {

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading title="Alpha Timeline" description="Get all the alpha votes" />
      </div>
      <TweetsInfo />
    </div>
  )
}