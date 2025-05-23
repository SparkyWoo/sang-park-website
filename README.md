# Sang Park - Personal Website

A modern, minimalist personal website built with Next.js, TypeScript, and Tailwind CSS. Inspired by clean design principles and focused on showcasing projects, blog posts, and photography.

## 🚀 Features

- **Modern Design**: Clean, minimalist dark theme with smooth animations
- **Responsive**: Fully responsive design that works on all devices
- **Blog System**: MDX-powered blog with reading time calculation
- **Photography Gallery**: Lightbox gallery for showcasing photography
- **Projects Showcase**: Dedicated section for highlighting products and projects
- **Performance Optimized**: Built with Next.js 15 and optimized for speed
- **SEO Ready**: Proper meta tags and structured data

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Blog**: MDX with gray-matter for frontmatter
- **Gallery**: yet-another-react-lightbox
- **Deployment**: Ready for Vercel

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── About.tsx          # About section
│   ├── Blog.tsx           # Blog section
│   ├── Contact.tsx        # Contact section
│   ├── Footer.tsx         # Footer component
│   ├── Hero.tsx           # Hero section with typing animation
│   ├── Navigation.tsx     # Navigation component
│   ├── Photography.tsx    # Photography gallery
│   └── Projects.tsx       # Projects showcase
├── content/               # Content files
│   └── blog/             # MDX blog posts
├── lib/                   # Utility functions
│   └── blog.ts           # Blog utilities
└── public/               # Static assets
    └── images/           # Images for projects and photography
```

## 🎨 Sections

### Hero
- Dynamic typing animation showcasing different roles
- Smooth scroll navigation
- Gradient text effects

### About
- Personal bio with placeholder content
- Skills and current focus
- Animated on scroll

### Projects
- Showcase of products like LeetProduct
- Project status indicators (Live, In Development, Concept)
- Technology tags
- Hover effects and animations

### Blog
- MDX-powered blog system
- Reading time calculation
- Tag system
- Responsive design

### Photography
- Grid-based gallery layout
- Lightbox for full-size viewing
- Hover effects
- Placeholder for actual photos

### Contact
- Social media links
- Email contact
- Animated social icons

## 📝 Adding Content

### Blog Posts

Create new blog posts in `src/content/blog/` with the following frontmatter:

```mdx
---
title: "Your Post Title"
excerpt: "A brief description of your post"
date: "2024-01-15"
tags: ["tag1", "tag2", "tag3"]
---

# Your Post Title

Your content here...
```

### Projects

Update the projects array in `src/components/Projects.tsx`:

```typescript
const projects = [
  {
    title: 'Your Project',
    description: 'Project description',
    tech: ['React', 'Node.js'],
    status: 'Live', // 'Live', 'In Development', or 'Concept'
    link: 'https://yourproject.com',
    image: '/images/projects/your-project.jpg'
  }
];
```

### Photography

Add your photos to `public/images/photography/` and update the photos array in `src/components/Photography.tsx`.

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sang-park-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build and Deploy

### Build for production
```bash
npm run build
```

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

## 🎨 Customization

### Colors and Theme
Update the color scheme in `src/app/globals.css` and Tailwind configuration.

### Typography
Modify font settings in `src/app/layout.tsx` and global styles.

### Animations
Customize Framer Motion animations in individual components.

### Content
- Update personal information in components
- Replace placeholder content with your own
- Add your own images and projects

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## ⚡ Performance

- Optimized images with Next.js Image component
- Code splitting with dynamic imports
- Minimal bundle size
- Fast loading times

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Sections

1. Create a new component in `src/components/`
2. Import and add to `src/app/page.tsx`
3. Update navigation in `src/components/Navigation.tsx`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ by Sang Park
