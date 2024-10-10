import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TweetTimeline } from '@/components/TweetTimeline'

export default function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Cook Recipe
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="overview">Featured Tweets</TabsTrigger>
            <TabsTrigger value="analytics">
              {/* Analytics */}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <TweetTimeline />
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            {/* Add your analytics content here */}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}