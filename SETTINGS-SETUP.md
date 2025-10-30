# Settings & SEO Setup Guide

## What's Been Implemented

### 1. Settings System
- **Settings Collection** in Appwrite (schema added to setup script)
- **Settings Page** with card grid layout
- **General Settings Page** with two sections:
  - **Branding Section**: Logo (Light/Dark), Favicon, Website Name
  - **General Information Section**: TAX ID, Email, Phone, Address fields
- File upload functionality for logos and favicon
- Auto-save to Appwrite database

### 2. SEO System
- **react-helmet-async** package installed
- **SEO Component** (`/src/components/common/SEO.jsx`) for managing meta tags
- **HelmetProvider** wrapping the entire app
- Example usage in HomePage and GeneralSettingsPage

## Required Setup Steps

### Step 1: Create Settings Collection in Appwrite

Run the database setup script to create the settings collection:

```bash
npm run setup:db
```

This will create the `settings` collection with all required fields:
- Branding: logoLight, logoDark, favicon, websiteName
- General Info: taxId, email, phone, addressStreet, addressCity, addressCountry, addressZip

### Step 2: Create Storage Bucket in Appwrite

You need to create a storage bucket for settings assets (logos, favicon):

1. Go to your Appwrite Console: https://fra.cloud.appwrite.io/console
2. Navigate to **Storage**
3. Click **Create Bucket**
4. Set the following:
   - **Bucket ID**: `settings-assets`
   - **Bucket Name**: Settings Assets
   - **Permissions**:
     - Read: `Any`
     - Create: `Users`
     - Update: `Users`
     - Delete: `Users`
5. **File Extensions**: Allow images (jpg, jpeg, png, gif, svg, ico, webp)
6. **Max File Size**: 5MB recommended
7. Click **Create**

### Step 3: Test the Settings Page

1. Navigate to `/admin/settings` in your admin panel
2. Click on "General Settings" card
3. Fill in the branding and general information
4. Upload logos and favicon
5. Click "Save Settings"

## Using the SEO Component

Add SEO to any page by importing and using the SEO component:

```jsx
import { SEO } from '../../components/common/SEO';

export const MyPage = () => {
  return (
    <>
      <SEO
        title="Page Title"
        description="Page description for search engines"
        keywords="keyword1, keyword2, keyword3"
        ogImage="/path/to/social-share-image.jpg"
        noIndex={false} // Set to true for admin pages
      />
      {/* Your page content */}
    </>
  );
};
```

### SEO Component Props:

- `title`: Page title (will append " - Trusted Business Partners")
- `description`: Meta description for search engines
- `keywords`: SEO keywords (comma-separated)
- `ogTitle`: Custom Open Graph title (optional, defaults to title)
- `ogDescription`: Custom OG description (optional, defaults to description)
- `ogImage`: Social media share image URL
- `twitterCard`: Twitter card type (default: "summary_large_image")
- `canonicalUrl`: Canonical URL for duplicate content
- `noIndex`: Prevent indexing by search engines (true for admin pages)
- `noFollow`: Prevent following links on this page

## Files Created/Modified

### New Files:
- `/src/components/admin/SettingsCard.jsx` - Card component for settings grid
- `/src/components/common/SEO.jsx` - SEO meta tag management
- `/src/pages/admin/GeneralSettingsPage.jsx` - General settings form
- `/SETTINGS-SETUP.md` - This documentation

### Modified Files:
- `/scripts/setup-database.js` - Added settings collection
- `/src/lib/appwrite.js` - Added Storage export
- `/src/main.jsx` - Added HelmetProvider
- `/src/pages/admin/SettingsPage.jsx` - Updated with grid layout
- `/src/pages/public/HomePage.jsx` - Added SEO component example
- `/src/router/index.jsx` - Added General Settings route

## Next Steps

After completing the setup steps above, you can:

1. Add more settings categories by adding cards to SettingsPage
2. Create additional settings pages (Security, Notifications, Integrations)
3. Add SEO component to all public pages
4. Fetch settings in your public site to display branding and contact info
5. Use uploaded logos in your site header/footer

## Notes

- The settings system stores only one document in the collection (singleton pattern)
- Images are stored in Appwrite Storage with file IDs saved to database
- SEO component automatically adds Open Graph and Twitter Card meta tags
- Admin pages have `noIndex={true}` to prevent search engine indexing
