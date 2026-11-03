// CONTROLLER (SSR) de Produto — traduz HTTP <-> views (res.render + PRG).
// O formulário de produto tem um <select> de categorias, então o método que
// mostra o formulário precisa BUSCAR a lista de categorias e enviá-la à view
// (e também ao reexibir o form quando a validação falhar).
//
// Ações:
//   - index (GET /produtos)      -> listagem (mostrando a categoria de cada produto);
//   - novo  (GET /produtos/novo) -> formulário vazio + lista de categorias;
//   - criar (POST /produtos)     -> cria e redireciona; erro 4xx reexibe o form.
export class ProdutosController {
  constructor(produtosService, categoriasService) {
    this.service = produtosService;
    this.categoriasService = categoriasService; // para montar o <select> de categorias
    this.index = this.index.bind(this);
    this.novo = this.novo.bind(this);
    this.criar = this.criar.bind(this);
  }

  async index(req, res, next) {
    try {
      res.render('produtos/index', { titulo: 'Produtos', produtos: await this.service.listar() });
    } catch (err) { next(err); }
  }

  async novo(req, res, next) {
    try {
      res.render('produtos/form', { titulo: 'Novo Produto', valores: {}, erros: [], categorias: await this.categoriasService.listar() });
    } catch (err) { next(err); }
  }

  async criar(req, res, next) {
    try {
      await this.service.criar(req.body);
      req.flash('sucesso', 'Produto criado com sucesso.');
      res.redirect('/produtos');
    } catch (err) {
      if (err.status && err.status < 500) {
        try {
          return res.status(err.status).render('produtos/form', {
            titulo: 'Novo Produto', valores: req.body, erros: [err.message],
            categorias: await this.categoriasService.listar(),
          });
        } catch (e) { return next(e); }
      }
      next(err);
    }
  }
}
