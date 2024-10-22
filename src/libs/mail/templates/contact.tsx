import React from 'react';

import { Logo } from '$components/logo';

import { TemplateData } from '../templates';

import { Column, Row } from './core';

export default function ContactTemplate({
  title,
  message,
}: TemplateData<'contact'>) {
  return (
    <Row>
      <Column>
        <Logo />

        <h1 style={{ color: 'green' }} className="text-4xl">
          {title}
        </h1>

        <img src="/logo.png" alt="Teste" />

        <p className="text-red-500">{message}</p>

        <div className="flex items-center justify-center">
          <p className="text-primary">{message}</p>
        </div>
      </Column>
    </Row>
  );
}
