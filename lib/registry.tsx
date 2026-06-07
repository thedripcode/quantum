'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

/**
 * Styled-Components SSR registry for Next.js App Router.
 * Collects styles during the server render and injects them
 * into the <head> before the page reaches the client, preventing FOUC.
 */
export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    // Clear the collected tags so they are not re-injected on subsequent renders.
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  // On the client, render children without the style sheet collector.
  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
