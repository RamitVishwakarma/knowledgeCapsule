1. No component should be above 300 lines.
2. No function should be responsible to do multiple things
3. Each function should be responsible to do atomic things only.
4. All the buttons should come from a variant wrapping Button.tsx from the ui folder. No html button usage.
5. No img tag is allowed in the codebase use npm i sharp and the Image tag only.
6. No anchor tags allowed only Link tags are allowed.
7. Keep components simple do not overdo a component.
8. No DRY violations.
9. No YAGNI violations.
10. All the forms should use Form component from shadcn and react form hook and zod validations.
11. No inline styles allowed only tailwind classes are allowed (Dynamic styles for animations are an exception).
12. All the colors should be coming from global.css and no hardcoded custom values are allowed for tailwind classes.
13. All the modals should utilise the DialogBox components built on top of dialog from shadcn.
14. All actionDialogs should use the actionDialog component.
15. Constant arrays should be inside lib/constants and should be imported from there if its common else it should be inside module level constants.
16. All the router.xxx should redirect or change routes using a global routes.ts file no direct hardcodings for this.
17. All the endpoints should be used inside apiEndpoints.ts only if its called using the url else this can be an exception.
18. h-x w-x shouldnt be used instead size-x should be used.
19. Every LOC should be readable do not add nested ternaries or complex conditional statements.
