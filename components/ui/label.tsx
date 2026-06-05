"use client";

import * as React from "react";

function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`text-sm font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${className ?? ""}`}
      {...props}
    />
  );
}

export { Label };
