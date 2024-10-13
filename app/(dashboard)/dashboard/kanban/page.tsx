'use client'

import { useEffect, useState } from 'react'
import BreadCrumb from '@/components/breadcrumb'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TweetsInfo } from '@/components/TweetsInfo'
const breadcrumbItems = [{ title: 'Secret', link: '/dashboard/secret' }]

export default function Page() {

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading title="Secret Cook Recipe" description="Get all the alpha votes" />
      </div>
      <TweetsInfo />
    </div>
  )
}