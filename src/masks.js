import React from 'react'
import MaskedInput from "react-text-mask"

const BirthInput = ({ inputRef, ...props }) => (
  <MaskedInput
    {...props}
    ref={ref => {
      inputRef(ref ? ref.inputElement : null);
    }}
    mask={[/[0-9]/, /\d/, "/", /[0-9]/, /\d/, "/", /[0-9]/, /\d/, /\d/, /\d/]}
  />
);

const PhoneInput = ({ inputRef, ...props }) => (
  <MaskedInput
    {...props}
    ref={ref => {
      inputRef(ref ? ref.inputElement : null);
    }}
    mask={[
      "(",
      /[1-9]/,
      /\d/,
      ")",
      " ",
      /\d/,
      /\d/,
      /\d/,
      " ",
      /\d/,
      /\d/,
      /\d/,
      " ",
      /\d/,
      /\d/,
      /\d/
    ]}
  />
);

const IdInput = ({ inputRef, ...props }) => (
  <MaskedInput
    {...props}
    ref={ref => {
      inputRef(ref ? ref.inputElement : null);
    }}
    mask={[
      /[0-9]/,
      /\d/,
      /\d/,
      ".",
      /[0-9]/,
      /\d/,
      /\d/,
      ".",
      /[0-9]/,
      /\d/,
      /\d/,
      "-",
      /[0-9]/,
      /\d/
    ]}
  />
);

const CnpjInput = ({ inputRef, ...props }) => (
  <MaskedInput
    {...props}
    ref={ref => {
      inputRef(ref ? ref.inputElement : null);
    }}
    mask={[
      /[0-9]/,
      /\d/,
      ".",
      /[0-9]/,
      /\d/,
      /\d/,
      ".",
      /[0-9]/,
      /\d/,
      /\d/,
      "/",
      /[0-9]/,
      /\d/,
      /\d/,
      /\d/,
      "-",
      /[0-9]/,
      /\d/
    ]}
  />
);

const PriceInput = ({ inputRef, ...props }) => (
  <MaskedInput
    {...props}
    ref={ref => {
      inputRef(ref ? ref.inputElement : null);
    }}
    mask={[/[1-9]/, /\d/, /\d/]}
  />
);

const ZipInput = ({ inputRef, ...props }) => (
  <MaskedInput
    {...props}
    ref={ref => {
      inputRef(ref ? ref.inputElement : null);
    }}
    mask={[/[0-9]/, /\d/, /[0-9]/, /\d/, /\d/, "-", /[0-9]/, /\d/, /\d/]}
  />
);

export { PhoneInput, CnpjInput, BirthInput, IdInput, PriceInput, ZipInput };