/**
 * Sealed secrets (format: sealedSecret) must render as a password box and must never be
 * prefilled. Both matter: a visible text input would show the stored secret, and any seeded
 * value would put ciphertext into the DOM.
 */
import React from 'react';

import type { PydanticFormField } from 'pydantic-forms';
import { PydanticFormFieldFormat, PydanticFormFieldType } from 'pydantic-forms';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { WfoPassword } from './WfoPassword';

const field = {
  id: 'password',
  type: PydanticFormFieldType.STRING,
  format: 'sealedSecret' as PydanticFormFieldFormat,
  title: 'Password',
  validations: {},
  attributes: {},
} as unknown as PydanticFormField;

const props = { pydanticFormField: field, value: '', onChange: jest.fn(), onBlur: jest.fn(), name: 'password' };

describe('WfoPassword', () => {
  it('renders a masked password input', () => {
    render(<WfoPassword {...props} />);

    const input = screen.getByTestId('password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('does not offer browser autofill for the credential', () => {
    render(<WfoPassword {...props} />);

    expect(screen.getByTestId('password')).toHaveAttribute('autocomplete', 'new-password');
  });

  it('is empty when no value is supplied', () => {
    render(<WfoPassword {...props} />);

    expect(screen.getByTestId('password')).toHaveValue('');
  });

  it('emits the typed value on change', () => {
    const onChange = jest.fn();
    render(<WfoPassword {...props} onChange={onChange} />);

    fireEvent.change(screen.getByTestId('password'), { target: { value: 'new-secret' } });
    expect(onChange).toHaveBeenCalledWith('new-secret');
  });
});
