import { isValid as isValidCpf } from "@fnando/cpf"
import { isValid as isValidCnpj } from '@fnando/cnpj'
import moment from 'moment'

export default {
  nome: value =>
    value === "" || /^[A-zÀ-ÿ']+\s([A-zÀ-ÿ']\s?)*[A-zÀ-ÿ']+$/.test(value)
      ? ""
      : "não esqueça de preencher seu nome",
  rua: value =>
    value === "" || value.length > 5
      ? ""
      : "não esqueça de preencher seu endereço",
  numero: value =>
    value === "" || /^([1-9]?[0-9]?\.?[0-9]*(-| |\.)?[a-z|A-Z]?)$/.test(value)
      ? ""
      : "não esqueça de preencher o número de sua casa",
  bairro: value =>
    value === "" || value.length > 2
      ? ""
      : "não esqueça de preencher seu bairro",
  cep: value =>
    value === "" || /^[0-9]{2}.?[0-9]{3}-?[0-9]{3}$/.test(value)
      ? ""
      : "CEP inválido",
  nascimento: value =>
    value === "" ||
    moment(value, "DD/MM/YYYY", true).isSameOrBefore(
      moment.utc().subtract(18, "years")
    ) ||
    moment(value, "DD/MM/YY", true).isSameOrBefore(
      moment.utc().subtract(18, "years")
    )
      ? ""
      : "você deve ter pelo menos 18 anos",
  celular: value =>
    value === "" ||
    /^(\(?0?([1-9]{2})(\)| |-)?( |-)?[0-9]{3}( |-)?[0-9]{2}-?[0-9]( |-)?[0-9]{3})$/.test(
      value
    )
      ? ""
      : "utilize um número de telefone brasileiro com DDD",
  cpf: value => (value === "" || isValidCpf(value) ? "" : "CPF inválido"),
  cnpj: value => (value === "" || isValidCnpj(value) ? "" : "CNPJ inválido"),
  email: value =>
    value === "" ||
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    )
      ? ""
      : "Por favor, insira um endereço de e-mail válido",
  senha: value =>
    value === "" ||
    /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/.test(value)
      ? ""
      : "A senha deve conter 6-20 caracters, ao menos uma letra maiúscula/minúscula e ao menos um caractere especial",
  valor: value =>
    value === "" || value > 149
      ? ""
      : "O valor mínimo é de 150 reais",
  comodos: value =>
    value === "" || value > 0
      ? ""
      : "Por favor informe o número de cômodos"
}