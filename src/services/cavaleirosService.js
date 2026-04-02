const ApiError = require('../helpers/apiError');
const model = require('../models/cavaleirosModel');

function isValidDateString(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return false;
  const [y, m, dd] = s.split('-').map(Number);
  return d.getUTCFullYear() === y && d.getUTCMonth() + 1 === m && d.getUTCDate() === dd;
}

function calculateAge(birthDateStr) {
  const today = new Date();
  const b = new Date(birthDateStr);
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age;
}

function validateAndCreate(payload) {
  const body = payload || {};

  // Required fields unless status === 'MORTO'
  const requiredFields = ['id', 'nome', 'constelacao', 'nivel', 'cosmo', 'status', 'armadura', 'habilidades'];

  if (body.status !== 'MORTO') {
    for (const f of requiredFields) {
      if (body[f] === undefined || body[f] === null) {
        throw new ApiError(400, `Campo obrigatório ausente: ${f}`);
      }
    }
  } else {
    // status MORTO: cosmo can be omitted, armor must be null/empty/omitted
    if (body.armadura && Object.keys(body.armadura).length > 0) {
      throw new ApiError(400, 'Cavaleiro com status MORTO não deve possuir armadura');
    }
    // required minimal fields when MORTO
    const requiredWhenMorto = ['id', 'nome', 'constelacao', 'nivel', 'status', 'habilidades'];
    for (const f of requiredWhenMorto) {
      if (body[f] === undefined || body[f] === null) {
        throw new ApiError(400, `Campo obrigatório ausente para status MORTO: ${f}`);
      }
    }
  }

  const { id, nome, constelacao, nivel, cosmo, dataNascimento, status, armadura, habilidades } = body;

  // nome length
  if (typeof nome !== 'string' || nome.length < 2 || nome.length > 50) throw new ApiError(400, 'Nome deve ter entre 2 e 50 caracteres');

  // constelacao length
  if (typeof constelacao !== 'string' || constelacao.length < 4 || constelacao.length > 20) throw new ApiError(400, 'Constelação deve ter entre 4 e 20 caracteres');

  // enums
  const niveis = ['BRONZE', 'PRATA', 'OURO'];
  if (!niveis.includes(nivel)) throw new ApiError(400, 'Nivel inválido. Valores permitidos: BRONZE, PRATA, OURO');

  const statuses = ['VIVO', 'FERIDO', 'MORTO'];
  if (!statuses.includes(status)) throw new ApiError(400, 'Status inválido. Valores permitidos: VIVO, FERIDO, MORTO');

  // cosmo rules (if not MORTO)
  if (status !== 'MORTO') {
    if (typeof cosmo !== 'number' || cosmo < 0) throw new ApiError(400, 'Cosmo deve ser número >= 0');
    if (nivel === 'BRONZE' && cosmo < 10) throw new ApiError(400, 'BRONZE deve ter cosmo mínimo de 10');
    if (nivel === 'PRATA' && cosmo < 50) throw new ApiError(400, 'PRATA deve ter cosmo mínimo de 50');
    if (nivel === 'OURO' && cosmo < 80) throw new ApiError(400, 'OURO deve ter cosmo mínimo de 80');
  }

  // armadura divina rules
  if (armadura && armadura.armaduraDivina === true) {
    if (status === 'MORTO') throw new ApiError(400, 'Cavaleiro MORTO não pode ter armadura');
    if (cosmo < 90) throw new ApiError(400, 'Armadura divina exige cosmo >= 90');
    if (nivel !== 'OURO') throw new ApiError(400, 'Armadura divina exige nivel OURO');
  }

  // habilidades must be array
  if (!Array.isArray(habilidades) || habilidades.length === 0) throw new ApiError(400, 'Habilidades deve ser um array não-vazio');

  // dataNascimento validation if provided
  if (dataNascimento !== undefined && dataNascimento !== null) {
    if (!isValidDateString(dataNascimento)) throw new ApiError(400, 'Data de nascimento inválida. Use YYYY-MM-DD');
    const birth = new Date(dataNascimento);
    const now = new Date();
    if (birth.getTime() > now.getTime()) throw new ApiError(400, 'Data de nascimento não pode ser futura');
    const age = calculateAge(dataNascimento);
    if (age < 12) throw new ApiError(400, 'Cavaleiro deve ter idade mínima de 12 anos');
  }

  // Check uniqueness of id
  if (model.existsById(id)) throw new ApiError(400, 'ID já cadastrado');

  // Save
  model.add(body);

  return body;
}

module.exports = {
  validateAndCreate,
  // exported for unit tests
  _internals: { isValidDateString, calculateAge }
};
