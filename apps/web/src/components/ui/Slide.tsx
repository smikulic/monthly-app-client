// src/components/ui/Slide.tsx
import React from "react";
import { Slide as MuiSlide, SlideProps } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

export const Slide = React.forwardRef<unknown, SlideProps>((props, ref) => (
  <MuiSlide ref={ref} {...props} />
));

// Re-export types
export type { SlideProps, TransitionProps };
