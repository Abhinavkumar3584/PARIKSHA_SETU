import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Button Component
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

// Hero Component
function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      " Accurately",
      "Effortlessly",
      "Seamlessly",
      "Quickly",
      "In Seconds",
      "instantly",
    ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div
      className="w-full pt-16 md:pt-20"
      style={{
        background:
          "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
        backgroundImage: "var(--hero-gradient, linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%))",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 py-10 lg:py-20 items-center justify-center">
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-3xl sm:text-5xl md:text-7xl max-w-7xl tracking-tighter font-regular">
              <span className="text-spektr-cyan-50 font-semibold">
                Know your Competitive exam eligibility & attempts with{" "}
              </span>
              <div>
                <img
                  src="./logos/py_name.svg"
                  alt=""
                  className="mx-auto mt-2 md:mt-5 h-8 md:h-16"
                />
                <hr className="w-1/2 md:w-1/2 mx-auto my-2 border-t-3 border-[#ff6600]" />
              </div>
              <span className="relative flex w-full justify-center overflow-hidden md:pb-5 md:pt-2">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100%" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                    style={{
                      color: index % 2 === 0 ? "blue" : "green",
                    }}
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/Check/checknow">
              <Button size="lg" className="gap-4 bg-blue-600 hover:bg-blue-700 text-white">
                Check Now <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero, Button, buttonVariants };
