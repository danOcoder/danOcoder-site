# Icon

This snippet imports the Icon component and uses it alongside text. Notice that if you want the icon to align nicely with text, it’s often easiest to place both in a container that uses flex or inline-flex. By default, the icon’s dimensions are 1em, so it scales with the font size.

```tsx
import { Icon } from '~/components/ui/Icon';

<div className="flex items-center space-x-2">
  <Icon name="some-icon" />
  <p>Task completed</p>
</div>;
```

## Props

| Prop     | Type                            | Default   | Description                                                                                                                                                                                                   |
| -------- | ------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name     | `IconName`                      | —         | Required. The name of the icon. The component uses this to reference the correct symbol in the SVG sprite.                                                                                                    |
| size     | 'font' 'xs' 'sm' 'md' 'lg' 'xl' | 'font'    | Controls the size of the icon. 'font' matches the current text size, while xs, sm, md, lg, and xl use predefined Tailwind classes.                                                                            |
| title    | string                          | undefined | Text equivalient of the icon, similar to `alt`. Inserted as the `<title>` of the SVG. Typically needed only when the icon is not purely decorative and additional context is required (e.g., a company logo). |
| ...props | `SVGProps<SVGSVGElement>`       | —         | You can pass any valid SVG props (e.g., `onClick`, `aria-hidden`, etc.). These are spread onto the root `<svg> `element.                                                                                      |

## Sizing

The size prop lets you quickly pick from several predefined sizing classes. Here are the available options:

- **font:** `size-[1em] `(default, scales based on the surrounding text size)
- **xs:** `size-3`
- **sm:** `size-4`
- **md:** `size-5`
- **lg:** `size-6`
- **xl:** `size-7`

```tsx
<Icon name="some-icon" size="sm" />
```

## Accessibility

1. **Decorative Icons:** If the icon is purely decorative, you don’t need a title. The component will set `aria-hidden="true"` automatically when no title is provided.

2. **Meaningful Icons:** If the icon conveys meaning or labels an interactive element, you should do one of the following:
   - Provide a `title` prop to describe the icon itself (not the UI action). The component will automatically add `role="img"` when `title` is present. Do not confuse this with the HTML `title` attribute, which provides a visible tooltip.

   - Provide an accessible label on the parent element. For example, if the icon is the only thing inside a button or link (like a hamburger menu), add a tooltip (`title` attribute) or `aria-label` to that parent to describe the action or purpose. That way, the icon can remain decorative, and the parent has the appropriate accessible name.

```tsx
// Icon is purely decorative, no SVG title needed, but tooltip (title) helpful on the parent:
<button title="Open settings">
  <Icon name="hamburger" />
</button>

// Icon with a descriptive title (like alt), e.g. a company logo:
<Icon name="logo" title="Acme Corp" />
```
