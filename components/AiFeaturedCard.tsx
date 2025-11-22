import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquareText, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AiFeatureCard() {
  return (
    <Card className="h-full w-full pb-4.5 flex flex-col justify-between overflow-hidden relative border-primary/20 bg-linear-to-br from-background via-background to-primary/5 hover:shadow-md transition-all duration-300 group">
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors blur-2xl" />

      <CardHeader>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 text-primary group-hover:scale-110 transition-transform duration-300">
          <Sparkles size={20} />
        </div>
        <CardTitle className="flex items-center gap-2 text-lg">
          AI Assistant
        </CardTitle>
        <CardDescription>
          Stuck on a project? Ask our AI model to generate ideas or summarize
          tasks.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Visual filler representing a chat bubble */}
        <div className="flex flex-col gap-2 opacity-50">
          <div className="h-2 w-3/4 bg-muted rounded-full animate-pulse" />
          <div className="h-2 w-1/2 bg-muted rounded-full animate-pulse delay-75" />
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full gap-2 group-hover:gap-3 transition-all"
          asChild
        >
          <Link href="/chatai">
            <MessageSquareText size={16} />
            Start Chat
            <ArrowRight
              size={16}
              className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all"
            />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
