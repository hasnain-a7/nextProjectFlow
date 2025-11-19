"use client";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ElementType;
  color?: string;
}

export const StatsCard = ({
  title,
  value,

  icon: Icon,
  color = "bg-primary",
}: StatsCardProps) => {
  return (
    <Card
      className={cn(
        "rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.01] duration-300",
        color
      )}
    >
      <CardContent className="py-2 sm:p-3">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-white/90">
            {title}
          </h3>
          {Icon && (
            <div className="p-1.5 sm:p-2 bg-white/20 rounded-full">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
            </div>
          )}
        </div>
        <div className="text-2xl sm:text-4xl font-extrabold text-white mb-1 sm:mb-2">
          {value}
        </div>
      </CardContent>
    </Card>
  );
};
