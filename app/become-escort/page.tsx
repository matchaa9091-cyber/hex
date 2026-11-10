import type { Metadata } from "next";
import BecomeEscortPage from "@/screens/BecomeEscortPage";

export const metadata: Metadata = {
  title: "Become an Escort in Uganda | List Your Profile on Hex Escorts UG",
  description:
    "Become an Escort in Uganda: List your profile on Hex Escorts UG, Uganda's #1 verified directory. Connect directly with clients across Kampala, Entebbe, Jinja & countrywide.",
  keywords:
    "become escort uganda, list escort profile uganda, join escort directory uganda, escort registration kampala, escort advertising uganda, become a call girl uganda, uganda escorts",
  alternates: {
    canonical: "https://www.hexescortsug.com/become-escort",
  },
  openGraph: {
    title: "Become an Escort in Uganda | List Your Profile on Hex Escorts UG",
    description:
      "List your profile on Hex Escorts UG and connect directly with clients across Kampala and all Uganda.",
    url: "https://www.hexescortsug.com/become-escort",
    siteName: "Hex Escorts Uganda",
  },
};

export default function Page() {
  return <BecomeEscortPage />;
}
