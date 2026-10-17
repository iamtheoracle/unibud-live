import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-CoXdmm_3.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-150 disabled:pointer-events-none disabled:opacity-40", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-foreground hover:opacity-90",
			bud: "bg-bud text-bud-foreground hover:opacity-90",
			ghost: "bg-transparent text-foreground hover:bg-secondary",
			outline: "border border-border bg-card text-foreground hover:bg-secondary",
			danger: "bg-destructive text-destructive-foreground hover:opacity-90",
			secondary: "bg-secondary text-foreground hover:opacity-90"
		},
		size: {
			sm: "h-9 rounded-full px-3 text-sm",
			md: "h-11 rounded-full px-4 text-sm",
			lg: "h-12 rounded-full px-5 text-base",
			icon: "size-11 rounded-full"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { Button as t };
