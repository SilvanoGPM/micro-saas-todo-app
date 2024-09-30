'use client';

import { useEffect } from 'react';

import { enableMSW } from '.';

export function EnableMSW() {
  useEffect(() => {
    enableMSW();
  }, []);

  return null;
}
