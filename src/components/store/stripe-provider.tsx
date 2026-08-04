"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import type { ReactNode } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_live_51TwJi6BJLLXDnujdfF8Cf0BPO6HDd0epg3nGdD5HZ9Te7U1Ri6Xn0B4NujhhY0pRN2uUxNbIqNeaX1GiGTWThSeH00KqSsuZlq"
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
