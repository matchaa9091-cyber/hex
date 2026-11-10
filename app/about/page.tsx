export const dynamic = 'force-static';
export const revalidate = 86400;
import type { Metadata } from "next";
import AboutPage from "@/screens/AboutPage";

export const metadata: Metadata = {
  title: "About Us – Uganda's #1 Verified Escort Directory | Hex Escorts UG",
  description:
    "Learn about Hex Escorts UG, Uganda's most trusted escort directory. Find verified escorts in Kampala, Entebbe, Jinja, Mbarara, Gulu and all major Uganda cities.",
  keywords:
    "about escorts Uganda, escort directory Uganda, verified companions Uganda, Kampala escorts about, UG escorts",
  alternates: {
    canonical: "https://www.hexescortsug.com/about",
  },
};

export default function Page() {
  return <AboutPage />;
}
