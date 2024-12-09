import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-10 w-[250px]" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-4">
        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {/* Profile Section */}
              <Card className="md:col-span-1">
                <CardHeader className="border-b">
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="mt-4 h-4 w-[150px]" />
                    <Skeleton className="mt-2 h-3 w-[100px]" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-[100px]" />
                      <Skeleton className="h-3 w-[50px]" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-[120px]" />
                      <Skeleton className="h-3 w-[50px]" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-[80px]" />
                      <Skeleton className="h-3 w-[50px]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts Feed */}
              <div className="space-y-4 md:col-span-2">
                {/* Create Post Card */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <Skeleton className="h-12 flex-1 rounded-full" />
                    </div>
                  </CardContent>
                </Card>

                {/* Post Cards */}
                {[1, 2, 3].map((post) => (
                  <Card key={post}>
                    <CardHeader>
                      <div className="flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-[200px] w-full rounded-md" />
                      <div className="flex gap-4 pt-4">
                        <Skeleton className="h-8 w-12" />
                        <Skeleton className="h-8 w-12" />
                        <Skeleton className="h-8 w-12" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-4 md:col-span-1">
                {/* News Card */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-5 w-[150px]" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3, 4, 5].map((news) => (
                      <div key={news} className="flex gap-2">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Suggestions Card */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-5 w-[180px]" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3].map((suggestion) => (
                      <div key={suggestion} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-3 w-[120px]" />
                          <Skeleton className="h-3 w-[90px]" />
                        </div>
                        <Skeleton className="h-8 w-16 rounded-full" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
