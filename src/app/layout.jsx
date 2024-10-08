import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "flowchart",
  description:
    "Course curriculum for the computer science majors made by the College of Staten Island Computer Science Department",
  openGraph: {
    title: "flowchart",
    description:
      "Course curriculum for the computer science majors made by the College of Staten Island Computer Science Department",
    images: [{ url: "http://techep.csi.cuny.edu/~flowchart/images/icon.png" }],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
