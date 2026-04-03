const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('POST /cavaleiros', () => {
  const base = {
    id: 1,
    nome: 'Seiya',
    constelacao: 'Pégaso',
    nivel: 'BRONZE',
    cosmo: 85,
    dataNascimento: '2000-12-01',
    status: 'VIVO',
    armadura: { nome: 'Armadura de Pégaso', armaduraDivina: false },
    habilidades: ['Meteoro de Pégaso', 'Cometa de Pégaso']
  };

  it('happy path - deve criar cavaleiro válido', async () => {
    const res = await request(app).post('/cavaleiros').send({ ...base, id: 100 });
    expect(res.status).to.equal(201);
    expect(res.body.nome).to.equal('Seiya');
  });

  it('falha quando campo obrigatório ausente', async () => {
    const payload = { ...base };
    delete payload.nome;
    const res = await request(app).post('/cavaleiros').send(payload);
    expect(res.status).to.equal(400);
    expect(res.body.message).to.match(/Campo obrigatório/);
  });

  it('valida enums nivel e status', async () => {
    const p1 = { ...base, id: 101, nivel: 'LENDARIO' };
    const r1 = await request(app).post('/cavaleiros').send(p1);
    expect(r1.status).to.equal(400);
    expect(r1.body.message).to.match(/Nivel inválido/);

    const p2 = { ...base, id: 102, status: 'DESAPARECIDO' };
    const r2 = await request(app).post('/cavaleiros').send(p2);
    expect(r2.status).to.equal(400);
    expect(r2.body.message).to.match(/Status inválido/);
  });

  it('regras de cosmo por nivel', async () => {
    const pBronze = { ...base, id: 103, nivel: 'BRONZE', cosmo: 5 };
    const rB = await request(app).post('/cavaleiros').send(pBronze);
    expect(rB.status).to.equal(400);

    const pPrata = { ...base, id: 104, nivel: 'PRATA', cosmo: 40 };
    const rP = await request(app).post('/cavaleiros').send(pPrata);
    expect(rP.status).to.equal(400);

    const pOuro = { ...base, id: 105, nivel: 'OURO', cosmo: 70 };
    const rO = await request(app).post('/cavaleiros').send(pOuro);
    expect(rO.status).to.equal(400);
  });

  it('armadura divina regras', async () => {
    const p = { ...base, id: 106, nivel: 'OURO', cosmo: 89, armadura: { nome: 'Divina', armaduraDivina: true } };
    const r = await request(app).post('/cavaleiros').send(p);
    expect(r.status).to.equal(400);
    expect(r.body.message).to.match(/Armadura divina/);

    const p2 = { ...base, id: 107, nivel: 'PRATA', cosmo: 95, armadura: { nome: 'Divina', armaduraDivina: true } };
    const r2 = await request(app).post('/cavaleiros').send(p2);
    expect(r2.status).to.equal(400);
  });

  it('status MORTO regras', async () => {
    const p = { id: 200, nome: 'Soldado', constelacao: 'Aquila', nivel: 'BRONZE', status: 'MORTO', habilidades: [] };
    // missing habilidades non-empty - but also armadura omitted
    const r = await request(app).post('/cavaleiros').send(p);
    expect(r.status).to.equal(400);

    const p2 = { id: 201, nome: 'Soldado', constelacao: 'Aquila', nivel: 'BRONZE', status: 'MORTO', habilidades: ['Nada'], armadura: { nome: 'x' } };
    const r2 = await request(app).post('/cavaleiros').send(p2);
    expect(r2.status).to.equal(400);
  });

  it('data de nascimento invalida / futura / idade < 12', async () => {
    const pInvalid = { ...base, id: 108, dataNascimento: '2000-13-01' };
    const r1 = await request(app).post('/cavaleiros').send(pInvalid);
    expect(r1.status).to.equal(400);

    const future = new Date(); future.setFullYear(future.getFullYear() + 1);
    const fstr = future.toISOString().slice(0, 10);
    const pFuture = { ...base, id: 109, dataNascimento: fstr };
    const r2 = await request(app).post('/cavaleiros').send(pFuture);
    expect(r2.status).to.equal(400);

    const today = new Date(); today.setFullYear(today.getFullYear() - 10); // age 10
    const tstr = today.toISOString().slice(0, 10);
    const pYoung = { ...base, id: 110, dataNascimento: tstr };
    const r3 = await request(app).post('/cavaleiros').send(pYoung);
    expect(r3.status).to.equal(400);
  });

  it('não permite id duplicado', async () => {
    const p = { ...base, id: 300 };
    const r1 = await request(app).post('/cavaleiros').send(p);
    expect(r1.status).to.equal(201);
    const r2 = await request(app).post('/cavaleiros').send(p);
    expect(r2.status).to.equal(400);
  });

  it('falha se cosmo for negativo', async () => {
    const res = await request(app).post('/cavaleiros').send({ ...base, id: 403, cosmo: -10 });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.match(/Cosmo deve ser número >= 0/);

  });

  it('falha se nome tiver mais de 50 caracteres', async () => {
    const nomeLongo = 'A'.repeat(51);
    const res = await request(app).post('/cavaleiros').send({ ...base, id: 401, nome: nomeLongo });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.match(/Nome deve ter entre 2 e 50 caracteres/);
  });

  it('falha se constelação tiver mais de 20 caracteres', async () => {
    const constelacaoLonga = 'C'.repeat(21);
    const res = await request(app).post('/cavaleiros').send({ ...base, id: 402, constelacao: constelacaoLonga });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.match(/Constelação deve ter entre 4 e 20 caracteres/);
  });
});
