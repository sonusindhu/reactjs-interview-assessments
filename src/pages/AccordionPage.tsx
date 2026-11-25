import { Accordion } from '../components/accordion/Accordion';
import { AccordionItem } from '../components/accordion/AccordionItem';
import '../components/accordion/Accordion.css';

function AccordionPage() {
  return (
    <main>
      <h1>React Accordion</h1>

      <h2>Single Open Mode</h2>

      <Accordion
        mode="single"
        defaultExpanded={['react']}
      >
        <AccordionItem
          id="react"
          title="What is React?"
        >
          React is a JavaScript library for building user
          interfaces using reusable components.
        </AccordionItem>

        <AccordionItem
          id="typescript"
          title="What is TypeScript?"
        >
          TypeScript is a strongly typed programming
          language built on JavaScript.
        </AccordionItem>

        <AccordionItem
          id="angular"
          title="What is Angular?"
        >
          Angular is a TypeScript-based framework for
          building web applications.
        </AccordionItem>

        <AccordionItem
          id="disabled"
          title="Disabled Accordion"
          disabled
        >
          This item cannot be expanded.
        </AccordionItem>
      </Accordion>

      <h2>Multiple Open Mode</h2>

      <Accordion mode="multiple">
        <AccordionItem
          id="javascript"
          title="What is JavaScript?"
        >
          JavaScript is a programming language used
          for web development.
        </AccordionItem>

        <AccordionItem
          id="frontend"
          title="What is Frontend Development?"
        >
          Frontend development focuses on user-facing
          application interfaces.
        </AccordionItem>
      </Accordion>
    </main>
  );
}

export default AccordionPage;