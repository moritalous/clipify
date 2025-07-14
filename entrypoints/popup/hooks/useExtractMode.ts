import { useState } from 'react';

export function useExtractMode() {
  const [useReadability, setUseReadability] = useState(true);

  const toggleMode = () => {
    setUseReadability(!useReadability);
  };

  return {
    useReadability,
    setUseReadability,
    toggleMode,
    modeName: useReadability ? 'Smart Extract' : 'Semantic HTML',
  };
}
