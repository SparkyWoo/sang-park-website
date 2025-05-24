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
  const recentPosts = getRecentPosts(6);

  return (
    <main className="min-h-screen">
      <Navigation />
      <section id="hero" data-section="hero">
        <Hero />
      </section>
      <section id="about" data-section="about">
        <About />
      </section>
      <section id="projects" data-section="projects">
        <Projects />
      </section>
      <section id="blog" data-section="blog">
        <Blog posts={recentPosts} />
      </section>
      <section id="photography" data-section="photography">
        <Photography />
      </section>
      <section id="contact" data-section="contact">
        <Contact />
      </section>
      <Footer />
    </main>
  );
}
