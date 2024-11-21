#!/bin/bash

# Update tsconfig.json
cat > tsconfig.json << 'TSCONFIG'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "lib": ["es2020", "dom"],
    "jsx": "react-native",
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "babel.config.js"]
}
TSCONFIG

# Update base types
cat > src/types/index.ts << 'TYPES'
export * from './auth';
export * from './pets';
export * from './health';
export * from './documents';
export * from './navigation';
export * from './user';

export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}
TYPES

# Create error handling utility
cat > src/utils/errorHandling.ts << 'ERROR'
export const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};
ERROR

