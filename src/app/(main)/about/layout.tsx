import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Дар бораи мо - DonishYob',
  description: 'Дар ин ҷо шумо метавонед дар бораи ҳадафҳои лоиҳаи DonishYob маълумот гиред.',
  openGraph: {
    title: 'Дар бораи мо - DonishYob',
    description: 'Научная библиотека DonishYob',
    url: 'https://donishyob.com/about',
    siteName: 'DonishYob',
  },
};


export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}