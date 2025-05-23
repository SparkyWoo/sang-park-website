# Photography Section Setup

## How to Add Your Photos

1. **Download photos from your Flickr**: Go to https://www.flickr.com/photos/69237709@N05/
2. **Save photos in this directory** with these filenames:
   - `photo-1.jpg`
   - `photo-2.jpg` 
   - `photo-3.jpg`
   - `photo-4.jpg`
   - `photo-5.jpg`
   - `photo-6.jpg`

3. **Update photo details** in `src/components/Photography.tsx`:
   - Change the `title` and `location` for each photo
   - Add more photos by adding new objects to the `photos` array

## Recommended Image Specs
- **Format**: JPG or PNG
- **Size**: 1200x1200px (square aspect ratio works best)
- **Quality**: High quality but optimized for web (under 500KB each)

## Adding More Photos
To add more than 6 photos, edit the `photos` array in `Photography.tsx`:

```javascript
{
  src: '/images/photography/photo-7.jpg',
  alt: 'Photography by Sang Park',
  title: 'Your Photo Title',
  location: 'Photo Location'
}
```

The component will automatically display them in the grid layout with lightbox functionality. 