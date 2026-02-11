import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/lib/auth';
import { SettingsProvider } from '@/lib/settings';
import { ContentProvider } from '@/lib/contentContext';

export const metadata = {
  title: 'Tattv.AI — Student Technical Club',
  description: 'A student-driven technical club fostering innovation in AI/ML, Web Development, and Android Development. Join us to learn, build, and grow.',
  keywords: ['Tattv.AI', 'Technical Club', 'AI', 'Machine Learning', 'Web Development', 'Android', 'Student Club'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          <AuthProvider>
            <ContentProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </ContentProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
