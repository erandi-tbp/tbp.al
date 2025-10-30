# Settings System Guide

## Overview

This project uses a flexible **key-value store** for settings, similar to WordPress. No database schema changes are needed when adding new settings!

## Architecture

- **Database Collection**: `settings`
- **Structure**:
  - `settingsKey` (string, unique) - The setting identifier
  - `settingsValue` (string) - The setting value (auto-converts JSON for objects/arrays)
- **Helper**: `src/helpers/settingsHelper.js`
- **Context**: `src/contexts/SettingsContext.jsx`

## How to Add a New Setting

### 1. Add Setting Key Constant

Edit `src/helpers/settingsHelper.js` and add your new key to the `SETTING_KEYS` object:

```javascript
export const SETTING_KEYS = {
  // ... existing keys

  // Your new setting
  MY_NEW_SETTING: 'myNewSetting',
};
```

### 2. Add UI in Settings Page

Edit `src/pages/admin/settings/GeneralSettingsPage.jsx`:

**a) Add state:**
```javascript
const [myNewSetting, setMyNewSetting] = useState('');
```

**b) Load in `loadSettings()`:**
```javascript
setMyNewSetting(settings[SETTING_KEYS.MY_NEW_SETTING] || '');
```

**c) Save in `handleSubmit()`:**
```javascript
await Promise.all([
  // ... existing settings
  setSetting(SETTING_KEYS.MY_NEW_SETTING, myNewSetting),
]);
```

**d) Add UI field:**
```jsx
<div>
  <label className="block text-sm font-body font-bold text-text-primary mb-2">
    My New Setting
  </label>
  <input
    type="text"
    value={myNewSetting}
    onChange={(e) => setMyNewSetting(e.target.value)}
    placeholder="Enter value"
    className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
  />
</div>
```

### 3. Use Setting in Your App

```javascript
import { useSettings } from '../../hooks/useSettings';

function MyComponent() {
  const { settings } = useSettings();

  // Access your setting
  const myValue = settings?.myNewSetting;

  return <div>{myValue}</div>;
}
```

## Data Types

### String (default)
```javascript
setSetting('websiteName', 'TBP.AL');
// Stored as: "TBP.AL"
// Retrieved as: "TBP.AL"
```

### Boolean
```javascript
setSetting('maintenanceEnabled', true);
// Stored as: "true"
// Retrieved as: true (auto-parsed)
```

### Array/Object (JSON)
```javascript
setSetting('maintenanceContacts', [
  { label: 'Email', value: 'info@example.com' },
  { label: 'Phone', value: '+1234567890' }
]);
// Stored as: JSON string
// Retrieved as: Array (auto-parsed)
```

## Helper Functions

### Get All Settings
```javascript
import { getAllSettings } from '../helpers/settingsHelper';

const settings = await getAllSettings();
// Returns: { websiteName: 'TBP.AL', maintenanceEnabled: false, ... }
```

### Get Single Setting
```javascript
import { getSetting } from '../helpers/settingsHelper';

const value = await getSetting('websiteName', 'Default Name');
// Returns: 'TBP.AL' or 'Default Name' if not found
```

### Set/Update Setting
```javascript
import { setSetting } from '../helpers/settingsHelper';

await setSetting('websiteName', 'New Name');
// Creates if doesn't exist, updates if exists
```

### Set Multiple Settings
```javascript
import { setMultipleSettings } from '../helpers/settingsHelper';

await setMultipleSettings({
  websiteName: 'TBP.AL',
  email: 'info@tbp.al',
  phone: '+1234567890'
});
```

### Delete Setting
```javascript
import { deleteSetting } from '../helpers/settingsHelper';

await deleteSetting('myOldSetting');
```

## Examples

### Example 1: Simple Text Setting

```javascript
// 1. Add to SETTING_KEYS
COMPANY_SLOGAN: 'companySlogan'

// 2. In GeneralSettingsPage.jsx
const [companySlogan, setCompanySlogan] = useState('');

// Load:
setCompanySlogan(settings[SETTING_KEYS.COMPANY_SLOGAN] || '');

// Save:
setSetting(SETTING_KEYS.COMPANY_SLOGAN, companySlogan)

// UI:
<input
  type="text"
  value={companySlogan}
  onChange={(e) => setCompanySlogan(e.target.value)}
/>
```

### Example 2: Boolean Toggle

```javascript
// 1. Add to SETTING_KEYS
SHOW_CHAT_WIDGET: 'showChatWidget'

// 2. In GeneralSettingsPage.jsx
const [showChatWidget, setShowChatWidget] = useState(false);

// Load (handle string/boolean):
const chatValue = settings[SETTING_KEYS.SHOW_CHAT_WIDGET];
setShowChatWidget(chatValue === 'true' || chatValue === true);

// Save (convert to string):
setSetting(SETTING_KEYS.SHOW_CHAT_WIDGET, showChatWidget.toString())

// UI (Toggle):
<label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    checked={showChatWidget}
    onChange={(e) => setShowChatWidget(e.target.checked)}
    className="sr-only peer"
  />
  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-accent after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
</label>
```

### Example 3: Array/Object (Social Links)

```javascript
// 1. Add to SETTING_KEYS
SOCIAL_LINKS: 'socialLinks'

// 2. In GeneralSettingsPage.jsx
const [socialLinks, setSocialLinks] = useState([]);

// Load:
const linksValue = settings[SETTING_KEYS.SOCIAL_LINKS];
if (Array.isArray(linksValue)) {
  setSocialLinks(linksValue);
} else if (typeof linksValue === 'string') {
  setSocialLinks(JSON.parse(linksValue));
} else {
  setSocialLinks([]);
}

// Save:
setSetting(SETTING_KEYS.SOCIAL_LINKS, JSON.stringify(socialLinks))

// Add/Remove functions:
const addLink = () => {
  setSocialLinks([...socialLinks, { platform: '', url: '' }]);
};

const removeLink = (index) => {
  setSocialLinks(socialLinks.filter((_, i) => i !== index));
};

const updateLink = (index, field, value) => {
  const updated = [...socialLinks];
  updated[index][field] = value;
  setSocialLinks(updated);
};

// UI (Repeater):
<div>
  <button onClick={addLink}>Add Social Link</button>
  {socialLinks.map((link, index) => (
    <div key={index}>
      <input
        value={link.platform}
        onChange={(e) => updateLink(index, 'platform', e.target.value)}
        placeholder="Facebook"
      />
      <input
        value={link.url}
        onChange={(e) => updateLink(index, 'url', e.target.value)}
        placeholder="https://facebook.com/..."
      />
      <button onClick={() => removeLink(index)}>Remove</button>
    </div>
  ))}
</div>
```

## Benefits

✅ **No Schema Changes** - Add settings without modifying database structure
✅ **Type Flexible** - Supports strings, booleans, arrays, objects (auto JSON handling)
✅ **Easy to Use** - Simple helper functions for CRUD operations
✅ **Unique Keys** - Database-level unique constraint prevents duplicates
✅ **Context Available** - Settings available globally via `useSettings()` hook

## Migration Script

If you need to reset/recreate the settings collection:

```bash
node scripts/migrate-settings-to-key-value.js
```

This will:
1. Backup existing settings
2. Delete old collections
3. Create new key-value structure
4. Migrate/restore data
5. Create default settings

## Notes

- Settings are cached in React context - use `refreshSettings()` to reload
- All settings have read permission for "any", write permission for "users"
- The `settingsHelper` automatically handles JSON stringify/parse
- Boolean values are stored as strings ("true"/"false") but auto-parsed on retrieval
