import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export function LatestProjectSkeleton() {
  return (
    <Card className="w-full pb-1 pt-1 min-h-min border border-border/50 rounded-lg mt-1 bg-card">
      <CardHeader className="flex justify-between -ml-3">
        <CardTitle className="text-md">Recently Updated Projects</CardTitle>
        <Badge variant="outline" className="text-sm -mr-3">
          <Skeleton className="h-4 w-4 rounded" />
        </Badge>
      </CardHeader>

      <ScrollArea className="w-full pr-1">
        <CardContent className="max-h-[198px] p-0 -mt-1">
          <div className="flex flex-col gap-2 p-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card
                key={i}
                className="border rounded-md p-2 relative bg-muted/20"
              >
                <CardContent className="p-0">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>

                    <Skeleton className="h-4 w-4 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
