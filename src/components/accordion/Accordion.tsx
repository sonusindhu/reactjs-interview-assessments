import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { ReactNode } from 'react';

import type { AccordionMode } from './types';

interface AccordionContextValue {
  expandedItems: Set<string>;
  toggleItem: (id: string) => void;
}

const AccordionContext =
  createContext<AccordionContextValue | null>(null);

interface AccordionProps {
  children: ReactNode;
  mode?: AccordionMode;
  defaultExpanded?: string[];
}

export function Accordion({
  children,
  mode = 'single',
  defaultExpanded = [],
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    () => new Set(defaultExpanded),
  );

  const toggleItem = useCallback(
    (id: string) => {
      setExpandedItems((previous) => {
        const next = new Set(previous);

        if (next.has(id)) {
          next.delete(id);
        } else {
          if (mode === 'single') {
            next.clear();
          }

          next.add(id);
        }

        return next;
      });
    },
    [mode],
  );

  const contextValue = useMemo(
    () => ({
      expandedItems,
      toggleItem,
    }),
    [expandedItems, toggleItem],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className="accordion">
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function useAccordion() {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error(
      'AccordionItem must be used within an Accordion component.',
    );
  }

  return context;
}