"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import CopyButton from "@/components/CopyText";
import { useState } from "react";
export function QuickNoteCard() {
  const [note, setnote] = useState("");
  return (
    <Card className="h-full w-full px-2 py-4 flex flex-col bg-card hover:border-primary/50 transition-colors">
      <CardHeader className="relative group  pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-md font-medium text-muted-foreground">
          Quick Scratchpad
        </CardTitle>

        <CopyButton text={note} />
      </CardHeader>

      <CardContent className="flex-1 px-2 pb-1">
        <div className="relative h-full">
          <Textarea
            value={note}
            onChange={(e) => setnote(e.target.value)}
            placeholder="Type a quick note, idea, or reminder here..."
            className="h-full min-h-[150px] w-full resize-none border-0 bg-muted/30 focus-visible:ring-0 focus-visible:bg-muted/50 p-2 text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
