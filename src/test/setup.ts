// Mock localStorage for node environment (jsdom provides its own)
if (typeof window === 'undefined') {
  const store: Record<string, string> = {};
  const localStorageMock = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  };
  // @ts-expect-error — global mock in node env
  global.localStorage = localStorageMock;
}
