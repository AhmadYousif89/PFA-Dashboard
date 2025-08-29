"use client";

import { unstable_ViewTransition as ViewTransition } from "react";
import { useEffect, useState } from "react";

type Props = React.ComponentProps<typeof ViewTransition>;

export const ViewTransitionWrapper = ({ children, ...props }: Props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const deviceAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = deviceAgent.test(userAgent);
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice || isTouchDevice);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // If disabled or on mobile, render children without ViewTransition
  if (isMobile) {
    return children;
  }
  // Use ViewTransition for larger screens
  return (
    <ViewTransition enter="slide-up" {...props}>
      {children}
    </ViewTransition>
  );
};
