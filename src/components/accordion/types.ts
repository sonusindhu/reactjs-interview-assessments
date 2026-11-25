import type { ReactNode } from 'react';

export type AccordionMode = 'single' | 'multiple';

export interface AccordionProps {
  children: ReactNode;
  mode?: AccordionMode;
  defaultExpanded?: string[];
}

export interface AccordionItemProps {
  id: string;
  title: string;
  children: ReactNode;
  disabled?: boolean;
}