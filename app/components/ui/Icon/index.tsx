import { type SVGProps } from 'react';

import { cn } from '../../../utils/cn';
import type { IconName } from '../icons/name';
import href from '../icons/sprite.svg';

export { type IconName };

const sizeClassName = {
  font: 'size-[1em]',
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-7',
} as const;

type Size = keyof typeof sizeClassName;

/**
 * Size:
 * - `font` (default): 1em
 * - `xs`: 0.75rem (12px)
 * - `sm`: 1rem (16px)
 * - `md`: 1.25rem (20px)
 * - `lg`: 1.5rem (24px)
 * - `xl`: 1.75rem (28px)
 */
export const Icon = ({
  name,
  size = 'font',
  title,
  className,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: Size;
  title?: string;
}) => {
  return (
    <svg
      {...props}
      className={cn([sizeClassName[size], 'inline self-center', className])}
      {...(title ? { role: 'img' } : { 'aria-hidden': true })}
    >
      {title ? <title>{title}</title> : null}
      <use href={`${href}#${name}`} />
    </svg>
  );
};
