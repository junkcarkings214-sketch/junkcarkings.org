import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/lib/site";

const faqs = [
  {
    question: "What kinds of vehicles do you buy?",
    answer:
      "Junk cars, trucks, vans, SUVs, and other unwanted vehicles in any condition — running, non-running, damaged, rusted, or simply no longer needed. Describe what you have and we will tell you if we can make an offer.",
  },
  {
    question: "How do I get an offer?",
    answer:
      "Fill in the online notice. It asks for the basics — year, make, model, mileage, location — a few condition questions, and how to reach you. It usually takes two or three minutes, and there is no account to create.",
  },
  {
    question: "Do I have to send photos?",
    answer:
      "No, but they help. Clear pictures of the exterior, the interior, and any damage let us evaluate faster and make a more confident offer the first time.",
  },
  {
    question: "Do I need the title in hand?",
    answer:
      "Tell us what you have — title, registration, or neither. Requirements depend on the vehicle and where it sits, so the team will tell you what is needed before anything is agreed. If there is a lien or a missing document, mention it in the message field.",
  },
  {
    question: "How will I hear back?",
    answer:
      "A person reviews your notice and contacts you directly on the phone number or email you left. Every submission is read by hand, so you can ask questions one to one.",
  },
  {
    question: "Am I obligated to accept?",
    answer:
      "Not at all. Every offer is free and comes with zero obligation. If it does not work for you, you walk away and nothing follows you.",
  },
  {
    question: "Is there any fee?",
    answer:
      "No. The evaluation is free, and no fee is taken out of an offer. If you accept, the team explains the next steps when they call — including what is available for pickup in your area.",
  },
];

export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="bg-paper">
      <div className="shell pb-16 sm:pb-24">
        <div className="grid gap-8 border-t border-line pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2
              id="faq-heading"
              className="mt-0 text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.05] font-extrabold text-ink"
            >
              Asked before, answered plainly.
            </h2>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-ink-soft">
              Anything else, call{" "}
              <a
                href={siteConfig.phoneHref}
                className="font-semibold text-ink underline decoration-gold decoration-2 underline-offset-4"
              >
                {siteConfig.phone}
              </a>{" "}
              and a person will pick up.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${index}`}
                className="border-b border-line first:border-t"
              >
                <AccordionTrigger className="py-5 text-left text-[17px] font-semibold text-ink hover:no-underline sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-[62ch] pb-5 text-[15px] leading-relaxed text-ink-soft">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
