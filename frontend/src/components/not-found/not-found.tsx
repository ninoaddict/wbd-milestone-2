import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f2ee] p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6 md:p-12 flex flex-col items-center text-center">
          <div className="w-full max-w-xs mx-auto mb-8">
            <div className="aspect-square relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-muted to-muted/50 rounded-full flex items-center justify-center">
                <Search className="h-24 w-24 text-muted-foreground/40" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Page not found
          </h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The
            page may have been removed or the link you followed might be broken.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild>
              <Link to="/">Go to home page</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
