import { SafeOnRampKit, SafeOnRampProviderType } from "@safe-global/onramp-kit";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { polygon } from "wagmi/chains";

// create the stripe component class
export function Stripe() {
  const stripeRootRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  const walletAddress = address!!;
  const [onRampClient, setOnRampClient] = useState<SafeOnRampKit>();
  if (stripeRootRef.current) {
    stripeRootRef.current.innerHTML = "";
  }
  const startStripe = async () => {
    console.log(walletAddress);

    const sessionData = (await onRampClient?.open({
      walletAddress,
      networks: ["polygon"],
      element: "#stripe-root",
      events: {
        onLoaded: () => console.log("Loaded"),
        onPaymentSuccessful: () => console.log("Payment successful"),
        onPaymentError: () => console.log("Payment failed"),
        onPaymentProcessing: () => console.log("Payment processing"),
      },
    })) as any;
  };

  useEffect(() => {
    (async () => {
      const safeOnRamp = await SafeOnRampKit.init(
        SafeOnRampProviderType.Stripe,
        {
          onRampProviderConfig: {
            stripePublicKey:
              "pk_test_51MZbmZKSn9ArdBimSyl5i8DqfcnlhyhJHD8bF2wKrGkpvNWyPvBAYtE211oHda0X3Ea1n4e9J9nh2JkpC7Sxm5a200Ug9ijfoO", // You should get your own public and private keys from Stripe
            onRampBackendUrl: "https://aa-stripe.safe.global", // You should deploy your own server
          },
        }
      );

      setOnRampClient(safeOnRamp);
    })();
  }, []);

  return (
    <>
      <button
        className="btn max-w-[320px] w-full my-[20px] rounded-[4px]"
        onClick={async () => {
          startStripe();
        }}
      >
        Preload wallet with Stripe
      </button>
      <div id="stripe-root" className="mb-[20px]" ref={stripeRootRef}></div>
    </>
  );
}
