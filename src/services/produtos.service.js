import { AppError } from '../utils/appError.js';

// SERVIÇO de Produto — REGRAS DE NEGÓCIO (inclui a regra que depende da Categoria).
// Lance `new AppError(mensagem, status)` quando uma regra for violada.
//
// Regras ao criar:
//   - o nome é OBRIGATÓRIO;
//   - o preço deve ser um número MAIOR que zero;
//   - a categoria informada precisa EXISTIR (regra do relacionamento 1-N) —
//     se não existir, rejeite (ex.: 422).
// Observação: preço chega do formulário como texto — converta para número antes.
// Métodos: criar e listar.
export class ProdutosService {
  constructor(produtosRepository, categoriasRepository) {
    this.repo = produtosRepository;
    this.categoriasRepo = categoriasRepository; // para checar se a categoria existe
  }
  async criar({ nome, preco, categoriaId }) {
    if (!nome || !String(nome).trim()) throw new AppError('O nome é obrigatório.', 400);
    const precoNum = Number(String(preco).replace(',', '.'));
    if (!Number.isFinite(precoNum) || precoNum <= 0) throw new AppError('O preço deve ser maior que zero.', 400);
    const catId = Number(categoriaId);
    const categoria = Number.isInteger(catId) ? await this.categoriasRepo.buscarPorId(catId) : null;
    if (!categoria) throw new AppError('A categoria informada não existe.', 422);
    return this.repo.criar({ nome: String(nome).trim(), preco: precoNum, categoriaId: catId });
  }
  listar() {
    return this.repo.listar();
  }
}