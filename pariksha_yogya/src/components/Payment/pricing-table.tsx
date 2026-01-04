import * as React from "react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { CheckIcon, ArrowRightIcon, LightningBoltIcon, StarIcon, RocketIcon } from "@radix-ui/react-icons"
import NumberFlow from "@number-flow/react"

export type PlanLevel = "starter" | "pro" | "all" | string

export interface PricingFeature {
  name: string
  included: PlanLevel | null
}

export interface PricingPlan {
  name: string
  level: PlanLevel
  price: {
    monthly: number
    yearly: number
  }
  popular?: boolean
}

export interface PricingTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  features: PricingFeature[]
  plans: PricingPlan[]
  onPlanSelect?: (plan: PlanLevel) => void
  defaultPlan?: PlanLevel
  defaultInterval?: "monthly" | "yearly"
  containerClassName?: string
  buttonClassName?: string
}

export function PricingTable({
  features,
  plans,
  onPlanSelect,
  defaultPlan = "pro",
  defaultInterval = "monthly",
  className,
  containerClassName,
  buttonClassName,
  ...props
}: PricingTableProps) {
  const [isYearly, setIsYearly] = React.useState(defaultInterval === "yearly")
  const [selectedPlan, setSelectedPlan] = React.useState<PlanLevel>(defaultPlan)

  const handlePlanSelect = (plan: PlanLevel) => {
    setSelectedPlan(plan)
    onPlanSelect?.(plan)
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "starter":
        return <StarIcon className="w-3.5 h-3.5 mr-1" />;
      case "pro":
        return <LightningBoltIcon className="w-3.5 h-3.5 mr-1" />;
      case "all":
        return <RocketIcon className="w-3.5 h-3.5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "border border-[rgba(0,0,0,0.4)] rounded-lg",
        "fade-bottom overflow-hidden ",
      )}
    >
      <div
        className={cn("w-full  mx-auto px-2 sm:px-4 rounded-lg bg-gradient-to-b from-gray-50 to-white shadow-sm", containerClassName)}
        {...props}
      >
        {/* Billing toggle */}
        <div className="flex flex-col items-center justify-center mb-3 sm:mb-5 pt-3">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">Choose Your Plan</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 text-center max-w-md">
            Select the perfect plan for your needs
          </p>
          <div className="inline-flex items-center gap-2 p-0.5 rounded-full bg-gray-100">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-3 py-1 rounded-full transition-all text-xs font-medium",
                !isYearly 
                  ? "bg-white shadow-sm text-blue-600" 
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-3 py-1 rounded-full transition-all text-xs font-medium relative",
                isYearly 
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              <span>Yearly</span>
              {!isYearly && (
                <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[8px] px-1 py-0.5 rounded-full">
                  -20%
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[300px_1fr] gap-3 gap-x-4 mb-4">
          {/* Plans column */}
          <div className="flex flex-col">
            <div className="flex flex-row sm:flex-col gap-2">
              {plans.map((plan) => (
                <button
                  key={plan.name}
                  type="button"
                  onClick={() => handlePlanSelect(plan.level)}
                  className={cn(
                    "p-2 sm:p-3 rounded-lg text-left transition-all flex-1 group relative overflow-hidden",
                    "border border-gray-200",
                    "hover:shadow-sm hover:border-gray-300",
                    selectedPlan === plan.level && 
                      "ring-1 ring-blue-500 shadow-sm",
                    plan.popular && plan.level !== selectedPlan &&
                      "border-blue-100 bg-gradient-to-br from-blue-50 to-white",
                  )}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                      <div className="absolute top-0 right-0 transform translate-y-[-50%] translate-x-[50%] rotate-45 bg-blue-500 text-[9px] text-white py-0.5 w-[170%] text-center">
                        Best value
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center mb-1">
                    {getPlanIcon(plan.level)}
                    <span className="text-xs sm:text-sm font-semibold">{plan.name}</span>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-1">
                    <NumberFlow
                      format={{
                        style: "currency",
                        currency: "USD",
                        trailingZeroDisplay: "stripIfInteger",
                      }}
                      value={isYearly ? plan.price.yearly : plan.price.monthly}
                      className="text-xl sm:text-2xl font-bold"
                    />
                    <span className="text-[10px] sm:text-xs font-normal text-gray-500">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  
                  {isYearly && (
                    <div className="text-[9px] text-green-600 mb-1">
                      Save ${(plan.price.monthly * 12) - plan.price.yearly} annually
                    </div>
                  )}
                  
                  <div className="text-[10px] sm:text-xs text-gray-500">
                    {plan.level === "starter" ? "For individuals & small teams" : 
                     plan.level === "pro" ? "For growing businesses" : 
                     "For large enterprises"}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Desktop-only button (hidden on mobile) */}
            <div className="hidden sm:block text-center mt-2">
              <Button
                className={cn(
                  "w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md",
                  buttonClassName,
                )}
              >
                Get started with {plans.find((p) => p.level === selectedPlan)?.name}
                <ArrowRightIcon className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Features column */}
          <div className="border border-[rgba(0,0,0,0.4)] rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <div className="min-w-[240px] divide-y divide-gray-200">
                <div className="flex items-center py-1.5 px-2 bg-gray-50 sticky top-0">
                  <div className="flex-1 text-xs font-semibold">Features</div>
                  <div className="flex items-center gap-6 text-xs">
                    {plans.map((plan) => (
                      <div
                        key={plan.level}
                        className="w-14 text-center font-medium"
                      >
                        {plan.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                {features.map((feature, index) => (
                  <div
                    key={feature.name}
                    className={cn(
                      "flex items-center py-2 px-2 transition-colors",
                      feature.included === selectedPlan &&
                        "bg-blue-50/50",
                      index % 2 === 0 && "bg-gray-50/50"
                    )}
                  >
                    <div className="flex-1 text-sm">{feature.name}</div>
                    <div className="flex items-center gap-6 text-xs">
                      {plans.map((plan) => (
                        <div
                          key={plan.level}
                          className={cn(
                            "w-14 flex justify-center",
                            plan.level === selectedPlan && "font-medium",
                          )}
                        >
                          {shouldShowCheck(feature.included, plan.level) ? (
                            <div className={cn(
                              "rounded-full w-4 h-4 flex items-center justify-center",
                              plan.level === "starter" ? "bg-gray-100 text-gray-700" :
                              plan.level === "pro" ? "bg-blue-100 text-blue-700" :
                              "bg-purple-100 text-purple-700"
                            )}>
                              <CheckIcon className="w-2.5 h-2.5" />
                            </div>
                          ) : (
                            <span className="text-gray-300">
                              —
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only button (hidden on desktop) */}
        <div className="block sm:hidden text-center mb-4">
          <Button
            className={cn(
              "w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md",
              buttonClassName,
            )}
          >
            Get started with {plans.find((p) => p.level === selectedPlan)?.name}
            <ArrowRightIcon className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
        
        {/* <div className="text-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 pb-3">
          All plans include a 14-day free trial
        </div> */}
      </div>
    </section>
  );
}

function shouldShowCheck(
  included: PricingFeature["included"],
  level: string,
): boolean {
  if (included === "all") return true
  if (included === "pro" && (level === "pro" || level === "all")) return true
  if (
    included === "starter" &&
    (level === "starter" || level === "pro" || level === "all")
  )
    return true
  return false
}