import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Blog from '@/components/Blog';
import Photography from '@/components/Photography';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { getRecentPosts } from '@/lib/blog';

export default function Home() {
  const recentPosts = getRecentPosts(3);

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <Blog posts={recentPosts} />
      <Photography />
      <Contact />
      <Footer />
    </main>
  );
}
