const Ls = {
  // For PrimeVue version 3
  accordiontab: {
    root: {
      class: ["mb-0", "border-b border-surface-200 dark:border-surface-700"]
    },
    header: ({ props: e }) => ({
      class: [
        // State
        { "select-none pointer-events-none cursor-default opacity-60": e == null ? void 0 : e.disabled }
      ]
    }),
    headerAction: {
      class: [
        //Font
        "font-semibold",
        "leading-none",
        // Alignments
        "flex justify-between items-center",
        "flex-row-reverse",
        "relative",
        // Sizing
        "p-[1.125rem]",
        // Shape
        "rounded-md",
        "border-0",
        // Color
        "bg-surface-0 dark:bg-surface-900",
        "text-surface-600 dark:text-surface-0/80",
        // Transition
        "transition duration-200 ease-in-out",
        "transition-shadow duration-200",
        // States
        "focus:outline-none focus:outline-offset-0 focus-visible:ring-1 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-300",
        // Focus
        // Misc
        "cursor-pointer no-underline select-none"
      ]
    },
    headerIcon: ({ context: e }) => ({
      class: ["inline-block ml-2", { "text-surface-900 dark:text-surface-0": e.active }]
    }),
    headerTitle: {
      class: "leading-none"
    },
    content: {
      class: [
        // Spacing
        "p-[1.125rem] pt-0",
        //Shape
        "border-0 rounded-none",
        // Color
        "bg-surface-0 dark:bg-surface-900",
        "text-surface-600 dark:text-surface-0/70"
      ]
    },
    transition: {
      enterFromClass: "max-h-0",
      enterActiveClass: "overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.42,0,0.58,1)]",
      enterToClass: "max-h-[1000px]",
      leaveFromClass: "max-h-[1000px]",
      leaveActiveClass: "overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0,1,0,1)]",
      leaveToClass: "max-h-0"
    }
  }
}, Es = {
  content: "p-5 pt-0 bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-surface-0/70"
}, Ns = {
  root: ({ context: e }) => ({
    class: [
      "flex items-center justify-between bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-surface-0/70 p-[1.125rem] font-semibold outline-transparent",
      {
        "focus-visible:outline-offset-2 focus-visible:ring-1 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400": !e.disabled
      },
      {
        "hover:text-surface-700 dark:hover:text-surface-0": !e.disabled
      }
    ]
  }),
  toggleIcon: "inline-block text-surface-900 dark:text-surface-0 w-4 h-4"
}, Rs = {
  root: ({ props: e, context: t }) => ({
    class: [
      "flex flex-col border-b border-surface-200 dark:border-surface-700",
      {
        "[&>[data-pc-name=accordionheader]]:select-none [&>[data-pc-name=accordionheader]]:pointer-events-none [&>[data-pc-name=accordionheader]]:cursor-default [&>[data-pc-name=accordionheader]]:opacity-60": e == null ? void 0 : e.disabled,
        "[&>[data-pc-name=accordionheader]]:text-surface-700 dark:[&>[data-pc-name=accordionheader]]:text-surface-100 hover:[&>[data-pc-name=accordionheader]]:text-surface-800 dark:hover:[&>[data-pc-name=accordionheader]]:text-surface-0": !e.disabled && t.active,
        "[&>[data-pc-section=toggleicon]]:text-surface-700 dark:[&>[data-pc-section=toggleicon]]:text-surface-100 hover:[&>[data-pc-section=toggleicon]]:text-surface-800 dark:hover:[&>[data-pc-section=toggleicon]]:text-surface-0": !e.disabled && t.active,
        "[&:last-child>[data-pc-name=accordioncontent]>[data-pc-section=content]]:rounded-b-md": !e.disabled && t.active,
        "[&:last-child>[data-pc-name=accordionheader]]:rounded-b-md": !e.disabled && !t.active
      },
      "[&:nth-child(n+2)>[data-pc-name=accordionheader]]:border-t-0",
      "[&:first-child>[data-pc-name=accordionheader]]:rounded-t-md"
    ]
  })
}, Ms = {
  root: ({ props: e }) => ({
    class: [
      "relative",
      // Flex
      {
        flex: e.fluid,
        "inline-flex": !e.fluid
      },
      // Size
      { "w-full": e.multiple },
      { "[&>input]:!rounded-r-none": e.dropdown },
      // Color
      "text-surface-900 dark:text-surface-0",
      //States
      {
        "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default": e.disabled
      }
    ]
  }),
  inputMultiple: ({ props: e, state: t }) => ({
    class: [
      // Font
      "leading-none",
      // Flex
      "flex items-center flex-wrap",
      "gap-2",
      // Spacing
      "m-0 list-none",
      "py-1 px-1",
      // Size
      "w-full",
      // Shape
      "appearance-none rounded-md",
      // Color
      "text-surface-700 dark:text-white/80",
      "placeholder:text-surface-400 dark:placeholder:text-surface-500",
      { "bg-surface-0 dark:bg-surface-950": !e.disabled },
      "border",
      { "border-surface-300 dark:border-surface-700": !e.invalid },
      // Invalid State
      "invalid:focus:ring-red-200",
      "invalid:hover:border-red-500",
      { "border-red-500 dark:border-red-400": e.invalid },
      // States
      { "hover:border-surface-400 dark:hover:border-surface-700": !e.invalid },
      { "outline-none outline-offset-0 z-10 ring-1 ring-primary-500 dark:ring-primary-400": t.focused },
      // Transition
      "transition duration-200 ease-in-out",
      // Misc
      "cursor-text overflow-hidden"
    ]
  }),
  inputToken: {
    class: ["py-1 px-0 ml-2", "inline-flex flex-auto"]
  },
  inputChip: {
    class: "flex-auto inline-flex pt-1 pb-1"
  },
  input: {
    class: "border-none outline-none bg-transparent m-0 p-0 shadow-none rounded-none w-full"
  },
  dropdown: {
    class: [
      "relative",
      // Alignments
      "items-center inline-flex justify-center text-center align-bottom",
      // Shape
      "rounded-r-md",
      // Size
      "py-2 leading-none",
      "w-10",
      // Colors
      "text-primary-contrast",
      "bg-primary",
      "border border-primary",
      // States
      "focus:outline-none focus:outline-offset-0 focus:ring-1 ",
      "hover:bg-primary-emphasis hover:border-primary-emphasis",
      "focus:ring-primary-500 dark:focus:ring-primary-400"
    ]
  },
  loader: {
    class: ["text-surface-500 dark:text-surface-0/70", "absolute top-[50%] right-[0.5rem] -mt-2 animate-spin"]
  },
  overlay: {
    class: [
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-white/80",
      // Shape
      "border border-surface-300 dark:border-surface-700",
      "rounded-md",
      "shadow-md",
      // Size
      "overflow-auto"
    ]
  },
  list: {
    class: "p-1 list-none m-0"
  },
  option: ({ context: e }) => ({
    class: [
      "relative",
      // Font
      "leading-none",
      // Spacing
      "m-0 px-3 py-2",
      "first:mt-0 mt-[2px]",
      // Shape
      "border-0 rounded",
      // Colors
      {
        "bg-surface-200 dark:bg-surface-600/60": e.focused && !e.selected,
        "text-surface-700 dark:text-white/80": e.focused && !e.selected,
        "bg-highlight": e.selected
      },
      //States
      { "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.focused && !e.selected },
      { "hover:bg-highlight-emphasis": e.selected },
      { "hover:text-surface-700 hover:bg-surface-100 dark:hover:text-white dark:hover:bg-[rgba(255,255,255,0.03)]": e.focused && !e.selected },
      // Transition
      "transition-shadow duration-200",
      // Misc
      "cursor-pointer overflow-hidden whitespace-nowrap"
    ]
  }),
  optionGroup: {
    class: [
      "font-semibold",
      // Spacing
      "m-0 py-2 px-3",
      // Colors
      "text-surface-400 dark:text-surface-500",
      // Misc
      "cursor-auto"
    ]
  },
  emptyMessage: {
    class: [
      // Font
      "leading-none",
      // Spacing
      "py-2 px-3",
      // Color
      "text-surface-800 dark:text-white/80",
      "bg-transparent"
    ]
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0"
  }
}, Fs = {
  root: ({ props: e, parent: t }) => {
    var r, n, o;
    return {
      class: [
        // Font
        {
          "text-xl": e.size == "large",
          "text-2xl": e.size == "xlarge"
        },
        // Alignments
        "inline-flex items-center justify-center",
        "relative",
        // Sizes
        {
          "h-8 w-8": e.size == null || e.size == "normal",
          "w-12 h-12": e.size == "large",
          "w-16 h-16": e.size == "xlarge"
        },
        { "-ml-4": ((r = t.instance.$style) == null ? void 0 : r.name) == "avatargroup" },
        // Shapes
        {
          "rounded-lg": e.shape == "square",
          "rounded-full": e.shape == "circle"
        },
        { "border-2": ((n = t.instance.$style) == null ? void 0 : n.name) == "avatargroup" },
        // Colors
        "bg-surface-300 dark:bg-surface-700",
        { "border-white dark:border-surface-800": ((o = t.instance.$style) == null ? void 0 : o.name) == "avatargroup" }
      ]
    };
  },
  image: ({ props: e }) => ({
    class: [
      "h-full w-full",
      {
        "rounded-lg": e.shape == "square",
        "rounded-full": e.shape == "circle"
      }
    ]
  })
}, Bs = {
  root: {
    class: "flex items-center"
  }
}, Vs = {
  root: ({ props: e }) => {
    var t, r;
    return {
      class: [
        // Font
        "font-bold",
        {
          "text-xs leading-[1.5rem]": e.size === null,
          "text-[0.625rem] leading-[1.25rem]": e.size === "small",
          "text-lg leading-[2.25rem]": e.size === "large",
          "text-2xl leading-[3rem]": e.size === "xlarge"
        },
        // Alignment
        "text-center inline-block",
        // Size
        "p-0 px-1",
        {
          "w-2 h-2": e.value === null,
          "min-w-[1.5rem] h-[1.5rem]": e.value !== null && e.size === null,
          "min-w-[1.25rem] h-[1.25rem]": e.size === "small",
          "min-w-[2.25rem] h-[2.25rem]": e.size === "large",
          "min-w-[3rem] h-[3rem]": e.size === "xlarge"
        },
        // Shape
        {
          "rounded-full": ((t = e.value) == null ? void 0 : t.length) === 1,
          "rounded-[0.71rem]": ((r = e.value) == null ? void 0 : r.length) !== 1
        },
        // Color
        "text-primary-contrast",
        {
          "bg-primary": e.severity == null || e.severity === "primary",
          "bg-surface-500 dark:bg-surface-400": e.severity === "secondary",
          "bg-green-500 dark:bg-green-400": e.severity === "success",
          "bg-blue-500 dark:bg-blue-400": e.severity === "info",
          "bg-orange-500 dark:bg-orange-400": e.severity === "warn",
          "bg-purple-500 dark:bg-purple-400": e.severity === "help",
          "bg-red-500 dark:bg-red-400": e.severity === "danger",
          "text-surface-0 dark:text-surface-900 bg-surface-900 dark:bg-surface-0": e.severity === "contrast"
        }
      ]
    };
  }
}, Ds = {
  root: ({ context: e }) => ({
    class: [
      // Font
      "font-bold",
      "text-xs leading-5",
      // Alignment
      "flex items-center justify-center",
      "text-center",
      // Position
      "absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 origin-top-right",
      // Size
      "m-0",
      {
        "p-0": e.nogutter || e.dot,
        "px-2": !e.nogutter && !e.dot,
        "min-w-[0.5rem] w-2 h-2": e.dot,
        "min-w-[1.5rem] h-6": !e.dot
      },
      // Shape
      {
        "rounded-full": e.nogutter || e.dot,
        "rounded-[10px]": !e.nogutter && !e.dot
      },
      // Color
      "text-primary-contrast",
      {
        "bg-primary": !e.info && !e.success && !e.warning && !e.danger && !e.help && !e.secondary,
        "bg-surface-500 dark:bg-surface-400": e.secondary,
        "bg-green-500 dark:bg-green-400": e.success,
        "bg-blue-500 dark:bg-blue-400": e.info,
        "bg-orange-500 dark:bg-orange-400": e.warning,
        "bg-purple-500 dark:bg-purple-400": e.help,
        "bg-red-500 dark:bg-red-400": e.danger
      }
    ]
  })
}, Hs = {
  root: "relative",
  mask: "bg-black/40 rounded-md"
}, Us = {
  root: {
    class: [
      // Shape
      "rounded-md",
      // Spacing
      "p-4",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      // Misc
      "overflow-x-auto"
    ]
  },
  list: {
    class: [
      // Flex & Alignment
      "flex items-center flex-nowrap",
      // Spacing
      "m-0 p-0 list-none leading-none"
    ]
  },
  itemLink: {
    class: [
      // Flex & Alignment
      "flex items-center gap-2",
      // Shape
      "rounded-md",
      // Color
      "text-surface-600 dark:text-white/70",
      // States
      "focus-visible:outline-none focus-visible:outline-offset-0",
      "focus-visible:ring-1 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      // Transitions
      "transition-shadow duration-200",
      // Misc
      "text-decoration-none"
    ]
  },
  itemIcon: {
    class: "text-surface-600 dark:text-white/70"
  },
  separator: {
    class: [
      // Flex & Alignment
      "flex items-center",
      // Spacing
      "mx-2",
      // Color
      "text-surface-600 dark:text-white/70"
    ]
  }
}, Ks = {
  root: ({ props: e, context: t, parent: r, instance: n }) => ({
    class: [
      "relative",
      // Fluid
      { "w-full": e.fluid },
      // Alignments
      "items-center inline-flex text-center align-bottom justify-center",
      { "flex-col": (e.iconPos === "top" || e.iconPos === "bottom") && e.label },
      // Sizes & Spacing
      "leading-[normal]",
      {
        "px-3 py-2": e.size === null,
        "text-sm py-1.5 px-3": e.size === "small",
        "text-xl py-3 px-4": e.size === "large"
      },
      { "gap-2": e.label !== null },
      {
        "w-10 px-0 py-2": e.label == null && e.icon !== null
      },
      {
        "w-10 px-0 gap-0": n.hasIcon && !e.label && !e.badge,
        "rounded-[50%] h-10 [&>[data-pc-section=label]]:w-0 [&>[data-pc-section=label]]:invisible": n.hasIcon && !e.label && !e.badge && e.rounded
      },
      // Shapes
      { "shadow-lg": e.raised },
      { "rounded-md": !e.rounded, "rounded-full": e.rounded },
      { "rounded-none first:rounded-l-md last:rounded-r-md": r.instance.$name == "InputGroup" },
      // Link Button
      { "text-primary-600 bg-transparent border-transparent": e.link },
      // Plain Button
      { "text-white bg-gray-500 border border-gray-500": e.plain && !e.outlined && !e.text },
      // Plain Text Button
      { "text-surface-500": e.plain && e.text },
      // Plain Outlined Button
      { "text-surface-500 border border-gray-500": e.plain && e.outlined },
      // Text Button
      { "bg-transparent border-transparent": e.text && !e.plain },
      // Outlined Button
      { "bg-transparent border": e.outlined && !e.plain },
      // --- Severity Buttons ---
      // Primary Button
      {
        "text-surface-0": !e.link && e.severity === null && !e.text && !e.outlined && !e.plain,
        "bg-primary-700": !e.link && e.severity === null && !e.text && !e.outlined && !e.plain,
        "border border-primary-700": !e.link && e.severity === null && !e.text && !e.outlined && !e.plain
      },
      // Primary Text Button
      { "text-primary-600": e.text && e.severity === null && !e.plain },
      // Primary Outlined Button
      { "text-primary-700 border border-primary-700": e.outlined && e.severity === null && !e.plain },
      // Secondary Button
      {
        "text-surface-900 dark:text-white": e.severity === "secondary" && !e.text && !e.outlined && !e.plain,
        "bg-surface-100 dark:bg-surface-700": e.severity === "secondary" && !e.text && !e.outlined && !e.plain,
        "border border-surface-100 dark:border-surface-700": e.severity === "secondary" && !e.text && !e.outlined && !e.plain
      },
      // Secondary Text Button
      { "text-surface-500 dark:text-surface-300": e.text && e.severity === "secondary" && !e.plain },
      // Secondary Outlined Button
      { "text-surface-500 dark:text-surface-300 border border-surface-500 hover:bg-surface-300/10": e.outlined && e.severity === "secondary" && !e.plain },
      // Success Button
      {
        "text-white dark:text-success-900": e.severity === "success" && !e.text && !e.outlined && !e.plain,
        "bg-success-500 dark:bg-success-400": e.severity === "success" && !e.text && !e.outlined && !e.plain,
        "border border-success-500 dark:border-success-400": e.severity === "success" && !e.text && !e.outlined && !e.plain
      },
      // Success Text Button
      { "text-success-500 dark:text-success-400": e.text && e.severity === "success" && !e.plain },
      // Success Outlined Button
      { "text-success-500 border border-success-500 hover:bg-success-300/10": e.outlined && e.severity === "success" && !e.plain },
      // Info Button
      {
        "text-white dark:text-surface-900": e.severity === "info" && !e.text && !e.outlined && !e.plain,
        "bg-blue-500 dark:bg-info-400": e.severity === "info" && !e.text && !e.outlined && !e.plain,
        "border border-blue-500 dark:border-info-400": e.severity === "info" && !e.text && !e.outlined && !e.plain
      },
      // Info Text Button
      { "text-info-400 dark:text-info-400": e.text && e.severity === "info" && !e.plain },
      // Info Outlined Button
      { "text-info-400 border border-info-400 hover:bg-info-300/10 ": e.outlined && e.severity === "info" && !e.plain },
      // Warning Button
      {
        "text-white dark:text-surface-900": e.severity === "warn" && !e.text && !e.outlined && !e.plain,
        "bg-orange-500 dark:bg-orange-400": e.severity === "warn" && !e.text && !e.outlined && !e.plain,
        "border border-orange-500 dark:border-orange-400": e.severity === "warn" && !e.text && !e.outlined && !e.plain
      },
      // Warning Text Button
      { "text-orange-500 dark:text-orange-400": e.text && e.severity === "warn" && !e.plain },
      // Warning Outlined Button
      { "text-orange-500 border border-orange-500 hover:bg-orange-300/10": e.outlined && e.severity === "warn" && !e.plain },
      // Help Button
      {
        "text-white dark:text-surface-900": e.severity === "help" && !e.text && !e.outlined && !e.plain,
        "bg-purple-500 dark:bg-purple-400": e.severity === "help" && !e.text && !e.outlined && !e.plain,
        "border border-purple-500 dark:border-purple-400": e.severity === "help" && !e.text && !e.outlined && !e.plain
      },
      // Help Text Button
      { "text-purple-500 dark:text-purple-400": e.text && e.severity === "help" && !e.plain },
      // Help Outlined Button
      { "text-purple-500 border border-purple-500 hover:bg-purple-300/10": e.outlined && e.severity === "help" && !e.plain },
      // Danger Button
      {
        "text-white dark:text-surface-900": e.severity === "danger" && !e.text && !e.outlined && !e.plain,
        "bg-danger-500 dark:bg-danger-400": e.severity === "danger" && !e.text && !e.outlined && !e.plain,
        "border border-danger-500 dark:border-danger-400": e.severity === "danger" && !e.text && !e.outlined && !e.plain
      },
      // Danger Text Button
      { "text-danger-400 dark:text-danger-400": e.text && e.severity === "danger" && !e.plain },
      // Danger Outlined Button
      { "text-danger-400 border border-danger-400 hover:bg-danger-300/10": e.outlined && e.severity === "danger" && !e.plain },
      // Contrast Button
      {
        "text-white dark:text-surface-900": e.severity === "contrast" && !e.text && !e.outlined && !e.plain,
        "bg-surface-900 dark:bg-surface-300": e.severity === "contrast" && !e.text && !e.outlined && !e.plain,
        "border border-surface-900 dark:border-surface-300": e.severity === "contrast" && !e.text && !e.outlined && !e.plain
      },
      // Contrast Text Button
      { "text-surface-900 dark:text-surface-300": e.text && e.severity === "contrast" && !e.plain },
      // Contrast Outlined Button
      { "text-surface-900 dark:text-surface-300 border border-surface-900 dark:border-surface-300": e.outlined && e.severity === "contrast" && !e.plain },
      // --- Severity Button States ---
      "focus:outline-none focus:outline-offset-0 focus:ring-1",
      // Link
      { "focus:ring-primary-400": e.link },
      // Plain
      { "hover:bg-gray-600 hover:border-gray-600": e.plain && !e.outlined && !e.text },
      // Text & Outlined Button
      { "hover:bg-surface-300/10": e.plain && (e.text || e.outlined) },
      // Primary
      { "hover:bg-primary-600/80 hover:border-primary-600/80": !e.link && e.severity === null && !e.text && !e.outlined && !e.plain },
      { "focus:ring-primary-300": e.severity === null },
      // Text & Outlined Button
      { "hover:bg-primary-300/10": (e.text || e.outlined) && e.severity === null && !e.plain },
      // Secondary
      { "hover:bg-surface-200 dark:hover:bg-surface-600 hover:border-surface-200 dark:hover:border-surface-600": e.severity === "secondary" && !e.text && !e.outlined && !e.plain },
      { "focus:ring-surface-500 dark:focus:ring-surface-400": e.severity === "secondary" },
      // Text & Outlined Button
      { "hover:bg-surface-300/10": (e.text || e.outlined) && e.severity === "secondary" && !e.plain },
      // Success
      { "hover:bg-success-600 dark:hover:bg-success-300 hover:border-success-600 dark:hover:border-success-300": e.severity === "success" && !e.text && !e.outlined && !e.plain },
      { "focus:ring-success-500 dark:focus:ring-success-400": e.severity === "success" },
      // Text & Outlined Button
      { "hover:bg-success-300/10": (e.text || e.outlined) && e.severity === "success" && !e.plain },
      // Info
      { "hover:bg-blue-600 dark:hover:bg-info-300 hover:border-blue-600 dark:hover:border-info-300": e.severity === "info" && !e.text && !e.outlined && !e.plain },
      { "focus:ring-blue-400 dark:focus:ring-info-300": e.severity === "info" },
      // Text & Outlined Button
      { "hover:bg-info-300/10": (e.text || e.outlined) && e.severity === "info" && !e.plain },
      // Warning
      { "hover:bg-orange-600 dark:hover:bg-orange-300 hover:border-orange-600 dark:hover:border-orange-300": e.severity === "warn" && !e.text && !e.outlined && !e.plain },
      { "focus:ring-orange-500 dark:focus:ring-orange-400": e.severity === "warn" },
      // Text & Outlined Button
      { "hover:bg-orange-300/10": (e.text || e.outlined) && e.severity === "warn" && !e.plain },
      // Help
      { "hover:bg-purple-600 dark:hover:bg-purple-300 hover:border-purple-600 dark:hover:border-purple-300": e.severity === "help" && !e.text && !e.outlined && !e.plain },
      { "focus:ring-purple-500 dark:focus:ring-purple-400": e.severity === "help" },
      // Text & Outlined Button
      { "hover:bg-purple-300/10": (e.text || e.outlined) && e.severity === "help" && !e.plain },
      // Danger
      { "hover:bg-danger-600 dark:hover:bg-danger-300 hover:border-danger-600 dark:hover:border-danger-300": e.severity === "danger" && !e.text && !e.outlined && !e.plain },
      { "focus:ring-danger-500 dark:focus:ring-danger-400": e.severity === "danger" },
      // Text & Outlined Button
      { "hover:bg-danger-300/10": (e.text || e.outlined) && e.severity === "danger" && !e.plain },
      // Contrast
      { "hover:bg-surface-800 dark:hover:bg-surface-200 hover:border-surface-800 dark:hover:border-surface-200": e.severity === "contrast" && !e.text && !e.outlined && !e.plain },
      { "focus:ring-surface-500 dark:focus:ring-surface-0": e.severity === "contrast" },
      // Text & Outlined Button
      { "hover:bg-surface-900/10 dark:hover:bg-[rgba(255,255,255,0.03)]": (e.text || e.outlined) && e.severity === "contrast" && !e.plain },
      // Disabled
      { "opacity-60 pointer-events-none cursor-default": t.disabled },
      // Transitions
      "transition duration-200 ease-in-out",
      // Misc
      "cursor-pointer overflow-hidden select-none",
      // Badge
      "[&>[data-pc-name=badge]]:min-w-4 [&>[data-pc-name=badge]]:h-4 [&>[data-pc-name=badge]]:leading-4"
    ]
  }),
  label: ({ props: e }) => ({
    class: [
      "duration-200",
      "font-medium",
      {
        "hover:underline": e.link
      },
      { "flex-1": e.label !== null, "invisible w-0": e.label == null }
    ]
  }),
  icon: ({ props: e }) => ({
    class: [
      "text-base leading-4",
      "mx-0",
      {
        "mr-2": e.iconPos == "left" && e.label != null,
        "ml-2 order-1": e.iconPos == "right" && e.label != null,
        "order-2": e.iconPos == "bottom" && e.label != null
      }
    ]
  }),
  loadingIcon: ({ props: e }) => ({
    class: [
      "h-4 w-4",
      "mx-0",
      {
        "mr-2": e.iconPos == "left" && e.label != null,
        "ml-2 order-1": e.iconPos == "right" && e.label != null,
        "mb-2": e.iconPos == "top" && e.label != null,
        "mt-2": e.iconPos == "bottom" && e.label != null
      },
      "animate-spin"
    ]
  }),
  badge: ({ props: e }) => ({
    class: [{ "ml-2 w-4 h-4 leading-none flex items-center justify-center": e.badge }]
  })
}, Ws = {
  root: {
    class: [
      "[&>[data-pc-name=button]]:m-0",
      "[&>[data-pc-name=button]]:border-r-none",
      "[&>[data-pc-name=button]:nth-last-child(n+2)]:rounded-tr-none",
      "[&>[data-pc-name=button]:nth-last-child(n+2)]:rounded-br-none",
      "[&>[data-pc-name=button]:nth-child(n+2)]:rounded-tl-none",
      "[&>[data-pc-name=button]:nth-child(n+2)]:rounded-bl-none"
    ]
  }
}, Gs = {
  root: {
    class: [
      //Flex
      "flex flex-col",
      //Shape
      "rounded-[0.25rem]",
      "shadow-md",
      //Color
      "bg-surface-0 dark:bg-surface-800",
      "text-surface-700 dark:text-surface-0"
    ]
  },
  body: {
    class: [
      //Flex
      "flex flex-col",
      "gap-4",
      "p-6"
    ]
  },
  caption: {
    class: [
      //Flex
      "flex flex-col",
      "gap-2"
    ]
  },
  title: {
    class: "text-xl font-semibold mb-0"
  },
  subtitle: {
    class: [
      //Font
      "font-normal",
      //Spacing
      "mb-0",
      //Color
      "text-surface-600 dark:text-surface-0/60"
    ]
  },
  content: {
    class: "p-0"
  },
  footer: {
    class: "p-0"
  }
}, qs = {
  root: {
    class: [
      // Flexbox
      "flex flex-col"
    ]
  },
  contentContainer: {
    class: [
      // Flexbox & Overflow
      "flex flex-col overflow-auto"
    ]
  },
  content: ({ props: e }) => ({
    class: [
      // Flexbox
      "flex",
      // Orientation
      {
        "flex-row": e.orientation !== "vertical",
        "flex-col": e.orientation == "vertical"
      },
      "[&>[data-pc-extend=button]]:self-center"
    ]
  }),
  viewport: {
    class: [
      // Overflow & Width
      "overflow-hidden w-full"
    ]
  },
  itemList: ({ props: e }) => ({
    class: [
      // Flexbox
      "flex",
      // Orientation & Sizing
      {
        "flex-row": e.orientation !== "vertical",
        "flex-col h-full": e.orientation == "vertical"
      }
    ]
  }),
  item: ({ props: e }) => ({
    class: [
      // Flexbox
      "flex shrink-0 grow ",
      // Size
      {
        "w-full sm:w-[50%] md:w-[33.333333333333336%]": e.orientation !== "vertical",
        "w-full h-full": e.orientation == "vertical"
      }
    ]
  }),
  itemClone: ({ props: e }) => ({
    class: [
      // Flexbox
      "flex shrink-0 grow",
      "unvisible",
      // Size
      {
        "w-full sm:w-[50%] md:w-[33.333333333333336%]": e.orientation !== "vertical",
        "w-full h-full": e.orientation == "vertical"
      }
    ]
  }),
  indicatorList: {
    class: [
      // Flexbox & Alignment
      "flex flex-row justify-center flex-wrap"
    ]
  },
  indicator: {
    class: [
      // Spacing
      "mr-2 mb-2"
    ]
  },
  indicatorButton: ({ context: e }) => ({
    class: [
      // Sizing & Shape
      "w-8 h-2 rounded-md",
      // Transitions
      "transition duration-200",
      // Focus Styles
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400",
      // Color & Background
      {
        "bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600": !e.highlighted,
        "bg-primary hover:bg-primary-emphasis": e.highlighted
      }
    ]
  })
}, Ys = {
  root: ({ props: e, state: t }) => ({
    class: [
      "relative",
      // Flex
      {
        flex: e.fluid,
        "inline-flex": !e.fluid
      },
      // Shape
      "rounded-md",
      // Color and Background
      { "bg-surface-0 dark:bg-surface-950": !e.disabled },
      "border",
      { "border-surface-300 dark:border-surface-600": !e.invalid },
      // Invalid State
      "invalid:focus:ring-red-200",
      "invalid:hover:border-red-500",
      { "border-red-500 dark:border-red-400": e.invalid },
      // Transitions
      "transition-all",
      "duration-200",
      // States
      { "hover:border-surface-400 dark:hover:border-surface-600": !e.invalid },
      { "outline-none outline-offset-0 ring-1 ring-primary-500 dark:ring-primary-400": t.focused },
      // Misc
      "cursor-pointer",
      "select-none",
      { "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default": e.disabled }
    ]
  }),
  label: ({ props: e, parent: t }) => {
    var r, n, o, a;
    return {
      class: [
        //Font
        "leading-[normal]",
        // Display
        "block",
        "flex-auto",
        // Color and Background
        "bg-transparent",
        "border-0",
        { "text-surface-800 dark:text-white/80": e.modelValue != null, "text-surface-400 dark:text-surface-500": e.modelValue == null },
        {
          "placeholder:text-transparent dark:placeholder:text-transparent": ((r = t.instance) == null ? void 0 : r.$name) == "FloatLabel",
          "!text-transparent dark:!text-transparent": ((n = t.instance) == null ? void 0 : n.$name) == "FloatLabel" && e.modelValue == null || ((o = e.modelValue) == null ? void 0 : o.length) == 0
        },
        // Sizing and Spacing
        "w-[1%]",
        "py-2 px-3",
        { "pr-7": e.showClear },
        //Shape
        "rounded-none",
        // Transitions
        "transition",
        "duration-200",
        // States
        "focus:outline-none focus:shadow-none",
        // Filled State *for FloatLabel
        { filled: ((a = t.instance) == null ? void 0 : a.$name) == "FloatLabel" && e.modelValue !== null },
        // Misc
        "relative",
        "cursor-pointer",
        "overflow-hidden overflow-ellipsis",
        "whitespace-nowrap",
        "appearance-none"
      ]
    };
  },
  dropdown: {
    class: [
      // Flexbox
      "flex items-center justify-center",
      "shrink-0",
      // Color and Background
      "bg-transparent",
      "text-surface-500",
      // Size
      "w-12",
      // Shape
      "rounded-r-md"
    ]
  },
  overlay: {
    class: [
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-white/80",
      // Shape
      "border border-surface-300 dark:border-surface-700",
      "rounded-md",
      "shadow-md"
    ]
  },
  list: {
    class: "flex flex-col list-none p-0 m-0 gap-[2px] min-w-full"
  },
  option: ({ context: e }) => ({
    class: [
      //Shape
      "rounded-[4px]",
      // Spacing
      "first:mt-0 mt-[2px]",
      // Colors
      {
        "text-surface-500 dark:text-white/70": !e.focused && !e.active,
        "text-surface-500 dark:text-white/70 bg-surface-200 dark:bg-surface-600/90": e.focused && !e.active,
        "bg-highlight text-highlight-contrast": e.focused && e.active || e.active || !e.focused && e.active
      },
      // Transitions
      "transition-shadow",
      "duration-200",
      // States
      {
        "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.active,
        "hover:bg-highlight-emphasis": e.active
      },
      // Disabled
      { "opacity-60 pointer-events-none cursor-default": e.disabled }
    ]
  }),
  optionContent: {
    class: [
      "relative",
      "leading-[normal]",
      // Flexbox
      "flex",
      "items-center",
      // Spacing
      "py-2",
      "px-3",
      // Misc
      "no-underline",
      "overflow-hidden",
      "cursor-pointer",
      "select-none"
    ]
  },
  groupIcon: {
    class: [
      // Alignment
      "ml-auto"
    ]
  },
  optionList: {
    class: [
      "min-w-full",
      // Spacing
      "p-1",
      "m-0",
      "list-none",
      // Shape
      "shadow-none sm:shadow-md",
      "rounded-md",
      "border border-surface-200 dark:border-surface-700",
      // Position
      "static sm:absolute",
      "z-10",
      // Color
      "bg-surface-0 dark:bg-surface-900"
    ]
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0"
  }
}, Js = {
  root: {
    class: [
      "relative",
      // Alignment
      "inline-flex",
      "align-bottom",
      // Size
      "w-5",
      "h-5",
      // Misc
      "cursor-pointer",
      "select-none"
    ]
  },
  box: ({ props: e, context: t }) => ({
    class: [
      // Alignment
      "flex",
      "items-center",
      "justify-center",
      // Size
      "w-5",
      "h-5",
      // Shape
      "rounded",
      "border",
      // Colors
      {
        "border-surface-300 dark:border-surface-700": !t.checked && !e.invalid,
        "bg-surface-0 dark:bg-surface-950": !t.checked && !e.invalid && !e.disabled,
        "border-secondary-400 bg-secondary-400": t.checked
      },
      // Invalid State
      "invalid:focus:ring-danger-400",
      "invalid:hover:border-danger-400",
      { "border-danger-400 dark:border-danger-400": e.invalid },
      // States
      {
        "peer-hover:border-surface-400 dark:peer-hover:border-surface-600": !e.disabled && !t.checked && !e.invalid,
        "peer-hover:bg-primary-emphasis peer-hover:border-primary-emphasis": !e.disabled && t.checked,
        "peer-focus-visible:z-10 peer-focus-visible:outline-none peer-focus-visible:outline-offset-0 peer-focus-visible:ring-1 peer-focus-visible:ring-primary-500 dark:peer-focus-visible:ring-secondary-200": !e.disabled,
        "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default": e.disabled
      },
      { "[&>svg]:text-primary-contrast [&>svg]:w-[0.875rem] [&>svg]:h-[0.875rem]": t.checked },
      // Transitions
      "transition-colors",
      "duration-200"
    ]
  }),
  input: {
    class: [
      "peer",
      // Size
      "w-full ",
      "h-full",
      // Position
      "absolute",
      "top-0 left-0",
      "z-10",
      // Spacing
      "p-0",
      "m-0",
      // Shape
      "opacity-0",
      "rounded",
      "outline-none",
      "border border-surface-300 dark:border-surface-700",
      // Misc
      "appearance-none",
      "cursor-pointer"
    ]
  },
  icon: ({ context: e, state: t }) => ({
    class: [
      // Size
      "w-[0.875rem]",
      "h-[0.875rem]",
      // Colors
      {
        "text-primary-contrast": e.checked,
        "text-primary": t.d_indeterminate
      },
      // Transitions
      "transition-all",
      "duration-200"
    ]
  })
}, Qs = {
  root: {
    class: [
      // Flexbox
      "inline-flex items-center",
      // Spacing
      "px-3 py-1 gap-2",
      // Shape
      "rounded-[16px]",
      // Colors
      "text-surface-700 dark:text-white",
      "bg-surface-100 dark:bg-surface-700"
    ]
  },
  label: {
    class: "leading-6 m-0"
  },
  icon: {
    class: "leading-6 mr-2"
  },
  image: {
    class: ["w-8 h-8 -ml-2 mr-2", "rounded-full"]
  },
  removeIcon: {
    class: [
      "inline-block",
      // Shape
      "rounded-md leading-6",
      // Size
      "w-4 h-4",
      // Transition
      "transition duration-200 ease-in-out",
      // Misc
      "cursor-pointer"
    ]
  }
}, Zs = {
  root: ({ props: e }) => ({
    class: [
      // Display
      "inline-block",
      // Misc
      { "opacity-60 select-none pointer-events-none cursor-default": e.disabled }
    ]
  }),
  preview: {
    class: [
      // Font
      "text-base leading-none",
      // Spacing
      "m-0",
      "p-0",
      //Size
      "w-6 h-6",
      // Shape
      "rounded-md",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "border border-surface-300 dark:border-surface-700",
      // States
      "hover:border-surface-400 dark:hover:border-surface-600",
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:z-10",
      // Transition
      "transition-colors duration-200",
      // Misc
      "cursor-pointer"
    ]
  },
  panel: ({ props: e }) => ({
    class: [
      // Position & Size
      {
        "relative h-[166px] w-[193px]": e.inline,
        "absolute h-[166px] w-[193px]": !e.inline
      },
      // Shape
      "shadow-md border",
      // Colors
      "bg-surface-800 dark:bg-surface-900 border-surface-600 dark:border-surface-700"
    ]
  }),
  colorSelector: {
    class: [
      // Position
      "absolute top-[8px] left-[8px]",
      // Size
      "h-[150px] w-[150px]"
    ]
  },
  colorbackground: {
    class: [
      // Size
      "h-[150px] w-[150px]"
    ],
    style: "background:linear-gradient(to top,#000 0%,rgba(0,0,0,0) 100%),linear-gradient(to right,#fff 0%,rgba(255,255,255,0) 100%)"
  },
  colorHandle: {
    class: [
      "absolute",
      // Shape
      "rounded-full border border-solid",
      // Size
      "h-[10px] w-[10px]",
      // Spacing
      "-ml-[5px] -mt-[5px]",
      // Colors
      "border-white",
      // Misc
      "cursor-pointer opacity-85"
    ]
  },
  hue: {
    class: [
      // Position
      "absolute top-[8px] left-[167px]",
      // Size
      "h-[150px] w-[17px]",
      // Opacity
      "opacity-85"
    ],
    style: "background: linear-gradient(0deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red)"
  },
  hueHandle: {
    class: [
      // Position
      "absolute left-0 -ml-[2px] -mt-[5px]",
      // Size
      "h-[10px] w-[21px]",
      // Shape
      "border-solid border-2",
      // Misc
      "cursor-pointer opacity-85"
    ]
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0"
  }
}, Xs = {
  icon: "w-8 h-8 text-[2rem] mr-2"
}, ei = {
  root: {
    class: [
      // Shape
      "rounded-lg",
      "shadow-lg",
      "border-0",
      // Positioning
      "z-40 transform origin-center",
      "mt-3 absolute left-0 top-0",
      '[&[data-p-confirmpopup-flipped="true"]]:mb-3 [&[data-p-confirmpopup-flipped="true"]]:-mt-3',
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-surface-0/80",
      // Before: Arrow
      "before:absolute before:w-0 before:-top-3 before:h-0 before:border-transparent before:border-solid before:ml-[10px] before:border-x-[10px] before:border-b-[10px] before:border-t-0 before:border-b-surface-200 dark:before:border-b-surface-700",
      "after:absolute after:w-0 after:-top-[0.54rem] after:left-[4px] after:h-0 after:border-transparent after:border-solid after:ml-[8px] after:border-x-[8px] after:border-b-[8px] after:border-t-0 after:border-b-surface-0 dark:after:border-b-surface-900",
      // Flipped: Arrow
      '[&[data-p-confirmpopup-flipped="true"]]:before:-bottom-3 [&[data-p-confirmpopup-flipped="true"]]:before:top-auto [&[data-p-confirmpopup-flipped="true"]]:before:border-b-0 [&[data-p-confirmpopup-flipped="true"]]:before:border-t-[10px] [&[data-p-confirmpopup-flipped="true"]]:before:border-t-surface-200 dark:[&[data-p-confirmpopup-flipped="true"]]:before:border-t-surface-700',
      '[&[data-p-confirmpopup-flipped="true"]]:after:-bottom-[0.54rem] [&[data-p-confirmpopup-flipped="true"]]:after:top-auto [&[data-p-confirmpopup-flipped="true"]]:after:border-b-0 [&[data-p-confirmpopup-flipped="true"]]:after:border-t-[8px] [&[data-p-confirmpopup-flipped="true"]]:after:border-t-surface-0 dark:[&[data-p-confirmpopup-flipped="true"]]:after:border-t-surface-900'
    ]
  },
  content: {
    class: ["p-4 items-center flex", "rounded-t-lg", "border-x border-t last:border-b border-surface-200 dark:border-surface-700"]
  },
  icon: {
    class: "text-2xl mr-4"
  },
  footer: {
    class: [
      // Flexbox and Alignment
      "flex items-center justify-end",
      "shrink-0",
      "text-right",
      "gap-2",
      // Spacing
      "px-4",
      "pb-4",
      // Shape
      "border-t-0",
      "rounded-b-lg",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-surface-0/80",
      "border-x border-b border-surface-200 dark:border-surface-700"
    ]
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0"
  }
}, ti = {
  root: {
    class: [
      // Sizing and Shape
      "min-w-[12.5rem]",
      "rounded-md",
      "shadow-md",
      // Spacing
      "p-1",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-white/80",
      "border border-surface-200 dark:border-surface-700"
    ]
  },
  rootList: {
    class: [
      // Spacings and Shape
      "flex flex-col",
      "list-none",
      "m-0",
      "p-0",
      "outline-none"
    ]
  },
  item: {
    class: "relative my-[2px] [&:first-child]:mt-0"
  },
  itemContent: ({ context: e }) => ({
    class: [
      //Shape
      "rounded-[4px]",
      // Colors
      {
        "text-surface-500 dark:text-white/70": !e.focused && !e.active,
        "text-surface-500 dark:text-white/70 bg-surface-200 dark:bg-surface-600/90": e.focused && !e.active,
        "bg-highlight text-highlight-contrast": e.focused && e.active || e.active || !e.focused && e.active
      },
      // Transitions
      "transition-shadow",
      "duration-200",
      // States
      {
        "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.active,
        "hover:bg-highlight-emphasis": e.active
      },
      // Disabled
      { "opacity-60 pointer-events-none cursor-default": e.disabled }
    ]
  }),
  itemLink: {
    class: [
      "relative",
      // Flexbox
      "flex",
      "items-center",
      // Spacing
      "py-2",
      "px-3",
      // Misc
      "no-underline",
      "overflow-hidden",
      "cursor-pointer",
      "select-none"
    ]
  },
  itemIcon: {
    class: [
      // Spacing
      "mr-2"
    ]
  },
  itemLabel: {
    class: ["leading-none"]
  },
  submenu: ({ props: e }) => ({
    class: [
      "flex flex-col",
      // Size
      "w-full sm:w-48",
      // Spacing
      "p-1",
      "m-0",
      "list-none",
      // Shape
      "shadow-md",
      "rounded-md",
      "dark:border dark:border-surface-700",
      // Position
      "static sm:absolute",
      "z-10",
      { "sm:absolute sm:left-full sm:top-0": e.level > 1 },
      // Color
      "bg-surface-0 dark:bg-surface-900"
    ]
  }),
  submenuIcon: {
    class: ["ml-auto"]
  },
  separator: {
    class: "border-t border-surface-200 dark:border-surface-700"
  },
  transition: {
    enterFromClass: "opacity-0",
    enterActiveClass: "transition-opacity duration-250"
  }
}, ri = {
  root: ({ props: e }) => ({
    class: [
      "relative",
      // Flex & Alignment
      { "flex flex-col": e.scrollable && e.scrollHeight === "flex" },
      // Size
      { "h-full": e.scrollable && e.scrollHeight === "flex" }
    ]
  }),
  mask: {
    class: [
      // Position
      "absolute",
      "top-0 left-0",
      "z-20",
      // Flex & Alignment
      "flex items-center justify-center",
      // Size
      "w-full h-full",
      // Color
      "bg-surface-100/40 dark:bg-surface-900/40",
      // Transition
      "transition duration-200"
    ]
  },
  loadingIcon: {
    class: "w-8 h-8 animate-spin"
  },
  tableContainer: ({ props: e }) => ({
    class: [
      { relative: e.scrollable, "flex flex-col grow": e.scrollable && e.scrollHeight === "flex" },
      // Size
      { "h-full": e.scrollable && e.scrollHeight === "flex" }
    ]
  }),
  header: ({ props: e }) => ({
    class: [
      "font-bold",
      // Shape
      e.showGridlines ? "border-x border-t border-b-0" : "border-y border-x-0",
      // Spacing
      "p-4",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "border-surface-200 dark:border-surface-700",
      "text-surface-700 dark:text-white/80"
    ]
  }),
  table: {
    class: "w-full border-spacing-0 border-separate"
  },
  thead: ({ context: e }) => ({
    class: [
      {
        "bg-surface-0 dark:bg-surface-900 top-0 z-40 sticky": e.scrollable
      }
    ]
  }),
  tbody: ({ instance: e, context: t }) => ({
    class: [
      {
        "sticky z-20": e.frozenRow && t.scrollable
      },
      "bg-surface-0 dark:bg-surface-800"
    ]
  }),
  tfoot: ({ context: e }) => ({
    class: [
      {
        "bg-surface-0 bottom-0 z-0": e.scrollable
      }
    ]
  }),
  footer: {
    class: [
      "font-bold",
      // Shape
      "border-t-0 border-b border-x-0 dark:border-b-0",
      // Spacing
      "p-4",
      // Color
      "bg-surface-0 dark:bg-surface-800",
      "border-surface-200 dark:border-surface-700",
      "text-surface-700 dark:text-white/80"
    ]
  },
  column: {
    headerCell: ({ context: e, props: t }) => ({
      class: [
        "font-semibold dark:font-normal",
        "leading-[normal]",
        // Position
        { "sticky z-20 border-b": t.frozen || t.frozen === "" },
        { relative: e.resizable },
        // Alignment
        "text-left",
        // Shape
        { "first:border-l border-y border-r": e == null ? void 0 : e.showGridlines },
        "border-x-0 border-y-2 border-solid",
        // Spacing
        (e == null ? void 0 : e.size) === "small" ? "py-[0.375rem] px-2" : (e == null ? void 0 : e.size) === "large" ? "py-[0.9375rem] px-5" : "py-3 px-4",
        // Color
        (t.sortable === "" || t.sortable) && e.sorted ? "bg-highlight" : "bg-surface-50 text-surface-700 dark:text-surface-0/50 dark:bg-surface-800/50",
        "border-surface-200 dark:border-surface-900",
        // States
        { "hover:bg-surface-100 dark:hover:bg-surface-800/50": (t.sortable === "" || t.sortable) && !(e != null && e.sorted) },
        "focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
        // Transition
        { "transition duration-200": t.sortable === "" || t.sortable },
        // Misc
        { "cursor-pointer": t.sortable === "" || t.sortable },
        {
          "overflow-hidden whitespace-nowrap border-y bg-clip-padding": e == null ? void 0 : e.resizable
          // Resizable
        }
      ]
    }),
    columnHeaderContent: {
      class: "flex items-center gap-2"
    },
    sort: ({ context: e }) => ({
      class: [e.sorted ? "text-primary-500" : "text-surface-700", e.sorted ? "dark:text-primary-400" : "dark:text-white/80"]
    }),
    bodyCell: ({ props: e, context: t, state: r, parent: n }) => {
      var o, a, s;
      return {
        class: [
          // Font
          "leading-[normal]",
          //Position
          { "sticky box-border border-b": n.instance.frozenRow },
          { "sticky box-border border-b z-20": e.frozen || e.frozen === "" },
          // Alignment
          "text-left",
          // Shape
          "border-0 border-b dark:border-b-0 border-solid",
          { "first:border-l border-r border-b": t == null ? void 0 : t.showGridlines },
          { "bg-surface-0 dark:bg-surface-900": n.instance.frozenRow || e.frozen || e.frozen === "" },
          // Spacing
          { "py-[0.375rem] px-2": (t == null ? void 0 : t.size) === "small" && !r.d_editing },
          { "py-[0.9375rem] px-5": (t == null ? void 0 : t.size) === "large" && !r.d_editing },
          { "py-3 px-4": (t == null ? void 0 : t.size) !== "large" && (t == null ? void 0 : t.size) !== "small" && !r.d_editing },
          { "py-[0.6rem] px-2": r.d_editing },
          // Color
          "border-surface-200 dark:border-surface-700",
          {
            "overflow-hidden whitespace-nowrap border-y bg-clip-padding": (s = (a = (o = n.instance) == null ? void 0 : o.$parentInstance) == null ? void 0 : a.$parentInstance) == null ? void 0 : s.resizableColumns
            // Resizable
          }
        ]
      };
    },
    footerCell: ({ context: e }) => ({
      class: [
        // Font
        "font-bold",
        // Alignment
        "text-left",
        // Shape
        "border-0 border-b border-solid",
        { "border-x border-y": e == null ? void 0 : e.showGridlines },
        // Spacing
        (e == null ? void 0 : e.size) === "small" ? "p-2" : (e == null ? void 0 : e.size) === "large" ? "p-5" : "p-4",
        // Color
        "border-surface-200 dark:border-surface-700",
        "text-surface-700 dark:text-white/80",
        "bg-surface-0 dark:bg-surface-900"
      ]
    }),
    sortIcon: ({ context: e }) => ({
      class: ["ml-2", e.sorted ? "text-inherit" : "text-surface-700 dark:text-white/70"]
    }),
    columnFilter: {
      class: "inline-flex items-center ml-auto font-normal"
    },
    filterOverlay: {
      class: [
        "flex flex-col gap-2",
        // Position
        "absolute top-0 left-0",
        // Shape
        "border-0 dark:border",
        "rounded-md",
        "shadow-md",
        // Size
        "min-w-[12.5rem]",
        // Color
        "bg-surface-0 dark:bg-surface-900",
        "text-surface-800 dark:text-white/80",
        "dark:border-surface-700"
      ]
    },
    filterConstraintList: {
      class: "m-0 p-0 py-3 list-none"
    },
    filterConstraint: ({ context: e }) => ({
      class: [
        // Font
        "font-normal",
        "leading-none",
        // Position
        "relative",
        // Shape
        "border-0",
        "rounded-none",
        // Spacing
        "m-0",
        "py-3 px-5",
        // Color
        { "text-surface-700 dark:text-white/80": !(e != null && e.highlighted) },
        { "bg-surface-0 dark:bg-surface-900 text-surface-700 dark:text-white/80": !(e != null && e.highlighted) },
        { "bg-highlight": e == null ? void 0 : e.highlighted },
        //States
        { "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]": !(e != null && e.highlighted) },
        { "hover:text-surface-700 hover:bg-surface-100 dark:hover:text-white dark:hover:bg-[rgba(255,255,255,0.03)]": !(e != null && e.highlighted) },
        "focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
        // Transitions
        "transition-shadow",
        "duration-200",
        // Misc
        "cursor-pointer",
        "overflow-hidden",
        "whitespace-nowrap"
      ]
    }),
    filterOperator: {
      class: [
        // Shape
        "rounded-t-md",
        // Color
        "text-surface-700 dark:text-white/80",
        "bg-surface-0 dark:bg-surface-700",
        "[&>[data-pc-name=pcfilteroperatordropdown]]:w-full"
      ]
    },
    filter: ({ instance: e }) => ({
      class: [{ "flex items-center w-full gap-2": e.display === "row", "inline-flex ml-auto": e.display === "menu" }]
    }),
    filterRule: "flex flex-col gap-2",
    filterButtonbar: "flex items-center justify-between p-0",
    filterAddButtonContainer: "[&>[data-pc-name=pcfilteraddrulebutton]]:w-full",
    rowToggleButton: {
      class: [
        "relative",
        // Flex & Alignment
        "inline-flex items-center justify-center",
        "text-left",
        // Spacing
        "m-0 p-0",
        // Size
        "w-8 h-8",
        // Shape
        "border-0 rounded-full",
        // Color
        "text-surface-500 dark:text-white/70",
        "bg-transparent",
        "focus-visible:outline-none focus-visible:outline-offset-0",
        "focus-visible:ring-1 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
        // Transition
        "transition duration-200",
        // Misc
        "overflow-hidden",
        "cursor-pointer select-none"
      ]
    },
    columnResizer: {
      class: [
        "block",
        // Position
        "absolute top-0 right-0",
        // Sizing
        "w-2 h-full",
        // Spacing
        "m-0 p-0",
        // Color
        "border border-transparent",
        // Misc
        "cursor-col-resize"
      ]
    },
    transition: {
      class: "p-4 flex flex-col gap-2",
      enterFromClass: "opacity-0 scale-y-[0.8]",
      enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
      leaveActiveClass: "transition-opacity duration-100 ease-linear",
      leaveToClass: "opacity-0"
    }
  },
  bodyRow: ({ context: e, props: t, parent: r }) => ({
    class: [
      // Color
      { "bg-highlight": e.selected },
      { "bg-surface-0 text-surface-600 dark:text-white/80 dark:bg-surface-900": !e.selected },
      { "font-bold bg-surface-0 dark:bg-surface-900 z-20": t.frozenRow },
      { "odd:bg-surface-0 odd:text-surface-600 dark:odd:text-surface-0 dark:even:text-surface-0 dark:odd:bg-surface-800 even:bg-surface-50 even:text-surface-600 dark:even:bg-surface-900": e.stripedRows },
      // State
      { "hover:bg-surface-300/20 dark:hover:bg-surface-700/50": t.selectionMode && !e.selected || r.instance.rowHover },
      // Transition
      { "transition duration-200": t.selectionMode && !e.selected || t.rowHover },
      // Misc
      { "cursor-pointer": t.selectionMode || r.instance.rowHover }
    ]
  }),
  rowExpansion: {
    class: "bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-white/80"
  },
  rowGroupHeader: {
    class: ["sticky z-20", "bg-surface-0 text-surface-600 dark:text-white/70", "dark:bg-surface-900"]
  },
  rowGroupFooter: {
    class: ["sticky z-20", "bg-surface-0 text-surface-600 dark:text-white/70", "dark:bg-surface-900"]
  },
  rowToggleButton: {
    class: [
      "relative",
      // Flex & Alignment
      "inline-flex items-center justify-center",
      "text-left",
      // Spacing
      "m-0 p-0",
      // Size
      "w-8 h-8",
      // Shape
      "border-0 rounded-full",
      // Color
      "text-surface-500 dark:text-white/70",
      "bg-transparent",
      "focus-visible:outline-none focus-visible:outline-offset-0",
      "focus-visible:ring-1 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      // Transition
      "transition duration-200",
      // Misc
      "overflow-hidden",
      "cursor-pointer select-none"
    ]
  },
  rowToggleIcon: {
    class: "inline-block w-4 h-4"
  },
  columnResizeIndicator: {
    class: "absolute hidden w-[2px] z-20 bg-primary"
  }
}, ni = {
  content: {
    class: [
      // Spacing
      "p-0",
      // Shape
      "border-0",
      // Color
      "text-surface-700 dark:text-white/80",
      "bg-surface-0 dark:bg-surface-900"
    ]
  },
  header: {
    class: [
      "font-semibold",
      // Spacing
      "py-3 px-4",
      // Color
      "text-surface-800 dark:text-white/80",
      "bg-surface-00 dark:bg-surface-900",
      "border-b border-surface-200 dark:border-surface-700"
    ]
  }
}, no = {
  root: ({ props: e }) => ({
    class: [
      // Display and Position
      {
        flex: e.fluid,
        "inline-flex": !e.fluid
      },
      "max-w-full",
      "relative"
    ]
  }),
  pcInput: ({ props: e, parent: t }) => {
    var r;
    return {
      root: {
        class: [
          // Display
          "flex-auto w-[1%]",
          // Font
          "leading-none",
          // Colors
          "text-surface-600 dark:text-surface-200",
          "placeholder:text-surface-400 dark:placeholder:text-surface-500",
          { "bg-surface-0 dark:bg-surface-950": !e.disabled },
          "border",
          { "border-surface-300 dark:border-surface-600": !e.invalid },
          // Invalid State
          "invalid:focus:ring-red-200",
          "invalid:hover:border-red-500",
          { "border-red-500 dark:border-red-400": e.invalid },
          // Spacing
          "m-0 py-2 px-3",
          // Shape
          "appearance-none",
          { "rounded-md": !e.showIcon || e.iconDisplay == "input" },
          { "rounded-l-md  flex-1 pr-9": e.showIcon && e.iconDisplay !== "input" },
          { "rounded-md flex-1 pr-9": e.showIcon && e.iconDisplay === "input" },
          // Transitions
          "transition-colors",
          "duration-200",
          // States
          {
            "hover:border-surface-400 dark:hover:border-surface-600": !e.disabled && !e.invalid,
            "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:z-10": !e.disabled,
            "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default": e.disabled
          },
          // Filled State *for FloatLabel
          { filled: ((r = t.instance) == null ? void 0 : r.$name) == "FloatLabel" && e.modelValue !== null }
        ]
      }
    };
  },
  dropdownIcon: {
    class: ["absolute top-1/2 -mt-2", "text-surface-600 dark:text-surface-200", "right-3"]
  },
  dropdown: {
    class: [
      "relative",
      // Alignments
      "items-center inline-flex text-center align-bottom justify-center",
      // Shape
      "rounded-r-md",
      // Size
      "py-2 px-0",
      "w-10",
      "leading-[normal]",
      // Colors
      "border border-l-0 border-surface-300 dark:border-surface-600",
      // States
      "focus:outline-none focus:outline-offset-0 focus:ring-1",
      "hover:bg-primary-hover hover:border-primary-hover",
      "focus:ring-primary-500 dark:focus:ring-primary-400"
    ]
  },
  inputIconContainer: "absolute cursor-pointer top-1/2 right-3 -mt-3",
  inputIcon: "inline-block text-base",
  panel: ({ props: e }) => ({
    class: [
      // Display & Position
      {
        absolute: !e.inline,
        "inline-block": e.inline
      },
      // Size
      { "w-auto p-3 ": !e.inline },
      { "min-w-[80vw] w-auto p-3 ": e.touchUI },
      { "p-3 min-w-full": e.inline },
      // Shape
      "border rounded-lg",
      {
        "shadow-md": !e.inline
      },
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "border-surface-200 dark:border-surface-700",
      //misc
      { "overflow-x-auto": e.inline }
    ]
  }),
  header: {
    class: [
      //Font
      "font-medium",
      // Flexbox and Alignment
      "flex items-center justify-between",
      // Spacing
      "p-0 pb-2",
      "m-0",
      // Shape
      "border-b",
      "rounded-t-md",
      // Colors
      "text-surface-700 dark:text-white/80",
      "bg-surface-0 dark:bg-surface-900",
      "border-surface-200 dark:border-surface-700"
    ]
  },
  title: {
    class: [
      // Text
      "leading-7",
      "mx-auto my-0"
    ]
  },
  selectMonth: {
    class: [
      // Font
      "text-base leading-[normal]",
      "font-medium",
      //shape
      "rounded-md",
      // Colors
      "text-surface-700 dark:text-white/80",
      // Transitions
      "transition duration-200",
      // Spacing
      "p-1",
      "m-0 mr-2",
      // States
      "hover:text-primary-500 dark:hover:text-primary-400",
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:z-10",
      // Misc
      "cursor-pointer"
    ]
  },
  selectYear: {
    class: [
      // Font
      "text-base leading-[normal]",
      "font-medium",
      //shape
      "rounded-md",
      // Colors
      "text-surface-700 dark:text-white/80",
      // Transitions
      "transition duration-200",
      // Spacing
      "p-1",
      "m-0 mr-2",
      // States
      "hover:text-primary-500 dark:hover:text-primary-400",
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:z-10",
      // Misc
      "cursor-pointer"
    ]
  },
  table: {
    class: [
      // Font
      "text-base leading-[normal]",
      // Size & Shape
      "border-collapse",
      "w-full",
      // Spacing
      "m-0 mt-2"
    ]
  },
  tableHeaderCell: {
    class: [
      // Spacing
      "p-1",
      "font-medium"
    ]
  },
  weekHeader: {
    class: ["leading-5", "text-surface-600 dark:text-white/70", "opacity-60 cursor-default"]
  },
  weekNumber: {
    class: ["text-surface-600 dark:text-white/70", "opacity-60 cursor-default"]
  },
  weekday: {
    class: [
      // Colors
      "text-surface-500 dark:text-white/60",
      "p-1"
    ]
  },
  dayCell: {
    class: [
      // Spacing
      "p-1"
    ]
  },
  weekLabelContainer: {
    class: [
      // Flexbox and Alignment
      "flex items-center justify-center",
      "mx-auto",
      // Shape & Size
      "w-8 h-8",
      "rounded-full",
      "border-transparent border",
      "leading-[normal]",
      // Colors
      "opacity-60 cursor-default"
    ]
  },
  dayView: "w-full",
  day: ({ context: e }) => ({
    class: [
      // Flexbox and Alignment
      "flex items-center justify-center",
      "mx-auto",
      // Shape & Size
      "w-8 h-8",
      "rounded-full",
      "border-transparent border",
      "leading-[normal]",
      // Colors
      {
        "bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-white/70": e.date.today && !e.selected && !e.disabled,
        "bg-transparent text-surface-600 dark:text-white/70": !e.selected && !e.disabled && !e.date.today,
        "bg-highlight": e.selected && !e.disabled
      },
      // States
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:z-10",
      {
        "hover:bg-surface-50 dark:hover:bg-surface-500/10": !e.selected && !e.disabled
      },
      {
        "opacity-60 cursor-default": e.disabled,
        "cursor-pointer": !e.disabled
      }
    ]
  }),
  monthView: {
    class: [
      // Spacing
      "mt-2"
    ]
  },
  month: ({ context: e }) => ({
    class: [
      // Flexbox and Alignment
      "inline-flex items-center justify-center",
      // Size
      "w-1/3",
      "p-1",
      // Shape
      "rounded-md",
      // Colors
      {
        "text-surface-600 dark:text-white/70 bg-transparent": !e.selected && !e.disabled,
        "bg-highlight": e.selected && !e.disabled
      },
      // States
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:z-10",
      {
        "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.selected && !e.disabled
      },
      // Misc
      "cursor-pointer"
    ]
  }),
  yearView: {
    class: [
      // Spacing
      "mt-2"
    ]
  },
  year: ({ context: e }) => ({
    class: [
      // Flexbox and Alignment
      "inline-flex items-center justify-center",
      // Size
      "w-1/2",
      "p-1",
      // Shape
      "rounded-md",
      // Colors
      {
        "text-surface-600 dark:text-white/70 bg-transparent": !e.selected && !e.disabled,
        "bg-highlight": e.selected && !e.disabled
      },
      // States
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:z-10",
      {
        "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.selected && !e.disabled
      },
      // Misc
      "cursor-pointer"
    ]
  }),
  timePicker: {
    class: [
      // Flexbox
      "flex",
      "justify-center items-center",
      // Borders
      "border-t-1",
      "border-solid border-surface-200",
      // Spacing
      "pt-2 mt-2"
    ]
  },
  separatorContainer: {
    class: [
      // Flexbox and Alignment
      "flex",
      "items-center",
      "flex-col",
      // Spacing
      "px-2"
    ]
  },
  separator: {
    class: [
      // Text
      "text-xl"
    ]
  },
  hourPicker: {
    class: [
      // Flexbox and Alignment
      "flex",
      "items-center",
      "flex-col",
      // Spacing
      "px-2"
    ]
  },
  minutePicker: {
    class: [
      // Flexbox and Alignment
      "flex",
      "items-center",
      "flex-col",
      // Spacing
      "px-2"
    ]
  },
  secondPicker: {
    class: [
      // Flexbox and Alignment
      "flex",
      "items-center",
      "flex-col",
      // Spacing
      "px-2"
    ]
  },
  ampmPicker: {
    class: [
      // Flexbox and Alignment
      "flex",
      "items-center",
      "flex-col",
      // Spacing
      "px-2"
    ]
  },
  calendarContainer: "flex",
  calendar: "flex-auto border-l first:border-l-0 border-surface-200",
  buttonbar: {
    class: [
      // Flexbox
      "flex justify-between items-center",
      // Spacing
      "pt-2",
      // Shape
      "border-t border-surface-200 dark:border-surface-700"
    ]
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0"
  }
}, oi = {
  root: {}
}, ai = {
  root: ({ state: e }) => ({
    class: [
      // Shape
      "rounded-lg",
      "shadow-lg",
      "border-0",
      // Size
      "max-h-[90vh]",
      "m-0",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "[&:last-child]:border-b",
      "border-surface-200 dark:border-surface-700",
      // Transitions
      "transform",
      "scale-100",
      // Maximized State
      {
        "transition-none": e.maximized,
        "transform-none": e.maximized,
        "!w-screen": e.maximized,
        "!h-screen": e.maximized,
        "!max-h-full": e.maximized,
        "!top-0": e.maximized,
        "!left-0": e.maximized
      }
    ]
  }),
  header: {
    class: [
      // Flexbox and Alignment
      "flex items-center justify-between",
      "shrink-0",
      // Spacing
      "p-6",
      // Shape
      "rounded-tl-lg",
      "rounded-tr-lg",
      // Colors
      "text-surface-700 dark:text-surface-0/80",
      "border border-b-0",
      "border-surface-200 dark:border-surface-700"
    ]
  },
  title: {
    class: ["font-semibold text-xl leading-[normal]"]
  },
  headerActions: {
    class: ["flex items-center"]
  },
  content: ({ state: e, instance: t }) => ({
    class: [
      // Spacing
      "px-6",
      "pb-6",
      "pt-0",
      // Shape
      {
        grow: e.maximized,
        "rounded-bl-lg": !t.$slots.footer,
        "rounded-br-lg": !t.$slots.footer
      },
      // Colors
      "text-surface-700 dark:text-surface-0/80",
      "border border-t-0 border-b-0",
      "border-surface-200 dark:border-surface-700",
      // Misc
      "overflow-y-auto"
    ]
  }),
  footer: {
    class: [
      // Flexbox and Alignment
      "flex items-center justify-end",
      "shrink-0",
      "text-right",
      "gap-2",
      // Spacing
      "px-6",
      "pb-6",
      // Shape
      "border-t-0",
      "rounded-b-lg",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-surface-0/80",
      "border border-t-0 border-b-0",
      "border-surface-200 dark:border-surface-700"
    ]
  },
  mask: ({ props: e }) => ({
    class: [
      // Transitions
      "transition-all",
      "duration-300",
      { "p-5": e.position !== "full" },
      // Background and Effects
      { "has-[.mask-active]:bg-transparent bg-black/40": e.modal }
    ]
  }),
  transition: ({ props: e }) => e.position === "top" ? {
    enterFromClass: "opacity-0 scale-75 translate-x-0 -translate-y-full translate-z-0 mask-active",
    enterActiveClass: "transition-all duration-200 ease-out",
    leaveActiveClass: "transition-all duration-200 ease-out",
    leaveToClass: "opacity-0 scale-75 translate-x-0 -translate-y-full translate-z-0 mask-active"
  } : e.position === "bottom" ? {
    enterFromClass: "opacity-0 scale-75 translate-y-full mask-active",
    enterActiveClass: "transition-all duration-200 ease-out",
    leaveActiveClass: "transition-all duration-200 ease-out",
    leaveToClass: "opacity-0 scale-75 translate-x-0 translate-y-full translate-z-0 mask-active"
  } : e.position === "left" || e.position === "topleft" || e.position === "bottomleft" ? {
    enterFromClass: "opacity-0 scale-75 -translate-x-full translate-y-0 translate-z-0 mask-active",
    enterActiveClass: "transition-all duration-200 ease-out",
    leaveActiveClass: "transition-all duration-200 ease-out",
    leaveToClass: "opacity-0 scale-75  -translate-x-full translate-y-0 translate-z-0 mask-active"
  } : e.position === "right" || e.position === "topright" || e.position === "bottomright" ? {
    enterFromClass: "opacity-0 scale-75 translate-x-full translate-y-0 translate-z-0 mask-active",
    enterActiveClass: "transition-all duration-200 ease-out",
    leaveActiveClass: "transition-all duration-200 ease-out",
    leaveToClass: "opacity-0 scale-75 translate-x-full translate-y-0 translate-z-0 mask-active"
  } : {
    enterFromClass: "opacity-0 scale-75 mask-active",
    enterActiveClass: "transition-all duration-200 ease-out",
    leaveActiveClass: "transition-all duration-200 ease-out",
    leaveToClass: "opacity-0 scale-75 mask-active"
  }
}, si = {
  root: ({ props: e }) => ({
    class: [
      // Flex and Position
      "flex relative",
      { "justify-center": e.layout == "vertical" },
      { "items-center": e.layout == "vertical" },
      {
        "justify-start": (e == null ? void 0 : e.align) == "left" && e.layout == "horizontal",
        "justify-center": (e == null ? void 0 : e.align) == "center" && e.layout == "horizontal",
        "justify-end": (e == null ? void 0 : e.align) == "right" && e.layout == "horizontal",
        "items-center": (e == null ? void 0 : e.align) == "top" && e.layout == "vertical",
        "items-start": (e == null ? void 0 : e.align) == "center" && e.layout == "vertical",
        "items-end": (e == null ? void 0 : e.align) == "bottom" && e.layout == "vertical"
      },
      // Spacing
      {
        "my-5 mx-0 py-0 px-5": e.layout == "horizontal",
        "mx-4 md:mx-5 py-5": e.layout == "vertical"
      },
      // Size
      {
        "w-full": e.layout == "horizontal",
        "min-h-full": e.layout == "vertical"
      },
      // Before: Line
      "before:block",
      // Position
      {
        "before:absolute before:left-0 before:top-1/2": e.layout == "horizontal",
        "before:absolute before:left-1/2 before:top-0 before:transform before:-translate-x-1/2": e.layout == "vertical"
      },
      // Size
      {
        "before:w-full": e.layout == "horizontal",
        "before:min-h-full": e.layout == "vertical"
      },
      // Shape
      {
        "before:border-solid": e.type == "solid",
        "before:border-dotted": e.type == "dotted",
        "before:border-dashed": e.type == "dashed"
      },
      // Color
      {
        "before:border-t before:border-surface-200 before:dark:border-surface-600": e.layout == "horizontal",
        "before:border-l before:border-surface-200 before:dark:border-surface-600": e.layout == "vertical"
      }
    ]
  }),
  content: {
    class: [
      // Space and Position
      "px-1 z-10",
      // Color
      "bg-surface-0 dark:bg-surface-800"
    ]
  }
}, ii = {
  root: ({ props: e }) => ({
    class: [
      // Positioning
      "absolute z-1",
      {
        "left-0 bottom-0 w-full": e.position == "bottom",
        "left-0 top-0 w-full": e.position == "top",
        "left-0 top-0 h-full": e.position == "left",
        "right-0 top-0 h-full": e.position == "right"
      },
      // Flexbox & Alignment
      "flex justify-center items-center",
      // Interactivity
      "pointer-events-none"
    ]
  }),
  listContainer: {
    class: [
      // Flexbox
      "flex",
      // Shape & Border
      "rounded-md",
      // Color
      "bg-surface-0/10 dark:bg-surface-900/20 border border-surface-0/20",
      "backdrop-blur-sm",
      // Spacing
      "p-2",
      // Misc
      "pointer-events-auto"
    ]
  },
  list: ({ props: e }) => ({
    class: [
      // Flexbox & Alignment
      "flex items-center justify-center",
      {
        "flex-col": e.position == "left" || e.position == "right"
      },
      // List Style
      "m-0 p-0 list-none",
      // Shape
      "outline-none"
    ]
  }),
  item: ({ props: e, context: t, instance: r }) => ({
    class: [
      // Spacing & Shape
      "p-2 rounded-md",
      // Positioning & Hover States
      {
        "origin-bottom": e.position == "bottom",
        "origin-top": e.position == "top",
        "origin-left": e.position == "left",
        "origin-right": e.position == "right"
      },
      // Transitions & Transform
      "transition-all duration-200 ease-cubic-bezier-will-change-transform transform"
    ]
  }),
  itemLink: {
    class: [
      // Flexbox & Alignment
      "flex flex-col items-center justify-center",
      // Position
      "relative",
      // Size
      "w-16 h-16",
      // Misc
      "cursor-default overflow-hidden"
    ]
  }
}, oo = {
  root: ({ props: e }) => ({
    class: [
      // Flexbox
      "flex flex-col",
      // Position
      "relative",
      { "!transition-none !transform-none !w-screen !h-screen !max-h-full !top-0 !left-0": e.position == "full" },
      // Size
      {
        "h-full w-80": e.position == "left" || e.position == "right",
        "h-auto w-full": e.position == "top" || e.position == "bottom"
      },
      // Shape
      "border-0 dark:border",
      "shadow-lg",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-white/80",
      "dark:border-surface-700",
      // Transitions
      "transition-transform",
      "duration-300",
      // Misc
      "pointer-events-auto"
    ]
  }),
  header: {
    class: [
      // Flexbox and Alignment
      "flex items-center justify-between",
      "shrink-0",
      // Spacing
      "p-[1.125rem]",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-surface-0/80"
    ]
  },
  title: {
    class: ["font-semibold text-xl"]
  },
  icons: {
    class: ["flex items-center"]
  },
  closeButton: {
    class: [
      "relative",
      // Flexbox and Alignment
      "flex items-center justify-center",
      // Size and Spacing
      "mr-2",
      "last:mr-0",
      "w-7 h-7",
      // Shape
      "border-0",
      "rounded-full",
      // Colors
      "text-surface-500",
      "bg-transparent",
      // Transitions
      "transition duration-200 ease-in-out",
      // States
      "hover:text-surface-700 dark:hover:text-white/80",
      "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]",
      "focus:outline-none focus:outline-offset-0 focus:ring-1",
      "focus:ring-primary-500 dark:focus:ring-primary-400",
      // Misc
      "overflow-hidden"
    ]
  },
  closeButtonIcon: {
    class: [
      // Display
      "inline-block",
      // Size
      "w-4",
      "h-4"
    ]
  },
  content: {
    class: [
      // Spacing and Size
      "p-[1.125rem]",
      "pt-0",
      "h-full",
      "w-full",
      // Growth and Overflow
      "grow",
      "overflow-y-auto"
    ]
  },
  mask: ({ props: e }) => ({
    class: [
      // Transitions
      "transition-all",
      "duration-300",
      { "p-5": e.position !== "full" },
      // Background and Effects
      { "has-[.mask-active]:bg-transparent bg-black/40": e.modal }
    ]
  }),
  transition: ({ props: e }) => e.position === "top" ? {
    enterFromClass: "translate-x-0 -translate-y-full translate-z-0 mask-active",
    leaveToClass: "translate-x-0 -translate-y-full translate-z-0 mask-active"
  } : e.position === "bottom" ? {
    enterFromClass: "translate-x-0 translate-y-full translate-z-0 mask-active",
    leaveToClass: "translate-x-0 translate-y-full translate-z-0 mask-active"
  } : e.position === "left" ? {
    enterFromClass: "-translate-x-full translate-y-0 translate-z-0 mask-active",
    leaveToClass: "-translate-x-full translate-y-0 translate-z-0 mask-active"
  } : e.position === "right" ? {
    enterFromClass: "translate-x-full translate-y-0 translate-z-0 mask-active",
    leaveToClass: "translate-x-full translate-y-0 translate-z-0 mask-active"
  } : {
    enterFromClass: "opacity-0 mask-active",
    enterActiveClass: "transition-opacity duration-400 ease-in",
    leaveActiveClass: "transition-opacity duration-400 ease-in",
    leaveToClass: "opacity-0 mask-active"
  }
}, li = {
  root: {
    class: [
      // Spacing
      "p-[1.125rem] pt-0",
      // Shape
      "rounded-md",
      // Color
      "border border-surface-200 dark:border-surface-700",
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-surface-0/80"
    ]
  },
  legend: ({ props: e }) => ({
    class: [
      // Font
      "font-semibold",
      "leading-none",
      //Spacing
      "p-0 mb-[0.375rem]",
      // Shape
      "rounded-md",
      // Color
      "text-surface-700 dark:text-surface-0/80",
      "bg-surface-0 dark:bg-surface-900",
      // Transition
      "transition-none",
      // States
      { "hover:bg-surface-100 dark:hover:bg-surface-800": e.toggleable }
    ]
  }),
  toggleButton: ({ props: e }) => ({
    class: [
      // Alignments
      "flex items-center justify-center",
      "relative",
      //Spacing
      { "py-2 px-3": e.toggleable },
      // Shape
      { "rounded-md": e.toggleable },
      // Color
      { "text-surface-700 dark:text-surface-200 hover:text-surface-900": e.toggleable },
      // States
      { "hover:text-surface-900 dark:hover:text-surface-100": e.toggleable },
      { "focus:outline-none focus:outline-offset-0 focus-visible:ring-1 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-300": e.toggleable },
      // Misc
      {
        "transition-none cursor-pointer overflow-hidden select-none": e.toggleable
      }
    ]
  }),
  toggleIcon: {
    class: "mr-2 inline-block"
  },
  legendLabel: ({ props: e }) => ({
    class: ["flex items-center justify-center leading-none", { "py-2 px-3": !e.toggleable }]
  }),
  content: {
    class: "p-0"
  },
  transition: {
    enterFromClass: "max-h-0",
    enterActiveClass: "overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.42,0,0.58,1)]",
    enterToClass: "max-h-[1000px]",
    leaveFromClass: "max-h-[1000px]",
    leaveActiveClass: "overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0,1,0,1)]",
    leaveToClass: "max-h-0"
  }
}, ci = {
  root: ({ props: e }) => ({
    class: [
      {
        "flex flex-wrap items-center justify-center gap-2": e.mode === "basic"
      }
    ]
  }),
  input: {
    class: "hidden"
  },
  header: {
    class: [
      // Flexbox
      "flex",
      "flex-wrap",
      // Colors
      "bg-surface-0",
      "dark:bg-surface-900",
      "text-surface-700",
      "dark:text-white/80",
      // Spacing
      "p-[1.125rem]",
      "gap-2",
      // Borders
      "border",
      "border-solid",
      "border-surface-200",
      "dark:border-surface-700",
      "border-b-0",
      // Shape
      "rounded-tr-lg",
      "rounded-tl-lg"
    ]
  },
  content: {
    class: [
      // Position
      "relative",
      // Colors
      "bg-surface-0",
      "dark:bg-surface-900",
      "text-surface-700",
      "dark:text-white/80",
      // Spacing
      "p-[1.125rem]",
      // Borders
      "border border-t-0",
      "border-surface-200",
      "dark:border-surface-700",
      // Shape
      "rounded-b-lg",
      //ProgressBar
      "[&>[data-pc-name=pcprogressbar]]:absolute",
      "[&>[data-pc-name=pcprogressbar]]:w-full",
      "[&>[data-pc-name=pcprogressbar]]:top-0",
      "[&>[data-pc-name=pcprogressbar]]:left-0",
      "[&>[data-pc-name=pcprogressbar]]:h-1"
    ]
  },
  file: {
    class: [
      // Flexbox
      "flex",
      "items-center",
      "flex-wrap",
      // Spacing
      "p-4",
      "mb-2",
      "last:mb-0",
      // Borders
      "border",
      "border-surface-200",
      "dark:border-surface-700",
      "gap-2",
      // Shape
      "rounded"
    ]
  },
  fileThumbnail: "shrink-0",
  fileName: "mb-2 break-all",
  fileSize: "mr-2"
}, ui = {
  root: {
    class: [
      "block relative",
      // Base Label Appearance
      "[&>*:last-child]:text-surface-900/60 dark:[&>*:last-child]:text-white/60",
      "[&>*:last-child]:absolute",
      "[&>*:last-child]:left-3",
      "[&>*:last-child]:pointer-events-none",
      "[&>*:last-child]:transition-all",
      "[&>*:last-child]:duration-200",
      "[&>*:last-child]:ease",
      // Position for all labels except those following textarea
      "[&>:not(textarea)~label]:top-1/2 [&>:not(textarea)~label]:-translate-y-1/2 ",
      // Position for labels following textareas
      "[&>textarea~label]:top-4",
      // Focus Label Appearance
      "[&>*:last-child]:has-[:focus]:-top-3",
      "[&>*:last-child]:has-[:focus]:text-sm",
      "[&>*:last-child]:has-[:focus]:z-10",
      // Filled Input Label Appearance
      "[&>*:last-child]:has-[.filled]:-top-3",
      "[&>*:last-child]:has-[.filled]:text-sm",
      "[&>*:last-child]:has-[.filled]:z-10"
    ]
  }
}, di = {
  content: ({ parent: e, props: t }) => ({
    class: [
      "flex",
      {
        "flex-col": t.fullScreen
      },
      {
        "flex-col": e.props.thumbnailsPosition === "top" || e.props.thumbnailsPosition === "bottom",
        "flex-row": e.props.thumbnailsPosition === "right" || e.props.thumbnailsPosition === "left"
      }
    ]
  }),
  itemsContainer: ({ parent: e, props: t }) => ({
    class: [
      "group",
      "flex relative",
      {
        "grow shrink w-0 justify-center": t.fullScreen
      },
      {
        "flex-col": e.props.indicatorsPosition === "bottom" || e.props.indicatorsPosition === "top",
        "flex-row items-center": e.props.indicatorsPosition === "left" || e.props.indicatorsPosition === "right"
      },
      {
        "order-2": e.props.thumbnailsPosition === "top" || e.props.thumbnailsPosition === "left",
        "flex-row": e.props.thumbnailsPosition === "right"
      }
    ]
  }),
  items: ({ parent: e }) => ({
    class: [
      "flex h-full relative",
      {
        "order-1": e.props.indicatorsPosition === "bottom" || e.props.indicatorsPosition === "right",
        "order-2": e.props.indicatorsPosition === "top" || e.props.indicatorsPosition === "left"
      }
    ]
  }),
  item: {
    class: [
      // Flex
      "flex justify-center items-center h-full w-full",
      // Sizing
      "h-full w-full"
    ]
  },
  thumbnails: ({ parent: e }) => ({
    class: [
      // Flex
      "flex flex-col shrink-0",
      {
        "order-1": e.props.thumbnailsPosition === "top" || e.props.thumbnailsPosition === "left"
      },
      // Misc
      "overflow-auto"
    ]
  }),
  thumbnailContent: ({ parent: e }) => ({
    class: [
      // Flex
      "flex",
      // Spacing
      "py-4 px-1",
      // Colors
      "bg-black/90",
      {
        "flex-row": e.props.thumbnailsPosition === "top" || e.props.thumbnailsPosition === "bottom",
        "flex-col grow": e.props.thumbnailsPosition === "right" || e.props.thumbnailsPosition === "left"
      }
    ]
  }),
  thumbnailPrevButton: {
    class: [
      // Positioning
      "self-center relative",
      // Display & Flexbox
      "flex shrink-0 justify-center items-center overflow-hidden",
      // Spacing
      "m-2",
      // Appearance
      "bg-transparent text-white w-8 h-8 rounded-full transition duration-200 ease-in-out",
      // Hover Effects
      "hover:bg-surface-0/10 hover:text-white",
      // Focus Effects
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
    ]
  },
  thumbnailsViewport: {
    class: "overflow-hidden w-full"
  },
  thumbnailItems: ({ parent: e }) => ({
    class: [
      "flex",
      {
        "flex-col h-full": e.props.thumbnailsPosition === "right" || e.props.thumbnailsPosition === "left"
      }
    ]
  }),
  thumbnailItem: ({ parent: e }) => ({
    class: [
      // Flexbox
      "flex items-center justify-center",
      "grow shrink-0",
      // Sizing
      {
        "w-full md:w-[25%] lg:w-[20%]": e.props.thumbnailsPosition === "top" || e.props.thumbnailsPosition === "bottom"
      },
      // Misc
      "overflow-auto",
      "cursor-pointer",
      "opacity-50",
      // States
      '[&[data-p-active="true"]]:opacity-100',
      "hover:opacity-100",
      // Transitions
      "transition-opacity duration-300"
    ]
  }),
  thumbnailNextButton: {
    class: [
      // Positioning
      "self-center relative",
      // Display & Flexbox
      "flex shrink-0 justify-center items-center overflow-hidden",
      // Spacing
      "m-2",
      // Appearance
      "bg-transparent text-white w-8 h-8 rounded-full transition duration-200 ease-in-out",
      // Hover Effects
      "hover:bg-surface-0/10 hover:text-white",
      // Focus Effects
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
    ]
  },
  indicatorList: ({ parent: e }) => ({
    class: [
      // flex
      "flex items-center justify-center",
      // Spacing
      "p-4",
      // Indicators Position
      {
        "order-2": e.props.indicatorsPosition == "bottom",
        "order-1": e.props.indicatorsPosition == "top",
        "order-1 flex-col": e.props.indicatorsPosition == "left",
        "flex-col order-2": e.props.indicatorsPosition == "right"
      },
      {
        "absolute z-10 bg-black/50": e.props.showIndicatorsOnItem
      },
      {
        "bottom-0 left-0 w-full items-start": e.props.indicatorsPosition == "bottom" && e.props.showIndicatorsOnItem,
        "top-0 left-0 w-full items-start": e.props.indicatorsPosition == "top" && e.props.showIndicatorsOnItem,
        "left-0 top-0 h-full items-start": e.props.indicatorsPosition == "left" && e.props.showIndicatorsOnItem,
        "right-0 top-0 h-full items-start": e.props.indicatorsPosition == "right" && e.props.showIndicatorsOnItem
      }
    ]
  }),
  indicator: ({ parent: e }) => ({
    class: [
      {
        "mr-2": e.props.indicatorsPosition == "bottom" || e.props.indicatorsPosition == "top",
        "mb-2": e.props.indicatorsPosition == "left" || e.props.indicatorsPosition == "right"
      }
    ]
  }),
  indicatorButton: ({ context: e }) => ({
    class: [
      // Size
      "w-4 h-4",
      // Appearance
      "rounded-full transition duration-200",
      // Focus Effects
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400",
      // Conditional Appearance: Not Highlighted
      { "bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600": !e.highlighted },
      // Conditional Appearance: Highlighted
      { "bg-primary hover:bg-primary-emphasis": e.highlighted }
    ]
  }),
  mask: {
    class: ["fixed top-0 left-0 w-full h-full", "flex items-center justify-center", "bg-black/90"]
  },
  closeButton: {
    class: [
      // Positioning
      "!absolute top-0 right-0",
      // Display & Flexbox
      "flex justify-center items-center overflow-hidden",
      // Spacing
      "m-2",
      // Appearance
      "text-white bg-transparent w-12 h-12 rounded-full transition duration-200 ease-in-out",
      // Hover Effect
      "hover:text-white hover:bg-surface-0/10",
      // Focus Effects
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
    ]
  },
  closeIcon: {
    class: "w-6 h-6"
  },
  prevButton: ({ parent: e }) => ({
    class: [
      // Display & Flexbox
      "inline-flex justify-center items-center overflow-hidden",
      // Appearance
      "bg-transparent text-white w-16 h-16 transition duration-200 ease-in-out rounded-md",
      {
        "opacity-0 group-hover:opacity-100": e.props.showItemNavigatorsOnHover
      },
      // Spacing
      "mx-2",
      // Positioning
      "top-1/2 mt-[-0.5rem] left-0",
      {
        "!absolute": !e.state.containerVisible && e.props.showItemNavigators,
        "!fixed": e.state.containerVisible
      },
      // Hover Effect
      "hover:bg-surface-0/10 hover:text-white",
      // Focus Effects
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
    ]
  }),
  nextButton: ({ parent: e }) => ({
    class: [
      // Display & Flexbox
      "inline-flex justify-center items-center overflow-hidden",
      // Appearance
      "bg-transparent text-white w-16 h-16 transition duration-200 ease-in-out rounded-md",
      {
        "opacity-0 group-hover:opacity-100": e.props.showItemNavigatorsOnHover
      },
      // Spacing
      "mx-2",
      // Positioning
      "top-1/2 mt-[-0.5rem] right-0",
      {
        "!absolute": !e.state.containerVisible && e.props.showItemNavigators,
        "!fixed": e.state.containerVisible
      },
      // Hover Effect
      "hover:bg-surface-0/10 hover:text-white",
      // Focus Effects
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
    ]
  }),
  caption: {
    class: [
      // Positioning
      "absolute bottom-0 left-0 w-full",
      // Appearance
      "bg-black/50 text-white p-4"
    ]
  },
  transition: {
    enterFromClass: "opacity-0 scale-75",
    enterActiveClass: "transition-all duration-150 ease-in-out",
    leaveActiveClass: "transition-all duration-150 ease-in",
    leaveToClass: "opacity-0 scale-75"
  }
}, fi = {
  css: `
    *[data-pd-ripple="true"]{
        overflow: hidden;
        position: relative;
    }
    span[data-p-ink-active="true"]{
        animation: ripple 0.4s linear;
    }
    @keyframes ripple {
        100% {
            opacity: 0;
            transform: scale(2.5);
        }
    }

    .progress-spinner-circle {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: 0;
        animation: p-progress-spinner-dash 1.5s ease-in-out infinite, p-progress-spinner-color 6s ease-in-out infinite;
        stroke-linecap: round;
    }

    @keyframes p-progress-spinner-dash{
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }

        50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
        }
        100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
        }
    }
    @keyframes p-progress-spinner-color {
        100%, 0% {
            stroke: #ff5757;
        }
        40% {
            stroke: #696cff;
        }
        66% {
            stroke: #1ea97c;
        }
        80%, 90% {
            stroke: #cc8925;
        }
    }

    .progressbar-value-animate::after {
        will-change: left, right;
        animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
    }
    .progressbar-value-animate::before {
        will-change: left, right;
        animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    }
    @keyframes p-progressbar-indeterminate-anim {
        0% {
            left: -35%;
            right: 100%;
        }
        60% {
            left: 100%;
            right: -90%;
        }
        100% {
            left: 100%;
            right: -90%;
        }
    }

    .p-fadein {
        animation: p-fadein 250ms linear;
    }

    @keyframes p-fadein {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`
}, pi = {
  root: {
    class: [
      "relative",
      "[&>[data-pc-name=inputicon]]:absolute",
      "[&>[data-pc-name=inputicon]]:top-1/2",
      "[&>[data-pc-name=inputicon]]:-mt-2",
      "[&>[data-pc-name=inputicon]]:text-surface-900/60 dark:[&>[data-pc-name=inputicon]]:text-white/60",
      "[&>[data-pc-name=inputicon]:first-child]:left-3",
      "[&>[data-pc-name=inputicon]:last-child]:right-3",
      "[&>[data-pc-name=inputtext]:first-child]:pr-10",
      "[&>[data-pc-name=inputtext]:last-child]:pl-10",
      // filter
      "[&>[data-pc-extend=inputicon]]:absolute",
      "[&>[data-pc-extend=inputicon]]:top-1/2",
      "[&>[data-pc-extend=inputicon]]:-mt-2",
      "[&>[data-pc-extend=inputicon]]:text-surface-900/60 dark:[&>[data-pc-extend=inputicon]]:text-white/60",
      "[&>[data-pc-extend=inputicon]:first-child]:left-3",
      "[&>[data-pc-extend=inputicon]:last-child]:right-3"
    ]
  }
}, bi = {
  root: {
    class: "relative inline-block"
  },
  previewMask: {
    class: [
      // Flexbox & Alignment
      "flex items-center justify-center",
      // Positioning
      "absolute",
      // Shape
      "inset-0 opacity-0 transition-opacity duration-300",
      // Color
      "bg-transparent text-surface-100",
      // States
      "hover:opacity-100 hover:cursor-pointer hover:bg-black/50 hover:bg-opacity-50"
    ]
  },
  mask: {
    class: [
      // Flexbox & Alignment
      "flex items-center justify-center",
      // Positioning
      "fixed top-0 left-0",
      // Sizing
      "w-full h-full",
      // Color
      "bg-black/90"
    ]
  },
  toolbar: {
    class: [
      // Flexbox
      "flex",
      // Positioning
      "absolute top-0 right-0",
      // Spacing
      "p-4"
    ]
  },
  rotateRightButton: {
    class: [
      "z-20",
      // Flexbox & Alignment
      "flex justify-center items-center",
      // Size
      "w-12 h-12",
      // Spacing
      "mr-2",
      // Shape
      "rounded-full",
      // Color
      "text-white bg-transparent",
      // States
      "hover:text-white hover:bg-surface-0/10",
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400",
      // Transition
      "transition duration-200 ease-in-out"
    ]
  },
  rotateRightIcon: {
    class: "w-6 h-6"
  },
  rotateLeftButton: {
    class: [
      "z-20",
      // Flexbox & Alignment
      "flex justify-center items-center",
      // Size
      "w-12 h-12",
      // Spacing
      "mr-2",
      // Shape
      "rounded-full",
      // Color
      "text-white bg-transparent",
      // States
      "hover:text-white hover:bg-surface-0/10",
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400",
      // Transition
      "transition duration-200 ease-in-out"
    ]
  },
  rotateLeftIcon: {
    class: "w-6 h-6"
  },
  zoomOutButton: {
    class: [
      "z-20",
      // Flexbox & Alignment
      "flex justify-center items-center",
      // Size
      "w-12 h-12",
      // Spacing
      "mr-2",
      // Shape
      "rounded-full",
      // Color
      "text-white bg-transparent",
      // States
      "hover:text-white hover:bg-surface-0/10",
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400",
      // Transition
      "transition duration-200 ease-in-out"
    ]
  },
  zoomOutIcon: {
    class: "w-6 h-6"
  },
  zoomInButton: {
    class: [
      "z-20",
      // Flexbox & Alignment
      "flex justify-center items-center",
      // Size
      "w-12 h-12",
      // Spacing
      "mr-2",
      // Shape
      "rounded-full",
      // Color
      "text-white bg-transparent",
      // States
      "hover:text-white hover:bg-surface-0/10",
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400",
      // Transition
      "transition duration-200 ease-in-out"
    ]
  },
  zoomInIcon: {
    class: "w-6 h-6"
  },
  closeButton: {
    class: [
      "z-20",
      // Flexbox & Alignment
      "flex justify-center items-center",
      // Size
      "w-12 h-12",
      // Spacing
      "mr-2",
      // Shape
      "rounded-full",
      // Color
      "text-white bg-transparent",
      // States
      "hover:text-white hover:bg-surface-0/10",
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400",
      // Transition
      "transition duration-200 ease-in-out"
    ]
  },
  closeIcon: {
    class: "w-6 h-6"
  },
  transition: {
    enterFromClass: "opacity-0 scale-75",
    enterActiveClass: "transition-all duration-150 ease-in-out",
    leaveActiveClass: "transition-all duration-150 ease-in",
    leaveToClass: "opacity-0 scale-75"
  }
}, gi = {
  display: {
    class: [
      // Display
      "inline",
      // Spacing
      "px-3 py-2",
      // Shape
      "rounded-md",
      // Colors
      "text-surface-700 dark:text-white/80",
      // States
      "hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-800 dark:hover:text-white/80",
      // Transitions
      "transition",
      "duration-200",
      // Misc
      "cursor-pointer"
    ]
  }
}, hi = {
  root: {
    class: ["flex items-stretch", "w-full"]
  }
}, mi = {
  root: {
    class: [
      // Flex
      "flex items-center justify-center",
      // Shape
      "first:rounded-l-md",
      "last:rounded-r-md",
      "border-y",
      "last:border-r",
      "border-l",
      "border-r-0",
      // Space
      "p-2",
      // Size
      "min-w-[2.5rem]",
      // Color
      "bg-transparent dark:bg-surface-900",
      "text-surface-800 dark:text-white/80",
      "border-surface-300 dark:border-surface-700"
    ]
  }
}, vi = {
  pcinputtext: {
    root: ({ context: e, props: t, parent: r }) => {
      var n, o, a, s, i, l, c;
      return {
        class: [
          // Font
          "leading-none",
          // Spacing
          "m-0 py-2 px-3",
          // Colors
          "text-surface-800 dark:text-white/80",
          { "bg-surface-0 dark:bg-surface-950": !e.disabled },
          "border",
          { "border-surface-300 dark:border-surface-700": !t.invalid },
          // Invalid State
          "invalid:focus:ring-red-200",
          "invalid:hover:border-red-500",
          { "border-red-500 dark:border-red-400": t.invalid },
          // States
          {
            "hover:border-surface-400 dark:hover:border-surface-600": !e.disabled && !t.invalid,
            "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:z-10": !e.disabled,
            "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default": e.disabled
          },
          // Filled State *for FloatLabel
          {
            filled: ((n = r.instance) == null ? void 0 : n.$name) == "FloatLabel" && e.filled || ((a = (o = r.instance) == null ? void 0 : o.$parentInstance) == null ? void 0 : a.$name) == "FloatLabel" && r.props.modelValue !== null && ((s = r.props.modelValue) == null ? void 0 : s.length) !== 0
          },
          ((i = r.instance) == null ? void 0 : i.$name) == "FloatLabel" || ((c = (l = r.instance) == null ? void 0 : l.$parentInstance) == null ? void 0 : c.$name) == "FloatLabel" ? "placeholder:text-transparent dark:placeholder:text-transparent" : "placeholder:text-surface-400 dark:placeholder:text-surface-500",
          // Misc
          "rounded-md",
          "appearance-none",
          "transition-colors duration-200"
        ]
      };
    }
  }
}, yi = {
  root: ({ props: e, parent: t }) => ({
    class: [
      // Flex
      "inline-flex",
      "relative",
      { "flex-col": e.showButtons && e.buttonLayout === "vertical" },
      { "flex-1 w-[1%]": t.instance.$name === "InputGroup" },
      { "w-full": e.fluid },
      // Shape
      { "first:rounded-l-md rounded-none last:rounded-r-md": t.instance.$name === "InputGroup" && !e.showButtons },
      { "border-0 border-y border-l last:border-r border-surface-300 dark:border-surface-700": t.instance.$name === "InputGroup" && !e.showButtons },
      { "first:ml-0 -ml-px": t.instance.$name === "InputGroup" && !e.showButtons },
      //Sizing
      { "!w-16": e.showButtons && e.buttonLayout == "vertical" }
    ]
  }),
  pcInput: {
    root: ({ parent: e, context: t }) => {
      var r, n, o;
      return {
        class: [
          // Font
          "leading-none",
          // Display
          "flex-auto",
          { "w-[1%]": e.props.fluid },
          //Text
          { "text-center": e.props.showButtons && e.props.buttonLayout == "vertical" },
          // Spacing
          "py-2 px-3",
          "m-0",
          // Shape
          "rounded-md",
          { "rounded-l-none rounded-r-none": e.props.showButtons && e.props.buttonLayout === "horizontal" },
          { "rounded-none": e.props.showButtons && e.props.buttonLayout === "vertical" },
          { "border-0": ((r = e.instance.$parentInstance) == null ? void 0 : r.$name) === "InputGroup" && !e.props.showButtons },
          // Colors
          "text-surface-800 dark:text-white/80",
          "placeholder:text-surface-400 dark:placeholder:text-surface-500",
          { "bg-surface-0 dark:bg-surface-950": !t.disabled },
          "border",
          { "border-surface-300 dark:border-surface-700": !e.props.invalid },
          // Invalid State
          "invalid:focus:ring-danger-400",
          "invalid:hover:border-danger-400",
          { "border-red-500 dark:border-red-400": e.props.invalid },
          // States
          { "hover:border-secondary-400": !e.props.invalid },
          "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-secondary-500 dark:focus:ring-secondary-400 focus:z-10",
          { "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default": t.disabled },
          // Filled State *for FloatLabel
          { filled: ((o = (n = e.instance) == null ? void 0 : n.$parentInstance) == null ? void 0 : o.$name) === "FloatLabel" && e.state.d_modelValue !== null },
          //Position
          { "order-2": e.props.buttonLayout == "horizontal" || e.props.buttonLayout === "vertical" }
        ]
      };
    }
  },
  buttonGroup: ({ props: e }) => ({
    class: [
      "absolute",
      "z-20",
      // Flex
      "flex",
      "flex-col",
      "top-px right-px",
      { "h-[calc(100%-2px)]": e.showButtons && e.buttonLayout === "stacked" }
    ]
  }),
  incrementButton: ({ props: e }) => ({
    class: [
      // Display
      { "flex flex-initial shrink-0": e.showButtons && e.buttonLayout === "horizontal" },
      { "flex flex-auto": e.showButtons && e.buttonLayout === "stacked" },
      // Alignment
      "items-center",
      "justify-center",
      "text-center align-bottom",
      //Position
      "relative",
      { "order-3": e.showButtons && e.buttonLayout === "horizontal" },
      { "order-1": e.showButtons && e.buttonLayout === "vertical" },
      //Color
      "text-surface-800 dark:text-surface-0",
      "bg-transparent",
      { "dark:bg-surface-900": e.showButtons && e.buttonLayout !== "stacked" },
      "border border-surface-300 dark:border-surface-700",
      { "border-0": e.showButtons && e.buttonLayout === "stacked" },
      { "border-l-0": e.showButtons && e.buttonLayout !== "stacked" && e.buttonLayout === "horizontal" },
      { "border-b-0": e.showButtons && e.buttonLayout !== "stacked" && e.buttonLayout === "vertical" },
      // Sizing
      "w-[3rem]",
      { "px-3 py-2": e.showButtons && e.buttonLayout !== "stacked" },
      { "p-0": e.showButtons && e.buttonLayout === "stacked" },
      { "w-full": e.showButtons && e.buttonLayout === "vertical" },
      // Shape
      "rounded-md",
      { "rounded-md": e.showButtons && e.buttonLayout == "stacked" },
      { "rounded-bl-none rounded-tl-none": e.showButtons && e.buttonLayout === "horizontal" },
      { "rounded-bl-none rounded-br-none": e.showButtons && e.buttonLayout === "vertical" },
      //States
      "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]",
      //Misc
      "cursor-pointer overflow-hidden select-none"
    ]
  }),
  incrementIcon: "inline-block w-4 h-4",
  decrementButton: ({ props: e }) => ({
    class: [
      // Display
      { "flex flex-initial shrink-0": e.showButtons && e.buttonLayout === "horizontal" },
      { "flex flex-auto": e.showButtons && e.buttonLayout === "stacked" },
      // Alignment
      "items-center",
      "justify-center",
      "text-center align-bottom",
      //Position
      "relative",
      { "order-1": e.showButtons && e.buttonLayout === "horizontal" },
      { "order-3": e.showButtons && e.buttonLayout === "vertical" },
      //Color
      "text-surface-800 dark:text-surface-0",
      "bg-transparent",
      { "dark:bg-surface-900": e.showButtons && e.buttonLayout !== "stacked" },
      "border border-surface-300 dark:border-surface-700",
      { "border-0": e.showButtons && e.buttonLayout === "stacked" },
      { "border-r-0": e.showButtons && e.buttonLayout !== "stacked" && e.buttonLayout === "horizontal" },
      { "border-t-0": e.showButtons && e.buttonLayout !== "stacked" && e.buttonLayout === "vertical" },
      // Sizing
      "w-[3rem]",
      { "px-3 py-2": e.showButtons && e.buttonLayout !== "stacked" },
      { "p-0": e.showButtons && e.buttonLayout === "stacked" },
      { "w-full": e.showButtons && e.buttonLayout === "vertical" },
      // Shape
      "rounded-md",
      { "rounded-tr-none rounded-tl-none rounded-bl-none": e.showButtons && e.buttonLayout === "stacked" },
      { "rounded-tr-none rounded-br-none ": e.showButtons && e.buttonLayout === "horizontal" },
      { "rounded-tr-none rounded-tl-none ": e.showButtons && e.buttonLayout === "vertical" },
      //States
      "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]",
      //Misc
      "cursor-pointer overflow-hidden select-none"
    ]
  }),
  decrementIcon: "inline-block w-4 h-4"
}, xi = {
  root: {
    class: [
      // Alignment
      "flex items-center",
      "gap-2",
      "[&_[data-pc-name^=pcinput]]:w-10"
    ]
  }
}, ki = {
  root: ({ props: e, context: t, parent: r }) => {
    var n, o, a, s;
    return {
      class: [
        // Font
        "leading-none",
        // Flex
        { "flex-1 w-[1%]": r.instance.$name == "InputGroup" },
        // Spacing
        "m-0",
        { "w-full": e.fluid },
        // Size
        {
          "py-3 px-3.5": e.size == "large",
          "py-1.5 px-2": e.size == "small",
          "py-2 px-3": e.size == null
        },
        // Shape
        { "rounded-md": r.instance.$name !== "InputGroup" },
        { "first:rounded-l-md rounded-none last:rounded-r-md": r.instance.$name == "InputGroup" },
        { "border-0 border-y border-l last:border-r": r.instance.$name == "InputGroup" },
        { "first:ml-0 -ml-px": r.instance.$name == "InputGroup" && !e.showButtons },
        // Colors
        "text-surface-800 dark:text-white/80",
        "placeholder:text-surface-400 dark:placeholder:text-surface-500",
        { "bg-surface-0 dark:bg-surface-950": !t.disabled },
        "border",
        { "border-surface-300 dark:border-surface-700": !e.invalid },
        // Invalid State
        "invalid:focus:ring-danger-400",
        "invalid:hover:border-danger-400",
        { "border-danger-400 dark:border-danger-400": e.invalid },
        // States
        {
          "hover:border-surface-400 dark:hover:border-surface-600": !t.disabled && !e.invalid,
          "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-secondary-500 dark:focus:ring-secondary-400 focus:z-10": !t.disabled,
          "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default": t.disabled
        },
        // Filled State *for FloatLabel
        { filled: ((n = r.instance) == null ? void 0 : n.$name) == "FloatLabel" && t.filled || ((a = (o = r.instance) == null ? void 0 : o.$parentInstance) == null ? void 0 : a.$name) == "FloatLabel" && r.props.modelValue !== null && ((s = r.props.modelValue) == null ? void 0 : s.length) !== 0 },
        // Misc
        "appearance-none",
        "transition-colors duration-200"
      ]
    };
  }
}, wi = {
  root: ({ props: e }) => ({
    class: [
      // Misc
      { "opacity-60 select-none pointer-events-none cursor-default": e.disabled }
    ]
  }),
  range: {
    class: [
      // Stroke
      "stroke-current",
      // Color
      "stroke-surface-200 dark:stroke-surface-700",
      // Fill
      "fill-none",
      // Transition
      "transition duration-100 ease-in"
    ]
  },
  value: {
    class: [
      // Animation
      "animate-dash-frame",
      // Color
      "stroke-primary",
      // Fill
      "fill-none"
    ]
  },
  text: {
    class: [
      // Text Style
      "text-center text-xl",
      // Color
      "fill-surface-600 dark:fill-surface-200"
    ]
  }
}, _i = {
  root: ({ props: e }) => ({
    class: [
      "rounded-md",
      // Colors
      { "bg-surface-0 dark:bg-surface-900": !e.disabled },
      "text-surface-700 dark:text-white/80",
      "border",
      { "border-surface-300 dark:border-surface-700": !e.invalid },
      // Disabled State
      { "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default": e.disabled },
      // Invalid State
      { "border-red-500 dark:border-red-400": e.invalid }
    ]
  }),
  listContainer: "overflow-auto",
  list: {
    class: "p-1 list-none m-0 outline-none"
  },
  option: ({ context: e, props: t }) => ({
    class: [
      "relative",
      // Flex
      "flex items-center",
      // Font
      "leading-none",
      // Spacing
      "m-0 px-3 py-2",
      "first:mt-0 mt-[2px]",
      // Shape
      "border-0 rounded",
      // Colors
      {
        "bg-surface-200 dark:bg-surface-600/60": e.focused && !e.selected,
        "text-surface-700 dark:text-white/80": e.focused && !e.selected,
        "bg-highlight": e.selected && !t.checkmark,
        "bg-surface-0 dark:bg-surface-900": t.checkmark && e.selected
      },
      //States
      { "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.focused && !e.selected || t.checkmark && e.selected },
      { "hover:bg-highlight-emphasis": e.selected && !t.checkmark },
      { "hover:text-surface-700 hover:bg-surface-100 dark:hover:text-white dark:hover:bg-[rgba(255,255,255,0.03)]": e.focused && !e.selected },
      // Transition
      "transition-shadow duration-200",
      // Misc
      "cursor-pointer overflow-hidden whitespace-nowrap"
    ]
  }),
  optionGroup: {
    class: [
      "font-semibold",
      // Spacing
      "m-0 py-2 px-3",
      // Colors
      "text-surface-400 dark:text-surface-500",
      // Misc
      "cursor-auto"
    ]
  },
  optionCheckIcon: "relative -ms-1.5 me-1.5 text-surface-700 dark:text-white/80 w-4 h-4",
  emptyMessage: {
    class: [
      // Font
      "leading-none",
      // Spacing
      "py-2 px-3",
      // Color
      "text-surface-800 dark:text-white/80",
      "bg-transparent"
    ]
  },
  header: {
    class: [
      // Spacing
      "pt-2 px-2 pb-0",
      "m-0",
      //Shape
      "border-b-0",
      "rounded-tl-md",
      "rounded-tr-md",
      // Color
      "text-surface-700 dark:text-white/80",
      "bg-surface-0 dark:bg-surface-900",
      "border-surface-300 dark:border-surface-700",
      "[&_[data-pc-name=pcfilter]]:w-full"
    ]
  }
}, Si = {
  root: ({ props: e }) => ({
    class: [
      "relative",
      // Flexbox
      "flex",
      // Shape & Size
      "rounded-md",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "border border-surface-200 dark:border-surface-700",
      { "p-2 items-center": e.orientation == "horizontal", "flex-col sm:w-48 p-1": e.orientation !== "horizontal" }
    ]
  }),
  rootList: ({ props: e }) => ({
    class: [
      // Flexbox
      "sm:flex",
      "items-center",
      "flex-wrap",
      "flex-col sm:flex-row",
      { hidden: !(e != null && e.mobileActive), flex: e == null ? void 0 : e.mobileActive },
      // Position
      "absolute sm:relative",
      "top-full left-0",
      "sm:top-auto sm:left-auto",
      // Size
      "w-full sm:w-auto",
      // Spacing
      "m-0",
      "p-1 sm:py-0 sm:p-0",
      "list-none",
      // Shape
      "shadow-md sm:shadow-none",
      "border-0",
      // Color
      "bg-surface-0 dark:bg-surface-900 sm:bg-transparent dark:sm:bg-transparent",
      // Misc
      "outline-none"
    ]
  }),
  item: ({ props: e }) => ({
    class: [
      "sm:relative static my-[2px] [&:first-child]:mt-0",
      {
        "sm:w-auto w-full": e.horizontal,
        "w-full": !e.horizontal
      }
    ]
  }),
  itemContent: ({ context: e }) => ({
    class: [
      "rounded-[4px]",
      //  Colors
      {
        "text-surface-500 dark:text-white/70": !e.focused && !e.active,
        "text-surface-500 dark:text-white/70 bg-surface-200 dark:bg-surface-600/90": e.focused && !e.active,
        "bg-highlight text-highlight-contrast": e.focused && e.active || e.active || !e.focused && e.active
      },
      // Hover States
      {
        "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.active,
        "hover:bg-highlight-emphasis": e.active
      },
      // Transitions
      "transition-all",
      "duration-200"
    ]
  }),
  itemLink: {
    class: [
      "relative",
      // Flexbox
      "flex",
      "items-center",
      // Spacing
      "py-2",
      "px-3",
      // Size
      "leading-none",
      // Misc
      "select-none",
      "cursor-pointer",
      "no-underline ",
      "overflow-hidden"
    ]
  },
  itemIcon: {
    class: "mr-2"
  },
  submenuIcon: ({ props: e }) => ({
    class: [
      {
        "ml-auto sm:ml-2": e.horizontal,
        "ml-auto": !e.horizontal
      }
    ]
  }),
  overlay: ({ props: e }) => ({
    class: [
      // Size
      "w-auto",
      // Spacing
      "m-0",
      // Shape
      "shadow-none sm:shadow-md",
      "rounded-md",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      // Position
      "static sm:absolute",
      "z-10",
      {
        "sm:left-full top-0": !e.horizontal
      }
    ]
  }),
  grid: {
    class: "flex flex-wrap sm:flex-nowrap"
  },
  column: {
    class: "w-full sm:w-1/2"
  },
  submenu: {
    class: ["m-0 list-none", "p-1 px-2 w-full sm:min-w-[14rem]"]
  },
  submenuLabel: {
    class: [
      "font-semibold",
      // Spacing
      "py-2 px-3",
      "m-0",
      // Color
      "text-surface-400 dark:text-surface-500",
      "bg-surface-0 dark:bg-surface-900"
    ]
  },
  separator: {
    class: "border-t border-surface-200 dark:border-surface-600"
  },
  button: {
    class: [
      // Flexbox
      "flex sm:hidden",
      "items-center justify-center",
      // Size
      "w-7",
      "h-7",
      // Shape
      "rounded-full",
      // Color
      "text-surface-500 dark:text-white/80",
      // States
      "hover:text-surface-600 dark:hover:text-white/60",
      "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]",
      "focus:outline-none focus:outline-offset-0",
      "focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400",
      // Transitions
      "transition duration-200 ease-in-out",
      // Misc
      "cursor-pointer",
      "no-underline"
    ]
  },
  end: {
    class: "ml-auto self-center"
  }
}, Ci = {
  root: {
    class: [
      // Sizing and Shape
      "min-w-[12.5rem]",
      "rounded-md",
      // Spacing
      "p-1",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-white/80",
      "border border-surface-200 dark:border-surface-700"
    ]
  },
  list: {
    class: [
      // Spacings and Shape
      "list-none",
      "m-0",
      "p-0",
      "outline-none"
    ]
  },
  item: {
    class: "relative my-[2px] [&:first-child]:mt-0"
  },
  separator: {
    class: "border-t border-surface-200 dark:border-surface-600"
  },
  itemContent: ({ context: e }) => ({
    class: [
      //Shape
      "rounded-[4px]",
      // Colors
      {
        "text-surface-500 dark:text-white/70": !e.focused && !e.active,
        "text-surface-500 dark:text-white/70 bg-surface-200 dark:bg-surface-600/90": e.focused && !e.active,
        "bg-highlight text-highlight-contrast": e.focused && e.active || e.active || !e.focused && e.active
      },
      // Transitions
      "transition-shadow",
      "duration-200",
      // States
      {
        "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.active,
        "hover:bg-highlight-emphasis": e.active
      },
      // Disabled
      { "opacity-60 pointer-events-none cursor-default": e.disabled }
    ]
  }),
  itemLink: {
    class: [
      "relative",
      // Flexbox
      "flex",
      "items-center",
      // Spacing
      "py-2",
      "px-3",
      // Misc
      "no-underline",
      "overflow-hidden",
      "cursor-pointer",
      "select-none"
    ]
  },
  itemIcon: {
    class: [
      // Spacing
      "mr-2"
    ]
  },
  itemLabel: {
    class: ["leading-[normal]"]
  },
  submenuLabel: {
    class: [
      // Font
      "font-bold",
      // Spacing
      "m-0",
      "py-2 px-3",
      // Shape
      "rounded-tl-none",
      "rounded-tr-none",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-400 dark:text-surface-600"
    ]
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0"
  }
}, $i = {
  root: {
    class: [
      "relative",
      // Flexbox
      "flex",
      "items-center",
      // Spacing
      "p-2",
      // Shape
      "rounded-md",
      // Color
      "bg-surface-0 dark:bg-surface-800",
      "border border-surface-200 dark:border-none"
    ]
  },
  rootList: ({ props: e }) => ({
    class: [
      // Flexbox
      "sm:flex",
      "items-center",
      "flex-wrap",
      "flex-col sm:flex-row",
      { hidden: !(e != null && e.mobileActive), flex: e == null ? void 0 : e.mobileActive },
      // Position
      "absolute sm:relative",
      "top-full left-0",
      "sm:top-auto sm:left-auto",
      // Size
      "w-full sm:w-auto",
      // Spacing
      "m-0",
      "p-1 sm:py-0 sm:p-0",
      "list-none",
      // Shape
      "shadow-md sm:shadow-none",
      "border-0",
      // Color
      "bg-surface-0 dark:bg-surface-800 sm:bg-transparent",
      // Misc
      "outline-none"
    ]
  }),
  item: {
    class: "sm:relative sm:w-auto w-full static my-[2px] [&:first-child]:mt-0"
  },
  itemContent: ({ context: e }) => ({
    class: [
      // Shape
      "rounded-[4px]",
      // Colors
      {
        "text-surface-500 dark:text-white/70": !e.focused && !e.active,
        "text-surface-500 dark:text-white/70 bg-surface-200 dark:bg-surface-600/90": e.focused && !e.active,
        "bg-highlight text-highlight-contrast": e.focused && e.active || e.active || !e.focused && e.active
      },
      // States
      {
        "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.active,
        "hover:bg-highlight-emphasis": e.active
      },
      // Disabled State
      { "opacity-60 pointer-events-none cursor-default": e.disabled },
      // Transitions
      "transition-all",
      "duration-200"
    ]
  }),
  itemLink: ({ context: e }) => ({
    class: [
      "relative",
      // Flexbox
      "flex",
      "items-center",
      // Spacing
      "py-2",
      "px-3",
      // Size
      {
        "pl-9 sm:pl-5": e.level === 1,
        "pl-14 sm:pl-5": e.level === 2
      },
      "leading-none",
      // Misc
      "select-none",
      "cursor-pointer",
      "no-underline ",
      "overflow-hidden"
    ]
  }),
  itemIcon: {
    class: "mr-2"
  },
  submenuIcon: ({ props: e }) => ({
    class: [
      {
        "ml-auto sm:ml-2": e.root,
        "ml-auto": !e.root
      }
    ]
  }),
  submenu: ({ props: e }) => ({
    class: [
      "flex flex-col",
      // Size
      "rounded-md",
      "min-w-[12.5rem]",
      // Spacing
      "p-1",
      "m-0",
      "list-none",
      // Shape
      "shadow-none sm:shadow-md",
      "border border-surface-200 dark:border-surface-700",
      // Position
      "static sm:absolute",
      "z-10",
      { "sm:absolute sm:left-full sm:top-0": e.level > 1 },
      // Color
      "bg-surface-0 dark:bg-surface-900"
    ]
  }),
  separator: {
    class: "border-t border-surface-200 dark:border-surface-600"
  },
  button: {
    class: [
      // Flexbox
      "flex sm:hidden",
      "items-center justify-center",
      // Size
      "w-7",
      "h-7",
      // Shape
      "rounded-full",
      // Color
      "text-surface-500 dark:text-white/80",
      // States
      "hover:text-surface-600 dark:hover:text-white/60",
      "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]",
      "focus:outline-none focus:outline-offset-0",
      "focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400",
      // Transitions
      "transition duration-200 ease-in-out",
      // Misc
      "cursor-pointer",
      "no-underline"
    ]
  },
  end: {
    class: "ml-auto self-center"
  }
}, Ti = {
  root: ({ props: e }) => ({
    class: [
      // Spacing and Shape
      "rounded-md",
      "outline",
      // Colors
      {
        "bg-blue-100/70 dark:bg-blue-500/20": e.severity == "info",
        "bg-green-100/70 dark:bg-green-500/20": e.severity == "success",
        "bg-surface-100/70 dark:bg-surface-500/20": e.severity == "secondary",
        "bg-orange-100/70 dark:bg-orange-500/20": e.severity == "warn",
        "bg-red-100/70 dark:bg-red-500/20": e.severity == "error",
        "bg-surface-950 dark:bg-surface-0": e.severity == "contrast"
      },
      {
        "outline-blue-200 dark:outline-blue-500/20": e.severity == "info",
        "outline-green-200 dark:outline-green-500/20": e.severity == "success",
        "outline-surface-200 dark:outline-surface-500/20": e.severity == "secondary",
        "outline-orange-200 dark:outline-orange-500/20": e.severity == "warn",
        "outline-red-200 dark:outline-red-500/20": e.severity == "error",
        "outline-surface-950 dark:outline-surface-0": e.severity == "contrast"
      },
      {
        "text-blue-700 dark:text-blue-300": e.severity == "info",
        "text-green-700 dark:text-green-300": e.severity == "success",
        "text-surface-700 dark:text-surface-300": e.severity == "secondary",
        "text-orange-700 dark:text-orange-300": e.severity == "warn",
        "text-red-700 dark:text-red-300": e.severity == "error",
        "text-surface-0 dark:text-surface-950": e.severity == "contrast"
      }
    ]
  }),
  content: {
    class: [
      // Flexbox
      "flex items-center h-full",
      // Spacing
      "py-2 px-3 gap-2"
    ]
  },
  icon: {
    class: [
      // Sizing and Spacing
      "shrink-0 w-[1.125rem] h-[1.125rem]"
    ]
  },
  text: {
    class: [
      // Font and Text
      "text-base leading-[normal]",
      "font-medium"
    ]
  },
  closeButton: ({ props: e }) => ({
    class: [
      // Flexbox
      "flex items-center justify-center",
      // Size
      "w-7 h-7",
      // Spacing and Misc
      "ml-auto relative",
      // Shape
      "rounded-full",
      // Colors
      "bg-transparent",
      // Transitions
      "transition duration-200 ease-in-out",
      // States
      "hover:bg-surface-0/30 dark:hover:bg-[rgba(255,255,255,0.03)]",
      "focus:outline-none focus:outline-offset-0 focus:ring-1",
      {
        "focus:ring-blue-500 dark:focus:ring-blue-400": e.severity == "info",
        "focus:ring-green-500 dark:focus:ring-green-400": e.severity == "success",
        "focus:ring-surface-500 dark:focus:ring-surface-400": e.severity == "secondary",
        "focus:ring-orange-500 dark:focus:ring-orange-400": e.severity == "warn",
        "focus:ring-red-500 dark:focus:ring-red-4000": e.severity == "error",
        "focus:ring-surface-0 dark:focus:ring-surface-950": e.severity == "contrast"
      },
      // Misc
      "overflow-hidden"
    ]
  }),
  transition: {
    enterFromClass: "opacity-0",
    enterActiveClass: "transition-opacity duration-300",
    leaveFromClass: "max-h-40",
    leaveActiveClass: "overflow-hidden transition-all duration-300 ease-in",
    leaveToClass: "max-h-0 opacity-0 !m-0"
  }
}, Pi = {
  root: ({ props: e }) => ({
    class: [
      // Flexbox
      "flex gap-4",
      { "flex-col": e.orientation == "horizontal", "flex-row": e.orientation == "vertical" }
    ]
  }),
  meters: ({ props: e }) => ({
    class: [
      // Flexbox
      "flex",
      { "flex-col": e.orientation === "vertical" },
      // Sizing
      { "w-2 h-full": e.orientation === "vertical" },
      { "h-2": e.orientation === "horizontal" },
      // Colors
      "bg-gray-200 dark:bg-gray-700",
      // Border Radius
      "rounded-lg"
    ]
  }),
  meter: ({ props: e }) => ({
    class: [
      // Shape
      "border-0",
      // Rounded Corners - Horizontal
      {
        "first:rounded-l-lg last:rounded-r-lg": e.orientation === "horizontal"
      },
      // Rounded Corners - Vertical
      {
        "first:rounded-t-lg last:rounded-b-lg": e.orientation === "vertical"
      },
      // Colors
      "bg-primary"
    ]
  }),
  labelList: ({ props: e }) => ({
    class: [
      // Display & Flexbox
      "flex flex-wrap",
      { "gap-4": e.labelOrientation === "horizontal" },
      { "gap-2": e.labelOrientation === "vertical" },
      { "flex-col": e.labelOrientation === "vertical" },
      // Conditional Alignment - Horizontal
      {
        "align-end": e.labelOrientation === "horizontal" && e.labelPosition === "end",
        "align-start": e.labelOrientation === "horizontal" && e.labelPosition === "start"
      },
      // Conditional Alignment - Vertical
      {
        "justify-start": e.labelOrientation === "vertical" && e.labelPosition === "start"
      },
      // List Styling
      "m-0 p-0 list-none"
    ]
  }),
  label: {
    class: [
      // Flexbox
      "inline-flex",
      "items-center",
      "gap-2"
    ]
  },
  labelMarker: {
    class: [
      // Display
      "inline-flex",
      // Background Color
      "bg-primary",
      // Size
      "w-2 h-2",
      // Rounded Shape
      "rounded-full"
    ]
  }
}, Oi = {
  root: ({ props: e, state: t }) => ({
    class: [
      // Font
      "leading-none",
      // Display and Position
      "inline-flex",
      "relative",
      // Shape
      "rounded-md",
      // Color and Background
      { "bg-surface-0 dark:bg-surface-950": !e.disabled },
      "border",
      { "border-surface-300 dark:border-surface-600": !e.invalid },
      // Invalid State
      "invalid:focus:ring-red-200",
      "invalid:hover:border-red-500",
      { "border-red-500 dark:border-red-400": e.invalid },
      // Transitions
      "transition-all",
      "duration-200",
      // States
      { "hover:border-surface-400 dark:hover:border-surface-700": !e.invalid },
      { "outline-none outline-offset-0 z-10 ring-1 ring-primary-500 dark:ring-primary-400": t.focused },
      // Misc
      "cursor-pointer",
      "select-none",
      { "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default": e.disabled }
    ]
  }),
  labelContainer: "overflow-hidden flex flex-auto cursor-pointer",
  label: ({ props: e, parent: t }) => {
    var r, n, o, a, s, i, l, c;
    return {
      class: [
        "text-base leading-2",
        // Spacing
        {
          "py-2 px-3": e.display === "comma" || e.display === "chip" && !((r = e == null ? void 0 : e.modelValue) != null && r.length),
          "py-1 px-1": e.display === "chip" && ((n = e == null ? void 0 : e.modelValue) == null ? void 0 : n.length) > 0
        },
        // Color
        { "text-surface-800 dark:text-white/80": (o = e.modelValue) == null ? void 0 : o.length, "text-surface-400 dark:text-surface-500": !((a = e.modelValue) != null && a.length) },
        {
          "placeholder:text-transparent dark:placeholder:text-transparent": ((s = t.instance) == null ? void 0 : s.$name) == "FloatLabel",
          "!text-transparent dark:!text-transparent": ((i = t.instance) == null ? void 0 : i.$name) == "FloatLabel" && e.modelValue == null || ((l = e.modelValue) == null ? void 0 : l.length) == 0
        },
        // Filled State *for FloatLabel
        { filled: ((c = t.instance) == null ? void 0 : c.$name) == "FloatLabel" && e.modelValue !== null },
        // Transitions
        "transition duration-200",
        // Misc
        "overflow-hidden whitespace-nowrap cursor-pointer overflow-ellipsis"
      ]
    };
  },
  dropdown: {
    class: [
      // Flexbox
      "flex items-center justify-center",
      "shrink-0",
      // Color and Background
      "bg-transparent",
      "text-surface-500",
      // Size
      "w-12",
      // Shape
      "rounded-r-md"
    ]
  },
  overlay: {
    class: [
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-white/80",
      // Shape
      "border border-surface-300 dark:border-surface-700",
      "rounded-md",
      "shadow-md",
      "mt-[2px]"
    ]
  },
  header: {
    class: [
      //Flex
      "flex items-center justify-between",
      // Spacing
      "pt-2 px-4 pb-0 gap-2",
      "m-0",
      //Shape
      "border-b-0",
      "rounded-tl-md",
      "rounded-tr-md",
      // Color
      "text-surface-700 dark:text-white/80",
      "bg-surface-0 dark:bg-surface-900",
      "border-surface-300 dark:border-surface-700",
      "[&_[data-pc-name=pcfiltercontainer]]:!flex-auto",
      "[&_[data-pc-name=pcfilter]]:w-full"
    ]
  },
  listContainer: {
    class: [
      // Sizing
      "max-h-[200px]",
      // Misc
      "overflow-auto"
    ]
  },
  list: {
    class: "p-1 list-none m-0"
  },
  option: ({ context: e }) => ({
    class: [
      "relative",
      "flex items-center",
      // Font
      "leading-none",
      // Spacing
      "m-0 px-3 py-2 gap-2",
      "first:mt-0 mt-[2px]",
      // Shape
      "border-0 rounded",
      // Colors
      {
        "bg-surface-200 dark:bg-surface-600/60": e.focused && !e.selected,
        "text-surface-700 dark:text-white/80": e.focused && !e.selected,
        "bg-highlight": e.selected
      },
      //States
      { "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.focused && !e.selected },
      { "hover:bg-highlight-emphasis": e.selected },
      { "hover:text-surface-700 hover:bg-surface-100 dark:hover:text-white dark:hover:bg-[rgba(255,255,255,0.03)]": e.focused && !e.selected },
      // Transition
      "transition-shadow duration-200",
      // Misc
      "cursor-pointer overflow-hidden whitespace-nowrap"
    ]
  }),
  optionGroup: {
    class: [
      "font-semibold",
      // Spacing
      "m-0 py-2 px-3",
      // Colors
      "text-surface-400 dark:text-surface-500",
      // Misc
      "cursor-auto"
    ]
  },
  emptyMessage: {
    class: [
      // Font
      "leading-none",
      // Spacing
      "py-2 px-3",
      // Color
      "text-surface-800 dark:text-white/80",
      "bg-transparent"
    ]
  },
  loadingIcon: {
    class: "text-surface-400 dark:text-surface-500 animate-spin"
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0"
  }
}, Ai = {
  root: "flex",
  controls: {
    class: [
      // Flexbox & Alignment
      "flex xl:flex-col justify-center gap-2",
      // Spacing
      "p-[1.125rem]"
    ]
  },
  container: {
    class: [
      "flex-auto",
      // Shape
      "rounded-md",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "border border-surface-200 dark:border-surface-700",
      "outline-none"
    ]
  }
}, ji = {
  table: {
    class: [
      // Spacing & Position
      "mx-auto my-0",
      // Table Style
      "border-spacing-0 border-separate"
    ]
  },
  cell: {
    class: [
      // Alignment
      "text-center align-top",
      // Spacing
      "py-0 px-3"
    ]
  },
  node: ({ context: e }) => ({
    class: [
      "relative inline-block",
      // Spacing
      "py-3 px-4",
      // Shape
      "border",
      "rounded-md",
      "border-surface-200 dark:border-surface-700",
      // Color
      {
        "text-surface-600 dark:text-white/80": !(e != null && e.selected),
        "bg-surface-0 dark:bg-surface-900": !(e != null && e.selected),
        "bg-highlight": e == null ? void 0 : e.selected
      },
      // States
      {
        "hover:bg-surface-100 dark:hover:bg-surface-800": (e == null ? void 0 : e.selectable) && !(e != null && e.selected),
        "hover:bg-highlight-emphasis": (e == null ? void 0 : e.selectable) && (e == null ? void 0 : e.selected)
      },
      { "cursor-pointer": e == null ? void 0 : e.selectable }
    ]
  }),
  lineCell: {
    class: [
      // Alignment
      "text-center align-top",
      // Spacing
      "py-0 px-3"
    ]
  },
  connectorDown: {
    class: [
      // Spacing
      "mx-auto my-0",
      // Size
      "w-px h-[20px]",
      // Color
      "bg-surface-200 dark:bg-surface-700"
    ]
  },
  connectorLeft: ({ context: e }) => ({
    class: [
      // Alignment
      "text-center align-top",
      // Spacing
      "py-0 px-3",
      // Shape
      "rounded-none border-r",
      { "border-t": e.lineTop },
      // Color
      "border-surface-200 dark:border-surface-700"
    ]
  }),
  connectorRight: ({ context: e }) => ({
    class: [
      // Alignment
      "text-center align-top",
      // Spacing
      "py-0 px-3",
      // Shape
      "rounded-none",
      // Color
      { "border-t border-surface-200 dark:border-surface-700": e.lineTop }
    ]
  }),
  nodeCell: {
    class: "text-center align-top py-0 px-3"
  },
  nodeToggleButton: {
    class: [
      // Position
      "absolute bottom-[-0.75rem] left-2/4 -ml-3",
      "z-20",
      // Flexbox
      "flex items-center justify-center",
      // Size
      "w-6 h-6",
      // Shape
      "rounded-full",
      "border border-surface-200 dark:border-surface-700",
      // Color
      "bg-inherit text-inherit",
      // Focus
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400",
      // Misc
      "cursor-pointer no-underline select-none"
    ]
  },
  nodeToggleButtonIcon: {
    class: [
      // Position
      "static inline-block",
      // Size
      "w-4 h-4"
    ]
  }
}, Ii = {
  root: {
    class: [
      "relative",
      "[&>[data-pc-name=pcbadge]]:absolute",
      "[&>[data-pc-name=pcbadge]]:top-0",
      "[&>[data-pc-name=pcbadge]]:right-0",
      "[&>[data-pc-name=pcbadge]]:translate-x-1/2",
      "[&>[data-pc-name=pcbadge]]:-translate-y-1/2",
      "[&>[data-pc-name=pcbadge]]:m-0",
      "[&>[data-pc-name=pcbadge]]:origin-[100%_0]",
      "[&>[data-pc-name=pcbadge]]:outline",
      "[&>[data-pc-name=pcbadge]]:outline-[2px]",
      "[&>[data-pc-name=pcbadge]]:outline-surface-0",
      "dark:[&>[data-pc-name=pcbadge]]:outline-surface-900"
    ]
  }
}, zi = {
  root: {
    class: [
      // Flex & Alignment
      "flex items-center justify-center flex-wrap",
      // Spacing
      "px-4 py-2",
      // Shape
      "border-0 rounded-md",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-500 dark:text-white/60"
    ]
  },
  first: ({ context: e }) => ({
    class: [
      "relative",
      // Flex & Alignment
      "inline-flex items-center justify-center",
      // Shape
      "border-0 rounded-full",
      // Size
      "min-w-[2.5rem] h-10 m-[0.143rem]",
      "leading-none",
      // Color
      "text-surface-500 dark:text-white/60",
      // State
      {
        "hover:bg-surface-50 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.disabled,
        "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400": !e.disabled
      },
      // Transition
      "transition duration-200",
      // Misc
      "user-none overflow-hidden",
      { "cursor-default pointer-events-none opacity-60": e.disabled }
    ]
  }),
  prev: ({ context: e }) => ({
    class: [
      "relative",
      // Flex & Alignment
      "inline-flex items-center justify-center",
      // Shape
      "border-0 rounded-full",
      // Size
      "min-w-[2.5rem] h-10 m-[0.143rem]",
      "leading-none",
      // Color
      "text-surface-500 dark:text-white/60",
      // State
      {
        "hover:bg-surface-50 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.disabled,
        "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400": !e.disabled
      },
      // Transition
      "transition duration-200",
      // Misc
      "user-none overflow-hidden",
      { "cursor-default pointer-events-none opacity-60": e.disabled }
    ]
  }),
  next: ({ context: e }) => ({
    class: [
      "relative",
      // Flex & Alignment
      "inline-flex items-center justify-center",
      // Shape
      "border-0 rounded-full",
      // Size
      "min-w-[2.5rem] h-10 m-[0.143rem]",
      "leading-none",
      // Color
      "text-surface-500 dark:text-white/60",
      // State
      {
        "hover:bg-surface-50 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.disabled,
        "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400": !e.disabled
      },
      // Transition
      "transition duration-200",
      // Misc
      "user-none overflow-hidden",
      { "cursor-default pointer-events-none opacity-60": e.disabled }
    ]
  }),
  last: ({ context: e }) => ({
    class: [
      "relative",
      // Flex & Alignment
      "inline-flex items-center justify-center",
      // Shape
      "border-0 rounded-full",
      // Size
      "min-w-[2.5rem] h-10 m-[0.143rem]",
      "leading-none",
      // Color
      "text-surface-500 dark:text-white/60",
      // State
      {
        "hover:bg-surface-50 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.disabled,
        "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400": !e.disabled
      },
      // Transition
      "transition duration-200",
      // Misc
      "user-none overflow-hidden",
      { "cursor-default pointer-events-none opacity-60": e.disabled }
    ]
  }),
  page: ({ context: e }) => ({
    class: [
      "relative",
      // Flex & Alignment
      "inline-flex items-center justify-center",
      // Shape
      "border-0 rounded-full",
      // Size
      "min-w-[2.5rem] h-10 m-[0.143rem]",
      "leading-none",
      // Color
      {
        "bg-highlight text-highlight-contrast border-highlight text-highlight-contrast hover:bg-highlight-emphasis ": e.active,
        "text-surface-500 dark:text-white/60": !e.active
      },
      // State
      {
        "hover:bg-surface-50 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.disabled && !e.active,
        "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400": !e.disabled
      },
      // Transition
      "transition duration-200",
      // Misc
      "user-none overflow-hidden",
      { "cursor-default pointer-events-none opacity-60": e.disabled }
    ]
  }),
  contentStart: "mr-auto",
  contentEnd: "ml-auto"
}, Li = {
  root: {
    class: [
      //Shape
      "rounded-md",
      //Colors
      "border border-surface-200 dark:border-surface-700",
      "bg-surface-0 dark:bg-surface-900"
    ]
  },
  header: ({ props: e }) => ({
    class: [
      // Flex
      "flex items-center justify-between",
      // Colors
      "text-surface-700 dark:text-surface-0/80",
      "bg-transparent",
      //Shape
      "rounded-tl-md rounded-tr-md",
      "border-0",
      // Conditional Spacing
      { "p-[1.125rem]": !e.toggleable, "py-3 px-[1.125rem]": e.toggleable }
    ]
  }),
  title: {
    class: "leading-none font-semibold"
  },
  pctogglebutton: {
    root: {
      class: [
        // Positioning
        "relative",
        // Flexbox alignment
        "inline-flex items-center justify-center text-center",
        // Line height
        "leading-[normal]",
        // Size
        "w-10 h-10 px-0 py-2",
        // Shape
        "rounded-[50%] rounded-full",
        // Background and border
        "bg-transparent border-transparent",
        // Text color
        "text-surface-500 dark:text-surface-300",
        // Focus states
        "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-surface-500 dark:focus:ring-surface-400",
        // Hover effect
        "hover:bg-surface-300/10",
        // Transition effects
        "transition duration-200 ease-in-out",
        // Cursor and overflow
        "cursor-pointer overflow-hidden select-none"
      ]
    }
  },
  content: {
    class: [
      // Spacing
      "p-[1.125rem] pt-0",
      // Shape
      "border-0 border-t-0 last:rounded-br-md last:rounded-bl-md",
      //Color
      "text-surface-700 dark:text-surface-0/80"
    ]
  },
  footer: {
    class: [
      // Spacing
      "p-[1.125rem] pt-0",
      // Shape
      "border-0 border-t-0 rounded-br-lg rounded-bl-lg",
      //Color
      "text-surface-700 dark:text-surface-0/80"
    ]
  },
  transition: {
    enterFromClass: "max-h-0",
    enterActiveClass: "overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.42,0,0.58,1)]",
    enterToClass: "max-h-[1000px]",
    leaveFromClass: "max-h-[1000px]",
    leaveActiveClass: "overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0,1,0,1)]",
    leaveToClass: "max-h-0"
  }
}, Ei = {
  panel: {
    class: "p-1 overflow-hidden mb-3 border border-surface-200 dark:border-surface-700 rounded-md"
  },
  header: {
    class: ["rounded-[4px]", "outline-none"]
  },
  headerContent: ({ context: e }) => ({
    class: [
      // Shape
      "rounded-[4px]",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-600 dark:text-surface-0/80",
      { "text-surface-900": e.active },
      // States
      "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]",
      "hover:text-surface-900",
      // Transition
      "transition duration-200 ease-in-out",
      "transition-shadow duration-200"
    ]
  }),
  headerLink: {
    class: [
      "relative",
      // Font
      "font-semibold",
      "leading-none",
      // Flex & Alignments
      "flex items-center",
      // Spacing
      "py-2 px-3",
      // Misc
      "select-none cursor-pointer no-underline"
    ]
  },
  headerLabel: {
    class: "leading-none"
  },
  headerIcon: {
    class: "mr-2"
  },
  submenuIcon: {
    class: "mr-2"
  },
  content: {
    class: [
      // Spacing
      "pl-4",
      // Color
      "text-surface-700 dark:text-white/80",
      "bg-surface-0 dark:bg-surface-900"
    ]
  },
  rootList: {
    class: ["outline-none", "m-0 p-0 list-none"]
  },
  menuitem: {
    class: "relative my-[2px]"
  },
  itemContent: {
    class: [
      // Shape
      "border-none rounded-[4px]",
      // Color
      "text-surface-700 dark:text-white/80",
      // Transition
      "transition-shadow duration-200"
    ]
  },
  itemLink: ({ context: e }) => ({
    class: [
      "relative",
      // Font
      "leading-none",
      // Flex & Alignments
      "flex items-center",
      // Spacing
      "py-2 px-3",
      // Shape
      "rounded-[4px]",
      // Color
      "text-surface-700 dark:text-white/80",
      // States
      "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)] hover:text-surface-700 dark:hover:text-white/80",
      {
        "bg-surface-200 text-surface-700 dark:text-white/80 dark:bg-surface-0/10": e.focused
      },
      // Misc
      "cursor-pointer no-underline",
      "select-none overflow-hidden"
    ]
  }),
  itemIcon: {
    class: "mr-2"
  },
  submenu: {
    class: "p-0 pl-4 m-0 list-none"
  },
  transition: {
    enterFromClass: "max-h-0",
    enterActiveClass: "overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.42,0,0.58,1)]",
    enterToClass: "max-h-[1000px]",
    leaveFromClass: "max-h-[1000px]",
    leaveActiveClass: "overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0,1,0,1)]",
    leaveToClass: "max-h-0"
  }
}, Ni = {
  root: ({ props: e }) => ({
    class: ["relative [&>input]:w-full", { "[&>input]:pr-10": e.toggleMask }, { "flex [&>input]:w-full": e.fluid, "inline-flex": !e.fluid }]
  }),
  overlay: {
    class: [
      // Spacing
      "p-3",
      // Shape
      "border",
      "shadow-md rounded-md",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-white/80",
      "border-surface-200 dark:border-surface-700"
    ]
  },
  meter: {
    class: [
      // Position and Overflow
      "overflow-hidden",
      "relative",
      // Shape and Size
      "border-0",
      "h-[10px]",
      "rounded-md",
      // Spacing
      "mb-3",
      // Colors
      "bg-surface-100 dark:bg-surface-700"
    ]
  },
  meterLabel: ({ instance: e }) => {
    var t, r, n;
    return {
      class: [
        // Size
        "h-full",
        // Colors
        {
          "bg-red-500 dark:bg-red-400/50": ((t = e == null ? void 0 : e.meter) == null ? void 0 : t.strength) == "weak",
          "bg-orange-500 dark:bg-orange-400/50": ((r = e == null ? void 0 : e.meter) == null ? void 0 : r.strength) == "medium",
          "bg-green-500 dark:bg-green-400/50": ((n = e == null ? void 0 : e.meter) == null ? void 0 : n.strength) == "strong"
        },
        // Transitions
        "transition-all duration-1000 ease-in-out"
      ]
    };
  },
  maskIcon: {
    class: ["absolute top-1/2 right-3 -mt-2 z-10", "text-surface-600 dark:text-white/70"]
  },
  unmaskIcon: {
    class: ["absolute top-1/2 right-3 -mt-2 z-10", "text-surface-600 dark:text-white/70"]
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0"
  }
}, Ri = {
  root: "flex [&_[data-pc-name=pclist]]:h-full",
  sourceControls: {
    class: [
      // Flexbox & Alignment
      "flex xl:flex-col justify-center gap-2",
      // Spacing
      "p-[1.125rem]"
    ]
  },
  sourceListContainer: {
    class: [
      // Flexbox
      "grow shrink basis-2/4",
      // Shape
      "rounded-md",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "border border-surface-200 dark:border-surface-700",
      "outline-none"
    ]
  },
  transferControls: {
    class: [
      // Flexbox & Alignment
      "flex xl:flex-col justify-center gap-2",
      // Spacing
      "p-[1.125rem]"
    ]
  },
  targetListContainer: {
    class: [
      // Flexbox
      "grow shrink basis-2/4",
      // Shape
      "rounded-md",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "border border-surface-200 dark:border-surface-700",
      "outline-none"
    ]
  },
  targetControls: {
    class: [
      // Flexbox & Alignment
      "flex xl:flex-col justify-center gap-2",
      // Spacing
      "p-[1.125rem]"
    ]
  },
  transition: {
    enterFromClass: "!transition-none",
    enterActiveClass: "!transition-none",
    leaveActiveClass: "!transition-none",
    leaveToClass: "!transition-none"
  }
}, ao = {
  root: {
    class: [
      // Shape
      "rounded-md shadow-lg",
      // Position
      "absolute left-0 top-0 mt-3",
      '[&[data-p-popover-flipped="true"]]:mb-3 [&[data-p-popover-flipped="true"]]:-mt-3',
      "z-40 transform origin-center",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-surface-0/80",
      // Before: Arrow
      "before:absolute before:w-0 before:-top-3 before:h-0 before:border-transparent before:border-solid before:ml-[10px] before:border-x-[10px] before:border-b-[10px] before:border-t-0 before:border-b-surface-200 dark:before:border-b-surface-700",
      "after:absolute after:w-0 after:-top-[0.54rem] after:left-[4px] after:h-0 after:border-transparent after:border-solid after:ml-[8px] after:border-x-[8px] after:border-b-[8px] after:border-t-0 after:border-b-surface-0 dark:after:border-b-surface-900",
      // Flipped: Arrow
      '[&[data-p-popover-flipped="true"]]:before:-bottom-3 [&[data-p-popover-flipped="true"]]:before:top-auto [&[data-p-popover-flipped="true"]]:before:border-b-0 [&[data-p-popover-flipped="true"]]:before:border-t-[10px] [&[data-p-popover-flipped="true"]]:before:border-t-surface-200 dark:[&[data-p-popover-flipped="true"]]:before:border-t-surface-700',
      '[&[data-p-popover-flipped="true"]]:after:-bottom-[0.54rem] [&[data-p-popover-flipped="true"]]:after:top-auto [&[data-p-popover-flipped="true"]]:after:border-b-0 [&[data-p-popover-flipped="true"]]:after:border-t-[8px] [&[data-p-popover-flipped="true"]]:after:border-t-surface-0 dark:[&[data-p-popover-flipped="true"]]:after:border-t-surface-900'
    ]
  },
  content: {
    class: ["p-5 items-center flex", "rounded-lg", "border border-surface-200 dark:border-surface-700"]
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0"
  }
}, Mi = {
  root: {
    class: [
      // Position and Overflow
      "overflow-hidden",
      "relative",
      // Shape and Size
      "border-0",
      "h-5",
      "rounded-md",
      // Colors
      "bg-surface-100 dark:bg-surface-800"
    ]
  },
  value: ({ props: e }) => ({
    class: [
      // Flexbox & Overflow & Position
      { "absolute flex items-center justify-center overflow-hidden": e.mode !== "indeterminate" },
      // Colors
      "bg-primary",
      // Spacing & Sizing
      "m-0",
      { "h-full w-0": e.mode !== "indeterminate" },
      // Shape
      "border-0",
      // Transitions
      {
        "transition-width duration-1000 ease-in-out": e.mode !== "indeterminate",
        "progressbar-value-animate": e.mode == "indeterminate"
      },
      // Before & After (indeterminate)
      {
        "before:absolute before:top-0 before:left-0 before:bottom-0 before:bg-inherit ": e.mode == "indeterminate",
        "after:absolute after:top-0 after:left-0 after:bottom-0 after:bg-inherit after:delay-1000": e.mode == "indeterminate"
      }
    ]
  }),
  label: {
    class: [
      //Font
      "text-xs font-semibold",
      // Flexbox
      "inline-flex",
      // Font and Text
      "text-white dark:text-surface-900",
      "leading-5"
    ]
  }
}, Fi = {
  root: {
    class: [
      // Position
      "relative",
      "mx-auto",
      // Sizing
      "w-28",
      "h-28",
      // Flexbox
      "inline-block",
      // Pseudo-Elements
      "before:block",
      "before:pt-full"
    ]
  },
  spinner: {
    class: [
      // Position
      "absolute",
      "top-0",
      "bottom-0",
      "left-0",
      "right-0",
      "m-auto",
      // Sizing
      "w-full",
      "h-full",
      // Transformations
      "transform",
      "origin-center",
      // Animations
      "animate-spin"
    ]
  },
  circle: {
    class: [
      // Colors
      "text-red-500",
      // Misc
      "progress-spinner-circle"
    ]
  }
}, Bi = {
  root: {
    class: [
      "relative",
      // Flexbox & Alignment
      "inline-flex",
      "align-bottom",
      // Size
      "w-5 h-5",
      // Misc
      "cursor-pointer",
      "select-none"
    ]
  },
  box: ({ props: e, context: t }) => ({
    class: [
      // Flexbox
      "flex justify-center items-center",
      // Size
      "w-5 h-5",
      // Shape
      "border outline-transparent",
      "rounded-full",
      // Transition
      "transition duration-200 ease-in-out",
      // Colors
      {
        "text-surface-700 dark:text-white/80": t.checked,
        "border-surface-300 dark:border-surface-700": !t.checked && !e.invalid,
        "border-primary bg-primary": t.checked && !e.disabled
      },
      // Invalid State
      { "border-red-500 dark:border-red-400": e.invalid },
      // States
      {
        "peer-hover:border-surface-400 dark:peer-hover:border-surface-400": !e.disabled && !e.invalid && !t.checked,
        "peer-hover:border-primary-emphasis": !e.disabled && !t.checked,
        "peer-hover:[&>*:first-child]:bg-primary-600 dark:peer-hover:[&>*:first-child]:bg-primary-300": !e.disabled && !t.checked,
        "peer-focus-visible:ring-1 peer-focus-visible:ring-primary-500 dark:peer-focus-visible:ring-primary-400": !e.disabled,
        "bg-surface-200 [&>*:first-child]:bg-surface-600 dark:bg-surface-700 dark:[&>*:first-child]:bg-surface-400 border-surface-300 dark:border-surface-700 select-none pointer-events-none cursor-default": e.disabled
      }
    ]
  }),
  input: {
    class: [
      "peer",
      // Size
      "w-full ",
      "h-full",
      // Position
      "absolute",
      "top-0 left-0",
      "z-10",
      // Spacing
      "p-0",
      "m-0",
      // Shape
      "opacity-0",
      "rounded-md",
      "outline-none",
      "border-1 border-surface-200 dark:border-surface-700",
      // Misc
      "appearance-none",
      "cursor-pointer"
    ]
  },
  icon: ({ context: e }) => ({
    class: [
      "block",
      // Shape
      "rounded-full",
      // Size
      "w-3 h-3",
      // Conditions
      {
        "bg-surface-0 dark:bg-surface-900": e.checked,
        "bg-primary": !e.checked,
        "backface-hidden invisible scale-[0.1]": !e.checked,
        "transform visible translate-z-0 scale-[1,1]": e.checked
      },
      // Transition
      "transition duration-200"
    ]
  })
}, Vi = {
  root: ({ props: e }) => ({
    class: [
      "relative",
      // Flex & Alignment
      "flex items-center",
      "gap-1",
      // Misc
      {
        "opacity-60 select-none pointer-events-none cursor-default": e.disabled
      }
    ]
  }),
  option: ({ props: e, context: t }) => ({
    class: [
      // Flex & Alignment
      "inline-flex items-center",
      // State
      {
        "outline-none ring-1 ring-primary-500/50 dark:ring-primary-500": t.focused
      },
      // Misc
      {
        "cursor-pointer": !e.readonly,
        "cursor-default": e.readonly
      }
    ]
  }),
  offIcon: ({ props: e }) => ({
    class: [
      // Size
      "w-4 h-4",
      // Color
      "text-surface-700 dark:text-surface-0/80",
      // State
      { "hover:text-primary-500 dark:hover:text-primary-400": !e.readonly },
      // Transition
      "transition duration-200 ease-in"
    ]
  }),
  onIcon: ({ props: e }) => ({
    class: [
      // Size
      "w-4 h-4",
      // Color
      "text-primary",
      // State
      { "hover:text-primary-600 dark:hover:text-primary-300": !e.readonly },
      // Transition
      "transition duration-200 ease-in"
    ]
  })
}, Di = {
  root: {
    class: ["block absolute bg-surface-200 dark:bg-surface-700 rounded-full pointer-events-none"],
    style: "transform: scale(0)"
  }
}, Hi = {
  root: {
    class: ["group"]
  },
  contentContainer: {
    class: [
      // Size & Position
      "h-full w-full",
      // Layering
      "z-[1]",
      // Spacing
      "overflow-hidden",
      // Misc
      "relative float-left"
    ]
  },
  content: {
    class: [
      // Size & Spacing
      "h-[calc(100%+18px)] w-[calc(100%+18px)] pr-[18px] pb-[18px] pl-0 pt-0",
      // Overflow & Scrollbar
      "overflow-scroll scrollbar-none",
      // Box Model
      "box-border",
      // Position
      "relative",
      // Webkit Specific
      "[&::-webkit-scrollbar]:hidden"
    ]
  },
  barX: {
    class: [
      // Size & Position
      "h-[9px] bottom-0",
      // Appearance
      "bg-surface-100 dark:bg-surface-800 rounded",
      "opacity-0",
      // Interactivity
      "cursor-pointer",
      "focus:outline-none",
      // Visibility & Layering
      "invisible z-20",
      // Transition
      "transition duration-[250ms] ease-linear",
      // Misc
      "relative",
      "group-hover:opacity-100"
    ]
  },
  barY: {
    class: [
      // Size & Position
      "w-[9px] top-0",
      // Appearance
      "bg-surface-100 dark:bg-surface-800 rounded",
      "opacity-0",
      // Interactivity
      "cursor-pointer",
      "focus:outline-none",
      // Visibility & Layering
      "z-20",
      // Transition
      "transition duration-[250ms] ease-linear",
      // Misc
      "relative",
      "group-hover:opacity-100"
    ]
  }
}, Ui = {
  button: ({ props: e }) => ({
    root: {
      class: [
        // Flex & Alignment
        "flex items-center justify-center",
        // Positioning
        {
          "!sticky flex ml-auto": e.target === "parent",
          "!fixed": e.target === "window"
        },
        "bottom-[20px] right-[20px]",
        "h-10 w-10 rounded-full shadow-md",
        "text-white dark:text-surface-900 bg-surface-600 dark:bg-surface-700",
        "hover:bg-surface-600 dark:hover:bg-surface-300"
      ]
    }
  }),
  transition: {
    enterFromClass: "opacity-0",
    enterActiveClass: "transition-opacity duration-150",
    leaveActiveClass: "transition-opacity duration-150",
    leaveToClass: "opacity-0"
  }
}, so = {
  root: ({ props: e, state: t, parent: r }) => ({
    class: [
      // Display and Position
      "inline-flex",
      "relative",
      // Shape
      { "rounded-md": r.instance.$name !== "InputGroup" },
      { "first:rounded-l-md rounded-none last:rounded-r-md": r.instance.$name == "InputGroup" },
      { "border-0 border-y border-l last:border-r": r.instance.$name == "InputGroup" },
      { "first:ml-0 ml-[-1px]": r.instance.$name == "InputGroup" && !e.showButtons },
      // Color and Background
      { "bg-surface-0 dark:bg-surface-950": !e.disabled },
      "border",
      { "dark:border-surface-700": r.instance.$name != "InputGroup" },
      { "dark:border-surface-600": r.instance.$name == "InputGroup" },
      { "border-surface-300 dark:border-surface-600": !e.invalid },
      // Invalid State
      "invalid:focus:ring-red-200",
      "invalid:hover:border-red-500",
      { "border-red-500 dark:border-red-400": e.invalid },
      // Transitions
      "transition-all",
      "duration-200",
      // States
      { "hover:border-surface-400 dark:hover:border-surface-600": !e.invalid },
      { "outline-none outline-offset-0 ring-1 ring-primary-500 dark:ring-secondary-400 z-10": t.focused },
      // Misc
      "cursor-pointer",
      "select-none",
      { "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default": e.disabled }
    ]
  }),
  label: ({ props: e, parent: t }) => {
    var r;
    return {
      class: [
        //Font
        "leading-[normal]",
        // Display
        "block",
        "flex-auto",
        // Color and Background
        "bg-transparent",
        "border-0",
        { "text-surface-800 dark:text-white/80": e.modelValue != null, "text-surface-400 dark:text-surface-500": e.modelValue == null },
        "placeholder:text-surface-400 dark:placeholder:text-surface-500",
        // Sizing and Spacing
        "w-[1%]",
        "py-2 px-3",
        { "pr-7": e.showClear },
        //Shape
        "rounded-none",
        // Transitions
        "transition",
        "duration-200",
        // States
        "focus:outline-none focus:shadow-none",
        // Filled State *for FloatLabel
        { filled: ((r = t.instance) == null ? void 0 : r.$name) == "FloatLabel" && e.modelValue !== null },
        // Misc
        "relative",
        "cursor-pointer",
        "overflow-hidden overflow-ellipsis",
        "whitespace-nowrap",
        "appearance-none"
      ]
    };
  },
  dropdown: {
    class: [
      // Flexbox
      "flex items-center justify-center",
      "shrink-0",
      // Color and Background
      "bg-transparent",
      "text-surface-500",
      // Size
      "w-12",
      // Shape
      "rounded-r-md"
    ]
  },
  overlay: {
    class: [
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-white/80",
      // Shape
      "border border-surface-300 dark:border-surface-700",
      "rounded-md",
      "shadow-md"
    ]
  },
  listContainer: {
    class: [
      // Sizing
      "max-h-[200px]",
      // Misc
      "overflow-auto"
    ]
  },
  list: {
    class: "p-1 list-none m-0"
  },
  option: ({ context: e }) => ({
    class: [
      "relative",
      "flex items-center",
      // Font
      "leading-none",
      // Spacing
      "m-0 px-3 py-2",
      "first:mt-0 mt-[2px]",
      // Shape
      "border-0 rounded",
      // Colors
      {
        "bg-surface-200 dark:bg-surface-600/60": e.focused && !e.selected,
        "text-surface-700 dark:text-white/80": e.focused && !e.selected,
        "bg-highlight": e.selected
      },
      //States
      { "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.focused && !e.selected },
      { "hover:bg-highlight-emphasis": e.selected },
      { "hover:text-surface-700 hover:bg-surface-100 dark:hover:text-white dark:hover:bg-[rgba(255,255,255,0.03)]": e.focused && !e.selected },
      // Transition
      "transition-shadow duration-200",
      // Misc
      "cursor-pointer overflow-hidden whitespace-nowrap"
    ]
  }),
  optionGroup: {
    class: [
      "font-semibold",
      // Spacing
      "m-0 py-2 px-3",
      // Colors
      "text-surface-400 dark:text-surface-500",
      // Misc
      "cursor-auto"
    ]
  },
  optionCheckIcon: "relative -ms-1.5 me-1.5 text-surface-700 dark:text-white/80 w-4 h-4",
  optionBlankIcon: "w-4 h-4",
  emptyMessage: {
    class: [
      // Font
      "leading-none",
      // Spacing
      "py-2 px-3",
      // Color
      "text-surface-800 dark:text-white/80",
      "bg-transparent"
    ]
  },
  header: {
    class: [
      // Spacing
      "pt-2 px-2 pb-0",
      "m-0",
      //Shape
      "border-b-0",
      "rounded-tl-md",
      "rounded-tr-md",
      // Color
      "text-surface-700 dark:text-white/80",
      "bg-surface-0 dark:bg-surface-900",
      "border-surface-300 dark:border-surface-700"
    ]
  },
  clearIcon: {
    class: [
      // Color
      "text-surface-400 dark:text-surface-500",
      // Position
      "absolute",
      "top-1/2",
      "right-12",
      // Spacing
      "-mt-2"
    ]
  },
  loadingIcon: {
    class: "text-surface-400 dark:text-surface-500 animate-spin"
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0"
  }
}, Ki = {
  root: ({ props: e }) => ({
    class: [
      "inline-flex select-none align-bottom outline-transparent",
      "border rounded-md [&>button]:rounded-none [&>button]:border-none",
      "[&>button:first-child]:border-r-none [&>button:first-child]:rounded-r-none [&>button:first-child]:rounded-tl-md [&>button:first-child]:rounded-bl-md",
      "[&>button:last-child]:border-l-none [&>button:first-child]:rounded-l-none [&>button:last-child]:rounded-tr-md [&>button:last-child]:rounded-br-md",
      // Invalid State
      {
        "border-red-500 dark:border-red-400": e.invalid,
        "border-transparent": !e.invalid
      }
    ]
  })
}, Wi = {
  root: ({ props: e }) => ({
    class: [
      "overflow-hidden",
      {
        "animate-pulse": e.animation !== "none"
      },
      // Round
      { "rounded-full": e.shape === "circle", "rounded-md": e.shape !== "circle" },
      // Colors
      "bg-surface-200 dark:bg-surface-700"
    ]
  })
}, Gi = {
  root: ({ props: e }) => ({
    class: [
      "relative",
      // Size
      { "h-[3px]": e.orientation == "horizontal", "w-[3px]": e.orientation == "vertical" },
      // Shape
      "border-0",
      "rounded-md",
      // Colors
      "bg-surface-200 dark:bg-surface-800",
      // States
      { "opacity-60 select-none pointer-events-none cursor-default": e.disabled }
    ]
  }),
  range: ({ props: e }) => ({
    class: [
      // Position
      "block absolute",
      {
        "top-0 left-0": e.orientation == "horizontal",
        "bottom-0 left-0": e.orientation == "vertical"
      },
      //Size
      {
        "h-full": e.orientation == "horizontal",
        "w-full": e.orientation == "vertical"
      },
      // Shape
      "rounded-md",
      // Colors
      "bg-primary"
    ]
  }),
  handle: ({ props: e }) => ({
    class: [
      "flex items-center justify-center",
      // Size
      "h-[20px]",
      "w-[20px]",
      {
        "top-[50%] -mt-[10px] -ml-[10px]": e.orientation == "horizontal",
        "left-[50%] -mb-[10px] -ml-[10px]": e.orientation == "vertical"
      },
      // Shape
      "rounded-full",
      "before:block before:w-[16px] before:h-[16px] before:rounded-full before:bg-surface-0 dark:before:bg-surface-950 before:shadow-md",
      // Colors
      "bg-surface-200 dark:bg-surface-800",
      // States
      "focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-1",
      "ring-primary-500 dark:ring-primary-400",
      // Transitions
      "transition duration-200",
      // Misc
      "cursor-grab",
      "touch-action-none"
    ]
  }),
  startHandler: ({ props: e }) => ({
    class: [
      "flex items-center justify-center",
      // Size
      "h-[20px]",
      "w-[20px]",
      {
        "top-[50%] -mt-[10px] -ml-[10px]": e.orientation == "horizontal",
        "left-[50%] -mb-[10px] -ml-[10px]": e.orientation == "vertical"
      },
      // Shape
      "rounded-full",
      "before:block before:w-[16px] before:h-[16px] before:rounded-full before:bg-surface-0 dark:before:bg-surface-950 before:shadow-md",
      // Colors
      "bg-surface-200 dark:bg-surface-800",
      // States
      "focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-1",
      "ring-primary-500 dark:ring-primary-400",
      // Transitions
      "transition duration-200",
      // Misc
      "cursor-grab",
      "touch-action-none"
    ]
  }),
  endHandler: ({ props: e }) => ({
    class: [
      "flex items-center justify-center",
      // Size
      "h-[20px]",
      "w-[20px]",
      {
        "top-[50%] -mt-[10px] -ml-[10px]": e.orientation == "horizontal",
        "left-[50%] -mb-[10px] -ml-[10px]": e.orientation == "vertical"
      },
      // Shape
      "rounded-full",
      "before:block before:w-[16px] before:h-[16px] before:rounded-full before:bg-surface-0 dark:before:bg-surface-950 before:shadow-md",
      // Colors
      "bg-surface-200 dark:bg-surface-800",
      // States
      "focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-1",
      "ring-primary-500 dark:ring-primary-400",
      // Transitions
      "transition duration-200",
      // Misc
      "cursor-grab",
      "touch-action-none"
    ]
  })
}, qi = {
  root: ({ state: e }) => ({
    class: [
      "static flex gap-2",
      {
        "[&_[data-pc-name=pcbutton]]:rotate-45": e.d_visible,
        "[&_[data-pc-name=pcbutton]]:rotate-0": !e.d_visible
      }
    ]
  }),
  list: {
    class: [
      // Spacing
      "m-0 p-0",
      // Layout & Flexbox
      "list-none flex items-center justify-center",
      // Transitions
      "transition delay-200",
      // Z-Index (Positioning)
      "z-20"
    ]
  },
  item: ({ props: e, context: t }) => ({
    class: [
      "transform transition-transform duration-200 ease-out transition-opacity duration-800",
      // Conditional Appearance
      t.hidden ? "opacity-0 scale-0" : "opacity-100 scale-100",
      // Conditional Spacing
      {
        "my-1 first:mb-2": e.direction == "up" && e.type == "linear",
        "my-1 first:mt-2": e.direction == "down" && e.type == "linear",
        "mx-1 first:mr-2": e.direction == "left" && e.type == "linear",
        "mx-1 first:ml-2": e.direction == "right" && e.type == "linear"
      },
      // Conditional Positioning
      { absolute: e.type !== "linear" }
    ]
  }),
  mask: ({ state: e }) => ({
    class: [
      // Base Styles
      "absolute left-0 top-0 w-full h-full transition-opacity duration-250 ease-in-out bg-black/40 z-0",
      // Conditional Appearance
      {
        "opacity-0 pointer-events-none": !e.d_visible,
        "opacity-100 transition-opacity duration-400 ease-in-out": e.d_visible
      }
    ]
  })
}, Yi = {
  root: ({ props: e }) => ({
    class: [
      // Flexbox and Position
      "inline-flex",
      "relative",
      // Shape
      "rounded-md",
      { "shadow-lg": e.raised },
      "[&>[data-pc-name=pcbutton]]:rounded-tr-none",
      "[&>[data-pc-name=pcbutton]]:rounded-br-none",
      "[&>[data-pc-name=pcdropdown]]:rounded-tl-none",
      "[&>[data-pc-name=pcdropdown]]:rounded-bl-none",
      "[&>[data-pc-name=pcmenu]]:min-w-full"
    ]
  })
}, Ji = {
  root: ({ context: e }) => ({
    class: [
      // Colors
      "bg-surface-0",
      "dark:bg-surface-900",
      "text-surface-700",
      "dark:text-surface-0/80",
      // Shape
      "rounded-md",
      // Borders (Conditional)
      { "border border-solid border-surface-200 dark:border-surface-700": !e.nested },
      // Nested
      { "flex grow border-0": e.nested }
    ]
  }),
  gutter: ({ props: e }) => ({
    class: [
      // Flexbox
      "flex",
      "items-center",
      "justify-center",
      "shrink-0",
      // Colors
      "bg-surface-100",
      "dark:bg-surface-700",
      // Transitions
      "transition-all",
      "duration-200",
      // Misc
      {
        "cursor-col-resize": e.layout == "horizontal",
        "cursor-row-resize": e.layout !== "horizontal"
      }
    ]
  }),
  gutterhandler: ({ props: e }) => ({
    class: [
      "z-20",
      // Colors
      "bg-surface-100",
      "dark:bg-surface-700",
      // Shape
      "rounded-md",
      //States
      "focus:outline-none focus:outline-offset-0 focus-visible:ring-1 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-300",
      // Transitions
      "transition-all",
      "duration-200",
      // Sizing (Conditional)
      {
        "h-[1.70rem]": e.layout == "horizontal",
        "w-[1.70rem] h-2": e.layout !== "horizontal"
      }
    ]
  })
}, Qi = {
  root: ({ context: e }) => ({
    class: ["grow", { flex: e.nested }]
  })
}, Zi = {
  root: ({ context: e }) => ({
    class: ["relative flex flex-auto items-center gap-2 p-2 last-of-type:flex-[initial]", { "cursor-default pointer-events-none select-none opacity-60": e.disabled }, "[&_[data-pc-section=separator]]:has-[~[data-p-active=true]]:bg-primary"]
  }),
  header: ({ props: e, context: t }) => ({
    class: [
      "inline-flex items-center border-0 cursor-pointer rounded-md outline-transparent bg-transparent p-0 gap-2",
      "focus:outline-none focus:outline-offset-0 focus-visible:ring-1 ring-inset focus-visible:ring-primary-400 dark:focus-visible:ring-primary-300",
      { "!cursor-default": t.active },
      { "cursor-auto": e.linear }
    ]
  }),
  number: ({ context: e }) => ({
    class: [
      // Flexbox
      "flex",
      "items-center",
      "justify-center",
      //Colors
      "border-solid border-2 border-surface-200 dark:border-surface-700",
      // Colors (Conditional)
      e.active ? "text-primary" : "text-surface-900 dark:text-surface-0",
      // Adjust colors as needed
      // Size and Shape
      "min-w-[2rem]",
      "h-[2rem]",
      "line-height-[2rem]",
      "rounded-full",
      // Text
      "text-lg",
      // Transitions
      "transition",
      "transition-colors",
      "transition-shadow",
      "duration-200"
    ]
  }),
  title: ({ context: e }) => ({
    class: [
      // Layout
      "block",
      "whitespace-nowrap",
      "overflow-hidden",
      "text-ellipsis",
      "max-w-full",
      // Text
      e.active ? "text-primary" : "text-surface-700 dark:text-surface-0/80",
      "font-medium",
      // Transitions
      "transition",
      "transition-colors",
      "transition-shadow",
      "duration-200"
    ]
  })
}, Xi = {
  root: ({ state: e }) => ({
    class: [
      "flex flex-col flex-[initial] has-[[data-pc-name=steppanels]]:px-2 has-[[data-pc-name=steppanels]]:pt-3.5 has-[[data-pc-name=steppanels]]:pb-[1.125rem]",
      { "flex-auto": e.isActive },
      "[&>[data-pc-name=step]]:flex-[initial]",
      "[&>[data-pc-name=steppanel]]:flex [&>[data-pc-name=steppanel]]:flex-auto [&>[data-pc-name=steppanel]>[data-pc-section=content]]:w-full [&>[data-pc-name=steppanel]>[data-pc-section=content]]:pl-4 [&:last-child>[data-pc-name=steppanel]>[data-pc-section=content]]:ps-8",
      "[&>[data-pc-name=steppanel]>[data-pc-section=separator]]:relative [&>[data-pc-name=steppanel]>[data-pc-section=separator]]:!flex-initial [&>[data-pc-name=steppanel]>[data-pc-section=separator]]:shrink-0 [&>[data-pc-name=steppanel]>[data-pc-section=separator]]:w-[2px] [&>[data-pc-name=steppanel]>[data-pc-section=separator]]:h-auto [&>[data-pc-name=steppanel]>[data-pc-section=separator]]:m-2 [&>[data-pc-name=steppanel]>[data-pc-section=separator]]:left-[-2px] [&>[data-pc-name=steppanel]>[data-pc-section=separator]]:ml-[1.625rem]"
    ]
  })
}, el = {
  root: "relative flex justify-between items-center m-0 p-0 list-none overflow-x-auto"
}, tl = {
  root: "px-2 pt-3.5 pb-[1.125rem]"
}, rl = {
  root: "has-[[data-pc-name=stepitem]]:flex has-[[data-pc-name=stepitem]]:flex-col",
  separator: "flex-1 w-full h-[2px] bg-surface-200 dark:bg-surface-700 transition-shadow duration-200",
  transition: {
    class: ["flex flex-1", "bg-surface-0 dark:bg-surface-900", "text-surface-900 dark:text-surface-0"],
    enterFromClass: "max-h-0",
    enterActiveClass: "overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.42,0,0.58,1)]",
    enterToClass: "max-h-[1000px]",
    leaveFromClass: "max-h-[1000px]",
    leaveActiveClass: "overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0,1,0,1)]",
    leaveToClass: "max-h-0"
  }
}, nl = {
  root: {
    class: "relative"
  },
  menu: {
    class: "p-0 m-0 list-none flex"
  },
  menuitem: {
    class: [
      // Flexbox and Position
      "relative",
      "flex",
      "justify-center",
      "flex-1",
      "overflow-hidden",
      // Before
      "before:border-t-2",
      "before:border-surface-200",
      "before:dark:border-surface-700",
      "before:w-full",
      "[&:first-child]:before:w-[calc(50%+1rem)]",
      "[&:last-child]:before:w-1/2",
      "before:absolute",
      "before:top-1/2",
      "before:left-0",
      "before:transform",
      "before:mt-[calc(-1rem+1px)]",
      "[&:first-child]:before:translate-x-[100%]"
    ]
  },
  action: ({ props: e }) => ({
    class: [
      // Flexbox
      "inline-flex items-center",
      "flex-col",
      // Transitions and Shape
      "transition-shadow",
      "rounded-md",
      // Colors
      "bg-surface-0",
      "dark:bg-transparent",
      // States
      "focus:outline-none focus:outline-offset-0 focus:ring",
      "focus:ring-primary-500 dark:focus:ring-primary-400",
      // Misc
      "overflow-hidden",
      { "cursor-pointer": !e.readonly }
    ]
  }),
  step: ({ context: e, props: t }) => ({
    class: [
      // Flexbox
      "flex items-center justify-center",
      // Position
      "z-20",
      // Shape
      "rounded-full",
      "border-2",
      // Size
      "w-8",
      "h-8",
      "text-sm",
      "leading-[2rem]",
      "font-medium",
      // Colors
      "bg-surface-0 dark:bg-surface-800",
      "border-surface-100 dark:border-surface-700",
      {
        "text-surface-400 dark:text-white/60": !e.active,
        "text-primary": e.active
      },
      // States
      {
        "hover:border-surface-300 dark:hover:border-surface-500": !e.active && !t.readonly
      },
      // Transition
      "transition-colors duration-200 ease-in-out"
    ]
  }),
  label: ({ context: e }) => ({
    class: [
      // Font
      "leading-[normal]",
      "font-medium",
      // Display
      "block",
      // Spacing
      "mt-2",
      // Colors
      { "text-surface-700 dark:text-white/70": !e.active, "text-primary": e.active },
      // Text and Overflow
      "whitespace-nowrap",
      "overflow-hidden",
      "overflow-ellipsis",
      "max-w-full"
    ]
  })
}, ol = {
  root: ({ props: e, context: t }) => ({
    class: [
      "relative shrink-0",
      // Shape
      "border-b",
      "rounded-t-md",
      // Spacing
      "py-4 px-[1.125rem]",
      "-mb-px",
      // Colors and Conditions
      "outline-transparent",
      {
        "border-surface-200 dark:border-secondary-400": t.active,
        "border-surface-200 dark:border-transparent": !t.active,
        "text-surface-700 dark:text-surface-0/80": !t.active,
        "bg-surface-0 dark:bg-transparent": t.active,
        "text-secondary-400": t.active,
        "opacity-60 cursor-default user-select-none select-none pointer-events-none": e == null ? void 0 : e.disabled
      },
      // States
      "focus:outline-none focus:outline-offset-0 focus-visible:ring-1 ring-inset focus-visible:ring-primary-400 dark:focus-visible:ring-secondary-400",
      // Transitions
      "transition-all duration-200",
      // Misc
      "cursor-pointer select-none whitespace-nowrap",
      "user-select-none"
    ]
  })
}, al = {
  root: "relative flex",
  content: "overflow-x-auto overflow-y-hidden scroll-smooth overscroll-x-contain overscroll-y-auto [&::-webkit-scrollbar]:hidden grow dark:bg-surface-800",
  tabList: "relative flex border-solid border-b border-surface-200 dark:border-surface-900",
  nextButton: "!absolute top-0 right-0 z-20 h-full w-10 flex items-center justify-center text-surface-700 dark:text-surface-0/80 bg-surface-0 dark:bg-surface-800 outline-transparent cursor-pointer shrink-0",
  prevButton: "!absolute top-0 left-0 z-20 h-full w-10 flex items-center justify-center text-surface-700 dark:text-surface-0/80 bg-surface-0 dark:bg-surface-800 outline-transparent cursor-pointer shrink-0",
  activeBar: "z-10 block absolute h-[1px] bottom-[-1px] bg-primary-400"
}, sl = {
  root: {
    class: "overflow-x-auto"
  },
  menu: {
    class: [
      // Flexbox
      "flex flex-1",
      // Spacing
      "list-none",
      "p-0 m-0",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "border-b-2 border-surface-200 dark:border-surface-700",
      "text-surface-900 dark:text-surface-0/80"
    ]
  },
  menuitem: {
    class: "mr-0"
  },
  action: ({ context: e, state: t }) => ({
    class: [
      "relative",
      // Font
      "font-semibold leading-none",
      // Flexbox and Alignment
      "flex items-center",
      // Spacing
      "py-4 px-[1.125rem]",
      "-mb-px",
      // Shape
      "border-b",
      "rounded-t-md",
      // Colors and Conditions
      {
        "border-surface-200 dark:border-surface-700": t.d_activeIndex !== e.index,
        "text-surface-700 dark:text-surface-0/80": t.d_activeIndex !== e.index,
        "bg-surface-0 dark:bg-surface-900": t.d_activeIndex === e.index,
        "border-primary": t.d_activeIndex === e.index,
        "text-primary": t.d_activeIndex === e.index
      },
      // States
      "focus:outline-none focus:outline-offset-0 focus-visible:ring-1 ring-inset focus-visible:ring-primary-400 dark:focus-visible:ring-primary-300",
      {
        "hover:text-surface-900 dark:hover:text-surface-0": t.d_activeIndex !== e.index
      },
      // Transitions
      "transition-all duration-200",
      // Misc
      "cursor-pointer select-none text-decoration-none",
      "overflow-hidden",
      "user-select-none"
    ]
  }),
  icon: {
    class: "mr-2"
  }
}, il = {
  root: "focus:outline-none focus:outline-offset-0 focus-visible:ring-1 ring-inset focus-visible:ring-primary-400 dark:focus-visible:ring-primary-300"
}, ll = {
  root: "bg-surface-0 dark:bg-surface-800 text-surface-900 dark:text-surface-0/80 outline-0 p-[1.125rem] pt-[0.875rem]"
}, cl = {
  root: ({ props: e }) => ({
    class: ["flex flex-col", { "[&>[data-pc-name=tablist]]:overflow-hidden": e.scrollable }]
  })
}, ul = {
  // For PrimeVue version 3
  navContainer: ({ props: e }) => ({
    class: [
      // Position
      "relative",
      // Misc
      { "overflow-hidden": e.scrollable }
    ]
  }),
  navContent: ({ instance: e }) => ({
    class: [
      // Overflow and Scrolling
      "overflow-y-hidden overscroll-contain",
      "overscroll-auto",
      "scroll-smooth",
      "[&::-webkit-scrollbar]:hidden"
    ]
  }),
  previousButton: {
    class: [
      // Flexbox and Alignment
      "flex items-center justify-center",
      // Position
      "!absolute",
      "top-0 left-0",
      "z-20",
      // Size and Shape
      "h-full w-10",
      "rounded-none",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-surface-0/80",
      "shadow-sm"
    ]
  },
  nextButton: {
    class: [
      // Flexbox and Alignment
      "flex items-center justify-center",
      // Position
      "!absolute",
      "top-0 right-0",
      "z-20",
      // Size and Shape
      "h-full w-10",
      "rounded-none",
      // Colors
      "text-surface-700 dark:text-surface-0/80",
      "bg-surface-0 dark:bg-surface-900",
      "shadow-sm"
    ]
  },
  nav: {
    class: [
      // Flexbox
      "flex flex-1",
      // Spacing
      "list-none",
      "p-0 m-0",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "border-b border-surface-200 dark:border-surface-700",
      "text-surface-900 dark:text-surface-0/80"
    ]
  },
  tabpanel: {
    header: ({ props: e }) => ({
      class: [
        // Spacing
        "mr-0",
        // Misc
        "outline-none",
        {
          "opacity-60 cursor-default user-select-none select-none pointer-events-none": e == null ? void 0 : e.disabled
        }
      ]
    }),
    headerAction: ({ parent: e, context: t }) => ({
      class: [
        "relative",
        // Font
        "font-semibold",
        // Flexbox and Alignment
        "flex items-center",
        // Spacing
        "py-4 px-[1.125rem]",
        "-mb-px",
        // Shape
        "border-b-2",
        "rounded-t-md",
        // Colors and Conditions
        {
          "border-surface-200 dark:border-surface-700": e.state.d_activeIndex !== t.index,
          "text-surface-700 dark:text-surface-0/80": e.state.d_activeIndex !== t.index,
          "bg-surface-0 dark:bg-surface-900": e.state.d_activeIndex === t.index,
          "border-primary": e.state.d_activeIndex === t.index,
          "text-primary": e.state.d_activeIndex === t.index
        },
        // States
        "focus:outline-none focus:outline-offset-0 focus-visible:ring-1 ring-inset focus-visible:ring-primary-400 dark:focus-visible:ring-primary-300",
        {
          "hover:bg-surface-0 dark:hover:bg-surface-800/80": e.state.d_activeIndex !== t.index,
          "hover:text-surface-900 dark:hover:text-surface-0": e.state.d_activeIndex !== t.index
        },
        // Transitions
        "transition-all duration-200",
        // Misc
        "cursor-pointer select-none text-decoration-none",
        "overflow-hidden",
        "user-select-none"
      ]
    }),
    headerTitle: {
      class: [
        // Text
        "leading-none",
        "whitespace-nowrap"
      ]
    }
  },
  panelcontainer: {
    class: [
      // Spacing
      "p-[1.125rem] pt-[0.875rem]",
      // Shape
      "border-0 rounded-none",
      "border-br-md border-bl-md",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-900 dark:text-surface-0/80"
    ]
  }
}, dl = {
  root: ({ props: e }) => ({
    class: [
      //Font
      "text-xs font-bold",
      //Alignments
      "inline-flex items-center justify-center",
      //Spacing
      "px-[0.4rem] py-1",
      //Shape
      {
        "rounded-md": !e.rounded,
        "rounded-full": e.rounded
      },
      //Colors
      {
        "bg-highlight": e.severity === null || e.severity === "primary",
        "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-500/20": e.severity === "success",
        "text-surface-700 dark:text-surface-300 bg-surface-100 dark:bg-surface-500/20": e.severity === "secondary",
        "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/20": e.severity === "info",
        "text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-500/20": e.severity === "warn",
        "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-500/20": e.severity === "danger",
        "text-surface-0 dark:text-surface-900 bg-surface-900 dark:bg-surface-0": e.severity === "contrast"
      }
    ]
  }),
  value: {
    class: "leading-normal"
  },
  icon: {
    class: "mr-1 text-sm"
  }
}, fl = {
  root: {
    class: [
      // Spacing
      "py-2 px-3",
      // Shape
      "rounded-md",
      // Color
      "bg-surface-0 dark:bg-surface-950 text-surface-700 dark:text-surface-0",
      "border border-surface-200 dark:border-surface-700",
      // Sizing & Overflow
      "h-72 overflow-auto"
    ]
  },
  container: {
    class: [
      // Flexbox
      "flex items-center"
    ]
  },
  prompt: {
    class: [
      // Color
      "text-surface-700 dark:text-surface-0"
    ]
  },
  response: {
    class: [
      // Color
      "text-surface-700 dark:text-surface-0"
    ]
  },
  command: {
    class: [
      // Color
      "text-surface-700 dark:text-surface-0"
    ]
  },
  commandtext: {
    class: [
      // Flexbox
      "flex-1 shrink grow-0",
      // Shape
      "border-0",
      // Spacing
      "p-0",
      // Color
      "bg-transparent text-inherit",
      // Outline
      "outline-none"
    ]
  }
}, pl = {
  root: ({ context: e, props: t, parent: r }) => {
    var n, o;
    return {
      class: [
        // Font
        "leading-none",
        // Spacing
        "m-0",
        "py-2 px-3",
        // Shape
        "rounded-md",
        // Colors
        "text-surface-800 dark:text-white/80",
        "placeholder:text-surface-400 dark:placeholder:text-surface-500",
        { "bg-surface-0 dark:bg-surface-950": !e.disabled },
        "border",
        { "border-surface-300 dark:border-surface-600": !t.invalid },
        // Invalid State
        "invalid:focus:ring-danger-400",
        "invalid:hover:border-danger-400",
        { "border-danger-400 dark:border-danger-400": t.invalid },
        // States
        {
          "hover:border-surface-400 dark:hover:border-surface-600": !e.disabled && !t.invalid,
          "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-secondary-500 dark:focus:ring-secondary-400 focus:z-10": !e.disabled,
          "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default": e.disabled
        },
        // Filled State *for FloatLabel
        { filled: ((n = r.instance) == null ? void 0 : n.$name) == "FloatLabel" && t.modelValue !== null && ((o = t.modelValue) == null ? void 0 : o.length) !== 0 },
        // Misc
        "appearance-none",
        "transition-colors duration-200"
      ]
    };
  }
}, bl = {
  root: {
    class: [
      // Shape
      "rounded-md",
      // Size
      "min-w-[12rem]",
      "p-1",
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "border border-surface-200 dark:border-surface-700"
    ]
  },
  rootList: {
    class: [
      // Spacings and Shape
      "list-none",
      "flex flex-col",
      "m-0 p-0",
      "outline-none"
    ]
  },
  item: {
    class: "relative my-[2px] [&:first-child]:mt-0"
  },
  itemContent: ({ context: e }) => ({
    class: [
      //Shape
      "rounded-[4px]",
      // Colors
      {
        "text-surface-500 dark:text-white/70": !e.focused && !e.active,
        "text-surface-500 dark:text-white/70 bg-surface-200 dark:bg-surface-600/90": e.focused && !e.active,
        "bg-highlight text-highlight-contrast": e.focused && e.active || e.active || !e.focused && e.active
      },
      // Transitions
      "transition-shadow",
      "duration-200",
      // States
      {
        "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]": !e.active,
        "hover:bg-highlight-emphasis": e.active
      },
      // Disabled
      { "opacity-60 pointer-events-none cursor-default": e.disabled }
    ]
  }),
  itemLink: {
    class: [
      "relative",
      // Flexbox
      "flex",
      "items-center",
      // Spacing
      "py-2",
      "px-3",
      // Misc
      "no-underline",
      "overflow-hidden",
      "cursor-pointer",
      "select-none"
    ]
  },
  itemIcon: {
    class: [
      // Spacing
      "mr-2"
    ]
  },
  itemLabel: {
    class: ["leading-none"]
  },
  submenuIcon: {
    class: [
      // Position
      "ml-auto"
    ]
  },
  submenu: {
    class: [
      // Spacing
      "flex flex-col",
      "m-0",
      "p-1",
      "list-none",
      "min-w-[12.5rem]",
      // Shape
      "shadow-none sm:shadow-md",
      "border border-surface-200 dark:border-surface-700",
      // Position
      "static sm:absolute",
      "z-10",
      // Color
      "bg-surface-0 dark:bg-surface-900"
    ]
  },
  separator: {
    class: "border-t border-surface-200 dark:border-surface-600"
  },
  transition: {
    enterFromClass: "opacity-0",
    enterActiveClass: "transition-opacity duration-250"
  }
}, gl = {
  root: ({ props: e }) => ({
    class: [
      "flex grow",
      {
        "flex-col": e.layout === "vertical",
        "flex-row": e.layout === "horizontal"
      }
    ]
  }),
  event: ({ props: e, context: t }) => ({
    class: [
      "flex relative min-h-[70px]",
      {
        "flex-row-reverse": e.align === "right" || e.layout === "vertical" && e.align === "alternate" && t.index % 2 === 1,
        "flex-col [&:not(:last-child)]:flex-1": e.layout === "horizontal",
        "flex-col-reverse ": e.align === "bottom" || e.layout === "horizontal" && e.align === "alternate" && t.index % 2 === 1
      }
    ]
  }),
  eventOpposite: ({ props: e, context: t }) => ({
    class: [
      "flex-1",
      {
        "px-4": e.layout === "vertical",
        "py-4": e.layout === "horizontal"
      },
      {
        "text-right": e.align === "left" || e.layout === "vertical" && e.align === "alternate" && t.index % 2 === 0,
        "text-left": e.align === "right" || e.layout === "vertical" && e.align === "alternate" && t.index % 2 === 1
      }
    ]
  }),
  eventSeparator: ({ props: e }) => ({
    class: [
      "flex items-center flex-initial",
      {
        "flex-col": e.layout === "vertical",
        "flex-row": e.layout === "horizontal"
      }
    ]
  }),
  eventMarker: {
    class: [
      "relative",
      // Display & Flexbox
      "inline-flex items-center justify-center",
      // Size
      "w-[1.125rem] h-[1.125rem]",
      // Appearance
      "rounded-full border-2 border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-950",
      // Before
      "before:rounded-full before:w-[0.375rem] before:h-[0.375rem] before:bg-primary",
      // After
      "after:absolute after:rounded-full after:w-full after:h-full after:shadow-sm"
    ]
  },
  eventConnector: ({ props: e }) => ({
    class: [
      "grow bg-surface-300 dark:bg-surface-700",
      {
        "w-[2px]": e.layout === "vertical",
        "w-full h-[2px]": e.layout === "horizontal"
      }
    ]
  }),
  eventContent: ({ props: e, context: t }) => ({
    class: [
      "flex-1",
      {
        "px-4": e.layout === "vertical",
        "py-4": e.layout === "horizontal"
      },
      {
        "text-left": e.align === "left" || e.layout === "vertical" && e.align === "alternate" && t.index % 2 === 0,
        "text-right": e.align === "right" || e.layout === "vertical" && e.align === "alternate" && t.index % 2 === 1
      },
      {
        "min-h-0": e.layout === "vertical" && t.index === t.count - 1,
        "grow-0": e.layout === "horizontal" && t.index === t.count - 1
      }
    ]
  })
}, hl = {
  root: ({ props: e }) => ({
    class: [
      //Size and Shape
      "w-96 rounded-md",
      // Positioning
      { "-translate-x-2/4": e.position == "top-center" || e.position == "bottom-center" }
    ]
  }),
  message: ({ props: e }) => ({
    class: [
      "mb-4 rounded-md w-full",
      "border border-transparent",
      "backdrop-blur-[10px] shadow-md",
      // Colors
      {
        "bg-blue-50/90 dark:bg-blue-500/20": e.message.severity == "info",
        "bg-green-50/90 dark:bg-green-500/20": e.message.severity == "success",
        "bg-surface-50 dark:bg-surface-800": e.message.severity == "secondary",
        "bg-orange-50/90 dark:bg-orange-500/20": e.message.severity == "warn",
        "bg-red-50/90 dark:bg-red-500/20": e.message.severity == "error",
        "bg-surface-950 dark:bg-surface-0": e.message.severity == "contrast"
      },
      {
        "border-blue-200 dark:border-blue-500/20": e.message.severity == "info",
        "border-green-200 dark:border-green-500/20": e.message.severity == "success",
        "border-surface-300 dark:border-surface-500/20": e.message.severity == "secondary",
        "border-orange-200 dark:border-orange-500/20": e.message.severity == "warn",
        "border-red-200 dark:border-red-500/20": e.message.severity == "error",
        "border-surface-950 dark:border-surface-0": e.message.severity == "contrast"
      },
      {
        "text-blue-700 dark:text-blue-300": e.message.severity == "info",
        "text-green-700 dark:text-green-300": e.message.severity == "success",
        "text-surface-700 dark:text-surface-300": e.message.severity == "secondary",
        "text-orange-700 dark:text-orange-300": e.message.severity == "warn",
        "text-red-700 dark:text-red-300": e.message.severity == "error",
        "text-surface-0 dark:text-surface-950": e.message.severity == "contrast"
      }
    ]
  }),
  messageContent: ({ props: e }) => ({
    class: [
      "flex p-3",
      {
        "items-start": e.message.summary,
        "items-center": !e.message.summary
      }
    ]
  }),
  messageIcon: ({ props: e }) => ({
    class: [
      // Sizing and Spacing
      e.message.severity === "contrast" || e.message.severity === "secondary" ? "w-0" : "w-[1.125rem] h-[1.125rem] mr-2",
      "text-lg leading-[normal]"
    ]
  }),
  messageText: {
    class: [
      // Font and Text
      "text-base leading-[normal]",
      "ml-2",
      "flex-1"
    ]
  },
  summary: {
    class: "font-medium block"
  },
  detail: ({ props: e }) => ({
    class: ["block", "text-sm", e.message.severity === "contrast" ? "text-surface-0 dark:text-surface-950" : "text-surface-700 dark:text-surface-0", { "mt-2": e.message.summary }]
  }),
  closeButton: ({ props: e }) => ({
    class: [
      // Flexbox
      "flex items-center justify-center",
      // Size
      "w-7 h-7",
      // Spacing and Misc
      "ml-auto  relative",
      // Shape
      "rounded-full",
      // Colors
      "bg-transparent",
      // Transitions
      "transition duration-200 ease-in-out",
      // States
      "hover:bg-surface-0/30 dark:hover:bg-[rgba(255,255,255,0.03)]",
      "focus:outline-none focus:outline-offset-0 focus:ring-1",
      {
        "focus:ring-blue-500 dark:focus:ring-blue-400": e.severity == "info",
        "focus:ring-green-500 dark:focus:ring-green-400": e.severity == "success",
        "focus:ring-surface-500 dark:focus:ring-surface-400": e.severity == "secondary",
        "focus:ring-orange-500 dark:focus:ring-orange-400": e.severity == "warn",
        "focus:ring-red-500 dark:focus:ring-red-4000": e.severity == "error",
        "focus:ring-surface-0 dark:focus:ring-surface-950": e.severity == "contrast"
      },
      // Misc
      "overflow-hidden"
    ]
  }),
  transition: {
    enterFromClass: "opacity-0 translate-y-2/4",
    enterActiveClass: "transition-[transform,opacity] duration-300",
    leaveFromClass: "max-h-[1000px]",
    leaveActiveClass: "!transition-[max-height_.45s_cubic-bezier(0,1,0,1),opacity_.3s,margin-bottom_.3s] overflow-hidden",
    leaveToClass: "max-h-0 opacity-0 mb-0"
  }
}, ml = {
  root: ({ props: e, context: t }) => ({
    class: [
      "relative",
      // Alignment
      "flex items-center justify-center",
      "py-2 px-4",
      "rounded-md border",
      // Color
      "bg-surface-100 dark:bg-surface-950",
      {
        "text-surface-600 dark:text-white/60 before:bg-transparent": !t.active,
        "text-surface-800 dark:text-white/80 before:bg-surface-0 dark:before:bg-surface-800": t.active
      },
      // States
      {
        "hover:text-surface-800 dark:hover:text-white/80": !e.disabled && !e.modelValue,
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 dark:focus-visible:ring-secondary-400": !e.disabled
      },
      // Invalid State
      {
        "border-red-500 dark:border-red-400": e.invalid,
        "border-surface-100 dark:border-surface-950": !e.invalid
      },
      // Before
      "before:absolute before:left-1 before:top-1 before:w-[calc(100%-0.5rem)] before:h-[calc(100%-0.5rem)] before:rounded-[4px] before:z-0",
      // Transitions
      "transition-all duration-200",
      // Misc
      { "cursor-pointer": !e.disabled, "opacity-60 select-none pointer-events-none cursor-default": e.disabled }
    ]
  }),
  content: "relative items-center inline-flex justify-center gap-2",
  label: "font-medium leading-[normal] text-center w-full z-10 relative",
  icon: "relative z-10 mr-2"
}, io = {
  root: ({ props: e }) => ({
    class: [
      "inline-block relative",
      "w-10 h-6",
      "rounded-2xl",
      {
        "opacity-60 select-none pointer-events-none cursor-default": e.disabled
      }
    ]
  }),
  slider: ({ props: e }) => ({
    class: [
      // Position
      "absolute top-0 left-0 right-0 bottom-0",
      { "before:transform before:translate-x-4": e.modelValue == e.trueValue },
      // Shape
      "rounded-2xl",
      // Before:
      "before:absolute before:top-1/2 before:left-1",
      "before:-mt-2",
      "before:h-4 before:w-4",
      "before:rounded-full",
      "before:duration-200",
      "before:bg-surface-0 before:dark:bg-surface-500",
      // Colors
      "border",
      {
        "bg-surface-300 dark:bg-surface-700": e.modelValue != e.trueValue,
        "bg-secondary-400": e.modelValue == e.trueValue,
        "before:dark:bg-surface-950": e.modelValue == e.trueValue,
        "border-transparent": !e.invalid
      },
      // Invalid State
      { "border-red-500 dark:border-danger-400": e.invalid },
      // States
      { "peer-hover:bg-surface-400 dark:peer-hover:bg-surface-600": e.modelValue != e.trueValue && !e.disabled && !e.invalid },
      { "peer-hover:bg-primary-hover": e.modelValue == e.trueValue && !e.disabled && !e.invalid },
      "peer-focus-visible:ring-1 peer-focus-visible:ring-primary-500 dark:peer-focus-visible:ring-secondary-200",
      // Transition
      "transition-colors duration-200",
      // Misc
      "cursor-pointer"
    ]
  }),
  input: {
    class: [
      "peer",
      // Size
      "w-full ",
      "h-full",
      // Position
      "absolute",
      "top-0 left-0",
      "z-10",
      // Spacing
      "p-0",
      "m-0",
      // Shape
      "opacity-0",
      "rounded-2xl",
      "outline-none",
      // Misc
      "appearance-none",
      "cursor-pointer"
    ]
  }
}, vl = {
  root: {
    class: [
      // Flex & Alignment
      "flex items-center justify-between flex-wrap",
      "gap-2",
      // Spacing
      "p-3",
      // Shape
      "rounded-md",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "border border-surface-200 dark:border-surface-700"
    ]
  },
  start: {
    class: "flex items-center"
  },
  center: {
    class: "flex items-center"
  },
  end: {
    class: "flex items-center"
  }
}, yl = {
  root: ({ context: e }) => ({
    class: [
      // Position and Shadows
      "absolute",
      "p-fadein",
      // Spacing
      {
        '[&[data-p-position="top"]]:py-1 [&[data-p-position="top"]]:px-0 py-0 px-1': (e == null ? void 0 : e.right) || (e == null ? void 0 : e.left) || !(e != null && e.right) && !(e != null && e.left) && !(e != null && e.top) && !(e != null && e.bottom),
        "py-1 px-0": (e == null ? void 0 : e.top) || (e == null ? void 0 : e.bottom)
      },
      // Flipped Tooltip Arrow
      '[&[data-p-position="top"]>[data-pc-section=arrow]]:border-x-[10px] [&[data-p-position="top"]>[data-pc-section=arrow]]:border-t-[10px] [&[data-p-position="top"]>[data-pc-section=arrow]]:border-b-0 [&[data-p-position="top"]>[data-pc-section=arrow]]:border-t-surface-700 [&[data-p-position="top"]>[data-pc-section=arrow]]:border-y-0 [&[data-p-position="top"]>[data-pc-section=arrow]]:border-x-transparent',
      '[&[data-p-position="top"]>[data-pc-section=arrow]]:-ml-[10px] [&[data-p-position="top"]>[data-pc-section=arrow]]:left-1/2 [&[data-p-position="top"]>[data-pc-section=arrow]]:mt-auto [&[data-p-position="top"]>[data-pc-section=arrow]]:top-auto'
    ]
  }),
  arrow: ({ context: e }) => ({
    class: [
      // Position
      "absolute",
      // Size
      "w-0",
      "h-0",
      // Shape
      "border-transparent",
      "border-solid",
      {
        "border-y-[10px] border-r-[10px] border-l-0 border-r-surface-700": (e == null ? void 0 : e.right) || !(e != null && e.right) && !(e != null && e.left) && !(e != null && e.top) && !(e != null && e.bottom),
        "border-y-[10px] border-l-[10px] border-r-0 border-l-surface-700": e == null ? void 0 : e.left,
        "border-x-[10px] border-t-[10px] border-b-0 border-t-surface-700 ": e == null ? void 0 : e.top,
        "border-x-[10px] border-b-[10px] border-t-0 border-b-surface-700": e == null ? void 0 : e.bottom
      },
      // Spacing
      {
        "-mt-[10px] top-1/2": (e == null ? void 0 : e.right) || (e == null ? void 0 : e.left) || !(e != null && e.right) && !(e != null && e.left) && !(e != null && e.top) && !(e != null && e.bottom),
        "-ml-[10px] left-1/2": (e == null ? void 0 : e.top) || (e == null ? void 0 : e.bottom)
      }
    ]
  }),
  text: {
    class: ["p-3", "bg-surface-700", "text-white", "leading-none", "rounded-md", "whitespace-pre-line", "break-words", "shadow-md"]
  }
}, xl = {
  root: {
    class: [
      // Space
      "p-4",
      // Shape
      "rounded-md",
      "border-none",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-white/80",
      "[&_[data-pc-name=pcfilter]]:w-full"
    ]
  },
  wrapper: {
    class: ["overflow-auto"]
  },
  container: {
    class: [
      // Spacing
      "m-0 p-0",
      // Misc
      "list-none overflow-auto"
    ]
  },
  node: {
    class: ["p-0 my-[2px] mx-0 first:mt-0", "rounded-md", "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400 focus:z-10"]
  },
  nodeContent: ({ context: e, props: t }) => ({
    class: [
      // Flex and Alignment
      "flex items-center",
      // Shape
      "rounded-md",
      // Spacing
      "py-1 px-2 gap-2",
      // Colors
      e.selected ? "bg-highlight text-highlight-contrast " : "bg-transparent text-surface-600 dark:text-white/70",
      // States
      { "hover:bg-surface-50 dark:hover:bg-[rgba(255,255,255,0.03)]": (t.selectionMode == "single" || t.selectionMode == "multiple") && !e.selected },
      // Transition
      "transition-shadow duration-200",
      { "cursor-pointer select-none": t.selectionMode == "single" || t.selectionMode == "multiple" }
    ]
  }),
  nodeToggleButton: ({ context: e }) => ({
    class: [
      // Flex and Alignment
      "inline-flex items-center justify-center",
      // Shape
      "border-0 rounded-full",
      // Size
      "w-7 h-7",
      // Colors
      "bg-transparent",
      {
        "text-surface-600 dark:text-white/70": !e.selected,
        "text-highlight-contrast": e.selected,
        invisible: e.leaf
      },
      // States
      "hover:bg-surface-200/20 dark:hover:bg-surface-500/20",
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400",
      // Transition
      "transition duration-200",
      // Misc
      "cursor-pointer select-none"
    ]
  }),
  nodeIcon: ({ context: e }) => ({
    class: [
      // Space
      "mr-2",
      // Color
      {
        "text-surface-600 dark:text-white/70": !e.selected,
        "text-highlight-contrast": e.selected
      }
    ]
  }),
  nodeLabel: ({ context: e }) => ({
    class: [
      {
        "text-surface-600 dark:text-white/70": !e.selected,
        "text-highlight-contrast": e.selected
      }
    ]
  }),
  nodeChildren: {
    class: ["m-0 list-none p-0 pl-4 [&:not(ul)]:pl-0 [&:not(ul)]:my-[2px]"]
  },
  loadingIcon: {
    class: ["text-surface-500 dark:text-surface-0/70", "absolute top-[50%] right-[50%] -mt-2 -mr-2 animate-spin"]
  }
}, kl = {
  root: ({ props: e, state: t }) => ({
    class: [
      // Display and Position
      "inline-flex",
      "relative",
      // Shape
      "rounded-md",
      // Color and Background
      { "bg-surface-0 dark:bg-surface-950": !e.disabled },
      "border",
      { "border-surface-300 dark:border-surface-700": !e.invalid },
      // Invalid State
      "invalid:focus:ring-red-200",
      "invalid:hover:border-red-500",
      { "border-red-500 dark:border-red-400": e.invalid },
      // Transitions
      "transition-all",
      "duration-200",
      // States
      { "hover:border-surface-400 dark:hover:border-surface-600": !e.invalid },
      { "outline-none outline-offset-0 ring-1 ring-primary-500 dark:ring-primary-400 z-10": t.focused },
      // Misc
      "cursor-pointer",
      "select-none",
      { "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default": e.disabled }
    ]
  }),
  labelContainer: {
    class: ["overflow-hidden flex flex-auto cursor-pointer"]
  },
  label: ({ props: e, parent: t }) => {
    var r, n, o, a;
    return {
      class: [
        "block leading-[normal]",
        // Space
        "py-2 px-3",
        // Color
        "text-surface-800 dark:text-white/80",
        {
          "placeholder:text-transparent dark:placeholder:text-transparent": ((r = t.instance) == null ? void 0 : r.$name) == "FloatLabel",
          "!text-transparent dark:!text-transparent": ((n = t.instance) == null ? void 0 : n.$name) == "FloatLabel" && e.modelValue == null || ((o = e.modelValue) == null ? void 0 : o.length) == 0
        },
        // Filled State *for FloatLabel
        { filled: ((a = t.instance) == null ? void 0 : a.$name) == "FloatLabel" && e.modelValue !== null },
        // Transition
        "transition duration-200",
        // Misc
        "overflow-hidden whitespace-nowrap cursor-pointer overflow-ellipsis"
      ]
    };
  },
  dropdown: {
    class: [
      // Flexbox
      "flex items-center justify-center",
      "shrink-0",
      // Color and Background
      "bg-transparent",
      "text-surface-500",
      // Size
      "w-12",
      // Shape
      "rounded-r-md"
    ]
  },
  panel: {
    class: [
      // Colors
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-white/80",
      // Shape
      "border border-surface-300 dark:border-surface-700",
      "rounded-md",
      "shadow-md"
    ]
  },
  treeContainer: {
    class: [
      // Sizing
      "max-h-[200px]",
      // Misc
      "overflow-auto"
    ]
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0"
  }
}, wl = {
  root: ({ props: e }) => ({
    class: [
      "relative",
      {
        "flex flex-col h-full": e.scrollHeight === "flex"
      }
    ]
  }),
  mask: {
    class: [
      // Position
      "absolute",
      "top-0 left-0",
      "z-20",
      // Flex & Alignment
      "flex items-center justify-center",
      // Size
      "w-full h-full",
      // Color
      "bg-surface-100/40 dark:bg-surface-800/40",
      // Transition
      "transition duration-200"
    ]
  },
  loadingIcon: {
    class: "w-8 h-8 animate-spin"
  },
  tableContainer: ({ props: e }) => ({
    class: [
      // Overflow
      {
        "relative overflow-auto": e.scrollable,
        "overflow-x-auto": e.resizableColumns
      }
    ]
  }),
  header: ({ props: e }) => ({
    class: [
      "font-semibold",
      // Shape
      e.showGridlines ? "border-x border-t border-b-0" : "border-y border-x-0",
      // Spacing
      "p-4",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "border-surface-200 dark:border-surface-700",
      "text-surface-700 dark:text-white/80"
    ]
  }),
  footer: {
    class: [
      "font-semibold",
      // Shape
      "border-t-0 border-b border-x-0",
      // Spacing
      "p-4",
      // Color
      "bg-surface-0 dark:bg-surface-900",
      "border-surface-200 dark:border-surface-700",
      "text-surface-700 dark:text-white/80"
    ]
  },
  table: {
    class: [
      // Table & Width
      "border-collapse table-fixed w-full "
    ]
  },
  thead: ({ props: e }) => ({
    class: [
      // Position & Z-index
      {
        "top-0 z-40 sticky": e.scrollable
      }
    ]
  }),
  tbody: ({ props: e }) => ({
    class: [
      // Block Display
      {
        block: e.scrollable
      }
    ]
  }),
  tfoot: ({ props: e }) => ({
    class: [
      // Block Display
      {
        block: e.scrollable
      }
    ]
  }),
  headerRow: ({ props: e }) => ({
    class: [
      // Flexbox & Width
      {
        "flex flex-nowrap w-full": e.scrollable
      }
    ]
  }),
  row: ({ context: e, props: t }) => ({
    class: [
      // Flex
      { "flex flex-nowrap w-full": e.scrollable },
      // Color
      "text-surface-700 dark:text-white/80",
      { "bg-highlight": e.selected },
      { "bg-surface-0 text-surface-600 dark:bg-surface-900": !e.selected },
      // Hover & Flexbox
      {
        "hover:bg-surface-100 dark:bg-surface-800/50": e.selectable && !e.selected
      },
      "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 ring-inset dark:focus:ring-primary-400",
      // Transition
      { "transition duration-200": t.selectionMode && !e.selected || t.rowHover }
    ]
  }),
  headerCell: ({ context: e, props: t }) => ({
    class: [
      "font-semibold",
      "leading-[normal]",
      // Position
      { "sticky z-40": e.scrollable && e.scrollDirection === "both" && e.frozen },
      // Flex & Alignment
      {
        "flex flex-1 items-center": e.scrollable,
        "flex-initial shrink-0": e.scrollable && e.scrollDirection === "both" && !e.frozen
      },
      "text-left",
      // Shape
      { "first:border-l border-y border-r": e == null ? void 0 : e.showGridlines },
      "border-0 border-b border-solid",
      // Spacing
      (e == null ? void 0 : e.size) === "small" ? "py-[0.375rem] px-2" : (e == null ? void 0 : e.size) === "large" ? "py-[0.9375rem] px-5" : "py-3 px-4",
      // Color
      (t.sortable === "" || t.sortable) && e.sorted ? "bg-highlight" : "bg-surface-0 text-surface-700 dark:text-white/80 dark:bg-surface-900",
      "border-surface-200 dark:border-surface-700",
      // States
      { "hover:bg-surface-100 dark:hover:bg-surface-80/50": (t.sortable === "" || t.sortable) && !(e != null && e.sorted) },
      "focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      // Transition
      { "transition duration-200": t.sortable === "" || t.sortable },
      // Misc
      {
        "overflow-hidden relative bg-clip-padding": e.resizable && !e.frozen
      }
    ]
  }),
  column: {
    headerCell: ({ context: e, props: t }) => ({
      class: [
        "font-semibold",
        "leading-[normal]",
        // Position
        { "sticky z-40": e.scrollable && e.scrollDirection === "both" && e.frozen },
        // Flex & Alignment
        {
          "flex flex-1 items-center": e.scrollable,
          "flex-initial shrink-0": e.scrollable && e.scrollDirection === "both" && !e.frozen
        },
        "text-left",
        // Shape
        { "first:border-l border-y border-r": e == null ? void 0 : e.showGridlines },
        "border-0 border-b border-solid",
        // Spacing
        (e == null ? void 0 : e.size) === "small" ? "py-[0.375rem] px-2" : (e == null ? void 0 : e.size) === "large" ? "py-[0.9375rem] px-5" : "py-3 px-4",
        // Color
        (t.sortable === "" || t.sortable) && e.sorted ? "bg-highlight" : "bg-surface-0 text-surface-700 dark:text-white/80 dark:bg-surface-900",
        "border-surface-200 dark:border-surface-700",
        // States
        { "hover:bg-surface-100 dark:hover:bg-surface-80/50": (t.sortable === "" || t.sortable) && !(e != null && e.sorted) },
        "focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
        // Transition
        { "transition duration-200": t.sortable === "" || t.sortable },
        // Misc
        {
          "overflow-hidden relative bg-clip-padding": e.resizable && !e.frozen
        }
      ]
    }),
    bodyCell: ({ context: e }) => ({
      class: [
        // Font
        "leading-[normal]",
        // Position
        {
          sticky: e.scrollable && e.scrollDirection === "both" && e.frozen
        },
        // Flex & Alignment
        {
          "flex flex-1 items-center": e.scrollable,
          "flex-initial shrink-0": e.scrollable && e.scrollDirection === "both" && !e.frozen
        },
        "text-left",
        // Shape
        "border-0 border-b border-solid",
        "border-surface-200 dark:border-surface-700",
        {
          "border-x-0 border-l-0": !e.showGridlines
        },
        { "first:border-l border-r border-b": e == null ? void 0 : e.showGridlines },
        // Spacing
        (e == null ? void 0 : e.size) === "small" ? "py-[0.375rem] px-2" : (e == null ? void 0 : e.size) === "large" ? "py-[0.9375rem] px-5" : "py-3 px-4",
        // Misc
        {
          "cursor-pointer": e.selectable,
          sticky: e.scrollable && e.scrollDirection === "both" && e.frozen,
          "border-x-0 border-l-0": !e.showGridlines
        }
      ]
    }),
    bodyCellContent: "flex items-center gap-2",
    rowToggleButton: {
      class: [
        "relative",
        // Flex & Alignment
        "inline-flex items-center justify-center",
        "text-left align-middle",
        // Spacing
        "m-0 mr-2 p-0",
        // Size
        "w-7 h-7",
        // Shape
        "border-0 rounded-full",
        // Color
        "text-surface-700 dark:text-white/70",
        "border-transparent",
        // States
        "focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400",
        "hover:text-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50",
        // Transition
        "transition duration-200",
        // Misc
        "overflow-hidden",
        "cursor-pointer select-none"
      ]
    },
    sortIcon: ({ context: e }) => ({
      class: ["ml-2 inline-block", e.sorted ? "text-inherit" : "fill-surface-700 dark:fill-white/70"]
    }),
    columnResizer: {
      class: [
        "block",
        // Position
        "absolute top-0 right-0",
        // Sizing
        "w-2 h-full",
        // Spacing
        "m-0 p-0",
        // Color
        "border border-transparent",
        // Misc
        "cursor-col-resize"
      ]
    },
    transition: {
      enterFromClass: "opacity-0 scale-y-[0.8]",
      enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
      leaveActiveClass: "transition-opacity duration-100 ease-linear",
      leaveToClass: "opacity-0"
    }
  },
  columnResizeIndicator: {
    class: "absolute hidden w-[2px] z-20 bg-primary"
  }
}, _l = {
  global: fi,
  directives: {
    badge: Ds,
    ripple: Di,
    tooltip: yl
  },
  //forms
  autocomplete: Ms,
  select: so,
  dropdown: so,
  inputnumber: yi,
  inputtext: ki,
  datepicker: no,
  calendar: no,
  checkbox: Js,
  radiobutton: Bi,
  toggleswitch: io,
  inputswitch: io,
  selectbutton: Ki,
  slider: Gi,
  rating: Vi,
  multiselect: Oi,
  togglebutton: ml,
  cascadeselect: Ys,
  listbox: _i,
  colorpicker: Zs,
  inputgroup: hi,
  inputgroupaddon: mi,
  inputmask: vi,
  knob: wi,
  treeselect: kl,
  textarea: pl,
  password: Ni,
  iconfield: pi,
  floatlabel: ui,
  inputotp: xi,
  //buttons
  button: Ks,
  buttongroup: Ws,
  splitbutton: Yi,
  speeddial: qi,
  //data
  paginator: zi,
  datatable: ri,
  tree: xl,
  dataview: ni,
  organizationchart: ji,
  orderlist: Ai,
  picklist: Ri,
  treetable: wl,
  timeline: gl,
  //panels
  accordion: Ls,
  accordionpanel: Rs,
  accordionheader: Ns,
  accordioncontent: Es,
  panel: Li,
  fieldset: li,
  card: Gs,
  tabview: ul,
  divider: si,
  toolbar: vl,
  scrollpanel: Hi,
  splitter: Ji,
  splitterpanel: Qi,
  stepper: rl,
  steplist: el,
  step: Zi,
  stepitem: Xi,
  steppanels: tl,
  deferred: oi,
  tab: ol,
  tabs: cl,
  tablist: al,
  tabpanels: ll,
  tabpanel: il,
  //file
  fileupload: ci,
  //menu
  contextmenu: ti,
  menu: Ci,
  menubar: $i,
  steps: nl,
  tieredmenu: bl,
  breadcrumb: Us,
  panelmenu: Ei,
  megamenu: Si,
  dock: ii,
  tabmenu: sl,
  //overlays
  dialog: ai,
  popover: ao,
  sidebar: ao,
  drawer: oo,
  overlaypanel: oo,
  confirmpopup: ei,
  confirmdialog: Xs,
  //messages
  message: Ti,
  toast: hl,
  //media
  carousel: qs,
  galleria: di,
  image: bi,
  //misc
  badge: Vs,
  overlaybadge: Ii,
  avatar: Fs,
  avatargroup: Bs,
  tag: dl,
  chip: Qs,
  progressbar: Mi,
  skeleton: Wi,
  scrolltop: Ui,
  terminal: fl,
  blockui: Hs,
  metergroup: Pi,
  inplace: gi,
  progressspinner: Fi
};
var Sl = Object.defineProperty, lo = Object.getOwnPropertySymbols, Cl = Object.prototype.hasOwnProperty, $l = Object.prototype.propertyIsEnumerable, co = (e, t, r) => t in e ? Sl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Tl = (e, t) => {
  for (var r in t || (t = {}))
    Cl.call(t, r) && co(e, r, t[r]);
  if (lo)
    for (var r of lo(t))
      $l.call(t, r) && co(e, r, t[r]);
  return e;
};
function Pt(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function On(e) {
  return !!(e && e.constructor && e.call && e.apply);
}
function Z(e) {
  return !Pt(e);
}
function Ze(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function Ee(e, ...t) {
  return On(e) ? e(...t) : e;
}
function Se(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function De(e) {
  return Se(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function An(e, t = "", r = {}) {
  const n = De(t).split("."), o = n.shift();
  return o ? Ze(e) ? An(Ee(e[Object.keys(e).find((a) => De(a) === o) || ""], r), n.join("."), r) : void 0 : Ee(e, r);
}
function Br(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function pa(e) {
  return Z(e) && !isNaN(e);
}
function nt(e, t) {
  if (t) {
    const r = t.test(e);
    return t.lastIndex = 0, r;
  }
  return !1;
}
function Pl(...e) {
  const t = (r = {}, n = {}) => {
    const o = Tl({}, r);
    return Object.keys(n).forEach((a) => {
      Ze(n[a]) && a in r && Ze(r[a]) ? o[a] = t(r[a], n[a]) : o[a] = n[a];
    }), o;
  };
  return e.reduce((r, n, o) => o === 0 ? n : t(r, n), {});
}
function qt(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":");
}
function Ol(e) {
  return Se(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function ba(e) {
  return Se(e) ? e.replace(/(_)/g, "-").replace(/[A-Z]/g, (t, r) => r === 0 ? t : "-" + t.toLowerCase()).toLowerCase() : e;
}
function uo(e) {
  return Se(e) ? e.replace(/[A-Z]/g, (t, r) => r === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function ga() {
  const e = /* @__PURE__ */ new Map();
  return {
    on(t, r) {
      let n = e.get(t);
      return n ? n.push(r) : n = [r], e.set(t, n), this;
    },
    off(t, r) {
      let n = e.get(t);
      return n && n.splice(n.indexOf(r) >>> 0, 1), this;
    },
    emit(t, r) {
      let n = e.get(t);
      n && n.slice().map((o) => {
        o(r);
      });
    },
    clear() {
      e.clear();
    }
  };
}
var Al = Object.defineProperty, jl = Object.defineProperties, Il = Object.getOwnPropertyDescriptors, zr = Object.getOwnPropertySymbols, ha = Object.prototype.hasOwnProperty, ma = Object.prototype.propertyIsEnumerable, fo = (e, t, r) => t in e ? Al(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, He = (e, t) => {
  for (var r in t || (t = {}))
    ha.call(t, r) && fo(e, r, t[r]);
  if (zr)
    for (var r of zr(t))
      ma.call(t, r) && fo(e, r, t[r]);
  return e;
}, tn = (e, t) => jl(e, Il(t)), et = (e, t) => {
  var r = {};
  for (var n in e)
    ha.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
  if (e != null && zr)
    for (var n of zr(e))
      t.indexOf(n) < 0 && ma.call(e, n) && (r[n] = e[n]);
  return r;
}, zl = ga(), Ve = zl;
function po(e, t) {
  Br(e) ? e.push(...t || []) : Ze(e) && Object.assign(e, t);
}
function Ll(e) {
  return Ze(e) && e.hasOwnProperty("value") && e.hasOwnProperty("type") ? e.value : e;
}
function bo(e, t = "") {
  return ["opacity", "z-index", "line-height", "font-weight", "flex", "flex-grow", "flex-shrink", "order"].some((n) => t.endsWith(n)) ? e : `${e}`.trim().split(" ").map((a) => pa(a) ? `${a}px` : a).join(" ");
}
function El(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function pn(e = "", t = "") {
  return El(`${Se(e, !1) && Se(t, !1) ? `${e}-` : e}${t}`);
}
function va(e = "", t = "") {
  return `--${pn(e, t)}`;
}
function ya(e, t = "", r = "", n = [], o) {
  if (Se(e)) {
    const a = /{([^}]*)}/g, s = e.trim();
    if (nt(s, a)) {
      const i = s.replaceAll(a, (u) => {
        const b = u.replace(/{|}/g, "").split(".").filter((h) => !n.some((S) => nt(h, S)));
        return `var(${va(r, ba(b.join("-")))}${Z(o) ? `, ${o}` : ""})`;
      }), l = /(\d+\s+[\+\-\*\/]\s+\d+)/g, c = /var\([^)]+\)/g;
      return nt(i.replace(c, "0"), l) ? `calc(${i})` : i;
    }
    return bo(s, t);
  } else if (pa(e))
    return bo(e, t);
}
function Nl(e, t, r) {
  Se(t, !1) && e.push(`${t}:${r};`);
}
function It(e, t) {
  return e ? `${e}{${t}}` : "";
}
var Yt = (...e) => Rl(Y.getTheme(), ...e), Rl = (e = {}, t, r, n) => {
  if (t) {
    const { variable: o, options: a } = Y.defaults || {}, { prefix: s, transform: i } = (e == null ? void 0 : e.options) || a || {}, c = nt(t, /{([^}]*)}/g) ? t : `{${t}}`;
    return n === "value" || Pt(n) && i === "strict" ? Y.getTokenValue(t) : ya(c, void 0, s, [o.excludedKeyRegex], r);
  }
  return "";
};
function Ml(e, t = {}) {
  const r = Y.defaults.variable, { prefix: n = r.prefix, selector: o = r.selector, excludedKeyRegex: a = r.excludedKeyRegex } = t, s = (c, u = "") => Object.entries(c).reduce(
    (p, [b, h]) => {
      const S = nt(b, a) ? pn(u) : pn(u, ba(b)), x = Ll(h);
      if (Ze(x)) {
        const { variables: T, tokens: v } = s(x, S);
        po(p.tokens, v), po(p.variables, T);
      } else
        p.tokens.push((n ? S.replace(`${n}-`, "") : S).replaceAll("-", ".")), Nl(p.variables, va(S), ya(x, S, n, [a]));
      return p;
    },
    { variables: [], tokens: [] }
  ), { variables: i, tokens: l } = s(e, n);
  return {
    value: i,
    tokens: l,
    declarations: i.join(""),
    css: It(o, i.join(""))
  };
}
var Fe = {
  regex: {
    rules: {
      class: {
        pattern: /^\.([a-zA-Z][\w-]*)$/,
        resolve(e) {
          return { type: "class", selector: e, matched: this.pattern.test(e.trim()) };
        }
      },
      attr: {
        pattern: /^\[(.*)\]$/,
        resolve(e) {
          return { type: "attr", selector: `:root${e}`, matched: this.pattern.test(e.trim()) };
        }
      },
      media: {
        pattern: /^@media (.*)$/,
        resolve(e) {
          return { type: "media", selector: `${e}{:root{[CSS]}}`, matched: this.pattern.test(e.trim()) };
        }
      },
      system: {
        pattern: /^system$/,
        resolve(e) {
          return { type: "system", selector: "@media (prefers-color-scheme: dark){:root{[CSS]}}", matched: this.pattern.test(e.trim()) };
        }
      },
      custom: {
        resolve(e) {
          return { type: "custom", selector: e, matched: !0 };
        }
      }
    },
    resolve(e) {
      const t = Object.keys(this.rules).filter((r) => r !== "custom").map((r) => this.rules[r]);
      return [e].flat().map((r) => {
        var n;
        return (n = t.map((o) => o.resolve(r)).find((o) => o.matched)) != null ? n : this.rules.custom.resolve(r);
      });
    }
  },
  _toVariables(e, t) {
    return Ml(e, { prefix: t == null ? void 0 : t.prefix });
  },
  getCommon({ name: e = "", theme: t = {}, params: r, set: n, defaults: o }) {
    var a, s, i, l, c, u, p;
    const { preset: b, options: h } = t;
    let S, x, T, v, O, m, A;
    if (Z(b) && h.transform !== "strict") {
      const { primitive: D, semantic: E, extend: ie } = b, se = E || {}, { colorScheme: je } = se, he = et(se, ["colorScheme"]), ye = ie || {}, { colorScheme: Ie } = ye, ze = et(ye, ["colorScheme"]), Le = je || {}, { dark: We } = Le, ne = et(Le, ["dark"]), W = Ie || {}, { dark: H } = W, xe = et(W, ["dark"]), ke = Z(D) ? this._toVariables({ primitive: D }, h) : {}, le = Z(he) ? this._toVariables({ semantic: he }, h) : {}, ce = Z(ne) ? this._toVariables({ light: ne }, h) : {}, xt = Z(We) ? this._toVariables({ dark: We }, h) : {}, st = Z(ze) ? this._toVariables({ semantic: ze }, h) : {}, mr = Z(xe) ? this._toVariables({ light: xe }, h) : {}, it = Z(H) ? this._toVariables({ dark: H }, h) : {}, [At, Vt] = [(a = ke.declarations) != null ? a : "", ke.tokens], [vr, kt] = [(s = le.declarations) != null ? s : "", le.tokens || []], [Xn, d] = [(i = ce.declarations) != null ? i : "", ce.tokens || []], [f, g] = [(l = xt.declarations) != null ? l : "", xt.tokens || []], [w, y] = [(c = st.declarations) != null ? c : "", st.tokens || []], [_, P] = [(u = mr.declarations) != null ? u : "", mr.tokens || []], [C, $] = [(p = it.declarations) != null ? p : "", it.tokens || []];
      S = this.transformCSS(e, At, "light", "variable", h, n, o), x = Vt;
      const k = this.transformCSS(e, `${vr}${Xn}`, "light", "variable", h, n, o), j = this.transformCSS(e, `${f}`, "dark", "variable", h, n, o);
      T = `${k}${j}`, v = [.../* @__PURE__ */ new Set([...kt, ...d, ...g])];
      const z = this.transformCSS(e, `${w}${_}color-scheme:light`, "light", "variable", h, n, o), I = this.transformCSS(e, `${C}color-scheme:dark`, "dark", "variable", h, n, o);
      O = `${z}${I}`, m = [.../* @__PURE__ */ new Set([...y, ...P, ...$])], A = Ee(b.css, { dt: Yt });
    }
    return {
      primitive: {
        css: S,
        tokens: x
      },
      semantic: {
        css: T,
        tokens: v
      },
      global: {
        css: O,
        tokens: m
      },
      style: A
    };
  },
  getPreset({ name: e = "", preset: t = {}, options: r, params: n, set: o, defaults: a, selector: s }) {
    var i, l, c;
    let u, p, b;
    if (Z(t) && r.transform !== "strict") {
      const h = e.replace("-directive", ""), S = t, { colorScheme: x, extend: T, css: v } = S, O = et(S, ["colorScheme", "extend", "css"]), m = T || {}, { colorScheme: A } = m, D = et(m, ["colorScheme"]), E = x || {}, { dark: ie } = E, se = et(E, ["dark"]), je = A || {}, { dark: he } = je, ye = et(je, ["dark"]), Ie = Z(O) ? this._toVariables({ [h]: He(He({}, O), D) }, r) : {}, ze = Z(se) ? this._toVariables({ [h]: He(He({}, se), ye) }, r) : {}, Le = Z(ie) ? this._toVariables({ [h]: He(He({}, ie), he) }, r) : {}, [We, ne] = [(i = Ie.declarations) != null ? i : "", Ie.tokens || []], [W, H] = [(l = ze.declarations) != null ? l : "", ze.tokens || []], [xe, ke] = [(c = Le.declarations) != null ? c : "", Le.tokens || []], le = this.transformCSS(h, `${We}${W}`, "light", "variable", r, o, a, s), ce = this.transformCSS(h, xe, "dark", "variable", r, o, a, s);
      u = `${le}${ce}`, p = [.../* @__PURE__ */ new Set([...ne, ...H, ...ke])], b = Ee(v, { dt: Yt });
    }
    return {
      css: u,
      tokens: p,
      style: b
    };
  },
  getPresetC({ name: e = "", theme: t = {}, params: r, set: n, defaults: o }) {
    var a;
    const { preset: s, options: i } = t, l = (a = s == null ? void 0 : s.components) == null ? void 0 : a[e];
    return this.getPreset({ name: e, preset: l, options: i, params: r, set: n, defaults: o });
  },
  getPresetD({ name: e = "", theme: t = {}, params: r, set: n, defaults: o }) {
    var a;
    const s = e.replace("-directive", ""), { preset: i, options: l } = t, c = (a = i == null ? void 0 : i.directives) == null ? void 0 : a[s];
    return this.getPreset({ name: s, preset: c, options: l, params: r, set: n, defaults: o });
  },
  applyDarkColorScheme(e) {
    return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
  },
  getColorSchemeOption(e, t) {
    var r;
    return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (r = e.darkModeSelector) != null ? r : t.options.darkModeSelector) : [];
  },
  getLayerOrder(e, t = {}, r, n) {
    const { cssLayer: o } = t;
    return o ? `@layer ${Ee(o.order || "primeui", r)}` : "";
  },
  getCommonStyleSheet({ name: e = "", theme: t = {}, params: r, props: n = {}, set: o, defaults: a }) {
    const s = this.getCommon({ name: e, theme: t, params: r, set: o, defaults: a }), i = Object.entries(n).reduce((l, [c, u]) => l.push(`${c}="${u}"`) && l, []).join(" ");
    return Object.entries(s || {}).reduce((l, [c, u]) => {
      if (u != null && u.css) {
        const p = qt(u == null ? void 0 : u.css), b = `${c}-variables`;
        l.push(`<style type="text/css" data-primevue-style-id="${b}" ${i}>${p}</style>`);
      }
      return l;
    }, []).join("");
  },
  getStyleSheet({ name: e = "", theme: t = {}, params: r, props: n = {}, set: o, defaults: a }) {
    var s;
    const i = { name: e, theme: t, params: r, set: o, defaults: a }, l = (s = e.includes("-directive") ? this.getPresetD(i) : this.getPresetC(i)) == null ? void 0 : s.css, c = Object.entries(n).reduce((u, [p, b]) => u.push(`${p}="${b}"`) && u, []).join(" ");
    return l ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${c}>${qt(l)}</style>` : "";
  },
  createTokens(e = {}, t, r = "", n = "", o = {}) {
    return Object.entries(e).forEach(([a, s]) => {
      const i = nt(a, t.variable.excludedKeyRegex) ? r : r ? `${r}.${uo(a)}` : uo(a), l = n ? `${n}.${a}` : a;
      Ze(s) ? this.createTokens(s, t, i, l, o) : (o[i] || (o[i] = {
        paths: [],
        computed(c, u = {}) {
          var p, b;
          return this.paths.length === 1 ? (p = this.paths[0]) == null ? void 0 : p.computed(this.paths[0].scheme, u.binding) : c && c !== "none" ? (b = this.paths.find((h) => h.scheme === c)) == null ? void 0 : b.computed(c, u.binding) : this.paths.map((h) => h.computed(h.scheme, u[h.scheme]));
        }
      }), o[i].paths.push({
        path: l,
        value: s,
        scheme: l.includes("colorScheme.light") ? "light" : l.includes("colorScheme.dark") ? "dark" : "none",
        computed(c, u = {}) {
          const p = /{([^}]*)}/g;
          let b = s;
          if (u.name = this.path, u.binding || (u.binding = {}), nt(s, p)) {
            const S = s.trim().replaceAll(p, (v) => {
              var O;
              const m = v.replace(/{|}/g, ""), A = (O = o[m]) == null ? void 0 : O.computed(c, u);
              return Br(A) && A.length === 2 ? `light-dark(${A[0].value},${A[1].value})` : A == null ? void 0 : A.value;
            }), x = /(\d+\w*\s+[\+\-\*\/]\s+\d+\w*)/g, T = /var\([^)]+\)/g;
            b = nt(S.replace(T, "0"), x) ? `calc(${S})` : S;
          }
          return Pt(u.binding) && delete u.binding, {
            colorScheme: c,
            path: this.path,
            paths: u,
            value: b.includes("undefined") ? void 0 : b
          };
        }
      }));
    }), o;
  },
  getTokenValue(e, t, r) {
    var n;
    const a = ((l) => l.split(".").filter((u) => !nt(u.toLowerCase(), r.variable.excludedKeyRegex)).join("."))(t), s = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, i = [(n = e[a]) == null ? void 0 : n.computed(s)].flat().filter((l) => l);
    return i.length === 1 ? i[0].value : i.reduce((l = {}, c) => {
      const u = c, { colorScheme: p } = u, b = et(u, ["colorScheme"]);
      return l[p] = b, l;
    }, void 0);
  },
  getSelectorRule(e, t, r, n) {
    return r === "class" || r === "attr" ? It(Z(t) ? `${e}${t},${e} ${t}` : e, n) : It(e, Z(t) ? It(t, n) : n);
  },
  transformCSS(e, t, r, n, o = {}, a, s, i) {
    if (Z(t)) {
      const { cssLayer: l } = o;
      if (n !== "style") {
        const c = this.getColorSchemeOption(o, s);
        t = r === "dark" ? c.reduce((u, { type: p, selector: b }) => (Z(b) && (u += b.includes("[CSS]") ? b.replace("[CSS]", t) : this.getSelectorRule(b, i, p, t)), u), "") : It(i ?? ":root", t);
      }
      if (l) {
        const c = {
          name: "primeui"
        };
        Ze(l) && (c.name = Ee(l.name, { name: e, type: n })), Z(c.name) && (t = It(`@layer ${c.name}`, t), a == null || a.layerNames(c.name));
      }
      return t;
    }
    return "";
  }
}, Y = {
  defaults: {
    variable: {
      prefix: "p",
      selector: ":root",
      excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi
    },
    options: {
      prefix: "p",
      darkModeSelector: "system",
      cssLayer: !1
    }
  },
  _theme: void 0,
  _layerNames: /* @__PURE__ */ new Set(),
  _loadedStyleNames: /* @__PURE__ */ new Set(),
  _loadingStyles: /* @__PURE__ */ new Set(),
  _tokens: {},
  update(e = {}) {
    const { theme: t } = e;
    t && (this._theme = tn(He({}, t), {
      options: He(He({}, this.defaults.options), t.options)
    }), this._tokens = Fe.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
  },
  get theme() {
    return this._theme;
  },
  get preset() {
    var e;
    return ((e = this.theme) == null ? void 0 : e.preset) || {};
  },
  get options() {
    var e;
    return ((e = this.theme) == null ? void 0 : e.options) || {};
  },
  get tokens() {
    return this._tokens;
  },
  getTheme() {
    return this.theme;
  },
  setTheme(e) {
    this.update({ theme: e }), Ve.emit("theme:change", e);
  },
  getPreset() {
    return this.preset;
  },
  setPreset(e) {
    this._theme = tn(He({}, this.theme), { preset: e }), this._tokens = Fe.createTokens(e, this.defaults), this.clearLoadedStyleNames(), Ve.emit("preset:change", e), Ve.emit("theme:change", this.theme);
  },
  getOptions() {
    return this.options;
  },
  setOptions(e) {
    this._theme = tn(He({}, this.theme), { options: e }), this.clearLoadedStyleNames(), Ve.emit("options:change", e), Ve.emit("theme:change", this.theme);
  },
  getLayerNames() {
    return [...this._layerNames];
  },
  setLayerNames(e) {
    this._layerNames.add(e);
  },
  getLoadedStyleNames() {
    return this._loadedStyleNames;
  },
  isStyleNameLoaded(e) {
    return this._loadedStyleNames.has(e);
  },
  setLoadedStyleName(e) {
    this._loadedStyleNames.add(e);
  },
  deleteLoadedStyleName(e) {
    this._loadedStyleNames.delete(e);
  },
  clearLoadedStyleNames() {
    this._loadedStyleNames.clear();
  },
  getTokenValue(e) {
    return Fe.getTokenValue(this.tokens, e, this.defaults);
  },
  getCommon(e = "", t) {
    return Fe.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
  },
  getComponent(e = "", t) {
    const r = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
    return Fe.getPresetC(r);
  },
  getDirective(e = "", t) {
    const r = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
    return Fe.getPresetD(r);
  },
  getCustomPreset(e = "", t, r, n) {
    const o = { name: e, preset: t, options: this.options, selector: r, params: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
    return Fe.getPreset(o);
  },
  getLayerOrderCSS(e = "") {
    return Fe.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
  },
  transformCSS(e = "", t, r = "style", n) {
    return Fe.transformCSS(e, t, n, r, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
  },
  getCommonStyleSheet(e = "", t, r = {}) {
    return Fe.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
  },
  getStyleSheet(e, t, r = {}) {
    return Fe.getStyleSheet({ name: e, theme: this.theme, params: t, props: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
  },
  onStyleMounted(e) {
    this._loadingStyles.add(e);
  },
  onStyleUpdated(e) {
    this._loadingStyles.add(e);
  },
  onStyleLoaded(e, { name: t }) {
    this._loadingStyles.size && (this._loadingStyles.delete(t), Ve.emit(`theme:${t}:load`, e), !this._loadingStyles.size && Ve.emit("theme:load"));
  }
};
function Fl(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function Bl(e, t) {
  if (e && t) {
    const r = (n) => {
      Fl(e, n) || (e.classList ? e.classList.add(n) : e.className += " " + n);
    };
    [t].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(r));
  }
}
function rn(e, t) {
  if (e && t) {
    const r = (n) => {
      e.classList ? e.classList.remove(n) : e.className = e.className.replace(new RegExp("(^|\\b)" + n.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(r));
  }
}
function Vl(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function Vr(e) {
  return typeof HTMLElement == "object" ? e instanceof HTMLElement : e && typeof e == "object" && e !== null && e.nodeType === 1 && typeof e.nodeName == "string";
}
function Lr(e, t = {}) {
  if (Vr(e)) {
    const r = (n, o) => {
      var a, s;
      const i = (a = e == null ? void 0 : e.$attrs) != null && a[n] ? [(s = e == null ? void 0 : e.$attrs) == null ? void 0 : s[n]] : [];
      return [o].flat().reduce((l, c) => {
        if (c != null) {
          const u = typeof c;
          if (u === "string" || u === "number")
            l.push(c);
          else if (u === "object") {
            const p = Array.isArray(c) ? r(n, c) : Object.entries(c).map(([b, h]) => n === "style" && (h || h === 0) ? `${b.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${h}` : h ? b : void 0);
            l = p.length ? l.concat(p.filter((b) => !!b)) : l;
          }
        }
        return l;
      }, i);
    };
    Object.entries(t).forEach(([n, o]) => {
      if (o != null) {
        const a = n.match(/^on(.+)/);
        a ? e.addEventListener(a[1].toLowerCase(), o) : n === "p-bind" ? Lr(e, o) : (o = n === "class" ? [...new Set(r("class", o))].join(" ").trim() : n === "style" ? r("style", o).join(";").trim() : o, (e.$attrs = e.$attrs || {}) && (e.$attrs[n] = o), e.setAttribute(n, o));
      }
    });
  }
}
function Dl(e, t = {}, ...r) {
  {
    const n = document.createElement(e);
    return Lr(n, t), n.append(...r), n;
  }
}
function Hl(e, t) {
  return Vr(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function Ul(e, t) {
  if (Vr(e)) {
    const r = e.getAttribute(t);
    return isNaN(r) ? r === "true" || r === "false" ? r === "true" : r : +r;
  }
}
function go(e) {
  if (e) {
    let t = e.offsetHeight, r = getComputedStyle(e);
    return t -= parseFloat(r.paddingTop) + parseFloat(r.paddingBottom) + parseFloat(r.borderTopWidth) + parseFloat(r.borderBottomWidth), t;
  }
  return 0;
}
function Kl(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function Wl(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return {
      top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
      left: t.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
    };
  }
  return {
    top: "auto",
    left: "auto"
  };
}
function Gl(e, t) {
  return e ? e.offsetHeight : 0;
}
function ql(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && Kl(e));
}
function ho(e) {
  if (e) {
    let t = e.offsetWidth, r = getComputedStyle(e);
    return t -= parseFloat(r.paddingLeft) + parseFloat(r.paddingRight) + parseFloat(r.borderLeftWidth) + parseFloat(r.borderRightWidth), t;
  }
  return 0;
}
function xa() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function Yl(e, t = "", r) {
  Vr(e) && r !== null && r !== void 0 && e.setAttribute(t, r);
}
var yr = {};
function ka(e = "pui_id_") {
  return yr.hasOwnProperty(e) || (yr[e] = 0), yr[e]++, `${e}${yr[e]}`;
}
var be = {
  STARTS_WITH: "startsWith",
  CONTAINS: "contains",
  NOT_CONTAINS: "notContains",
  ENDS_WITH: "endsWith",
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUAL_TO: "lte",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUAL_TO: "gte",
  DATE_IS: "dateIs",
  DATE_IS_NOT: "dateIsNot",
  DATE_BEFORE: "dateBefore",
  DATE_AFTER: "dateAfter"
};
/**
* @vue/shared v3.4.37
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function jn(e, t) {
  const r = new Set(e.split(","));
  return t ? (n) => r.has(n.toLowerCase()) : (n) => r.has(n);
}
const te = {}, Et = [], Ne = () => {
}, Jl = () => !1, Dr = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), In = (e) => e.startsWith("onUpdate:"), Ce = Object.assign, zn = (e, t) => {
  const r = e.indexOf(t);
  r > -1 && e.splice(r, 1);
}, Ql = Object.prototype.hasOwnProperty, K = (e, t) => Ql.call(e, t), N = Array.isArray, Nt = (e) => gr(e) === "[object Map]", Hr = (e) => gr(e) === "[object Set]", mo = (e) => gr(e) === "[object Date]", M = (e) => typeof e == "function", ae = (e) => typeof e == "string", Xe = (e) => typeof e == "symbol", X = (e) => e !== null && typeof e == "object", wa = (e) => (X(e) || M(e)) && M(e.then) && M(e.catch), _a = Object.prototype.toString, gr = (e) => _a.call(e), Zl = (e) => gr(e).slice(8, -1), Sa = (e) => gr(e) === "[object Object]", Ln = (e) => ae(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Jt = /* @__PURE__ */ jn(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Ur = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, Xl = /-(\w)/g, Ke = Ur((e) => e.replace(Xl, (t, r) => r ? r.toUpperCase() : "")), ec = /\B([A-Z])/g, Ot = Ur(
  (e) => e.replace(ec, "-$1").toLowerCase()
), Kr = Ur((e) => e.charAt(0).toUpperCase() + e.slice(1)), nn = Ur((e) => e ? `on${Kr(e)}` : ""), ht = (e, t) => !Object.is(e, t), Or = (e, ...t) => {
  for (let r = 0; r < e.length; r++)
    e[r](...t);
}, Ca = (e, t, r, n = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: n,
    value: r
  });
}, $a = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let vo;
const Ta = () => vo || (vo = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function En(e) {
  if (N(e)) {
    const t = {};
    for (let r = 0; r < e.length; r++) {
      const n = e[r], o = ae(n) ? oc(n) : En(n);
      if (o)
        for (const a in o)
          t[a] = o[a];
    }
    return t;
  } else if (ae(e) || X(e))
    return e;
}
const tc = /;(?![^(]*\))/g, rc = /:([^]+)/, nc = /\/\*[^]*?\*\//g;
function oc(e) {
  const t = {};
  return e.replace(nc, "").split(tc).forEach((r) => {
    if (r) {
      const n = r.split(rc);
      n.length > 1 && (t[n[0].trim()] = n[1].trim());
    }
  }), t;
}
function _e(e) {
  let t = "";
  if (ae(e))
    t = e;
  else if (N(e))
    for (let r = 0; r < e.length; r++) {
      const n = _e(e[r]);
      n && (t += n + " ");
    }
  else if (X(e))
    for (const r in e)
      e[r] && (t += r + " ");
  return t.trim();
}
const ac = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", sc = /* @__PURE__ */ jn(ac);
function Pa(e) {
  return !!e || e === "";
}
function ic(e, t) {
  if (e.length !== t.length) return !1;
  let r = !0;
  for (let n = 0; r && n < e.length; n++)
    r = Wr(e[n], t[n]);
  return r;
}
function Wr(e, t) {
  if (e === t) return !0;
  let r = mo(e), n = mo(t);
  if (r || n)
    return r && n ? e.getTime() === t.getTime() : !1;
  if (r = Xe(e), n = Xe(t), r || n)
    return e === t;
  if (r = N(e), n = N(t), r || n)
    return r && n ? ic(e, t) : !1;
  if (r = X(e), n = X(t), r || n) {
    if (!r || !n)
      return !1;
    const o = Object.keys(e).length, a = Object.keys(t).length;
    if (o !== a)
      return !1;
    for (const s in e) {
      const i = e.hasOwnProperty(s), l = t.hasOwnProperty(s);
      if (i && !l || !i && l || !Wr(e[s], t[s]))
        return !1;
    }
  }
  return String(e) === String(t);
}
function lc(e, t) {
  return e.findIndex((r) => Wr(r, t));
}
const Oa = (e) => !!(e && e.__v_isRef === !0), ee = (e) => ae(e) ? e : e == null ? "" : N(e) || X(e) && (e.toString === _a || !M(e.toString)) ? Oa(e) ? ee(e.value) : JSON.stringify(e, Aa, 2) : String(e), Aa = (e, t) => Oa(t) ? Aa(e, t.value) : Nt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (r, [n, o], a) => (r[on(n, a) + " =>"] = o, r),
    {}
  )
} : Hr(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((r) => on(r))
} : Xe(t) ? on(t) : X(t) && !N(t) && !Sa(t) ? String(t) : t, on = (e, t = "") => {
  var r;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    Xe(e) ? `Symbol(${(r = e.description) != null ? r : t})` : e
  );
};
/**
* @vue/reactivity v3.4.37
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Be;
class cc {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this.effects = [], this.cleanups = [], this.parent = Be, !t && Be && (this.index = (Be.scopes || (Be.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  run(t) {
    if (this._active) {
      const r = Be;
      try {
        return Be = this, t();
      } finally {
        Be = r;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    Be = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    Be = this.parent;
  }
  stop(t) {
    if (this._active) {
      let r, n;
      for (r = 0, n = this.effects.length; r < n; r++)
        this.effects[r].stop();
      for (r = 0, n = this.cleanups.length; r < n; r++)
        this.cleanups[r]();
      if (this.scopes)
        for (r = 0, n = this.scopes.length; r < n; r++)
          this.scopes[r].stop(!0);
      if (!this.detached && this.parent && !t) {
        const o = this.parent.scopes.pop();
        o && o !== this && (this.parent.scopes[this.index] = o, o.index = this.index);
      }
      this.parent = void 0, this._active = !1;
    }
  }
}
function uc(e, t = Be) {
  t && t.active && t.effects.push(e);
}
function dc() {
  return Be;
}
let Ct;
class Nn {
  constructor(t, r, n, o) {
    this.fn = t, this.trigger = r, this.scheduler = n, this.active = !0, this.deps = [], this._dirtyLevel = 4, this._trackId = 0, this._runnings = 0, this._shouldSchedule = !1, this._depsLength = 0, uc(this, o);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1, vt();
      for (let t = 0; t < this._depsLength; t++) {
        const r = this.deps[t];
        if (r.computed && (fc(r.computed), this._dirtyLevel >= 4))
          break;
      }
      this._dirtyLevel === 1 && (this._dirtyLevel = 0), yt();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(t) {
    this._dirtyLevel = t ? 4 : 0;
  }
  run() {
    if (this._dirtyLevel = 0, !this.active)
      return this.fn();
    let t = bt, r = Ct;
    try {
      return bt = !0, Ct = this, this._runnings++, yo(this), this.fn();
    } finally {
      xo(this), this._runnings--, Ct = r, bt = t;
    }
  }
  stop() {
    this.active && (yo(this), xo(this), this.onStop && this.onStop(), this.active = !1);
  }
}
function fc(e) {
  return e.value;
}
function yo(e) {
  e._trackId++, e._depsLength = 0;
}
function xo(e) {
  if (e.deps.length > e._depsLength) {
    for (let t = e._depsLength; t < e.deps.length; t++)
      ja(e.deps[t], e);
    e.deps.length = e._depsLength;
  }
}
function ja(e, t) {
  const r = e.get(t);
  r !== void 0 && t._trackId !== r && (e.delete(t), e.size === 0 && e.cleanup());
}
let bt = !0, bn = 0;
const Ia = [];
function vt() {
  Ia.push(bt), bt = !1;
}
function yt() {
  const e = Ia.pop();
  bt = e === void 0 ? !0 : e;
}
function Rn() {
  bn++;
}
function Mn() {
  for (bn--; !bn && gn.length; )
    gn.shift()();
}
function za(e, t, r) {
  if (t.get(e) !== e._trackId) {
    t.set(e, e._trackId);
    const n = e.deps[e._depsLength];
    n !== t ? (n && ja(n, e), e.deps[e._depsLength++] = t) : e._depsLength++;
  }
}
const gn = [];
function La(e, t, r) {
  Rn();
  for (const n of e.keys()) {
    let o;
    n._dirtyLevel < t && (o ?? (o = e.get(n) === n._trackId)) && (n._shouldSchedule || (n._shouldSchedule = n._dirtyLevel === 0), n._dirtyLevel = t), n._shouldSchedule && (o ?? (o = e.get(n) === n._trackId)) && (n.trigger(), (!n._runnings || n.allowRecurse) && n._dirtyLevel !== 2 && (n._shouldSchedule = !1, n.scheduler && gn.push(n.scheduler)));
  }
  Mn();
}
const Ea = (e, t) => {
  const r = /* @__PURE__ */ new Map();
  return r.cleanup = e, r.computed = t, r;
}, hn = /* @__PURE__ */ new WeakMap(), $t = Symbol(""), mn = Symbol("");
function $e(e, t, r) {
  if (bt && Ct) {
    let n = hn.get(e);
    n || hn.set(e, n = /* @__PURE__ */ new Map());
    let o = n.get(r);
    o || n.set(r, o = Ea(() => n.delete(r))), za(
      Ct,
      o
    );
  }
}
function ot(e, t, r, n, o, a) {
  const s = hn.get(e);
  if (!s)
    return;
  let i = [];
  if (t === "clear")
    i = [...s.values()];
  else if (r === "length" && N(e)) {
    const l = Number(n);
    s.forEach((c, u) => {
      (u === "length" || !Xe(u) && u >= l) && i.push(c);
    });
  } else
    switch (r !== void 0 && i.push(s.get(r)), t) {
      case "add":
        N(e) ? Ln(r) && i.push(s.get("length")) : (i.push(s.get($t)), Nt(e) && i.push(s.get(mn)));
        break;
      case "delete":
        N(e) || (i.push(s.get($t)), Nt(e) && i.push(s.get(mn)));
        break;
      case "set":
        Nt(e) && i.push(s.get($t));
        break;
    }
  Rn();
  for (const l of i)
    l && La(
      l,
      4
    );
  Mn();
}
const pc = /* @__PURE__ */ jn("__proto__,__v_isRef,__isVue"), Na = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Xe)
), ko = /* @__PURE__ */ bc();
function bc() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...r) {
      const n = G(this);
      for (let a = 0, s = this.length; a < s; a++)
        $e(n, "get", a + "");
      const o = n[t](...r);
      return o === -1 || o === !1 ? n[t](...r.map(G)) : o;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...r) {
      vt(), Rn();
      const n = G(this)[t].apply(this, r);
      return Mn(), yt(), n;
    };
  }), e;
}
function gc(e) {
  Xe(e) || (e = String(e));
  const t = G(this);
  return $e(t, "has", e), t.hasOwnProperty(e);
}
class Ra {
  constructor(t = !1, r = !1) {
    this._isReadonly = t, this._isShallow = r;
  }
  get(t, r, n) {
    const o = this._isReadonly, a = this._isShallow;
    if (r === "__v_isReactive")
      return !o;
    if (r === "__v_isReadonly")
      return o;
    if (r === "__v_isShallow")
      return a;
    if (r === "__v_raw")
      return n === (o ? a ? Pc : Va : a ? Ba : Fa).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(n) ? t : void 0;
    const s = N(t);
    if (!o) {
      if (s && K(ko, r))
        return Reflect.get(ko, r, n);
      if (r === "hasOwnProperty")
        return gc;
    }
    const i = Reflect.get(t, r, n);
    return (Xe(r) ? Na.has(r) : pc(r)) || (o || $e(t, "get", r), a) ? i : Te(i) ? s && Ln(r) ? i : i.value : X(i) ? o ? Vn(i) : qr(i) : i;
  }
}
class Ma extends Ra {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, r, n, o) {
    let a = t[r];
    if (!this._isShallow) {
      const l = Tt(a);
      if (!Ft(n) && !Tt(n) && (a = G(a), n = G(n)), !N(t) && Te(a) && !Te(n))
        return l ? !1 : (a.value = n, !0);
    }
    const s = N(t) && Ln(r) ? Number(r) < t.length : K(t, r), i = Reflect.set(t, r, n, o);
    return t === G(o) && (s ? ht(n, a) && ot(t, "set", r, n) : ot(t, "add", r, n)), i;
  }
  deleteProperty(t, r) {
    const n = K(t, r);
    t[r];
    const o = Reflect.deleteProperty(t, r);
    return o && n && ot(t, "delete", r, void 0), o;
  }
  has(t, r) {
    const n = Reflect.has(t, r);
    return (!Xe(r) || !Na.has(r)) && $e(t, "has", r), n;
  }
  ownKeys(t) {
    return $e(
      t,
      "iterate",
      N(t) ? "length" : $t
    ), Reflect.ownKeys(t);
  }
}
class hc extends Ra {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, r) {
    return !0;
  }
  deleteProperty(t, r) {
    return !0;
  }
}
const mc = /* @__PURE__ */ new Ma(), vc = /* @__PURE__ */ new hc(), yc = /* @__PURE__ */ new Ma(
  !0
);
const Fn = (e) => e, Gr = (e) => Reflect.getPrototypeOf(e);
function xr(e, t, r = !1, n = !1) {
  e = e.__v_raw;
  const o = G(e), a = G(t);
  r || (ht(t, a) && $e(o, "get", t), $e(o, "get", a));
  const { has: s } = Gr(o), i = n ? Fn : r ? Hn : nr;
  if (s.call(o, t))
    return i(e.get(t));
  if (s.call(o, a))
    return i(e.get(a));
  e !== o && e.get(t);
}
function kr(e, t = !1) {
  const r = this.__v_raw, n = G(r), o = G(e);
  return t || (ht(e, o) && $e(n, "has", e), $e(n, "has", o)), e === o ? r.has(e) : r.has(e) || r.has(o);
}
function wr(e, t = !1) {
  return e = e.__v_raw, !t && $e(G(e), "iterate", $t), Reflect.get(e, "size", e);
}
function wo(e, t = !1) {
  !t && !Ft(e) && !Tt(e) && (e = G(e));
  const r = G(this);
  return Gr(r).has.call(r, e) || (r.add(e), ot(r, "add", e, e)), this;
}
function _o(e, t, r = !1) {
  !r && !Ft(t) && !Tt(t) && (t = G(t));
  const n = G(this), { has: o, get: a } = Gr(n);
  let s = o.call(n, e);
  s || (e = G(e), s = o.call(n, e));
  const i = a.call(n, e);
  return n.set(e, t), s ? ht(t, i) && ot(n, "set", e, t) : ot(n, "add", e, t), this;
}
function So(e) {
  const t = G(this), { has: r, get: n } = Gr(t);
  let o = r.call(t, e);
  o || (e = G(e), o = r.call(t, e)), n && n.call(t, e);
  const a = t.delete(e);
  return o && ot(t, "delete", e, void 0), a;
}
function Co() {
  const e = G(this), t = e.size !== 0, r = e.clear();
  return t && ot(e, "clear", void 0, void 0), r;
}
function _r(e, t) {
  return function(n, o) {
    const a = this, s = a.__v_raw, i = G(s), l = t ? Fn : e ? Hn : nr;
    return !e && $e(i, "iterate", $t), s.forEach((c, u) => n.call(o, l(c), l(u), a));
  };
}
function Sr(e, t, r) {
  return function(...n) {
    const o = this.__v_raw, a = G(o), s = Nt(a), i = e === "entries" || e === Symbol.iterator && s, l = e === "keys" && s, c = o[e](...n), u = r ? Fn : t ? Hn : nr;
    return !t && $e(
      a,
      "iterate",
      l ? mn : $t
    ), {
      // iterator protocol
      next() {
        const { value: p, done: b } = c.next();
        return b ? { value: p, done: b } : {
          value: i ? [u(p[0]), u(p[1])] : u(p),
          done: b
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function lt(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function xc() {
  const e = {
    get(a) {
      return xr(this, a);
    },
    get size() {
      return wr(this);
    },
    has: kr,
    add: wo,
    set: _o,
    delete: So,
    clear: Co,
    forEach: _r(!1, !1)
  }, t = {
    get(a) {
      return xr(this, a, !1, !0);
    },
    get size() {
      return wr(this);
    },
    has: kr,
    add(a) {
      return wo.call(this, a, !0);
    },
    set(a, s) {
      return _o.call(this, a, s, !0);
    },
    delete: So,
    clear: Co,
    forEach: _r(!1, !0)
  }, r = {
    get(a) {
      return xr(this, a, !0);
    },
    get size() {
      return wr(this, !0);
    },
    has(a) {
      return kr.call(this, a, !0);
    },
    add: lt("add"),
    set: lt("set"),
    delete: lt("delete"),
    clear: lt("clear"),
    forEach: _r(!0, !1)
  }, n = {
    get(a) {
      return xr(this, a, !0, !0);
    },
    get size() {
      return wr(this, !0);
    },
    has(a) {
      return kr.call(this, a, !0);
    },
    add: lt("add"),
    set: lt("set"),
    delete: lt("delete"),
    clear: lt("clear"),
    forEach: _r(!0, !0)
  };
  return [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((a) => {
    e[a] = Sr(a, !1, !1), r[a] = Sr(a, !0, !1), t[a] = Sr(a, !1, !0), n[a] = Sr(
      a,
      !0,
      !0
    );
  }), [
    e,
    r,
    t,
    n
  ];
}
const [
  kc,
  wc,
  _c,
  Sc
] = /* @__PURE__ */ xc();
function Bn(e, t) {
  const r = t ? e ? Sc : _c : e ? wc : kc;
  return (n, o, a) => o === "__v_isReactive" ? !e : o === "__v_isReadonly" ? e : o === "__v_raw" ? n : Reflect.get(
    K(r, o) && o in n ? r : n,
    o,
    a
  );
}
const Cc = {
  get: /* @__PURE__ */ Bn(!1, !1)
}, $c = {
  get: /* @__PURE__ */ Bn(!1, !0)
}, Tc = {
  get: /* @__PURE__ */ Bn(!0, !1)
};
const Fa = /* @__PURE__ */ new WeakMap(), Ba = /* @__PURE__ */ new WeakMap(), Va = /* @__PURE__ */ new WeakMap(), Pc = /* @__PURE__ */ new WeakMap();
function Oc(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Ac(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Oc(Zl(e));
}
function qr(e) {
  return Tt(e) ? e : Dn(
    e,
    !1,
    mc,
    Cc,
    Fa
  );
}
function jc(e) {
  return Dn(
    e,
    !1,
    yc,
    $c,
    Ba
  );
}
function Vn(e) {
  return Dn(
    e,
    !0,
    vc,
    Tc,
    Va
  );
}
function Dn(e, t, r, n, o) {
  if (!X(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const a = o.get(e);
  if (a)
    return a;
  const s = Ac(e);
  if (s === 0)
    return e;
  const i = new Proxy(
    e,
    s === 2 ? n : r
  );
  return o.set(e, i), i;
}
function Qt(e) {
  return Tt(e) ? Qt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Tt(e) {
  return !!(e && e.__v_isReadonly);
}
function Ft(e) {
  return !!(e && e.__v_isShallow);
}
function Da(e) {
  return e ? !!e.__v_raw : !1;
}
function G(e) {
  const t = e && e.__v_raw;
  return t ? G(t) : e;
}
function Ic(e) {
  return Object.isExtensible(e) && Ca(e, "__v_skip", !0), e;
}
const nr = (e) => X(e) ? qr(e) : e, Hn = (e) => X(e) ? Vn(e) : e;
class Ha {
  constructor(t, r, n, o) {
    this.getter = t, this._setter = r, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this.effect = new Nn(
      () => t(this._value),
      () => Ar(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    ), this.effect.computed = this, this.effect.active = this._cacheable = !o, this.__v_isReadonly = n;
  }
  get value() {
    const t = G(this);
    return (!t._cacheable || t.effect.dirty) && ht(t._value, t._value = t.effect.run()) && Ar(t, 4), Ua(t), t.effect._dirtyLevel >= 2 && Ar(t, 2), t._value;
  }
  set value(t) {
    this._setter(t);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(t) {
    this.effect.dirty = t;
  }
  // #endregion
}
function zc(e, t, r = !1) {
  let n, o;
  const a = M(e);
  return a ? (n = e, o = Ne) : (n = e.get, o = e.set), new Ha(n, o, a || !o, r);
}
function Ua(e) {
  var t;
  bt && Ct && (e = G(e), za(
    Ct,
    (t = e.dep) != null ? t : e.dep = Ea(
      () => e.dep = void 0,
      e instanceof Ha ? e : void 0
    )
  ));
}
function Ar(e, t = 4, r, n) {
  e = G(e);
  const o = e.dep;
  o && La(
    o,
    t
  );
}
function Te(e) {
  return !!(e && e.__v_isRef === !0);
}
function rt(e) {
  return Lc(e, !1);
}
function Lc(e, t) {
  return Te(e) ? e : new Ec(e, t);
}
class Ec {
  constructor(t, r) {
    this.__v_isShallow = r, this.dep = void 0, this.__v_isRef = !0, this._rawValue = r ? t : G(t), this._value = r ? t : nr(t);
  }
  get value() {
    return Ua(this), this._value;
  }
  set value(t) {
    const r = this.__v_isShallow || Ft(t) || Tt(t);
    t = r ? t : G(t), ht(t, this._rawValue) && (this._rawValue, this._rawValue = t, this._value = r ? t : nr(t), Ar(this, 4));
  }
}
function vn(e) {
  return Te(e) ? e.value : e;
}
const Nc = {
  get: (e, t, r) => vn(Reflect.get(e, t, r)),
  set: (e, t, r, n) => {
    const o = e[t];
    return Te(o) && !Te(r) ? (o.value = r, !0) : Reflect.set(e, t, r, n);
  }
};
function Ka(e) {
  return Qt(e) ? e : new Proxy(e, Nc);
}
/**
* @vue/runtime-core v3.4.37
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function gt(e, t, r, n) {
  try {
    return n ? e(...n) : e();
  } catch (o) {
    Yr(o, t, r);
  }
}
function Ue(e, t, r, n) {
  if (M(e)) {
    const o = gt(e, t, r, n);
    return o && wa(o) && o.catch((a) => {
      Yr(a, t, r);
    }), o;
  }
  if (N(e)) {
    const o = [];
    for (let a = 0; a < e.length; a++)
      o.push(Ue(e[a], t, r, n));
    return o;
  }
}
function Yr(e, t, r, n = !0) {
  const o = t ? t.vnode : null;
  if (t) {
    let a = t.parent;
    const s = t.proxy, i = `https://vuejs.org/error-reference/#runtime-${r}`;
    for (; a; ) {
      const c = a.ec;
      if (c) {
        for (let u = 0; u < c.length; u++)
          if (c[u](e, s, i) === !1)
            return;
      }
      a = a.parent;
    }
    const l = t.appContext.config.errorHandler;
    if (l) {
      vt(), gt(
        l,
        null,
        10,
        [e, s, i]
      ), yt();
      return;
    }
  }
  Rc(e, r, o, n);
}
function Rc(e, t, r, n = !0) {
  console.error(e);
}
let or = !1, yn = !1;
const ge = [];
let Qe = 0;
const Rt = [];
let ct = null, St = 0;
const Wa = /* @__PURE__ */ Promise.resolve();
let Un = null;
function Kn(e) {
  const t = Un || Wa;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Mc(e) {
  let t = Qe + 1, r = ge.length;
  for (; t < r; ) {
    const n = t + r >>> 1, o = ge[n], a = ar(o);
    a < e || a === e && o.pre ? t = n + 1 : r = n;
  }
  return t;
}
function Wn(e) {
  (!ge.length || !ge.includes(
    e,
    or && e.allowRecurse ? Qe + 1 : Qe
  )) && (e.id == null ? ge.push(e) : ge.splice(Mc(e.id), 0, e), Ga());
}
function Ga() {
  !or && !yn && (yn = !0, Un = Wa.then(Ya));
}
function Fc(e) {
  const t = ge.indexOf(e);
  t > Qe && ge.splice(t, 1);
}
function Bc(e) {
  N(e) ? Rt.push(...e) : (!ct || !ct.includes(
    e,
    e.allowRecurse ? St + 1 : St
  )) && Rt.push(e), Ga();
}
function $o(e, t, r = or ? Qe + 1 : 0) {
  for (; r < ge.length; r++) {
    const n = ge[r];
    if (n && n.pre) {
      if (e && n.id !== e.uid)
        continue;
      ge.splice(r, 1), r--, n();
    }
  }
}
function qa(e) {
  if (Rt.length) {
    const t = [...new Set(Rt)].sort(
      (r, n) => ar(r) - ar(n)
    );
    if (Rt.length = 0, ct) {
      ct.push(...t);
      return;
    }
    for (ct = t, St = 0; St < ct.length; St++) {
      const r = ct[St];
      r.active !== !1 && r();
    }
    ct = null, St = 0;
  }
}
const ar = (e) => e.id == null ? 1 / 0 : e.id, Vc = (e, t) => {
  const r = ar(e) - ar(t);
  if (r === 0) {
    if (e.pre && !t.pre) return -1;
    if (t.pre && !e.pre) return 1;
  }
  return r;
};
function Ya(e) {
  yn = !1, or = !0, ge.sort(Vc);
  try {
    for (Qe = 0; Qe < ge.length; Qe++) {
      const t = ge[Qe];
      t && t.active !== !1 && gt(
        t,
        t.i,
        t.i ? 15 : 14
      );
    }
  } finally {
    Qe = 0, ge.length = 0, qa(), or = !1, Un = null, (ge.length || Rt.length) && Ya();
  }
}
let de = null, Ja = null;
function Er(e) {
  const t = de;
  return de = e, Ja = e && e.type.__scopeId || null, t;
}
function Qa(e, t = de, r) {
  if (!t || e._n)
    return e;
  const n = (...o) => {
    n._d && Ro(-1);
    const a = Er(t);
    let s;
    try {
      s = e(...o);
    } finally {
      Er(a), n._d && Ro(1);
    }
    return s;
  };
  return n._n = !0, n._c = !0, n._d = !0, n;
}
function Za(e, t) {
  if (de === null)
    return e;
  const r = en(de), n = e.dirs || (e.dirs = []);
  for (let o = 0; o < t.length; o++) {
    let [a, s, i, l = te] = t[o];
    a && (M(a) && (a = {
      mounted: a,
      updated: a
    }), a.deep && dt(s), n.push({
      dir: a,
      instance: r,
      value: s,
      oldValue: void 0,
      arg: i,
      modifiers: l
    }));
  }
  return e;
}
function wt(e, t, r, n) {
  const o = e.dirs, a = t && t.dirs;
  for (let s = 0; s < o.length; s++) {
    const i = o[s];
    a && (i.oldValue = a[s].value);
    let l = i.dir[n];
    l && (vt(), Ue(l, r, 8, [
      e.el,
      i,
      e,
      t
    ]), yt());
  }
}
function Xa(e, t) {
  e.shapeFlag & 6 && e.component ? Xa(e.component.subTree, t) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Dc(e, t) {
  return M(e) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Ce({ name: e.name }, t, { setup: e })
  ) : e;
}
const Zt = (e) => !!e.type.__asyncLoader, es = (e) => e.type.__isKeepAlive;
function Hc(e, t) {
  ts(e, "a", t);
}
function Uc(e, t) {
  ts(e, "da", t);
}
function ts(e, t, r = pe) {
  const n = e.__wdc || (e.__wdc = () => {
    let o = r;
    for (; o; ) {
      if (o.isDeactivated)
        return;
      o = o.parent;
    }
    return e();
  });
  if (Jr(t, n, r), r) {
    let o = r.parent;
    for (; o && o.parent; )
      es(o.parent.vnode) && Kc(n, t, r, o), o = o.parent;
  }
}
function Kc(e, t, r, n) {
  const o = Jr(
    t,
    e,
    n,
    !0
    /* prepend */
  );
  rs(() => {
    zn(n[t], o);
  }, r);
}
function Jr(e, t, r = pe, n = !1) {
  if (r) {
    const o = r[e] || (r[e] = []), a = t.__weh || (t.__weh = (...s) => {
      vt();
      const i = hr(r), l = Ue(t, r, e, s);
      return i(), yt(), l;
    });
    return n ? o.unshift(a) : o.push(a), a;
  }
}
const at = (e) => (t, r = pe) => {
  (!Xr || e === "sp") && Jr(e, (...n) => t(...n), r);
}, Wc = at("bm"), Gn = at("m"), Gc = at("bu"), qc = at("u"), Yc = at("bum"), rs = at("um"), Jc = at("sp"), Qc = at(
  "rtg"
), Zc = at(
  "rtc"
);
function Xc(e, t = pe) {
  Jr("ec", e, t);
}
const qn = "components", eu = "directives";
function To(e, t) {
  return Yn(qn, e, !0, t) || e;
}
const ns = Symbol.for("v-ndc");
function tu(e) {
  return ae(e) ? Yn(qn, e, !1) || e : e || ns;
}
function ru(e) {
  return Yn(eu, e);
}
function Yn(e, t, r = !0, n = !1) {
  const o = de || pe;
  if (o) {
    const a = o.type;
    if (e === qn) {
      const i = Wu(
        a,
        !1
      );
      if (i && (i === t || i === Ke(t) || i === Kr(Ke(t))))
        return a;
    }
    const s = (
      // local registration
      // check instance[type] first which is resolved for options API
      Po(o[e] || a[e], t) || // global registration
      Po(o.appContext[e], t)
    );
    return !s && n ? a : s;
  }
}
function Po(e, t) {
  return e && (e[t] || e[Ke(t)] || e[Kr(Ke(t))]);
}
function Cr(e, t, r, n) {
  let o;
  const a = r;
  if (N(e) || ae(e)) {
    o = new Array(e.length);
    for (let s = 0, i = e.length; s < i; s++)
      o[s] = t(e[s], s, void 0, a);
  } else if (typeof e == "number") {
    o = new Array(e);
    for (let s = 0; s < e; s++)
      o[s] = t(s + 1, s, void 0, a);
  } else if (X(e))
    if (e[Symbol.iterator])
      o = Array.from(
        e,
        (s, i) => t(s, i, void 0, a)
      );
    else {
      const s = Object.keys(e);
      o = new Array(s.length);
      for (let i = 0, l = s.length; i < l; i++) {
        const c = s[i];
        o[i] = t(e[c], c, i, a);
      }
    }
  else
    o = [];
  return o;
}
function Ut(e, t, r = {}, n, o) {
  if (de.isCE || de.parent && Zt(de.parent) && de.parent.isCE)
    return t !== "default" && (r.name = t), Re("slot", r, n && n());
  let a = e[t];
  a && a._c && (a._d = !1), J();
  const s = a && os(a(r)), i = rr(
    fe,
    {
      key: (r.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      s && s.key || `_${t}`) + // #7256 force differentiate fallback content from actual content
      (!s && n ? "_fb" : "")
    },
    s || (n ? n() : []),
    s && e._ === 1 ? 64 : -2
  );
  return i.scopeId && (i.slotScopeIds = [i.scopeId + "-s"]), a && a._c && (a._d = !0), i;
}
function os(e) {
  return e.some((t) => _s(t) ? !(t.type === mt || t.type === fe && !os(t.children)) : !0) ? e : null;
}
const xn = (e) => e ? Cs(e) ? en(e) : xn(e.parent) : null, Xt = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Ce(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => xn(e.parent),
    $root: (e) => xn(e.root),
    $emit: (e) => e.emit,
    $options: (e) => ss(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      e.effect.dirty = !0, Wn(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Kn.bind(e.proxy)),
    $watch: (e) => $u.bind(e)
  })
), an = (e, t) => e !== te && !e.__isScriptSetup && K(e, t), nu = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: r, setupState: n, data: o, props: a, accessCache: s, type: i, appContext: l } = e;
    let c;
    if (t[0] !== "$") {
      const h = s[t];
      if (h !== void 0)
        switch (h) {
          case 1:
            return n[t];
          case 2:
            return o[t];
          case 4:
            return r[t];
          case 3:
            return a[t];
        }
      else {
        if (an(n, t))
          return s[t] = 1, n[t];
        if (o !== te && K(o, t))
          return s[t] = 2, o[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (c = e.propsOptions[0]) && K(c, t)
        )
          return s[t] = 3, a[t];
        if (r !== te && K(r, t))
          return s[t] = 4, r[t];
        kn && (s[t] = 0);
      }
    }
    const u = Xt[t];
    let p, b;
    if (u)
      return t === "$attrs" && $e(e.attrs, "get", ""), u(e);
    if (
      // css module (injected by vue-loader)
      (p = i.__cssModules) && (p = p[t])
    )
      return p;
    if (r !== te && K(r, t))
      return s[t] = 4, r[t];
    if (
      // global properties
      b = l.config.globalProperties, K(b, t)
    )
      return b[t];
  },
  set({ _: e }, t, r) {
    const { data: n, setupState: o, ctx: a } = e;
    return an(o, t) ? (o[t] = r, !0) : n !== te && K(n, t) ? (n[t] = r, !0) : K(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = r, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: r, ctx: n, appContext: o, propsOptions: a }
  }, s) {
    let i;
    return !!r[s] || e !== te && K(e, s) || an(t, s) || (i = a[0]) && K(i, s) || K(n, s) || K(Xt, s) || K(o.config.globalProperties, s);
  },
  defineProperty(e, t, r) {
    return r.get != null ? e._.accessCache[t] = 0 : K(r, "value") && this.set(e, t, r.value, null), Reflect.defineProperty(e, t, r);
  }
};
function Oo(e) {
  return N(e) ? e.reduce(
    (t, r) => (t[r] = null, t),
    {}
  ) : e;
}
let kn = !0;
function ou(e) {
  const t = ss(e), r = e.proxy, n = e.ctx;
  kn = !1, t.beforeCreate && Ao(t.beforeCreate, e, "bc");
  const {
    // state
    data: o,
    computed: a,
    methods: s,
    watch: i,
    provide: l,
    inject: c,
    // lifecycle
    created: u,
    beforeMount: p,
    mounted: b,
    beforeUpdate: h,
    updated: S,
    activated: x,
    deactivated: T,
    beforeDestroy: v,
    beforeUnmount: O,
    destroyed: m,
    unmounted: A,
    render: D,
    renderTracked: E,
    renderTriggered: ie,
    errorCaptured: se,
    serverPrefetch: je,
    // public API
    expose: he,
    inheritAttrs: ye,
    // assets
    components: Ie,
    directives: ze,
    filters: Le
  } = t;
  if (c && au(c, n, null), s)
    for (const W in s) {
      const H = s[W];
      M(H) && (n[W] = H.bind(r));
    }
  if (o) {
    const W = o.call(r, r);
    X(W) && (e.data = qr(W));
  }
  if (kn = !0, a)
    for (const W in a) {
      const H = a[W], xe = M(H) ? H.bind(r, r) : M(H.get) ? H.get.bind(r, r) : Ne, ke = !M(H) && M(H.set) ? H.set.bind(r) : Ne, le = Wt({
        get: xe,
        set: ke
      });
      Object.defineProperty(n, W, {
        enumerable: !0,
        configurable: !0,
        get: () => le.value,
        set: (ce) => le.value = ce
      });
    }
  if (i)
    for (const W in i)
      as(i[W], n, r, W);
  if (l) {
    const W = M(l) ? l.call(r) : l;
    Reflect.ownKeys(W).forEach((H) => {
      du(H, W[H]);
    });
  }
  u && Ao(u, e, "c");
  function ne(W, H) {
    N(H) ? H.forEach((xe) => W(xe.bind(r))) : H && W(H.bind(r));
  }
  if (ne(Wc, p), ne(Gn, b), ne(Gc, h), ne(qc, S), ne(Hc, x), ne(Uc, T), ne(Xc, se), ne(Zc, E), ne(Qc, ie), ne(Yc, O), ne(rs, A), ne(Jc, je), N(he))
    if (he.length) {
      const W = e.exposed || (e.exposed = {});
      he.forEach((H) => {
        Object.defineProperty(W, H, {
          get: () => r[H],
          set: (xe) => r[H] = xe
        });
      });
    } else e.exposed || (e.exposed = {});
  D && e.render === Ne && (e.render = D), ye != null && (e.inheritAttrs = ye), Ie && (e.components = Ie), ze && (e.directives = ze);
}
function au(e, t, r = Ne) {
  N(e) && (e = wn(e));
  for (const n in e) {
    const o = e[n];
    let a;
    X(o) ? "default" in o ? a = er(
      o.from || n,
      o.default,
      !0
    ) : a = er(o.from || n) : a = er(o), Te(a) ? Object.defineProperty(t, n, {
      enumerable: !0,
      configurable: !0,
      get: () => a.value,
      set: (s) => a.value = s
    }) : t[n] = a;
  }
}
function Ao(e, t, r) {
  Ue(
    N(e) ? e.map((n) => n.bind(t.proxy)) : e.bind(t.proxy),
    t,
    r
  );
}
function as(e, t, r, n) {
  const o = n.includes(".") ? xs(r, n) : () => r[n];
  if (ae(e)) {
    const a = t[e];
    M(a) && pt(o, a);
  } else if (M(e))
    pt(o, e.bind(r));
  else if (X(e))
    if (N(e))
      e.forEach((a) => as(a, t, r, n));
    else {
      const a = M(e.handler) ? e.handler.bind(r) : t[e.handler];
      M(a) && pt(o, a, e);
    }
}
function ss(e) {
  const t = e.type, { mixins: r, extends: n } = t, {
    mixins: o,
    optionsCache: a,
    config: { optionMergeStrategies: s }
  } = e.appContext, i = a.get(t);
  let l;
  return i ? l = i : !o.length && !r && !n ? l = t : (l = {}, o.length && o.forEach(
    (c) => Nr(l, c, s, !0)
  ), Nr(l, t, s)), X(t) && a.set(t, l), l;
}
function Nr(e, t, r, n = !1) {
  const { mixins: o, extends: a } = t;
  a && Nr(e, a, r, !0), o && o.forEach(
    (s) => Nr(e, s, r, !0)
  );
  for (const s in t)
    if (!(n && s === "expose")) {
      const i = su[s] || r && r[s];
      e[s] = i ? i(e[s], t[s]) : t[s];
    }
  return e;
}
const su = {
  data: jo,
  props: Io,
  emits: Io,
  // objects
  methods: Kt,
  computed: Kt,
  // lifecycle
  beforeCreate: ve,
  created: ve,
  beforeMount: ve,
  mounted: ve,
  beforeUpdate: ve,
  updated: ve,
  beforeDestroy: ve,
  beforeUnmount: ve,
  destroyed: ve,
  unmounted: ve,
  activated: ve,
  deactivated: ve,
  errorCaptured: ve,
  serverPrefetch: ve,
  // assets
  components: Kt,
  directives: Kt,
  // watch
  watch: lu,
  // provide / inject
  provide: jo,
  inject: iu
};
function jo(e, t) {
  return t ? e ? function() {
    return Ce(
      M(e) ? e.call(this, this) : e,
      M(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function iu(e, t) {
  return Kt(wn(e), wn(t));
}
function wn(e) {
  if (N(e)) {
    const t = {};
    for (let r = 0; r < e.length; r++)
      t[e[r]] = e[r];
    return t;
  }
  return e;
}
function ve(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Kt(e, t) {
  return e ? Ce(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Io(e, t) {
  return e ? N(e) && N(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Ce(
    /* @__PURE__ */ Object.create(null),
    Oo(e),
    Oo(t ?? {})
  ) : t;
}
function lu(e, t) {
  if (!e) return t;
  if (!t) return e;
  const r = Ce(/* @__PURE__ */ Object.create(null), e);
  for (const n in t)
    r[n] = ve(e[n], t[n]);
  return r;
}
function is() {
  return {
    app: null,
    config: {
      isNativeTag: Jl,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let cu = 0;
function uu(e, t) {
  return function(n, o = null) {
    M(n) || (n = Ce({}, n)), o != null && !X(o) && (o = null);
    const a = is(), s = /* @__PURE__ */ new WeakSet();
    let i = !1;
    const l = a.app = {
      _uid: cu++,
      _component: n,
      _props: o,
      _container: null,
      _context: a,
      _instance: null,
      version: qu,
      get config() {
        return a.config;
      },
      set config(c) {
      },
      use(c, ...u) {
        return s.has(c) || (c && M(c.install) ? (s.add(c), c.install(l, ...u)) : M(c) && (s.add(c), c(l, ...u))), l;
      },
      mixin(c) {
        return a.mixins.includes(c) || a.mixins.push(c), l;
      },
      component(c, u) {
        return u ? (a.components[c] = u, l) : a.components[c];
      },
      directive(c, u) {
        return u ? (a.directives[c] = u, l) : a.directives[c];
      },
      mount(c, u, p) {
        if (!i) {
          const b = Re(n, o);
          return b.appContext = a, p === !0 ? p = "svg" : p === !1 && (p = void 0), e(b, c, p), i = !0, l._container = c, c.__vue_app__ = l, en(b.component);
        }
      },
      unmount() {
        i && (e(null, l._container), delete l._container.__vue_app__);
      },
      provide(c, u) {
        return a.provides[c] = u, l;
      },
      runWithContext(c) {
        const u = Mt;
        Mt = l;
        try {
          return c();
        } finally {
          Mt = u;
        }
      }
    };
    return l;
  };
}
let Mt = null;
function du(e, t) {
  if (pe) {
    let r = pe.provides;
    const n = pe.parent && pe.parent.provides;
    n === r && (r = pe.provides = Object.create(n)), r[e] = t;
  }
}
function er(e, t, r = !1) {
  const n = pe || de;
  if (n || Mt) {
    const o = Mt ? Mt._context.provides : n ? n.parent == null ? n.vnode.appContext && n.vnode.appContext.provides : n.parent.provides : void 0;
    if (o && e in o)
      return o[e];
    if (arguments.length > 1)
      return r && M(t) ? t.call(n && n.proxy) : t;
  }
}
const ls = {}, cs = () => Object.create(ls), us = (e) => Object.getPrototypeOf(e) === ls;
function fu(e, t, r, n = !1) {
  const o = {}, a = cs();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), ds(e, t, o, a);
  for (const s in e.propsOptions[0])
    s in o || (o[s] = void 0);
  r ? e.props = n ? o : jc(o) : e.type.props ? e.props = o : e.props = a, e.attrs = a;
}
function pu(e, t, r, n) {
  const {
    props: o,
    attrs: a,
    vnode: { patchFlag: s }
  } = e, i = G(o), [l] = e.propsOptions;
  let c = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (n || s > 0) && !(s & 16)
  ) {
    if (s & 8) {
      const u = e.vnode.dynamicProps;
      for (let p = 0; p < u.length; p++) {
        let b = u[p];
        if (Qr(e.emitsOptions, b))
          continue;
        const h = t[b];
        if (l)
          if (K(a, b))
            h !== a[b] && (a[b] = h, c = !0);
          else {
            const S = Ke(b);
            o[S] = _n(
              l,
              i,
              S,
              h,
              e,
              !1
            );
          }
        else
          h !== a[b] && (a[b] = h, c = !0);
      }
    }
  } else {
    ds(e, t, o, a) && (c = !0);
    let u;
    for (const p in i)
      (!t || // for camelCase
      !K(t, p) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = Ot(p)) === p || !K(t, u))) && (l ? r && // for camelCase
      (r[p] !== void 0 || // for kebab-case
      r[u] !== void 0) && (o[p] = _n(
        l,
        i,
        p,
        void 0,
        e,
        !0
      )) : delete o[p]);
    if (a !== i)
      for (const p in a)
        (!t || !K(t, p)) && (delete a[p], c = !0);
  }
  c && ot(e.attrs, "set", "");
}
function ds(e, t, r, n) {
  const [o, a] = e.propsOptions;
  let s = !1, i;
  if (t)
    for (let l in t) {
      if (Jt(l))
        continue;
      const c = t[l];
      let u;
      o && K(o, u = Ke(l)) ? !a || !a.includes(u) ? r[u] = c : (i || (i = {}))[u] = c : Qr(e.emitsOptions, l) || (!(l in n) || c !== n[l]) && (n[l] = c, s = !0);
    }
  if (a) {
    const l = G(r), c = i || te;
    for (let u = 0; u < a.length; u++) {
      const p = a[u];
      r[p] = _n(
        o,
        l,
        p,
        c[p],
        e,
        !K(c, p)
      );
    }
  }
  return s;
}
function _n(e, t, r, n, o, a) {
  const s = e[r];
  if (s != null) {
    const i = K(s, "default");
    if (i && n === void 0) {
      const l = s.default;
      if (s.type !== Function && !s.skipFactory && M(l)) {
        const { propsDefaults: c } = o;
        if (r in c)
          n = c[r];
        else {
          const u = hr(o);
          n = c[r] = l.call(
            null,
            t
          ), u();
        }
      } else
        n = l;
    }
    s[
      0
      /* shouldCast */
    ] && (a && !i ? n = !1 : s[
      1
      /* shouldCastTrue */
    ] && (n === "" || n === Ot(r)) && (n = !0));
  }
  return n;
}
const bu = /* @__PURE__ */ new WeakMap();
function fs(e, t, r = !1) {
  const n = r ? bu : t.propsCache, o = n.get(e);
  if (o)
    return o;
  const a = e.props, s = {}, i = [];
  let l = !1;
  if (!M(e)) {
    const u = (p) => {
      l = !0;
      const [b, h] = fs(p, t, !0);
      Ce(s, b), h && i.push(...h);
    };
    !r && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!a && !l)
    return X(e) && n.set(e, Et), Et;
  if (N(a))
    for (let u = 0; u < a.length; u++) {
      const p = Ke(a[u]);
      zo(p) && (s[p] = te);
    }
  else if (a)
    for (const u in a) {
      const p = Ke(u);
      if (zo(p)) {
        const b = a[u], h = s[p] = N(b) || M(b) ? { type: b } : Ce({}, b), S = h.type;
        let x = !1, T = !0;
        if (N(S))
          for (let v = 0; v < S.length; ++v) {
            const O = S[v], m = M(O) && O.name;
            if (m === "Boolean") {
              x = !0;
              break;
            } else m === "String" && (T = !1);
          }
        else
          x = M(S) && S.name === "Boolean";
        h[
          0
          /* shouldCast */
        ] = x, h[
          1
          /* shouldCastTrue */
        ] = T, (x || K(h, "default")) && i.push(p);
      }
    }
  const c = [s, i];
  return X(e) && n.set(e, c), c;
}
function zo(e) {
  return e[0] !== "$" && !Jt(e);
}
const ps = (e) => e[0] === "_" || e === "$stable", Jn = (e) => N(e) ? e.map(Je) : [Je(e)], gu = (e, t, r) => {
  if (t._n)
    return t;
  const n = Qa((...o) => Jn(t(...o)), r);
  return n._c = !1, n;
}, bs = (e, t, r) => {
  const n = e._ctx;
  for (const o in e) {
    if (ps(o)) continue;
    const a = e[o];
    if (M(a))
      t[o] = gu(o, a, n);
    else if (a != null) {
      const s = Jn(a);
      t[o] = () => s;
    }
  }
}, gs = (e, t) => {
  const r = Jn(t);
  e.slots.default = () => r;
}, hs = (e, t, r) => {
  for (const n in t)
    (r || n !== "_") && (e[n] = t[n]);
}, hu = (e, t, r) => {
  const n = e.slots = cs();
  if (e.vnode.shapeFlag & 32) {
    const o = t._;
    o ? (hs(n, t, r), r && Ca(n, "_", o, !0)) : bs(t, n);
  } else t && gs(e, t);
}, mu = (e, t, r) => {
  const { vnode: n, slots: o } = e;
  let a = !0, s = te;
  if (n.shapeFlag & 32) {
    const i = t._;
    i ? r && i === 1 ? a = !1 : hs(o, t, r) : (a = !t.$stable, bs(t, o)), s = t;
  } else t && (gs(e, t), s = { default: 1 });
  if (a)
    for (const i in o)
      !ps(i) && s[i] == null && delete o[i];
};
function Sn(e, t, r, n, o = !1) {
  if (N(e)) {
    e.forEach(
      (b, h) => Sn(
        b,
        t && (N(t) ? t[h] : t),
        r,
        n,
        o
      )
    );
    return;
  }
  if (Zt(n) && !o)
    return;
  const a = n.shapeFlag & 4 ? en(n.component) : n.el, s = o ? null : a, { i, r: l } = e, c = t && t.r, u = i.refs === te ? i.refs = {} : i.refs, p = i.setupState;
  if (c != null && c !== l && (ae(c) ? (u[c] = null, K(p, c) && (p[c] = null)) : Te(c) && (c.value = null)), M(l))
    gt(l, i, 12, [s, u]);
  else {
    const b = ae(l), h = Te(l);
    if (b || h) {
      const S = () => {
        if (e.f) {
          const x = b ? K(p, l) ? p[l] : u[l] : l.value;
          o ? N(x) && zn(x, a) : N(x) ? x.includes(a) || x.push(a) : b ? (u[l] = [a], K(p, l) && (p[l] = u[l])) : (l.value = [a], e.k && (u[e.k] = l.value));
        } else b ? (u[l] = s, K(p, l) && (p[l] = s)) : h && (l.value = s, e.k && (u[e.k] = s));
      };
      s ? (S.id = -1, we(S, r)) : S();
    }
  }
}
const vu = Symbol("_vte"), yu = (e) => e.__isTeleport, we = Lu;
function xu(e) {
  return ku(e);
}
function ku(e, t) {
  const r = Ta();
  r.__VUE__ = !0;
  const {
    insert: n,
    remove: o,
    patchProp: a,
    createElement: s,
    createText: i,
    createComment: l,
    setText: c,
    setElementText: u,
    parentNode: p,
    nextSibling: b,
    setScopeId: h = Ne,
    insertStaticContent: S
  } = e, x = (d, f, g, w = null, y = null, _ = null, P = void 0, C = null, $ = !!f.dynamicChildren) => {
    if (d === f)
      return;
    d && !Ht(d, f) && (w = At(d), ce(d, y, _, !0), d = null), f.patchFlag === -2 && ($ = !1, f.dynamicChildren = null);
    const { type: k, ref: j, shapeFlag: z } = f;
    switch (k) {
      case Zr:
        T(d, f, g, w);
        break;
      case mt:
        v(d, f, g, w);
        break;
      case ln:
        d == null && O(f, g, w, P);
        break;
      case fe:
        Ie(
          d,
          f,
          g,
          w,
          y,
          _,
          P,
          C,
          $
        );
        break;
      default:
        z & 1 ? D(
          d,
          f,
          g,
          w,
          y,
          _,
          P,
          C,
          $
        ) : z & 6 ? ze(
          d,
          f,
          g,
          w,
          y,
          _,
          P,
          C,
          $
        ) : (z & 64 || z & 128) && k.process(
          d,
          f,
          g,
          w,
          y,
          _,
          P,
          C,
          $,
          kt
        );
    }
    j != null && y && Sn(j, d && d.ref, _, f || d, !f);
  }, T = (d, f, g, w) => {
    if (d == null)
      n(
        f.el = i(f.children),
        g,
        w
      );
    else {
      const y = f.el = d.el;
      f.children !== d.children && c(y, f.children);
    }
  }, v = (d, f, g, w) => {
    d == null ? n(
      f.el = l(f.children || ""),
      g,
      w
    ) : f.el = d.el;
  }, O = (d, f, g, w) => {
    [d.el, d.anchor] = S(
      d.children,
      f,
      g,
      w,
      d.el,
      d.anchor
    );
  }, m = ({ el: d, anchor: f }, g, w) => {
    let y;
    for (; d && d !== f; )
      y = b(d), n(d, g, w), d = y;
    n(f, g, w);
  }, A = ({ el: d, anchor: f }) => {
    let g;
    for (; d && d !== f; )
      g = b(d), o(d), d = g;
    o(f);
  }, D = (d, f, g, w, y, _, P, C, $) => {
    f.type === "svg" ? P = "svg" : f.type === "math" && (P = "mathml"), d == null ? E(
      f,
      g,
      w,
      y,
      _,
      P,
      C,
      $
    ) : je(
      d,
      f,
      y,
      _,
      P,
      C,
      $
    );
  }, E = (d, f, g, w, y, _, P, C) => {
    let $, k;
    const { props: j, shapeFlag: z, transition: I, dirs: R } = d;
    if ($ = d.el = s(
      d.type,
      _,
      j && j.is,
      j
    ), z & 8 ? u($, d.children) : z & 16 && se(
      d.children,
      $,
      null,
      w,
      y,
      sn(d, _),
      P,
      C
    ), R && wt(d, null, w, "created"), ie($, d, d.scopeId, P, w), j) {
      for (const Q in j)
        Q !== "value" && !Jt(Q) && a($, Q, null, j[Q], _, w);
      "value" in j && a($, "value", null, j.value, _), (k = j.onVnodeBeforeMount) && qe(k, w, d);
    }
    R && wt(d, null, w, "beforeMount");
    const B = wu(y, I);
    B && I.beforeEnter($), n($, f, g), ((k = j && j.onVnodeMounted) || B || R) && we(() => {
      k && qe(k, w, d), B && I.enter($), R && wt(d, null, w, "mounted");
    }, y);
  }, ie = (d, f, g, w, y) => {
    if (g && h(d, g), w)
      for (let _ = 0; _ < w.length; _++)
        h(d, w[_]);
    if (y) {
      let _ = y.subTree;
      if (f === _) {
        const P = y.vnode;
        ie(
          d,
          P,
          P.scopeId,
          P.slotScopeIds,
          y.parent
        );
      }
    }
  }, se = (d, f, g, w, y, _, P, C, $ = 0) => {
    for (let k = $; k < d.length; k++) {
      const j = d[k] = C ? ut(d[k]) : Je(d[k]);
      x(
        null,
        j,
        f,
        g,
        w,
        y,
        _,
        P,
        C
      );
    }
  }, je = (d, f, g, w, y, _, P) => {
    const C = f.el = d.el;
    let { patchFlag: $, dynamicChildren: k, dirs: j } = f;
    $ |= d.patchFlag & 16;
    const z = d.props || te, I = f.props || te;
    let R;
    if (g && _t(g, !1), (R = I.onVnodeBeforeUpdate) && qe(R, g, f, d), j && wt(f, d, g, "beforeUpdate"), g && _t(g, !0), (z.innerHTML && I.innerHTML == null || z.textContent && I.textContent == null) && u(C, ""), k ? he(
      d.dynamicChildren,
      k,
      C,
      g,
      w,
      sn(f, y),
      _
    ) : P || H(
      d,
      f,
      C,
      null,
      g,
      w,
      sn(f, y),
      _,
      !1
    ), $ > 0) {
      if ($ & 16)
        ye(C, z, I, g, y);
      else if ($ & 2 && z.class !== I.class && a(C, "class", null, I.class, y), $ & 4 && a(C, "style", z.style, I.style, y), $ & 8) {
        const B = f.dynamicProps;
        for (let Q = 0; Q < B.length; Q++) {
          const q = B[Q], me = z[q], Me = I[q];
          (Me !== me || q === "value") && a(C, q, me, Me, y, g);
        }
      }
      $ & 1 && d.children !== f.children && u(C, f.children);
    } else !P && k == null && ye(C, z, I, g, y);
    ((R = I.onVnodeUpdated) || j) && we(() => {
      R && qe(R, g, f, d), j && wt(f, d, g, "updated");
    }, w);
  }, he = (d, f, g, w, y, _, P) => {
    for (let C = 0; C < f.length; C++) {
      const $ = d[C], k = f[C], j = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        $.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        ($.type === fe || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Ht($, k) || // - In the case of a component, it could contain anything.
        $.shapeFlag & 70) ? p($.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          g
        )
      );
      x(
        $,
        k,
        j,
        null,
        w,
        y,
        _,
        P,
        !0
      );
    }
  }, ye = (d, f, g, w, y) => {
    if (f !== g) {
      if (f !== te)
        for (const _ in f)
          !Jt(_) && !(_ in g) && a(
            d,
            _,
            f[_],
            null,
            y,
            w
          );
      for (const _ in g) {
        if (Jt(_)) continue;
        const P = g[_], C = f[_];
        P !== C && _ !== "value" && a(d, _, C, P, y, w);
      }
      "value" in g && a(d, "value", f.value, g.value, y);
    }
  }, Ie = (d, f, g, w, y, _, P, C, $) => {
    const k = f.el = d ? d.el : i(""), j = f.anchor = d ? d.anchor : i("");
    let { patchFlag: z, dynamicChildren: I, slotScopeIds: R } = f;
    R && (C = C ? C.concat(R) : R), d == null ? (n(k, g, w), n(j, g, w), se(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      f.children || [],
      g,
      j,
      y,
      _,
      P,
      C,
      $
    )) : z > 0 && z & 64 && I && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    d.dynamicChildren ? (he(
      d.dynamicChildren,
      I,
      g,
      y,
      _,
      P,
      C
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (f.key != null || y && f === y.subTree) && ms(
      d,
      f,
      !0
      /* shallow */
    )) : H(
      d,
      f,
      g,
      j,
      y,
      _,
      P,
      C,
      $
    );
  }, ze = (d, f, g, w, y, _, P, C, $) => {
    f.slotScopeIds = C, d == null ? f.shapeFlag & 512 ? y.ctx.activate(
      f,
      g,
      w,
      P,
      $
    ) : Le(
      f,
      g,
      w,
      y,
      _,
      P,
      $
    ) : We(d, f, $);
  }, Le = (d, f, g, w, y, _, P) => {
    const C = d.component = Bu(
      d,
      w,
      y
    );
    if (es(d) && (C.ctx.renderer = kt), Du(C, !1, P), C.asyncDep) {
      if (y && y.registerDep(C, ne, P), !d.el) {
        const $ = C.subTree = Re(mt);
        v(null, $, f, g);
      }
    } else
      ne(
        C,
        d,
        f,
        g,
        y,
        _,
        P
      );
  }, We = (d, f, g) => {
    const w = f.component = d.component;
    if (ju(d, f, g))
      if (w.asyncDep && !w.asyncResolved) {
        W(w, f, g);
        return;
      } else
        w.next = f, Fc(w.update), w.effect.dirty = !0, w.update();
    else
      f.el = d.el, w.vnode = f;
  }, ne = (d, f, g, w, y, _, P) => {
    const C = () => {
      if (d.isMounted) {
        let { next: j, bu: z, u: I, parent: R, vnode: B } = d;
        {
          const jt = vs(d);
          if (jt) {
            j && (j.el = B.el, W(d, j, P)), jt.asyncDep.then(() => {
              d.isUnmounted || C();
            });
            return;
          }
        }
        let Q = j, q;
        _t(d, !1), j ? (j.el = B.el, W(d, j, P)) : j = B, z && Or(z), (q = j.props && j.props.onVnodeBeforeUpdate) && qe(q, R, j, B), _t(d, !0);
        const me = Eo(d), Me = d.subTree;
        d.subTree = me, x(
          Me,
          me,
          // parent may have changed if it's in a teleport
          p(Me.el),
          // anchor may have changed if it's in a fragment
          At(Me),
          d,
          y,
          _
        ), j.el = me.el, Q === null && Iu(d, me.el), I && we(I, y), (q = j.props && j.props.onVnodeUpdated) && we(
          () => qe(q, R, j, B),
          y
        );
      } else {
        let j;
        const { el: z, props: I } = f, { bm: R, m: B, parent: Q } = d, q = Zt(f);
        _t(d, !1), R && Or(R), !q && (j = I && I.onVnodeBeforeMount) && qe(j, Q, f), _t(d, !0);
        {
          const me = d.subTree = Eo(d);
          x(
            null,
            me,
            g,
            w,
            d,
            y,
            _
          ), f.el = me.el;
        }
        if (B && we(B, y), !q && (j = I && I.onVnodeMounted)) {
          const me = f;
          we(
            () => qe(j, Q, me),
            y
          );
        }
        (f.shapeFlag & 256 || Q && Zt(Q.vnode) && Q.vnode.shapeFlag & 256) && d.a && we(d.a, y), d.isMounted = !0, f = g = w = null;
      }
    }, $ = d.effect = new Nn(
      C,
      Ne,
      () => Wn(k),
      d.scope
      // track it in component's effect scope
    ), k = d.update = () => {
      $.dirty && $.run();
    };
    k.i = d, k.id = d.uid, _t(d, !0), k();
  }, W = (d, f, g) => {
    f.component = d;
    const w = d.vnode.props;
    d.vnode = f, d.next = null, pu(d, f.props, w, g), mu(d, f.children, g), vt(), $o(d), yt();
  }, H = (d, f, g, w, y, _, P, C, $ = !1) => {
    const k = d && d.children, j = d ? d.shapeFlag : 0, z = f.children, { patchFlag: I, shapeFlag: R } = f;
    if (I > 0) {
      if (I & 128) {
        ke(
          k,
          z,
          g,
          w,
          y,
          _,
          P,
          C,
          $
        );
        return;
      } else if (I & 256) {
        xe(
          k,
          z,
          g,
          w,
          y,
          _,
          P,
          C,
          $
        );
        return;
      }
    }
    R & 8 ? (j & 16 && it(k, y, _), z !== k && u(g, z)) : j & 16 ? R & 16 ? ke(
      k,
      z,
      g,
      w,
      y,
      _,
      P,
      C,
      $
    ) : it(k, y, _, !0) : (j & 8 && u(g, ""), R & 16 && se(
      z,
      g,
      w,
      y,
      _,
      P,
      C,
      $
    ));
  }, xe = (d, f, g, w, y, _, P, C, $) => {
    d = d || Et, f = f || Et;
    const k = d.length, j = f.length, z = Math.min(k, j);
    let I;
    for (I = 0; I < z; I++) {
      const R = f[I] = $ ? ut(f[I]) : Je(f[I]);
      x(
        d[I],
        R,
        g,
        null,
        y,
        _,
        P,
        C,
        $
      );
    }
    k > j ? it(
      d,
      y,
      _,
      !0,
      !1,
      z
    ) : se(
      f,
      g,
      w,
      y,
      _,
      P,
      C,
      $,
      z
    );
  }, ke = (d, f, g, w, y, _, P, C, $) => {
    let k = 0;
    const j = f.length;
    let z = d.length - 1, I = j - 1;
    for (; k <= z && k <= I; ) {
      const R = d[k], B = f[k] = $ ? ut(f[k]) : Je(f[k]);
      if (Ht(R, B))
        x(
          R,
          B,
          g,
          null,
          y,
          _,
          P,
          C,
          $
        );
      else
        break;
      k++;
    }
    for (; k <= z && k <= I; ) {
      const R = d[z], B = f[I] = $ ? ut(f[I]) : Je(f[I]);
      if (Ht(R, B))
        x(
          R,
          B,
          g,
          null,
          y,
          _,
          P,
          C,
          $
        );
      else
        break;
      z--, I--;
    }
    if (k > z) {
      if (k <= I) {
        const R = I + 1, B = R < j ? f[R].el : w;
        for (; k <= I; )
          x(
            null,
            f[k] = $ ? ut(f[k]) : Je(f[k]),
            g,
            B,
            y,
            _,
            P,
            C,
            $
          ), k++;
      }
    } else if (k > I)
      for (; k <= z; )
        ce(d[k], y, _, !0), k++;
    else {
      const R = k, B = k, Q = /* @__PURE__ */ new Map();
      for (k = B; k <= I; k++) {
        const Pe = f[k] = $ ? ut(f[k]) : Je(f[k]);
        Pe.key != null && Q.set(Pe.key, k);
      }
      let q, me = 0;
      const Me = I - B + 1;
      let jt = !1, eo = 0;
      const Dt = new Array(Me);
      for (k = 0; k < Me; k++) Dt[k] = 0;
      for (k = R; k <= z; k++) {
        const Pe = d[k];
        if (me >= Me) {
          ce(Pe, y, _, !0);
          continue;
        }
        let Ge;
        if (Pe.key != null)
          Ge = Q.get(Pe.key);
        else
          for (q = B; q <= I; q++)
            if (Dt[q - B] === 0 && Ht(Pe, f[q])) {
              Ge = q;
              break;
            }
        Ge === void 0 ? ce(Pe, y, _, !0) : (Dt[Ge - B] = k + 1, Ge >= eo ? eo = Ge : jt = !0, x(
          Pe,
          f[Ge],
          g,
          null,
          y,
          _,
          P,
          C,
          $
        ), me++);
      }
      const to = jt ? _u(Dt) : Et;
      for (q = to.length - 1, k = Me - 1; k >= 0; k--) {
        const Pe = B + k, Ge = f[Pe], ro = Pe + 1 < j ? f[Pe + 1].el : w;
        Dt[k] === 0 ? x(
          null,
          Ge,
          g,
          ro,
          y,
          _,
          P,
          C,
          $
        ) : jt && (q < 0 || k !== to[q] ? le(Ge, g, ro, 2) : q--);
      }
    }
  }, le = (d, f, g, w, y = null) => {
    const { el: _, type: P, transition: C, children: $, shapeFlag: k } = d;
    if (k & 6) {
      le(d.component.subTree, f, g, w);
      return;
    }
    if (k & 128) {
      d.suspense.move(f, g, w);
      return;
    }
    if (k & 64) {
      P.move(d, f, g, kt);
      return;
    }
    if (P === fe) {
      n(_, f, g);
      for (let z = 0; z < $.length; z++)
        le($[z], f, g, w);
      n(d.anchor, f, g);
      return;
    }
    if (P === ln) {
      m(d, f, g);
      return;
    }
    if (w !== 2 && k & 1 && C)
      if (w === 0)
        C.beforeEnter(_), n(_, f, g), we(() => C.enter(_), y);
      else {
        const { leave: z, delayLeave: I, afterLeave: R } = C, B = () => n(_, f, g), Q = () => {
          z(_, () => {
            B(), R && R();
          });
        };
        I ? I(_, B, Q) : Q();
      }
    else
      n(_, f, g);
  }, ce = (d, f, g, w = !1, y = !1) => {
    const {
      type: _,
      props: P,
      ref: C,
      children: $,
      dynamicChildren: k,
      shapeFlag: j,
      patchFlag: z,
      dirs: I,
      cacheIndex: R
    } = d;
    if (z === -2 && (y = !1), C != null && Sn(C, null, g, d, !0), R != null && (f.renderCache[R] = void 0), j & 256) {
      f.ctx.deactivate(d);
      return;
    }
    const B = j & 1 && I, Q = !Zt(d);
    let q;
    if (Q && (q = P && P.onVnodeBeforeUnmount) && qe(q, f, d), j & 6)
      mr(d.component, g, w);
    else {
      if (j & 128) {
        d.suspense.unmount(g, w);
        return;
      }
      B && wt(d, null, f, "beforeUnmount"), j & 64 ? d.type.remove(
        d,
        f,
        g,
        kt,
        w
      ) : k && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !k.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (_ !== fe || z > 0 && z & 64) ? it(
        k,
        f,
        g,
        !1,
        !0
      ) : (_ === fe && z & 384 || !y && j & 16) && it($, f, g), w && xt(d);
    }
    (Q && (q = P && P.onVnodeUnmounted) || B) && we(() => {
      q && qe(q, f, d), B && wt(d, null, f, "unmounted");
    }, g);
  }, xt = (d) => {
    const { type: f, el: g, anchor: w, transition: y } = d;
    if (f === fe) {
      st(g, w);
      return;
    }
    if (f === ln) {
      A(d);
      return;
    }
    const _ = () => {
      o(g), y && !y.persisted && y.afterLeave && y.afterLeave();
    };
    if (d.shapeFlag & 1 && y && !y.persisted) {
      const { leave: P, delayLeave: C } = y, $ = () => P(g, _);
      C ? C(d.el, _, $) : $();
    } else
      _();
  }, st = (d, f) => {
    let g;
    for (; d !== f; )
      g = b(d), o(d), d = g;
    o(f);
  }, mr = (d, f, g) => {
    const { bum: w, scope: y, update: _, subTree: P, um: C, m: $, a: k } = d;
    Lo($), Lo(k), w && Or(w), y.stop(), _ && (_.active = !1, ce(P, d, f, g)), C && we(C, f), we(() => {
      d.isUnmounted = !0;
    }, f), f && f.pendingBranch && !f.isUnmounted && d.asyncDep && !d.asyncResolved && d.suspenseId === f.pendingId && (f.deps--, f.deps === 0 && f.resolve());
  }, it = (d, f, g, w = !1, y = !1, _ = 0) => {
    for (let P = _; P < d.length; P++)
      ce(d[P], f, g, w, y);
  }, At = (d) => {
    if (d.shapeFlag & 6)
      return At(d.component.subTree);
    if (d.shapeFlag & 128)
      return d.suspense.next();
    const f = b(d.anchor || d.el), g = f && f[vu];
    return g ? b(g) : f;
  };
  let Vt = !1;
  const vr = (d, f, g) => {
    d == null ? f._vnode && ce(f._vnode, null, null, !0) : x(
      f._vnode || null,
      d,
      f,
      null,
      null,
      null,
      g
    ), f._vnode = d, Vt || (Vt = !0, $o(), qa(), Vt = !1);
  }, kt = {
    p: x,
    um: ce,
    m: le,
    r: xt,
    mt: Le,
    mc: se,
    pc: H,
    pbc: he,
    n: At,
    o: e
  };
  return {
    render: vr,
    hydrate: void 0,
    createApp: uu(vr)
  };
}
function sn({ type: e, props: t }, r) {
  return r === "svg" && e === "foreignObject" || r === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : r;
}
function _t({ effect: e, update: t }, r) {
  e.allowRecurse = t.allowRecurse = r;
}
function wu(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ms(e, t, r = !1) {
  const n = e.children, o = t.children;
  if (N(n) && N(o))
    for (let a = 0; a < n.length; a++) {
      const s = n[a];
      let i = o[a];
      i.shapeFlag & 1 && !i.dynamicChildren && ((i.patchFlag <= 0 || i.patchFlag === 32) && (i = o[a] = ut(o[a]), i.el = s.el), !r && i.patchFlag !== -2 && ms(s, i)), i.type === Zr && (i.el = s.el);
    }
}
function _u(e) {
  const t = e.slice(), r = [0];
  let n, o, a, s, i;
  const l = e.length;
  for (n = 0; n < l; n++) {
    const c = e[n];
    if (c !== 0) {
      if (o = r[r.length - 1], e[o] < c) {
        t[n] = o, r.push(n);
        continue;
      }
      for (a = 0, s = r.length - 1; a < s; )
        i = a + s >> 1, e[r[i]] < c ? a = i + 1 : s = i;
      c < e[r[a]] && (a > 0 && (t[n] = r[a - 1]), r[a] = n);
    }
  }
  for (a = r.length, s = r[a - 1]; a-- > 0; )
    r[a] = s, s = t[s];
  return r;
}
function vs(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : vs(t);
}
function Lo(e) {
  if (e)
    for (let t = 0; t < e.length; t++) e[t].active = !1;
}
const Su = Symbol.for("v-scx"), Cu = () => er(Su), $r = {};
function pt(e, t, r) {
  return ys(e, t, r);
}
function ys(e, t, {
  immediate: r,
  deep: n,
  flush: o,
  once: a,
  onTrack: s,
  onTrigger: i
} = te) {
  if (t && a) {
    const E = t;
    t = (...ie) => {
      E(...ie), D();
    };
  }
  const l = pe, c = (E) => n === !0 ? E : (
    // for deep: false, only traverse root-level properties
    dt(E, n === !1 ? 1 : void 0)
  );
  let u, p = !1, b = !1;
  if (Te(e) ? (u = () => e.value, p = Ft(e)) : Qt(e) ? (u = () => c(e), p = !0) : N(e) ? (b = !0, p = e.some((E) => Qt(E) || Ft(E)), u = () => e.map((E) => {
    if (Te(E))
      return E.value;
    if (Qt(E))
      return c(E);
    if (M(E))
      return gt(E, l, 2);
  })) : M(e) ? t ? u = () => gt(e, l, 2) : u = () => (h && h(), Ue(
    e,
    l,
    3,
    [S]
  )) : u = Ne, t && n) {
    const E = u;
    u = () => dt(E());
  }
  let h, S = (E) => {
    h = m.onStop = () => {
      gt(E, l, 4), h = m.onStop = void 0;
    };
  }, x;
  if (Xr)
    if (S = Ne, t ? r && Ue(t, l, 3, [
      u(),
      b ? [] : void 0,
      S
    ]) : u(), o === "sync") {
      const E = Cu();
      x = E.__watcherHandles || (E.__watcherHandles = []);
    } else
      return Ne;
  let T = b ? new Array(e.length).fill($r) : $r;
  const v = () => {
    if (!(!m.active || !m.dirty))
      if (t) {
        const E = m.run();
        (n || p || (b ? E.some((ie, se) => ht(ie, T[se])) : ht(E, T))) && (h && h(), Ue(t, l, 3, [
          E,
          // pass undefined as the old value when it's changed for the first time
          T === $r ? void 0 : b && T[0] === $r ? [] : T,
          S
        ]), T = E);
      } else
        m.run();
  };
  v.allowRecurse = !!t;
  let O;
  o === "sync" ? O = v : o === "post" ? O = () => we(v, l && l.suspense) : (v.pre = !0, l && (v.id = l.uid), O = () => Wn(v));
  const m = new Nn(u, Ne, O), A = dc(), D = () => {
    m.stop(), A && zn(A.effects, m);
  };
  return t ? r ? v() : T = m.run() : o === "post" ? we(
    m.run.bind(m),
    l && l.suspense
  ) : m.run(), x && x.push(D), D;
}
function $u(e, t, r) {
  const n = this.proxy, o = ae(e) ? e.includes(".") ? xs(n, e) : () => n[e] : e.bind(n, n);
  let a;
  M(t) ? a = t : (a = t.handler, r = t);
  const s = hr(this), i = ys(o, a.bind(n), r);
  return s(), i;
}
function xs(e, t) {
  const r = t.split(".");
  return () => {
    let n = e;
    for (let o = 0; o < r.length && n; o++)
      n = n[r[o]];
    return n;
  };
}
function dt(e, t = 1 / 0, r) {
  if (t <= 0 || !X(e) || e.__v_skip || (r = r || /* @__PURE__ */ new Set(), r.has(e)))
    return e;
  if (r.add(e), t--, Te(e))
    dt(e.value, t, r);
  else if (N(e))
    for (let n = 0; n < e.length; n++)
      dt(e[n], t, r);
  else if (Hr(e) || Nt(e))
    e.forEach((n) => {
      dt(n, t, r);
    });
  else if (Sa(e)) {
    for (const n in e)
      dt(e[n], t, r);
    for (const n of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, n) && dt(e[n], t, r);
  }
  return e;
}
const Tu = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Ke(t)}Modifiers`] || e[`${Ot(t)}Modifiers`];
function Pu(e, t, ...r) {
  if (e.isUnmounted) return;
  const n = e.vnode.props || te;
  let o = r;
  const a = t.startsWith("update:"), s = a && Tu(n, t.slice(7));
  s && (s.trim && (o = r.map((u) => ae(u) ? u.trim() : u)), s.number && (o = r.map($a)));
  let i, l = n[i = nn(t)] || // also try camelCase event handler (#2249)
  n[i = nn(Ke(t))];
  !l && a && (l = n[i = nn(Ot(t))]), l && Ue(
    l,
    e,
    6,
    o
  );
  const c = n[i + "Once"];
  if (c) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[i])
      return;
    e.emitted[i] = !0, Ue(
      c,
      e,
      6,
      o
    );
  }
}
function ks(e, t, r = !1) {
  const n = t.emitsCache, o = n.get(e);
  if (o !== void 0)
    return o;
  const a = e.emits;
  let s = {}, i = !1;
  if (!M(e)) {
    const l = (c) => {
      const u = ks(c, t, !0);
      u && (i = !0, Ce(s, u));
    };
    !r && t.mixins.length && t.mixins.forEach(l), e.extends && l(e.extends), e.mixins && e.mixins.forEach(l);
  }
  return !a && !i ? (X(e) && n.set(e, null), null) : (N(a) ? a.forEach((l) => s[l] = null) : Ce(s, a), X(e) && n.set(e, s), s);
}
function Qr(e, t) {
  return !e || !Dr(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), K(e, t[0].toLowerCase() + t.slice(1)) || K(e, Ot(t)) || K(e, t));
}
function Eo(e) {
  const {
    type: t,
    vnode: r,
    proxy: n,
    withProxy: o,
    propsOptions: [a],
    slots: s,
    attrs: i,
    emit: l,
    render: c,
    renderCache: u,
    props: p,
    data: b,
    setupState: h,
    ctx: S,
    inheritAttrs: x
  } = e, T = Er(e);
  let v, O;
  try {
    if (r.shapeFlag & 4) {
      const A = o || n, D = A;
      v = Je(
        c.call(
          D,
          A,
          u,
          p,
          h,
          b,
          S
        )
      ), O = i;
    } else {
      const A = t;
      v = Je(
        A.length > 1 ? A(
          p,
          { attrs: i, slots: s, emit: l }
        ) : A(
          p,
          null
        )
      ), O = t.props ? i : Ou(i);
    }
  } catch (A) {
    tr.length = 0, Yr(A, e, 1), v = Re(mt);
  }
  let m = v;
  if (O && x !== !1) {
    const A = Object.keys(O), { shapeFlag: D } = m;
    A.length && D & 7 && (a && A.some(In) && (O = Au(
      O,
      a
    )), m = Bt(m, O, !1, !0));
  }
  return r.dirs && (m = Bt(m, null, !1, !0), m.dirs = m.dirs ? m.dirs.concat(r.dirs) : r.dirs), r.transition && (m.transition = r.transition), v = m, Er(T), v;
}
const Ou = (e) => {
  let t;
  for (const r in e)
    (r === "class" || r === "style" || Dr(r)) && ((t || (t = {}))[r] = e[r]);
  return t;
}, Au = (e, t) => {
  const r = {};
  for (const n in e)
    (!In(n) || !(n.slice(9) in t)) && (r[n] = e[n]);
  return r;
};
function ju(e, t, r) {
  const { props: n, children: o, component: a } = e, { props: s, children: i, patchFlag: l } = t, c = a.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (r && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return n ? No(n, s, c) : !!s;
    if (l & 8) {
      const u = t.dynamicProps;
      for (let p = 0; p < u.length; p++) {
        const b = u[p];
        if (s[b] !== n[b] && !Qr(c, b))
          return !0;
      }
    }
  } else
    return (o || i) && (!i || !i.$stable) ? !0 : n === s ? !1 : n ? s ? No(n, s, c) : !0 : !!s;
  return !1;
}
function No(e, t, r) {
  const n = Object.keys(t);
  if (n.length !== Object.keys(e).length)
    return !0;
  for (let o = 0; o < n.length; o++) {
    const a = n[o];
    if (t[a] !== e[a] && !Qr(r, a))
      return !0;
  }
  return !1;
}
function Iu({ vnode: e, parent: t }, r) {
  for (; t; ) {
    const n = t.subTree;
    if (n.suspense && n.suspense.activeBranch === e && (n.el = e.el), n === e)
      (e = t.vnode).el = r, t = t.parent;
    else
      break;
  }
}
const zu = (e) => e.__isSuspense;
function Lu(e, t) {
  t && t.pendingBranch ? N(e) ? t.effects.push(...e) : t.effects.push(e) : Bc(e);
}
const fe = Symbol.for("v-fgt"), Zr = Symbol.for("v-txt"), mt = Symbol.for("v-cmt"), ln = Symbol.for("v-stc"), tr = [];
let Ae = null;
function J(e = !1) {
  tr.push(Ae = e ? null : []);
}
function Eu() {
  tr.pop(), Ae = tr[tr.length - 1] || null;
}
let sr = 1;
function Ro(e) {
  sr += e, e < 0 && Ae && (Ae.hasOnce = !0);
}
function ws(e) {
  return e.dynamicChildren = sr > 0 ? Ae || Et : null, Eu(), sr > 0 && Ae && Ae.push(e), e;
}
function oe(e, t, r, n, o, a) {
  return ws(
    L(
      e,
      t,
      r,
      n,
      o,
      a,
      !0
    )
  );
}
function rr(e, t, r, n, o) {
  return ws(
    Re(
      e,
      t,
      r,
      n,
      o,
      !0
    )
  );
}
function _s(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Ht(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Ss = ({ key: e }) => e ?? null, jr = ({
  ref: e,
  ref_key: t,
  ref_for: r
}) => (typeof e == "number" && (e = "" + e), e != null ? ae(e) || Te(e) || M(e) ? { i: de, r: e, k: t, f: !!r } : e : null);
function L(e, t = null, r = null, n = 0, o = null, a = e === fe ? 0 : 1, s = !1, i = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Ss(t),
    ref: t && jr(t),
    scopeId: Ja,
    slotScopeIds: null,
    children: r,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: a,
    patchFlag: n,
    dynamicProps: o,
    dynamicChildren: null,
    appContext: null,
    ctx: de
  };
  return i ? (Qn(l, r), a & 128 && e.normalize(l)) : r && (l.shapeFlag |= ae(r) ? 8 : 16), sr > 0 && // avoid a block node from tracking itself
  !s && // has current parent block
  Ae && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || a & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && Ae.push(l), l;
}
const Re = Nu;
function Nu(e, t = null, r = null, n = 0, o = null, a = !1) {
  if ((!e || e === ns) && (e = mt), _s(e)) {
    const i = Bt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return r && Qn(i, r), sr > 0 && !a && Ae && (i.shapeFlag & 6 ? Ae[Ae.indexOf(e)] = i : Ae.push(i)), i.patchFlag = -2, i;
  }
  if (Gu(e) && (e = e.__vccOpts), t) {
    t = Ru(t);
    let { class: i, style: l } = t;
    i && !ae(i) && (t.class = _e(i)), X(l) && (Da(l) && !N(l) && (l = Ce({}, l)), t.style = En(l));
  }
  const s = ae(e) ? 1 : zu(e) ? 128 : yu(e) ? 64 : X(e) ? 4 : M(e) ? 2 : 0;
  return L(
    e,
    t,
    r,
    n,
    o,
    s,
    a,
    !0
  );
}
function Ru(e) {
  return e ? Da(e) || us(e) ? Ce({}, e) : e : null;
}
function Bt(e, t, r = !1, n = !1) {
  const { props: o, ref: a, patchFlag: s, children: i, transition: l } = e, c = t ? Oe(o || {}, t) : o, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: c,
    key: c && Ss(c),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      r && a ? N(a) ? a.concat(jr(t)) : [a, jr(t)] : jr(t)
    ) : a,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: i,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== fe ? s === -1 ? 16 : s | 16 : s,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: l,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Bt(e.ssContent),
    ssFallback: e.ssFallback && Bt(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return l && n && Xa(
    u,
    l.clone(u)
  ), u;
}
function Rr(e = " ", t = 0) {
  return Re(Zr, null, e, t);
}
function ue(e = "", t = !1) {
  return t ? (J(), rr(mt, null, e)) : Re(mt, null, e);
}
function Je(e) {
  return e == null || typeof e == "boolean" ? Re(mt) : N(e) ? Re(
    fe,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : typeof e == "object" ? ut(e) : Re(Zr, null, String(e));
}
function ut(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Bt(e);
}
function Qn(e, t) {
  let r = 0;
  const { shapeFlag: n } = e;
  if (t == null)
    t = null;
  else if (N(t))
    r = 16;
  else if (typeof t == "object")
    if (n & 65) {
      const o = t.default;
      o && (o._c && (o._d = !1), Qn(e, o()), o._c && (o._d = !0));
      return;
    } else {
      r = 32;
      const o = t._;
      !o && !us(t) ? t._ctx = de : o === 3 && de && (de.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else M(t) ? (t = { default: t, _ctx: de }, r = 32) : (t = String(t), n & 64 ? (r = 16, t = [Rr(t)]) : r = 8);
  e.children = t, e.shapeFlag |= r;
}
function Oe(...e) {
  const t = {};
  for (let r = 0; r < e.length; r++) {
    const n = e[r];
    for (const o in n)
      if (o === "class")
        t.class !== n.class && (t.class = _e([t.class, n.class]));
      else if (o === "style")
        t.style = En([t.style, n.style]);
      else if (Dr(o)) {
        const a = t[o], s = n[o];
        s && a !== s && !(N(a) && a.includes(s)) && (t[o] = a ? [].concat(a, s) : s);
      } else o !== "" && (t[o] = n[o]);
  }
  return t;
}
function qe(e, t, r, n = null) {
  Ue(e, t, 7, [
    r,
    n
  ]);
}
const Mu = is();
let Fu = 0;
function Bu(e, t, r) {
  const n = e.type, o = (t ? t.appContext : e.appContext) || Mu, a = {
    uid: Fu++,
    vnode: e,
    type: n,
    parent: t,
    appContext: o,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new cc(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(o.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: fs(n, o),
    emitsOptions: ks(n, o),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: te,
    // inheritAttrs
    inheritAttrs: n.inheritAttrs,
    // state
    ctx: te,
    data: te,
    props: te,
    attrs: te,
    slots: te,
    refs: te,
    setupState: te,
    setupContext: null,
    // suspense related
    suspense: r,
    suspenseId: r ? r.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = Pu.bind(null, a), e.ce && e.ce(a), a;
}
let pe = null;
const Vu = () => pe || de;
let Mr, Cn;
{
  const e = Ta(), t = (r, n) => {
    let o;
    return (o = e[r]) || (o = e[r] = []), o.push(n), (a) => {
      o.length > 1 ? o.forEach((s) => s(a)) : o[0](a);
    };
  };
  Mr = t(
    "__VUE_INSTANCE_SETTERS__",
    (r) => pe = r
  ), Cn = t(
    "__VUE_SSR_SETTERS__",
    (r) => Xr = r
  );
}
const hr = (e) => {
  const t = pe;
  return Mr(e), e.scope.on(), () => {
    e.scope.off(), Mr(t);
  };
}, Mo = () => {
  pe && pe.scope.off(), Mr(null);
};
function Cs(e) {
  return e.vnode.shapeFlag & 4;
}
let Xr = !1;
function Du(e, t = !1, r = !1) {
  t && Cn(t);
  const { props: n, children: o } = e.vnode, a = Cs(e);
  fu(e, n, a, t), hu(e, o, r);
  const s = a ? Hu(e, t) : void 0;
  return t && Cn(!1), s;
}
function Hu(e, t) {
  const r = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, nu);
  const { setup: n } = r;
  if (n) {
    const o = e.setupContext = n.length > 1 ? Ku(e) : null, a = hr(e);
    vt();
    const s = gt(
      n,
      e,
      0,
      [
        e.props,
        o
      ]
    );
    if (yt(), a(), wa(s)) {
      if (s.then(Mo, Mo), t)
        return s.then((i) => {
          Fo(e, i);
        }).catch((i) => {
          Yr(i, e, 0);
        });
      e.asyncDep = s;
    } else
      Fo(e, s);
  } else
    $s(e);
}
function Fo(e, t, r) {
  M(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : X(t) && (e.setupState = Ka(t)), $s(e);
}
function $s(e, t, r) {
  const n = e.type;
  e.render || (e.render = n.render || Ne);
  {
    const o = hr(e);
    vt();
    try {
      ou(e);
    } finally {
      yt(), o();
    }
  }
}
const Uu = {
  get(e, t) {
    return $e(e, "get", ""), e[t];
  }
};
function Ku(e) {
  const t = (r) => {
    e.exposed = r || {};
  };
  return {
    attrs: new Proxy(e.attrs, Uu),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function en(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Ka(Ic(e.exposed)), {
    get(t, r) {
      if (r in t)
        return t[r];
      if (r in Xt)
        return Xt[r](e);
    },
    has(t, r) {
      return r in t || r in Xt;
    }
  })) : e.proxy;
}
function Wu(e, t = !0) {
  return M(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Gu(e) {
  return M(e) && "__vccOpts" in e;
}
const Wt = (e, t) => zc(e, t, Xr), qu = "3.4.37";
/**
* @vue/runtime-dom v3.4.37
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const Yu = "http://www.w3.org/2000/svg", Ju = "http://www.w3.org/1998/Math/MathML", tt = typeof document < "u" ? document : null, Bo = tt && /* @__PURE__ */ tt.createElement("template"), Qu = {
  insert: (e, t, r) => {
    t.insertBefore(e, r || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, r, n) => {
    const o = t === "svg" ? tt.createElementNS(Yu, e) : t === "mathml" ? tt.createElementNS(Ju, e) : r ? tt.createElement(e, { is: r }) : tt.createElement(e);
    return e === "select" && n && n.multiple != null && o.setAttribute("multiple", n.multiple), o;
  },
  createText: (e) => tt.createTextNode(e),
  createComment: (e) => tt.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => tt.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, r, n, o, a) {
    const s = r ? r.previousSibling : t.lastChild;
    if (o && (o === a || o.nextSibling))
      for (; t.insertBefore(o.cloneNode(!0), r), !(o === a || !(o = o.nextSibling)); )
        ;
    else {
      Bo.innerHTML = n === "svg" ? `<svg>${e}</svg>` : n === "mathml" ? `<math>${e}</math>` : e;
      const i = Bo.content;
      if (n === "svg" || n === "mathml") {
        const l = i.firstChild;
        for (; l.firstChild; )
          i.appendChild(l.firstChild);
        i.removeChild(l);
      }
      t.insertBefore(i, r);
    }
    return [
      // first
      s ? s.nextSibling : t.firstChild,
      // last
      r ? r.previousSibling : t.lastChild
    ];
  }
}, Zu = Symbol("_vtc");
function Xu(e, t, r) {
  const n = e[Zu];
  n && (t = (t ? [t, ...n] : [...n]).join(" ")), t == null ? e.removeAttribute("class") : r ? e.setAttribute("class", t) : e.className = t;
}
const Vo = Symbol("_vod"), ed = Symbol("_vsh"), td = Symbol(""), rd = /(^|;)\s*display\s*:/;
function nd(e, t, r) {
  const n = e.style, o = ae(r);
  let a = !1;
  if (r && !o) {
    if (t)
      if (ae(t))
        for (const s of t.split(";")) {
          const i = s.slice(0, s.indexOf(":")).trim();
          r[i] == null && Ir(n, i, "");
        }
      else
        for (const s in t)
          r[s] == null && Ir(n, s, "");
    for (const s in r)
      s === "display" && (a = !0), Ir(n, s, r[s]);
  } else if (o) {
    if (t !== r) {
      const s = n[td];
      s && (r += ";" + s), n.cssText = r, a = rd.test(r);
    }
  } else t && e.removeAttribute("style");
  Vo in e && (e[Vo] = a ? n.display : "", e[ed] && (n.display = "none"));
}
const Do = /\s*!important$/;
function Ir(e, t, r) {
  if (N(r))
    r.forEach((n) => Ir(e, t, n));
  else if (r == null && (r = ""), t.startsWith("--"))
    e.setProperty(t, r);
  else {
    const n = od(e, t);
    Do.test(r) ? e.setProperty(
      Ot(n),
      r.replace(Do, ""),
      "important"
    ) : e[n] = r;
  }
}
const Ho = ["Webkit", "Moz", "ms"], cn = {};
function od(e, t) {
  const r = cn[t];
  if (r)
    return r;
  let n = Ke(t);
  if (n !== "filter" && n in e)
    return cn[t] = n;
  n = Kr(n);
  for (let o = 0; o < Ho.length; o++) {
    const a = Ho[o] + n;
    if (a in e)
      return cn[t] = a;
  }
  return t;
}
const Uo = "http://www.w3.org/1999/xlink";
function Ko(e, t, r, n, o, a = sc(t)) {
  n && t.startsWith("xlink:") ? r == null ? e.removeAttributeNS(Uo, t.slice(6, t.length)) : e.setAttributeNS(Uo, t, r) : r == null || a && !Pa(r) ? e.removeAttribute(t) : e.setAttribute(
    t,
    a ? "" : Xe(r) ? String(r) : r
  );
}
function ad(e, t, r, n) {
  if (t === "innerHTML" || t === "textContent") {
    if (r == null) return;
    e[t] = r;
    return;
  }
  const o = e.tagName;
  if (t === "value" && o !== "PROGRESS" && // custom elements may use _value internally
  !o.includes("-")) {
    const s = o === "OPTION" ? e.getAttribute("value") || "" : e.value, i = r == null ? "" : String(r);
    (s !== i || !("_value" in e)) && (e.value = i), r == null && e.removeAttribute(t), e._value = r;
    return;
  }
  let a = !1;
  if (r === "" || r == null) {
    const s = typeof e[t];
    s === "boolean" ? r = Pa(r) : r == null && s === "string" ? (r = "", a = !0) : s === "number" && (r = 0, a = !0);
  }
  try {
    e[t] = r;
  } catch {
  }
  a && e.removeAttribute(t);
}
function Ts(e, t, r, n) {
  e.addEventListener(t, r, n);
}
function sd(e, t, r, n) {
  e.removeEventListener(t, r, n);
}
const Wo = Symbol("_vei");
function id(e, t, r, n, o = null) {
  const a = e[Wo] || (e[Wo] = {}), s = a[t];
  if (n && s)
    s.value = n;
  else {
    const [i, l] = ld(t);
    if (n) {
      const c = a[t] = dd(
        n,
        o
      );
      Ts(e, i, c, l);
    } else s && (sd(e, i, s, l), a[t] = void 0);
  }
}
const Go = /(?:Once|Passive|Capture)$/;
function ld(e) {
  let t;
  if (Go.test(e)) {
    t = {};
    let n;
    for (; n = e.match(Go); )
      e = e.slice(0, e.length - n[0].length), t[n[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : Ot(e.slice(2)), t];
}
let un = 0;
const cd = /* @__PURE__ */ Promise.resolve(), ud = () => un || (cd.then(() => un = 0), un = Date.now());
function dd(e, t) {
  const r = (n) => {
    if (!n._vts)
      n._vts = Date.now();
    else if (n._vts <= r.attached)
      return;
    Ue(
      fd(n, r.value),
      t,
      5,
      [n]
    );
  };
  return r.value = e, r.attached = ud(), r;
}
function fd(e, t) {
  if (N(t)) {
    const r = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      r.call(e), e._stopped = !0;
    }, t.map(
      (n) => (o) => !o._stopped && n && n(o)
    );
  } else
    return t;
}
const qo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, pd = (e, t, r, n, o, a) => {
  const s = o === "svg";
  t === "class" ? Xu(e, n, s) : t === "style" ? nd(e, r, n) : Dr(t) ? In(t) || id(e, t, r, n, a) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : bd(e, t, n, s)) ? (ad(e, t, n), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ko(e, t, n, s, a, t !== "value")) : (t === "true-value" ? e._trueValue = n : t === "false-value" && (e._falseValue = n), Ko(e, t, n, s));
};
function bd(e, t, r, n) {
  if (n)
    return !!(t === "innerHTML" || t === "textContent" || t in e && qo(t) && M(r));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const o = e.tagName;
    if (o === "IMG" || o === "VIDEO" || o === "CANVAS" || o === "SOURCE")
      return !1;
  }
  return qo(t) && ae(r) ? !1 : t in e;
}
const Yo = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return N(t) ? (r) => Or(t, r) : t;
}, dn = Symbol("_assign"), gd = {
  // <select multiple> value need to be deep traversed
  deep: !0,
  created(e, { value: t, modifiers: { number: r } }, n) {
    const o = Hr(t);
    Ts(e, "change", () => {
      const a = Array.prototype.filter.call(e.options, (s) => s.selected).map(
        (s) => r ? $a(Fr(s)) : Fr(s)
      );
      e[dn](
        e.multiple ? o ? new Set(a) : a : a[0]
      ), e._assigning = !0, Kn(() => {
        e._assigning = !1;
      });
    }), e[dn] = Yo(n);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(e, { value: t, modifiers: { number: r } }) {
    Jo(e, t);
  },
  beforeUpdate(e, t, r) {
    e[dn] = Yo(r);
  },
  updated(e, { value: t, modifiers: { number: r } }) {
    e._assigning || Jo(e, t);
  }
};
function Jo(e, t, r) {
  const n = e.multiple, o = N(t);
  if (!(n && !o && !Hr(t))) {
    for (let a = 0, s = e.options.length; a < s; a++) {
      const i = e.options[a], l = Fr(i);
      if (n)
        if (o) {
          const c = typeof l;
          c === "string" || c === "number" ? i.selected = t.some((u) => String(u) === String(l)) : i.selected = lc(t, l) > -1;
        } else
          i.selected = t.has(l);
      else if (Wr(Fr(i), t)) {
        e.selectedIndex !== a && (e.selectedIndex = a);
        return;
      }
    }
    !n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
  }
}
function Fr(e) {
  return "_value" in e ? e._value : e.value;
}
const hd = /* @__PURE__ */ Ce({ patchProp: pd }, Qu);
let Qo;
function md() {
  return Qo || (Qo = xu(hd));
}
const vd = (...e) => {
  const t = md().createApp(...e), { mount: r } = t;
  return t.mount = (n) => {
    const o = xd(n);
    if (!o) return;
    const a = t._component;
    !M(a) && !a.render && !a.template && (a.template = o.innerHTML), o.innerHTML = "";
    const s = r(o, !1, yd(o));
    return o instanceof Element && (o.removeAttribute("v-cloak"), o.setAttribute("data-v-app", "")), s;
  }, t;
};
function yd(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function xd(e) {
  return ae(e) ? document.querySelector(e) : e;
}
function ir(e) {
  "@babel/helpers - typeof";
  return ir = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ir(e);
}
function Zo(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Xo(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Zo(Object(r), !0).forEach(function(n) {
      kd(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Zo(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function kd(e, t, r) {
  return (t = wd(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function wd(e) {
  var t = _d(e, "string");
  return ir(t) == "symbol" ? t : t + "";
}
function _d(e, t) {
  if (ir(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ir(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Sd(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  Vu() ? Gn(e) : t ? e() : Kn(e);
}
var Cd = 0;
function $d(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = rt(!1), n = rt(e), o = rt(null), a = xa() ? window.document : void 0, s = t.document, i = s === void 0 ? a : s, l = t.immediate, c = l === void 0 ? !0 : l, u = t.manual, p = u === void 0 ? !1 : u, b = t.name, h = b === void 0 ? "style_".concat(++Cd) : b, S = t.id, x = S === void 0 ? void 0 : S, T = t.media, v = T === void 0 ? void 0 : T, O = t.nonce, m = O === void 0 ? void 0 : O, A = t.first, D = A === void 0 ? !1 : A, E = t.onMounted, ie = E === void 0 ? void 0 : E, se = t.onUpdated, je = se === void 0 ? void 0 : se, he = t.onLoad, ye = he === void 0 ? void 0 : he, Ie = t.props, ze = Ie === void 0 ? {} : Ie, Le = function() {
  }, We = function(H) {
    var xe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (i) {
      var ke = Xo(Xo({}, ze), xe), le = ke.name || h, ce = ke.id || x, xt = ke.nonce || m;
      o.value = i.querySelector('style[data-primevue-style-id="'.concat(le, '"]')) || i.getElementById(ce) || i.createElement("style"), o.value.isConnected || (n.value = H || e, Lr(o.value, {
        type: "text/css",
        id: ce,
        media: v,
        nonce: xt
      }), D ? i.head.prepend(o.value) : i.head.appendChild(o.value), Yl(o.value, "data-primevue-style-id", le), Lr(o.value, ke), o.value.onload = function(st) {
        return ye == null ? void 0 : ye(st, {
          name: le
        });
      }, ie == null || ie(le)), !r.value && (Le = pt(n, function(st) {
        o.value.textContent = st, je == null || je(le);
      }, {
        immediate: !0
      }), r.value = !0);
    }
  }, ne = function() {
    !i || !r.value || (Le(), ql(o.value) && i.head.removeChild(o.value), r.value = !1);
  };
  return c && !p && Sd(We), {
    id: x,
    name: h,
    el: o,
    css: n,
    unload: ne,
    load: We,
    isLoaded: Vn(r)
  };
}
function lr(e) {
  "@babel/helpers - typeof";
  return lr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, lr(e);
}
function ea(e, t) {
  return Ad(e) || Od(e, t) || Pd(e, t) || Td();
}
function Td() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Pd(e, t) {
  if (e) {
    if (typeof e == "string") return ta(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? ta(e, t) : void 0;
  }
}
function ta(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Od(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, a, s, i = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (i.push(n.value), i.length !== t); l = !0) ;
    } catch (u) {
      c = !0, o = u;
    } finally {
      try {
        if (!l && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (c) throw o;
      }
    }
    return i;
  }
}
function Ad(e) {
  if (Array.isArray(e)) return e;
}
function ra(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function fn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ra(Object(r), !0).forEach(function(n) {
      jd(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ra(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function jd(e, t, r) {
  return (t = Id(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Id(e) {
  var t = zd(e, "string");
  return lr(t) == "symbol" ? t : t + "";
}
function zd(e, t) {
  if (lr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (lr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ld = function(t) {
  var r = t.dt;
  return `
* {
    box-sizing: border-box;
}

/* Non vue overlay animations */
.p-connected-overlay {
    opacity: 0;
    transform: scaleY(0.8);
    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1),
        opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.p-connected-overlay-visible {
    opacity: 1;
    transform: scaleY(1);
}

.p-connected-overlay-hidden {
    opacity: 0;
    transform: scaleY(1);
    transition: opacity 0.1s linear;
}

/* Vue based overlay animations */
.p-connected-overlay-enter-from {
    opacity: 0;
    transform: scaleY(0.8);
}

.p-connected-overlay-leave-to {
    opacity: 0;
}

.p-connected-overlay-enter-active {
    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1),
        opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.p-connected-overlay-leave-active {
    transition: opacity 0.1s linear;
}

/* Toggleable Content */
.p-toggleable-content-enter-from,
.p-toggleable-content-leave-to {
    max-height: 0;
}

.p-toggleable-content-enter-to,
.p-toggleable-content-leave-from {
    max-height: 1000px;
}

.p-toggleable-content-leave-active {
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);
}

.p-toggleable-content-enter-active {
    overflow: hidden;
    transition: max-height 1s ease-in-out;
}

.p-disabled,
.p-disabled * {
    cursor: default;
    pointer-events: none;
    user-select: none;
}

.p-disabled,
.p-component:disabled {
    opacity: `.concat(r("disabled.opacity"), `;
}

.pi {
    font-size: `).concat(r("icon.size"), `;
}

.p-icon {
    width: `).concat(r("icon.size"), `;
    height: `).concat(r("icon.size"), `;
}

.p-overlay-mask {
    background: `).concat(r("mask.background"), `;
    color: `).concat(r("mask.color"), `;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-overlay-mask-enter {
    animation: p-overlay-mask-enter-animation `).concat(r("mask.transition.duration"), ` forwards;
}

.p-overlay-mask-leave {
    animation: p-overlay-mask-leave-animation `).concat(r("mask.transition.duration"), ` forwards;
}

@keyframes p-overlay-mask-enter-animation {
    from {
        background: transparent;
    }
    to {
        background: `).concat(r("mask.background"), `;
    }
}
@keyframes p-overlay-mask-leave-animation {
    from {
        background: `).concat(r("mask.background"), `;
    }
    to {
        background: transparent;
    }
}
`);
}, Ed = function(t) {
  var r = t.dt;
  return `
.p-hidden-accessible {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
}

.p-hidden-accessible input,
.p-hidden-accessible select {
    transform: scale(0);
}

.p-overflow-hidden {
    overflow: hidden;
    padding-right: `.concat(r("scrollbar.width"), `;
}
`);
}, Nd = {}, Rd = {}, re = {
  name: "base",
  css: Ed,
  theme: Ld,
  classes: Nd,
  inlineStyles: Rd,
  load: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(a) {
      return a;
    }, o = n(Ee(t, {
      dt: Yt
    }));
    return Z(o) ? $d(qt(o), fn({
      name: this.name
    }, r)) : {};
  },
  loadCSS: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, t);
  },
  loadTheme: function() {
    var t = this, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.theme, r, function() {
      var o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return Y.transformCSS(r.name || t.name, "".concat(o).concat(n));
    });
  },
  getCommonTheme: function(t) {
    return Y.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return Y.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return Y.getDirective(this.name, t);
  },
  getPresetTheme: function(t, r, n) {
    return Y.getCustomPreset(this.name, t, r, n);
  },
  getLayerOrderThemeCSS: function() {
    return Y.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var n = Ee(this.css, {
        dt: Yt
      }) || "", o = qt("".concat(n).concat(t)), a = Object.entries(r).reduce(function(s, i) {
        var l = ea(i, 2), c = l[0], u = l[1];
        return s.push("".concat(c, '="').concat(u, '"')) && s;
      }, []).join(" ");
      return Z(o) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(a, ">").concat(o, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return Y.getCommonStyleSheet(this.name, t, r);
  },
  getThemeStyleSheet: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = [Y.getStyleSheet(this.name, t, r)];
    if (this.theme) {
      var o = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), a = Ee(this.theme, {
        dt: Yt
      }), s = qt(Y.transformCSS(o, a)), i = Object.entries(r).reduce(function(l, c) {
        var u = ea(c, 2), p = u[0], b = u[1];
        return l.push("".concat(p, '="').concat(b, '"')) && l;
      }, []).join(" ");
      Z(s) && n.push('<style type="text/css" data-primevue-style-id="'.concat(o, '" ').concat(i, ">").concat(s, "</style>"));
    }
    return n.join("");
  },
  extend: function(t) {
    return fn(fn({}, this), {}, {
      css: void 0,
      theme: void 0
    }, t);
  }
}, zt = ga();
function cr(e) {
  "@babel/helpers - typeof";
  return cr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, cr(e);
}
function na(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Tr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? na(Object(r), !0).forEach(function(n) {
      Md(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : na(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Md(e, t, r) {
  return (t = Fd(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Fd(e) {
  var t = Bd(e, "string");
  return cr(t) == "symbol" ? t : t + "";
}
function Bd(e, t) {
  if (cr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (cr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Vd = {
  ripple: !1,
  inputStyle: null,
  inputVariant: null,
  locale: {
    startsWith: "Starts with",
    contains: "Contains",
    notContains: "Not contains",
    endsWith: "Ends with",
    equals: "Equals",
    notEquals: "Not equals",
    noFilter: "No Filter",
    lt: "Less than",
    lte: "Less than or equal to",
    gt: "Greater than",
    gte: "Greater than or equal to",
    dateIs: "Date is",
    dateIsNot: "Date is not",
    dateBefore: "Date is before",
    dateAfter: "Date is after",
    clear: "Clear",
    apply: "Apply",
    matchAll: "Match All",
    matchAny: "Match Any",
    addRule: "Add Rule",
    removeRule: "Remove Rule",
    accept: "Yes",
    reject: "No",
    choose: "Choose",
    upload: "Upload",
    cancel: "Cancel",
    completed: "Completed",
    pending: "Pending",
    fileSizeTypes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chooseYear: "Choose Year",
    chooseMonth: "Choose Month",
    chooseDate: "Choose Date",
    prevDecade: "Previous Decade",
    nextDecade: "Next Decade",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    prevHour: "Previous Hour",
    nextHour: "Next Hour",
    prevMinute: "Previous Minute",
    nextMinute: "Next Minute",
    prevSecond: "Previous Second",
    nextSecond: "Next Second",
    am: "am",
    pm: "pm",
    today: "Today",
    weekHeader: "Wk",
    firstDayOfWeek: 0,
    showMonthAfterYear: !1,
    dateFormat: "mm/dd/yy",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    passwordPrompt: "Enter a password",
    emptyFilterMessage: "No results found",
    searchMessage: "{0} results are available",
    selectionMessage: "{0} items selected",
    emptySelectionMessage: "No selected item",
    emptySearchMessage: "No results found",
    fileChosenMessage: "{0} files",
    noFileChosenMessage: "No file chosen",
    emptyMessage: "No available options",
    aria: {
      trueLabel: "True",
      falseLabel: "False",
      nullLabel: "Not Selected",
      star: "1 star",
      stars: "{star} stars",
      selectAll: "All items selected",
      unselectAll: "All items unselected",
      close: "Close",
      previous: "Previous",
      next: "Next",
      navigation: "Navigation",
      scrollTop: "Scroll Top",
      moveTop: "Move Top",
      moveUp: "Move Up",
      moveDown: "Move Down",
      moveBottom: "Move Bottom",
      moveToTarget: "Move to Target",
      moveToSource: "Move to Source",
      moveAllToTarget: "Move All to Target",
      moveAllToSource: "Move All to Source",
      pageLabel: "Page {page}",
      firstPageLabel: "First Page",
      lastPageLabel: "Last Page",
      nextPageLabel: "Next Page",
      prevPageLabel: "Previous Page",
      rowsPerPageLabel: "Rows per page",
      jumpToPageDropdownLabel: "Jump to Page Dropdown",
      jumpToPageInputLabel: "Jump to Page Input",
      selectRow: "Row Selected",
      unselectRow: "Row Unselected",
      expandRow: "Row Expanded",
      collapseRow: "Row Collapsed",
      showFilterMenu: "Show Filter Menu",
      hideFilterMenu: "Hide Filter Menu",
      filterOperator: "Filter Operator",
      filterConstraint: "Filter Constraint",
      editRow: "Row Edit",
      saveEdit: "Save Edit",
      cancelEdit: "Cancel Edit",
      listView: "List View",
      gridView: "Grid View",
      slide: "Slide",
      slideNumber: "{slideNumber}",
      zoomImage: "Zoom Image",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      rotateRight: "Rotate Right",
      rotateLeft: "Rotate Left",
      listLabel: "Option List"
    }
  },
  filterMatchModeOptions: {
    text: [be.STARTS_WITH, be.CONTAINS, be.NOT_CONTAINS, be.ENDS_WITH, be.EQUALS, be.NOT_EQUALS],
    numeric: [be.EQUALS, be.NOT_EQUALS, be.LESS_THAN, be.LESS_THAN_OR_EQUAL_TO, be.GREATER_THAN, be.GREATER_THAN_OR_EQUAL_TO],
    date: [be.DATE_IS, be.DATE_IS_NOT, be.DATE_BEFORE, be.DATE_AFTER]
  },
  zIndex: {
    modal: 1100,
    overlay: 1e3,
    menu: 1e3,
    tooltip: 1100
  },
  theme: void 0,
  unstyled: !1,
  pt: void 0,
  ptOptions: {
    mergeSections: !0,
    mergeProps: !1
  },
  csp: {
    nonce: void 0
  }
}, Dd = Symbol();
function Hd(e, t) {
  var r = {
    config: qr(t)
  };
  return e.config.globalProperties.$primevue = r, e.provide(Dd, r), Ud(), Kd(e, r), r;
}
var Lt = [];
function Ud() {
  Ve.clear(), Lt.forEach(function(e) {
    return e == null ? void 0 : e();
  }), Lt = [];
}
function Kd(e, t) {
  var r = rt(!1), n = function() {
    var c;
    if (((c = t.config) === null || c === void 0 ? void 0 : c.theme) !== "none" && !Y.isStyleNameLoaded("common")) {
      var u, p, b = ((u = re.getCommonTheme) === null || u === void 0 ? void 0 : u.call(re)) || {}, h = b.primitive, S = b.semantic, x = b.global, T = b.style, v = {
        nonce: (p = t.config) === null || p === void 0 || (p = p.csp) === null || p === void 0 ? void 0 : p.nonce
      };
      re.load(h == null ? void 0 : h.css, Tr({
        name: "primitive-variables"
      }, v)), re.load(S == null ? void 0 : S.css, Tr({
        name: "semantic-variables"
      }, v)), re.load(x == null ? void 0 : x.css, Tr({
        name: "global-variables"
      }, v)), re.loadTheme(Tr({
        name: "global-style"
      }, v), T), Y.setLoadedStyleName("common");
    }
  };
  Ve.on("theme:change", function(l) {
    r.value || (e.config.globalProperties.$primevue.config.theme = l, r.value = !0);
  });
  var o = pt(t.config, function(l, c) {
    zt.emit("config:change", {
      newValue: l,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !0
  }), a = pt(function() {
    return t.config.ripple;
  }, function(l, c) {
    zt.emit("config:ripple:change", {
      newValue: l,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !0
  }), s = pt(function() {
    return t.config.theme;
  }, function(l, c) {
    r.value || Y.setTheme(l), t.config.unstyled || n(), r.value = !1, zt.emit("config:theme:change", {
      newValue: l,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !0
  }), i = pt(function() {
    return t.config.unstyled;
  }, function(l, c) {
    !l && t.config.theme && n(), zt.emit("config:unstyled:change", {
      newValue: l,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !0
  });
  Lt.push(o), Lt.push(a), Lt.push(s), Lt.push(i);
}
var Wd = {
  install: function(t, r) {
    var n = Pl(Vd, r);
    Hd(t, n);
  }
};
const Ps = Symbol("FrontendSDK"), Gd = (e, t) => {
  e.provide(Ps, t);
}, qd = () => er(Ps);
var ft = {
  _loadedStyleNames: /* @__PURE__ */ new Set(),
  getLoadedStyleNames: function() {
    return this._loadedStyleNames;
  },
  isStyleNameLoaded: function(t) {
    return this._loadedStyleNames.has(t);
  },
  setLoadedStyleName: function(t) {
    this._loadedStyleNames.add(t);
  },
  deleteLoadedStyleName: function(t) {
    this._loadedStyleNames.delete(t);
  },
  clearLoadedStyleNames: function() {
    this._loadedStyleNames.clear();
  }
}, oa = re.extend({
  name: "common"
});
function ur(e) {
  "@babel/helpers - typeof";
  return ur = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ur(e);
}
function Yd(e) {
  return js(e) || Jd(e) || As(e) || Os();
}
function Jd(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Pr(e, t) {
  return js(e) || Qd(e, t) || As(e, t) || Os();
}
function Os() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function As(e, t) {
  if (e) {
    if (typeof e == "string") return aa(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? aa(e, t) : void 0;
  }
}
function aa(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Qd(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, a, s, i = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t === 0) {
        if (Object(r) !== r) return;
        l = !1;
      } else for (; !(l = (n = a.call(r)).done) && (i.push(n.value), i.length !== t); l = !0) ;
    } catch (u) {
      c = !0, o = u;
    } finally {
      try {
        if (!l && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (c) throw o;
      }
    }
    return i;
  }
}
function js(e) {
  if (Array.isArray(e)) return e;
}
function sa(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function V(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? sa(Object(r), !0).forEach(function(n) {
      Gt(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : sa(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Gt(e, t, r) {
  return (t = Zd(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Zd(e) {
  var t = Xd(e, "string");
  return ur(t) == "symbol" ? t : t + "";
}
function Xd(e, t) {
  if (ur(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ur(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Zn = {
  name: "BaseComponent",
  props: {
    pt: {
      type: Object,
      default: void 0
    },
    ptOptions: {
      type: Object,
      default: void 0
    },
    unstyled: {
      type: Boolean,
      default: void 0
    },
    dt: {
      type: Object,
      default: void 0
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    }
  },
  watch: {
    isUnstyled: {
      immediate: !0,
      handler: function(t) {
        t || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(t) {
        var r = this;
        t ? (this._loadScopedThemeStyles(t), this._themeChangeListener(function() {
          return r._loadScopedThemeStyles(t);
        })) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var t, r, n, o, a, s, i, l, c, u, p, b = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, h = b ? (r = this.pt) === null || r === void 0 || (r = r.originalValue) === null || r === void 0 ? void 0 : r[this.$.type.name] : void 0, S = b ? (n = this.pt) === null || n === void 0 || (n = n.value) === null || n === void 0 ? void 0 : n[this.$.type.name] : this.pt;
    (o = S || h) === null || o === void 0 || (o = o.hooks) === null || o === void 0 || (a = o.onBeforeCreate) === null || a === void 0 || a.call(o);
    var x = (s = this.$primevueConfig) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s._usept, T = x ? (i = this.$primevue) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.pt) === null || i === void 0 ? void 0 : i.originalValue : void 0, v = x ? (l = this.$primevue) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l.value : (c = this.$primevue) === null || c === void 0 || (c = c.config) === null || c === void 0 ? void 0 : c.pt;
    (u = v || T) === null || u === void 0 || (u = u[this.$.type.name]) === null || u === void 0 || (u = u.hooks) === null || u === void 0 || (p = u.onBeforeCreate) === null || p === void 0 || p.call(u), this.$attrSelector = ka("pc");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    this.rootEl = Hl(this.$el, '[data-pc-name="'.concat(De(this.$.type.name), '"]')), this.rootEl && (this.$attrSelector && !this.rootEl.hasAttribute(this.$attrSelector) && this.rootEl.setAttribute(this.$attrSelector, ""), this.rootEl.$pc = V({
      name: this.$.type.name,
      attrSelector: this.$attrSelector
    }, this.$params)), this._loadStyles(), this._hook("onBeforeMount");
  },
  mounted: function() {
    this._hook("onMounted");
  },
  beforeUpdate: function() {
    this._hook("onBeforeUpdate");
  },
  updated: function() {
    this._hook("onUpdated");
  },
  beforeUnmount: function() {
    this._hook("onBeforeUnmount");
  },
  unmounted: function() {
    this._unloadScopedThemeStyles(), this._hook("onUnmounted");
  },
  methods: {
    _hook: function(t) {
      if (!this.$options.hostName) {
        var r = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(t)), n = this._useDefaultPT(this._getOptionValue, "hooks.".concat(t));
        r == null || r(), n == null || n();
      }
    },
    _mergeProps: function(t) {
      for (var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++)
        n[o - 1] = arguments[o];
      return On(t) ? t.apply(void 0, n) : Oe.apply(void 0, n);
    },
    _loadStyles: function() {
      var t = this, r = function() {
        ft.isStyleNameLoaded("base") || (re.loadCSS(t.$styleOptions), t._loadGlobalStyles(), ft.setLoadedStyleName("base")), t._loadThemeStyles();
      };
      r(), this._themeChangeListener(r);
    },
    _loadCoreStyles: function() {
      var t, r;
      !ft.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (r = this.$style) !== null && r !== void 0 && r.name && (oa.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), ft.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      Z(t) && re.load(t, V({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, r;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!Y.isStyleNameLoaded("common")) {
          var n, o, a = ((n = this.$style) === null || n === void 0 || (o = n.getCommonTheme) === null || o === void 0 ? void 0 : o.call(n)) || {}, s = a.primitive, i = a.semantic, l = a.global, c = a.style;
          re.load(s == null ? void 0 : s.css, V({
            name: "primitive-variables"
          }, this.$styleOptions)), re.load(i == null ? void 0 : i.css, V({
            name: "semantic-variables"
          }, this.$styleOptions)), re.load(l == null ? void 0 : l.css, V({
            name: "global-variables"
          }, this.$styleOptions)), re.loadTheme(V({
            name: "global-style"
          }, this.$styleOptions), c), Y.setLoadedStyleName("common");
        }
        if (!Y.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (r = this.$style) !== null && r !== void 0 && r.name) {
          var u, p, b, h, S = ((u = this.$style) === null || u === void 0 || (p = u.getComponentTheme) === null || p === void 0 ? void 0 : p.call(u)) || {}, x = S.css, T = S.style;
          (b = this.$style) === null || b === void 0 || b.load(x, V({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (h = this.$style) === null || h === void 0 || h.loadTheme(V({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), T), Y.setLoadedStyleName(this.$style.name);
        }
        if (!Y.isStyleNameLoaded("layer-order")) {
          var v, O, m = (v = this.$style) === null || v === void 0 || (O = v.getLayerOrderThemeCSS) === null || O === void 0 ? void 0 : O.call(v);
          re.load(m, V({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), Y.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var r, n, o, a = ((r = this.$style) === null || r === void 0 || (n = r.getPresetTheme) === null || n === void 0 ? void 0 : n.call(r, t, "[".concat(this.$attrSelector, "]"))) || {}, s = a.css, i = (o = this.$style) === null || o === void 0 ? void 0 : o.load(s, V({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = i.el;
    },
    _unloadScopedThemeStyles: function() {
      var t;
      (t = this.scopedStyleEl) === null || t === void 0 || (t = t.value) === null || t === void 0 || t.remove();
    },
    _themeChangeListener: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      ft.clearLoadedStyleNames(), Ve.on("theme:change", t);
    },
    _getHostInstance: function(t) {
      return t ? this.$options.hostName ? t.$.type.name === this.$options.hostName ? t : this._getHostInstance(t.$parentInstance) : t.$parentInstance : void 0;
    },
    _getPropValue: function(t) {
      var r;
      return this[t] || ((r = this._getHostInstance(this)) === null || r === void 0 ? void 0 : r[t]);
    },
    _getOptionValue: function(t) {
      var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return An(t, r, n);
    },
    _getPTValue: function() {
      var t, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, s = /./g.test(n) && !!o[n.split(".")[0]], i = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, l = i.mergeSections, c = l === void 0 ? !0 : l, u = i.mergeProps, p = u === void 0 ? !1 : u, b = a ? s ? this._useGlobalPT(this._getPTClassValue, n, o) : this._useDefaultPT(this._getPTClassValue, n, o) : void 0, h = s ? void 0 : this._getPTSelf(r, this._getPTClassValue, n, V(V({}, o), {}, {
        global: b || {}
      })), S = this._getPTDatasets(n);
      return c || !c && h ? p ? this._mergeProps(p, b, h, S) : V(V(V({}, b), h), S) : V(V({}, h), S);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++)
        n[o - 1] = arguments[o];
      return Oe(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(n)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(n))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, r, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = "data-pc-", a = n === "root" && Z((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return n !== "transition" && V(V({}, n === "root" && V(V(Gt({}, "".concat(o, "name"), De(a ? (r = this.pt) === null || r === void 0 ? void 0 : r["data-pc-section"] : this.$.type.name)), a && Gt({}, "".concat(o, "extend"), De(this.$.type.name))), xa() && Gt({}, "".concat(this.$attrSelector), ""))), {}, Gt({}, "".concat(o, "section"), De(n)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return Se(t) || Br(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var r = this, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, a = function(i) {
        var l, c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, u = o ? o(i) : i, p = De(n), b = De(r.$name);
        return (l = c ? p !== b ? u == null ? void 0 : u[p] : void 0 : u == null ? void 0 : u[p]) !== null && l !== void 0 ? l : u;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: a(t.originalValue),
        value: a(t.value)
      } : a(t, !0);
    },
    _usePT: function(t, r, n, o) {
      var a = function(x) {
        return r(x, n, o);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var s, i = t._usept || ((s = this.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, l = i.mergeSections, c = l === void 0 ? !0 : l, u = i.mergeProps, p = u === void 0 ? !1 : u, b = a(t.originalValue), h = a(t.value);
        return b === void 0 && h === void 0 ? void 0 : Se(h) ? h : Se(b) ? b : c || !c && h ? p ? this._mergeProps(p, b, h) : V(V({}, b), h) : h;
      }
      return a(t);
    },
    _useGlobalPT: function(t, r, n) {
      return this._usePT(this.globalPT, t, r, n);
    },
    _useDefaultPT: function(t, r, n) {
      return this._usePT(this.defaultPT, t, r, n);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, V(V({}, this.$params), r));
    },
    ptmi: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return Oe(this.$_attrsWithoutPT, this.ptm(t, r));
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, r, V({
        instance: this
      }, n), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, V(V({}, this.$params), r));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (r) {
        var o = this._getOptionValue(this.$style.inlineStyles, t, V(V({}, this.$params), n)), a = this._getOptionValue(oa.inlineStyles, t, V(V({}, this.$params), n));
        return [a, o];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, r = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(n) {
        return Ee(n, {
          instance: r
        });
      });
    },
    defaultPT: function() {
      var t, r = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(n) {
        return r._getOptionValue(n, r.$name, V({}, r.$params)) || Ee(n, V({}, r.$params));
      });
    },
    isUnstyled: function() {
      var t;
      return this.unstyled !== void 0 ? this.unstyled : (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.unstyled;
    },
    $theme: function() {
      var t;
      return (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.theme;
    },
    $style: function() {
      return V(V({
        classes: void 0,
        inlineStyles: void 0,
        load: function() {
        },
        loadCSS: function() {
        },
        loadTheme: function() {
        }
      }, (this._getHostInstance(this) || {}).$style), this.$options.style);
    },
    $styleOptions: function() {
      var t;
      return {
        nonce: (t = this.$primevueConfig) === null || t === void 0 || (t = t.csp) === null || t === void 0 ? void 0 : t.nonce
      };
    },
    $primevueConfig: function() {
      var t;
      return (t = this.$primevue) === null || t === void 0 ? void 0 : t.config;
    },
    $name: function() {
      return this.$options.hostName || this.$.type.name;
    },
    $params: function() {
      var t = this._getHostInstance(this) || this.$parent;
      return {
        instance: this,
        props: this.$props,
        state: this.$data,
        attrs: this.$attrs,
        parent: {
          instance: t,
          props: t == null ? void 0 : t.$props,
          state: t == null ? void 0 : t.$data,
          attrs: t == null ? void 0 : t.$attrs
        }
      };
    },
    $_attrsPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var r = Pr(t, 1), n = r[0];
        return n == null ? void 0 : n.startsWith("pt:");
      }).reduce(function(t, r) {
        var n = Pr(r, 2), o = n[0], a = n[1], s = o.split(":"), i = Yd(s), l = i.slice(1);
        return l == null || l.reduce(function(c, u, p, b) {
          return !c[u] && (c[u] = p === b.length - 1 ? a : {}), c[u];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var r = Pr(t, 1), n = r[0];
        return !(n != null && n.startsWith("pt:"));
      }).reduce(function(t, r) {
        var n = Pr(r, 2), o = n[0], a = n[1];
        return t[o] = a, t;
      }, {});
    }
  }
}, ef = `
.p-icon {
    display: inline-block;
    vertical-align: baseline;
}

.p-icon-spin {
    -webkit-animation: p-icon-spin 2s infinite linear;
    animation: p-icon-spin 2s infinite linear;
}

@-webkit-keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`, tf = re.extend({
  name: "baseicon",
  css: ef
});
function dr(e) {
  "@babel/helpers - typeof";
  return dr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, dr(e);
}
function ia(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function la(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ia(Object(r), !0).forEach(function(n) {
      rf(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ia(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function rf(e, t, r) {
  return (t = nf(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function nf(e) {
  var t = of(e, "string");
  return dr(t) == "symbol" ? t : t + "";
}
function of(e, t) {
  if (dr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (dr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var af = {
  name: "BaseIcon",
  extends: Zn,
  props: {
    label: {
      type: String,
      default: void 0
    },
    spin: {
      type: Boolean,
      default: !1
    }
  },
  style: tf,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var t = Pt(this.label);
      return la(la({}, !this.isUnstyled && {
        class: ["p-icon", {
          "p-icon-spin": this.spin
        }]
      }), {}, {
        role: t ? void 0 : "img",
        "aria-label": t ? void 0 : this.label,
        "aria-hidden": t
      });
    }
  }
}, Is = {
  name: "SpinnerIcon",
  extends: af
};
function sf(e, t, r, n, o, a) {
  return J(), oe("svg", Oe({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), t[0] || (t[0] = [L("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)]), 16);
}
Is.render = sf;
var lf = function(t) {
  var r = t.dt;
  return `
.p-badge {
    display: inline-flex;
    border-radius: `.concat(r("badge.border.radius"), `;
    align-items: center;
    justify-content: center;
    padding: `).concat(r("badge.padding"), `;
    background: `).concat(r("badge.primary.background"), `;
    color: `).concat(r("badge.primary.color"), `;
    font-size: `).concat(r("badge.font.size"), `;
    font-weight: `).concat(r("badge.font.weight"), `;
    min-width: `).concat(r("badge.min.width"), `;
    height: `).concat(r("badge.height"), `;
}

.p-badge-dot {
    width: `).concat(r("badge.dot.size"), `;
    min-width: `).concat(r("badge.dot.size"), `;
    height: `).concat(r("badge.dot.size"), `;
    border-radius: 50%;
    padding: 0;
}

.p-badge-circle {
    padding: 0;
    border-radius: 50%;
}

.p-badge-secondary {
    background: `).concat(r("badge.secondary.background"), `;
    color: `).concat(r("badge.secondary.color"), `;
}

.p-badge-success {
    background: `).concat(r("badge.success.background"), `;
    color: `).concat(r("badge.success.color"), `;
}

.p-badge-info {
    background: `).concat(r("badge.info.background"), `;
    color: `).concat(r("badge.info.color"), `;
}

.p-badge-warn {
    background: `).concat(r("badge.warn.background"), `;
    color: `).concat(r("badge.warn.color"), `;
}

.p-badge-danger {
    background: `).concat(r("badge.danger.background"), `;
    color: `).concat(r("badge.danger.color"), `;
}

.p-badge-contrast {
    background: `).concat(r("badge.contrast.background"), `;
    color: `).concat(r("badge.contrast.color"), `;
}

.p-badge-sm {
    font-size: `).concat(r("badge.sm.font.size"), `;
    min-width: `).concat(r("badge.sm.min.width"), `;
    height: `).concat(r("badge.sm.height"), `;
}

.p-badge-lg {
    font-size: `).concat(r("badge.lg.font.size"), `;
    min-width: `).concat(r("badge.lg.min.width"), `;
    height: `).concat(r("badge.lg.height"), `;
}

.p-badge-xl {
    font-size: `).concat(r("badge.xl.font.size"), `;
    min-width: `).concat(r("badge.xl.min.width"), `;
    height: `).concat(r("badge.xl.height"), `;
}
`);
}, cf = {
  root: function(t) {
    var r = t.props, n = t.instance;
    return ["p-badge p-component", {
      "p-badge-circle": Z(r.value) && String(r.value).length === 1,
      "p-badge-dot": Pt(r.value) && !n.$slots.default,
      "p-badge-sm": r.size === "small",
      "p-badge-lg": r.size === "large",
      "p-badge-xl": r.size === "xlarge",
      "p-badge-info": r.severity === "info",
      "p-badge-success": r.severity === "success",
      "p-badge-warn": r.severity === "warn",
      "p-badge-danger": r.severity === "danger",
      "p-badge-secondary": r.severity === "secondary",
      "p-badge-contrast": r.severity === "contrast"
    }];
  }
}, uf = re.extend({
  name: "badge",
  theme: lf,
  classes: cf
}), df = {
  name: "BaseBadge",
  extends: Zn,
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    severity: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    }
  },
  style: uf,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
}, zs = {
  name: "Badge",
  extends: df,
  inheritAttrs: !1
};
function ff(e, t, r, n, o, a) {
  return J(), oe("span", Oe({
    class: e.cx("root")
  }, e.ptmi("root")), [Ut(e.$slots, "default", {}, function() {
    return [Rr(ee(e.value), 1)];
  })], 16);
}
zs.render = ff;
function fr(e) {
  "@babel/helpers - typeof";
  return fr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, fr(e);
}
function ca(e, t) {
  return hf(e) || gf(e, t) || bf(e, t) || pf();
}
function pf() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function bf(e, t) {
  if (e) {
    if (typeof e == "string") return ua(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? ua(e, t) : void 0;
  }
}
function ua(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function gf(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, a, s, i = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (i.push(n.value), i.length !== t); l = !0) ;
    } catch (u) {
      c = !0, o = u;
    } finally {
      try {
        if (!l && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (c) throw o;
      }
    }
    return i;
  }
}
function hf(e) {
  if (Array.isArray(e)) return e;
}
function da(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function U(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? da(Object(r), !0).forEach(function(n) {
      $n(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : da(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function $n(e, t, r) {
  return (t = mf(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function mf(e) {
  var t = vf(e, "string");
  return fr(t) == "symbol" ? t : t + "";
}
function vf(e, t) {
  if (fr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (fr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var F = {
  _getMeta: function() {
    return [Ze(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], Ee(Ze(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, r) {
    var n, o, a;
    return (n = (t == null || (o = t.instance) === null || o === void 0 ? void 0 : o.$primevue) || (r == null || (a = r.ctx) === null || a === void 0 || (a = a.appContext) === null || a === void 0 || (a = a.config) === null || a === void 0 || (a = a.globalProperties) === null || a === void 0 ? void 0 : a.$primevue)) === null || n === void 0 ? void 0 : n.config;
  },
  _getOptionValue: An,
  _getPTValue: function() {
    var t, r, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, l = function() {
      var O = F._getOptionValue.apply(F, arguments);
      return Se(O) || Br(O) ? {
        class: O
      } : O;
    }, c = ((t = n.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((r = n.$primevueConfig) === null || r === void 0 ? void 0 : r.ptOptions) || {}, u = c.mergeSections, p = u === void 0 ? !0 : u, b = c.mergeProps, h = b === void 0 ? !1 : b, S = i ? F._useDefaultPT(n, n.defaultPT(), l, a, s) : void 0, x = F._usePT(n, F._getPT(o, n.$name), l, a, U(U({}, s), {}, {
      global: S || {}
    })), T = F._getPTDatasets(n, a);
    return p || !p && x ? h ? F._mergeProps(n, h, S, x, T) : U(U(U({}, S), x), T) : U(U({}, x), T);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", n = "data-pc-";
    return U(U({}, r === "root" && $n({}, "".concat(n, "name"), De(t.$name))), {}, $n({}, "".concat(n, "section"), De(r)));
  },
  _getPT: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", n = arguments.length > 2 ? arguments[2] : void 0, o = function(s) {
      var i, l = n ? n(s) : s, c = De(r);
      return (i = l == null ? void 0 : l[c]) !== null && i !== void 0 ? i : l;
    };
    return t != null && t.hasOwnProperty("_usept") ? {
      _usept: t._usept,
      originalValue: o(t.originalValue),
      value: o(t.value)
    } : o(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, a = arguments.length > 4 ? arguments[4] : void 0, s = function(T) {
      return n(T, o, a);
    };
    if (r != null && r.hasOwnProperty("_usept")) {
      var i, l = r._usept || ((i = t.$primevueConfig) === null || i === void 0 ? void 0 : i.ptOptions) || {}, c = l.mergeSections, u = c === void 0 ? !0 : c, p = l.mergeProps, b = p === void 0 ? !1 : p, h = s(r.originalValue), S = s(r.value);
      return h === void 0 && S === void 0 ? void 0 : Se(S) ? S : Se(h) ? h : u || !u && S ? b ? F._mergeProps(t, b, h, S) : U(U({}, h), S) : S;
    }
    return s(r);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, a = arguments.length > 4 ? arguments[4] : void 0;
    return F._usePT(t, r, n, o, a);
  },
  _loadStyles: function(t, r, n) {
    var o, a = F._getConfig(r, n), s = {
      nonce: a == null || (o = a.csp) === null || o === void 0 ? void 0 : o.nonce
    };
    F._loadCoreStyles(t.$instance, s), F._loadThemeStyles(t.$instance, s), F._loadScopedThemeStyles(t.$instance, s), F._themeChangeListener(function() {
      return F._loadThemeStyles(t.$instance, s);
    });
  },
  _loadCoreStyles: function() {
    var t, r, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!ft.isStyleNameLoaded((t = n.$style) === null || t === void 0 ? void 0 : t.name) && (r = n.$style) !== null && r !== void 0 && r.name) {
      var a;
      re.loadCSS(o), (a = n.$style) === null || a === void 0 || a.loadCSS(o), ft.setLoadedStyleName(n.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, r, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, a = arguments.length > 1 ? arguments[1] : void 0;
    if (!(o != null && o.isUnstyled() || (o == null || (t = o.theme) === null || t === void 0 ? void 0 : t.call(o)) === "none")) {
      if (!Y.isStyleNameLoaded("common")) {
        var s, i, l = ((s = o.$style) === null || s === void 0 || (i = s.getCommonTheme) === null || i === void 0 ? void 0 : i.call(s)) || {}, c = l.primitive, u = l.semantic, p = l.global, b = l.style;
        re.load(c == null ? void 0 : c.css, U({
          name: "primitive-variables"
        }, a)), re.load(u == null ? void 0 : u.css, U({
          name: "semantic-variables"
        }, a)), re.load(p == null ? void 0 : p.css, U({
          name: "global-variables"
        }, a)), re.loadTheme(U({
          name: "global-style"
        }, a), b), Y.setLoadedStyleName("common");
      }
      if (!Y.isStyleNameLoaded((r = o.$style) === null || r === void 0 ? void 0 : r.name) && (n = o.$style) !== null && n !== void 0 && n.name) {
        var h, S, x, T, v = ((h = o.$style) === null || h === void 0 || (S = h.getDirectiveTheme) === null || S === void 0 ? void 0 : S.call(h)) || {}, O = v.css, m = v.style;
        (x = o.$style) === null || x === void 0 || x.load(O, U({
          name: "".concat(o.$style.name, "-variables")
        }, a)), (T = o.$style) === null || T === void 0 || T.loadTheme(U({
          name: "".concat(o.$style.name, "-style")
        }, a), m), Y.setLoadedStyleName(o.$style.name);
      }
      if (!Y.isStyleNameLoaded("layer-order")) {
        var A, D, E = (A = o.$style) === null || A === void 0 || (D = A.getLayerOrderThemeCSS) === null || D === void 0 ? void 0 : D.call(A);
        re.load(E, U({
          name: "layer-order",
          first: !0
        }, a)), Y.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, n = t.preset();
    if (n && t.$attrSelector) {
      var o, a, s, i = ((o = t.$style) === null || o === void 0 || (a = o.getPresetTheme) === null || a === void 0 ? void 0 : a.call(o, n, "[".concat(t.$attrSelector, "]"))) || {}, l = i.css, c = (s = t.$style) === null || s === void 0 ? void 0 : s.load(l, U({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, r));
      t.scopedStyleEl = c.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    ft.clearLoadedStyleNames(), Ve.on("theme:change", t);
  },
  _hook: function(t, r, n, o, a, s) {
    var i, l, c = "on".concat(Ol(r)), u = F._getConfig(o, a), p = n == null ? void 0 : n.$instance, b = F._usePT(p, F._getPT(o == null || (i = o.value) === null || i === void 0 ? void 0 : i.pt, t), F._getOptionValue, "hooks.".concat(c)), h = F._useDefaultPT(p, u == null || (l = u.pt) === null || l === void 0 || (l = l.directives) === null || l === void 0 ? void 0 : l[t], F._getOptionValue, "hooks.".concat(c)), S = {
      el: n,
      binding: o,
      vnode: a,
      prevVnode: s
    };
    b == null || b(p, S), h == null || h(p, S);
  },
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length, n = new Array(r > 2 ? r - 2 : 0), o = 2; o < r; o++)
      n[o - 2] = arguments[o];
    return On(t) ? t.apply(void 0, n) : Oe.apply(void 0, n);
  },
  _extend: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = function(s, i, l, c, u) {
      var p, b, h, S;
      i._$instances = i._$instances || {};
      var x = F._getConfig(l, c), T = i._$instances[t] || {}, v = Pt(T) ? U(U({}, r), r == null ? void 0 : r.methods) : {};
      i._$instances[t] = U(U({}, T), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: i,
        $binding: l,
        $modifiers: l == null ? void 0 : l.modifiers,
        $value: l == null ? void 0 : l.value,
        $el: T.$el || i || void 0,
        $style: U({
          classes: void 0,
          inlineStyles: void 0,
          load: function() {
          },
          loadCSS: function() {
          },
          loadTheme: function() {
          }
        }, r == null ? void 0 : r.style),
        $primevueConfig: x,
        $attrSelector: (p = i.$pd) === null || p === void 0 || (p = p[t]) === null || p === void 0 ? void 0 : p.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return F._getPT(x == null ? void 0 : x.pt, void 0, function(m) {
            var A;
            return m == null || (A = m.directives) === null || A === void 0 ? void 0 : A[t];
          });
        },
        isUnstyled: function() {
          var m, A;
          return ((m = i.$instance) === null || m === void 0 || (m = m.$binding) === null || m === void 0 || (m = m.value) === null || m === void 0 ? void 0 : m.unstyled) !== void 0 ? (A = i.$instance) === null || A === void 0 || (A = A.$binding) === null || A === void 0 || (A = A.value) === null || A === void 0 ? void 0 : A.unstyled : x == null ? void 0 : x.unstyled;
        },
        theme: function() {
          var m;
          return (m = i.$instance) === null || m === void 0 || (m = m.$primevueConfig) === null || m === void 0 ? void 0 : m.theme;
        },
        preset: function() {
          var m;
          return (m = i.$instance) === null || m === void 0 || (m = m.$binding) === null || m === void 0 || (m = m.value) === null || m === void 0 ? void 0 : m.dt;
        },
        /* instance's methods */
        ptm: function() {
          var m, A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", D = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return F._getPTValue(i.$instance, (m = i.$instance) === null || m === void 0 || (m = m.$binding) === null || m === void 0 || (m = m.value) === null || m === void 0 ? void 0 : m.pt, A, U({}, D));
        },
        ptmo: function() {
          var m = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", D = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return F._getPTValue(i.$instance, m, A, D, !1);
        },
        cx: function() {
          var m, A, D = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", E = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (m = i.$instance) !== null && m !== void 0 && m.isUnstyled() ? void 0 : F._getOptionValue((A = i.$instance) === null || A === void 0 || (A = A.$style) === null || A === void 0 ? void 0 : A.classes, D, U({}, E));
        },
        sx: function() {
          var m, A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", D = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, E = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return D ? F._getOptionValue((m = i.$instance) === null || m === void 0 || (m = m.$style) === null || m === void 0 ? void 0 : m.inlineStyles, A, U({}, E)) : void 0;
        }
      }, v), i.$instance = i._$instances[t], (b = (h = i.$instance)[s]) === null || b === void 0 || b.call(h, i, l, c, u), i["$".concat(t)] = i.$instance, F._hook(t, s, i, l, c, u), i.$pd || (i.$pd = {}), i.$pd[t] = U(U({}, (S = i.$pd) === null || S === void 0 ? void 0 : S[t]), {}, {
        name: t,
        instance: i.$instance
      });
    }, o = function(s) {
      var i, l, c, u, p, b = (i = s.$instance) === null || i === void 0 ? void 0 : i.watch;
      b == null || (l = b.config) === null || l === void 0 || l.call(s.$instance, (c = s.$instance) === null || c === void 0 ? void 0 : c.$primevueConfig), zt.on("config:change", function(h) {
        var S, x = h.newValue, T = h.oldValue;
        return b == null || (S = b.config) === null || S === void 0 ? void 0 : S.call(s.$instance, x, T);
      }), b == null || (u = b["config.ripple"]) === null || u === void 0 || u.call(s.$instance, (p = s.$instance) === null || p === void 0 || (p = p.$primevueConfig) === null || p === void 0 ? void 0 : p.ripple), zt.on("config:ripple:change", function(h) {
        var S, x = h.newValue, T = h.oldValue;
        return b == null || (S = b["config.ripple"]) === null || S === void 0 ? void 0 : S.call(s.$instance, x, T);
      });
    };
    return {
      created: function(s, i, l, c) {
        s.$pd || (s.$pd = {}), s.$pd[t] = {
          name: t,
          attrSelector: ka("pd")
        }, n("created", s, i, l, c);
      },
      beforeMount: function(s, i, l, c) {
        F._loadStyles(s, i, l), n("beforeMount", s, i, l, c), o(s);
      },
      mounted: function(s, i, l, c) {
        F._loadStyles(s, i, l), n("mounted", s, i, l, c);
      },
      beforeUpdate: function(s, i, l, c) {
        n("beforeUpdate", s, i, l, c);
      },
      updated: function(s, i, l, c) {
        F._loadStyles(s, i, l), n("updated", s, i, l, c);
      },
      beforeUnmount: function(s, i, l, c) {
        n("beforeUnmount", s, i, l, c);
      },
      unmounted: function(s, i, l, c) {
        var u;
        (u = s.$instance) === null || u === void 0 || (u = u.scopedStyleEl) === null || u === void 0 || (u = u.value) === null || u === void 0 || u.remove(), n("unmounted", s, i, l, c);
      }
    };
  },
  extend: function() {
    var t = F._getMeta.apply(F, arguments), r = ca(t, 2), n = r[0], o = r[1];
    return U({
      extend: function() {
        var s = F._getMeta.apply(F, arguments), i = ca(s, 2), l = i[0], c = i[1];
        return F.extend(l, U(U(U({}, o), o == null ? void 0 : o.methods), c));
      }
    }, F._extend(n, o));
  }
}, yf = function(t) {
  var r = t.dt;
  return `
.p-ink {
    display: block;
    position: absolute;
    background: `.concat(r("ripple.background"), `;
    border-radius: 100%;
    transform: scale(0);
    pointer-events: none;
}

.p-ink-active {
    animation: ripple 0.4s linear;
}

@keyframes ripple {
    100% {
        opacity: 0;
        transform: scale(2.5);
    }
}
`);
}, xf = {
  root: "p-ink"
}, kf = re.extend({
  name: "ripple-directive",
  theme: yf,
  classes: xf
}), wf = F.extend({
  style: kf
});
function pr(e) {
  "@babel/helpers - typeof";
  return pr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, pr(e);
}
function _f(e) {
  return Tf(e) || $f(e) || Cf(e) || Sf();
}
function Sf() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Cf(e, t) {
  if (e) {
    if (typeof e == "string") return Tn(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Tn(e, t) : void 0;
  }
}
function $f(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Tf(e) {
  if (Array.isArray(e)) return Tn(e);
}
function Tn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function fa(e, t, r) {
  return (t = Pf(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Pf(e) {
  var t = Of(e, "string");
  return pr(t) == "symbol" ? t : t + "";
}
function Of(e, t) {
  if (pr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (pr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Af = wf.extend("ripple", {
  watch: {
    "config.ripple": function(t) {
      t ? (this.createRipple(this.$host), this.bindEvents(this.$host), this.$host.setAttribute("data-pd-ripple", !0), this.$host.style.overflow = "hidden", this.$host.style.position = "relative") : (this.remove(this.$host), this.$host.removeAttribute("data-pd-ripple"));
    }
  },
  unmounted: function(t) {
    this.remove(t);
  },
  timeout: void 0,
  methods: {
    bindEvents: function(t) {
      t.addEventListener("mousedown", this.onMouseDown.bind(this));
    },
    unbindEvents: function(t) {
      t.removeEventListener("mousedown", this.onMouseDown.bind(this));
    },
    createRipple: function(t) {
      var r = Dl("span", fa(fa({
        role: "presentation",
        "aria-hidden": !0,
        "data-p-ink": !0,
        "data-p-ink-active": !1,
        class: !this.isUnstyled() && this.cx("root"),
        onAnimationEnd: this.onAnimationEnd.bind(this)
      }, this.$attrSelector, ""), "p-bind", this.ptm("root")));
      t.appendChild(r), this.$el = r;
    },
    remove: function(t) {
      var r = this.getInk(t);
      r && (this.$host.style.overflow = "", this.$host.style.position = "", this.unbindEvents(t), r.removeEventListener("animationend", this.onAnimationEnd), r.remove());
    },
    onMouseDown: function(t) {
      var r = this, n = t.currentTarget, o = this.getInk(n);
      if (!(!o || getComputedStyle(o, null).display === "none")) {
        if (!this.isUnstyled() && rn(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"), !go(o) && !ho(o)) {
          var a = Math.max(Vl(n), Gl(n));
          o.style.height = a + "px", o.style.width = a + "px";
        }
        var s = Wl(n), i = t.pageX - s.left + document.body.scrollTop - ho(o) / 2, l = t.pageY - s.top + document.body.scrollLeft - go(o) / 2;
        o.style.top = l + "px", o.style.left = i + "px", !this.isUnstyled() && Bl(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          o && (!r.isUnstyled() && rn(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && rn(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? _f(t.children).find(function(r) {
        return Ul(r, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
function br(e) {
  "@babel/helpers - typeof";
  return br = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, br(e);
}
function Ye(e, t, r) {
  return (t = jf(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function jf(e) {
  var t = If(e, "string");
  return br(t) == "symbol" ? t : t + "";
}
function If(e, t) {
  if (br(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (br(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var zf = function(t) {
  var r = t.dt;
  return `
.p-button {
    display: inline-flex;
    cursor: pointer;
    user-select: none;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    color: `.concat(r("button.primary.color"), `;
    background: `).concat(r("button.primary.background"), `;
    border: 1px solid `).concat(r("button.primary.border.color"), `;
    padding: `).concat(r("button.padding.y"), " ").concat(r("button.padding.x"), `;
    font-size: 1rem;
    font-family: inherit;
    font-feature-settings: inherit;
    transition: background `).concat(r("button.transition.duration"), ", color ").concat(r("button.transition.duration"), ", border-color ").concat(r("button.transition.duration"), `,
            outline-color `).concat(r("button.transition.duration"), ", box-shadow ").concat(r("button.transition.duration"), `;
    border-radius: `).concat(r("button.border.radius"), `;
    outline-color: transparent;
    gap: `).concat(r("button.gap"), `;
}

.p-button:disabled {
    cursor: default;
}

.p-button-icon-right {
    order: 1;
}

.p-button-icon-bottom {
    order: 2;
}

.p-button-icon-only {
    width: `).concat(r("button.icon.only.width"), `;
    padding-left: 0;
    padding-right: 0;
    gap: 0;
}

.p-button-icon-only.p-button-rounded {
    border-radius: 50%;
    height: `).concat(r("button.icon.only.width"), `;
}

.p-button-icon-only .p-button-label {
    visibility: hidden;
    width: 0;
}

.p-button-sm {
    font-size: `).concat(r("button.sm.font.size"), `;
    padding: `).concat(r("button.sm.padding.y"), " ").concat(r("button.sm.padding.x"), `;
}

.p-button-sm .p-button-icon {
    font-size: `).concat(r("button.sm.font.size"), `;
}

.p-button-lg {
    font-size: `).concat(r("button.lg.font.size"), `;
    padding: `).concat(r("button.lg.padding.y"), " ").concat(r("button.lg.padding.x"), `;
}

.p-button-lg .p-button-icon {
    font-size: `).concat(r("button.lg.font.size"), `;
}

.p-button-vertical {
    flex-direction: column;
}

.p-button-label {
    font-weight: `).concat(r("button.label.font.weight"), `;
}

.p-button-fluid {
    width: 100%;
}

.p-button-fluid.p-button-icon-only {
    width: `).concat(r("button.icon.only.width"), `;
}

.p-button:not(:disabled):hover {
    background: `).concat(r("button.primary.hover.background"), `;
    border: 1px solid `).concat(r("button.primary.hover.border.color"), `;
    color: `).concat(r("button.primary.hover.color"), `;
}

.p-button:not(:disabled):active {
    background: `).concat(r("button.primary.active.background"), `;
    border: 1px solid `).concat(r("button.primary.active.border.color"), `;
    color: `).concat(r("button.primary.active.color"), `;
}

.p-button:focus-visible {
    box-shadow: `).concat(r("button.primary.focus.ring.shadow"), `;
    outline: `).concat(r("button.focus.ring.width"), " ").concat(r("button.focus.ring.style"), " ").concat(r("button.primary.focus.ring.color"), `;
    outline-offset: `).concat(r("button.focus.ring.offset"), `;
}

.p-button .p-badge {
    min-width: `).concat(r("button.badge.size"), `;
    height: `).concat(r("button.badge.size"), `;
    line-height: `).concat(r("button.badge.size"), `;
}

.p-button-raised {
    box-shadow: `).concat(r("button.raised.shadow"), `;
}

.p-button-rounded {
    border-radius: `).concat(r("button.rounded.border.radius"), `;
}

.p-button-secondary {
    background: `).concat(r("button.secondary.background"), `;
    border: 1px solid `).concat(r("button.secondary.border.color"), `;
    color: `).concat(r("button.secondary.color"), `;
}

.p-button-secondary:not(:disabled):hover {
    background: `).concat(r("button.secondary.hover.background"), `;
    border: 1px solid `).concat(r("button.secondary.hover.border.color"), `;
    color: `).concat(r("button.secondary.hover.color"), `;
}

.p-button-secondary:not(:disabled):active {
    background: `).concat(r("button.secondary.active.background"), `;
    border: 1px solid `).concat(r("button.secondary.active.border.color"), `;
    color: `).concat(r("button.secondary.active.color"), `;
}

.p-button-secondary:focus-visible {
    outline-color: `).concat(r("button.secondary.focus.ring.color"), `;
    box-shadow: `).concat(r("button.secondary.focus.ring.shadow"), `;
}

.p-button-success {
    background: `).concat(r("button.success.background"), `;
    border: 1px solid `).concat(r("button.success.border.color"), `;
    color: `).concat(r("button.success.color"), `;
}

.p-button-success:not(:disabled):hover {
    background: `).concat(r("button.success.hover.background"), `;
    border: 1px solid `).concat(r("button.success.hover.border.color"), `;
    color: `).concat(r("button.success.hover.color"), `;
}

.p-button-success:not(:disabled):active {
    background: `).concat(r("button.success.active.background"), `;
    border: 1px solid `).concat(r("button.success.active.border.color"), `;
    color: `).concat(r("button.success.active.color"), `;
}

.p-button-success:focus-visible {
    outline-color: `).concat(r("button.success.focus.ring.color"), `;
    box-shadow: `).concat(r("button.success.focus.ring.shadow"), `;
}

.p-button-info {
    background: `).concat(r("button.info.background"), `;
    border: 1px solid `).concat(r("button.info.border.color"), `;
    color: `).concat(r("button.info.color"), `;
}

.p-button-info:not(:disabled):hover {
    background: `).concat(r("button.info.hover.background"), `;
    border: 1px solid `).concat(r("button.info.hover.border.color"), `;
    color: `).concat(r("button.info.hover.color"), `;
}

.p-button-info:not(:disabled):active {
    background: `).concat(r("button.info.active.background"), `;
    border: 1px solid `).concat(r("button.info.active.border.color"), `;
    color: `).concat(r("button.info.active.color"), `;
}

.p-button-info:focus-visible {
    outline-color: `).concat(r("button.info.focus.ring.color"), `;
    box-shadow: `).concat(r("button.info.focus.ring.shadow"), `;
}

.p-button-warn {
    background: `).concat(r("button.warn.background"), `;
    border: 1px solid `).concat(r("button.warn.border.color"), `;
    color: `).concat(r("button.warn.color"), `;
}

.p-button-warn:not(:disabled):hover {
    background: `).concat(r("button.warn.hover.background"), `;
    border: 1px solid `).concat(r("button.warn.hover.border.color"), `;
    color: `).concat(r("button.warn.hover.color"), `;
}

.p-button-warn:not(:disabled):active {
    background: `).concat(r("button.warn.active.background"), `;
    border: 1px solid `).concat(r("button.warn.active.border.color"), `;
    color: `).concat(r("button.warn.active.color"), `;
}

.p-button-warn:focus-visible {
    outline-color: `).concat(r("button.warn.focus.ring.color"), `;
    box-shadow: `).concat(r("button.warn.focus.ring.shadow"), `;
}

.p-button-help {
    background: `).concat(r("button.help.background"), `;
    border: 1px solid `).concat(r("button.help.border.color"), `;
    color: `).concat(r("button.help.color"), `;
}

.p-button-help:not(:disabled):hover {
    background: `).concat(r("button.help.hover.background"), `;
    border: 1px solid `).concat(r("button.help.hover.border.color"), `;
    color: `).concat(r("button.help.hover.color"), `;
}

.p-button-help:not(:disabled):active {
    background: `).concat(r("button.help.active.background"), `;
    border: 1px solid `).concat(r("button.help.active.border.color"), `;
    color: `).concat(r("button.help.active.color"), `;
}

.p-button-help:focus-visible {
    outline-color: `).concat(r("button.help.focus.ring.color"), `;
    box-shadow: `).concat(r("button.help.focus.ring.shadow"), `;
}

.p-button-danger {
    background: `).concat(r("button.danger.background"), `;
    border: 1px solid `).concat(r("button.danger.border.color"), `;
    color: `).concat(r("button.danger.color"), `;
}

.p-button-danger:not(:disabled):hover {
    background: `).concat(r("button.danger.hover.background"), `;
    border: 1px solid `).concat(r("button.danger.hover.border.color"), `;
    color: `).concat(r("button.danger.hover.color"), `;
}

.p-button-danger:not(:disabled):active {
    background: `).concat(r("button.danger.active.background"), `;
    border: 1px solid `).concat(r("button.danger.active.border.color"), `;
    color: `).concat(r("button.danger.active.color"), `;
}

.p-button-danger:focus-visible {
    outline-color: `).concat(r("button.danger.focus.ring.color"), `;
    box-shadow: `).concat(r("button.danger.focus.ring.shadow"), `;
}

.p-button-contrast {
    background: `).concat(r("button.contrast.background"), `;
    border: 1px solid `).concat(r("button.contrast.border.color"), `;
    color: `).concat(r("button.contrast.color"), `;
}

.p-button-contrast:not(:disabled):hover {
    background: `).concat(r("button.contrast.hover.background"), `;
    border: 1px solid `).concat(r("button.contrast.hover.border.color"), `;
    color: `).concat(r("button.contrast.hover.color"), `;
}

.p-button-contrast:not(:disabled):active {
    background: `).concat(r("button.contrast.active.background"), `;
    border: 1px solid `).concat(r("button.contrast.active.border.color"), `;
    color: `).concat(r("button.contrast.active.color"), `;
}

.p-button-contrast:focus-visible {
    outline-color: `).concat(r("button.contrast.focus.ring.color"), `;
    box-shadow: `).concat(r("button.contrast.focus.ring.shadow"), `;
}

.p-button-outlined {
    background: transparent;
    border-color: `).concat(r("button.outlined.primary.border.color"), `;
    color: `).concat(r("button.outlined.primary.color"), `;
}

.p-button-outlined:not(:disabled):hover {
    background: `).concat(r("button.outlined.primary.hover.background"), `;
    border-color: `).concat(r("button.outlined.primary.border.color"), `;
    color: `).concat(r("button.outlined.primary.color"), `;
}

.p-button-outlined:not(:disabled):active {
    background: `).concat(r("button.outlined.primary.active.background"), `;
    border-color: `).concat(r("button.outlined.primary.border.color"), `;
    color: `).concat(r("button.outlined.primary.color"), `;
}

.p-button-outlined.p-button-secondary {
    border-color: `).concat(r("button.outlined.secondary.border.color"), `;
    color: `).concat(r("button.outlined.secondary.color"), `;
}

.p-button-outlined.p-button-secondary:not(:disabled):hover {
    background: `).concat(r("button.outlined.secondary.hover.background"), `;
    border-color: `).concat(r("button.outlined.secondary.border.color"), `;
    color: `).concat(r("button.outlined.secondary.color"), `;
}

.p-button-outlined.p-button-secondary:not(:disabled):active {
    background: `).concat(r("button.outlined.secondary.active.background"), `;
    border-color: `).concat(r("button.outlined.secondary.border.color"), `;
    color: `).concat(r("button.outlined.secondary.color"), `;
}

.p-button-outlined.p-button-success {
    border-color: `).concat(r("button.outlined.success.border.color"), `;
    color: `).concat(r("button.outlined.success.color"), `;
}

.p-button-outlined.p-button-success:not(:disabled):hover {
    background: `).concat(r("button.outlined.success.hover.background"), `;
    border-color: `).concat(r("button.outlined.success.border.color"), `;
    color: `).concat(r("button.outlined.success.color"), `;
}

.p-button-outlined.p-button-success:not(:disabled):active {
    background: `).concat(r("button.outlined.success.active.background"), `;
    border-color: `).concat(r("button.outlined.success.border.color"), `;
    color: `).concat(r("button.outlined.success.color"), `;
}

.p-button-outlined.p-button-info {
    border-color: `).concat(r("button.outlined.info.border.color"), `;
    color: `).concat(r("button.outlined.info.color"), `;
}

.p-button-outlined.p-button-info:not(:disabled):hover {
    background: `).concat(r("button.outlined.info.hover.background"), `;
    border-color: `).concat(r("button.outlined.info.border.color"), `;
    color: `).concat(r("button.outlined.info.color"), `;
}

.p-button-outlined.p-button-info:not(:disabled):active {
    background: `).concat(r("button.outlined.info.active.background"), `;
    border-color: `).concat(r("button.outlined.info.border.color"), `;
    color: `).concat(r("button.outlined.info.color"), `;
}

.p-button-outlined.p-button-warn {
    border-color: `).concat(r("button.outlined.warn.border.color"), `;
    color: `).concat(r("button.outlined.warn.color"), `;
}

.p-button-outlined.p-button-warn:not(:disabled):hover {
    background: `).concat(r("button.outlined.warn.hover.background"), `;
    border-color: `).concat(r("button.outlined.warn.border.color"), `;
    color: `).concat(r("button.outlined.warn.color"), `;
}

.p-button-outlined.p-button-warn:not(:disabled):active {
    background: `).concat(r("button.outlined.warn.active.background"), `;
    border-color: `).concat(r("button.outlined.warn.border.color"), `;
    color: `).concat(r("button.outlined.warn.color"), `;
}

.p-button-outlined.p-button-help {
    border-color: `).concat(r("button.outlined.help.border.color"), `;
    color: `).concat(r("button.outlined.help.color"), `;
}

.p-button-outlined.p-button-help:not(:disabled):hover {
    background: `).concat(r("button.outlined.help.hover.background"), `;
    border-color: `).concat(r("button.outlined.help.border.color"), `;
    color: `).concat(r("button.outlined.help.color"), `;
}

.p-button-outlined.p-button-help:not(:disabled):active {
    background: `).concat(r("button.outlined.help.active.background"), `;
    border-color: `).concat(r("button.outlined.help.border.color"), `;
    color: `).concat(r("button.outlined.help.color"), `;
}

.p-button-outlined.p-button-danger {
    border-color: `).concat(r("button.outlined.danger.border.color"), `;
    color: `).concat(r("button.outlined.danger.color"), `;
}

.p-button-outlined.p-button-danger:not(:disabled):hover {
    background: `).concat(r("button.outlined.danger.hover.background"), `;
    border-color: `).concat(r("button.outlined.danger.border.color"), `;
    color: `).concat(r("button.outlined.danger.color"), `;
}

.p-button-outlined.p-button-danger:not(:disabled):active {
    background: `).concat(r("button.outlined.danger.active.background"), `;
    border-color: `).concat(r("button.outlined.danger.border.color"), `;
    color: `).concat(r("button.outlined.danger.color"), `;
}

.p-button-outlined.p-button-contrast {
    border-color: `).concat(r("button.outlined.contrast.border.color"), `;
    color: `).concat(r("button.outlined.contrast.color"), `;
}

.p-button-outlined.p-button-contrast:not(:disabled):hover {
    background: `).concat(r("button.outlined.contrast.hover.background"), `;
    border-color: `).concat(r("button.outlined.contrast.border.color"), `;
    color: `).concat(r("button.outlined.contrast.color"), `;
}

.p-button-outlined.p-button-contrast:not(:disabled):active {
    background: `).concat(r("button.outlined.contrast.active.background"), `;
    border-color: `).concat(r("button.outlined.contrast.border.color"), `;
    color: `).concat(r("button.outlined.contrast.color"), `;
}

.p-button-outlined.p-button-plain {
    border-color: `).concat(r("button.outlined.plain.border.color"), `;
    color: `).concat(r("button.outlined.plain.color"), `;
}

.p-button-outlined.p-button-plain:not(:disabled):hover {
    background: `).concat(r("button.outlined.plain.hover.background"), `;
    border-color: `).concat(r("button.outlined.plain.border.color"), `;
    color: `).concat(r("button.outlined.plain.color"), `;
}

.p-button-outlined.p-button-plain:not(:disabled):active {
    background: `).concat(r("button.outlined.plain.active.background"), `;
    border-color: `).concat(r("button.outlined.plain.border.color"), `;
    color: `).concat(r("button.outlined.plain.color"), `;
}

.p-button-text {
    background: transparent;
    border-color: transparent;
    color: `).concat(r("button.text.primary.color"), `;
}

.p-button-text:not(:disabled):hover {
    background: `).concat(r("button.text.primary.hover.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.primary.color"), `;
}

.p-button-text:not(:disabled):active {
    background: `).concat(r("button.text.primary.active.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.primary.color"), `;
}

.p-button-text.p-button-secondary {
    background: transparent;
    border-color: transparent;
    color: `).concat(r("button.text.secondary.color"), `;
}

.p-button-text.p-button-secondary:not(:disabled):hover {
    background: `).concat(r("button.text.secondary.hover.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.secondary.color"), `;
}

.p-button-text.p-button-secondary:not(:disabled):active {
    background: `).concat(r("button.text.secondary.active.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.secondary.color"), `;
}

.p-button-text.p-button-success {
    background: transparent;
    border-color: transparent;
    color: `).concat(r("button.text.success.color"), `;
}

.p-button-text.p-button-success:not(:disabled):hover {
    background: `).concat(r("button.text.success.hover.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.success.color"), `;
}

.p-button-text.p-button-success:not(:disabled):active {
    background: `).concat(r("button.text.success.active.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.success.color"), `;
}

.p-button-text.p-button-info {
    background: transparent;
    border-color: transparent;
    color: `).concat(r("button.text.info.color"), `;
}

.p-button-text.p-button-info:not(:disabled):hover {
    background: `).concat(r("button.text.info.hover.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.info.color"), `;
}

.p-button-text.p-button-info:not(:disabled):active {
    background: `).concat(r("button.text.info.active.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.info.color"), `;
}

.p-button-text.p-button-warn {
    background: transparent;
    border-color: transparent;
    color: `).concat(r("button.text.warn.color"), `;
}

.p-button-text.p-button-warn:not(:disabled):hover {
    background: `).concat(r("button.text.warn.hover.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.warn.color"), `;
}

.p-button-text.p-button-warn:not(:disabled):active {
    background: `).concat(r("button.text.warn.active.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.warn.color"), `;
}

.p-button-text.p-button-help {
    background: transparent;
    border-color: transparent;
    color: `).concat(r("button.text.help.color"), `;
}

.p-button-text.p-button-help:not(:disabled):hover {
    background: `).concat(r("button.text.help.hover.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.help.color"), `;
}

.p-button-text.p-button-help:not(:disabled):active {
    background: `).concat(r("button.text.help.active.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.help.color"), `;
}

.p-button-text.p-button-danger {
    background: transparent;
    border-color: transparent;
    color: `).concat(r("button.text.danger.color"), `;
}

.p-button-text.p-button-danger:not(:disabled):hover {
    background: `).concat(r("button.text.danger.hover.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.danger.color"), `;
}

.p-button-text.p-button-danger:not(:disabled):active {
    background: `).concat(r("button.text.danger.active.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.danger.color"), `;
}

.p-button-text.p-button-plain {
    background: transparent;
    border-color: transparent;
    color: `).concat(r("button.text.plain.color"), `;
}

.p-button-text.p-button-plain:not(:disabled):hover {
    background: `).concat(r("button.text.plain.hover.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.plain.color"), `;
}

.p-button-text.p-button-plain:not(:disabled):active {
    background: `).concat(r("button.text.plain.active.background"), `;
    border-color: transparent;
    color: `).concat(r("button.text.plain.color"), `;
}

.p-button-link {
    background: transparent;
    border-color: transparent;
    color: `).concat(r("button.link.color"), `;
}

.p-button-link:not(:disabled):hover {
    background: transparent;
    border-color: transparent;
    color: `).concat(r("button.link.hover.color"), `;
}

.p-button-link:not(:disabled):hover .p-button-label {
    text-decoration: underline;
}

.p-button-link:not(:disabled):active {
    background: transparent;
    border-color: transparent;
    color: `).concat(r("button.link.active.color"), `;
}
`);
}, Lf = {
  root: function(t) {
    var r = t.instance, n = t.props;
    return ["p-button p-component", Ye(Ye(Ye(Ye(Ye(Ye(Ye(Ye(Ye({
      "p-button-icon-only": r.hasIcon && !n.label && !n.badge,
      "p-button-vertical": (n.iconPos === "top" || n.iconPos === "bottom") && n.label,
      "p-button-loading": n.loading,
      "p-button-link": n.link
    }, "p-button-".concat(n.severity), n.severity), "p-button-raised", n.raised), "p-button-rounded", n.rounded), "p-button-text", n.text), "p-button-outlined", n.outlined), "p-button-sm", n.size === "small"), "p-button-lg", n.size === "large"), "p-button-plain", n.plain), "p-button-fluid", r.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(t) {
    var r = t.props;
    return ["p-button-icon", Ye({}, "p-button-icon-".concat(r.iconPos), r.label)];
  },
  label: "p-button-label"
}, Ef = re.extend({
  name: "button",
  theme: zf,
  classes: Lf
}), Nf = {
  name: "BaseButton",
  extends: Zn,
  props: {
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    iconPos: {
      type: String,
      default: "left"
    },
    iconClass: {
      type: [String, Object],
      default: null
    },
    badge: {
      type: String,
      default: null
    },
    badgeClass: {
      type: [String, Object],
      default: null
    },
    badgeSeverity: {
      type: String,
      default: "secondary"
    },
    loading: {
      type: Boolean,
      default: !1
    },
    loadingIcon: {
      type: String,
      default: void 0
    },
    as: {
      type: [String, Object],
      default: "BUTTON"
    },
    asChild: {
      type: Boolean,
      default: !1
    },
    link: {
      type: Boolean,
      default: !1
    },
    severity: {
      type: String,
      default: null
    },
    raised: {
      type: Boolean,
      default: !1
    },
    rounded: {
      type: Boolean,
      default: !1
    },
    text: {
      type: Boolean,
      default: !1
    },
    outlined: {
      type: Boolean,
      default: !1
    },
    size: {
      type: String,
      default: null
    },
    plain: {
      type: Boolean,
      default: !1
    },
    fluid: {
      type: Boolean,
      default: null
    }
  },
  style: Ef,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
}, Pn = {
  name: "Button",
  extends: Nf,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(t) {
      var r = t === "root" ? this.ptmi : this.ptm;
      return r(t, {
        context: {
          disabled: this.disabled
        }
      });
    }
  },
  computed: {
    disabled: function() {
      return this.$attrs.disabled || this.$attrs.disabled === "" || this.loading;
    },
    defaultAriaLabel: function() {
      return this.label ? this.label + (this.badge ? " " + this.badge : "") : this.$attrs.ariaLabel;
    },
    hasIcon: function() {
      return this.icon || this.$slots.icon;
    },
    attrs: function() {
      return Oe(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
    },
    asAttrs: function() {
      return this.as === "BUTTON" ? {
        type: "button",
        disabled: this.disabled
      } : void 0;
    },
    a11yAttrs: function() {
      return {
        "aria-label": this.defaultAriaLabel,
        "data-pc-name": "button",
        "data-p-disabled": this.disabled,
        "data-p-severity": this.severity
      };
    },
    hasFluid: function() {
      return Pt(this.fluid) ? !!this.$pcFluid : this.fluid;
    }
  },
  components: {
    SpinnerIcon: Is,
    Badge: zs
  },
  directives: {
    ripple: Af
  }
};
function Rf(e, t, r, n, o, a) {
  var s = To("SpinnerIcon"), i = To("Badge"), l = ru("ripple");
  return e.asChild ? Ut(e.$slots, "default", {
    key: 1,
    class: _e(e.cx("root")),
    a11yAttrs: a.a11yAttrs
  }) : Za((J(), rr(tu(e.as), Oe({
    key: 0,
    class: e.cx("root")
  }, a.attrs), {
    default: Qa(function() {
      return [Ut(e.$slots, "default", {}, function() {
        return [e.loading ? Ut(e.$slots, "loadingicon", {
          key: 0,
          class: _e([e.cx("loadingIcon"), e.cx("icon")])
        }, function() {
          return [e.loadingIcon ? (J(), oe("span", Oe({
            key: 0,
            class: [e.cx("loadingIcon"), e.cx("icon"), e.loadingIcon]
          }, e.ptm("loadingIcon")), null, 16)) : (J(), rr(s, Oe({
            key: 1,
            class: [e.cx("loadingIcon"), e.cx("icon")],
            spin: ""
          }, e.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : Ut(e.$slots, "icon", {
          key: 1,
          class: _e([e.cx("icon")])
        }, function() {
          return [e.icon ? (J(), oe("span", Oe({
            key: 0,
            class: [e.cx("icon"), e.icon, e.iconClass]
          }, e.ptm("icon")), null, 16)) : ue("", !0)];
        }), L("span", Oe({
          class: e.cx("label")
        }, e.ptm("label")), ee(e.label || " "), 17), e.badge ? (J(), rr(i, {
          key: 2,
          value: e.badge,
          class: _e(e.badgeClass),
          severity: e.badgeSeverity,
          unstyled: e.unstyled,
          pt: e.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : ue("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class"])), [[l]]);
}
Pn.render = Rf;
const Mf = { class: "flex flex-col h-full w-full overflow-hidden text-sm" }, Ff = { class: "flex items-center gap-3 px-4 py-3 border-b border-surface-200 dark:border-surface-700 shrink-0" }, Bf = /* @__PURE__ */ L(
  "h1",
  { class: "text-lg font-bold whitespace-nowrap" },
  "CSPT Analyzer",
  -1
  /* HOISTED */
), Vf = { class: "flex items-center gap-3 text-xs" }, Df = { class: "px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800" }, Hf = { class: "px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800" }, Uf = { class: "px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800" }, Kf = /* @__PURE__ */ L(
  "div",
  { class: "flex-grow" },
  null,
  -1
  /* HOISTED */
), Wf = /* @__PURE__ */ L(
  "option",
  { value: "all" },
  "All Hosts",
  -1
  /* HOISTED */
), Gf = ["value"], qf = {
  key: 0,
  class: "flex flex-wrap items-center gap-2 px-4 py-2 border-b border-surface-200 dark:border-surface-700 shrink-0"
}, Yf = /* @__PURE__ */ L(
  "span",
  { class: "text-xs font-semibold" },
  "Detected:",
  -1
  /* HOISTED */
), Jf = ["title"], Qf = { class: "flex border-b border-surface-200 dark:border-surface-700 shrink-0" }, Zf = { class: "flex-1 overflow-auto" }, Xf = {
  key: 0,
  class: "w-full text-xs"
}, e0 = /* @__PURE__ */ L(
  "thead",
  { class: "sticky top-0 bg-surface-50 dark:bg-surface-900" },
  [
    /* @__PURE__ */ L("tr", { class: "text-left" }, [
      /* @__PURE__ */ L("th", { class: "px-3 py-2 font-semibold" }, "Path"),
      /* @__PURE__ */ L("th", { class: "px-3 py-2 font-semibold w-20" }, "Type"),
      /* @__PURE__ */ L("th", { class: "px-3 py-2 font-semibold w-20" }, "Dynamic"),
      /* @__PURE__ */ L("th", { class: "px-3 py-2 font-semibold w-24" }, "Framework"),
      /* @__PURE__ */ L("th", { class: "px-3 py-2 font-semibold" }, "Host"),
      /* @__PURE__ */ L("th", { class: "px-3 py-2 font-semibold" }, "Source")
    ])
  ],
  -1
  /* HOISTED */
), t0 = { key: 0 }, r0 = /* @__PURE__ */ L(
  "td",
  {
    colspan: "6",
    class: "px-3 py-8 text-center text-surface-400"
  },
  " No paths found yet. Browse the target to start passive analysis. ",
  -1
  /* HOISTED */
), n0 = [
  r0
], o0 = { class: "px-3 py-1.5 font-mono break-all" }, a0 = { class: "px-3 py-1.5" }, s0 = { class: "px-1.5 py-0.5 rounded text-[10px] bg-surface-200 dark:bg-surface-700" }, i0 = { class: "px-3 py-1.5" }, l0 = {
  key: 0,
  class: "px-1.5 py-0.5 rounded text-[10px] bg-yellow-500 text-black"
}, c0 = { class: "px-3 py-1.5" }, u0 = ["title"], d0 = ["title"], f0 = {
  key: 1,
  class: "w-full text-xs"
}, p0 = /* @__PURE__ */ L(
  "thead",
  { class: "sticky top-0 bg-surface-50 dark:bg-surface-900" },
  [
    /* @__PURE__ */ L("tr", { class: "text-left" }, [
      /* @__PURE__ */ L("th", { class: "px-3 py-2 font-semibold w-16" }, "Risk"),
      /* @__PURE__ */ L("th", { class: "px-3 py-2 font-semibold w-40" }, "Type"),
      /* @__PURE__ */ L("th", { class: "px-3 py-2 font-semibold" }, "Description"),
      /* @__PURE__ */ L("th", { class: "px-3 py-2 font-semibold" }, "Context"),
      /* @__PURE__ */ L("th", { class: "px-3 py-2 font-semibold" }, "Host")
    ])
  ],
  -1
  /* HOISTED */
), b0 = { key: 0 }, g0 = /* @__PURE__ */ L(
  "td",
  {
    colspan: "5",
    class: "px-3 py-8 text-center text-surface-400"
  },
  " No CSPT sinks found yet. Browse the target to start passive analysis. ",
  -1
  /* HOISTED */
), h0 = [
  g0
], m0 = { class: "px-3 py-1.5" }, v0 = { class: "px-3 py-1.5 font-mono text-[10px]" }, y0 = ["title"], x0 = ["title"], k0 = ["title"], w0 = /* @__PURE__ */ Dc({
  __name: "App",
  setup(e) {
    const t = qd(), r = rt([]), n = rt("all"), o = rt([]), a = rt("paths"), s = rt(!1), i = Wt(() => n.value === "all" ? o.value : o.value.filter((x) => x.host === n.value)), l = Wt(() => {
      const x = [];
      for (const T of i.value)
        for (const v of T.paths || [])
          x.push({ ...v, host: T.host });
      return x.sort((T, v) => T.isDynamic !== v.isDynamic ? T.isDynamic ? -1 : 1 : T.path.localeCompare(v.path));
    }), c = Wt(() => {
      const x = [];
      for (const v of i.value)
        for (const O of v.sinks || [])
          x.push({ ...O, host: v.host });
      const T = { high: 0, medium: 1, low: 2 };
      return x.sort(
        (v, O) => (T[v.risk] || 3) - (T[O.risk] || 3)
      );
    }), u = Wt(() => {
      let x = 0, T = 0, v = 0, O = 0;
      for (const m of o.value)
        x += (m.paths || []).length, T += (m.sinks || []).length, v += (m.paths || []).filter((A) => A.isDynamic).length, O += (m.sinks || []).filter((A) => A.risk === "high").length;
      return { totalPaths: x, totalSinks: T, dynamicPaths: v, highRiskSinks: O };
    });
    async function p() {
      s.value = !0;
      try {
        const x = await t.backend.getAllData();
        o.value = x || [];
        const T = await t.backend.getAllHosts();
        r.value = T || [];
      } catch (x) {
        console.error("Failed to refresh:", x);
      } finally {
        s.value = !1;
      }
    }
    async function b() {
      await t.backend.clearData(), await p();
    }
    Gn(() => {
      p(), t.backend.onEvent("onNewFindings", () => {
        p();
      });
    });
    function h(x) {
      switch (x) {
        case "high":
          return "bg-red-600 text-white";
        case "medium":
          return "bg-yellow-500 text-black";
        case "low":
          return "bg-blue-500 text-white";
        default:
          return "bg-gray-500 text-white";
      }
    }
    function S(x) {
      return {
        nextjs: "bg-purple-600",
        "react-router": "bg-cyan-600",
        remix: "bg-pink-600",
        "vue-router": "bg-green-600",
        nuxt: "bg-emerald-600",
        angular: "bg-red-500",
        sveltekit: "bg-orange-500",
        ember: "bg-amber-600",
        solidstart: "bg-indigo-600",
        astro: "bg-fuchsia-600",
        unknown: "bg-gray-600"
      }[x] || "bg-gray-600";
    }
    return (x, T) => (J(), oe("div", Mf, [
      ue(" Header "),
      L("div", Ff, [
        Bf,
        ue(" Stats "),
        L("div", Vf, [
          L(
            "span",
            Df,
            ee(r.value.length) + " hosts ",
            1
            /* TEXT */
          ),
          L(
            "span",
            Hf,
            ee(u.value.totalPaths) + " paths ",
            1
            /* TEXT */
          ),
          L(
            "span",
            Uf,
            ee(u.value.dynamicPaths) + " dynamic ",
            1
            /* TEXT */
          ),
          L(
            "span",
            {
              class: _e(["px-2 py-0.5 rounded", u.value.highRiskSinks > 0 ? "bg-red-600 text-white" : "bg-surface-100 dark:bg-surface-800"])
            },
            ee(u.value.highRiskSinks) + " high-risk sinks ",
            3
            /* TEXT, CLASS */
          )
        ]),
        Kf,
        ue(" Host filter "),
        Za(L(
          "select",
          {
            "onUpdate:modelValue": T[0] || (T[0] = (v) => n.value = v),
            class: "text-xs px-2 py-1 rounded bg-surface-100 dark:bg-surface-800 border border-surface-300 dark:border-surface-600"
          },
          [
            Wf,
            (J(!0), oe(
              fe,
              null,
              Cr(r.value, (v) => {
                var O, m, A, D;
                return J(), oe("option", {
                  key: v,
                  value: v
                }, [
                  Rr(
                    ee(v) + " ",
                    1
                    /* TEXT */
                  ),
                  ((m = (O = o.value.find((E) => E.host === v)) == null ? void 0 : O.framework) == null ? void 0 : m.framework) !== "unknown" ? (J(), oe(
                    fe,
                    { key: 0 },
                    [
                      Rr(
                        " (" + ee((D = (A = o.value.find((E) => E.host === v)) == null ? void 0 : A.framework) == null ? void 0 : D.framework) + ") ",
                        1
                        /* TEXT */
                      )
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : ue("v-if", !0)
                ], 8, Gf);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          512
          /* NEED_PATCH */
        ), [
          [gd, n.value]
        ]),
        Re(vn(Pn), {
          label: "Refresh",
          onClick: p,
          disabled: s.value,
          size: "small",
          severity: "secondary"
        }, null, 8, ["disabled"]),
        Re(vn(Pn), {
          label: "Clear",
          onClick: b,
          size: "small",
          severity: "danger"
        })
      ]),
      ue(" Framework Detection Bar (for selected host or all) "),
      i.value.some((v) => {
        var O;
        return ((O = v.framework) == null ? void 0 : O.framework) !== "unknown";
      }) ? (J(), oe("div", qf, [
        Yf,
        (J(!0), oe(
          fe,
          null,
          Cr(i.value, (v) => {
            var O, m;
            return J(), oe(
              fe,
              {
                key: v.host
              },
              [
                ((O = v.framework) == null ? void 0 : O.framework) !== "unknown" ? (J(), oe("span", {
                  key: 0,
                  class: _e(["inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-white", S(v.framework.framework)]),
                  title: (m = v.framework.signals) == null ? void 0 : m.join(", ")
                }, ee(v.host) + ": " + ee(v.framework.framework) + " (" + ee(v.framework.confidence) + "%) ", 11, Jf)) : ue("v-if", !0)
              ],
              64
              /* STABLE_FRAGMENT */
            );
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : ue("v-if", !0),
      ue(" Tab bar "),
      L("div", Qf, [
        L(
          "button",
          {
            onClick: T[1] || (T[1] = (v) => a.value = "paths"),
            class: _e(["px-4 py-2 text-sm font-medium transition-colors", a.value === "paths" ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400" : "text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"])
          },
          " Client-Side Paths (" + ee(l.value.length) + ") ",
          3
          /* TEXT, CLASS */
        ),
        L(
          "button",
          {
            onClick: T[2] || (T[2] = (v) => a.value = "sinks"),
            class: _e(["px-4 py-2 text-sm font-medium transition-colors", a.value === "sinks" ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400" : "text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"])
          },
          " CSPT Sinks (" + ee(c.value.length) + ") ",
          3
          /* TEXT, CLASS */
        )
      ]),
      ue(" Content "),
      L("div", Zf, [
        ue(" Paths Table "),
        a.value === "paths" ? (J(), oe("table", Xf, [
          e0,
          L("tbody", null, [
            l.value.length === 0 ? (J(), oe("tr", t0, n0)) : ue("v-if", !0),
            (J(!0), oe(
              fe,
              null,
              Cr(l.value, (v, O) => (J(), oe(
                "tr",
                {
                  key: O,
                  class: _e(["border-t border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800", v.isDynamic ? "bg-yellow-50 dark:bg-yellow-900/10" : ""])
                },
                [
                  L(
                    "td",
                    o0,
                    ee(v.path),
                    1
                    /* TEXT */
                  ),
                  L("td", a0, [
                    L(
                      "span",
                      s0,
                      ee(v.type),
                      1
                      /* TEXT */
                    )
                  ]),
                  L("td", i0, [
                    v.isDynamic ? (J(), oe("span", l0, " DYNAMIC ")) : ue("v-if", !0)
                  ]),
                  L("td", c0, [
                    L(
                      "span",
                      {
                        class: _e(["px-1.5 py-0.5 rounded text-[10px] text-white", S(v.framework)])
                      },
                      ee(v.framework),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  L("td", {
                    class: "px-3 py-1.5 truncate max-w-[150px]",
                    title: v.host
                  }, ee(v.host), 9, u0),
                  L("td", {
                    class: "px-3 py-1.5 truncate max-w-[200px] text-surface-400",
                    title: v.source
                  }, ee(v.source), 9, d0)
                ],
                2
                /* CLASS */
              ))),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])) : ue("v-if", !0),
        ue(" Sinks Table "),
        a.value === "sinks" ? (J(), oe("table", f0, [
          p0,
          L("tbody", null, [
            c.value.length === 0 ? (J(), oe("tr", b0, h0)) : ue("v-if", !0),
            (J(!0), oe(
              fe,
              null,
              Cr(c.value, (v, O) => (J(), oe("tr", {
                key: O,
                class: "border-t border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800"
              }, [
                L("td", m0, [
                  L(
                    "span",
                    {
                      class: _e(["px-1.5 py-0.5 rounded text-[10px] font-bold", h(v.risk)])
                    },
                    ee(v.risk.toUpperCase()),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                L(
                  "td",
                  v0,
                  ee(v.type),
                  1
                  /* TEXT */
                ),
                L("td", {
                  class: "px-3 py-1.5 max-w-[300px]",
                  title: v.description
                }, ee(v.description), 9, y0),
                L("td", {
                  class: "px-3 py-1.5 font-mono text-[10px] max-w-[300px] truncate",
                  title: v.lineContext
                }, ee(v.lineContext), 9, x0),
                L("td", {
                  class: "px-3 py-1.5 truncate max-w-[120px]",
                  title: v.host
                }, ee(v.host), 9, k0)
              ]))),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])) : ue("v-if", !0)
      ])
    ]));
  }
}), _0 = (e) => {
  const t = vd(w0);
  t.use(Wd, {
    unstyled: !0,
    pt: _l
  }), t.use(Gd, e);
  const r = document.createElement("div");
  Object.assign(r.style, {
    height: "100%",
    width: "100%"
  }), r.id = "plugin--cspt-analyzer", t.mount(r), e.navigation.addPage("/cspt-analyzer", {
    body: r
  }), e.sidebar.registerItem("CSPT Analyzer", "/cspt-analyzer");
};
export {
  _0 as init
};
