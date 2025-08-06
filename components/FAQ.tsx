"use client";
import { useState } from "react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    id: 1,
    question: "What is the purpose of this portal?",
    answer:
      "This portal is designed to provide easy access to information and resources for our community. It serves as a central hub for all your needs.",
  },
  {
    id: 2,
    question: "How do I get started?",
    answer:
      "To get started, you can explore the different sections of the portal using the navigation bar. If you have specific questions, this FAQ section is a great place to start.",
  },
  {
    id: 3,
    question: "Can I contribute to the portal?",
    answer:
      "Yes! We welcome contributions from the community. If you have ideas for new features or content, please reach out to our team.",
  },
  {
    id: 4,
    question: "Who can I contact for support?",
    answer:
      "For support, you can contact our team through the contact form on the 'Our Team' page. We are always here to help you with any issues or questions you may have.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-6">
      <dt>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-start justify-between text-left text-gray-900"
        >
          <span className="text-lg font-semibold leading-7">{question}</span>
          <span className="ml-6 flex h-7 items-center">
            {isOpen ? (
              <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
            )}
          </span>
        </button>
      </dt>
      {isOpen && (
        <dd className="mt-2 pr-12">
          <p className="text-lg leading-7 text-gray-600">{answer}</p>
        </dd>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-5xl divide-y divide-gray-900/10">
          <h2 className="text-3xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <FaqItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
