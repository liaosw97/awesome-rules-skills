---
name: sveltekit-tailwind-typescript-guide-imports-aliasing-en
description: Use when working with SvelteKit — imports aliasing, $lib path aliases
---

- 在适用的地方使用别名导入（在 svelte.config.js 中定义）：
    typescript
    import SomeComponent from '$lib/components/SomeComponent.svelte';
    import { someUtil } from '$lib/utils';
