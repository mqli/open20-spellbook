import { useEffect } from 'react';
import { useUIStore } from './stores/ui-store';
import { SpellLibraryLayout } from './components/layout/SpellLibraryLayout';

export function App() {
  const { theme } = useUIStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  return <SpellLibraryLayout />;
}
