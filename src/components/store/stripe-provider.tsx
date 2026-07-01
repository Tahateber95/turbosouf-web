"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import type { ReactNode } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51PFv4YHobNL4f3GiDiQxFKcMygJwP01TRr5YoKUk1MRs0ZdapK7Hi3DCvsilIbnvRhUxe4r2PoJvupJvMNi15wcp00vYKxyAdZ"
);

export function StripeProvider({
  clientSecret,
  children,
}: {
  clientSecret: string;
  children: ReactNode;
}) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#E85D26",
            borderRadius: "8px",
            fontFamily: "Inter, system-ui, sans-serif",
          },
        },
        locale: "fr",
      }}
    >
      {children}
    </Elements>
  );
}
