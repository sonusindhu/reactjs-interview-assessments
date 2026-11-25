import { useId } from 'react';

import type { ReactNode } from 'react';

import { useAccordion } from './Accordion';

interface AccordionItemProps {
  id: string;
  title: string;
  children: ReactNode;
  disabled?: boolean;
}

export function AccordionItem({
  id,
  title,
  children,
  disabled = false,
}: AccordionItemProps) {
  const { expandedItems, toggleItem } = useAccordion();

  const generatedId = useId();

  const isExpanded = expandedItems.has(id);

  const triggerId = `${generatedId}-trigger`;
  const panelId = `${generatedId}-panel`;

  return (
    <section className="accordion-item">
      <h3 className="accordion-heading">
        <button
          id={triggerId}
          type="button"
          className="accordion-trigger"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          disabled={disabled}
          onClick={() => toggleItem(id)}
        >
          <span>{title}</span>

          <span
            className={`accordion-icon ${
              isExpanded ? 'expanded' : ''
            }`}
            aria-hidden="true"
          >
            +
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!isExpanded}
        className="accordion-panel"
      >
        {children}
      </div>
    </section>
  );
}