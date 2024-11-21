#!/bin/bash

# Create necessary directories
mkdir -p src/{components,contexts,hooks,navigation,services,stores,types,utils}/{auth,pets,health,documents}

# 1. Fix all type definitions
cat > src/types/index.ts << 'EOF'
export * from './auth';
export * from './pets';
export * from './health';
export * from './documents';
export * from './navigation';
