import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Skeleton } from "./skeleton";

export const SkeletonCard = () => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardHeader>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
    <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
      <Skeleton className="h-10 w-full sm:w-[100px]" />
      <Skeleton className="h-10 w-full sm:w-[100px]" />
      <Skeleton className="h-10 w-full sm:w-[100px]" />
    </CardFooter>
  </Card>
);
